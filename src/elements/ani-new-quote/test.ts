import { html, render } from 'lit';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { page, userEvent } from '@vitest/browser/context';
import { fixtureProfile } from '../ani-profile/fixtures';

import KemetButton from 'kemet-ui/dist/components/kemet-button/kemet-button';
import AniNewQuote from './new-quote';
import './new-quote';

import 'kemet-ui/dist/components/kemet-icon/kemet-icon';
import 'kemet-ui/dist/components/kemet-field/kemet-field';
import 'kemet-ui/dist/components/kemet-input/kemet-input';
import 'kemet-ui/dist/components/kemet-select/kemet-select';
import 'kemet-ui/dist/components/kemet-select/kemet-option';
import 'kemet-ui/dist/components/kemet-textarea/kemet-textarea';
import 'kemet-ui/dist/components/kemet-button/kemet-button';

describe('New Quote', () => {
  beforeEach(() => {
    render(
      html`<ani-new-quote></ani-new-quote>`,
      document.body,
    );

    const component = document.querySelector('ani-new-quote');
    component!.userState.isLoggedIn = true;
    component!.userState.profile = fixtureProfile;
  });

  test('user is able to post a new quote', async () => {
    const spyAddQuote = vi.spyOn(AniNewQuote.prototype, 'addQuote');

    const inputQuote = document.querySelector('ani-new-quote')
      ?.shadowRoot?.querySelector('kemet-textarea[name="quote"]')
      ?.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

    const inputBook = document.querySelector('ani-new-quote')
      ?.shadowRoot?.querySelector('kemet-select[name="book"]')
      ?.shadowRoot?.querySelector("select") as HTMLSelectElement;

    const submitButton = document.querySelector('ani-new-quote')?.shadowRoot?.querySelector('kemet-button[aria-label="Submit"]') as KemetButton;

    await userEvent.type(inputQuote, 'this is a quote');
    await userEvent.selectOptions(inputBook, 'Iaqe9CG_s6cC');
    submitButton.click();
    expect(spyAddQuote).toHaveBeenCalled();
  });

  test('user is able to cancel new quote modal', async () => {
    const spyHandleCancel = vi.spyOn(AniNewQuote.prototype, 'handleCancel');
    const cancelButton = page.getByText(/Cancel/i);
    await cancelButton.click();
    expect(spyHandleCancel).toHaveBeenCalled();
  });
});
