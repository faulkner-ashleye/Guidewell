// Vercel serverless function for AI analysis
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory cache (in production, use Redis or similar)
const cache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

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
    const { userProfile, accounts, goals, analysisType = 'general' } = req.body;

    if (!userProfile || !accounts) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // Create cache key based on user data hash
    const cacheKey = `ai_analysis_${JSON.stringify({ userProfile, accounts, goals, analysisType })}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached AI analysis');
      return res.status(200).json({
        success: true,
        cached: true,
        ...cached.data
      });
    }

    // Generate AI analysis with encouraging tone
    const prompt = generateAnalysisPrompt(userProfile, accounts, goals, analysisType);
    
    console.log('🤖 Calling OpenAI API with model:', process.env.OPENAI_MODEL || 'gpt-3.5-turbo');
    console.log('📝 Prompt length:', prompt.length);
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are Guidewell's AI financial advisor. Your personality is:
- Encouraging and supportive
- Optimistic but realistic
- Focused on actionable steps
- Uses emojis appropriately
- Speaks in simple, clear language
- Always includes disclaimers about consulting professionals

Remember: This is educational content only, not professional financial advice.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    console.log('✅ OpenAI API call successful');

    const aiResponse = completion.choices[0].message.content;
    
    // Parse the response into structured data
    const analysis = parseAIResponse(aiResponse, analysisType);

    // Cache the result
    cache.set(cacheKey, {
      data: analysis,
      timestamp: Date.now()
    });

    res.status(200).json({
      success: true,
      cached: false,
      ...analysis
    });

  } catch (error) {
    console.error('❌ AI Analysis Error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type
    });
    
    // Return fallback analysis if API fails
    const fallbackAnalysis = generateFallbackAnalysis(req.body);
    
    res.status(200).json({
      success: true,
      cached: false,
      fallback: true,
      ...fallbackAnalysis
    });
  }
}

function generateAnalysisPrompt(userProfile, accounts, goals, analysisType) {
  const totalAssets = accounts
    .filter(a => ['checking', 'savings', 'investment'].includes(a.type))
    .reduce((sum, a) => sum + a.balance, 0);

  const totalDebt = accounts
    .filter(a => ['credit_card', 'loan', 'mortgage'].includes(a.type))
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  const netWorth = totalAssets - totalDebt;

  // Check if this is a strategy-specific analysis
  const isStrategyAnalysis = analysisType.startsWith('strategy_narrative_');
  
  if (isStrategyAnalysis) {
    const strategyName = analysisType.replace('strategy_narrative_', '').replace(/_/g, ' ');
    
    return `Create an encouraging, personalized financial narrative for a user following the "${strategyName}" strategy:

**User Profile:**
- Name: ${userProfile.firstName || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Income: $${userProfile.income || 0}/year
- Risk Tolerance: ${userProfile.riskTolerance || 'moderate'}
- Main Goals: ${userProfile.mainGoals?.join(', ') || 'Not specified'}

**Financial Summary:**
- Total Assets: $${totalAssets.toLocaleString()}
- Total Debt: $${totalDebt.toLocaleString()}
- Net Worth: $${netWorth.toLocaleString()}
- Emergency Fund: $${accounts.filter(a => a.type === 'savings').reduce((sum, a) => sum + a.balance, 0).toLocaleString()}

**Accounts:**
${accounts.map(acc => `- ${acc.name}: $${acc.balance.toLocaleString()} (${acc.type})`).join('\n')}

**Goals:**
${goals.map(goal => `- ${goal.name}: $${goal.target.toLocaleString()} by ${goal.targetDate}`).join('\n')}

**Strategy: ${strategyName}**

Create a personalized narrative that:
1. Acknowledges their current financial situation positively but vary your language - avoid repetitive phrases
2. Explains how the ${strategyName} strategy fits their goals with specific details about their accounts
3. Provides specific, actionable next steps tailored to their exact financial situation
4. Motivates them to stay on track using varied encouragement styles
5. Uses encouraging language with appropriate emojis but keep it natural and conversational
6. Reference their specific account names, balances, and goals to make it truly personalized
7. Vary your opening greetings and closing statements - don't use the same template every time

Format your response as JSON with these fields:
{
  "summary": "encouraging personalized summary here",
  "recommendations": ["specific rec1", "specific rec2", "specific rec3"],
  "nextStep": "one specific action they can take today",
  "motivation": "motivational closing message"
}`;
  }

  // Default analysis prompt for general analysis
  let prompt = `Analyze this financial situation and provide encouraging, actionable advice:

**User Profile:**
- Name: ${userProfile.firstName || 'User'}
- Age: ${userProfile.age || 'Not specified'}
- Income: $${userProfile.income || 0}/year
- Risk Tolerance: ${userProfile.riskTolerance || 'moderate'}
- Main Goals: ${userProfile.mainGoals?.join(', ') || 'Not specified'}

**Financial Summary:**
- Total Assets: $${totalAssets.toLocaleString()}
- Total Debt: $${totalDebt.toLocaleString()}
- Net Worth: $${netWorth.toLocaleString()}
- Emergency Fund: $${accounts.filter(a => a.type === 'savings').reduce((sum, a) => sum + a.balance, 0).toLocaleString()}

**Accounts:**
${accounts.map(acc => `- ${acc.name}: $${acc.balance.toLocaleString()} (${acc.type})`).join('\n')}

**Goals:**
${goals.map(goal => `- ${goal.name}: $${goal.target.toLocaleString()} by ${goal.targetDate}`).join('\n')}

**Analysis Type: ${analysisType}**

Please provide:
1. A brief encouraging summary (2-3 sentences)
2. Top 3 actionable recommendations
3. One specific next step they can take today
4. A motivational closing message

Format your response as JSON with these fields:
{
  "summary": "encouraging summary here",
  "recommendations": ["rec1", "rec2", "rec3"],
  "nextStep": "specific action they can take today",
  "motivation": "motivational closing message"
}`;

  return prompt;
}

function parseAIResponse(response, analysisType) {
  try {
    // Clean the response - remove markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Try to parse as JSON
    const parsed = JSON.parse(cleanedResponse);
    return {
      analysisType,
      summary: parsed.summary || cleanedResponse,
      recommendations: parsed.recommendations || [],
      nextStep: parsed.nextStep || '',
      motivation: parsed.motivation || '',
      rawResponse: response
    };
  } catch (error) {
    console.log('JSON parsing failed, using raw response:', error.message);
    // If JSON parsing fails, return the raw response
    return {
      analysisType,
      summary: response,
      recommendations: [],
      nextStep: '',
      motivation: '',
      rawResponse: response
    };
  }
}

function generateFallbackAnalysis(data) {
  const { userProfile, accounts, goals } = data;
  const totalAssets = accounts
    .filter(a => ['checking', 'savings', 'investment'].includes(a.type))
    .reduce((sum, a) => sum + a.balance, 0);

  const totalDebt = accounts
    .filter(a => ['credit_card', 'loan', 'mortgage'].includes(a.type))
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  const netWorth = totalAssets - totalDebt;

  return {
    analysisType: 'fallback',
    summary: `Great job tracking your finances! 💪 You have $${totalAssets.toLocaleString()} in assets and $${totalDebt.toLocaleString()} in debt, giving you a net worth of $${netWorth.toLocaleString()}.`,
    recommendations: [
      'Continue tracking your expenses regularly',
      'Consider building an emergency fund if you don\'t have one',
      'Review your goals and adjust as needed'
    ],
    nextStep: 'Check your account balances and update any recent transactions',
    motivation: 'Every small step counts toward your financial goals! 🎯',
    fallback: true
  };
}
