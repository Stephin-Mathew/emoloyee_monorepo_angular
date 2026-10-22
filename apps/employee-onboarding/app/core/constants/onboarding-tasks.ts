import { OnboardingTask } from '../models/onboarding.model';

/** The standard checklist every new hire works through. */
export const ONBOARDING_TASKS: readonly OnboardingTask[] = [
  {
    id: 'paperwork',
    title: 'Sign employment paperwork',
    description: 'Contract, tax forms, and bank details submitted to People.',
    category: 'Admin',
  },
  {
    id: 'equipment',
    title: 'Receive laptop and accounts',
    description: 'Hardware handed over; email, chat, and tool access confirmed.',
    category: 'IT',
  },
  {
    id: 'security',
    title: 'Complete security training',
    description: 'Password manager, phishing awareness, and data-handling basics.',
    category: 'Learning',
  },
  {
    id: 'intro',
    title: 'Meet the team and your manager',
    description: 'Introductions held with the immediate team and key partners.',
    category: 'Team',
  },
  {
    id: 'goals',
    title: 'Agree 30-day goals',
    description: 'Written goals shared and signed off with the line manager.',
    category: 'Team',
  },
  {
    id: 'checkin',
    title: 'First check-in with onboarding buddy',
    description: 'Open Q&A covering culture, tools, and ways of working.',
    category: 'Learning',
  },
];
