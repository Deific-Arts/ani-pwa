import { css } from 'lit';

export default css`
  main {
    display: block;
    max-width: var(--app-page-width);
    min-height: calc(100vh - 150px);
    margin: auto;
    padding: 0 var(--kemet-spacer-xl);
  }

  figure {
    margin: 0;
    padding: 2rem;
    background-color: rgb(var(--kemet-color-black) / 50%);
  }

  figcaption {
    margin-top: 1rem;
  }

  nav {
    display: flex;
    gap: 2.5rem;
    flex-direction: column;
    padding: 2rem;
    align-items: flex-start;
    font-size: 1.25rem;
  }

  kemet-modal {
    --kemet-modal-dialog-background-color: var(--app-background-color);
    text-align: center;
  }

  kemet-modal p {
    color: var(--app-color);
  }

  kemet-modal section {
    padding: 1rem 1.5rem;
  }

  .wrapper {
    position: relative;
  }

  .maintenance {
    text-align: center;
  }

  #modal-sign-in svg {
    width: 128px;
  }
`;
