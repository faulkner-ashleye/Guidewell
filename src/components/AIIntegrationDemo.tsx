import React, { useState, useEffect } from 'react';
import { useAppState } from '../state/AppStateContext';
import { aiIntegrationService, AIAnalysisResult } from '../services/aiIntegrationService';
import { EnhancedUserProfile } from '../data/enhancedUserProfile';
import { UserProfileUtils } from '../data/enhancedUserProfile';
import { Goal as AppGoal } from '../app/types';
import { Card } from './Card';
import { Button } from './Button';
import { Icon } from './Icon';
import './AIIntegrationDemo.css';

interface AIIntegrationDemoProps {
  onClose?: () => void;
}

export function AIIntegrationDemo({ onClose }: AIIntegrationDemoProps) {
  const { userProfile, accounts = [], goals = [] } = useAppState();
  
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiHealth, setAiHealth] = useState<{ status: string; configured: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    generateAIAnalysis();
  }, []);

  const checkAIHealth = async () => {
    try {
      const health = await aiIntegrationService.checkAIHealth();
      setAiHealth(health);
    } catch (error) {
      console.error('Health check failed:', error);
      setAiHealth({ status: 'error', configured: false });
    }
  };

  const generateAIAnalysis = async () => {
    if (!enhancedUserProfile || accounts.length === 0) {
      setError('Please connect accounts and complete your profile first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const analysis = await aiIntegrationService.generateAIAnalysisWithAPI(
        enhancedUserProfile,
        accounts,
        convertedGoals,
        'comprehensive'
      );
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('AI Analysis failed:', error);
      setError('Failed to generate AI analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setLoading(true);

    // Add user message to chat
    const newMessages = [...chatMessages, { role: 'user' as const, content: userMessage, timestamp: new Date() }];
    setChatMessages(newMessages);

    try {
      const response = await aiIntegrationService.sendChatMessage(
        userProfile?.firstName || 'demo-user',
        userMessage,
        enhancedUserProfile,
        accounts
      );

      // Add AI response to chat
      setChatMessages(prev => [...prev, { 
        role: 'assistant' as const, 
        content: response.response, 
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

  return (
    <div className="ai-integration-demo">
      <div className="demo-header">
        <h1>AI Integration Demo</h1>
        <div className="ai-status">
          <div className={`status-indicator ${aiHealth?.configured ? 'connected' : 'disconnected'}`}>
            {aiHealth?.configured ? '🤖 AI Connected' : '⚠️ AI Offline'}
          </div>
          {aiHealth?.configured && (
            <div className="status-details">
              <small>Using ChatGPT 4 Mini • Cached responses enabled</small>
            </div>
          )}
        </div>
        {onClose && (
          <Button variant="text" onClick={onClose} className="close-button">
            <Icon name="close" size="sm" />
          </Button>
        )}
      </div>

      <div className="demo-content">
        {/* AI Analysis Section */}
        <Card className="analysis-card">
          <h2>AI Financial Analysis</h2>
          {loading && !aiAnalysis ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Generating AI analysis...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <Button onClick={generateAIAnalysis}>Try Again</Button>
            </div>
          ) : aiAnalysis?.aiResponse ? (
            <div className="ai-analysis">
              <div className="analysis-summary">
                <h3>AI Summary</h3>
                <p>{aiAnalysis.aiResponse.summary}</p>
                {aiAnalysis.aiResponse.cached && (
                  <div className="cached-indicator">📋 Cached Response</div>
                )}
                {aiAnalysis.aiResponse.fallback && (
                  <div className="fallback-indicator">🔄 Fallback Response</div>
                )}
              </div>

              <div className="ai-recommendations">
                <h3>AI Recommendations</h3>
                <ul>
                  {aiAnalysis.aiResponse.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="next-step">
                <h3>Next Step</h3>
                <p>{aiAnalysis.aiResponse.nextStep}</p>
              </div>

              <div className="motivation">
                <h3>Motivation</h3>
                <p>{aiAnalysis.aiResponse.motivation}</p>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No analysis available. Generate one to get started!</p>
              <Button onClick={generateAIAnalysis}>Generate Analysis</Button>
            </div>
          )}
        </Card>

        {/* Chat Interface */}
        <Card className="chat-card">
          <h2>AI Chat Assistant</h2>
          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <div className="chat-empty">
                <p>Ask me anything about your finances! 💬</p>
                <div className="suggested-questions">
                  <Button 
                    variant="outline" 
                    size="small" 
                    onClick={() => setChatInput("How can I improve my credit score?")}
                  >
                    How can I improve my credit score?
                  </Button>
                  <Button 
                    variant="outline" 
                    size="small" 
                    onClick={() => setChatInput("What's the best way to save for retirement?")}
                  >
                    What's the best way to save for retirement?
                  </Button>
                  <Button 
                    variant="outline" 
                    size="small" 
                    onClick={() => setChatInput("Should I pay off debt or invest first?")}
                  >
                    Should I pay off debt or invest first?
                  </Button>
                </div>
              </div>
            ) : (
              chatMessages.map((message, index) => (
                <div key={index} className={`chat-message ${message.role}`}>
                  <div className="message-content">
                    {message.content}
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
              onClick={sendChatMessage}
              disabled={!chatInput.trim() || loading}
            >
              Send
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}