export class Echange {
  id: string;
  parent_offreur_id: string;
  parent_demandeur_id: string;
  statut: 'propose' | 'accepte' | 'refuse' | 'en_cours' | 'termine' | 'annule';
  date_creation: Date;
  date_validation?: Date;
}
