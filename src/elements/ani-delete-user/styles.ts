import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  h2 {
    max-width: 480px;
    color: var(--app-color)
  }

  div {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-bottom: var(--kemet-spacer-md);
  }

  @media screen and (min-width: 768px) {
    div {
      flex-direction: row;
    }
  }

  kemet-button {
    white-space: nowrap;
  }
`;
