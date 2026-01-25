/**
 * Mock implementation of FirebaseService for unit testing
 * Simulates Firestore operations without requiring actual Firebase connection
 */

export class MockFirebaseService {
  private mockData: Map<string, Map<string, any>> = new Map();
  private mockUsers: Map<string, any> = new Map();

  constructor() {
    // Initialize collections
    this.mockData.set('parents', new Map());
    this.mockData.set('enfants', new Map());
    this.mockData.set('livres', new Map());
    this.mockData.set('echanges', new Map());
    this.mockData.set('echange_livres', new Map());
    this.mockData.set('chats', new Map());
  }

  // Firebase Auth methods
  async createUser(userData: { displayName: string; email: string; password: string }) {
    const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      uid,
      email: userData.email,
      displayName: userData.displayName,
    };
    this.mockUsers.set(uid, user);
    return user;
  }

  async setCustomUserClaims(uid: string, claims: any) {
    const user = this.mockUsers.get(uid);
    if (user) {
      user.customClaims = claims;
    }
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    // Find user by email
    const user = Array.from(this.mockUsers.values()).find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      idToken: `mock_id_token_${user.uid}`,
      refreshToken: `mock_refresh_token_${user.uid}`,
      expiresIn: '3600',
    };
  }

  async verifyIdToken(token: string) {
    const uid = token.replace('mock_id_token_', '');
    const user = this.mockUsers.get(uid);
    if (!user) {
      throw new Error('Invalid token');
    }
    return { uid: user.uid, email: user.email };
  }

  async revokeRefreshToken(uid: string) {
    return { success: true };
  }

  async refreshAuthToken(refreshToken: string) {
    const uid = refreshToken.replace('mock_refresh_token_', '');
    return {
      idToken: `mock_id_token_${uid}_refreshed`,
      refreshToken: `mock_refresh_token_${uid}_refreshed`,
      expiresIn: '3600',
    };
  }

  // Firestore methods
  getFirestore() {
    const self = this;
    return {
      collection: (name: string) => this.getCollection(name),
      batch: () => {
        const operations: Array<() => Promise<void>> = [];
        return {
          set: (docRef: any, data: any) => {
            operations.push(async () => {
              await docRef.set(data);
            });
          },
          update: (docRef: any, data: any) => {
            operations.push(async () => {
              await docRef.update(data);
            });
          },
          delete: (docRef: any) => {
            operations.push(async () => {
              await docRef.delete();
            });
          },
          commit: async () => {
            for (const op of operations) {
              await op();
            }
          },
        };
      },
    };
  }

  private getCollection(collectionName: string) {
    if (!this.mockData.has(collectionName)) {
      this.mockData.set(collectionName, new Map());
    }

    const collection = this.mockData.get(collectionName)!;

    return {
      doc: (id?: string) => {
        const docId = id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return this.getDocument(collectionName, docId);
      },
      get: async () => {
        const docs = Array.from(collection.entries()).map(([id, data]) => ({
          id,
          data: () => data,
          exists: true,
        }));
        return {
          docs,
          empty: docs.length === 0,
          forEach: (callback: any) => docs.forEach(callback),
        };
      },
      where: (field: string, operator: string, value: any) => {
        return {
          get: async () => {
            const docs = Array.from(collection.entries())
              .filter(([_, data]) => {
                if (operator === '==') return data[field] === value;
                return false;
              })
              .map(([id, data]) => ({
                id,
                data: () => data,
                exists: true,
              }));
            return {
              docs,
              empty: docs.length === 0,
              forEach: (callback: any) => docs.forEach(callback),
            };
          },
          limit: (n: number) => ({
            get: async () => {
              const docs = Array.from(collection.entries())
                .filter(([_, data]) => {
                  if (operator === '==') return data[field] === value;
                  return false;
                })
                .slice(0, n)
                .map(([id, data]) => ({
                  id,
                  data: () => data,
                  exists: true,
                }));
              return {
                docs,
                empty: docs.length === 0,
              };
            },
          }),
        };
      },
    };
  }

  private getDocument(collectionName: string, docId: string) {
    const collection = this.mockData.get(collectionName)!;

    return {
      id: docId,
      set: async (data: any) => {
        collection.set(docId, { ...data, id: docId });
      },
      get: async () => {
        const data = collection.get(docId);
        return {
          id: docId,
          exists: !!data,
          data: () => data,
        };
      },
      update: async (data: any) => {
        const existing = collection.get(docId);
        if (!existing) {
          throw new Error('Document not found');
        }
        collection.set(docId, { ...existing, ...data });
      },
      delete: async () => {
        collection.delete(docId);
      },
      collection: (subCollectionName: string) => {
        // For subcollections like messages in chats
        const subCollectionKey = `${collectionName}/${docId}/${subCollectionName}`;
        if (!this.mockData.has(subCollectionKey)) {
          this.mockData.set(subCollectionKey, new Map());
        }
        return this.getSubCollection(subCollectionKey);
      },
    };
  }

  private getSubCollection(subCollectionKey: string) {
    const collection = this.mockData.get(subCollectionKey)!;

    return {
      doc: (id?: string) => {
        const docId = id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
          id: docId,
          set: async (data: any) => {
            collection.set(docId, { ...data, id: docId });
          },
          get: async () => {
            const data = collection.get(docId);
            return {
              id: docId,
              exists: !!data,
              data: () => data,
            };
          },
        };
      },
      get: async () => {
        const docs = Array.from(collection.entries()).map(([id, data]) => ({
          id,
          data: () => data,
          exists: true,
        }));
        return {
          docs,
          empty: docs.length === 0,
        };
      },
      orderBy: (field: string) => ({
        get: async () => {
          const docs = Array.from(collection.entries())
            .sort(([, a], [, b]) => {
              if (a[field] < b[field]) return -1;
              if (a[field] > b[field]) return 1;
              return 0;
            })
            .map(([id, data]) => ({
              id,
              data: () => data,
              exists: true,
            }));
          return {
            docs,
            empty: docs.length === 0,
          };
        },
      }),
    };
  }

  // Helper method to clear all mock data
  clearAll() {
    this.mockData.clear();
    this.mockUsers.clear();
    this.mockData.set('parents', new Map());
    this.mockData.set('enfants', new Map());
    this.mockData.set('livres', new Map());
    this.mockData.set('echanges', new Map());
    this.mockData.set('echange_livres', new Map());
    this.mockData.set('chats', new Map());
  }

  // Helper method to get data for assertions
  getData(collectionName: string, docId: string) {
    return this.mockData.get(collectionName)?.get(docId);
  }
}
