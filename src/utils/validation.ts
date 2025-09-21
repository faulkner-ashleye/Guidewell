import { z } from 'zod';

// Account validation schema
export const AccountSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Account name is required').max(100, 'Account name too long'),
  type: z.string().refine((val) => 
    ['checking', 'savings', 'investment', 'debt', 'credit_card', 'loan'].includes(val),
    { message: 'Invalid account type' }
  ),
  balance: z.number().finite('Balance must be a valid number'),
  interestRate: z.number().min(0, 'Interest rate cannot be negative').max(100, 'Interest rate too high').optional(),
  monthlyContribution: z.number().min(0, 'Monthly contribution cannot be negative').optional()
});

// Goal validation schema
export const GoalSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Goal name is required').max(100, 'Goal name too long'),
  type: z.string().refine((val) => 
    ['debt_payoff', 'emergency_fund', 'retirement', 'investment', 'custom'].includes(val),
    { message: 'Invalid goal type' }
  ),
  target: z.number().positive('Target amount must be positive'),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  priority: z.string().refine((val) => 
    ['high', 'medium', 'low'].includes(val),
    { message: 'Invalid priority level' }
  )
});

// Strategy configuration validation schema
export const StrategyConfigSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Strategy name is required').max(100, 'Strategy name too long'),
  type: z.string().refine((val) => 
    ['debt_payoff', 'emergency_fund', 'retirement', 'investment', 'custom'].includes(val),
    { message: 'Invalid strategy type' }
  ),
  timeline: z.number().min(1, 'Timeline must be at least 1 month').max(600, 'Timeline cannot exceed 50 years'),
  monthlyContribution: z.number().positive('Monthly contribution must be positive'),
  allocation: z.object({
    debt: z.number().min(0, 'Debt allocation cannot be negative').max(100, 'Debt allocation cannot exceed 100%'),
    savings: z.number().min(0, 'Savings allocation cannot be negative').max(100, 'Savings allocation cannot exceed 100%'),
    investing: z.number().min(0, 'Investment allocation cannot be negative').max(100, 'Investment allocation cannot exceed 100%')
  }).refine(
    data => Math.abs(data.debt + data.savings + data.investing - 100) < 0.01,
    { message: 'Allocation percentages must sum to 100%' }
  ),
  target: z.number().positive().optional(),
  riskLevel: z.string().refine((val) => 
    ['low', 'medium', 'high'].includes(val),
    { message: 'Invalid risk level' }
  )
});

// User profile validation schema
export const UserProfileSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  age: z.number().min(18, 'Age must be at least 18').max(100, 'Age cannot exceed 100').optional(),
  ageRange: z.string().optional(),
  income: z.number().min(0, 'Income cannot be negative').optional(),
  monthlyExpenses: z.number().min(0, 'Monthly expenses cannot be negative').optional(),
  riskTolerance: z.string().refine((val) => 
    ['conservative', 'moderate', 'aggressive'].includes(val),
    { message: 'Invalid risk tolerance' }
  ),
  financialLiteracy: z.string().refine((val) => 
    ['beginner', 'intermediate', 'advanced'].includes(val),
    { message: 'Invalid financial literacy level' }
  ),
  mainGoals: z.array(z.string()).min(1, 'At least one goal is required'),
  topPriority: z.string().optional(),
  timeline: z.string().refine((val) => 
    ['short', 'mid', 'long'].includes(val),
    { message: 'Invalid timeline' }
  ).optional(),
  communicationStyle: z.string().refine((val) => 
    ['detailed', 'concise', 'visual'].includes(val),
    { message: 'Invalid communication style' }
  ).optional(),
  notificationFrequency: z.string().refine((val) => 
    ['daily', 'weekly', 'monthly', 'never'].includes(val),
    { message: 'Invalid notification frequency' }
  ).optional(),
  preferredLanguage: z.string().refine((val) => 
    ['simple', 'technical', 'mixed'].includes(val),
    { message: 'Invalid preferred language' }
  ).optional(),
  aiPersonality: z.string().refine((val) => 
    ['encouraging', 'analytical', 'casual', 'professional'].includes(val),
    { message: 'Invalid AI personality' }
  ).optional(),
  detailLevel: z.string().refine((val) => 
    ['high', 'medium', 'low'].includes(val),
    { message: 'Invalid detail level' }
  ).optional(),
  primaryGoalAccountId: z.string().uuid().optional(),
  hasSampleData: z.boolean().optional(),
  lastActiveDate: z.string().optional(),
  onboardingCompleted: z.boolean().optional()
});

// Transaction validation schema
export const TransactionSchema = z.object({
  id: z.string().uuid().optional(),
  accountId: z.string().uuid('Invalid account ID'),
  amount: z.number().finite('Amount must be a valid number'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  name: z.string().min(1, 'Transaction name is required').max(200, 'Transaction name too long'),
  merchantName: z.string().max(200, 'Merchant name too long').optional(),
  category: z.array(z.string()).optional(),
  description: z.string().max(500, 'Description too long').optional()
});

// Contribution validation schema
export const ContributionSchema = z.object({
  id: z.string().uuid().optional(),
  accountId: z.string().uuid('Invalid account ID'),
  amount: z.number().positive('Contribution amount must be positive'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  type: z.string().refine((val) => 
    ['manual', 'automatic', 'goal_progress'].includes(val),
    { message: 'Invalid contribution type' }
  ),
  description: z.string().max(200, 'Description too long').optional()
});

// Validation result interface
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
  errorMessages?: string[];
}

// Validation utility functions
export class ValidationUtils {
  /**
   * Validate data against a Zod schema
   */
  static validate<T>(data: unknown, schema: z.ZodSchema<T>): ValidationResult<T> {
    try {
      const validatedData = schema.parse(data);
      return {
        success: true,
        data: validatedData
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error,
          errorMessages: error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`)
        };
      }
      return {
        success: false,
        errorMessages: ['Unknown validation error']
      };
    }
  }

  /**
   * Validate multiple accounts
   */
  static validateAccounts(accounts: unknown[]): ValidationResult<z.infer<typeof AccountSchema>[]> {
    const results = accounts.map(account => this.validate(account, AccountSchema));
    const validAccounts = results.filter(r => r.success).map(r => r.data!);
    const allErrors = results.flatMap(r => r.errorMessages || []);

    return {
      success: allErrors.length === 0,
      data: validAccounts,
      errorMessages: allErrors.length > 0 ? allErrors : undefined
    };
  }

  /**
   * Validate multiple goals
   */
  static validateGoals(goals: unknown[]): ValidationResult<z.infer<typeof GoalSchema>[]> {
    const results = goals.map(goal => this.validate(goal, GoalSchema));
    const validGoals = results.filter(r => r.success).map(r => r.data!);
    const allErrors = results.flatMap(r => r.errorMessages || []);

    return {
      success: allErrors.length === 0,
      data: validGoals,
      errorMessages: allErrors.length > 0 ? allErrors : undefined
    };
  }

  /**
   * Validate financial data for AI processing
   */
  static validateFinancialData(data: {
    accounts?: unknown[];
    goals?: unknown[];
    userProfile?: unknown;
    strategyConfig?: unknown;
  }): ValidationResult<{
    accounts?: z.infer<typeof AccountSchema>[];
    goals?: z.infer<typeof GoalSchema>[];
    userProfile?: z.infer<typeof UserProfileSchema>;
    strategyConfig?: z.infer<typeof StrategyConfigSchema>;
  }> {
    const result: any = {};
    const errors: string[] = [];

    if (data.accounts) {
      const accountValidation = this.validateAccounts(data.accounts);
      if (accountValidation.success) {
        result.accounts = accountValidation.data;
      } else {
        errors.push(...(accountValidation.errorMessages || []));
      }
    }

    if (data.goals) {
      const goalValidation = this.validateGoals(data.goals);
      if (goalValidation.success) {
        result.goals = goalValidation.data;
      } else {
        errors.push(...(goalValidation.errorMessages || []));
      }
    }

    if (data.userProfile) {
      const profileValidation = this.validate(data.userProfile, UserProfileSchema);
      if (profileValidation.success) {
        result.userProfile = profileValidation.data;
      } else {
        errors.push(...(profileValidation.errorMessages || []));
      }
    }

    if (data.strategyConfig) {
      const strategyValidation = this.validate(data.strategyConfig, StrategyConfigSchema);
      if (strategyValidation.success) {
        result.strategyConfig = strategyValidation.data;
      } else {
        errors.push(...(strategyValidation.errorMessages || []));
      }
    }

    return {
      success: errors.length === 0,
      data: result,
      errorMessages: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Sanitize user input for AI processing
   */
  static sanitizeForAI(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/[{}]/g, '') // Remove potential JSON injection
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate AI response format
   */
  static validateAIResponse(response: unknown): ValidationResult<{
    narrative?: string;
    opportunities?: unknown[];
    recommendations?: unknown[];
    confidence?: number;
  }> {
    const schema = z.object({
      narrative: z.string().optional(),
      opportunities: z.array(z.unknown()).optional(),
      recommendations: z.array(z.unknown()).optional(),
      confidence: z.number().min(0).max(1).optional()
    });

    return this.validate(response, schema);
  }
}

// Type exports for use in components
export type ValidatedAccount = z.infer<typeof AccountSchema>;
export type ValidatedGoal = z.infer<typeof GoalSchema>;
export type ValidatedStrategyConfig = z.infer<typeof StrategyConfigSchema>;
export type ValidatedUserProfile = z.infer<typeof UserProfileSchema>;
export type ValidatedTransaction = z.infer<typeof TransactionSchema>;
export type ValidatedContribution = z.infer<typeof ContributionSchema>;
