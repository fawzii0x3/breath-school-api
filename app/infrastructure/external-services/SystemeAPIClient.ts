import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { SystemeContact, SystemeContactCreateRequest, SystemeContactResponse, SystemeContactsResponse } from '../../application/ports/ISystemeService';

export interface SystemeAPIConfig {
  apiKey: string;
  baseURL?: string;
}

export class SystemeAPIClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: SystemeAPIConfig) {
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: config.baseURL || 'https://api.systeme.io',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[Systeme.io API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[Systeme.io API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[Systeme.io API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[Systeme.io API] Response error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Create a new contact
   * POST https://api.systeme.io/api/contacts
   */
  async createContact(contactData: SystemeContactCreateRequest): Promise<SystemeContactResponse> {
    try {
      const payload = {
        email: contactData.email,
        locale: contactData.locale || null,
        fields: contactData.fields || [],
        tags: contactData.tags || []
      };

      const response: AxiosResponse = await this.client.post('/api/contacts', payload);
      
      if (response.status === 201 && response.data) {
        return {
          success: true,
          contact: this.mapToSystemeContact(response.data)
        };
      }

      return {
        success: false,
        error: 'Failed to create contact'
      };
    } catch (error: any) {
      console.error('Error creating contact:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  /**
   * Get contacts collection
   * GET https://api.systeme.io/api/contacts
   */
  async getContacts(params?: {
    email?: string;
    tags?: string;
    bounced?: boolean;
    unsubscribed?: boolean;
    needsConfirmation?: boolean;
    registeredBefore?: string;
    registeredAfter?: string;
    limit?: number;
    startingAfter?: number;
    order?: 'asc' | 'desc';
  }): Promise<SystemeContactsResponse> {
    try {
      const response: AxiosResponse = await this.client.get('/api/contacts', { params });
      
      if (response.status === 200 && response.data) {
        return {
          success: true,
          contacts: response.data.data?.map((contact: any) => this.mapToSystemeContact(contact)) || []
        };
      }

      return {
        success: false,
        error: 'Failed to get contacts'
      };
    } catch (error: any) {
      console.error('Error getting contacts:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  /**
   * Get contact by email
   */
  async getContactByEmail(email: string): Promise<SystemeContactResponse> {
    try {
      const response = await this.getContacts({ email });
      
      if (response.success && response.contacts && response.contacts.length > 0) {
        return {
          success: true,
          contact: response.contacts[0]
        };
      }

      return {
        success: false,
        error: 'Contact not found'
      };
    } catch (error: any) {
      console.error('Error getting contact by email:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  /**
   * Get contact by ID
   * GET https://api.systeme.io/api/contacts/{id}
   */
  async getContactById(id: string): Promise<SystemeContactResponse> {
    try {
      const response: AxiosResponse = await this.client.get(`/api/contacts/${id}`);
      
      if (response.status === 200 && response.data) {
        return {
          success: true,
          contact: this.mapToSystemeContact(response.data)
        };
      }

      return {
        success: false,
        error: 'Contact not found'
      };
    } catch (error: any) {
      console.error('Error getting contact by ID:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  /**
   * Update contact
   * PATCH https://api.systeme.io/api/contacts/{id}
   */
  async updateContact(id: string, contactData: Partial<SystemeContactCreateRequest>): Promise<SystemeContactResponse> {
    try {
      const payload = {
        email: contactData.email,
        locale: contactData.locale,
        fields: contactData.fields,
        tags: contactData.tags
      };

      // Remove undefined values
      Object.keys(payload).forEach(key => {
        if (payload[key as keyof typeof payload] === undefined) {
          delete payload[key as keyof typeof payload];
        }
      });

      const response: AxiosResponse = await this.client.patch(`/api/contacts/${id}`, payload);
      
      if (response.status === 200 && response.data) {
        return {
          success: true,
          contact: this.mapToSystemeContact(response.data)
        };
      }

      return {
        success: false,
        error: 'Failed to update contact'
      };
    } catch (error: any) {
      console.error('Error updating contact:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  /**
   * Delete contact
   * DELETE https://api.systeme.io/api/contacts/{id}
   */
  async deleteContact(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response: AxiosResponse = await this.client.delete(`/api/contacts/${id}`);
      
      if (response.status === 200 || response.status === 204) {
        return { success: true };
      }

      return {
        success: false,
        error: 'Failed to delete contact'
      };
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  /**
   * Add tag to contact
   * POST https://api.systeme.io/api/contacts/{id}/tags
   */
  async addTagToContact(contactId: string, tagName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First, get or create the tag
      const tagId = await this.getOrCreateTag(tagName);
      if (!tagId) {
        return {
          success: false,
          error: 'Failed to get or create tag'
        };
      }

      const response: AxiosResponse = await this.client.post(`/api/contacts/${contactId}/tags`, {
        tag_id: tagId
      });
      
      if (response.status === 200 || response.status === 201) {
        return { success: true };
      }

      return {
        success: false,
        error: 'Failed to add tag to contact'
      };
    } catch (error: any) {
      console.error('Error adding tag to contact:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  /**
   * Remove tag from contact
   * DELETE https://api.systeme.io/api/contacts/{id}/tags/{tag_id}
   */
  async removeTagFromContact(contactId: string, tagId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response: AxiosResponse = await this.client.delete(`/api/contacts/${contactId}/tags/${tagId}`);
      
      if (response.status === 200 || response.status === 204) {
        return { success: true };
      }

      return {
        success: false,
        error: 'Failed to remove tag from contact'
      };
    } catch (error: any) {
      console.error('Error removing tag from contact:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  /**
   * Get or create a tag
   */
  private async getOrCreateTag(tagName: string): Promise<string | null> {
    try {
      // First, try to find existing tag
      const tagsResponse = await this.client.get('/api/tags');
      if (tagsResponse.data?.data) {
        const existingTag = tagsResponse.data.data.find((tag: any) => tag.name === tagName);
        if (existingTag) {
          return existingTag.id;
        }
      }

      // Create new tag if not found
      const createResponse = await this.client.post('/api/tags', { name: tagName });
      if (createResponse.data?.id) {
        return createResponse.data.id;
      }

      return null;
    } catch (error) {
      console.error('Error getting or creating tag:', error);
      return null;
    }
  }

  /**
   * Map API response to SystemeContact
   */
  private mapToSystemeContact(data: any): SystemeContact {
    return {
      id: data.id?.toString() || '',
      email: data.email || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      tags: data.tags || [],
      fields: data.fields || [],
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
  }

  /**
   * Extract error message from API error
   */
  private extractErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'Unknown error occurred';
  }
}
