/**
 * JavaScript loader for Systeme.io API using built JavaScript SDK
 * This uses the simplified JavaScript version of the SDK
 */

let systemeSDK;

try {
  // Try to load the built JavaScript SDK from dist folder
  const createSDK = require('../../../.api/apis/systeme/dist/index.js');
  systemeSDK = createSDK();
  
  // Initialize with API key
  const apiKey = process.env.API_SYSTEME_KEY || 'q81gkvxrqt0x9ycved23hrc08nccsuyihxrcrk0isb8c2ea8q9dvvzhmtphwojes';
  systemeSDK.initializeConfig(apiKey);
  
  console.log('✅ Systeme.io JavaScript SDK loaded successfully from dist folder');
  console.log(`🔑 Using API key: ${apiKey.substring(0, 10)}...`);
} catch (error) {
  console.warn('⚠️  Failed to load Systeme.io JavaScript SDK, using mock implementation:', error.message);
  console.log('🔧 This means users will only be created in MongoDB, not in Systeme.io');
  // Fallback to a mock SDK
  systemeSDK = {
    auth: () => {},
    initializeConfig: () => {},
    api_contacts_get_collection: () => Promise.resolve({ data: { items: [] } }),
    post_contact: () => Promise.resolve({ data: { id: 'mock-id' } }),
    api_tags_get_collection: () => Promise.resolve({ data: { items: [] } }),
    api_tags_post: () => Promise.resolve({ data: { id: 'mock-tag-id' } }),
    post_contact_tag: () => Promise.resolve({}),
    delete_contact_tag: () => Promise.resolve({}),
    api_contacts_id_get: () => Promise.resolve({ data: { tags: [] } })
  };
}

module.exports = systemeSDK;
