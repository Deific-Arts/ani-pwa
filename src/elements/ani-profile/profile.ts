import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import sharedStyles from '../../shared/styles.ts';

import './information.ts';
import './change-password.ts';
import './library.ts';

@customElement('ani-profile')
export default class aniProfile extends LitElement {
  static styles = [sharedStyles];

  constructor() {
    super();
    document.title = 'Profile | Ani Book Quotes';
  }

  render() {
    return html`
      <kemet-tabs placement="top" divider>
        <kemet-tab slot="tab"><kemet-icon icon="info-circle" size="24"></kemet-icon>&nbsp;&nbsp;Information</kemet-tab>
        <kemet-tab slot="tab"><kemet-icon icon="passport" size="24"></kemet-icon>&nbsp;&nbsp;Change Password</kemet-tab>
        <kemet-tab slot="tab"><kemet-icon icon="bookmark" size="24"></kemet-icon>&nbsp;&nbsp;Library</kemet-tab>
        <kemet-tab-panel slot="panel">
          <ani-information></ani-information>
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel">
          <ani-change-password></ani-change-password>
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel">
          <ani-library></ani-library>
        </kemet-tab-panel>
      </kemet-tabs>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-profile': aniProfile
  }
}
