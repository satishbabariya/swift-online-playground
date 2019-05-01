import { Widget } from '@phosphor/widgets';
// import * as monaco from 'monaco-editor';
import '../styles/editor.css';

import { listen, MessageConnection } from "vscode-ws-jsonrpc";
import {
  BaseLanguageClient,
  CloseAction,
  ErrorAction,
  createMonacoServices,
  createConnection
} from "monaco-languageclient";

import normalizeUrl = require("normalize-url");

const ReconnectingWebSocket = require("reconnecting-websocket");

// import * as monaco from 'monaco-editor';
require("monaco-editor/esm/vs/editor/editor.main");

export class Editor extends Widget {
  editor:  monaco.editor.IStandaloneCodeEditor;
  langauge = "swift";

  constructor() {
    super();
    this.addClass('editor');

    monaco.languages.register({
      id: 'swift',
      extensions: ['.swift'],
      aliases: ['Swift','swift'],
      mimetypes: ['text/plain'],
    });

    this.editor = monaco.editor.create(this.node, {
      language: this.langauge,
    });


    // create the web socket
    const url = this.createUrl('/lsp')
    const webSocket = this.createWebSocket(url);
    const services = createMonacoServices(this.editor);
    // listen when the web socket is opened
    listen({
        webSocket,
        onConnection: connection => {
            // create and start the language client
            const languageClient = this.createLanguageClient(connection, services);
            const disposable = languageClient.start();
            connection.onClose(() => disposable.dispose());
        }
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


  createLanguageClient(
    connection: MessageConnection,
    services: BaseLanguageClient.IServices
  ): BaseLanguageClient {
    return new BaseLanguageClient({
      name: `${this.langauge.toUpperCase()} Client`,
      clientOptions: {
        // use a language id as a document selector
        documentSelector: [this.langauge],
        // disable the default error handler
        errorHandler: {
          error: () => ErrorAction.Continue,
          closed: () => CloseAction.DoNotRestart
        }
      },
      services,
      // create a language client connection from the JSON RPC connection on demand
      connectionProvider: {
        get: (errorHandler, closeHandler) => {
          return Promise.resolve(
            createConnection(connection, errorHandler, closeHandler)
          );
        }
      }
    });
  }

createUrl(path: string): string {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    return normalizeUrl(`${protocol}://${location.host}${location.pathname}${path}`);
}

createWebSocket(url: string): WebSocket {
    const socketOptions = {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 10000,
        maxRetries: Infinity,
        debug: false
    };
    return new ReconnectingWebSocket(url, undefined, socketOptions);
}

}
