import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateEnfantDto } from './dto/create-enfant.dto';
import { UpdateEnfantDto } from './dto/update-enfant.dto';
import { Enfant } from './entities/enfant.entity';

@Injectable()
export class EnfantsService {
  private collectionName = 'enfants';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createEnfantDto: CreateEnfantDto): Promise<Enfant> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc();
    const enfant: Enfant = {
      id: docRef.id,
      ...createEnfantDto,
    };
    await docRef.set(enfant);
    return enfant;
  }

  async findAll(): Promise<Enfant[]> {
    const firestore = this.firebaseService.getFirestore();
    const snapshot = await firestore.collection(this.collectionName).get();
    return snapshot.docs.map((doc) => doc.data() as Enfant);
  }

  async findOne(id: string): Promise<Enfant> {
    const firestore = this.firebaseService.getFirestore();
    const doc = await firestore.collection(this.collectionName).doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Enfant with ID ${id} not found`);
    }
    return doc.data() as Enfant;
  }

  async update(id: string, updateEnfantDto: UpdateEnfantDto): Promise<Enfant> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Enfant with ID ${id} not found`);
    }
    await docRef.update({ ...updateEnfantDto });
    const updatedDoc = await docRef.get();
    return updatedDoc.data() as Enfant;
  }

  async remove(id: string): Promise<void> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Enfant with ID ${id} not found`);
    }
    await docRef.delete();
  }
}
