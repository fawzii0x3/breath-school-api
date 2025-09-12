import { ISystemeSDK, MockSystemeSDK } from './ISystemeSDK';

/**
 * TypeScript wrapper for the Systeme API to provide proper typing and error handling
 * This replaces the JavaScript SystemeWrapper.js file
 */
class SystemeWrapper implements ISystemeSDK {
  private sdk: ISystemeSDK;
  private isInitialized: boolean = false;

  constructor() {
    this.sdk = this.initializeSDK();
  }

  /**
   * Initialize the Systeme.io configuration with API key
   * @param apiKey - The Systeme.io API key
   */
  public initializeConfig(apiKey: string): void {
    if (!this.isInitialized) {
      this.sdk.auth(apiKey);
      this.isInitialized = true;
      console.log('Systeme.io configuration initialized successfully');
    }
  }

  private initializeSDK(): ISystemeSDK {
    try {
      // Use the built JavaScript SDK for better compatibility
      const systemeSDK = require('./SystemeSDKLoader');

      // Verify that the SDK has the required methods
      if (this.hasRequiredMethods(systemeSDK)) {
        return systemeSDK as ISystemeSDK;
      } else {
        console.warn('Systeme SDK loaded but missing required methods, falling back to mock');
        return new MockSystemeSDK();
      }
      
    } catch (error) {
      console.warn('Failed to load Systeme API, using mock implementation:', (error as Error).message);
      return new MockSystemeSDK();
    }
  }

  private hasRequiredMethods(sdk: any): boolean {
    const requiredMethods = [
      'auth',
      'api_contacts_get_collection',
      'post_contact',
      'api_contacts_id_get',
      'api_tags_get_collection',
      'api_tags_post',
      'post_contact_tag',
      'delete_contact_tag'
    ];

    return requiredMethods.every(method => typeof sdk[method] === 'function');
  }

  // Delegate all methods to the underlying SDK
  auth(apiKey: string): void {
    this.sdk.auth(apiKey);
  }


  async api_contacts_get_collection(metadata?: any): Promise<any> {
    return this.sdk.api_contacts_get_collection(metadata);
  }

  async post_contact(body: any): Promise<any> {
    return this.sdk.post_contact(body);
  }

  async api_contacts_id_get(metadata: any): Promise<any> {
    return this.sdk.api_contacts_id_get(metadata);
  }

  async api_tags_get_collection(metadata?: any): Promise<any> {
    return this.sdk.api_tags_get_collection(metadata);
  }

  async api_tags_post(body: any): Promise<any> {
    return this.sdk.api_tags_post(body);
  }

  async post_contact_tag(body: any, metadata: any): Promise<any> {
    return this.sdk.post_contact_tag(body, metadata);
  }

  async delete_contact_tag(metadata: any): Promise<any> {
    return this.sdk.delete_contact_tag(metadata);
  }

  async api_contacts_id_patch(body: any, metadata: any): Promise<any> {
    return this.sdk.api_contacts_id_patch(body, metadata);
  }

  async delete_contact(metadata: any): Promise<any> {
    return this.sdk.delete_contact(metadata);
  }
}

// Create and export a singleton instance
const systemeWrapper = new SystemeWrapper();
export default systemeWrapper;

// Also export the class for testing purposes
export { SystemeWrapper };
