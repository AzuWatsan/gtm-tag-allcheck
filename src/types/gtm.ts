// GTM Export Types

export interface GtmExport {
  exportFormatVersion?: number;
  exportTime?: string;
  containerVersion: GtmContainerVersion;
}

export interface GtmContainerVersion {
  tag?: GtmTag[];
  trigger?: GtmTrigger[];
  variable?: GtmVariable[];
  builtInVariable?: GtmBuiltInVariable[];
  accountId?: string;
  containerId?: string;
}

export interface GtmTag {
  tagId?: string;
  name: string;
  type?: string;
  paused?: boolean;
  firingTriggerId?: string[];
  blockingTriggerId?: string[];
  parameter?: GtmParameter[];
  [key: string]: unknown;
}

export interface GtmTrigger {
  triggerId?: string;
  name: string;
  type?: string;
  filter?: unknown[];
  customEventFilter?: unknown[];
  [key: string]: unknown;
}

export interface GtmVariable {
  variableId?: string;
  name: string;
  type?: string;
  parameter?: GtmParameter[];
  [key: string]: unknown;
}

export interface GtmBuiltInVariable {
  type?: string;
  name?: string;
}

export interface GtmParameter {
  type?: string;
  key?: string;
  value?: string;
  list?: GtmParameter[];
  map?: GtmParameter[];
  [key: string]: unknown;
}

// Normalized container (parse後の正規化済み構造)
export interface NormalizedGtmContainer {
  tags: GtmTag[];
  triggers: GtmTrigger[];
  variables: GtmVariable[];
  builtInVariables: GtmBuiltInVariable[];
  metadata: {
    exportTime?: string;
    accountId?: string;
    containerId?: string;
  };
}
