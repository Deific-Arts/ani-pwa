import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  form {
    padding: 0.5rem;
  }

  .logins {
    margin-top: var(--kemet-spacer-2xl);
    display: flex;
    gap: var(--kemet-spacer-lg);
    flex-direction: column;
    align-items: center;
  }

  @media screen and (min-width: 768px) {
    .logins {
      flex-direction: row;
    }
  }
`;
