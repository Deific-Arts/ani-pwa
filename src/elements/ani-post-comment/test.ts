import { html, render } from 'lit';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { userEvent, page } from '@vitest/browser/context';
import { fixtureProfile } from '../ani-profile/fixtures';
import { fixtureUser } from '../ani-user-view/fixtures';
import KemetButton from 'kemet-ui/dist/components/kemet-button/kemet-button';
import AniPostComment from './post-comment';
import './post-comment';

import 'kemet-ui/dist/components/kemet-icon/kemet-icon';
import 'kemet-ui/dist/components/kemet-field/kemet-field';
import 'kemet-ui/dist/components/kemet-textarea/kemet-textarea';
import 'kemet-ui/dist/components/kemet-button/kemet-button';


describe('Post Comment', () => {
  beforeEach(() => {
    render(
      html`<ani-post-comment></ani-post-comment>`,
      document.body,
    );

    const component = document.querySelector('ani-post-comment');
    component!.userState.isLoggedIn = true;
    component!.userState.user = { user: fixtureUser, jwt: 'token' };
    component!.userState.profile = fixtureProfile;
  });

  test('user is able to comment', async () => {
    const spyHandlePost = vi.spyOn(AniPostComment.prototype, 'handlePost');
    const textarea = page.getByRole('textbox');
    const submitButton = document.querySelector('ani-post-comment')?.shadowRoot?.querySelector('kemet-button') as KemetButton;
    await userEvent.fill(textarea, 'this is a comment');
    submitButton.click();
    expect(spyHandlePost).toHaveBeenCalled();
  });
});
