import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDataFactory } from '../common/test-data.factory';
import { MockFirebaseService } from '../firebase/firebase.mock';
import { FirebaseService } from '../firebase/firebase.service';
import { LivresService } from './livres.service';

describe('LivresService', () => {
  let service: LivresService;
  let mockFirebaseService: MockFirebaseService;

  beforeEach(async () => {
    mockFirebaseService = new MockFirebaseService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LivresService,
        {
          provide: FirebaseService,
          useValue: mockFirebaseService,
        },
      ],
    }).compile();

    service = module.get<LivresService>(LivresService);
  });

  afterEach(() => {
    mockFirebaseService.clearAll();
  });

  describe('create', () => {
    it('should successfully create a new livre', async () => {
      // Arrange
      const createDto = TestDataFactory.createLivreDto();
      const userId = 'parent_123';

      // Act
      const result = await service.create(createDto, userId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.titre).toBe(createDto.titre);
      expect(result.matiere).toBe(createDto.matiere);
      expect(result.classe).toBe(createDto.classe);
      expect(result.proprietaire_id).toBe(userId);
      expect(result.date_ajout).toBeDefined();
      expect(result.disponible).toBe(true);
    });

    it('should set disponible to true by default', async () => {
      // Arrange
      const createDto = TestDataFactory.createLivreDto({ disponible: undefined });
      const userId = 'parent_123';

      // Act
      const result = await service.create(createDto, userId);

      // Assert
      expect(result.disponible).toBe(true);
    });
  });

  describe('findAll', () => {
    it('should return all livres', async () => {
      // Arrange
      const livres = TestDataFactory.createMultipleLivres(3, 'parent_123');
      for (const livre of livres) {
        await service.create(livre, 'parent_123');
      }

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
    });

    it('should return empty array when no livres exist', async () => {
      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
    });

    it('should convert Firestore timestamps to Date objects', async () => {
      // Arrange
      const createDto = TestDataFactory.createLivreDto();
      await service.create(createDto, 'parent_123');

      // Act
      const result = await service.findAll();

      // Assert
      expect(result[0].date_ajout).toBeInstanceOf(Date);
    });
  });

  describe('findOne', () => {
    it('should return livre by id', async () => {
      // Arrange
      const createDto = TestDataFactory.createLivreDto();
      const created = await service.create(createDto, 'parent_123');

      // Act
      const result = await service.findOne(created.id);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.titre).toBe(createDto.titre);
    });

    it('should throw NotFoundException when livre does not exist', async () => {
      // Act & Assert
      await expect(service.findOne('nonexistent_id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should successfully update livre', async () => {
      // Arrange
      const createDto = TestDataFactory.createLivreDto();
      const created = await service.create(createDto, 'parent_123');
      const updateDto = {
        etat: 'moyen' as const,
        disponible: false,
        statut: 'en_negociation' as const,
      };

      // Act
      const result = await service.update(created.id, updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.etat).toBe('moyen');
      expect(result.disponible).toBe(false);
      expect(result.statut).toBe('en_negociation');
      expect(result.titre).toBe(createDto.titre); // Unchanged fields remain
    });

    it('should throw NotFoundException when updating non-existent livre', async () => {
      // Act & Assert
      await expect(service.update('nonexistent_id', { etat: 'bon' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should successfully remove livre', async () => {
      // Arrange
      const createDto = TestDataFactory.createLivreDto();
      const created = await service.create(createDto, 'parent_123');

      // Act
      await service.remove(created.id);

      // Assert
      await expect(service.findOne(created.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when removing non-existent livre', async () => {
      // Act & Assert
      await expect(service.remove('nonexistent_id')).rejects.toThrow(NotFoundException);
    });
  });
});
