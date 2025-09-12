import { ISystemeService } from '../../application/ports/ISystemeService';
import { SystemeContactCreateRequest } from '../../application/ports/ISystemeService';

export class CreateSystemeContactUseCase {
  constructor(private systemeService: ISystemeService) {}

  async execute(contactData: SystemeContactCreateRequest): Promise<{ success: boolean; contactId?: string; error?: string }> {
    try {
      if (!contactData.email) {
        return {
          success: false,
          error: 'Email is required'
        };
      }

      const result = await this.systemeService.createContact(contactData);
      
      if (result.success && result.contact) {
        return {
          success: true,
          contactId: result.contact.id
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to create contact'
        };
      }
    } catch (error) {
      console.error('CreateSystemeContactUseCase error:', error);
      return {
        success: false,
        error: 'Failed to create contact in Systeme.io'
      };
    }
  }
}
