import { ISystemeService, SystemeContact, SystemeContactCreateRequest, SystemeContactResponse, SystemeContactsResponse } from '../../application/ports/ISystemeService';
import systemeWrapper from './SystemeWrapper';
import { ISystemeSDK } from './ISystemeSDK';

export class SystemeService implements ISystemeService {
  private apiKey: string;
  private systemeSDK: ISystemeSDK;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    // Initialize the SDK with the API key using the TypeScript wrapper
    this.systemeSDK = systemeWrapper;
    this.systemeSDK.initializeConfig(apiKey);
  }

  async createUserTag(userId: string, tagName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First, we need to get or create the tag
      const tagsResponse = await this.systemeSDK.api_tags_get_collection();
      let tagId = null;
      
      // Check if tag already exists
      if (tagsResponse.data?.items) {
        const existingTag = tagsResponse.data.items.find((t: any) => t.name === tagName);
        if (existingTag) {
          tagId = existingTag.id;
        }
      }
      
      // Create tag if it doesn't exist
      if (!tagId) {
        const createTagResponse = await this.systemeSDK.api_tags_post({ name: tagName });
        if (createTagResponse.data) {
          tagId = createTagResponse.data.id;
        }
      }
      
      if (!tagId) {
        console.error('Failed to get or create tag');
        return { success: false, error: 'Failed to get or create tag' };
      }
      
      // Assign tag to contact
      await this.systemeSDK.post_contact_tag(
        { tagId: parseInt(tagId.toString()) },
        { id: userId }
      );
      
      console.log(`Successfully created and assigned tag "${tagName}" to user ${userId}`);
      return { success: true };
    } catch (error) {
      console.error(`Failed to create user tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, error: (error as Error).message || 'Unknown error' };
    }
  }

  async removeUserTag(userId: string, tagName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First, find the tag ID
      const tagsResponse = await this.systemeSDK.api_tags_get_collection();
      let tagId = null;
      
      if (tagsResponse.data?.items) {
        const existingTag = tagsResponse.data.items.find((t: any) => t.name === tagName);
        if (existingTag) {
          tagId = existingTag.id;
        }
      }
      
      if (!tagId) {
        console.log(`Tag "${tagName}" not found, nothing to remove`);
        return { success: true }; // Tag doesn't exist, consider it removed
      }
      
      // Remove tag from contact
      await this.systemeSDK.delete_contact_tag({
        id: userId,
        tagId: tagId.toString()
      });
      
      console.log(`Successfully removed tag "${tagName}" from user ${userId}`);
      return { success: true };
    } catch (error) {
      console.error(`Failed to remove user tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, error: (error as Error).message || 'Unknown error' };
    }
  }

  async getUserTags(userId: string): Promise<{ success: boolean; tags?: string[]; error?: string }> {
    try {
      // Get contact details to retrieve tags
      const contactResponse = await this.systemeSDK.api_contacts_id_get({ id: userId });
      
      if (contactResponse.data?.tags) {
        return {
          success: true,
          tags: contactResponse.data.tags.map((tag: any) => tag.name)
        };
      }
      
      return { success: true, tags: [] };
    } catch (error) {
      console.error(`Failed to get user tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, error: (error as Error).message || 'Unknown error' };
    }
  }

  async updateUserTags(userId: string, tags: string[]): Promise<boolean> {
    try {
      // Get current tags
      const currentTagsResult = await this.getUserTags(userId);
      const currentTags = currentTagsResult.success ? currentTagsResult.tags || [] : [];
      
      // Find tags to add and remove
      const tagsToAdd = tags.filter(tag => !currentTags.includes(tag));
      const tagsToRemove = currentTags.filter(tag => !tags.includes(tag));
      
      // Remove old tags
      for (const tag of tagsToRemove) {
        await this.removeUserTag(userId, tag);
      }
      
      // Add new tags
      for (const tag of tagsToAdd) {
        await this.createUserTag(userId, tag);
      }
      
      console.log(`Successfully updated tags for user ${userId} to [${tags.join(', ')}]`);
      return true;
    } catch (error) {
      console.error(`Failed to update user tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  async checkUserExists(email: string): Promise<boolean> {
    try {
      // Validate email parameter
      if (!email || email === 'undefined' || email.trim() === '') {
        console.error('Email parameter is required and cannot be undefined or empty');
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error('Invalid email format provided to Systeme.io API');
        return false;
      }

      const response = await this.systemeSDK.api_contacts_get_collection({
        email: email
      });

      return !!(response.data?.items && response.data.items.length > 0);
    } catch (error) {
      console.error(`Failed to check user existence in Systeme.io: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  async createUser(email: string, fullName?: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      const userData: any = {
        email: email
      };

      // Add fields if fullName is provided
      if (fullName) {
        userData.fields = [{ slug: 'first_name', value: fullName }];
      }

      const response = await this.systemeSDK.post_contact(userData);

      if (response.data) {
        return {
          success: true,
          userId: (response.data.id || response.data._id)?.toString()
        };
      }

      return {
        success: false,
        error: 'Failed to create user in Systeme.io: No data returned'
      };
    } catch (error) {
      console.error(`Failed to create user in Systeme.io: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        error: `Failed to create user in Systeme.io: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getUserByEmail(email: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      // Validate email parameter
      if (!email || email === 'undefined' || email.trim() === '') {
        return {
          success: false,
          error: 'Email parameter is required and cannot be undefined or empty'
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: 'Invalid email format provided to Systeme.io API'
        };
      }

      const response = await this.systemeSDK.api_contacts_get_collection({
        email: email
      });

      if (response.data?.items && response.data.items.length > 0) {
        return {
          success: true,
          user: response.data.items[0]
        };
      }

      return {
        success: false,
        error: 'User not found in Systeme.io'
      };
    } catch (error) {
      console.error(`Failed to get user from Systeme.io: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        error: `Failed to get user from Systeme.io: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Implement missing interface methods
  async createContact(contactData: SystemeContactCreateRequest): Promise<SystemeContactResponse> {
    try {
      const response = await this.systemeSDK.post_contact(contactData);
      if (response.data) {
        return {
          success: true,
          contact: response.data
        };
      }
      return {
        success: false,
        error: 'Failed to create contact'
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message || 'Unknown error occurred'
      };
    }
  }

  async getContacts(email?: string): Promise<SystemeContactsResponse> {
    try {
      const response = await this.systemeSDK.api_contacts_get_collection(email ? { email } : {});
      return {
        success: true,
        contacts: response.data?.items || []
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message || 'Failed to get contacts'
      };
    }
  }

  async getContactById(id: string): Promise<SystemeContactResponse> {
    try {
      const response = await this.systemeSDK.api_contacts_id_get({ id });
      return {
        success: true,
        contact: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message || 'Failed to get contact'
      };
    }
  }

  async updateContact(id: string, contactData: Partial<SystemeContactCreateRequest>): Promise<SystemeContactResponse> {
    try {
      const response = await this.systemeSDK.api_contacts_id_patch(contactData, { id });
      return {
        success: true,
        contact: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message || 'Failed to update contact'
      };
    }
  }

  async deleteContact(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.systemeSDK.delete_contact({ id });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message || 'Failed to delete contact'
      };
    }
  }

  async addTagToContact(contactId: string, tagName: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.createUserTag(contactId, tagName);
      return result;
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message || 'Failed to add tag to contact'
      };
    }
  }

  async removeTagFromContact(contactId: string, tagId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.removeUserTag(contactId, tagId);
      return result;
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message || 'Failed to remove tag from contact'
      };
    }
  }
}
