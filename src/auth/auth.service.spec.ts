import { Test, TestingModule } from '@nestjs/testing';
import { TestDataFactory } from '../common/test-data.factory';
import { MockFirebaseService } from '../firebase/firebase.mock';
import { FirebaseService } from '../firebase/firebase.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockFirebaseService: MockFirebaseService;

  beforeEach(async () => {
    mockFirebaseService = new MockFirebaseService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: FirebaseService,
          useValue: mockFirebaseService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    mockFirebaseService.clearAll();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const loginDto = TestDataFactory.createLoginDto();
      
      // Create a user first
      await mockFirebaseService.createUser({
        displayName: 'Jean Dupont',
        email: loginDto.email,
        password: loginDto.password,
      });

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.idToken).toContain('mock_id_token_');
      expect(result.refreshToken).toContain('mock_refresh_token_');
      expect(result.expiresIn).toBe('3600');
    });

    it('should throw error with invalid credentials', async () => {
      // Arrange
      const loginDto = TestDataFactory.createLoginDto({
        email: 'nonexistent@example.com',
      });

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow('User not found');
    });
  });

  describe('logout', () => {
    it('should successfully logout with valid token', async () => {
      // Arrange
      const user = await mockFirebaseService.createUser({
        displayName: 'Jean Dupont',
        email: 'jean@example.com',
        password: 'password123',
      });
      const token = `mock_id_token_${user.uid}`;

      // Act & Assert - should not throw
      await expect(service.logout(token)).resolves.not.toThrow();
    });

    it('should throw error with invalid token', async () => {
      // Arrange
      const invalidToken = 'mock_id_token_invalid_user';

      // Act & Assert
      await expect(service.logout(invalidToken)).rejects.toThrow('Invalid token');
    });
  });

  describe('refreshAuthToken', () => {
    it('should successfully refresh token with valid refresh token', async () => {
      // Arrange
      const user = await mockFirebaseService.createUser({
        displayName: 'Jean Dupont',
        email: 'jean@example.com',
        password: 'password123',
      });
      const refreshToken = `mock_refresh_token_${user.uid}`;

      // Act
      const result = await service.refreshAuthToken(refreshToken);

      // Assert
      expect(result).toBeDefined();
      expect(result.idToken).toContain('mock_id_token_');
      expect(result.idToken).toContain('_refreshed');
      expect(result.refreshToken).toContain('mock_refresh_token_');
      expect(result.refreshToken).toContain('_refreshed');
      expect(result.expiresIn).toBe('3600');
    });
  });
});
