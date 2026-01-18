# Documentation de l'API Trocabook

Ce document référence l'ensemble des endpoints disponibles, leurs méthodes, et les données nécessaires pour les tester.

## URLs de Base
- **Production (Vercel)** : `https://trocabook.vercel.app`
- **Local** : `http://localhost:3000`

---

## Sommaire
1. [Authentification](#1-authentication-auth)
2. [Utilisateurs (Parents)](#2-utilisateurs-users--parents)
3. [Enfants](#3-enfants-children)
4. [Livres](#4-livres-books)
5. [Transactions](#5-transactions)
6. [Conversations (Chats)](#6-chats--messages)

---

## 1. Authentication (Auth)

### Login (Connexion)
Authentifie un utilisateur et retourne un `idToken` et un `refreshToken`.

- **Endpoint**: `POST /auth/login`
- **Exemple de Payload**:
```json
{
  "email": "jean.dupont@example.com",
  "password": "monitorpassword"
}
```

### Logout (Déconnexion)
Invalide le refresh token. Nécessite d'être authentifié.

- **Endpoint**: `POST /auth/logout`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`

### Refresh Auth (Rafraîchir le token)
Obtient un nouveau `idToken` à partir d'un `refreshToken`.

- **Endpoint**: `POST /auth/refresh-auth`
- **Exemple de Payload**:
```json
{
  "refreshToken": "<VOTRE_REFRESH_TOKEN>"
}
```

---

## 2. Utilisateurs (Users / Parents)

### Inscription (Register)
Crée un nouveau compte parent.

- **Endpoint**: `POST /users/register`
- **Exemple de Payload**:
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "age": 35,
  "numberOfChildren": 2,
  "telephone": "+33612345678",
  "location": "Paris, France",
  "email": "jean.dupont@example.com",
  "password": "monitorpassword",
  "roles": ["viewer"]
}
```

### Profil (Profile)
Récupère les informations de l'utilisateur connecté.

- **Endpoint**: `GET /users/profile`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`

---

## 3. Enfants (Children)

### Créer un enfant
Ajoute un enfant au profil d'un parent.  
*Note: `parent_id` doit être l'UID Firebase du parent.*

- **Endpoint**: `POST /enfants`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`
- **Exemple de Payload**:
```json
{
  "parent_id": "<UID_DU_PARENT>",
  "prenom": "Lucas",
  "nom": "Dupont",
  "age": 8,
  "classe": "CE2",
  "autres_infos": "Aime les dinosaures"
}
```

### Lister les enfants
- **Endpoint**: `GET /enfants`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`

### Voir un enfant
- **Endpoint**: `GET /enfants/:id`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`

### Modifier un enfant
- **Endpoint**: `PATCH /enfants/:id`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`
- **Exemple de Payload**:
```json
{
  "age": 9,
  "classe": "CM1"
}
```

### Supprimer un enfant
- **Endpoint**: `DELETE /enfants/:id`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`

---

## 4. Livres (Books)

### Ajouter un livre
- **Endpoint**: `POST /livres`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`
- **Exemple de Payload**:
```json
{
  "titre": "Harry Potter à l'école des sorciers",
  "auteur": "J.K. Rowling",
  "description": "Le premier tome de la saga.",
  "categorie": "Fantastique",
  "annee_publication": 1997,
  "etat": "Bon état",
  "langue": "Français",
  "image_url": "https://example.com/image.jpg",
  "disponible": true
}
```

### Lister les livres
- **Endpoint**: `GET /livres`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`

### Voir un livre
- **Endpoint**: `GET /livres/:id`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`

### Modifier un livre
- **Endpoint**: `PATCH /livres/:id`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`
- **Exemple de Payload**:
```json
{
  "disponible": false
}
```

### Supprimer un livre
- **Endpoint**: `DELETE /livres/:id`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`

---

## 5. Transactions

### Créer une transaction
Initie un achat, un échange ou un don.  
*Note: `livre_id` et `vendeur_id` doivent être des IDs existants.*

- **Endpoint**: `POST /transactions`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`
- **Exemple de Payload**:
```json
{
  "livre_id": "<ID_DU_LIVRE>",
  "vendeur_id": "<UID_DU_VENDEUR>",
  "type_transaction": "echange",
  "rendezvous_localisation": "Parc Central",
  "rendezvous_date": "2024-12-25T14:30:00.000Z"
}
```

### Lister mes transactions
- **Endpoint**: `GET /transactions`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`

### Mettre à jour une transaction
- **Endpoint**: `PATCH /transactions/:id`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`
- **Exemple de Payload**:
```json
{
  "rendezvous_date": "2024-12-26T10:00:00.000Z"
}
```

---

## 6. Chats & Messages

### Créer un chat (Conversation)
Démarre une conversation avec un autre parent pour un livre donné.

- **Endpoint**: `POST /chats`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`
- **Exemple de Payload**:
```json
{
  "other_parent_id": "<UID_AUTRE_PARENT>",
  "livre_id": "<ID_DU_LIVRE>"
}
```

### Envoyer un message
- **Endpoint**: `POST /chats/:chatId/messages`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`
- **Exemple de Payload**:
```json
{
  "contenu": "Bonjour, ce livre est-il toujours disponible ?"
}
```

### Lister les messages d'un chat
- **Endpoint**: `GET /chats/:chatId/messages`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`

### Lister mes chats
- **Endpoint**: `GET /chats`
- **Headers**: `Authorization: Bearer <ID_TOKEN>`
