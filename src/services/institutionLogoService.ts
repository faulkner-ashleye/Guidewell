import { IconNames } from '../components/Icon';

export interface InstitutionLogoData {
  logo?: string;
  name?: string;
  primaryColor?: string;
  url?: string;
}

export class InstitutionLogoService {
  private static logoCache = new Map<string, InstitutionLogoData>();
  private static readonly API_BASE = 'http://localhost:3001';

  /**
   * Get institution logo from Plaid or return fallback icon
   */
  static async getInstitutionLogo(
    institutionId?: string, 
    institutionName?: string, 
    accountType?: string
  ): Promise<{ logo?: string; fallbackIcon: string }> {
    // If we have an institution ID, try to get the logo from Plaid
    if (institutionId) {
      try {
        const logoData = await this.fetchInstitutionLogo(institutionId);
        if (logoData?.logo) {
          return { logo: logoData.logo, fallbackIcon: this.getFallbackIcon(accountType) };
        }
      } catch (error) {
        console.warn('Failed to fetch institution logo:', error);
      }
    }

    // Fallback to Material icon based on account type
    return { fallbackIcon: this.getFallbackIcon(accountType) };
  }

  /**
   * Fetch institution logo from Plaid API
   */
  private static async fetchInstitutionLogo(institutionId: string): Promise<InstitutionLogoData | null> {
    // Check cache first
    if (this.logoCache.has(institutionId)) {
      return this.logoCache.get(institutionId)!;
    }

    try {
      const response = await fetch(`${this.API_BASE}/plaid/institution/logo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ institutionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const logoData = await response.json();
      
      // Cache the result
      this.logoCache.set(institutionId, logoData);
      
      return logoData;
    } catch (error) {
      console.error('Error fetching institution logo:', error);
      return null;
    }
  }

  /**
   * Get fallback Material icon based on account type
   */
  private static getFallbackIcon(accountType?: string): string {
    switch (accountType) {
      case 'checking':
        return IconNames.account_balance_wallet;
      case 'savings':
        return IconNames.savings;
      case 'credit_card':
        return IconNames.credit_card;
      case 'loan':
        return IconNames.account_balance;
      case 'investment':
        return IconNames.trending_up;
      case 'debt':
        return IconNames.account_balance;
      default:
        return IconNames.account_balance_wallet;
    }
  }

  /**
   * Clear the logo cache (useful for testing or when logos change)
   */
  static clearCache(): void {
    this.logoCache.clear();
  }

  /**
   * Get cached logo data for an institution
   */
  static getCachedLogo(institutionId: string): InstitutionLogoData | undefined {
    return this.logoCache.get(institutionId);
  }
}
