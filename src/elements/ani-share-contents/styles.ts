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

  .copy {
    color: var(--app-color);
    display: grid;
    grid-template-columns: auto 1fr;
    width: 100%;
    padding: 0;
    margin: 0;
    align-items: center;
    justify-content: center;
    border: var(--app-border);
    border-radius: var(--kemet-border-radius-lg);

    & > * {
      padding: var(--kemet-spacer-md);
    }

    :first-child {
      display: flex;
      white-space: nowrap;
      background-color: var(--app-card-background-color);
    }
  }
`;
