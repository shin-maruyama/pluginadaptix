import type { AuthLogEventType, DateString, DateTimeString, Environment } from "./api.js";

export interface CustomerRecord {
  customer_id: string;
  company_name: string;
  company_kana?: string;
  contact_name: string;
  contact_email: string;
  phone_number?: string;
  postal_code?: string;
  address?: string;
  customer_status: string;
  wordpress_user_id?: string;
  registered_date: DateString;
  remarks?: string;
  created_at: DateTimeString;
  updated_at: DateTimeString;
}

export interface ContractRecord {
  contract_id: string;
  customer_id: string;
  company_name: string;
  plan_type: string;
  contract_status: string;
  contract_start: DateString;
  contract_end: DateString;
  billing_cycle?: string;
  contract_amount?: number;
  max_domain_count: number;
  max_plugin_count?: number;
  auto_renewal_flag?: string;
  remarks?: string;
  created_at: DateTimeString;
  updated_at: DateTimeString;
}

export interface LicenseRecord {
  license_id: string;
  license_key: string;
  license_key_hash: string;
  customer_id: string;
  contract_id: string;
  plugin_id: string;
  license_status: string;
  issue_date: DateString;
  expire_date: DateString;
  max_domain_count: number;
  current_domain_count: number;
  last_auth_datetime?: DateTimeString;
  last_auth_result?: string;
  memo?: string;
  created_at: DateTimeString;
  updated_at: DateTimeString;
}

export interface PluginRecord {
  plugin_id: string;
  plugin_code: string;
  plugin_name: string;
  plugin_description?: string;
  plugin_category?: string;
  publish_status: string;
  latest_version: string;
  force_update_version?: string;
  support_url?: string;
  manual_url?: string;
  created_at: DateTimeString;
  updated_at: DateTimeString;
}

export interface PluginVersionRecord {
  version_id: string;
  plugin_id: string;
  version: string;
  release_status: string;
  release_date?: DateString;
  plugin_zip?: string;
  file_name?: string;
  file_size?: number;
  checksum?: string;
  release_note?: string;
  is_latest: string;
  is_force_update?: string;
  created_at: DateTimeString;
  updated_at: DateTimeString;
}

export interface RegisteredDomainRecord {
  domain_id: string;
  license_id: string;
  license_key: string;
  kintone_domain: string;
  app_id?: string;
  environment?: Environment;
  domain_status: string;
  registered_at: DateTimeString;
  last_access_at?: DateTimeString;
  deactivated_at?: DateTimeString;
  remarks?: string;
}

export interface AuthLogRecord {
  log_id: string;
  auth_datetime: DateTimeString;
  event_type: AuthLogEventType;
  result_status: string;
  license_id?: string;
  license_key?: string;
  plugin_id?: string;
  plugin_version?: string;
  kintone_domain?: string;
  app_id?: string;
  ip_address?: string;
  user_agent?: string;
  error_code?: string;
  message?: string;
  created_at: DateTimeString;
}

export interface DownloadLogRecord {
  download_log_id: string;
  download_datetime: DateTimeString;
  customer_id: string;
  plugin_id: string;
  version_id: string;
  version: string;
  download_token: string;
  token_expire_at: DateTimeString;
  download_result: string;
  ip_address?: string;
  user_agent?: string;
  message?: string;
}

export interface ApiSettingRecord {
  setting_key: string;
  setting_name: string;
  setting_value: string;
  setting_type: "string" | "number" | "boolean" | "json";
  enabled_flag: string;
  description?: string;
  updated_at: DateTimeString;
}
