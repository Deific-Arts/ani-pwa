import { css } from 'lit';

export default css`
  :host {
    display: grid;
    gap: 1rem;
    grid-template-columns: auto 1fr;
    position: relative;
    padding: 2rem 2rem 0 2rem;
  }

  :host > :last-child {
    position: relative;
    border: var(--app-border);
    padding: var(--kemet-spacer-sm);
    border-radius: var(--kemet-border-radius-lg);
  }

  :host > :last-child::before {
    content: '';
    position: absolute;
    top: 1rem;
    left: -10px;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 10px 10px 10px 0;
    border-color: transparent var(--app-border-color) transparent transparent;
    transform: rotate(0deg);
  }

  :host > :last-child::after {
    content: '';
    position: absolute;
    top: 1rem;
    left: -8px;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 10px 10px 10px 0;
    border-color: transparent var(--app-background-color) transparent transparent;
    transform: rotate(0deg);
  }

  a {
    color: inherit;
  }

  img {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 50%;
  }

  header span {
    opacity: 0.75;
    font-size: 0.85rem;
  }

  [aria-label="Delete"] {
    position: absolute;
    top: 3rem;
    right: 3rem;
    z-index: 1;
  }
`;
