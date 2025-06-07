import { LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import { privacy, remove, terms } from './templates';

@customElement('ani-legal')
export class AniLegal extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  slug: string = location.pathname.split('/')[2];

  updated() {
    this.slug = location.pathname.split('/')[2];
  }

  render() {
    if (this.slug === 'terms') {
      return terms;
    }

    if (this.slug === "privacy") {
      return privacy;
    }

    if (this.slug === "remove") {
      return remove;
    }

    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-legal': AniLegal
  }
}
