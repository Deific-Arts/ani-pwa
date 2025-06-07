import { page } from '@vitest/browser/context';
import { html, render } from 'lit';
import { vi, expect, test, describe, beforeEach, afterEach } from 'vitest';
import "@vitest/browser/matchers.d.ts";
import { switchRoute } from '../../shared/utilities';
import './top-nav';
import 'kemet-ui/dist/components/kemet-icon/kemet-icon';
import { fixtureProfile } from '../ani-profile/fixtures';

describe('Top Nav', () => {
  beforeEach(() => {
    render(
      html`<ani-top-nav></ani-top-nav>`,
      document.body,
    );

    vi.mock('../../shared/utilities', () => ({
      switchRoute: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('displays search icon on home page and allows users to search', async () => {
    const component = document.querySelector('ani-top-nav');
    const spyDrawerOpened = vi.spyOn(component!.appState, 'setIsDrawerOpened');

    component!.appState.currentRoute = '/home';

    // we need to re-render after updating the appState
    render(
      html`<ani-top-nav></ani-top-nav>`,
      document.body,
    );

    const searchButton = await page.getByLabelText(/Search/i);

    await searchButton.click();
    await expect(spyDrawerOpened).toBeCalled();
    await expect.element(searchButton).toBeInTheDocument();
  });

  test('does not display search icon on a page that is not the home page', async () => {
    const component = document.querySelector('ani-top-nav');
    component!.appState.currentRoute = '/profile';

    render(
      html`<ani-top-nav></ani-top-nav>`,
      document.body,
    );

    const searchButton = await page.getByLabelText(/Search/i);
    await expect.element(searchButton).not.toBeInTheDocument();
  });

  test('display profile image when logged in', async () => {
    const component = document.querySelector('ani-top-nav');
    component!.userState.isLoggedIn = true;
    component!.userState.profile = fixtureProfile;

    render(
      html`<ani-top-nav></ani-top-nav>`,
      document.body,
    );

    const profileImage = await page.getByAltText(/OgdoadPantheon/i);
    await expect.element(profileImage).toBeInTheDocument();
  });

  test('switches route to home when logo is clicked', async () => {
    const logo = await page.getByLabelText(/Home/i);
    await logo.click();
    await expect(switchRoute).toBeCalledWith('/home');
  });

  test('switches route to profile when profile image is clicked', async () => {
    const component = document.querySelector('ani-top-nav');
    component!.userState.isLoggedIn = true;
    component!.userState.profile = fixtureProfile;

    const profileImage = await page.getByAltText(/OgdoadPantheon/i);
    await profileImage.click();
    await expect(switchRoute).toHaveBeenCalledWith('/profile');
  });
});
