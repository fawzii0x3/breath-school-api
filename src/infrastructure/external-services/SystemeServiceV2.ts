import { ISystemeService, SystemeContact, SystemeContactCreateRequest, SystemeContactResponse, SystemeContactsResponse } from '../../application/ports/ISystemeService';
import { SystemeAPIClient } from './SystemeAPIClient';

export class SystemeServiceV2 implements ISystemeService {
  private apiClient: SystemeAPIClient;

  constructor(apiKey: string) {
    this.apiClient = new SystemeAPIClient({ apiKey });
  }

  async createContact(contactData: SystemeContactCreateRequest): Promise<SystemeContactResponse> {
    try {
      console.log(`Creating contact in Systeme.io: ${contactData.email}`);
      
      // Check if contact already exists
      const existingContact = await this.apiClient.getContactByEmail(contactData.email);
      
      if (existingContact.success && existingContact.contact) {
        console.log(`Contact ${contactData.email} already exists in Systeme.io with ID: ${existingContact.contact.id}`);
        return existingContact;
      }

      // Create new contact
      const response = await this.apiClient.createContact(contactData);
      
      if (response.success) {
        console.log(`Successfully created contact ${contactData.email} in Systeme.io with ID: ${response.contact?.id}`);
      } else {
        console.error('Failed to create contact in Systeme.io:', response.error);
      }

      return response;
    } catch (error: any) {
      console.error('Error creating contact:', error);
      return {
        success: false,
        error: (error as Error).message || 'Unknown error occurred'
      };
    }
  }

  async getContacts(email?: string): Promise<SystemeContactsResponse> {
    try {
      const params = email ? { email } : {};
      return await this.apiClient.getContacts(params);
    } catch (error: any) {
      console.error('Error getting contacts:', error);
      return {
        success: false,
        error: (error as Error).message || 'Failed to get contacts'
      };
    }
  }

  async getContactById(id: string): Promise<SystemeContactResponse> {
    try {
      return await this.apiClient.getContactById(id);
    } catch (error: any) {
      console.error('Error getting contact by ID:', error);
      return {
        success: false,
        error: (error as Error).message || 'Failed to get contact'
      };
    }
  }

  async updateContact(id: string, contactData: Partial<SystemeContactCreateRequest>): Promise<SystemeContactResponse> {
    try {
      return await this.apiClient.updateContact(id, contactData);
    } catch (error: any) {
      console.error('Error updating contact:', error);
      return {
        success: false,
        error: (error as Error).message || 'Failed to update contact'
      };
    }
  }

  async deleteContact(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      return await this.apiClient.deleteContact(id);
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      return {
        success: false,
        error: (error as Error).message || 'Failed to delete contact'
      };
    }
  }

  async addTagToContact(contactId: string, tagName: string): Promise<{ success: boolean; error?: string }> {
    try {
      return await this.apiClient.addTagToContact(contactId, tagName);
    } catch (error: any) {
      console.error('Error adding tag to contact:', error);
      return {
        success: false,
        error: (error as Error).message || 'Failed to add tag to contact'
      };
    }
  }

  async removeTagFromContact(contactId: string, tagId: string): Promise<{ success: boolean; error?: string }> {
    try {
      return await this.apiClient.removeTagFromContact(contactId, tagId);
    } catch (error: any) {
      console.error('Error removing tag from contact:', error);
      return {
        success: false,
        error: (error as Error).message || 'Failed to remove tag from contact'
      };
    }
  }

  // Implement missing user tag management methods
  async createUserTag(userId: string, tagName: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.addTagToContact(userId, tagName);
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: (error as Error).message || 'Failed to create user tag'
      };
    }
  }

  async removeUserTag(userId: string, tagName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First get the tag ID by getting the contact and finding the tag
      const contactResponse = await this.getContactById(userId);
      if (!contactResponse.success || !contactResponse.contact) {
        return { success: false, error: 'Contact not found' };
      }

      const contact = contactResponse.contact;
      const tag = contact.tags?.find(t => t.name === tagName);
      if (!tag) {
        return { success: true }; // Tag doesn't exist, consider it removed
      }

      const result = await this.removeTagFromContact(userId, tag.id);
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: (error as Error).message || 'Failed to remove user tag'
      };
    }
  }

  async getUserTags(userId: string): Promise<{ success: boolean; tags?: string[]; error?: string }> {
    try {
      const contactResponse = await this.getContactById(userId);
      if (contactResponse.success && contactResponse.contact?.tags) {
        return {
          success: true,
          tags: contactResponse.contact.tags.map((tag: any) => tag.name)
        };
      }
      return { success: true, tags: [] };
    } catch (error: any) {
      return {
        success: false,
        error: (error as Error).message || 'Failed to get user tags'
      };
    }
  }
}