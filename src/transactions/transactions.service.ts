import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  private collectionName = 'transactions';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createTransactionDto: CreateTransactionDto, buyerId: string): Promise<Transaction> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc();
    
    // Convert rendezvous_date string to Date if present
    const rdvDate = createTransactionDto.rendezvous_date ? new Date(createTransactionDto.rendezvous_date) : undefined;

    const transaction: Transaction = {
      id: docRef.id,
      livre_id: createTransactionDto.livre_id,
      vendeur_id: createTransactionDto.vendeur_id,
      acheteur_id: buyerId,
      type_transaction: createTransactionDto.type_transaction,
      statut: 'en_cours',
      date_transaction: new Date(),
      rendezvous_localisation: createTransactionDto.rendezvous_localisation,
      rendezvous_date: rdvDate,
    };
    await docRef.set(transaction);
    return transaction;
  }

  async findAll(userId: string): Promise<Transaction[]> {
    const firestore = this.firebaseService.getFirestore();
    // In a real app, we need composite indexes for OR queries or separate queries.
    // Allow filtering by buyer OR seller.
    // Firestore doesn't support OR queries easily in old versions, but in recent SDKs using 'where' + 'in' or multiple queries works.
    // For MVP, we can fetch where buyer == userId and where seller == userId and merge.
    
    const buyerQuery = firestore.collection(this.collectionName).where('acheteur_id', '==', userId).get();
    const sellerQuery = firestore.collection(this.collectionName).where('vendeur_id', '==', userId).get();

    const [buyerSnapshot, sellerSnapshot] = await Promise.all([buyerQuery, sellerQuery]);
    
    const transactions = new Map<string, Transaction>(); // Use map to de-duplicate if any

    const processDoc = (doc: any) => {
        const data = doc.data();
        const t = {
            ...data,
            date_transaction: data.date_transaction?.toDate ? data.date_transaction.toDate() : data.date_transaction,
            rendezvous_date: data.rendezvous_date?.toDate ? data.rendezvous_date.toDate() : data.rendezvous_date,
        } as Transaction;
        transactions.set(t.id, t);
    };

    buyerSnapshot.forEach(processDoc);
    sellerSnapshot.forEach(processDoc);

    return Array.from(transactions.values());
  }

  async findOne(id: string): Promise<Transaction> {
    const firestore = this.firebaseService.getFirestore();
    const doc = await firestore.collection(this.collectionName).doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    const data = doc.data()!;
    return {
        ...data,
        date_transaction: data.date_transaction?.toDate ? data.date_transaction.toDate() : data.date_transaction,
        rendezvous_date: data.rendezvous_date?.toDate ? data.rendezvous_date.toDate() : data.rendezvous_date,
    } as Transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    const updates: any = { ...updateTransactionDto };
    if (updateTransactionDto.rendezvous_date) {
        updates.rendezvous_date = new Date(updateTransactionDto.rendezvous_date);
    }

    await docRef.update(updates);
    const updatedDoc = await docRef.get();
    const data = updatedDoc.data()!;
    return {
        ...data,
        date_transaction: data.date_transaction?.toDate ? data.date_transaction.toDate() : data.date_transaction,
        rendezvous_date: data.rendezvous_date?.toDate ? data.rendezvous_date.toDate() : data.rendezvous_date,
    } as Transaction;
  }
}
