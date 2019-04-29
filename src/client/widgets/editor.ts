import { Widget } from '@phosphor/widgets';
import * as monaco from 'monaco-editor';
import '../styles/editor.css';

export class Editor extends Widget {
  editor: monaco.editor.IStandaloneCodeEditor;

  constructor() {
    super();
    this.addClass('editor');
    this.title.label = 'main.swift';
    this.title.closable = true;
    this.editor = monaco.editor.create(this.node, {
      language: 'swift',
    });
  }

  addWidget(widget: Widget) {
    this.node.appendChild(widget.node);
  }

  onResize() {
    this.editor.layout();
  }

  onAfterShow() {
    this.editor.layout();
  }

  onCloseRequest() {
    this.dispose();
  }

  public onToggleTheme(theme: string) {
    monaco.editor.setTheme(theme);
  }

  public dispose() {
    if (this.isDisposed) {
      return;
    }
    this.editor.dispose();
    super.dispose();
  }
}
