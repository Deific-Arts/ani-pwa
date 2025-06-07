import { css } from 'lit';

export default  css`
  :host {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 9;
    display: block;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
    justify-content: space-between;
    background: var(--app-background-color);
  }

  svg {
    width: 56px;
  }

  img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 50%;
  }

  section {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    margin: 0 var(--kemet-spacer-lg);
  }

  section > :last-child {
    text-align: right;
  }

  nav {
    display: flex;
    gap: var(--kemet-spacer-md);
    max-width: 40vw;
  }
`;
