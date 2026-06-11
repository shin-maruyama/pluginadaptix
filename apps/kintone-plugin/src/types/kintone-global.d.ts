interface KintonePluginConfig {
  apiBaseUrl?: string;
  apiKey?: string;
  licenseKey?: string;
  pluginId?: string;
}

interface KintonePluginAppApi {
  getConfig(pluginId: string): KintonePluginConfig;
  setConfig(config: Record<string, string>, callback?: () => void): void;
}

interface KintoneAppRecord {
  appId: number;
}

interface KintoneAppApi {
  getId(): number | null;
}

interface KintoneApi {
  $PLUGIN_ID: string;
  app: KintoneAppApi;
  plugin: {
    app: KintonePluginAppApi;
  };
}

declare const kintone: KintoneApi;
