import { html, render } from 'lit';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { page } from '@vitest/browser/context';

import AniLogin from './login';
import './login';

import 'kemet-ui/dist/components/kemet-icon/kemet-icon';
import 'kemet-ui/dist/components/kemet-field/kemet-field';
import 'kemet-ui/dist/components/kemet-input/kemet-input';
import 'kemet-ui/dist/components/kemet-button/kemet-button';

describe('Login', () => {
  beforeEach(() => {
    render(
      html`<ani-login></ani-login>`,
      document.body,
    );
  });

  test('calls fetch login when user submits login form', async () => {
    const spyHandleLogin = vi.spyOn(AniLogin.prototype, 'handleLogin');
    const button = page.getByRole('button', { name: 'Login' });
    await button.click();
    expect(spyHandleLogin).toHaveBeenCalled();
  });

  test('calls fetch login when user submits login form', async () => {
    const spyHandleRegistration = vi.spyOn(AniLogin.prototype, 'handleRegistration');
    const button = page.getByRole('button', { name: 'Register' });
    await button.click();
    expect(spyHandleRegistration).toHaveBeenCalled();
  });

  test('calls fetch login when user submits login form', async () => {
    const spyHandleForgotPassword = vi.spyOn(AniLogin.prototype, 'handleForgotPassword');
    const button = page.getByRole('button', { name: 'Reset Password' });
    await button.click();
    expect(spyHandleForgotPassword).toHaveBeenCalled();
  });
});
