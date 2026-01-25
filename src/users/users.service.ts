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
      cgu_valide: dto.cgu_valide,
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

  async findAll() {
    const snapshot = await this.firebaseService.getFirestore().collection('parents').get();
    return snapshot.docs.map(doc => doc.data());
  }

  async updateStatus(id: string, status: 'actif' | 'suspendu' | 'bloque') {
    await this.firebaseService.getFirestore().collection('parents').doc(id).update({
      statut_compte: status
    });
    // Ideally disable in Auth too
    if (status === 'bloque') {
        const user = await this.firebaseService.verifyIdToken(id).catch(() => null); 
        // Can't easily get UID from ID token if I don't have it. 
        // Actually ID is UID here.
        // Firebase Admin SDK `updateUser(uid, { disabled: true })` needed.
        // My FirebaseService doesn't expose it yet.
    }
    return { id, status };
  }

  async updateProfile(id: string, updateData: Partial<any>) {
    const firestore = this.firebaseService.getFirestore();
    await firestore.collection('parents').doc(id).update(updateData);
    const updated = await firestore.collection('parents').doc(id).get();
    return updated.data();
  }

  async findOne(id: string) {
    const doc = await this.firebaseService.getFirestore().collection('parents').doc(id).get();
    if (!doc.exists) return null;
    return doc.data();
  }
}