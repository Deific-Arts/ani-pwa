import { css } from 'lit';

export default css`
  form {
    display: flex;
    gap: var(--kemet-spacer-xl);
    flex-direction: column;
    padding: var(--kemet-spacer-md);
  }

  div {
    display: grid;
    gap: var(--kemet-spacer-xl);
    grid-template-columns: 1fr 100px;
    margin-top: -1rem;
  }

  footer {
    display: flex;
    justify-content: space-between;
    padding: var(--kemet-spacer-md);
    border-radius: var(--kemet-border-radius-xl);
    background: var(--app-input-filled-background-color);
  }

  .error {
    color: var(--app-error-color);
  }
`;
