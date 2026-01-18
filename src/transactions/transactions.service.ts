import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { EchangeLivre } from './entities/echange-livre.entity';
import { Echange } from './entities/echange.entity';

@Injectable()
export class TransactionsService {
  private collectionName = 'echanges'; // Changed from 'transactions'
  private livresCollectionName = 'echange_livres';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createTransactionDto: CreateTransactionDto, demandeurId: string): Promise<Echange> {
    const firestore = this.firebaseService.getFirestore();
    const batch = firestore.batch();

    // Create Echange
    const echangeRef = firestore.collection(this.collectionName).doc();
    const echange: Echange = {
      id: echangeRef.id,
      parent_offreur_id: createTransactionDto.parent_offreur_id,
      parent_demandeur_id: demandeurId,
      statut: 'propose',
      date_creation: new Date(),
    };
    batch.set(echangeRef, echange);

    // Create EchangeLivre (the book being requested)
    const echangeLivreRef = firestore.collection(this.livresCollectionName).doc();
    const echangeLivre: EchangeLivre = {
      id: echangeLivreRef.id,
      echange_id: echange.id,
      livre_id: createTransactionDto.livre_id,
      role: 'donne', // The offreur gives this book
    };
    batch.set(echangeLivreRef, echangeLivre);

    await batch.commit();
    return echange;
  }

  async findAll(userId: string): Promise<Echange[]> {
    const firestore = this.firebaseService.getFirestore();
    
    // Fetch echanges where user is demandeur or offreur
    const demandeurQuery = firestore.collection(this.collectionName).where('parent_demandeur_id', '==', userId).get();
    const offreurQuery = firestore.collection(this.collectionName).where('parent_offreur_id', '==', userId).get();

    const [demandeurSnapshot, offreurSnapshot] = await Promise.all([demandeurQuery, offreurQuery]);
    
    const echanges = new Map<string, Echange>();

    const processDoc = (doc: any) => {
        const data = doc.data();
        const t = {
            ...data,
            date_creation: data.date_creation?.toDate ? data.date_creation.toDate() : data.date_creation,
            date_validation: data.date_validation?.toDate ? data.date_validation.toDate() : data.date_validation,
        } as Echange;
        echanges.set(t.id, t);
    };

    demandeurSnapshot.forEach(processDoc);
    offreurSnapshot.forEach(processDoc);

    return Array.from(echanges.values());
  }

  async findOne(id: string): Promise<Echange> {
    const firestore = this.firebaseService.getFirestore();
    const doc = await firestore.collection(this.collectionName).doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Echange with ID ${id} not found`);
    }
    const data = doc.data()!;
    return {
        ...data,
        date_creation: data.date_creation?.toDate ? data.date_creation.toDate() : data.date_creation,
        date_validation: data.date_validation?.toDate ? data.date_validation.toDate() : data.date_validation,
    } as Echange;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Echange> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Echange with ID ${id} not found`);
    }

    const updates: any = { ...updateTransactionDto };
    
    await docRef.update(updates);
    const updatedDoc = await docRef.get();
    const data = updatedDoc.data()!;
    return {
        ...data,
        date_creation: data.date_creation?.toDate ? data.date_creation.toDate() : data.date_creation,
        date_validation: data.date_validation?.toDate ? data.date_validation.toDate() : data.date_validation,
    } as Echange;
  }
}
