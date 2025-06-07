import { page } from '@vitest/browser/context';
import { html, render } from 'lit';
import { expect, test, describe, beforeEach } from 'vitest';
import "@vitest/browser/matchers.d.ts";
import { fixtureQuotes, fixtureUser } from './fixtures';

import './user-view';
import '../ani-book/book';

describe('User View', () => {
  beforeEach(() => {
    render(
      html`<ani-user-view .user=${fixtureUser} .quotes=${fixtureQuotes}></ani-user-view>`,
      document.body,
    );
  });

  test('displays the correct user', async () => {
    await expect.element(page.getByText('OgdoadPantheon')).toBeInTheDocument();
  });

  test('displays the correct number of quotes', async () => {
    await expect.element(page.getByText('6 quotes')).toBeInTheDocument();
  });

  test('displays the correct number of followings', async () => {
    await expect.element(page.getByText('1 following')).toBeInTheDocument();
  });

  test('displays the correct number of followers', async () => {
    await expect.element(page.getByText('0 followers')).toBeInTheDocument();
  });

  test('displays the bio correctly', async () => {
    await expect.element(page.getByText('Developer. Creator. Cat lover. INTP since 1985.')).toBeInTheDocument();
  });

  // TODO: this test relies on the API to be working to pass, consider removing
  // test('displays the books correctly', async () => {
  //   await expect.element(page.getByText('Christ in Egypt')).toBeInTheDocument();
  // });
});
