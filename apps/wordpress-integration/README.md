# WordPress Integration

WordPress/PHP から PluginAdaptix API を呼び出すための API クライアントです。

## 設定

API キーはコードに直書きせず、WordPress の設定値または環境変数から取得します。

WordPress option:

```php
update_option('pluginadaptix_api_base_url', 'http://localhost:3000/v1');
update_option('pluginadaptix_api_key', 'your-api-key');
```

環境変数:

```env
PLUGINADAPTIX_API_BASE_URL=http://localhost:3000/v1
PLUGINADAPTIX_API_KEY=your-api-key
```

コンストラクタで渡した値は WordPress option と環境変数より優先されます。API キーはログ出力しないでください。

## 利用例

```php
<?php

require_once __DIR__ . '/src/PluginAdaptixApiClient.php';

use PluginAdaptix\WordPressIntegration\PluginAdaptixApiClient;

$client = new PluginAdaptixApiClient();

$contract = $client->getContractStatus('mem_001');
$plugins = $client->listPlugins('mem_001');
$downloadToken = $client->createDownloadToken('mem_001', 'plugin_001', 'LIC-XXXX-XXXX-XXXX');
```

## ショートコード

WordPress プラグインとして `pluginadaptix-wordpress-integration.php` を有効化すると、以下のショートコードを利用できます。

```text
[plugin_license_list]
```

ログイン中ユーザーの `pluginadaptix_member_id` ユーザーメタから `memberId` を取得し、未設定の場合は WordPress ユーザーIDを `memberId` として利用します。

ショートコードは `GET /v1/plugins` を呼び出し、以下の項目をHTMLテーブルで表示します。

- `pluginName`
- `licenseStatus`
- `latestVersion`
- `downloadAvailable=true` の場合のみダウンロードボタン

ダウンロードボタン押下時は `POST /v1/plugins/download-token` を呼び出し、レスポンスの `downloadUrl` にリダイレクトして ZIP ダウンロードを開始します。APIエラー時はAPIクライアントが安全化したエラーメッセージを表示します。契約期限切れまたはライセンス期限切れの場合は、ボタン非表示またはエラーメッセージ表示でダウンロードを止めます。

ダウンロードトークン発行には `licenseKey` が必要です。ショートコードはまず `GET /v1/contracts/status` の `licenses` から対象 `pluginId` の `licenseKey` を取得します。契約情報 API を利用できない環境では、以下のいずれかのユーザーメタにライセンスキーを設定してください。

```php
update_user_meta($user_id, 'pluginadaptix_license_keys', [
    'plugin_001' => 'LIC-XXXX-XXXX-XXXX',
]);

// 単一プラグイン向けの代替設定
update_user_meta($user_id, 'pluginadaptix_license_key_plugin_001', 'LIC-XXXX-XXXX-XXXX');
update_user_meta($user_id, 'pluginadaptix_license_key', 'LIC-XXXX-XXXX-XXXX');
```

未ログイン時はログイン案内を表示します。

## 対応 API

- `GET /v1/contracts/status`
- `GET /v1/plugins`
- `POST /v1/plugins/download-token`

## エラー処理

通信エラー、設定不足、不正なレスポンスの場合も、秘密情報や内部詳細を含まない安全なレスポンスを返します。

```php
[
    'success' => false,
    'code' => 'API_CLIENT_NETWORK_ERROR',
    'message' => 'APIに接続できませんでした。',
    'data' => null,
]
```

API からエラーレスポンスが返った場合は、API の `code` と安全化した `message` のみを返し、API キーやライセンスキーは返しません。メッセージ内に秘密情報らしき値が含まれる場合は伏せ字にします。

## 動作確認手順

1. API サーバーを起動します。
2. WordPress の option または環境変数に `PLUGINADAPTIX_API_BASE_URL` と `PLUGINADAPTIX_API_KEY` を設定します。
3. WordPress のプラグインまたはテーマから `src/PluginAdaptixApiClient.php` を読み込みます。
4. `getContractStatus('mem_001')` を呼び出し、`success`、`code`、`message`、`data` が返ることを確認します。
5. `listPlugins('mem_001')` を呼び出し、利用可能なプラグイン一覧が返ることを確認します。
6. `createDownloadToken('mem_001', 'plugin_001', 'LIC-XXXX-XXXX-XXXX')` を呼び出し、`downloadUrl` と `expiresIn` が返ることを確認します。
7. API キーを未設定または不正な値に変更し、安全なエラーメッセージが返り、ログに API キーやライセンスキーが出力されていないことを確認します。
8. WordPress 管理画面でプラグインを有効化し、ログインユーザーの `pluginadaptix_member_id` ユーザーメタを設定します。
9. 必要に応じて、ログインユーザーの `pluginadaptix_license_keys` ユーザーメタに `pluginId` と `licenseKey` の対応を設定します。
10. 投稿または固定ページに `[plugin_license_list]` を配置し、プラグイン名、ライセンス状態、最新バージョン、操作列が表示されることを確認します。
11. `downloadAvailable=true` のプラグインにのみダウンロードボタンが表示されることを確認します。
12. ダウンロードボタンを押し、`POST /v1/plugins/download-token` の `downloadUrl` へ遷移して ZIP ダウンロードが開始されることを確認します。
13. 契約期限切れ、ライセンス期限切れ、APIキー不正などの場合に、安全なエラーメッセージが表示されることを確認します。
14. 未ログイン状態で同じページを開き、ログイン案内が表示されることを確認します。
