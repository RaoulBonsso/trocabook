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
    // Create user in Firebase Authentication
    // We do not pass password to Firestore to avoid security risks, Auth handles it.
    const user = await this.firebaseService.createUser({
      displayName: `${dto.firstName} ${dto.lastName}`,
      email: dto.email,
      password: dto.password,
    });
    
    // If roles are provided, assign them as custom claims
    if (dto.roles?.length) {
      await this.firebaseService.setCustomUserClaims(user.uid, {
        roles: dto.roles,
      });
    }

    // Store additional parent details in Firestore 'parents' collection
    const firestore = this.firebaseService.getFirestore();
    await firestore.collection('parents').doc(user.uid).set({
      id: user.uid,
      nom: dto.lastName,
      prenom: dto.firstName,
      age: dto.age,
      nombre_enfants: dto.numberOfChildren,
      telephone: dto.telephone,
      localisation: dto.location,
      email: dto.email,
      // mot_de_passe: 'SECURED_IN_AUTH', // Not storing actual password
      date_inscription: new Date(),
    });

    return user;
  }
}