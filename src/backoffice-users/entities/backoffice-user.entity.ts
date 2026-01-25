export class BackofficeUser {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'super_admin' | 'admin' | 'support';
  createdAt: Date;
  updatedAt: Date;
}
