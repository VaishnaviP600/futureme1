
export interface UserProfile {
  age: string;
  occupation: string;
  education: string;
  goals: string;
  challenges: string;
}

export interface Skill {
  subject: string;
  value: number;
  fullMark: number;
}

export interface FutureScenario {
  id: string;
  name: string;
  age: string;
  careerPath: string;
  achievements: string[];
  lifestyle: string;
  personalGrowth: string;
  advice: string;
  skills: Skill[];
  actionPlan: string[];
}

export interface SimulationResult {
  scenarios: FutureScenario[];
}
