import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto;
    padding: var(--kemet-spacer-xl);
  }

  aside {
    margin-bottom: var(--kemet-spacer-sm);
  }

  img.profile {
    width: 128px;
    height: 128px;
    object-fit: cover;
    border-radius: 50%;
    margin: 0 auto;
  }

  ul {
    display: grid;
    gap: var(--kemet-spacer-xl);
    padding: 0;
    list-style: none;
  }

  aside {
    display: inline-flex;
    gap: var(--kemet-spacer-md);
  }

  div:has(img) {
    position: relative;
  }

  div:has(img) kemet-button {
    position: absolute;
    top: 5rem;
    right: 14rem;
  }

  @media screen and (min-width: 768px) {
    ul {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (min-width: 1280px) {
    ul {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;
