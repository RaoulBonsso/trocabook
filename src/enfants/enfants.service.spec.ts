import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDataFactory } from '../common/test-data.factory';
import { MockFirebaseService } from '../firebase/firebase.mock';
import { FirebaseService } from '../firebase/firebase.service';
import { EnfantsService } from './enfants.service';

describe('EnfantsService', () => {
  let service: EnfantsService;
  let mockFirebaseService: MockFirebaseService;

  beforeEach(async () => {
    mockFirebaseService = new MockFirebaseService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnfantsService,
        {
          provide: FirebaseService,
          useValue: mockFirebaseService,
        },
      ],
    }).compile();

    service = module.get<EnfantsService>(EnfantsService);
  });

  afterEach(() => {
    mockFirebaseService.clearAll();
  });

  describe('create', () => {
    it('should successfully create a new enfant', async () => {
      // Arrange
      const createDto = TestDataFactory.createEnfantDto();

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.nom).toBe(createDto.nom);
      expect(result.age).toBe(createDto.age);
      expect(result.classe).toBe(createDto.classe);
      expect(result.ecole).toBe(createDto.ecole);
      expect(result.matieres).toEqual(createDto.matieres);
    });

    it('should persist enfant data in Firestore', async () => {
      // Arrange
      const createDto = TestDataFactory.createEnfantDto();

      // Act
      const result = await service.create(createDto);

      // Assert
      const storedData = mockFirebaseService.getData('enfants', result.id);
      expect(storedData).toBeDefined();
      expect(storedData.parent_id).toBe(createDto.parent_id);
    });
  });

  describe('findAll', () => {
    it('should return all enfants', async () => {
      // Arrange
      const enfants = TestDataFactory.createMultipleEnfants(3, 'parent_123');
      for (const enfant of enfants) {
        await service.create(enfant);
      }

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
    });

    it('should return empty array when no enfants exist', async () => {
      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return enfant by id', async () => {
      // Arrange
      const createDto = TestDataFactory.createEnfantDto();
      const created = await service.create(createDto);

      // Act
      const result = await service.findOne(created.id);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.nom).toBe(createDto.nom);
    });

    it('should throw NotFoundException when enfant does not exist', async () => {
      // Act & Assert
      await expect(service.findOne('nonexistent_id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should successfully update enfant', async () => {
      // Arrange
      const createDto = TestDataFactory.createEnfantDto();
      const created = await service.create(createDto);
      const updateDto = { age: 11, classe: '6ème' };

      // Act
      const result = await service.update(created.id, updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.age).toBe(11);
      expect(result.classe).toBe('6ème');
      expect(result.nom).toBe(createDto.nom); // Unchanged fields remain
    });

    it('should throw NotFoundException when updating non-existent enfant', async () => {
      // Act & Assert
      await expect(service.update('nonexistent_id', { age: 11 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should successfully remove enfant', async () => {
      // Arrange
      const createDto = TestDataFactory.createEnfantDto();
      const created = await service.create(createDto);

      // Act
      await service.remove(created.id);

      // Assert
      await expect(service.findOne(created.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when removing non-existent enfant', async () => {
      // Act & Assert
      await expect(service.remove('nonexistent_id')).rejects.toThrow(NotFoundException);
    });
  });
});
