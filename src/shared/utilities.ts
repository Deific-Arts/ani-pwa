import appStore from '../store/app';

export const switchRoute = (route: string) => {
  const aniApp = document.querySelector('ani-app');
  appStore.setState({ isDrawerOpened: false, currentRoute: route });
  aniApp?.switchRoute(route);
}

export const emitEvent = (element: HTMLElement, name: string, detail = {}, bubbles = true, composed = true) => {
  element.dispatchEvent(
    new CustomEvent(name, { bubbles, composed, detail }),
  );
};

export const isObjectEmpty = <T extends object>(obj: T): boolean => {
  return Object.entries(obj).length === 0;
}

export const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const isProduction = window.location.origin === 'https://anibookquotes.com';
