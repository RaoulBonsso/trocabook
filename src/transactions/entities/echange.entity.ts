export class Echange {
  id: string;
  parent_offreur_id: string;
  parent_demandeur_id: string;
  type: 'echange' | 'achat';
  prix?: number;
  statut: 'propose' | 'en_negociation' | 'accepte' | 'refuse' | 'termine' | 'annule';
  date_creation: Date;
  date_validation?: Date;
}

