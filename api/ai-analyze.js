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
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: generateSystemPrompt(userProfile)
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

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
    console.error('AI Analysis Error:', error);
    
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

function generateSystemPrompt(userProfile) {
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
      styleInstructions = 'Provide comprehensive explanations with context and background information.';
      break;
    case 'concise':
      styleInstructions = 'Be direct and to the point. Avoid unnecessary elaboration.';
      break;
    case 'visual':
      styleInstructions = 'Use descriptive language and paint clear pictures of scenarios.';
      break;
  }
  
  // Build detail level instructions
  let detailInstructions = '';
  switch (detailLevel) {
    case 'high':
      detailInstructions = 'Include comprehensive details, examples, and step-by-step explanations.';
      break;
    case 'medium':
      detailInstructions = 'Provide balanced detail with key points and practical examples.';
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

  return `You are Guidewell's AI financial advisor. Your personality is:
${personalityInstructions}
- Always includes disclaimers about consulting professionals
- This is educational content only, not professional financial advice

Communication Preferences:
- ${styleInstructions}
- ${detailInstructions}
- ${languageInstructions}

User Context:
- Financial Literacy: ${userProfile?.financialLiteracy || 'intermediate'}
- Risk Tolerance: ${userProfile?.riskTolerance || 'moderate'}

Remember: This is educational content only, not professional financial advice.`;
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
1. Acknowledges their current financial situation positively
2. Explains how the ${strategyName} strategy fits their goals
3. Provides specific, actionable next steps
4. Motivates them to stay on track
5. Uses encouraging language with appropriate emojis

IMPORTANT: Respond ONLY with valid JSON in this exact format. Do not include any markdown, code blocks, or extra text:

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

IMPORTANT: Respond ONLY with valid JSON in this exact format. Do not include any markdown, code blocks, or extra text:

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
    // Clean the response to extract JSON
    let cleanedResponse = response.trim();
    
    // Remove markdown code blocks if present
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to extract JSON from mixed content
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    // Parse the cleaned JSON
    const parsed = JSON.parse(cleanedResponse);
    
    // Clean up the parsed content to remove any remaining JSON artifacts
    const cleanText = (text) => {
      if (!text) return text;
      return text
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .replace(/^\s*[\{\[]\s*/, '')
        .replace(/\s*[\}\]]\s*$/, '')
        .replace(/["']/g, '')
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .trim();
    };
    
    return {
      analysisType,
      summary: cleanText(parsed.summary) || cleanText(response),
      recommendations: Array.isArray(parsed.recommendations) 
        ? parsed.recommendations.map(cleanText)
        : [],
      nextStep: cleanText(parsed.nextStep) || '',
      motivation: cleanText(parsed.motivation) || '',
      rawResponse: response
    };
  } catch (error) {
    // If JSON parsing fails, clean the raw response and return it as summary
    const cleanedSummary = response
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*[\{\[]\s*/, '')
      .replace(/\s*[\}\]]\s*$/, '')
      .replace(/["']/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .trim();
    
    return {
      analysisType,
      summary: cleanedSummary,
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
