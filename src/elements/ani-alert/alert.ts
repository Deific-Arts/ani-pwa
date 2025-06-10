import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import alertStore, { type IAlertStore } from '../../store/alert';
import { ENUM_ALERT_STATUS } from '../../shared/enums';

import styles from './styles';
import sharedStyles from '../../shared/styles';
import KemetAlert from 'kemet-ui/dist/components/kemet-alert/kemet-alert';

@customElement('ani-alert')
export class AniAlert extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @query('kemet-alert')
  kemetAlert!: KemetAlert;

  constructor() {
    super();

    alertStore.subscribe((state) => {
      this.alertState = state;
    });
  }

  render() {
    const { status, message, opened, icon } = this.alertState;

    return html`
      <kemet-alert
        closable
        overlay
        status="${status as ENUM_ALERT_STATUS}"
        ?opened=${opened}
        @kemet-alert-closed=${() => alertStore.setState({ opened: false })}
      >
        <div>
          <kemet-icon icon="${icon}" size="24"></kemet-icon>&nbsp;
          <div>${message}</div>
        </div>
      </kemet-alert>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-alert': AniAlert;
  }
}
