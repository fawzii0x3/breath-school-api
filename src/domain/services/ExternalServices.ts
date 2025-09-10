export interface AuthenticationService {
  verifyToken(token: string): Promise<{ uid: string; email: string } | null>;
  createCustomToken(uid: string): Promise<string>;
}

export interface SubscriptionService {
  createCustomer(email: string, name?: string): Promise<{ customerId: string }>;
  updateSubscription(customerId: string, planId: string): Promise<{ status: string }>;
  cancelSubscription(customerId: string): Promise<{ status: string }>;
  getSubscriptionStatus(customerId: string): Promise<{ status: string; plan?: string }>;
}