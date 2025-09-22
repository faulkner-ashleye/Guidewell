export type AgeRange = '20-25' | '26-30' | '31-35' | '36-40' | 'prefer_not_to_say';
export type MainGoal = 'pay_down_debt' | 'save_big_goal' | 'build_emergency' | 'start_investing';
export type Timeline = 'short' | 'mid' | 'long'; // 1–2y, 3–5y, 5+y
export type Comfort = 'beginner' | 'intermediate' | 'confident';

export interface OnboardingState {
  name?: string;
  email?: string;
  password?: string;
  firstName?: string;  // Keep for backward compatibility
  lastName?: string;   // Keep for backward compatibility
  ageRange?: AgeRange;
  mainGoals: MainGoal[];          // multi-select
  topPriority?: MainGoal;         // single
  timeline?: Timeline;
  comfort?: Comfort;
}





