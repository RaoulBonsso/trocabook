export class Signalement {
  id: string;
  auteur_id: string;
  cible_type: 'parent' | 'livre' | 'message';
  cible_id: string;
  motif: string;
  description: string;
  statut: 'en_attente' | 'traite' | 'rejete';
  date_signalement: Date;
}
