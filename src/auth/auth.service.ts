import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { LoginDto } from '../users/dto/login.dto';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UsersService,
  ) {}


  /**
   * Authenticates a user with email and password.
   * Internal logic relies on Firebase to verify credentials.
   * @param loginDto object containing email and password
   * @returns Tokens (access, refresh) and expiration time
   */
  async login({ email, password }: LoginDto) {
    const { idToken, refreshToken, expiresIn } =
      await this.firebaseService.signInWithEmailAndPassword(email, password);
    return { idToken, refreshToken, expiresIn };
  }

  /**
   * Logs out a user by revoking their refresh token in Firebase.
   * @param token The ID token of the user
   */
  async logout(token: string) {
    const { uid } = await this.firebaseService.verifyIdToken(token);
    return await this.firebaseService.revokeRefreshToken(uid);
  }

  /**
   * Refreshes the ID token using the refresh token.
   * @param refreshToken valid refresh token
   * @returns New ID token and refresh token
   */
  async refreshAuthToken(refreshToken: string) {
    return await this.firebaseService.refreshAuthToken(refreshToken);
  }

  async loginWithGoogle(idToken: string) {
    const decodedToken = await this.firebaseService.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists in Firestore
    let parent = await this.usersService.findOne(uid);

    if (!parent) {
      // Create parent profile if it doesn't exist
      const [firstName, ...lastNameParts] = (name || '').split(' ');
      const lastName = lastNameParts.join(' ') || 'User';
      
      const firestore = this.firebaseService.getFirestore();
      const parentData = {
        id: uid,
        nom: lastName,
        prenom: firstName || 'Google',
        email: email,
        telephone: '',
        ville: '',
        localisation_lat: 0,
        localisation_lng: 0,
        image_profil: picture || '',
        nombre_enfants: 0,
        cgu_valide: false, // Must be validated later or assumed if Google used? Usually better to ask.
        note_moyenne: 0,
        nombre_echanges: 0,
        statut_compte: 'actif',
        date_inscription: new Date(),
        derniere_connexion: new Date(),
      };
      await firestore.collection('parents').doc(uid).set(parentData);
      parent = parentData;
    }

    return { idToken, user: parent };
  }

  async loginWithPhone(idToken: string) {
    const decodedToken = await this.firebaseService.verifyIdToken(idToken);
    const { uid, phone_number } = decodedToken;

    // Check if user exists in Firestore
    let parent = await this.usersService.findOne(uid);

    if (!parent) {
      // Create parent profile if it doesn't exist
      const firestore = this.firebaseService.getFirestore();
      const parentData = {
        id: uid,
        nom: 'User',
        prenom: 'Phone',
        email: '',
        telephone: phone_number || '',
        ville: '',
        localisation_lat: 0,
        localisation_lng: 0,
        image_profil: '',
        nombre_enfants: 0,
        cgu_valide: false,
        note_moyenne: 0,
        nombre_echanges: 0,
        statut_compte: 'actif',
        date_inscription: new Date(),
        derniere_connexion: new Date(),
      };
      await firestore.collection('parents').doc(uid).set(parentData);
      parent = parentData;
    }

    return { idToken, user: parent };
  }
}


