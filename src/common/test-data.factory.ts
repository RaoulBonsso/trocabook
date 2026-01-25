/**
 * Factory for generating test data
 * Provides realistic mock data for all entities in the application
 */

export class TestDataFactory {
  static createRegisterUserDto(overrides: any = {}) {
    return {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'SecurePass123!',
      telephone: '+33612345678',
      ville: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      numberOfChildren: 2,
      profileImage: 'https://example.com/profile.jpg',
      roles: ['parent'],
      ...overrides,
    };
  }

  static createLoginDto(overrides: any = {}) {
    return {
      email: 'jean.dupont@example.com',
      password: 'SecurePass123!',
      ...overrides,
    };
  }

  static createEnfantDto(overrides: any = {}) {
    return {
      parent_id: 'parent_123',
      nom: 'Sophie',
      age: 10,
      classe: 'CM2',
      ecole: 'École Primaire Victor Hugo',
      matieres: ['Mathématiques', 'Français', 'Sciences'],
      ...overrides,
    };
  }

  static createLivreDto(overrides: any = {}) {
    return {
      titre: 'Mathématiques CM2',
      matiere: 'Mathématiques',
      classe: 'CM2',
      ecole: 'École Primaire Victor Hugo',
      etat: 'bon' as const,
      description: 'Livre de mathématiques en bon état, quelques annotations au crayon',
      images: ['https://example.com/livre1.jpg', 'https://example.com/livre2.jpg'],
      langue: 'Français',
      annee_scolaire: '2025-2026',
      disponible: true,
      statut: 'disponible' as const,
      localisation_lat: 48.8566,
      localisation_lng: 2.3522,
      ...overrides,
    };
  }

  static createTransactionDto(overrides: any = {}) {
    return {
      parent_offreur_id: 'parent_offreur_123',
      livre_id: 'livre_123',
      ...overrides,
    };
  }

  static createChatDto(overrides: any = {}) {
    return {
      echange_id: 'echange_123',
      ...overrides,
    };
  }

  static createMessageDto(overrides: any = {}) {
    return {
      contenu: 'Bonjour, le livre est-il toujours disponible ?',
      image: '',
      ...overrides,
    };
  }

  static createParentData(overrides: any = {}) {
    return {
      id: 'parent_123',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      telephone: '+33612345678',
      ville: 'Paris',
      localisation_lat: 48.8566,
      localisation_lng: 2.3522,
      image_profil: 'https://example.com/profile.jpg',
      nombre_enfants: 2,
      note_moyenne: 0,
      nombre_echanges: 0,
      statut_compte: 'actif',
      date_inscription: new Date('2026-01-15'),
      derniere_connexion: new Date('2026-01-19'),
      ...overrides,
    };
  }

  static createEnfantData(overrides: any = {}) {
    return {
      id: 'enfant_123',
      parent_id: 'parent_123',
      nom: 'Sophie',
      age: 10,
      classe: 'CM2',
      ecole: 'École Primaire Victor Hugo',
      matieres: ['Mathématiques', 'Français', 'Sciences'],
      ...overrides,
    };
  }

  static createLivreData(overrides: any = {}) {
    return {
      id: 'livre_123',
      titre: 'Mathématiques CM2',
      matiere: 'Mathématiques',
      classe: 'CM2',
      ecole: 'École Primaire Victor Hugo',
      etat: 'bon',
      description: 'Livre de mathématiques en bon état',
      images: ['https://example.com/livre1.jpg'],
      langue: 'Français',
      annee_scolaire: '2025-2026',
      disponible: true,
      statut: 'disponible',
      localisation_lat: 48.8566,
      localisation_lng: 2.3522,
      proprietaire_id: 'parent_123',
      date_ajout: new Date('2026-01-18'),
      ...overrides,
    };
  }

  static createEchangeData(overrides: any = {}) {
    return {
      id: 'echange_123',
      parent_offreur_id: 'parent_offreur_123',
      parent_demandeur_id: 'parent_demandeur_123',
      statut: 'propose',
      date_creation: new Date('2026-01-19'),
      ...overrides,
    };
  }

  static createChatData(overrides: any = {}) {
    return {
      id: 'chat_123',
      echange_id: 'echange_123',
      date_creation: new Date('2026-01-19'),
      statut: 'actif',
      ...overrides,
    };
  }

  static createMessageData(overrides: any = {}) {
    return {
      id: 'message_123',
      chat_id: 'chat_123',
      expediteur_id: 'parent_123',
      contenu: 'Bonjour, le livre est-il toujours disponible ?',
      image: '',
      date_envoi: new Date('2026-01-19T20:00:00'),
      ...overrides,
    };
  }

  // Multiple data generators
  static createMultipleEnfants(count: number, parentId: string) {
    const names = ['Sophie', 'Lucas', 'Emma', 'Noah', 'Léa'];
    const ages = [8, 9, 10, 11, 12];
    const classes = ['CE2', 'CM1', 'CM2', '6ème', '5ème'];

    return Array.from({ length: count }, (_, i) => ({
      id: `enfant_${i + 1}`,
      parent_id: parentId,
      nom: names[i % names.length],
      age: ages[i % ages.length],
      classe: classes[i % classes.length],
      ecole: 'École Primaire Victor Hugo',
      matieres: ['Mathématiques', 'Français'],
    }));
  }

  static createMultipleLivres(count: number, proprietaireId: string) {
    const titres = [
      'Mathématiques CM2',
      'Français CM2',
      'Histoire-Géographie CM2',
      'Sciences CM2',
      'Anglais CM2',
    ];
    const matieres = ['Mathématiques', 'Français', 'Histoire-Géographie', 'Sciences', 'Anglais'];
    const etats = ['neuf', 'bon', 'moyen'] as const;

    return Array.from({ length: count }, (_, i) => ({
      id: `livre_${i + 1}`,
      titre: titres[i % titres.length],
      matiere: matieres[i % matieres.length],
      classe: 'CM2',
      ecole: 'École Primaire Victor Hugo',
      etat: etats[i % etats.length],
      description: `Livre de ${matieres[i % matieres.length]} en ${etats[i % etats.length]} état`,
      images: [`https://example.com/livre${i + 1}.jpg`],
      langue: 'Français',
      annee_scolaire: '2025-2026',
      disponible: true,
      statut: 'disponible',
      localisation_lat: 48.8566,
      localisation_lng: 2.3522,
      proprietaire_id: proprietaireId,
      date_ajout: new Date('2026-01-18'),
    }));
  }
}
