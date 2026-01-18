import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { Evaluation } from './entities/evaluation.entity';

@Injectable()
export class EvaluationsService {
  private collectionName = 'evaluations';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createEvaluationDto: CreateEvaluationDto, evaluateurId: string): Promise<Evaluation> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc();
    const evaluation: Evaluation = {
        id: docRef.id,
        evaluateur_id: evaluateurId,
        ...createEvaluationDto,
        date_evaluation: new Date(),
    };
    await docRef.set(evaluation);
    
    // Optional: Update user's average rating (note_moyenne)
    // This requires fetching all evaluations for the user and recalculating, or keeping a running average.
    // For simplicity, skipping for now, but should be noted.
    
    return evaluation;
  }

  async findAllForUser(userId: string): Promise<Evaluation[]> {
    const firestore = this.firebaseService.getFirestore();
    const snapshot = await firestore.collection(this.collectionName).where('evalue_id', '==', userId).get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            date_evaluation: data.date_evaluation?.toDate ? data.date_evaluation.toDate() : data.date_evaluation
        } as Evaluation;
    });
  }
}
