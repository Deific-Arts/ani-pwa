import { html, render } from 'lit';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { page } from '@vitest/browser/context';
import "@vitest/browser/matchers.d.ts";
import { fixtureQuote } from './fixtures';
import { switchRoute } from '../../shared/utilities';

import './quote';
import 'kemet-ui/dist/components/kemet-icon/kemet-icon';
import 'kemet-ui/dist/components/kemet-tooltip/kemet-tooltip';
import { fixtureProfile } from '../ani-profile/fixtures';

describe('Quote', () => {
  beforeEach(() => {
    render(
      html`<ani-quote .quote=${fixtureQuote}></ani-quote>`,
      document.body,
    );

    vi.mock('../../shared/utilities', () => ({
      switchRoute: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('displays basic info about the quote', async () => {
    await expect.element(page.getByText(/In the representation of the Zodiac in the Temple of Denderah/i)).toBeInTheDocument();
    await expect.element(page.getByText(/Note: /i)).toBeInTheDocument();
    await expect.element(page.getByText(/Pagan Origins of the Christ Myth/i)).toBeInTheDocument();
  });

  test('displays delete button when quote user is logged in', async () => {
    const component = document.querySelector('ani-quote');
    component!.userState.profile = { ...fixtureProfile, id: 1 };
    // we need to re-render after updating the userState
    render(
      html`<ani-quote .quote=${fixtureQuote}></ani-quote>`,
      document.body,
    );
    await expect.element(page.getByLabelText('Delete')).toBeInTheDocument();
  });

  test('goes to the user profile page when avatar is clicked', async () => {
    const avatar = await page.getByAltText(/OgdoadPantheon/i);
    await avatar.click();
    expect(switchRoute).toBeCalledWith('/user/1');
  });
});
