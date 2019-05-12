import { Widget } from '@phosphor/widgets';
// import * as monaco from 'monaco-editor';
import '../styles/editor.css';

import { listen, MessageConnection } from 'vscode-ws-jsonrpc';
import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  MonacoServices,
  createConnection,
} from 'monaco-languageclient';
import normalizeUrl = require('normalize-url');

import { PlaygroundServices } from '../services/playground-services';

const ReconnectingWebSocket = require('reconnecting-websocket');

require('monaco-editor-core');

(self as any).MonacoEnvironment = {
  getWorkerUrl: () => './editor.worker.bundle.js',
};

import { debugChannel } from '../services/channels';

import * as colors from 'ansi-colors';

export class Editor extends Widget {
  editor: monaco.editor.IStandaloneCodeEditor;
  langauge = 'swift';

  constructor() {
    super();
    this.addClass('editor');

    monaco.languages.register({
      id: this.langauge,
      extensions: ['.swift'],
      aliases: ['Swift', 'swift'],
      mimetypes: ['text/plain'],
    });

    this.editor = monaco.editor.create(this.node, {
      language: this.langauge,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
    });

    // install Monaco language client services
    // MonacoServices.install(this.editor);
    PlaygroundServices.install(this.editor);

    // create the web socket
    const url = this.createUrl('/languageserver');
    const webSocket = this.createWebSocket(url);

    webSocket.onerror = function(event) {
      if (event.timeStamp) {
        debugChannel.push(colors.red('[ERROR] ') + 'Failed to connect WebSocket');
      }
    };

    // listen when the web socket is opened
    listen({
      webSocket,
      onConnection: connection => {
        // create and start the language client
        const languageClient = this.createLanguageClient(connection);
        const disposable = languageClient.start();
        connection.onClose(() => disposable.dispose());
      },
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

  public getValue(): string {
    return this.editor.getValue();
  }

  createLanguageClient(connection: MessageConnection): MonacoLanguageClient {
    return new MonacoLanguageClient({
      id: 'sourcekit-lsp',
      name: 'SourceKit Language Server',
      clientOptions: {
        // use a language id as a document selector
        documentSelector: [this.langauge],

        synchronize: undefined,

        // disable the default error handler
        errorHandler: {
          error: () => ErrorAction.Continue,
          closed: () => CloseAction.DoNotRestart,
        },
      },
      // create a language client connection from the JSON RPC connection on demand
      connectionProvider: {
        get: (errorHandler, closeHandler) => {
          return Promise.resolve(createConnection(connection, errorHandler, closeHandler));
        },
      },
    });
  }

  createUrl(path: string): string {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    return normalizeUrl(`${protocol}://${location.host}${location.pathname}${path}`);
    // return 'wss://playground-swift-online-playground.7e14.starter-us-west-2.openshiftapps.com/lsp';
  }

  createWebSocket(url: string): WebSocket {
    const socketOptions = {
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1.3,
      connectionTimeout: 10000,
      maxRetries: Infinity,
      debug: false,
    };
    return new ReconnectingWebSocket(url, undefined, socketOptions);
  }
}
