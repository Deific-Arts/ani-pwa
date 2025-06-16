import { html } from "lit";
import { svgLogo } from "../../shared/svgs";
import { switchRoute } from "../../shared/utilities";
import modalsStore from "../../store/modals";

import '../ani-post-comment/post-comment';
import '../ani-new-quote/new-quote';
import '../ani-delete-user/delete-user';

export const signInModalTemplate = html`
  <section>
    ${svgLogo}
    <p>Want to join in on the fun? Login now!</p>
    <kemet-button
      variant="rounded"
      @click=${() => {
        modalsStore.setState({ signInOpened: false });
        switchRoute('/login');
      }}>
      Login
    </kemet-button>
  </section>
`;

export const commentModalTemplate = html`
  <ani-post-comment></ani-post-comment>
`;

export const newQuoteModalTemplate = html`
  <ani-new-quote></ani-new-quote>
`;

export const deleteUserModalTemplate = html`
  <ani-delete-user></ani-delete-user>
`;
