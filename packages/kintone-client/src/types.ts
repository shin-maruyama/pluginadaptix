export type KintonePrimitiveValue = string | number | boolean | null;
export type KintoneFieldValue =
  | KintonePrimitiveValue
  | KintonePrimitiveValue[]
  | { readonly [key: string]: unknown };

export interface KintoneField<TValue extends KintoneFieldValue = KintoneFieldValue> {
  value: TValue;
}

export type KintoneRecord = Record<string, KintoneField>;
export type KintoneRecordInput = Record<string, KintoneField>;

export interface KintoneClientOptions {
  baseUrl: string;
  apiToken: string;
  fetch?: typeof fetch;
}

export interface GetRecordsParams {
  app: number | string;
  query?: string;
  fields?: string[];
  totalCount?: boolean;
}

export interface GetRecordsResponse<TRecord extends KintoneRecord = KintoneRecord> {
  records: TRecord[];
  totalCount?: string;
}

export interface GetRecordParams {
  app: number | string;
  id: number | string;
}

export interface GetRecordResponse<TRecord extends KintoneRecord = KintoneRecord> {
  record: TRecord;
}

export interface AddRecordParams<TRecord extends KintoneRecordInput = KintoneRecordInput> {
  app: number | string;
  record: TRecord;
}

export interface AddRecordResponse {
  id: string;
  revision: string;
}

export interface KintoneUpdateKey {
  field: string;
  value: string;
}

export interface UpdateRecordParams<TRecord extends KintoneRecordInput = KintoneRecordInput> {
  app: number | string;
  record: TRecord;
  id?: number | string;
  updateKey?: KintoneUpdateKey;
  revision?: number | string;
}

export interface UpdateRecordResponse {
  revision: string;
}
