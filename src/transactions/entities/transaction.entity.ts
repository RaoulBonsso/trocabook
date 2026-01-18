export class Transaction {
  id: string;
  livre_id: string;
  vendeur_id: string;
  acheteur_id: string;
  date_transaction: Date;
  type_transaction: string; // achat, echange, don
  statut: string; // en_cours, termine, annule
  rendezvous_localisation?: string;
  rendezvous_date?: Date;
}
