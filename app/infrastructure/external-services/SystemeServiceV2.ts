import { ISystemeService, SystemeContact, SystemeContactCreateRequest, SystemeContactResponse, SystemeContactsResponse } from '../../application/ports/ISystemeService';
import systemeWrapper from './SystemeWrapper';
import { ISystemeSDK } from './ISystemeSDK';

export class SystemeServiceV2 implements ISystemeService {
  private apiKey: string;
  private systemeSDK: ISystemeSDK;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.systemeSDK = systemeWrapper;
    this.systemeSDK.initializeConfig(apiKey);
  }

  async createContact(contactData: SystemeContactCreateRequest): Promise<SystemeContactResponse> {
    try {
      console.log(`Creating contact in Systeme.io: ${contactData.email}`);
      
      // Check if contact already exists
      const existingContacts = await this.systemeSDK.api_contacts_get_collection({ email: contactData.email });
      
      if (existingContacts.data?.items && existingContacts.data.items.length > 0) {
        const existingContact = existingContacts.data.items[0];
        console.log(`Contact ${contactData.email} already exists in Systeme.io with ID: ${existingContact.id}`);
        return {
          success: true,
          contact: this.mapToSystemeContact(existingContact)
        };
      }

      // Create new contact
      const contactPayload = {
        email: contactData.email,
        first_name: contactData.first_name || contactData.email.split('@')[0],
        last_name: contactData.last_name || ''
      };

      const response = await this.systemeSDK.post_contact(contactPayload);
      
      if (response.data && response.data.id) {
        console.log(`Successfully created contact ${contactData.email} in Systeme.io with ID: ${response.data.id}`);
        return {
          success: true,
          contact: this.mapToSystemeContact(response.data)
        };
      } else {
        console.error('Failed to create contact in Systeme.io:', response);
        return {
          success: false,
          error: 'Failed to create contact in Systeme.io'
        };
      }
    } catch (error) {
      console.error('Error creating contact in Systeme.io:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  async getContacts(email?: string): Promise<SystemeContactsResponse> {
    try {
      const params = email ? { email } : {};
      const response = await this.systemeSDK.api_contacts_get_collection(params);
      
      if (response.data?.items) {
        return {
          success: true,
          contacts: response.data.items.map((contact: any) => this.mapToSystemeContact(contact))
        };
      } else {
        return {
          success: true,
          contacts: []
        };
      }
    } catch (error) {
      console.error('Error getting contacts from Systeme.io:', error);
      return {
        success: false,
        error: error.message || 'Failed to get contacts'
      };
    }
  }

  async getContactById(id: string): Promise<SystemeContactResponse> {
    try {
      const response = await this.systemeSDK.api_contacts_id_get({ id });
      
      if (response.data) {
        return {
          success: true,
          contact: this.mapToSystemeContact(response.data)
        };
      } else {
        return {
          success: false,
          error: 'Contact not found'
        };
      }
    } catch (error) {
      console.error('Error getting contact by ID from Systeme.io:', error);
      return {
        success: false,
        error: error.message || 'Failed to get contact'
      };
    }
  }

  async updateContact(id: string, contactData: Partial<SystemeContactCreateRequest>): Promise<SystemeContactResponse> {
    try {
      const updatePayload: any = {};
      if (contactData.email) updatePayload.email = contactData.email;
      if (contactData.first_name) updatePayload.first_name = contactData.first_name;
      if (contactData.last_name) updatePayload.last_name = contactData.last_name;

      const response = await this.systemeSDK.api_contacts_id_patch(updatePayload, { id });
      
      if (response.data) {
        return {
          success: true,
          contact: this.mapToSystemeContact(response.data)
        };
      } else {
        return {
          success: false,
          error: 'Failed to update contact'
        };
      }
    } catch (error) {
      console.error('Error updating contact in Systeme.io:', error);
      return {
        success: false,
        error: error.message || 'Failed to update contact'
      };
    }
  }

  async deleteContact(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.systemeSDK.delete_contact({ id });
      return { success: true };
    } catch (error) {
      console.error('Error deleting contact from Systeme.io:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete contact'
      };
    }
  }

  async addTagToContact(contactId: string, tagName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First, get or create the tag
      const tagsResponse = await this.systemeSDK.api_tags_get_collection();
      let tagId = null;
      
      if (tagsResponse.data?.items) {
        const existingTag = tagsResponse.data.items.find((t: any) => t.name === tagName);
        if (existingTag) {
          tagId = existingTag.id;
        }
      }
      
      if (!tagId) {
        const createTagResponse = await this.systemeSDK.api_tags_post({ name: tagName });
        if (createTagResponse.data) {
          tagId = createTagResponse.data.id;
        }
      }
      
      if (!tagId) {
        return {
          success: false,
          error: 'Failed to get or create tag'
        };
      }
      
      await this.systemeSDK.post_contact_tag(
        { tagId: parseInt(tagId.toString()) },
        { id: contactId }
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error adding tag to contact:', error);
      return {
        success: false,
        error: error.message || 'Failed to add tag to contact'
      };
    }
  }

  async removeTagFromContact(contactId: string, tagId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.systemeSDK.delete_contact_tag({ id: contactId, tagId });
      return { success: true };
    } catch (error) {
      console.error('Error removing tag from contact:', error);
      return {
        success: false,
        error: error.message || 'Failed to remove tag from contact'
      };
    }
  }

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

  // Legacy method for backward compatibility
  async createUser(email: string, fullName: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    const result = await this.createContact({
      email,
      first_name: fullName.split(' ')[0] || fullName,
      last_name: fullName.split(' ').slice(1).join(' ') || ''
    });

    return {
      success: result.success,
      userId: result.contact?.id,
      error: result.error
    };
  }
}
