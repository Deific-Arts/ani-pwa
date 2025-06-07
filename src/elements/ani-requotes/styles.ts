import { css } from 'lit';

export default css`
  :host {
    display: flex;
  }

  button {
    display: inline-flex;
    gap: var(--kemet-spacer-sm);
    align-items: center;
  }
`;
