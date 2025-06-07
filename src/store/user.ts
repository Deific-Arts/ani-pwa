import { createStore } from 'zustand/vanilla';
import Cookies from 'js-cookie';
import appStore from '../store/app';
import { type IProfile, type IUserCookie } from '../shared/interfaces';

export interface IUserStore {
  user: IUserCookie;
  profile: IProfile;
  updateProfile: (profile: IProfile) => void;
  isLoggedIn: boolean;
  login: (loginData: IUserCookie) => void;
  logout: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const getProfile = async () => {
  const user = Cookies.get('ani-user') ? JSON.parse(Cookies.get('ani-user') || '') : undefined;

  if (!user) {
    return;
  }

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.jwt}`
    }
  };

  try {
    const userProfile = await fetch(`${API_URL}/api/users/me?populate=*`, options)
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

const store = createStore<IUserStore>(set => ({
  user: Cookies.get('ani-user') ? JSON.parse(Cookies.get('ani-user') || '') : {},
  profile: profileResponse,
  updateProfile: (profile: IProfile) => set(() => { return { profile } }),
  isLoggedIn: !!Cookies.get('ani-user'),
  login: (loginData) => set(() => {
    Cookies.set('ani-user', JSON.stringify(loginData), { expires: 7 });
    return { isLoggedIn: true, user: loginData };
  }),
  logout: () => set(() => {
    Cookies.remove('ani-user');
    return { isLoggedIn: false };
  })
}));

export default store;
