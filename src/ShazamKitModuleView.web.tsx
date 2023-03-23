import * as React from 'react';

import { ShazamKitModuleViewProps } from './ShazamKitModule.types';

export default function ShazamKitModuleView(props: ShazamKitModuleViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
