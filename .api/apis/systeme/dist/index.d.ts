/**
 * TypeScript declarations for Systeme.io SDK
 */

export interface SystemeSDK {
  config(config: any): void;
  auth(...values: any[]): SystemeSDK;
  initializeConfig(apiKey: string): void;
  server(url: string, variables?: Record<string, any>): void;
  
  // Contact methods
  api_contacts_get_collection(metadata?: any): Promise<any>;
  post_contact(body: any): Promise<any>;
  api_contacts_id_get(metadata: any): Promise<any>;
  delete_contact(metadata: any): Promise<any>;
  api_contacts_id_patch(body: any, metadata: any): Promise<any>;
  post_contact_tag(body: any, metadata: any): Promise<any>;
  delete_contact_tag(metadata: any): Promise<any>;
  
  // Tag methods
  api_tags_get_collection(metadata?: any): Promise<any>;
  api_tags_post(body: any): Promise<any>;
  api_tags_id_get(metadata: any): Promise<any>;
  api_tags_id_put(body: any, metadata: any): Promise<any>;
  api_tags_id_delete(metadata: any): Promise<any>;
  
  // Community methods
  api_communitycommunities_get_collection(metadata?: any): Promise<any>;
  api_communitycommunities_communityIdmemberships_post(body: any, metadata: any): Promise<any>;
  api_communitymemberships_get_collection(metadata?: any): Promise<any>;
  api_communitymemberships_id_delete(metadata: any): Promise<any>;
  
  // Contact Field methods
  api_contact_fields_get_collection(): Promise<any>;
  api_contact_fields_post(body: any): Promise<any>;
  api_contact_fields_slug_delete(metadata: any): Promise<any>;
  api_contact_fields_slug_patch(body: any, metadata: any): Promise<any>;
  
  // Payment methods
  api_paymentsubscriptions_get_collection(metadata: any): Promise<any>;
  cancel_subscription(body: any, metadata: any): Promise<any>;
  
  // School methods
  api_schoolcourses_get_collection(metadata?: any): Promise<any>;
  api_schoolcourses_courseIdenrollments_post(body: any, metadata: any): Promise<any>;
  api_schoolenrollments_get_collection(metadata?: any): Promise<any>;
  api_schoolenrollments_id_delete(metadata: any): Promise<any>;
  
  // Webhook methods
  api_webhooks_get_collection(): Promise<any>;
  api_webhooks_post(body: any): Promise<any>;
  api_webhooks_id_get(metadata: any): Promise<any>;
  api_webhooks_id_delete(metadata: any): Promise<any>;
  api_webhooks_id_patch(body: any, metadata: any): Promise<any>;
}

declare function createSDK(): SystemeSDK;

export = createSDK;
export default createSDK;
