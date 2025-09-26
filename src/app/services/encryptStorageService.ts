import EncryptedStorage from 'react-native-encrypted-storage';

export const EncryptStorageService = {
  storeToken: async (token: string) => {
    await EncryptedStorage.setItem('token', token);
  },
  getToken: async () => {
    return EncryptedStorage.getItem('token');
  },
  removeToken: async () => {
    await EncryptedStorage.removeItem('token');
  },
};
