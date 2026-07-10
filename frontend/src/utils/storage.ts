const TOKEN_KEY = 'eduniaa_auth_token';
const USER_KEY = 'eduniaa_user';

// Mobile-safe storage with fallback
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

let memoryStorage: { [key: string]: string } = {};

export const setToken = (token: string) => {
  try {
    if (isStorageAvailable()) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      memoryStorage[TOKEN_KEY] = token;
    }
    console.log('Token stored successfully:', !!token);
  } catch (error) {
    console.error('Failed to store token:', error);
    memoryStorage[TOKEN_KEY] = token;
  }
};

export const getToken = () => {
  try {
    if (isStorageAvailable()) {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      return memoryStorage[TOKEN_KEY] || null;
    }
  } catch (error) {
    console.error('Failed to get token:', error);
    return memoryStorage[TOKEN_KEY] || null;
  }
};

export const removeToken = () => {
  try {
    if (isStorageAvailable()) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    delete memoryStorage[TOKEN_KEY];
    delete memoryStorage[USER_KEY];
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

export const setUser = (user: any) => {
  try {
    const userStr = JSON.stringify(user);
    if (isStorageAvailable()) {
      localStorage.setItem(USER_KEY, userStr);
    } else {
      memoryStorage[USER_KEY] = userStr;
    }
  } catch (error) {
    console.error('Failed to store user:', error);
    memoryStorage[USER_KEY] = JSON.stringify(user);
  }
};

export const getUser = () => {
  try {
    let userStr;
    if (isStorageAvailable()) {
      userStr = localStorage.getItem(USER_KEY);
    } else {
      userStr = memoryStorage[USER_KEY];
    }
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
};
