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

  async createUserTag(userId: string, tag: string): Promise<boolean> {
    try {
      // First, we need to get or create the tag
      const tagsResponse = await this.systemeSDK.api_tags_get_collection();
      let tagId = null;
      
      // Check if tag already exists
      if (tagsResponse.data?.items) {
        const existingTag = tagsResponse.data.items.find((t: any) => t.name === tag);
        if (existingTag) {
          tagId = existingTag.id;
        }
      }
      
      // Create tag if it doesn't exist
      if (!tagId) {
        const createTagResponse = await this.systemeSDK.api_tags_post({ name: tag });
        if (createTagResponse.data) {
          tagId = createTagResponse.data.id;
        }
      }
      
      if (!tagId) {
        console.error('Failed to get or create tag');
        return false;
      }
      
      // Assign tag to contact
      await this.systemeSDK.post_contact_tag(
        { tagId: parseInt(tagId.toString()) },
        { id: userId }
      );
      
      console.log(`Successfully created and assigned tag "${tag}" to user ${userId}`);
      return true;
    } catch (error) {
      console.error(`Failed to create user tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  async removeUserTag(userId: string, tag: string): Promise<boolean> {
    try {
      // First, find the tag ID
      const tagsResponse = await this.systemeSDK.api_tags_get_collection();
      let tagId = null;
      
      if (tagsResponse.data?.items) {
        const existingTag = tagsResponse.data.items.find((t: any) => t.name === tag);
        if (existingTag) {
          tagId = existingTag.id;
        }
      }
      
      if (!tagId) {
        console.log(`Tag "${tag}" not found, nothing to remove`);
        return true; // Tag doesn't exist, consider it removed
      }
      
      // Remove tag from contact
      await this.systemeSDK.delete_contact_tag({
        id: userId,
        tagId: tagId.toString()
      });
      
      console.log(`Successfully removed tag "${tag}" from user ${userId}`);
      return true;
    } catch (error) {
      console.error(`Failed to remove user tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  async getUserTags(userId: string): Promise<string[]> {
    try {
      // Get contact details to retrieve tags
      const contactResponse = await this.systemeSDK.api_contacts_id_get({ id: userId });
      
      if (contactResponse.data?.tags) {
        return contactResponse.data.tags.map((tag: any) => tag.name);
      }
      
      return [];
    } catch (error) {
      console.error(`Failed to get user tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  async updateUserTags(userId: string, tags: string[]): Promise<boolean> {
    try {
      // Get current tags
      const currentTags = await this.getUserTags(userId);
      
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
}
