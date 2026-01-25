import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';


@Injectable()
export class ReputationService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async calculateReputation(userId: string): Promise<number> {
    const firestore = this.firebaseService.getFirestore();
    
    // Fetch average rating
    const evaluationsSnapshot = await firestore.collection('evaluations').where('evalue_id', '==', userId).get();
    const count = evaluationsSnapshot.size;
    if (count === 0) return 0;

    let sum = 0;
    evaluationsSnapshot.forEach(doc => {
      sum += doc.data().note;
    });

    return sum / count;
  }

  async updateBadges(userId: string) {
    const firestore = this.firebaseService.getFirestore();
    const userDoc = await firestore.collection('parents').doc(userId).get();
    const userData = userDoc.data();
    if (!userData) return;

    const badges: string[] = [];
    const transactionsSnapshot = await firestore.collection('echanges')
      .where('parent_offreur_id', '==', userId)
      .where('statut', '==', 'termine')
      .get();
    
    const count = transactionsSnapshot.size;

    if (count >= 1) badges.push('Premier Pas');
    if (count >= 5) badges.push('Echangeur Actif');
    if (count >= 10) badges.push('Expert en Troc');

    const note = await this.calculateReputation(userId);
    if (note >= 4.5 && count >= 3) badges.push('Top Vendeur');

    await firestore.collection('parents').doc(userId).update({
      badges,
      note_moyenne: note,
    });

    return badges;
  }
}
