// Vercel serverless function for AI chat
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple conversation memory (in production, use a database)
const conversations = new Map();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, message, userProfile, accounts } = req.body;

    // Debug: Log the received data
    console.log('AI Chat API - Received data:');
    console.log('userId:', userId);
    console.log('message:', message);
    console.log('userProfile:', userProfile);
    console.log('accounts:', accounts);

    if (!userId || !message) {
      return res.status(400).json({ error: 'Missing userId or message' });
    }

    // Get or create conversation history
    let conversation = conversations.get(userId) || [];
    
    // Add user message
    conversation.push({ role: 'user', content: message });

    // Keep only last 10 messages to manage token usage
    if (conversation.length > 10) {
      conversation = conversation.slice(-10);
    }

    // Create system message with user context and preferences
    const aiPersonality = userProfile?.aiPersonality || 'encouraging';
    const communicationStyle = userProfile?.communicationStyle || 'concise';
    const detailLevel = userProfile?.detailLevel || 'medium';
    const preferredLanguage = userProfile?.preferredLanguage || 'simple';
    
    // Build personality instructions
    let personalityInstructions = '';
    switch (aiPersonality) {
      case 'encouraging':
        personalityInstructions = '- Encouraging and supportive\n- Optimistic but realistic\n- Uses motivational language and emojis appropriately';
        break;
      case 'analytical':
        personalityInstructions = '- Analytical and data-driven\n- Focused on facts and metrics\n- Provides detailed explanations\n- Uses precise language';
        break;
      case 'casual':
        personalityInstructions = '- Casual and friendly\n- Uses conversational language\n- Relatable and approachable\n- Less formal tone';
        break;
      case 'professional':
        personalityInstructions = '- Professional and formal\n- Uses business-appropriate language\n- Structured and clear\n- Authoritative tone';
        break;
    }
    
    // Build communication style instructions
    let styleInstructions = '';
    switch (communicationStyle) {
      case 'detailed':
        styleInstructions = 'Provide comprehensive explanations with context and background information, but keep responses focused and concise.';
        break;
      case 'concise':
        styleInstructions = 'Be direct and to the point. Avoid unnecessary elaboration. Keep responses brief and actionable.';
        break;
      case 'visual':
        styleInstructions = 'Use descriptive language and paint clear pictures of scenarios, but keep descriptions concise.';
        break;
    }
    
    // Build detail level instructions
    let detailInstructions = '';
    switch (detailLevel) {
      case 'high':
        detailInstructions = 'Include comprehensive details, examples, and step-by-step explanations, but keep responses concise and focused.';
        break;
      case 'medium':
        detailInstructions = 'Provide balanced detail with key points and practical examples. Keep responses reasonably brief.';
        break;
      case 'low':
        detailInstructions = 'Keep responses brief and focused on essential information only.';
        break;
    }
    
    // Build language instructions
    let languageInstructions = '';
    switch (preferredLanguage) {
      case 'simple':
        languageInstructions = 'Use simple, everyday language. Avoid jargon and technical terms.';
        break;
      case 'technical':
        languageInstructions = 'Use appropriate financial terminology and technical concepts.';
        break;
      case 'mixed':
        languageInstructions = 'Use a mix of simple explanations with technical terms when needed, always explaining complex concepts.';
        break;
    }

    const systemMessage = {
      role: 'system',
      content: `You are Guidewell's AI financial advisor. Your personality is:
${personalityInstructions}
- Always includes disclaimers about consulting professionals
- This is educational content only, not professional financial advice

Communication Preferences:
- ${styleInstructions}
- ${detailInstructions}
- ${languageInstructions}
- IMPORTANT: Keep all responses concise and focused. Avoid lengthy explanations unless specifically requested.

User Context:
- Name: ${userProfile?.firstName || 'User'}
- Income: $${userProfile?.income || 0}/year
- Risk Tolerance: ${userProfile?.riskTolerance || 'moderate'}
- Main Goals: ${userProfile?.mainGoals?.join(', ') || 'Not specified'}
- Financial Literacy: ${userProfile?.financialLiteracy || 'intermediate'}

Financial Accounts:
${accounts && accounts.length > 0 ? accounts.map(account => 
  `- ${account.name || 'Account'}: $${Math.abs(account.balance || 0).toLocaleString()} ${account.balance < 0 ? 'debt' : 'balance'} (${account.type || 'unknown'}${account.apr ? `, ${account.apr}% APR` : ''})`
).join('\n') : '- No accounts connected'}

Total Net Worth: $${accounts && accounts.length > 0 ? accounts.reduce((sum, account) => sum + (account.balance || 0), 0).toLocaleString() : '0'}

You have access to the user's actual financial data and can provide specific, personalized advice based on their real financial situation. Use this information to give relevant, actionable guidance.

Remember: This is educational content only, not professional financial advice.`
    };

    // Debug: Log the system message
    console.log('System message being sent to AI:', systemMessage.content);

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [systemMessage, ...conversation],
      max_tokens: 400,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Add AI response to conversation
    conversation.push({ role: 'assistant', content: aiResponse });
    conversations.set(userId, conversation);

    res.status(200).json({
      success: true,
      response: aiResponse,
      conversationId: userId
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    res.status(200).json({
      success: true,
      response: "I'm having trouble connecting right now, but I'm here to help! 😊 Please try again in a moment, or feel free to explore the other features while I get back online.",
      fallback: true
    });
  }
}
