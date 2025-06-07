import { css } from 'lit';

export default css`
  :host {
    display: block;
    max-width: 720px;
    margin: auto;
  }

  ul {
    display: flex;
    gap: 1rem;
    flex-direction: column;
    margin: 1rem 0;
    padding: 0;
    list-style: none;
  }
`;
