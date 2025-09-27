import React, { useState, useEffect } from 'react';
import { useAppState } from '../state/AppStateContext';
import { aiIntegrationService } from '../services/aiIntegrationService';
import { EnhancedUserProfile } from '../data/enhancedUserProfile';
import { UserProfileUtils } from '../data/enhancedUserProfile';
import { Goal as AppGoal } from '../app/types';
import { Button } from './Button';
import { Icon, IconNames } from './Icon';

interface AIChatSheetProps {
  open: boolean;
  onClose: () => void;
}

export function AIChatSheet({ open, onClose }: AIChatSheetProps) {
  const { userProfile, accounts = [], goals = [] } = useAppState();
  
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiHealth, setAiHealth] = useState<{ status: string; configured: boolean } | null>(null);

  // Convert AppGoal to data Goal type
  const convertedGoals = React.useMemo(() => {
    return goals.map((goal: AppGoal) => ({
      id: goal.id,
      name: goal.name,
      type: goal.type === 'savings' ? 'emergency_fund' :
            goal.type === 'debt' ? 'debt_payoff' :
            goal.type as 'debt_payoff' | 'emergency_fund' | 'retirement' | 'investment' | 'custom',
      accountId: goal.accountId,
      accountIds: goal.accountIds,
      target: goal.target,
      targetDate: goal.targetDate,
      monthlyContribution: goal.monthlyContribution,
      priority: goal.priority,
      note: goal.note,
      createdAt: goal.createdAt
    }));
  }, [goals]);

  // Create enhanced user profile
  const enhancedUserProfile = React.useMemo((): EnhancedUserProfile => {
    return UserProfileUtils.createEnhancedProfile(userProfile, accounts, convertedGoals);
  }, [userProfile, accounts, convertedGoals]);

  useEffect(() => {
    checkAIHealth();
  }, []);

  // Reset chat state when component unmounts or chat is closed
  useEffect(() => {
    if (!open) {
      setLoading(false);
      setChatInput('');
    }
  }, [open]);

  const checkAIHealth = async () => {
    try {
      const health = await aiIntegrationService.checkAIHealth();
      setAiHealth(health);
    } catch (error) {
      console.error('Health check failed:', error);
      setAiHealth({ status: 'error', configured: false });
    }
  };

  const sendChatMessage = async (message?: any) => {
    // Ensure message is a string
    const messageString = typeof message === 'string' ? message : String(message || '');
    const messageToSend = messageString || chatInput.trim();
    
    console.log('sendChatMessage called with:', message, 'converted to:', messageToSend); // Debug log
    
    if (!messageToSend || loading) return; // Prevent multiple simultaneous requests

    setChatInput('');
    setLoading(true);

    // Add user message to chat
    const newMessages = [...chatMessages, { role: 'user' as const, content: messageToSend, timestamp: new Date() }];
    setChatMessages(newMessages);

    try {
      const response = await aiIntegrationService.sendChatMessage(
        userProfile?.firstName || 'demo-user',
        messageToSend,
        enhancedUserProfile,
        accounts
      );

      // Add AI response to chat
      console.log('AI Response:', response); // Debug log
      setChatMessages(prev => [...prev, { 
        role: 'assistant' as const, 
        content: response.response || 'No response received', 
        timestamp: new Date() 
      }]);
    } catch (error) {
      console.error('Chat failed:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant' as const, 
        content: "I'm having trouble connecting right now. Please try again in a moment! 😊", 
        timestamp: new Date() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  // Generate personalized suggested questions based on user data
  const generatePersonalizedQuestions = () => {
    const questions = [];
    
    // Analyze user's financial situation
    const hasDebt = accounts.some(account => account.type === 'credit_card' || account.type === 'loan');
    const hasSavings = accounts.some(account => account.type === 'savings');
    const hasInvestments = accounts.some(account => account.type === 'investment');
    const hasGoals = goals.length > 0;
    const hasHighAPR = accounts.some(account => account.apr && account.apr > 15);
    const hasLowAPR = accounts.some(account => account.apr && account.apr < 10);
    const totalDebt = accounts
      .filter(account => account.type === 'credit_card' || account.type === 'loan')
      .reduce((sum, account) => sum + Math.abs(account.balance), 0);
    
    const isNewUser = accounts.length === 0 && goals.length === 0;
    
    // Handle new users with no data
    if (isNewUser) {
      questions.push(
        {
          text: "Welcome! Let's set up your financial goals together",
          question: "I'm new to financial planning. How should I get started?"
        },
        {
          text: "What's your biggest financial priority right now?",
          question: "What should be my first financial priority?"
        },
        {
          text: "Let's create a budget that works for your lifestyle",
          question: "How do I create a budget that I can actually stick to?"
        }
      );
      return questions;
    }
    
    // Generate questions based on financial profile
    if (hasHighAPR) {
      questions.push({
        text: "I see you have high-interest debt. How can I help you tackle it strategically?",
        question: "I have high-interest debt. What's the best strategy to pay it off quickly?"
      });
    }
    
    if (hasDebt && hasSavings) {
      questions.push({
        text: "Should you prioritize paying off debt or building savings?",
        question: "Should I prioritize paying off debt or building emergency savings?"
      });
    }
    
    if (hasGoals && goals.length > 0) {
      const goalTypes = goals.map(g => g.type);
      if (goalTypes.includes('debt')) {
        questions.push({
          text: "Let's optimize your debt payoff strategy for your goals",
          question: "How can I optimize my debt payoff strategy to reach my goals faster?"
        });
      }
      if (goalTypes.includes('savings') || goalTypes.includes('investment')) {
        questions.push({
          text: "Want to accelerate progress toward your savings goals?",
          question: "How can I accelerate my savings to reach my financial goals faster?"
        });
      }
    }
    
    if (!hasSavings && !hasInvestments) {
      questions.push({
        text: "Ready to start building wealth? Let's create a plan!",
        question: "I want to start building wealth. What's the best way to begin?"
      });
    }
    
    if (hasInvestments) {
      questions.push({
        text: "Let's review and optimize your investment strategy",
        question: "How can I optimize my current investment strategy?"
      });
    }
    
    if (hasLowAPR && totalDebt > 0) {
      questions.push({
        text: "Your debt has low interest rates. Should you invest instead?",
        question: "I have low-interest debt. Should I focus on investing instead of paying it off quickly?"
      });
    }
    
    // Add general personalized questions
    questions.push({
      text: "What's your biggest financial challenge right now?",
      question: "What's my biggest financial challenge and how can I tackle it?"
    });
    
    questions.push({
      text: "Let's create a personalized budget that works for you",
      question: "How can I create a budget that fits my lifestyle and goals?"
    });
    
    // Return top 3 most relevant questions
    return questions.slice(0, 3);
  };

  const personalizedQuestions = generatePersonalizedQuestions();
  
  // Debug: Log the generated questions
  console.log('Generated personalized questions:', personalizedQuestions);

  // Helper function to format message content with proper line breaks
  const formatMessageContent = (content: any) => {
    // Ensure content is a string
    const contentString = typeof content === 'string' ? content : String(content || '');
    
    return contentString
      .split('\n')
      .map((line, index) => (
        <span key={index}>
          {line}
          {index < contentString.split('\n').length - 1 && <br />}
        </span>
      ));
  };

  if (!open) return null;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet ai-chat" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <div className="chat-header-content">
            <h3>Ask Wellie</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="sheet-close">
            <Icon name="close" size="md" />
          </button>
        </div>
        
        <div className="chat-messages">
          {chatMessages.length === 0 ? (
            <div className="chat-empty">
              <p>Ask me anything about your finances! 💬</p>
              <div className="suggested-questions">
                {personalizedQuestions.map((questionObj, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    size="small" 
                    onClick={() => {
                      console.log('Button clicked, question object:', questionObj, 'question property:', questionObj.question);
                      const questionText = questionObj.question;
                      console.log('Question text to send:', questionText);
                      if (questionText) {
                        sendChatMessage(questionText);
                      } else {
                        console.error('Question text is undefined!', questionObj);
                      }
                    }}
                    style={{ marginBottom: '8px', textAlign: 'left' }}
                  >
                    {questionObj.text}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            chatMessages.map((message, index) => (
              <div key={index} className={`chat-message ${message.role}`}>
                <div className="message-content">
                  {formatMessageContent(message.content || '')}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="chat-message assistant">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="chat-input">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your finances..."
            disabled={loading}
          />
          <Button 
            variant="round"
            onClick={sendChatMessage}
            disabled={!chatInput.trim() || loading}
            aria-label="Send message"
          >
            <Icon name={IconNames.arrow_upward} size="md" />
          </Button>
        </div>
      </div>
    </div>
  );
}
