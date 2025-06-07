import { html, render } from 'lit';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { page } from '@vitest/browser/context';
import AniComments from './comments';
import './comments';
import 'kemet-ui/dist/components/kemet-icon/kemet-icon';

describe('Comments', () => {
  beforeEach(() => {
    render(
      html`<ani-comments></ani-comments>`,
      document.body,
    );
  });

  test('calls open comments when clicked', async () => {
    const spyOpenComment = vi.spyOn(AniComments.prototype, 'openComment');
    const button = page.getByRole("button");
    await button.click();
    expect(spyOpenComment).toHaveBeenCalled();
  });
});
