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
      statut: createLivreDto.statut || 'disponible',
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

  async search(query: {
    matiere?: string;
    classe?: string;
    ville?: string;
    lat?: number;
    lng?: number;
    distanceMax?: number; // in km
  }): Promise<Livre[]> {
    const firestore = this.firebaseService.getFirestore();
    let q: any = firestore.collection(this.collectionName).where('disponible', '==', true);

    if (query.matiere) q = q.where('matiere', '==', query.matiere);
    if (query.classe) q = q.where('classe', '==', query.classe);

    const snapshot = await q.get();
    let livres = snapshot.docs.map((doc) => ({
      ...doc.data(),
      date_ajout: doc.data().date_ajout?.toDate ? doc.data().date_ajout.toDate() : doc.data().date_ajout,
    })) as Livre[];

    if (query.lat !== undefined && query.lng !== undefined && query.distanceMax !== undefined) {
      livres = livres.filter((livre) => {
        const dist = this.getDistance(query.lat!, query.lng!, livre.localisation_lat, livre.localisation_lng);
        return dist <= query.distanceMax!;
      });
    }


    return livres;
  }

  private getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async updateStatut(id: string, statut: 'disponible' | 'en_negociation' | 'echange') {
    const firestore = this.firebaseService.getFirestore();
    const disponible = statut === 'disponible';
    await firestore.collection(this.collectionName).doc(id).update({ statut, disponible });
    return this.findOne(id);
  }
}

