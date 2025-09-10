export interface BreathingSession {
  id: string;
  userId: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  technique: BreathingTechnique;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum BreathingTechnique {
  FOUR_SEVEN_EIGHT = '4-7-8',
  BOX_BREATHING = 'box-breathing',
  TRIANGLE_BREATHING = 'triangle-breathing',
  BELLY_BREATHING = 'belly-breathing',
  ALTERNATE_NOSTRIL = 'alternate-nostril',
}