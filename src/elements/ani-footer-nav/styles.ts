import { css } from 'lit';

export default css`
  :host {
    display: block;
    border-top: 1px solid var(--app-border-color);
    background: var(--app-background-color);
  }

  a {
    color: var(--app-color-text);
    text-decoration: none;
  }

  nav {
    display: flex;
    gap: var(--kemet-spacer-md);
    justify-content: space-between;
    margin: 0 auto;
    padding: var(--kemet-spacer-md);
    width: 100%;
    box-sizing: border-box;
    max-width: var(--app-page-width);
  }
`;
