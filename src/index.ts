import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ShazamKitModule.web.ts
// and on native platforms to ShazamKitModule.ts
import ShazamKitModule from './ShazamKitModule';
import ShazamKitModuleView from './ShazamKitModuleView';
import { ChangeEventPayload, ShazamKitModuleViewProps } from './ShazamKitModule.types';

// Get the native constant value.
export const PI = ShazamKitModule.PI;

export function hello(): string {
  return ShazamKitModule.hello();
}

export async function setValueAsync(value: string) {
  return await ShazamKitModule.setValueAsync(value);
}

const emitter = new EventEmitter(ShazamKitModule ?? NativeModulesProxy.ShazamKitModule);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ShazamKitModuleView, ShazamKitModuleViewProps, ChangeEventPayload };
