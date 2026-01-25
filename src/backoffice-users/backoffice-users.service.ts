import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateBackofficeUserDto } from './dto/create-backoffice-user.dto';
import { UpdateBackofficeUserDto } from './dto/update-backoffice-user.dto';
import { BackofficeUser } from './entities/backoffice-user.entity';

import { LoginBackofficeUserDto } from './dto/login-backoffice-user.dto';

@Injectable()
export class BackofficeUsersService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async login(loginBackofficeUserDto: LoginBackofficeUserDto) {
    const { email, password } = loginBackofficeUserDto;
    try {
      // 1. Authenticate with Firebase Auth
      const authResult = await this.firebaseService.signInWithEmailAndPassword(email, password);
      
      // 2. Get user details from Firestore
      const user = await this.findOne(authResult.localId);
      
      return {
        user,
        tokens: {
          idToken: authResult.idToken,
          refreshToken: authResult.refreshToken,
          expiresIn: authResult.expiresIn,
        },
      };
    } catch (error) {
       throw new BadRequestException('Invalid credentials');
    }
  }

  async create(createBackofficeUserDto: CreateBackofficeUserDto): Promise<BackofficeUser> {
    const { email, password, nom, prenom, role } = createBackofficeUserDto;

    try {
      // 1. Create user in Firebase Auth
      const userRecord = await this.firebaseService.createUser({
        email,
        password,
        displayName: `${prenom} ${nom}`,
      });

      // 2. Set custom claims for role
      await this.firebaseService.setCustomUserClaims(userRecord.uid, { role });

      // 3. Store user details in Firestore
      const newUser: BackofficeUser = {
        id: userRecord.uid,
        email,
        nom,
        prenom,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.firebaseService
        .getFirestore()
        .collection('backoffice_users')
        .doc(userRecord.uid)
        .set(newUser);

      return newUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<BackofficeUser[]> {
    const snapshot = await this.firebaseService
      .getFirestore()
      .collection('backoffice_users')
      .get();
    
    return snapshot.docs.map((doc) => doc.data() as BackofficeUser);
  }

  async findOne(id: string): Promise<BackofficeUser> {
    const doc = await this.firebaseService
      .getFirestore()
      .collection('backoffice_users')
      .doc(id)
      .get();

    if (!doc.exists) {
      throw new BadRequestException('User not found');
    }

    return doc.data() as BackofficeUser;
  }

  async update(id: string, updateBackofficeUserDto: UpdateBackofficeUserDto) {
    const docRef = this.firebaseService.getFirestore().collection('backoffice_users').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new BadRequestException('User not found');
    }

    const updatedData = {
      ...updateBackofficeUserDto,
      updatedAt: new Date(),
    };

    // Remove undefined fields
    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key],
    );

    // If role is updated, update custom claims
    if (updateBackofficeUserDto.role) {
      await this.firebaseService.setCustomUserClaims(id, { role: updateBackofficeUserDto.role });
    }

    await docRef.update(updatedData);
    return { ...doc.data(), ...updatedData };
  }

  async remove(id: string) {
    // Delete from Auth
    await this.firebaseService.getFirestore().collection('backoffice_users').doc(id).delete();
    // Ideally delete from Auth too, but FirebaseAdmin SDK is needed for that. 
    // The FirebaseService doesn't expose deleteUser yet. 
    // For now, just deleting from Firestore is "deleting" from the app perspective, 
    // but the Auth account remains. 
    // TODO: Add deleteUser to FirebaseService if needed.
    return { message: 'User deleted successfully' };
  }
}
