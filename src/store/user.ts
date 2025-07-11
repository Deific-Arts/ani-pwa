import { createStore } from 'zustand/vanilla';
import Cookies from 'js-cookie';
import appStore from '../store/app';
import { type IProfile, type IUserCookie } from '../shared/interfaces';

export interface IUserStore {
  // user: IUserCookie;
  profile: IProfile;
  updateProfile: (profile: IProfile) => void;
  isLoggedIn: boolean;
  // login: (loginData: IUserCookie) => void;
  // logout: () => void;
}

// const API_URL = import.meta.env.VITE_API_URL;

const getProfile = async () => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  try {
    const userProfile = await fetch(`/api/users/me`, options)
      .then((response) => response.json());
    if (userProfile) {
      return userProfile;
    }
  } catch (error) {
    console.log(error);
    // the api has failed turn on maintenance mode
    appStore.setState({ maintenanceMode: true });
  }

  return;
}
const profileResponse = await getProfile();

const isLoggedIn = async () => await fetch('/api/auth/authorized').then(response => response.json());
const isLoggedInResponse = await isLoggedIn();

const getAvatar = async () => await fetch(`/api/users/avatar?filePath=${profileResponse.avatar ? profileResponse.avatar : ''}`).then(response => response.json());
const avatarResponse = await getAvatar();

console.log(avatarResponse);

const store = createStore<IUserStore>(set => ({
  profile: { ...profileResponse, avatar: avatarResponse },
  updateProfile: (profile: IProfile) => set(() => { return { profile } }),
  isLoggedIn: isLoggedInResponse
}));

export default store;
