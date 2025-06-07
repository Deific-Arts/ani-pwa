import { css } from 'lit';

export default css`
  :host {
    color: var(--app-color);
    text-align: left;
    display: block;
    padding: 1rem;
    position: relative
  }

  p {
    font-size: 0.85rem;
    margin-bottom: 0;
  }

  kemet-count {
    text-align: left;
  }

  [aria-label="Comment"]{
    position: absolute;
    right: 1rem;
    bottom: 1rem;
  }

  [aria-label="Close"] {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    z-index: 9;
  }

  section p {
    font-size: 1rem;
  }
`;
