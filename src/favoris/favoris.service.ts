import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateFavoriDto } from './dto/create-favori.dto';
import { Favori } from './entities/favori.entity';

@Injectable()
export class FavorisService {
  private collectionName = 'favoris';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createFavoriDto: CreateFavoriDto, userId: string): Promise<Favori> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc();
    const favori: Favori = {
      id: docRef.id,
      parent_id: userId,
      livre_id: createFavoriDto.livre_id,
      date_ajout: new Date(),
    };
    await docRef.set(favori);
    return favori;
  }

  async findAllForUser(userId: string): Promise<Favori[]> {
    const firestore = this.firebaseService.getFirestore();
    const snapshot = await firestore.collection(this.collectionName).where('parent_id', '==', userId).get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            date_ajout: data.date_ajout?.toDate ? data.date_ajout.toDate() : data.date_ajout
        } as Favori;
    });
  }

  async remove(id: string): Promise<void> {
    const firestore = this.firebaseService.getFirestore();
    await firestore.collection(this.collectionName).doc(id).delete();
  }
}
