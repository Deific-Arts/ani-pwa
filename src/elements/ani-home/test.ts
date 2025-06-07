import { html, render } from 'lit';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { page } from '@vitest/browser/context';
import "@vitest/browser/matchers.d.ts";
import { fixtureUser } from '../ani-user-view/fixtures';
import { fixtureProfile } from '../ani-profile/fixtures';
import { fireEvent } from '@testing-library/dom';

import AniHome from './home';

import './home';
import 'kemet-ui/dist/components/kemet-icon/kemet-icon';
import 'kemet-ui/dist/components/kemet-fab/kemet-fab';
import 'kemet-ui/dist/components/kemet-tabs/kemet-tabs';
import 'kemet-ui/dist/components/kemet-tabs/kemet-tab';
import 'kemet-ui/dist/components/kemet-tabs/kemet-tab-panel';

const logoutTestUser = () => {
  const component = document.querySelector('ani-home');
    component!.userState.isLoggedIn = false;

    render(
      html`<ani-home></ani-home>`,
      document.body,
    );
};

const loginTestUser = () => {
  const component = document.querySelector('ani-home');
  component!.userState.isLoggedIn = true;
  component!.userState.user = { user: fixtureUser, jwt: 'token' };
  component!.userState.profile = fixtureProfile;
}

describe('Home', () => {
  beforeEach(() => {
    render(
      html`<ani-home></ani-home>`,
      document.body,
    );
    loginTestUser();
  });

  test('shows new quote fab when user is logged in', async () => {
    const newQuoteButton = page.getByRole('button', { name: 'New Quote' });
    await expect.element(newQuoteButton).toBeInTheDocument();
    logoutTestUser();
    await expect.element(newQuoteButton).not.toBeInTheDocument();
  });

  test('only include mine, following, and liked tabs when user is logged in', async () => {
    await expect.element(page.getByText('Mine')).toBeInTheDocument();
    await expect.element(page.getByText('Following')).toBeInTheDocument();
    await expect.element(page.getByText('Liked')).toBeInTheDocument();
    logoutTestUser();
    await expect.element(page.getByText('Mine')).not.toBeInTheDocument();
    await expect.element(page.getByText('Following')).not.toBeInTheDocument();
    await expect.element(page.getByText('Liked')).not.toBeInTheDocument();
  });
});
