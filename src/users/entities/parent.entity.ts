export class Parent {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  mot_de_passe?: string; // Not stored in Firestore, handled by Auth
  ville: string;
  localisation_lat: number;
  localisation_lng: number;
  image_profil: string;
  nombre_enfants: number;
  note_moyenne: number;
  nombre_echanges: number;
  statut_compte: 'actif' | 'suspendu' | 'bloque';
  date_inscription: Date;
  derniere_connexion: Date;
}
