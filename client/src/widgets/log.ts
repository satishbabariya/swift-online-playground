import { Widget } from '@phosphor/widgets';
import '../styles/log.css';

export class Log extends Widget {
  constructor() {
    super();
    this.addClass('log');
    this.title.label = 'Output';
  }

  addWidget(widget: Widget) {
    this.node.appendChild(widget.node);
  }
}
