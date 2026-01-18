export class Message {
  id: string;
  chat_id: string;
  expediteur_id: string;
  contenu: string;
  image?: string;
  date_envoi: Date;
}
