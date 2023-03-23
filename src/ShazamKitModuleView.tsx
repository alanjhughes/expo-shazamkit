import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ShazamKitModuleViewProps } from './ShazamKitModule.types';

const NativeView: React.ComponentType<ShazamKitModuleViewProps> =
  requireNativeViewManager('ShazamKitModule');

export default function ShazamKitModuleView(props: ShazamKitModuleViewProps) {
  return <NativeView {...props} />;
}
