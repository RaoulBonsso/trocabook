import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebaseAdmin from 'firebase-admin';
import { FirebaseConfigService } from './firebase-config.service';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';


@Global()
@Module({})
export class FirebaseModule {
  static forRoot(): DynamicModule {
    const firebaseConfigProvider = {
      provide: FirebaseConfigService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('FIREBASE_API_KEY');
        if (!apiKey) {
          throw new Error('FIREBASE_API_KEY environment variable is not set');
        }
        return new FirebaseConfigService(apiKey);
      },
    };

    const firebaseProvider = {
      provide: 'FIREBASE_ADMIN',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const credentials = configService.get<string>(
          'FIREBASE_ADMIN_CREDENTIALS',
        );
        if (!credentials) {
          throw new Error(
            'FIREBASE_ADMIN_CREDENTIALS environment variable is not set',
          );
        }

        let serviceAccount;
        
        // 1. Try treating it as a JSON string directly
        if (credentials.trim().startsWith('{')) {
           try {
             serviceAccount = JSON.parse(credentials);
           } catch (e) {
             throw new Error('Invalid JSON in FIREBASE_ADMIN_CREDENTIALS');
           }
        } 
        // 2. Try treating it as a Base64 encoded string (common for deployment secrets)
        else if (!credentials.includes('/') && !credentials.includes('\\') && !credentials.endsWith('.json')) {
             try {
                const buffer = Buffer.from(credentials, 'base64');
                const decoded = buffer.toString('utf-8');
                serviceAccount = JSON.parse(decoded);
             } catch (e) {
                // If base64 fails, might be a malformed path or string, proceeding to check file path
             }
        }

        // 3. If still null, try treating it as a file path
        if (!serviceAccount) {
          const path = await import('path');
          const fs = await import('fs');
          const resolvedPath = path.resolve(process.cwd(), credentials);
          
          if (fs.existsSync(resolvedPath)) {
            const fileContent = fs.readFileSync(resolvedPath, 'utf8');
            try {
              serviceAccount = JSON.parse(fileContent);
            } catch (e) {
               throw new Error(`Invalid JSON in credential file at ${resolvedPath}`);
            }
          } else {
             throw new Error(
              'FIREBASE_ADMIN_CREDENTIALS must be a JSON string, a Base64 encoded JSON string, or a valid file path.'
             );
          }
        }

        firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert(serviceAccount),
        });

        return firebaseAdmin;
      },
    };

    return {
      module: FirebaseModule,
      controllers: [FirebaseController],
      providers: [firebaseConfigProvider, firebaseProvider, FirebaseService],
      exports: [firebaseConfigProvider, firebaseProvider, FirebaseService],
    };
  }
}
