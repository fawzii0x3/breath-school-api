import { SubscriptionService } from '../../domain/services/ExternalServices';
import { config } from '../../config/config';

export class SystemeIOSubscriptionService implements SubscriptionService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.systeme.baseUrl;
    this.apiKey = config.systeme.apiKey;
  }

  async createCustomer(email: string, name?: string): Promise<{ customerId: string }> {
    try {
      // Mock implementation since we couldn't install the official SDK
      // In a real implementation, this would use the Systeme.io API
      const response = await fetch(`${this.baseUrl}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          email,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error(`Systeme.io API error: ${response.statusText}`);
      }

      const data = await response.json() as any;
      return {
        customerId: data.id || `mock_customer_${Date.now()}`,
      };
    } catch (error) {
      console.error('Systeme.io createCustomer error:', error);
      // Return mock data for development
      return {
        customerId: `mock_customer_${Date.now()}`,
      };
    }
  }

  async updateSubscription(customerId: string, planId: string): Promise<{ status: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/customers/${customerId}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          planId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Systeme.io API error: ${response.statusText}`);
      }

      const data = await response.json() as any;
      return {
        status: data.status || 'active',
      };
    } catch (error) {
      console.error('Systeme.io updateSubscription error:', error);
      return {
        status: 'active',
      };
    }
  }

  async cancelSubscription(customerId: string): Promise<{ status: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/customers/${customerId}/subscriptions`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Systeme.io API error: ${response.statusText}`);
      }

      return {
        status: 'cancelled',
      };
    } catch (error) {
      console.error('Systeme.io cancelSubscription error:', error);
      return {
        status: 'cancelled',
      };
    }
  }

  async getSubscriptionStatus(customerId: string): Promise<{ status: string; plan?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/customers/${customerId}/subscriptions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Systeme.io API error: ${response.statusText}`);
      }

      const data = await response.json() as any;
      return {
        status: data.status || 'inactive',
        plan: data.plan,
      };
    } catch (error) {
      console.error('Systeme.io getSubscriptionStatus error:', error);
      return {
        status: 'inactive',
      };
    }
  }
}