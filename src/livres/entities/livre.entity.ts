export class Livre {
  id: string;
  proprietaire_id: string;
  titre: string;
  matiere: string;
  classe: string;
  ecole: string;
  etat: 'neuf' | 'bon' | 'moyen' | 'mauvais';
  description: string;
  images: string[];
  langue: string;
  annee_scolaire: string;
  disponible: boolean;
  statut: 'disponible' | 'en_negociation' | 'echange';
  localisation_lat: number;
  localisation_lng: number;
  date_ajout: Date;
  enfant_id: string;
}

