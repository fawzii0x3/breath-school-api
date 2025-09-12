/**
 * Systeme.io configuration
 */
export const SYSTEME_CONFIG = {
  // Default API key - can be overridden by environment variable
  API_KEY: process.env.API_SYSTEME_KEY || 'q81gkvxrqt0x9ycved23hrc08nccsuyihxrcrk0isb8c2ea8q9dvvzhmtphwojes',
  
  // Systeme.io API configuration
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  
  // API endpoints configuration
  ENDPOINTS: {
    CONTACTS: '/api/contacts',
    TAGS: '/api/tags',
    COMMUNITIES: '/api/community'
  }
};

/**
 * Initialize Systeme.io with the configured API key
 * @param apiKey - Optional API key override
 * @returns The configured API key
 */
export function initializeSystemeConfig(apiKey?: string): string {
  const key = apiKey || SYSTEME_CONFIG.API_KEY;
  console.log(`Initializing Systeme.io with API key: ${key.substring(0, 10)}...`);
  return key;
}
