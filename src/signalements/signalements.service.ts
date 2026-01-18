import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateModerationDto } from './dto/create-moderation.dto';
import { CreateSignalementDto } from './dto/create-signalement.dto';
import { Moderation } from './entities/moderation.entity';
import { Signalement } from './entities/signalement.entity';

@Injectable()
export class SignalementsService {
  private collectionName = 'signalements';
  private moderationCollection = 'moderations';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createSignalementDto: CreateSignalementDto, auteurId: string): Promise<Signalement> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc();
    const signalement: Signalement = {
      id: docRef.id,
      auteur_id: auteurId,
      ...createSignalementDto,
      statut: 'en_attente',
      date_signalement: new Date(),
    };
    await docRef.set(signalement);
    return signalement;
  }

  async findAll(): Promise<Signalement[]> {
    const firestore = this.firebaseService.getFirestore();
    const snapshot = await firestore.collection(this.collectionName).orderBy('date_signalement', 'desc').get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            date_signalement: data.date_signalement?.toDate ? data.date_signalement.toDate() : data.date_signalement
        } as Signalement;
    });
  }

  async createModeration(createModerationDto: CreateModerationDto, moderateurId: string): Promise<Moderation> {
      const firestore = this.firebaseService.getFirestore();
      
      // Update signalement status
      const signalementRef = firestore.collection(this.collectionName).doc(createModerationDto.signalement_id);
      const signalementDoc = await signalementRef.get();
      if (!signalementDoc.exists) {
          throw new NotFoundException('Signalement not found');
      }
      await signalementRef.update({ statut: 'traite' });

      // Create moderation record
      const docRef = firestore.collection(this.moderationCollection).doc();
      const moderation: Moderation = {
          id: docRef.id,
          moderateur_id: moderateurId,
          ...createModerationDto,
          date_action: new Date(),
      };
      await docRef.set(moderation);
      return moderation;
  }
}
