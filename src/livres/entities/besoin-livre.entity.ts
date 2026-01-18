export class BesoinLivre {
  id: string;
  parent_id: string;
  enfant_id: string;
  titre: string;
  matiere: string;
  classe: string;
  ecole: string;
  urgence: boolean;
  rayon_km: number;
  statut: 'non_trouve' | 'en_negociation' | 'trouve';
  date_creation: Date;
}
