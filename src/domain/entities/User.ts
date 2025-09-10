export interface User {
  id: string;
  email: string;
  displayName?: string;
  firebaseUid: string;
  systemeCustomerId?: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}