/**
 * Interface for the Systeme SDK wrapper
 * This provides a consistent interface for the Systeme API methods used in the application
 */
export interface ISystemeSDK {
  /**
   * Authenticate with the Systeme API
   * @param apiKey - The API key for authentication
   */
  auth(apiKey: string): void;

  /**
   * Initialize the Systeme.io configuration with API key
   * @param apiKey - The Systeme.io API key
   */
  initializeConfig(apiKey: string): void;

  /**
   * Get collection of contacts
   * @param metadata - Optional metadata parameters
   * @returns Promise with contacts collection
   */
  api_contacts_get_collection(metadata?: any): Promise<any>;

  /**
   * Create a new contact
   * @param body - Contact data
   * @returns Promise with created contact
   */
  post_contact(body: any): Promise<any>;

  /**
   * Get a specific contact by ID
   * @param metadata - Contact ID metadata
   * @returns Promise with contact data
   */
  api_contacts_id_get(metadata: any): Promise<any>;

  /**
   * Get collection of tags
   * @param metadata - Optional metadata parameters
   * @returns Promise with tags collection
   */
  api_tags_get_collection(metadata?: any): Promise<any>;

  /**
   * Create a new tag
   * @param body - Tag data
   * @returns Promise with created tag
   */
  api_tags_post(body: any): Promise<any>;

  /**
   * Add a tag to a contact
   * @param body - Tag assignment data
   * @param metadata - Contact and tag metadata
   * @returns Promise with operation result
   */
  post_contact_tag(body: any, metadata: any): Promise<any>;

  /**
   * Remove a tag from a contact
   * @param metadata - Contact and tag metadata
   * @returns Promise with operation result
   */
  delete_contact_tag(metadata: any): Promise<any>;
}

/**
 * Mock implementation of ISystemeSDK for development/fallback purposes
 */
export class MockSystemeSDK implements ISystemeSDK {
  auth(apiKey: string): void {
    // Mock implementation - no-op
  }

  initializeConfig(apiKey: string): void {
    // Mock implementation - no-op
  }

  async api_contacts_get_collection(metadata?: any): Promise<any> {
    return Promise.resolve({ data: { items: [] } });
  }

  async post_contact(body: any): Promise<any> {
    return Promise.resolve({ data: { id: 'mock-id' } });
  }

  async api_contacts_id_get(metadata: any): Promise<any> {
    return Promise.resolve({ data: { tags: [] } });
  }

  async api_tags_get_collection(metadata?: any): Promise<any> {
    return Promise.resolve({ data: { items: [] } });
  }

  async api_tags_post(body: any): Promise<any> {
    return Promise.resolve({ data: { id: 'mock-tag-id' } });
  }

  async post_contact_tag(body: any, metadata: any): Promise<any> {
    return Promise.resolve({ data: {} });
  }

  async delete_contact_tag(metadata: any): Promise<any> {
    return Promise.resolve({ data: {} });
  }
}
