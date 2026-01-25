# Guide Complet de Test API - Trocabook

Ce guide fournit un scénario complet de bout en bout pour tester toutes les APIs de Trocabook, de l'inscription d'un parent jusqu'à la transaction de livres et l'échange de messages.

## Configuration Postman

### Variables d'Environnement

Créez un environnement Postman avec ces variables:

```json
{
  "base_url": "http://localhost:3000",
  "parent1_token": "",
  "parent2_token": "",
  "parent1_id": "",
  "parent2_id": "",
  "enfant1_id": "",
  "enfant2_id": "",
  "livre1_id": "",
  "livre2_id": "",
  "echange_id": "",
  "chat_id": ""
}
```

---

## Scénario Complet: De l'Inscription à la Transaction

### Étape 1: Inscription du Premier Parent (Marie)

**Endpoint:** `POST {{base_url}}/users/register`

**Body (JSON):**
```json
{
  "firstName": "Marie",
  "lastName": "Dubois",
  "email": "marie.dubois@example.com",
  "password": "SecurePass123!",
  "telephone": "+33612345678",
  "ville": "Paris",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "numberOfChildren": 2,
  "profileImage": "https://i.pravatar.cc/150?img=5",
  "roles": ["parent"]
}
```

**Réponse Attendue (200 OK):**
```json
{
  "uid": "user_1737324000000_abc123",
  "email": "marie.dubois@example.com",
  "displayName": "Marie Dubois"
}
```

**Script Postman (Tests tab):**
```javascript
pm.environment.set("parent1_id", pm.response.json().uid);
```

---

### Étape 2: Connexion de Marie

**Endpoint:** `POST {{base_url}}/auth/login`

**Body (JSON):**
```json
{
  "email": "marie.dubois@example.com",
  "password": "SecurePass123!"
}
```

**Réponse Attendue (200 OK):**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "AEu4IL...",
  "expiresIn": "3600"
}
```

**Script Postman:**
```javascript
pm.environment.set("parent1_token", pm.response.json().idToken);
```

---

### Étape 3: Inscription du Deuxième Parent (Pierre)

**Endpoint:** `POST {{base_url}}/users/register`

**Body (JSON):**
```json
{
  "firstName": "Pierre",
  "lastName": "Martin",
  "email": "pierre.martin@example.com",
  "password": "SecurePass456!",
  "telephone": "+33687654321",
  "ville": "Paris",
  "latitude": 48.8606,
  "longitude": 2.3376,
  "numberOfChildren": 1,
  "profileImage": "https://i.pravatar.cc/150?img=12",
  "roles": ["parent"]
}
```

**Script Postman:**
```javascript
pm.environment.set("parent2_id", pm.response.json().uid);
```

---

### Étape 4: Connexion de Pierre

**Endpoint:** `POST {{base_url}}/auth/login`

**Body (JSON):**
```json
{
  "email": "pierre.martin@example.com",
  "password": "SecurePass456!"
}
```

**Script Postman:**
```javascript
pm.environment.set("parent2_token", pm.response.json().idToken);
```

---

### Étape 5: Marie Ajoute Ses Enfants

#### Enfant 1 - Sophie

**Endpoint:** `POST {{base_url}}/enfants`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Body (JSON):**
```json
{
  "parent_id": "{{parent1_id}}",
  "nom": "Sophie",
  "age": 10,
  "classe": "CM2",
  "ecole": "École Primaire Victor Hugo",
  "matieres": ["Mathématiques", "Français", "Sciences", "Histoire-Géographie"]
}
```

**Réponse Attendue (201 Created):**
```json
{
  "id": "enfant_abc123",
  "parent_id": "user_1737324000000_abc123",
  "nom": "Sophie",
  "age": 10,
  "classe": "CM2",
  "ecole": "École Primaire Victor Hugo",
  "matieres": ["Mathématiques", "Français", "Sciences", "Histoire-Géographie"]
}
```

**Script Postman:**
```javascript
pm.environment.set("enfant1_id", pm.response.json().id);
```

#### Enfant 2 - Lucas

**Endpoint:** `POST {{base_url}}/enfants`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Body (JSON):**
```json
{
  "parent_id": "{{parent1_id}}",
  "nom": "Lucas",
  "age": 8,
  "classe": "CE2",
  "ecole": "École Primaire Victor Hugo",
  "matieres": ["Mathématiques", "Français", "Arts Plastiques"]
}
```

**Script Postman:**
```javascript
pm.environment.set("enfant2_id", pm.response.json().id);
```

---

### Étape 6: Marie Publie des Livres

#### Livre 1 - Mathématiques CM2

**Endpoint:** `POST {{base_url}}/livres`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Body (JSON):**
```json
{
  "titre": "Mathématiques CM2 - Pour Comprendre les Maths",
  "matiere": "Mathématiques",
  "classe": "CM2",
  "ecole": "École Primaire Victor Hugo",
  "etat": "bon",
  "description": "Livre de mathématiques en bon état, quelques annotations au crayon à papier. Toutes les pages sont présentes et en bon état.",
  "images": [
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400"
  ],
  "langue": "Français",
  "annee_scolaire": "2025-2026",
  "disponible": true,
  "statut": "disponible",
  "localisation_lat": 48.8566,
  "localisation_lng": 2.3522
}
```

**Réponse Attendue (201 Created):**
```json
{
  "id": "livre_xyz789",
  "titre": "Mathématiques CM2 - Pour Comprendre les Maths",
  "matiere": "Mathématiques",
  "classe": "CM2",
  "proprietaire_id": "user_1737324000000_abc123",
  "disponible": true,
  "statut": "disponible",
  "date_ajout": "2026-01-19T22:30:00.000Z"
}
```

**Script Postman:**
```javascript
pm.environment.set("livre1_id", pm.response.json().id);
```

#### Livre 2 - Français CM2

**Endpoint:** `POST {{base_url}}/livres`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Body (JSON):**
```json
{
  "titre": "Français CM2 - L'Île aux Mots",
  "matiere": "Français",
  "classe": "CM2",
  "ecole": "École Primaire Victor Hugo",
  "etat": "très bon",
  "description": "Livre de français quasi neuf, utilisé seulement 3 mois. Aucune annotation, couverture impeccable.",
  "images": [
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"
  ],
  "langue": "Français",
  "annee_scolaire": "2025-2026",
  "disponible": true,
  "statut": "disponible",
  "localisation_lat": 48.8566,
  "localisation_lng": 2.3522
}
```

**Script Postman:**
```javascript
pm.environment.set("livre2_id", pm.response.json().id);
```

---

### Étape 7: Pierre Publie un Livre

**Endpoint:** `POST {{base_url}}/livres`

**Headers:**
```
Authorization: Bearer {{parent2_token}}
```

**Body (JSON):**
```json
{
  "titre": "Sciences CM2 - Découvrir le Monde",
  "matiere": "Sciences",
  "classe": "CM2",
  "ecole": "École Primaire Jean Jaurès",
  "etat": "bon",
  "description": "Manuel de sciences en bon état général. Quelques pages cornées mais tout est lisible.",
  "images": [
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400"
  ],
  "langue": "Français",
  "annee_scolaire": "2025-2026",
  "disponible": true,
  "statut": "disponible",
  "localisation_lat": 48.8606,
  "localisation_lng": 2.3376
}
```

---

### Étape 8: Consulter Tous les Livres Disponibles

**Endpoint:** `GET {{base_url}}/livres`

**Headers:**
```
Authorization: Bearer {{parent2_token}}
```

**Réponse Attendue (200 OK):**
```json
[
  {
    "id": "livre_xyz789",
    "titre": "Mathématiques CM2 - Pour Comprendre les Maths",
    "matiere": "Mathématiques",
    "classe": "CM2",
    "proprietaire_id": "user_1737324000000_abc123",
    "disponible": true,
    "statut": "disponible"
  },
  {
    "id": "livre_abc456",
    "titre": "Français CM2 - L'Île aux Mots",
    "matiere": "Français",
    "classe": "CM2",
    "proprietaire_id": "user_1737324000000_abc123",
    "disponible": true,
    "statut": "disponible"
  },
  {
    "id": "livre_def123",
    "titre": "Sciences CM2 - Découvrir le Monde",
    "matiere": "Sciences",
    "classe": "CM2",
    "proprietaire_id": "user_1737324000000_def456",
    "disponible": true,
    "statut": "disponible"
  }
]
```

---

### Étape 9: Pierre Propose un Échange à Marie

Pierre veut le livre de Mathématiques de Marie.

**Endpoint:** `POST {{base_url}}/transactions`

**Headers:**
```
Authorization: Bearer {{parent2_token}}
```

**Body (JSON):**
```json
{
  "parent_offreur_id": "{{parent1_id}}",
  "livre_id": "{{livre1_id}}"
}
```

**Réponse Attendue (201 Created):**
```json
{
  "id": "echange_qrs456",
  "parent_offreur_id": "user_1737324000000_abc123",
  "parent_demandeur_id": "user_1737324000000_def456",
  "statut": "propose",
  "date_creation": "2026-01-19T22:35:00.000Z"
}
```

**Script Postman:**
```javascript
pm.environment.set("echange_id", pm.response.json().id);
```

---

### Étape 10: Marie Consulte Ses Échanges

**Endpoint:** `GET {{base_url}}/transactions?userId={{parent1_id}}`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Réponse Attendue (200 OK):**
```json
[
  {
    "id": "echange_qrs456",
    "parent_offreur_id": "user_1737324000000_abc123",
    "parent_demandeur_id": "user_1737324000000_def456",
    "statut": "propose",
    "date_creation": "2026-01-19T22:35:00.000Z"
  }
]
```

---

### Étape 11: Marie Accepte l'Échange

**Endpoint:** `PATCH {{base_url}}/transactions/{{echange_id}}`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Body (JSON):**
```json
{
  "statut": "accepte"
}
```

**Réponse Attendue (200 OK):**
```json
{
  "id": "echange_qrs456",
  "parent_offreur_id": "user_1737324000000_abc123",
  "parent_demandeur_id": "user_1737324000000_def456",
  "statut": "accepte",
  "date_creation": "2026-01-19T22:35:00.000Z",
  "date_validation": "2026-01-19T22:37:00.000Z"
}
```

---

### Étape 12: Création d'un Chat pour l'Échange

**Endpoint:** `POST {{base_url}}/chats`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Body (JSON):**
```json
{
  "echange_id": "{{echange_id}}"
}
```

**Réponse Attendue (201 Created):**
```json
{
  "id": "chat_tuv789",
  "echange_id": "echange_qrs456",
  "date_creation": "2026-01-19T22:38:00.000Z",
  "statut": "actif"
}
```

**Script Postman:**
```javascript
pm.environment.set("chat_id", pm.response.json().id);
```

---

### Étape 13: Marie Envoie un Message à Pierre

**Endpoint:** `POST {{base_url}}/chats/{{chat_id}}/messages`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Body (JSON):**
```json
{
  "contenu": "Bonjour Pierre ! Je suis ravie d'échanger avec vous. Quand pouvons-nous nous rencontrer pour l'échange ?",
  "image": ""
}
```

**Réponse Attendue (201 Created):**
```json
{
  "id": "message_wxy012",
  "chat_id": "chat_tuv789",
  "expediteur_id": "user_1737324000000_abc123",
  "contenu": "Bonjour Pierre ! Je suis ravie d'échanger avec vous. Quand pouvons-nous nous rencontrer pour l'échange ?",
  "image": "",
  "date_envoi": "2026-01-19T22:39:00.000Z"
}
```

---

### Étape 14: Pierre Répond au Message

**Endpoint:** `POST {{base_url}}/chats/{{chat_id}}/messages`

**Headers:**
```
Authorization: Bearer {{parent2_token}}
```

**Body (JSON):**
```json
{
  "contenu": "Bonjour Marie ! Merci beaucoup. Je suis disponible demain après-midi vers 16h à l'école. Cela vous convient ?",
  "image": ""
}
```

---

### Étape 15: Consulter Tous les Messages du Chat

**Endpoint:** `GET {{base_url}}/chats/{{chat_id}}/messages`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Réponse Attendue (200 OK):**
```json
[
  {
    "id": "message_wxy012",
    "chat_id": "chat_tuv789",
    "expediteur_id": "user_1737324000000_abc123",
    "contenu": "Bonjour Pierre ! Je suis ravie d'échanger avec vous. Quand pouvons-nous nous rencontrer pour l'échange ?",
    "image": "",
    "date_envoi": "2026-01-19T22:39:00.000Z"
  },
  {
    "id": "message_zab345",
    "chat_id": "chat_tuv789",
    "expediteur_id": "user_1737324000000_def456",
    "contenu": "Bonjour Marie ! Merci beaucoup. Je suis disponible demain après-midi vers 16h à l'école. Cela vous convient ?",
    "image": "",
    "date_envoi": "2026-01-19T22:40:00.000Z"
  }
]
```

---

### Étape 16: Finaliser l'Échange

**Endpoint:** `PATCH {{base_url}}/transactions/{{echange_id}}`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Body (JSON):**
```json
{
  "statut": "termine"
}
```

---

## Endpoints Additionnels

### Consulter un Enfant Spécifique

**Endpoint:** `GET {{base_url}}/enfants/{{enfant1_id}}`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

---

### Modifier un Enfant

**Endpoint:** `PATCH {{base_url}}/enfants/{{enfant1_id}}`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Body (JSON):**
```json
{
  "age": 11,
  "classe": "6ème"
}
```

---

### Modifier un Livre

**Endpoint:** `PATCH {{base_url}}/livres/{{livre1_id}}`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Body (JSON):**
```json
{
  "statut": "en_negociation",
  "disponible": false
}
```

---

### Supprimer un Livre

**Endpoint:** `DELETE {{base_url}}/livres/{{livre2_id}}`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Réponse Attendue (200 OK):**
```json
{
  "message": "Livre supprimé avec succès"
}
```

---

### Déconnexion

**Endpoint:** `POST {{base_url}}/auth/logout`

**Headers:**
```
Authorization: Bearer {{parent1_token}}
```

**Réponse Attendue (200 OK):**
```json
{
  "message": "Déconnexion réussie"
}
```

---

### Rafraîchir le Token

**Endpoint:** `POST {{base_url}}/auth/refresh`

**Body (JSON):**
```json
{
  "refreshToken": "AEu4IL..."
}
```

**Réponse Attendue (200 OK):**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "AEu4IL...",
  "expiresIn": "3600"
}
```

---

## Résumé du Scénario Complet

1. ✅ **Inscription de Marie** → Création du compte parent
2. ✅ **Connexion de Marie** → Récupération du token d'authentification
3. ✅ **Inscription de Pierre** → Deuxième parent
4. ✅ **Connexion de Pierre** → Token pour Pierre
5. ✅ **Ajout des enfants de Marie** → Sophie (CM2) et Lucas (CE2)
6. ✅ **Publication de livres par Marie** → Maths CM2 et Français CM2
7. ✅ **Publication d'un livre par Pierre** → Sciences CM2
8. ✅ **Consultation des livres** → Liste de tous les livres disponibles
9. ✅ **Proposition d'échange** → Pierre demande le livre de Maths
10. ✅ **Acceptation de l'échange** → Marie accepte
11. ✅ **Création du chat** → Pour communiquer sur l'échange
12. ✅ **Échange de messages** → Coordination du rendez-vous
13. ✅ **Finalisation** → Échange terminé

## Notes Importantes

- **Tous les endpoints nécessitent l'authentification** sauf `/users/register` et `/auth/login`
- **Le token expire après 1 heure** - utilisez `/auth/refresh` pour le renouveler
- **Les IDs sont générés automatiquement** - utilisez les scripts Postman pour les capturer
- **Les emails de notification sont envoyés** lors de l'inscription et des nouveaux messages
- **Les coordonnées GPS** sont utilisées pour la géolocalisation des livres

## Collection Postman

Importez cette collection dans Postman pour tester rapidement:

1. Créez un nouvel environnement avec les variables listées en haut
2. Exécutez les requêtes dans l'ordre du scénario
3. Les scripts automatiques rempliront les variables au fur et à mesure
4. Vous pouvez exécuter toute la collection avec le Runner Postman
