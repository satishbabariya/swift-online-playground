import { MessageActionItem, MessageType, Window, OutputChannel } from 'monaco-languageclient';

import { outputChannel } from '../services/channels';

export class DebugWindow implements Window {
  protected readonly channels = new Map<string, OutputChannel>();
  showMessage<T extends MessageActionItem>(
    type: MessageType,
    message: string,
    ...actions: T[]
  ): Thenable<T | undefined> {
    if (type === MessageType.Error) {
      outputChannel.push(`[Error] ${message}`);
    }
    if (type === MessageType.Warning) {
      outputChannel.push(`[Warning] ${message}`);
    }
    if (type === MessageType.Info) {
      outputChannel.push(`[Info] ${message}`);
    }
    if (type === MessageType.Log) {
      outputChannel.push(`[Log] ${message}`);
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
      show(): void {
        console.log('show');
      },
      dispose(): void {
        console.log('dispose');
      },
    };
    this.channels.set(name, channel);
    return channel;
  }
}
