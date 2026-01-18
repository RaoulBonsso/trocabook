export class Livre {
  id: string;
  titre: string;
  auteur: string;
  description: string;
  categorie: string;
  annee_publication: number;
  etat: string;
  langue: string;
  image_url?: string;
  proprietaire_id: string;
  disponible: boolean;
  date_ajout: Date;
}
