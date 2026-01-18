export class Notification {
  id: string;
  parent_id: string;
  type: string;
  titre: string;
  message: string;
  lien?: string;
  lu: boolean;
  date_envoi: Date;
}
