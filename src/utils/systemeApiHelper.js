let systemeSDK;

// Initialize the SDK with the API key using the TypeScript wrapper
try {
  systemeSDK = require('../../infrastructure/external-services/SystemeWrapper').default;
  systemeSDK.auth(process.env.API_SYSTEME_KEY);
} catch (error) {
  console.error('Failed to initialize Systeme SDK in helper:', error);
  // Fallback to a mock SDK for development
  systemeSDK = {
    auth: () => {},
    api_contacts_get_collection: () => Promise.resolve({ data: { items: [] } }),
    post_contact: () => Promise.resolve({ data: { id: 'mock-id' } }),
    api_tags_get_collection: () => Promise.resolve({ data: { items: [] } }),
    api_tags_post: () => Promise.resolve({ data: { id: 'mock-tag-id' } }),
    post_contact_tag: () => Promise.resolve({}),
    delete_contact_tag: () => Promise.resolve({}),
    api_contacts_id_get: () => Promise.resolve({ data: { tags: [] } })
  };
}

/**
 * Safely makes a request to Systeme.io API to get user by email
 * @param {string} email - User email address
 * @returns {Promise<{success: boolean, user?: any, error?: string}>}
 */
async function getUserByEmailFromSysteme(email) {
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
        error: 'Invalid email format'
      };
    }

    const response = await systemeSDK.api_contacts_get_collection({
      email: email
    });

    const contacts = response.data?.items?.[0] ?? null;
    
    if (contacts) {
      return {
        success: true,
        user: contacts
      };
    } else {
      return {
        success: false,
        error: 'User not found in Systeme.io'
      };
    }
  } catch (error) {
    console.error('Error fetching user from Systeme.io:', error);
    
    // Handle specific error cases
    if (error.status === 422) {
      return {
        success: false,
        error: 'Invalid email address provided to Systeme.io API'
      };
    }
    
    if (error.status === 401) {
      return {
        success: false,
        error: 'Unauthorized access to Systeme.io API - check API key'
      };
    }
    
    return {
      success: false,
      error: `Systeme.io API error: ${error.message}`
    };
  }
}

/**
 * Safely gets user tags from Systeme.io
 * @param {string} email - User email address
 * @returns {Promise<string[]>} Array of user tags
 */
async function getUserTagsFromSysteme(email) {
  try {
    const result = await getUserByEmailFromSysteme(email);
    
    if (result.success && result.user?.tags) {
      return result.user.tags.map(tag => tag.name);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user tags from Systeme.io:', error);
    return [];
  }
}

module.exports = {
  getUserByEmailFromSysteme,
  getUserTagsFromSysteme
};
