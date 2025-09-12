import { IUserRepository } from '../repositories/IUserRepository';
import { ISystemeService } from '../../application/ports/ISystemeService';
import { UserResponse } from '../entities/User';

export class CheckAndCreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private systemeService: ISystemeService
  ) {}

  async execute(email: string): Promise<{ success: boolean; info: string; data?: UserResponse; created?: boolean }> {
    try {
      if (!email) {
        return {
          success: false,
          info: 'Email is required'
        };
      }

      // Check if user exists in MongoDB
      const mongoUser = await this.userRepository.findByEmail(email);
      
      // Check if user exists in Systeme.io
      const systemeContactsResult = await this.systemeService.getContacts(email);
      const systemeUserExists = systemeContactsResult.success && systemeContactsResult.contacts && systemeContactsResult.contacts.length > 0;
      
      // If user exists in MongoDB, return the user data
      if (mongoUser) {
        return {
          success: true,
          info: 'User found in MongoDB',
          data: {
            _id: mongoUser._id,
            email: mongoUser.email,
            fullName: mongoUser.fullName,
            role: mongoUser.role,
            firebaseUid: mongoUser.firebaseUid,
            suscription: mongoUser.suscription,
            isStartSubscription: mongoUser.isStartSubscription,
            createdAt: mongoUser.createdAt,
            updatedAt: mongoUser.updatedAt
          },
          created: false
        };
      }

      // If user doesn't exist in MongoDB but exists in Systeme.io, create in MongoDB
      if (systemeUserExists && systemeContactsResult.contacts) {
        try {
          const systemeContact = systemeContactsResult.contacts[0];
          // Extract full name from Systeme.io contact
          const fullName = this.extractFullNameFromSystemeContact(systemeContact);
          
          const newUser = await this.userRepository.create({
            email: email,
            fullName: fullName || email.split('@')[0],
            role: 'user',
            firebaseUid: `systeme_${Date.now()}` // Generate a temporary firebaseUid for Systeme.io users
          });

          return {
            success: true,
            info: 'User created in MongoDB from Systeme.io data',
            data: {
              _id: newUser._id,
              email: newUser.email,
              fullName: newUser.fullName,
              role: newUser.role,
              firebaseUid: newUser.firebaseUid,
              suscription: newUser.suscription,
              isStartSubscription: newUser.isStartSubscription,
              createdAt: newUser.createdAt,
              updatedAt: newUser.updatedAt
            },
            created: true
          };
        } catch (error) {
          console.error('Error creating user from Systeme.io data:', error);
        }
      }

      // If user doesn't exist in either system, create in both
      try {
        // Create user in MongoDB first
        const newUser = await this.userRepository.create({
          email: email,
          fullName: email.split('@')[0],
          role: 'user',
          firebaseUid: `systeme_${Date.now()}` // Generate a temporary firebaseUid for Systeme.io users
        });

        // Create user in Systeme.io
        const systemeResult = await this.systemeService.createContact({
          email: email,
          first_name: newUser.fullName.split(' ')[0] || newUser.fullName,
          last_name: newUser.fullName.split(' ').slice(1).join(' ') || ''
        });
        
        if (!systemeResult.success) {
          console.warn('Failed to create user in Systeme.io:', systemeResult.error);
        }

        return {
          success: true,
          info: 'User created in both MongoDB and Systeme.io',
          data: {
            _id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
            role: newUser.role,
            firebaseUid: newUser.firebaseUid,
            suscription: newUser.suscription,
            isStartSubscription: newUser.isStartSubscription,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
          },
          created: true
        };
      } catch (error) {
        console.error('Error creating user:', error);
        return {
          success: false,
          info: `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    } catch (error) {
      console.error('CheckAndCreateUserUseCase error:', error);
      return {
        success: false,
        info: `Failed to check and create user: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private extractFullNameFromSystemeContact(contact: any): string | null {
    if (!contact) {
      return null;
    }

    const firstName = contact.first_name || '';
    const lastName = contact.last_name || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return null;
  }
}
