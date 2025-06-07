import { css } from 'lit';

export default css`
  :host {
    display: block;
    height: 1px;
    overflow: hidden;
    visibility: hidden;
    transition: height 0.3s ease-in-out;
  }

  :host([opened]) {
    height: 148px;
    visibility: visible;
  }

  form,
  section {
    padding: var(--kemet-spacer-md);
  }
`;
