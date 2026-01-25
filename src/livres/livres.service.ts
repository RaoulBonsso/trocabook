import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateLivreDto } from './dto/create-livre.dto';
import { UpdateLivreDto } from './dto/update-livre.dto';
import { Livre } from './entities/livre.entity';

@Injectable()
export class LivresService {
  private collectionName = 'livres';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createLivreDto: CreateLivreDto, userId: string): Promise<Livre> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc();
    const livre: Livre = {
      id: docRef.id,
      ...createLivreDto,
      proprietaire_id: userId,
      date_ajout: new Date(),
      disponible: createLivreDto.disponible ?? true,
    };
    await docRef.set(livre);
    return livre;
  }

  async findAll(): Promise<Livre[]> {
    const firestore = this.firebaseService.getFirestore();
    const snapshot = await firestore.collection(this.collectionName).get();
    // Convert Firestore timestamps to Dates if needed, but here we stored Date object which Firestore handles
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            date_ajout: data.date_ajout?.toDate ? data.date_ajout.toDate() : data.date_ajout
        } as Livre;
    });
  }

  async findAllByOwner(userId: string): Promise<Livre[]> {
    const firestore = this.firebaseService.getFirestore();
    const snapshot = await firestore.collection(this.collectionName).where('proprietaire_id', '==', userId).get();
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            date_ajout: data.date_ajout?.toDate ? data.date_ajout.toDate() : data.date_ajout
        } as Livre;
    });
  }

  async findOne(id: string): Promise<Livre> {
    const firestore = this.firebaseService.getFirestore();
    const doc = await firestore.collection(this.collectionName).doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Livre with ID ${id} not found`);
    }
    const data = doc.data()!;
    return {
        ...data,
        date_ajout: data.date_ajout?.toDate ? data.date_ajout.toDate() : data.date_ajout
    } as Livre;
  }

  async update(id: string, updateLivreDto: UpdateLivreDto): Promise<Livre> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Livre with ID ${id} not found`);
    }
    await docRef.update({ ...updateLivreDto });
    const updatedDoc = await docRef.get();
    const data = updatedDoc.data()!;
    return {
        ...data,
        date_ajout: data.date_ajout?.toDate ? data.date_ajout.toDate() : data.date_ajout
    } as Livre;
  }

  async remove(id: string): Promise<void> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Livre with ID ${id} not found`);
    }
    await docRef.delete();
  }
}
