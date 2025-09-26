// api/ai/chat.js - Chat/conversation endpoint
import OpenAI from 'openai';

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

    // Create system message with user context
    const systemMessage = {
      role: 'system',
      content: `You are Guidewell's AI financial advisor. Your personality is:
- Encouraging and supportive
- Optimistic but realistic
- Focused on actionable steps
- Uses emojis appropriately
- Speaks in simple, clear language
- Always includes disclaimers about consulting professionals

User Context:
- Name: ${userProfile?.firstName || 'User'}
- Income: $${userProfile?.income || 0}/year
- Risk Tolerance: ${userProfile?.riskTolerance || 'moderate'}
- Main Goals: ${userProfile?.mainGoals?.join(', ') || 'Not specified'}

Remember: This is educational content only, not professional financial advice.`
    };

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-mini',
      messages: [systemMessage, ...conversation],
      max_tokens: 300,
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
