import { observable, IObservableArray } from 'mobx';

export const outputChannel: IObservableArray<String> = observable([]);
export const debugChannel: IObservableArray<String> = observable([]);
