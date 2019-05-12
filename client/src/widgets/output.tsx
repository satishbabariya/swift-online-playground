import { Widget } from '@phosphor/widgets';
import { Message } from '@phosphor/messaging';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Log } from './log';
import '../styles/log.css';

import { observable, IObservableArray } from 'mobx';

export class Logs extends Widget {
  private channel: IObservableArray<String>;

  constructor(label: string, isClosable: boolean, channel: IObservableArray<String>) {
    super({ node: Logs.createNode() });
    this.addClass('log');
    this.title.label = label;
    this.title.closable = isClosable;
    this.channel = channel;
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
    if (this.channel) {
      ReactDOM.render(<Log output={this.channel} />, this.node as Element);
    }
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
