import { Test, TestingModule } from '@nestjs/testing';
import { TestDataFactory } from '../common/test-data.factory';
import { MockEmailService } from '../email/email.mock';
import { EmailService } from '../email/email.service';
import { MockFirebaseService } from '../firebase/firebase.mock';
import { FirebaseService } from '../firebase/firebase.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockFirebaseService: MockFirebaseService;
  let mockEmailService: MockEmailService;

  beforeEach(async () => {
    mockFirebaseService = new MockFirebaseService();
    mockEmailService = new MockEmailService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    mockFirebaseService.clearAll();
    mockEmailService.clearSentEmails();
  });

  describe('registerUser', () => {
    it('should successfully register a new user with complete data', async () => {
      // Arrange
      const registerDto = TestDataFactory.createRegisterUserDto();

      // Act
      const result = await service.registerUser(registerDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.uid).toBeDefined();
      expect(result.email).toBe(registerDto.email);
      expect(result.displayName).toBe(`${registerDto.firstName} ${registerDto.lastName}`);
    });

    it('should create parent document in Firestore', async () => {
      // Arrange
      const registerDto = TestDataFactory.createRegisterUserDto();

      // Act
      const result = await service.registerUser(registerDto);

      // Assert
      const parentData = mockFirebaseService.getData('parents', result.uid);
      expect(parentData).toBeDefined();
      expect(parentData.email).toBe(registerDto.email);
      expect(parentData.nom).toBe(registerDto.lastName);
      expect(parentData.prenom).toBe(registerDto.firstName);
      expect(parentData.telephone).toBe(registerDto.telephone);
      expect(parentData.ville).toBe(registerDto.ville);
      expect(parentData.nombre_enfants).toBe(registerDto.numberOfChildren);
      expect(parentData.statut_compte).toBe('actif');
    });

    it('should set custom user claims when roles are provided', async () => {
      // Arrange
      const registerDto = TestDataFactory.createRegisterUserDto({
        roles: ['parent', 'admin'],
      });

      // Act
      const result = await service.registerUser(registerDto);

      // Assert
      expect(result).toBeDefined();
      // In a real test, we'd verify the custom claims were set
      // For now, we just ensure no error was thrown
    });

    it('should send welcome email after registration', async () => {
      // Arrange
      const registerDto = TestDataFactory.createRegisterUserDto();

      // Act
      await service.registerUser(registerDto);

      // Wait a bit for async email sending
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      const sentEmails = mockEmailService.getSentEmails();
      expect(sentEmails.length).toBeGreaterThan(0);
      
      const welcomeEmail = sentEmails.find(e => e.type === 'welcome');
      expect(welcomeEmail).toBeDefined();
      expect(welcomeEmail?.to).toBe(registerDto.email);
      expect(welcomeEmail?.data.firstName).toBe(registerDto.firstName);
    });

    it('should handle registration without optional fields', async () => {
      // Arrange
      const registerDto = TestDataFactory.createRegisterUserDto({
        profileImage: undefined,
        roles: undefined,
      });

      // Act
      const result = await service.registerUser(registerDto);

      // Assert
      expect(result).toBeDefined();
      const parentData = mockFirebaseService.getData('parents', result.uid);
      expect(parentData.image_profil).toBe('');
    });
  });
});
