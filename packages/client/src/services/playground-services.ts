import {
  MonacoToProtocolConverter,
  ProtocolToMonacoConverter,
  MonacoCommands,
  MonacoLanguages,
  MonacoWorkspace,
  Services,
} from 'monaco-languageclient';
import { DebugWindow } from './debug-window';

export interface PlaygroundServices extends Services {
  commands: MonacoCommands;
  languages: MonacoLanguages;
  workspace: MonacoWorkspace;
  window: DebugWindow;
}

export namespace PlaygroundServices {
  export interface Options {
    rootUri?: string;
  }
  export type Provider = () => PlaygroundServices;
  export function create(
    editor: monaco.editor.IStandaloneCodeEditor,
    options: Options = {}
  ): PlaygroundServices {
    const monacoToProtocolConverter = new MonacoToProtocolConverter();
    const protocolToMonacoConverter = new ProtocolToMonacoConverter();
    return {
      commands: new MonacoCommands(editor),
      languages: new MonacoLanguages(protocolToMonacoConverter, monacoToProtocolConverter),
      workspace: new MonacoWorkspace(
        protocolToMonacoConverter,
        monacoToProtocolConverter,
        options.rootUri
      ),
      window: new DebugWindow(),
    };
  }
  export function install(
    editor: monaco.editor.IStandaloneCodeEditor,
    options: Options = {}
  ): PlaygroundServices {
    const services = create(editor, options);
    Services.install(services);
    return services;
  }
  export function get(): PlaygroundServices {
    return Services.get() as PlaygroundServices;
  }
}
