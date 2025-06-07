import { html, render } from 'lit';
import { expect, test, describe, vi } from 'vitest';
import { waitFor } from '@testing-library/dom';
import AniQuoteView from './quote-view';
import './quote-view';

describe('Quote View', () => {
  test('gets the quote data', async () => {
    render(
      html`<ani-quote-view documentId="bgiv5hr1c9rddh3goblaghlk"></ani-quote-view>`,
      document.body,
    );

    const spyGetQuote = vi.spyOn(AniQuoteView.prototype, 'getQuote');
    const spyGetComments = vi.spyOn(AniQuoteView.prototype, 'getComments');

    await waitFor(() => {
      expect(spyGetQuote).toHaveBeenCalled();
      expect(spyGetComments).toHaveBeenCalled();
    });
  });
});
