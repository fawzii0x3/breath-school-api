/**
 * Test script to verify if Systeme.io HTTP client is working with real API
 */

const SystemeHTTPClient = require('./app/infrastructure/external-services/SystemeHTTPClient');

async function testSystemeRealAPI() {
  try {
    console.log('Testing Systeme.io HTTP client with real API...');
    
    const apiKey = 'q81gkvxrqt0x9ycved23hrc08nccsuyihxrcrk0isb8c2ea8q9dvvzhmtphwojes';
    const client = new SystemeHTTPClient(apiKey);
    
    console.log('🔑 API Key:', apiKey.substring(0, 10) + '...');
    
    // Test 1: Get existing contacts
    console.log('\n1. Testing get contacts...');
    try {
      const contacts = await client.api_contacts_get_collection();
      console.log('✅ Contacts fetched successfully');
      console.log('📊 Total contacts:', contacts.data?.items?.length || 0);
      if (contacts.data?.items?.length > 0) {
        console.log('📧 First contact email:', contacts.data.items[0].email);
      }
    } catch (error) {
      console.log('❌ Error fetching contacts:', error.response?.data || error.message);
    }
    
    // Test 2: Create a new contact
    console.log('\n2. Testing create contact...');
    try {
      const testEmail = `test-${Date.now()}@example.com`;
      const newContact = await client.post_contact({
        email: testEmail,
        fields: [
          { slug: 'first_name', value: 'Test User' }
        ]
      });
      console.log('✅ Contact created successfully');
      console.log('🆔 Contact ID:', newContact.data?.id);
      console.log('📧 Contact email:', testEmail);
    } catch (error) {
      console.log('❌ Error creating contact:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSystemeRealAPI();
