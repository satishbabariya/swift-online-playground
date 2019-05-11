import * as http from 'http';
import * as url from 'url';
import * as net from 'net';
import * as fs from 'fs';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as rpc from 'vscode-ws-jsonrpc';
import { launch } from './swift-server-launcher';
import * as ws from 'ws';
import * as shell from 'shelljs';
import * as tmp from 'tmp';
// create the express application
const app = express();
const port: number = Number(process.env.PORT) || 8080;

app.enable('trust proxy');
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// app.use(express.static(__dirname))
app.get('/', function(req, res) {
  res.sendFile('index.html', { root: 'public' });
});

app.post('/run', function(req, res) {
  return tmp.tmpName({ postfix: '.swift' }, function _tempFileCreated(
    err,
    path,
    fd,
    cleanupCallback
  ) {
    if (err) throw err;

    fs.writeFile(path, req.body.value, err => {
      if (err) throw err;
    });

    return shell.exec(`swift ${path}`, function(code, stdout, stderr) {
      fs.unlinkSync(path);
      res.send({
        code: code,
        stdout: stdout,
        stderr: stderr,
      });
    });
  });
});

app.use(express.static('public'));

// start the server
const server = app.listen(port, () => {
  console.log('server is hosted at http://localhost:' + port);
});

// create the web socket
const wss = new ws.Server({
  noServer: true,
  perMessageDeflate: false,
});

server.on('upgrade', (request: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
  const pathname = request.url ? url.parse(request.url).pathname : undefined;

  if (pathname === '/languageserver') {
    wss.handleUpgrade(request, socket, head, webSocket => {
      const socket: rpc.IWebSocket = {
        send: content =>
          webSocket.send(content, error => {
            if (error) {
              console.log(error);
              throw error;
            }
          }),
        onMessage: cb => webSocket.on('message', cb),
        onError: cb => webSocket.on('error', cb),
        onClose: cb => webSocket.on('close', cb),
        dispose: () => webSocket.close(),
      };

      // launch the server when the web socket is opened
      if (webSocket.readyState === webSocket.OPEN) {
        launch(socket);
      } else {
        webSocket.on('open', () => launch(socket));
      }
    });
  }
});
