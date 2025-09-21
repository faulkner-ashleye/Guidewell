/**
 * Maps transaction descriptions, merchant names, and categories to appropriate Material Icons
 * @param description Transaction description/name
 * @param merchantName Merchant name (optional)
 * @param categories Transaction categories (optional)
 * @returns Material Icon name
 */
export function getTransactionIcon(
  description: string,
  merchantName?: string,
  categories?: string[]
): string {
  const desc = description.toLowerCase();
  const merchant = merchantName?.toLowerCase() || '';
  const cats = categories?.join(' ').toLowerCase() || '';

  // Housing & Rent
  if (desc.includes('rent') || desc.includes('mortgage') || desc.includes('apartment') || 
      desc.includes('housing') || desc.includes('property')) {
    return 'home';
  }

  // Grocery stores and shopping
  if (desc.includes('grocery') || desc.includes('whole foods') || desc.includes('safeway') ||
      desc.includes('kroger') || desc.includes('publix') || cats.includes('groceries')) {
    return 'shopping_cart';
  }

  // Big box retailers (Walmart, Target, etc.)
  if (desc.includes('walmart') || desc.includes('target') || desc.includes('costco') ||
      desc.includes('best buy') || desc.includes('home depot') || desc.includes('lowes')) {
    return 'shopping_bag';
  }

  // Credit card payments
  if (desc.includes('credit card') || desc.includes('card payment') || 
      desc.includes('discover') || desc.includes('visa') || desc.includes('mastercard') ||
      desc.includes('amex') || desc.includes('american express')) {
    return 'credit_card';
  }

  // Utilities
  if (desc.includes('electric') || desc.includes('gas bill') || desc.includes('water') ||
      desc.includes('internet') || desc.includes('cable') || desc.includes('phone') ||
      desc.includes('utility') || cats.includes('utilities')) {
    return 'lightbulb_outline';
  }

  // Gas stations
  if (desc.includes('gas') || desc.includes('fuel') || desc.includes('shell') ||
      desc.includes('exxon') || desc.includes('chevron') || desc.includes('bp') ||
      desc.includes('mobil') || cats.includes('gas')) {
    return 'local_gas_station';
  }

  // Streaming services (Spotify, Netflix, etc.)
  if (desc.includes('spotify') || desc.includes('netflix') || desc.includes('hulu') ||
      desc.includes('disney') || desc.includes('amazon prime') || desc.includes('apple music') ||
      desc.includes('youtube') || desc.includes('streaming') || desc.includes('subscription')) {
    return 'confirmation_number'; // ticket icon
  }

  // Restaurants and food
  if (desc.includes('restaurant') || desc.includes('starbucks') || desc.includes('mcdonald') ||
      desc.includes('subway') || desc.includes('pizza') || desc.includes('burger') ||
      cats.includes('restaurants') || cats.includes('food and drink')) {
    return 'restaurant';
  }

  // Transportation
  if (desc.includes('uber') || desc.includes('lyft') || desc.includes('taxi') ||
      desc.includes('metro') || desc.includes('bus') || desc.includes('train') ||
      cats.includes('transportation')) {
    return 'directions_car';
  }

  // Investment contributions
  if (desc.includes('401k') || desc.includes('roth ira') || desc.includes('ira') ||
      desc.includes('investment') || desc.includes('contribution') || 
      desc.includes('charles schwab') || desc.includes('vanguard') || desc.includes('fidelity')) {
    return 'trending_up';
  }

  // Student loans
  if (desc.includes('student loan') || desc.includes('federal student') ||
      desc.includes('navient') || desc.includes('great lakes')) {
    return 'school';
  }

  // Savings and transfers
  if (desc.includes('savings') || desc.includes('transfer') || desc.includes('deposit') ||
      desc.includes('emergency fund')) {
    return 'savings';
  }

  // Payroll/income
  if (desc.includes('payroll') || desc.includes('salary') || desc.includes('income') ||
      desc.includes('deposit') || desc.includes('direct deposit')) {
    return 'account_balance_wallet';
  }

  // Insurance
  if (desc.includes('insurance') || desc.includes('auto insurance') || 
      desc.includes('health insurance') || desc.includes('life insurance')) {
    return 'security';
  }

  // Healthcare
  if (desc.includes('doctor') || desc.includes('hospital') || desc.includes('pharmacy') ||
      desc.includes('medical') || desc.includes('healthcare')) {
    return 'local_hospital';
  }

  // Entertainment
  if (desc.includes('movie') || desc.includes('theater') || desc.includes('concert') ||
      desc.includes('entertainment') || desc.includes('games')) {
    return 'movie';
  }

  // Shopping (general)
  if (desc.includes('amazon') || desc.includes('ebay') || desc.includes('shop') ||
      cats.includes('shops') || cats.includes('general')) {
    return 'shopping_bag';
  }

  // Default fallback
  return 'receipt';
}

