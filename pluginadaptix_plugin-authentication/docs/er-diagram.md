# ER図

## kintoneプラグイン認証システム

```mermaid
erDiagram

    customers ||--o{ contracts : "has"
    customers ||--o{ licenses : "owns"
    customers ||--o{ download_logs : "downloads"

    contracts ||--o{ licenses : "issues"

    plugins ||--o{ licenses : "licensed_for"
    plugins ||--o{ plugin_versions : "has_versions"
    plugins ||--o{ auth_logs : "logged_by"
    plugins ||--o{ download_logs : "downloaded_as"

    plugin_versions ||--o{ download_logs : "downloaded_version"

    licenses ||--o{ registered_domains : "registered_to"
    licenses ||--o{ auth_logs : "authenticates"

    customers {
        string customer_id PK
        string company_name
        string company_kana
        string contact_name
        string contact_email
        string phone_number
        string postal_code
        string address
        string customer_status
        string wordpress_user_id
        date registered_date
        datetime created_at
        datetime updated_at
    }

    contracts {
        string contract_id PK
        string customer_id FK
        string company_name
        string plan_type
        string contract_status
        date contract_start
        date contract_end
        string billing_cycle
        number contract_amount
        number max_domain_count
        number max_plugin_count
        string auto_renewal_flag
        datetime created_at
        datetime updated_at
    }

    licenses {
        string license_id PK
        string license_key
        string license_key_hash
        string customer_id FK
        string contract_id FK
        string plugin_id FK
        string license_status
        date issue_date
        date expire_date
        number max_domain_count
        number current_domain_count
        datetime last_auth_datetime
        string last_auth_result
        datetime created_at
        datetime updated_at
    }

    plugins {
        string plugin_id PK
        string plugin_code
        string plugin_name
        string plugin_description
        string plugin_category
        string publish_status
        string latest_version
        string force_update_version
        string support_url
        string manual_url
        datetime created_at
        datetime updated_at
    }

    plugin_versions {
        string version_id PK
        string plugin_id FK
        string version
        string release_status
        date release_date
        string plugin_zip
        string file_name
        number file_size
        string checksum
        string release_note
        string is_latest
        string is_force_update
        datetime created_at
        datetime updated_at
    }

    registered_domains {
        string domain_id PK
        string license_id FK
        string license_key
        string kintone_domain
        string app_id
        string environment
        string domain_status
        datetime registered_at
        datetime last_access_at
        datetime deactivated_at
    }

    auth_logs {
        string log_id PK
        datetime auth_datetime
        string event_type
        string result_status
        string license_id FK
        string license_key
        string plugin_id FK
        string plugin_version
        string kintone_domain
        string app_id
        string ip_address
        string user_agent
        string error_code
        string message
        datetime created_at
    }

    download_logs {
        string download_log_id PK
        datetime download_datetime
        string customer_id FK
        string plugin_id FK
        string version_id FK
        string version
        string download_token
        datetime token_expire_at
        string download_result
        string ip_address
        string user_agent
        string message
    }

    api_settings {
        string setting_key PK
        string setting_name
        string setting_value
        string setting_type
        string enabled_flag
        string description
        datetime updated_at
    }
```

---

# リレーション定義

| No | 親テーブル           | 子テーブル              | 関連キー        | 関係  | 内容                    |
| -- | --------------- | ------------------ | ----------- | --- | --------------------- |
| 1  | customers       | contracts          | customer_id | 1:N | 1顧客が複数契約を持つ           |
| 2  | customers       | licenses           | customer_id | 1:N | 1顧客が複数ライセンスを持つ        |
| 3  | customers       | download_logs      | customer_id | 1:N | 1顧客が複数ダウンロード履歴を持つ     |
| 4  | contracts       | licenses           | contract_id | 1:N | 1契約から複数ライセンスを発行する     |
| 5  | plugins         | licenses           | plugin_id   | 1:N | 1プラグインに複数ライセンスが紐づく    |
| 6  | plugins         | plugin_versions    | plugin_id   | 1:N | 1プラグインが複数バージョンを持つ     |
| 7  | plugins         | auth_logs          | plugin_id   | 1:N | 1プラグインに複数認証ログが紐づく     |
| 8  | plugins         | download_logs      | plugin_id   | 1:N | 1プラグインに複数ダウンロード履歴が紐づく |
| 9  | plugin_versions | download_logs      | version_id  | 1:N | 1バージョンに複数ダウンロード履歴が紐づく |
| 10 | licenses        | registered_domains | license_id  | 1:N | 1ライセンスに複数ドメインを登録できる   |
| 11 | licenses        | auth_logs          | license_id  | 1:N | 1ライセンスに複数認証ログが紐づく     |

---

# 設計上のポイント

## 1. 顧客と契約を分離

`customers` と `contracts` を分離することで、以下に対応できます。

* 契約更新
* プラン変更
* 一時停止
* 再契約
* 契約履歴管理

---

## 2. ライセンスと登録ドメインを分離

`licenses` と `registered_domains` を分離することで、以下に対応できます。

* 1ライセンス1ドメイン
* 1ライセンス複数ドメイン
* sandbox環境の登録
* ドメイン解除
* ドメイン移行

---

## 3. プラグインとバージョンを分離

`plugins` と `plugin_versions` を分離することで、以下に対応できます。

* バージョン履歴管理
* 強制アップデート
* 過去バージョン管理
* ZIPファイル管理
* リリースノート管理

---

## 4. 認証ログとダウンロードログを分離

`auth_logs` と `download_logs` を分離することで、以下を分けて管理できます。

* プラグイン認証履歴
* 起動時チェック履歴
* ダウンロード履歴
* エラー履歴
* 監査ログ

---

# Codexへの指示例

```md
## Task

docs/er-diagram.md のER図と docs/05_table_definition.md のテーブル定義をもとに、
kintone REST API用のRepository層を実装してください。

## 対象

- packages/kintone-client
- apps/api-server/src/repositories

## 注意

- 主キーは各テーブルのID項目を使用する
- kintoneのレコード番号には依存しない
- license_key_hash をAPI照合に使用する
- 認証ログには秘密情報を保存しない
```
