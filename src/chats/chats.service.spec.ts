import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDataFactory } from '../common/test-data.factory';
import { MockEmailService } from '../email/email.mock';
import { EmailService } from '../email/email.service';
import { MockFirebaseService } from '../firebase/firebase.mock';
import { FirebaseService } from '../firebase/firebase.service';
import { ChatsService } from './chats.service';

describe('ChatsService', () => {
  let service: ChatsService;
  let mockFirebaseService: MockFirebaseService;
  let mockEmailService: MockEmailService;

  beforeEach(async () => {
    mockFirebaseService = new MockFirebaseService();
    mockEmailService = new MockEmailService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: FirebaseService,
          useValue: mockFirebaseService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
  });

  afterEach(() => {
    mockFirebaseService.clearAll();
    mockEmailService.clearSentEmails();
  });

  describe('createChat', () => {
    it('should successfully create a new chat', async () => {
      // Arrange
      const createDto = TestDataFactory.createChatDto();

      // Act
      const result = await service.createChat(createDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.echange_id).toBe(createDto.echange_id);
      expect(result.statut).toBe('actif');
      expect(result.date_creation).toBeDefined();
    });
  });

  describe('findChatByEchangeId', () => {
    it('should return chat by echange_id', async () => {
      // Arrange
      const createDto = TestDataFactory.createChatDto();
      const created = await service.createChat(createDto);

      // Act
      const result = await service.findChatByEchangeId(createDto.echange_id);

      // Assert
      expect(result).toBeDefined();
      expect(result?.id).toBe(created.id);
      expect(result?.echange_id).toBe(createDto.echange_id);
    });

    it('should return null when no chat exists for echange_id', async () => {
      // Act
      const result = await service.findChatByEchangeId('nonexistent_echange');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findOneChat', () => {
    it('should return chat by id', async () => {
      // Arrange
      const createDto = TestDataFactory.createChatDto();
      const created = await service.createChat(createDto);

      // Act
      const result = await service.findOneChat(created.id);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
    });

    it('should throw NotFoundException when chat does not exist', async () => {
      // Act & Assert
      await expect(service.findOneChat('nonexistent_id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('sendMessage', () => {
    it('should successfully send a message in a chat', async () => {
      // Arrange
      const chatDto = TestDataFactory.createChatDto();
      const chat = await service.createChat(chatDto);
      const messageDto = TestDataFactory.createMessageDto();
      const userId = 'parent_sender_123';

      // Act
      const result = await service.sendMessage(chat.id, messageDto, userId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.chat_id).toBe(chat.id);
      expect(result.expediteur_id).toBe(userId);
      expect(result.contenu).toBe(messageDto.contenu);
      expect(result.date_envoi).toBeDefined();
    });

    it('should throw NotFoundException when chat does not exist', async () => {
      // Arrange
      const messageDto = TestDataFactory.createMessageDto();

      // Act & Assert
      await expect(
        service.sendMessage('nonexistent_chat', messageDto, 'user_123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should send email notification to recipient', async () => {
      // Arrange
      const echangeData = TestDataFactory.createEchangeData();
      const firestore = mockFirebaseService.getFirestore();
      await firestore.collection('echanges').doc(echangeData.id).set(echangeData);

      // Create parent documents
      const offreurData = TestDataFactory.createParentData({
        id: echangeData.parent_offreur_id,
        email: 'offreur@example.com',
        prenom: 'Marie',
      });
      const demandeurData = TestDataFactory.createParentData({
        id: echangeData.parent_demandeur_id,
        email: 'demandeur@example.com',
        prenom: 'Pierre',
      });
      await firestore.collection('parents').doc(offreurData.id).set(offreurData);
      await firestore.collection('parents').doc(demandeurData.id).set(demandeurData);

      const chatDto = TestDataFactory.createChatDto({ echange_id: echangeData.id });
      const chat = await service.createChat(chatDto);
      const messageDto = TestDataFactory.createMessageDto();

      // Act
      await service.sendMessage(chat.id, messageDto, echangeData.parent_demandeur_id);

      // Wait for async email
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      const sentEmails = mockEmailService.getSentEmails();
      const notification = sentEmails.find(e => e.type === 'message_notification');
      expect(notification).toBeDefined();
      expect(notification?.to).toBe('offreur@example.com');
    });
  });

  describe('findAllMessages', () => {
    it('should return all messages in a chat ordered by date', async () => {
      // Arrange
      const chatDto = TestDataFactory.createChatDto();
      const chat = await service.createChat(chatDto);
      const userId = 'parent_123';

      // Send multiple messages
      await service.sendMessage(chat.id, { contenu: 'Message 1', image: '' }, userId);
      await service.sendMessage(chat.id, { contenu: 'Message 2', image: '' }, userId);
      await service.sendMessage(chat.id, { contenu: 'Message 3', image: '' }, userId);

      // Act
      const result = await service.findAllMessages(chat.id);

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].contenu).toBe('Message 1');
      expect(result[2].contenu).toBe('Message 3');
    });

    it('should return empty array when chat has no messages', async () => {
      // Arrange
      const chatDto = TestDataFactory.createChatDto();
      const chat = await service.createChat(chatDto);

      // Act
      const result = await service.findAllMessages(chat.id);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
