import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * Registers a new user in Firebase.
   * Also assigns custom roles if provided in the DTO.
   * @param dto Data required to register (email, password, etc.)
   * @returns The created user object from Firebase
   */
  async registerUser(dto: RegisterUserDto) {
    // Create use in Firebase Authentication
    const user = await this.firebaseService.createUser({
      displayName: dto.firstName,
      email: dto.email,
      password: dto.password,
    });
    
    // If roles are provided, assign them as custom claims
    if (dto.roles?.length) {
      await this.firebaseService.setCustomUserClaims(user.uid, {
        roles: dto.roles,
      });
    }
    return user;
  }
}