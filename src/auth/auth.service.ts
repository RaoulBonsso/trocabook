import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { LoginDto } from '../users/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseService: FirebaseService) {}

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
}
