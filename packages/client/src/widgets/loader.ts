import { Widget } from '@phosphor/widgets';
import '../styles/loader.css';

export class Loader extends Widget {
  constructor() {
    super();
    this.addClass('loader');
  }

  addWidget(widget: Widget) {
    this.node.appendChild(widget.node);
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
