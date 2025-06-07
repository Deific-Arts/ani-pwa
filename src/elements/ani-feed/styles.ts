import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  ul {
    display: flex;
    gap: 2rem;
    flex-direction: column;
    list-style: none;
    padding: 0;
    margin: 0 auto;
    max-width: 720px;
  }

  p {
    text-align: center;
  }
`;
