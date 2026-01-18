export class Moderation {
  id: string;
  signalement_id: string;
  moderateur_id: string;
  action: 'avertissement' | 'suspension' | 'blocage';
  duree: number;
  commentaire: string;
  date_action: Date;
}
