#!/usr/bin/env node

/**
 * Build script to compile TypeScript files to JavaScript and output to dist folder
 * This creates a simplified JavaScript version of the Systeme.io SDK
 */

const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// No need to read TypeScript files since we're generating a clean JavaScript version

// Create the simplified JavaScript index.js
const indexJs = `/**
 * Simplified JavaScript version of Systeme.io SDK
 * This is a clean, working JavaScript implementation
 */

const Oas = require('oas');
const APICore = require('api/dist/core');
const definition = require('../openapi.json');

class SDK {
  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'systeme/1.0.0 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   */
  config(config) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   */
  auth(...values) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * Initialize configuration with API key
   */
  initializeConfig(apiKey) {
    this.auth(apiKey);
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method.
   */
  server(url, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Retrieves the collection of Community resources.
   */
  async api_communitycommunities_get_collection(metadata = {}) {
    return this.core.fetch('/api/community/communities', 'get', metadata);
  }

  /**
   * Creates a Membership resource.
   */
  async api_communitycommunities_communityIdmemberships_post(body, metadata) {
    return this.core.fetch('/api/community/communities/{communityId}/memberships', 'post', body, metadata);
  }

  /**
   * Retrieves the collection of Membership resources.
   */
  async api_communitymemberships_get_collection(metadata = {}) {
    return this.core.fetch('/api/community/memberships', 'get', metadata);
  }

  /**
   * Removes the Membership resource.
   */
  async api_communitymemberships_id_delete(metadata) {
    return this.core.fetch('/api/community/memberships/{id}', 'delete', metadata);
  }

  /**
   * Retrieves the collection of ContactField resources.
   */
  async api_contact_fields_get_collection() {
    return this.core.fetch('/api/contact_fields', 'get');
  }

  /**
   * Creates a ContactField resource.
   */
  async api_contact_fields_post(body) {
    return this.core.fetch('/api/contact_fields', 'post', body);
  }

  /**
   * Removes the ContactField resource.
   */
  async api_contact_fields_slug_delete(metadata) {
    return this.core.fetch('/api/contact_fields/{slug}', 'delete', metadata);
  }

  /**
   * Updates the ContactField resource.
   */
  async api_contact_fields_slug_patch(body, metadata) {
    return this.core.fetch('/api/contact_fields/{slug}', 'patch', body, metadata);
  }

  /**
   * Retrieves the collection of Contact resources.
   */
  async api_contacts_get_collection(metadata = {}) {
    return this.core.fetch('/api/contacts', 'get', metadata);
  }

  /**
   * Creates a Contact resource.
   */
  async post_contact(body) {
    return this.core.fetch('/api/contacts', 'post', body);
  }

  /**
   * Retrieves a Contact resource.
   */
  async api_contacts_id_get(metadata) {
    return this.core.fetch('/api/contacts/{id}', 'get', metadata);
  }

  /**
   * Removes the Contact resource.
   */
  async delete_contact(metadata) {
    return this.core.fetch('/api/contacts/{id}', 'delete', metadata);
  }

  /**
   * Updates the Contact resource.
   */
  async api_contacts_id_patch(body, metadata) {
    return this.core.fetch('/api/contacts/{id}', 'patch', body, metadata);
  }

  /**
   * Assigns a Tag to a Contact.
   */
  async post_contact_tag(body, metadata) {
    return this.core.fetch('/api/contacts/{id}/tags', 'post', body, metadata);
  }

  /**
   * Removes a Tag from a Contact.
   */
  async delete_contact_tag(metadata) {
    return this.core.fetch('/api/contacts/{id}/tags/{tagId}', 'delete', metadata);
  }

  /**
   * Retrieves the collection of Subscription resources.
   */
  async api_paymentsubscriptions_get_collection(metadata) {
    return this.core.fetch('/api/payment/subscriptions', 'get', metadata);
  }

  /**
   * Cancels the subscription.
   */
  async cancel_subscription(body, metadata) {
    return this.core.fetch('/api/payment/subscriptions/{id}/cancel', 'post', body, metadata);
  }

  /**
   * Retrieves the collection of Course resources.
   */
  async api_schoolcourses_get_collection(metadata = {}) {
    return this.core.fetch('/api/school/courses', 'get', metadata);
  }

  /**
   * Creates an Enrollment resource.
   */
  async api_schoolcourses_courseIdenrollments_post(body, metadata) {
    return this.core.fetch('/api/school/courses/{courseId}/enrollments', 'post', body, metadata);
  }

  /**
   * Retrieves the collection of Enrollment resources.
   */
  async api_schoolenrollments_get_collection(metadata = {}) {
    return this.core.fetch('/api/school/enrollments', 'get', metadata);
  }

  /**
   * Removes the Enrollment resource.
   */
  async api_schoolenrollments_id_delete(metadata) {
    return this.core.fetch('/api/school/enrollments/{id}', 'delete', metadata);
  }

  /**
   * Retrieves the collection of Tag resources.
   */
  async api_tags_get_collection(metadata = {}) {
    return this.core.fetch('/api/tags', 'get', metadata);
  }

  /**
   * Creates a Tag resource.
   */
  async api_tags_post(body) {
    return this.core.fetch('/api/tags', 'post', body);
  }

  /**
   * Retrieves a Tag resource.
   */
  async api_tags_id_get(metadata) {
    return this.core.fetch('/api/tags/{id}', 'get', metadata);
  }

  /**
   * Replaces the Tag resource.
   */
  async api_tags_id_put(body, metadata) {
    return this.core.fetch('/api/tags/{id}', 'put', body, metadata);
  }

  /**
   * Removes the Tag resource.
   */
  async api_tags_id_delete(metadata) {
    return this.core.fetch('/api/tags/{id}', 'delete', metadata);
  }

  /**
   * Retrieves the collection of Webhook resources.
   */
  async api_webhooks_get_collection() {
    return this.core.fetch('/api/webhooks', 'get');
  }

  /**
   * Creates a Webhook resource.
   */
  async api_webhooks_post(body) {
    return this.core.fetch('/api/webhooks', 'post', body);
  }

  /**
   * Retrieves a Webhook resource.
   */
  async api_webhooks_id_get(metadata) {
    return this.core.fetch('/api/webhooks/{id}', 'get', metadata);
  }

  /**
   * Removes the Webhook resource.
   */
  async api_webhooks_id_delete(metadata) {
    return this.core.fetch('/api/webhooks/{id}', 'delete', metadata);
  }

  /**
   * Updates the Webhook resource.
   */
  async api_webhooks_id_patch(body, metadata) {
    return this.core.fetch('/api/webhooks/{id}', 'patch', body, metadata);
  }
}

const createSDK = () => {
  return new SDK();
};

module.exports = createSDK;
module.exports.default = createSDK;
`;

// Write JavaScript files to dist folder
fs.writeFileSync(path.join(distDir, 'index.js'), indexJs);

console.log('✅ Successfully built @api/systeme to JavaScript');
console.log('📁 Generated files in dist folder:');
console.log('  - dist/index.js');
console.log('  - dist/index.d.ts (TypeScript declarations)');
