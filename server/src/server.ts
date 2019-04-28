
import * as http from "http";
import * as url from "url";
import * as net from "net";
import * as express from "express";
import * as rpc from "vscode-ws-jsonrpc";
import { launch } from "./swift-server-launcher";
import * as ws from "ws";

// create the express application
const app = express();
const port: number = Number(process.env.PORT) || 3000;

// start the server
const server = app.listen(port);

// create the web socket
const wss = new ws.Server({
  noServer: true,
  perMessageDeflate: false
});

server.on('upgrade', (request: http.IncomingMessage, socket: net.Socket, head: Buffer) => {

    const pathname = request.url ? url.parse(request.url).pathname : undefined;

    if (pathname === "/lsp") {
      wss.handleUpgrade(request, socket, head, webSocket => {
        const socket: rpc.IWebSocket = {
          send: content =>
            webSocket.send(content, error => {
              if (error) {
                console.log(error);
                throw error;
              }
            }),
          onMessage: cb => webSocket.on("message", cb),
          onError: cb => webSocket.on("error", cb),
          onClose: cb => webSocket.on("close", cb),
          dispose: () => webSocket.close()
        };

        // launch the server when the web socket is opened
        if (webSocket.readyState === webSocket.OPEN) {
          launch(socket);
        } else {
          webSocket.on("open", () => launch(socket));
        }
      });
    }
  }
);
