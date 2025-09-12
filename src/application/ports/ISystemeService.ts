export interface SystemeContact {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  tags?: Array<{ id: string; name: string }>;
  fields?: Array<{ slug: string; value: string }>;
  created_at: string;
  updated_at: string;
}

export interface SystemeContactCreateRequest {
  email: string;
  first_name?: string;
  last_name?: string;
  locale?: string | null;
  fields?: Array<{ slug: string; value: string }>;
  tags?: string[];
}

export interface SystemeContactResponse {
  success: boolean;
  contact?: SystemeContact;
  error?: string;
}

export interface SystemeContactsResponse {
  success: boolean;
  contacts?: SystemeContact[];
  error?: string;
}

export interface ISystemeService {
  createContact(contactData: SystemeContactCreateRequest): Promise<SystemeContactResponse>;
  getContacts(email?: string): Promise<SystemeContactsResponse>;
  getContactById(id: string): Promise<SystemeContactResponse>;
  updateContact(id: string, contactData: Partial<SystemeContactCreateRequest>): Promise<SystemeContactResponse>;
  deleteContact(id: string): Promise<{ success: boolean; error?: string }>;
  addTagToContact(contactId: string, tagName: string): Promise<{ success: boolean; error?: string }>;
  removeTagFromContact(contactId: string, tagId: string): Promise<{ success: boolean; error?: string }>;
  // User tag management methods
  createUserTag(userId: string, tagName: string): Promise<{ success: boolean; error?: string }>;
  removeUserTag(userId: string, tagName: string): Promise<{ success: boolean; error?: string }>;
  getUserTags(userId: string): Promise<{ success: boolean; tags?: string[]; error?: string }>;
}
