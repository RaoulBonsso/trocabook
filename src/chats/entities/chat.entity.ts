export class Chat {
  id: string;
  parent1_id: string;
  parent2_id: string;
  livre_id: string;
  date_creation: Date;
}

export class Message {
  id: string;
  chat_id: string;
  expediteur_id: string;
  contenu: string;
  date_envoi: Date;
}
