import { MessageActionItem, MessageType, Window, OutputChannel } from 'monaco-languageclient';

import { outputChannel, debugChannel } from '../services/channels';

import * as colors from 'ansi-colors';

export class DebugWindow implements Window {
  protected readonly channels = new Map<string, OutputChannel>();
  showMessage<T extends MessageActionItem>(
    type: MessageType,
    message: string,
    ...actions: T[]
  ): Thenable<T | undefined> {
    if (type === MessageType.Error) {
      debugChannel.push(colors.bold.red('[ERROR] ') + message);
    }
    if (type === MessageType.Warning) {
      debugChannel.push(colors.bold.yellow('[Warning] ') + message);
    }
    if (type === MessageType.Info) {
      debugChannel.push(colors.bold.gray('[Info] ') + message);
    }
    if (type === MessageType.Log) {
      debugChannel.push(colors.bold.green('[Log] ') + message);
    }
    return Promise.resolve(undefined);
  }
  createOutputChannel(name: string): OutputChannel {
    const existing = this.channels.get(name);
    if (existing) {
      return existing;
    }
    const channel: OutputChannel = {
      append(value: string): void {
        console.log(value);
      },
      appendLine(line: string): void {
        console.log(line);
      },
      show(): void {},
      dispose(): void {},
    };
    this.channels.set(name, channel);
    return channel;
  }
}
