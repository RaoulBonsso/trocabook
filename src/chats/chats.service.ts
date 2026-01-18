import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Chat, Message } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  private chatsCollection = 'chats';

  constructor(private readonly firebaseService: FirebaseService) {}

  async createChat(createChatDto: CreateChatDto, userId: string): Promise<Chat> {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.chatsCollection).doc();
    
    // Ensure consistent ordering of parent IDs to check duplicates if needed, 
    // but for now just saving as is.
    
    const chat: Chat = {
      id: docRef.id,
      parent1_id: userId,
      parent2_id: createChatDto.other_parent_id,
      livre_id: createChatDto.livre_id,
      date_creation: new Date(),
    };
    await docRef.set(chat);
    return chat;
  }

  async findAllChats(userId: string): Promise<Chat[]> {
    const firestore = this.firebaseService.getFirestore();
    const p1Query = firestore.collection(this.chatsCollection).where('parent1_id', '==', userId).get();
    const p2Query = firestore.collection(this.chatsCollection).where('parent2_id', '==', userId).get();

    const [snap1, snap2] = await Promise.all([p1Query, p2Query]);
    
    const chats = new Map<string, Chat>();

    const processDoc = (doc: any) => {
        const data = doc.data();
        const c = {
            ...data,
            date_creation: data.date_creation?.toDate ? data.date_creation.toDate() : data.date_creation,
        } as Chat;
        chats.set(c.id, c);
    };

    snap1.forEach(processDoc);
    snap2.forEach(processDoc);
    
    return Array.from(chats.values());
  }

  async findOneChat(id: string): Promise<Chat> {
      const firestore = this.firebaseService.getFirestore();
      const doc = await firestore.collection(this.chatsCollection).doc(id).get();
      if (!doc.exists) {
          throw new NotFoundException(`Chat with ID ${id} not found`);
      }
      const data = doc.data()!;
      return {
          ...data,
          date_creation: data.date_creation?.toDate ? data.date_creation.toDate() : data.date_creation,
      } as Chat;
  }

  async sendMessage(chatId: string, createMessageDto: CreateMessageDto, userId: string): Promise<Message> {
      const firestore = this.firebaseService.getFirestore();
      // Check if chat exists first?
      const chatRef = firestore.collection(this.chatsCollection).doc(chatId);
      const chatDoc = await chatRef.get();
      if (!chatDoc.exists) {
          throw new NotFoundException(`Chat with ID ${chatId} not found`);
      }

      const messagesCollection = chatRef.collection('messages');
      const docRef = messagesCollection.doc();
      const message: Message = {
          id: docRef.id,
          chat_id: chatId,
          expediteur_id: userId,
          contenu: createMessageDto.contenu,
          date_envoi: new Date(),
      };
      await docRef.set(message);
      return message;
  }

  async findAllMessages(chatId: string): Promise<Message[]> {
      const firestore = this.firebaseService.getFirestore();
      const chatRef = firestore.collection(this.chatsCollection).doc(chatId);
      // Order by date_envoi
      const snapshot = await chatRef.collection('messages').orderBy('date_envoi').get();
      
      return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
              ...data,
              date_envoi: data.date_envoi?.toDate ? data.date_envoi.toDate() : data.date_envoi,
          } as Message;
      });
  }
}
