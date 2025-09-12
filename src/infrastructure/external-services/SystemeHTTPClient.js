/**
 * Direct HTTP client for Systeme.io API to bypass SDK compilation issues
 * This uses direct HTTP requests instead of the problematic SDK
 */

const axios = require('axios');

class SystemeHTTPClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.systeme.io';
    this.headers = {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    };
  }

  auth(apiKey) {
    this.apiKey = apiKey;
    this.headers['x-api-key'] = apiKey;
  }

  initializeConfig(apiKey) {
    this.auth(apiKey);
  }

  async api_contacts_get_collection(metadata = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/api/contacts`, {
        headers: this.headers,
        params: metadata
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error.response?.data || error.message);
      throw error;
    }
  }

  async post_contact(body) {
    try {
      const response = await axios.post(`${this.baseURL}/api/contacts`, body, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error.response?.data || error.message);
      throw error;
    }
  }

  async api_contacts_id_get(metadata) {
    try {
      const response = await axios.get(`${this.baseURL}/api/contacts/${metadata.id}`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching contact by ID:', error.response?.data || error.message);
      throw error;
    }
  }

  async api_tags_get_collection(metadata = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`, {
        headers: this.headers,
        params: metadata
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error.response?.data || error.message);
      throw error;
    }
  }

  async api_tags_post(body) {
    try {
      const response = await axios.post(`${this.baseURL}/api/tags`, body, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error('Error creating tag:', error.response?.data || error.message);
      throw error;
    }
  }

  async post_contact_tag(body, metadata) {
    try {
      const response = await axios.post(`${this.baseURL}/api/contacts/${metadata.contactId}/tags`, body, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error('Error adding tag to contact:', error.response?.data || error.message);
      throw error;
    }
  }

  async delete_contact_tag(metadata) {
    try {
      const response = await axios.delete(`${this.baseURL}/api/contacts/${metadata.contactId}/tags/${metadata.tagId}`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error('Error removing tag from contact:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = SystemeHTTPClient;
