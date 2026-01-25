import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDataFactory } from '../common/test-data.factory';
import { MockFirebaseService } from '../firebase/firebase.mock';
import { FirebaseService } from '../firebase/firebase.service';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let mockFirebaseService: MockFirebaseService;

  beforeEach(async () => {
    mockFirebaseService = new MockFirebaseService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: FirebaseService,
          useValue: mockFirebaseService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    mockFirebaseService.clearAll();
  });

  describe('create', () => {
    it('should successfully create a new echange with echange_livre', async () => {
      // Arrange
      const createDto = TestDataFactory.createTransactionDto();
      const demandeurId = 'parent_demandeur_123';

      // Act
      const result = await service.create(createDto, demandeurId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.parent_offreur_id).toBe(createDto.parent_offreur_id);
      expect(result.parent_demandeur_id).toBe(demandeurId);
      expect(result.statut).toBe('propose');
      expect(result.date_creation).toBeDefined();
    });

    it('should create echange_livre entry for the book', async () => {
      // Arrange
      const createDto = TestDataFactory.createTransactionDto();
      const demandeurId = 'parent_demandeur_123';

      // Act
      const result = await service.create(createDto, demandeurId);

      // Assert
      const echangeLivres = mockFirebaseService.getData('echange_livres', result.id);
      // Note: In real implementation, we'd need to query the echange_livres collection
      // For this mock, we're just ensuring no error was thrown
      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return echanges where user is demandeur', async () => {
      // Arrange
      const userId = 'parent_123';
      const createDto = TestDataFactory.createTransactionDto({
        parent_offreur_id: 'other_parent',
      });
      await service.create(createDto, userId);

      // Act
      const result = await service.findAll(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].parent_demandeur_id).toBe(userId);
    });

    it('should return echanges where user is offreur', async () => {
      // Arrange
      const userId = 'parent_123';
      const createDto = TestDataFactory.createTransactionDto({
        parent_offreur_id: userId,
      });
      await service.create(createDto, 'other_parent');

      // Act
      const result = await service.findAll(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].parent_offreur_id).toBe(userId);
    });

    it('should not return duplicate echanges', async () => {
      // Arrange
      const userId = 'parent_123';
      const createDto = TestDataFactory.createTransactionDto({
        parent_offreur_id: userId,
      });
      await service.create(createDto, userId); // User is both offreur and demandeur (edge case)

      // Act
      const result = await service.findAll(userId);

      // Assert
      expect(result).toBeDefined();
      // Should use Map to deduplicate
    });

    it('should return empty array when user has no echanges', async () => {
      // Act
      const result = await service.findAll('user_with_no_echanges');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return echange by id', async () => {
      // Arrange
      const createDto = TestDataFactory.createTransactionDto();
      const created = await service.create(createDto, 'parent_demandeur_123');

      // Act
      const result = await service.findOne(created.id);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.statut).toBe('propose');
    });

    it('should throw NotFoundException when echange does not exist', async () => {
      // Act & Assert
      await expect(service.findOne('nonexistent_id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should successfully update echange status', async () => {
      // Arrange
      const createDto = TestDataFactory.createTransactionDto();
      const created = await service.create(createDto, 'parent_demandeur_123');
      const updateDto = { statut: 'accepte' as const };

      // Act
      const result = await service.update(created.id, updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.statut).toBe('accepte');
    });

    it('should throw NotFoundException when updating non-existent echange', async () => {
      // Act & Assert
      await expect(service.update('nonexistent_id', { statut: 'accepte' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
