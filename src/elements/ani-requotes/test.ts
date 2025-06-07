import { page } from '@vitest/browser/context';
import { html, render } from 'lit';
import { expect, test, describe, vi } from 'vitest';
import "@vitest/browser/matchers.d.ts";
import { fixtureQuoteHasRequoteFromUser1, fixtureQuoteUser1 } from './fixtures';
import { fixtureUser } from '../ani-user-view/fixtures';

import AniRequotes from './requotes';
import './requotes';
import 'kemet-ui/dist/components/kemet-icon/kemet-icon';


describe('Requotes', () => {
  test('if user is logged in renders the icons without the button', async () => {
    render(
      html`<ani-requotes></ani-requotes>`,
      document.body,
    );

    const component = document.querySelector('ani-requotes');
    component!.userState.isLoggedIn = true;

    await expect.element(page.getByRole('button')).not.toBeInTheDocument();
  });

  test('if user has requoted renders the icons without the button', async () => {
    render(
      html`<ani-requotes .quote=${fixtureQuoteHasRequoteFromUser1}></ani-requotes>`,
      document.body,
    );

    const component = document.querySelector('ani-requotes');
    component!.userState.user = { jwt: 'token', user: fixtureUser };

    await expect.element(page.getByRole('button', { name: 'Requote' })).not.toBeInTheDocument();
  });

  test('does a requote when button is clicked', async () => {
    render(
      html`<ani-requotes .quote=${fixtureQuoteUser1}></ani-requotes>`,
      document.body,
    );

    const component = document.querySelector('ani-requotes');

    component!.userState.user = {
      jwt: 'token',
      user: {
        ...fixtureUser,
        id: 9,
      }
    };

    const spyPostRequote = vi.spyOn(AniRequotes.prototype, 'postRequote');
    await page.getByRole('button', { name: 'Requote' }).click();
    expect(spyPostRequote).toHaveBeenCalled();
  });
});
