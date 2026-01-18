import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { FirebaseService } from '../firebase/firebase.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Registers a new user in Firebase.
   * Also assigns custom roles if provided in the DTO.
   * @param dto Data required to register (email, password, etc.)
   * @returns The created user object from Firebase
   */
  async registerUser(dto: RegisterUserDto) {
    // Create user in Firebase Authentication
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
    const parentData = {
      id: user.uid,
      nom: dto.lastName,
      prenom: dto.firstName,
      email: dto.email,
      telephone: dto.telephone,
      ville: dto.ville,
      localisation_lat: dto.latitude,
      localisation_lng: dto.longitude,
      image_profil: dto.profileImage || '',
      nombre_enfants: dto.numberOfChildren,
      note_moyenne: 0,
      nombre_echanges: 0,
      statut_compte: 'actif',
      date_inscription: new Date(),
      derniere_connexion: new Date(),
    };
    
    await firestore.collection('parents').doc(user.uid).set(parentData);

    // 🎉 Envoyer l'email de bienvenue (non-bloquant)
    this.emailService.sendWelcomeEmail(dto.email, dto.firstName).catch(err => {
      console.error('Email error (non-blocking):', err);
    });

    return user;
  }
}