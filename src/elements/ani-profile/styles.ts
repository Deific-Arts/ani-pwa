import { css } from 'lit';

export const informationStyles = css`
  :host {
    display: block;
  }

  button.image {
    width: 100%;
  }

  button.close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
  }

  legend {
    text-align: center;
    margin-bottom: 0;
  }

  fieldset {
    text-align: center;
  }

  kemet-card {
    margin: 0 auto;
  }

  kemet-count {
    text-align: left;
  }

  kemet-textarea {
    width: 100%;
  }

  .delete {
    position: absolute;
    top: 5rem;
    right: -2rem;
  }

  .profile {
    display: block;
    margin: 0;
  }

  .profile-image {
    text-align: center;
    max-width: 128px;
    position: relative;
    margin: auto;
  }

  .profile-image + div {
    display: flex;
    gap: 1px;
    flex-direction: column;
    width: 100%;
  }
`;

export const libraryStyles = css`
  :host {
    display: block;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(1, minmax(150px, 1fr));
    gap: var(--kemet-spacer-xl);
    flex-wrap: wrap;
    margin: var(--kemet-spacer-xl);
    padding: 0;
    list-style: none;
  }

  h2 {
    padding: 0 2rem;
    margin: var(--kemet-spacer-xl) 0;
    border-bottom: none;
  }

  form {
    padding: 0 1rem 1rem 1rem;
  }

  kemet-field {
    padding: 1rem;
  }

  @media screen and (min-width: 768px) {
    ul {
      grid-template-columns: repeat(2, minmax(150px, 1fr));
    }
  }

  @media screen and (min-width: 1024px) {
    ul {
      grid-template-columns: repeat(3, minmax(150px, 1fr));
    }
  }

  @media screen and (min-width: 1280px) {
    ul {
      grid-template-columns: repeat(4, minmax(150px, 1fr));
    }
  }
`;
