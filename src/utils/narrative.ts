import { StrategyConfig, StrategyResult } from '../data/types';

export function generateStrategyNarrative(config: StrategyConfig, result: StrategyResult): string {
  const { name, timeline, monthlyContribution, allocation, riskLevel } = config;
  const { projectedValue, growth, totalContribution } = result;
  
  const timelineYears = Math.round(timeline / 12 * 10) / 10;
  const growthPercentage = ((growth / totalContribution) * 100).toFixed(1);
  
  let riskDescription = '';
  switch (riskLevel) {
    case 'low':
      riskDescription = 'conservative approach';
      break;
    case 'medium':
      riskDescription = 'balanced approach';
      break;
    case 'high':
      riskDescription = 'aggressive approach';
      break;
  }
  
  return `This scenario shows how the ${name} strategy could work over ${timelineYears} years. 
  With a monthly contribution of $${monthlyContribution.toLocaleString()}, you might allocate 
  ${allocation.debt}% to debt payoff, ${allocation.savings}% to savings, and ${allocation.investment}% to investments. 
  
  This ${riskDescription} could potentially grow your total contributions of $${totalContribution.toLocaleString()} 
  to approximately $${projectedValue.toLocaleString()}, representing a ${growthPercentage}% growth 
  of $${growth.toLocaleString()}. 
  
  Remember, these are educational scenarios only and actual results may vary significantly based on 
  market conditions, fees, and other factors.`;
}

export function generateRiskWarning(riskLevel: StrategyConfig['riskLevel']): string {
  switch (riskLevel) {
    case 'low':
      return 'Lower risk strategies typically offer more stable but potentially lower returns.';
    case 'medium':
      return 'Medium risk strategies balance growth potential with stability.';
    case 'high':
      return 'Higher risk strategies may offer greater growth potential but with increased volatility.';
    default:
      return 'All investments carry risk and past performance does not guarantee future results.';
  }
}






