import { Widget } from '@phosphor/widgets';
import { Message } from '@phosphor/messaging';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Log } from './log';
import '../styles/log.css';

import { outputChannel } from '../services/channels';

export class Logs extends Widget {
  constructor(label: string) {
    super({ node: Logs.createNode() });
    this.addClass('log');
    this.title.label = label;
    this.title.closable = true;
  }

  static createNode(): HTMLElement {
    let node = document.createElement('div');
    return node;
  }

  protected onAfterAttach(msg: Message): void {
    /** Here we can subscribe to an event and update the UI based on the new emitted values */
    this.update();
  }

  protected onUpdateRequest(msg: Message): void {
    console.log('render');
    ReactDOM.render(<Log output={outputChannel} />, this.node as Element);
  }

  onCloseRequest() {
    this.dispose();
  }
  
  public dispose() {
    if (this.isDisposed) {
      return;
    }
    super.dispose();
  }
}
