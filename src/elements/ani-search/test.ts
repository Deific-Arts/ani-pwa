import { page, userEvent } from '@vitest/browser/context';
import { html, render } from 'lit';
import { vi, expect, test, describe, beforeEach } from 'vitest';
import { fixtureProfile } from '../ani-profile/fixtures';
import { fixtureUser } from '../ani-user-view/fixtures';
import { AniSearch } from './search';

import './search';
import 'kemet-ui/dist/components/kemet-input/kemet-input';

describe.skip('Search', () => {
  beforeEach(() => {
    render(
      html`<ani-search></ani-search>`,
      document.body,
    );

    const component = document.querySelector('ani-search');
    component!.userState.isLoggedIn = true;
    component!.userState.user = { user: fixtureUser, jwt: 'token' };
    component!.userState.profile = fixtureProfile;
  });

  test('accepts users input for searching', async () => {
    const spyHandleSearch = vi.spyOn(AniSearch.prototype, 'handleSearch');
    await userEvent.type(page.getByRole('textbox'), "test");
    expect(spyHandleSearch).toHaveBeenCalledWith(expect.objectContaining({ detail: 'test'}));
  });

  test('accepts users input for searching on blur', async () => {
    const spyHandleSearchFocus = vi.spyOn(AniSearch.prototype, 'handleSearchFocus');
    await userEvent.type(page.getByRole('textbox'), "test");
    await userEvent.click(document.body);
    expect(spyHandleSearchFocus).toHaveBeenCalled();
  });
});
