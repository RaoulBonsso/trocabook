import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as firebaseAdmin from 'firebase-admin';
import { CreateRequest, DecodedIdToken, UserRecord } from 'firebase-admin/auth';
import { FirebaseConfigService } from './firebase-config.service';


@Injectable()
export class FirebaseService {
    private readonly apiKey: string;

  constructor(firebaseConfig: FirebaseConfigService) {
    this.apiKey = firebaseConfig.apiKey;
  }

    async verifyIdToken(
    token: string,
    checkRevoked = false,
  ): Promise<DecodedIdToken> {
    return (await firebaseAdmin
      .auth()
      .verifyIdToken(token, checkRevoked)
      .catch(this.handleFirebaseAuthError)) as DecodedIdToken;
  }


    private handleFirebaseAuthError(error: any) {
    if (error.code?.startsWith('auth/')) {
      throw new BadRequestException(error.message);
    }
    throw new Error(error.message);
  }
   private async sendRefreshAuthTokenRequest(refreshToken: string) {
    const url = `https://securetoken.googleapis.com/v1/token?key=${this.apiKey}`;
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    return await this.sendPostRequest(url, payload);
  }

  private async sendPostRequest(url: string, data: any) {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  }

   async signInWithEmailAndPassword(email: string, password: string) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
    return await this.sendPostRequest(url, {
      email,
      password,
      returnSecureToken: true,
    }).catch(this.handleRestApiError);
  }

  async revokeRefreshToken(uid: string) {
    return await firebaseAdmin
      .auth()
      .revokeRefreshTokens(uid)
      .catch(this.handleFirebaseAuthError);
  }
  private handleRestApiError(error: any) {
    if (error.response?.data?.error?.code === 400) {
      const messageKey = error.response?.data?.error?.message;
      const message =
        {
          INVALID_LOGIN_CREDENTIALS: 'Invalid login credentials',
          INVALID_REFRESH_TOKEN: 'Invalid refresh token',
          TOKEN_EXPIRED: 'Token expired',
          USER_DISABLED: 'User disabled',
        }[messageKey] ?? messageKey;
      throw new BadRequestException(message);
    }
    throw new Error(error.message);
  }
  async refreshAuthToken(refreshToken: string) {
    const {
      id_token: idToken,
      refresh_token: newRefreshToken,
      expires_in: expiresIn,
    } = await this.sendRefreshAuthTokenRequest(refreshToken).catch(
      this.handleRestApiError,
    );
    return {
      idToken,
      refreshToken: newRefreshToken,
      expiresIn,
    };
  }
  async createUser(props: CreateRequest): Promise<UserRecord> {
    return (await firebaseAdmin
      .auth()
      .createUser(props)
      .catch(this.handleFirebaseAuthError)) as UserRecord;
  }
  async setCustomUserClaims(uid: string, claims: Record<string, any>) {
    return await firebaseAdmin.auth().setCustomUserClaims(uid, claims);
  }

  getFirestore() {
    return firebaseAdmin.firestore();
  }
}
