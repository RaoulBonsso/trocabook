import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  private collectionName = 'notifications';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collectionName).doc();
    const notification: Notification = {
      id: docRef.id,
      ...createNotificationDto,
      lu: false,
      date_envoi: new Date(),
    };
    await docRef.set(notification);
    return notification;
  }

  async findAllForUser(userId: string): Promise<Notification[]> {
    const firestore = this.firebaseService.getFirestore();
    const snapshot = await firestore.collection(this.collectionName)
      .where('parent_id', '==', userId)
      .orderBy('date_envoi', 'desc')
      .get();
      
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            date_envoi: data.date_envoi?.toDate ? data.date_envoi.toDate() : data.date_envoi
        } as Notification;
    });
  }

  async markAsRead(id: string): Promise<void> {
    const firestore = this.firebaseService.getFirestore();
    await firestore.collection(this.collectionName).doc(id).update({ lu: true });
  }
}
