import { MessageActionItem, MessageType, Window, OutputChannel } from 'monaco-languageclient';
import { BehaviorSubject } from 'rxjs';

export const debugChannel: BehaviorSubject<string> = new BehaviorSubject(null);

export class DebugWindow implements Window {
  protected readonly channels = new Map<string, OutputChannel>();
  showMessage<T extends MessageActionItem>(
    type: MessageType,
    message: string,
    ...actions: T[]
  ): Thenable<T | undefined> {
    if (type === MessageType.Error) {
      debugChannel.next(`[Error] ${message}`);
    }
    if (type === MessageType.Warning) {
      debugChannel.next(`[Warning] ${message}`);
    }
    if (type === MessageType.Info) {
      debugChannel.next(`[Info] ${message}`);
    }
    if (type === MessageType.Log) {
      debugChannel.next(`[Log] ${message}`);
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
        debugChannel.next(value)
      },
      appendLine(line: string): void {
        console.log(line);
        debugChannel.next(line)
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
