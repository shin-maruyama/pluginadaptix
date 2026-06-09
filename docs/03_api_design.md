API詳細設計書
kintoneプラグイン認証システム
________________________________________
1. API概要
1.1 目的
本APIは、kintoneプラグインのライセンス認証、ライセンス状態確認、バージョン確認、ダウンロード制御、認証ログ登録を行うためのAPIである。
1.2 利用システム
利用元	用途
kintoneプラグイン	ライセンス認証・状態確認・更新確認
WordPress会員サイト	契約情報取得・ダウンロード制御
kintone管理アプリ	ライセンス情報・顧客情報管理
管理者	ログ確認・障害調査
________________________________________
2. 共通仕様
2.1 ベースURL
https://api.example.com
2.2 通信方式
項目	内容
プロトコル	HTTPS
データ形式	JSON
文字コード	UTF-8
認証方式	APIキー + ライセンスキー
タイムアウト	10秒
2.3 共通リクエストヘッダー
ヘッダー名	必須	内容
Content-Type	〇	application/json
X-API-Key	〇	API認証キー
X-Plugin-ID	△	プラグインID
X-Plugin-Version	△	プラグインバージョン
2.4 共通レスポンス形式
{
  "success": true,
  "code": "OK",
  "message": "正常終了",
  "data": {}
}
2.5 共通エラー形式
{
  "success": false,
  "code": "LICENSE_EXPIRED",
  "message": "ライセンスの有効期限が切れています。",
  "data": null
}
2.6 HTTPステータス
HTTPステータス	内容
200	正常
400	リクエスト不正
401	認証エラー
403	利用不可
404	データなし
409	状態不整合
429	アクセス過多
500	サーバーエラー
________________________________________
3. API一覧
No	API名	メソッド	エンドポイント	利用元
API-001	ライセンス認証API	POST	/v1/licenses/authenticate	kintoneプラグイン
API-002	ライセンス状態確認API	GET	/v1/licenses/status	kintoneプラグイン
API-003	ライセンス解除API	POST	/v1/licenses/deactivate	kintoneプラグイン
API-004	プラグイン更新確認API	GET	/v1/plugins/version	kintoneプラグイン
API-005	プラグイン一覧取得API	GET	/v1/plugins	WordPress
API-006	プラグインダウンロードURL発行API	POST	/v1/plugins/download-token	WordPress
API-007	認証ログ登録API	POST	/v1/auth-logs	API内部・プラグイン
API-008	契約情報取得API	GET	/v1/contracts/status	WordPress
API-009	ヘルスチェックAPI	GET	/v1/health	監視
________________________________________
4. API詳細
________________________________________
API-001 ライセンス認証API
目的
kintoneプラグイン初回設定時に、入力されたライセンスキーが有効か確認し、利用ドメインを登録する。
エンドポイント
POST /v1/licenses/authenticate
リクエスト
{
  "licenseKey": "LIC-XXXX-XXXX-XXXX",
  "pluginId": "plugin_001",
  "pluginVersion": "1.0.0",
  "kintoneDomain": "sample.cybozu.com",
  "companyName": "株式会社サンプル",
  "appId": "123",
  "environment": "production"
}
リクエスト項目
項目	型	必須	内容
licenseKey	string	〇	ライセンスキー
pluginId	string	〇	プラグインID
pluginVersion	string	〇	利用中バージョン
kintoneDomain	string	〇	kintoneドメイン
companyName	string	△	利用会社名
appId	string	△	kintoneアプリID
environment	string	△	production / sandbox
正常レスポンス
{
  "success": true,
  "code": "LICENSE_ACTIVE",
  "message": "ライセンス認証に成功しました。",
  "data": {
    "licenseId": "lic_001",
    "licenseStatus": "active",
    "contractStatus": "active",
    "pluginId": "plugin_001",
    "pluginName": "サンプルプラグイン",
    "expireDate": "2026-12-31",
    "registeredDomain": "sample.cybozu.com",
    "maxDomains": 1,
    "currentDomains": 1
  }
}
エラー
コード	HTTP	内容
INVALID_LICENSE_KEY	401	ライセンスキー不正
LICENSE_EXPIRED	403	有効期限切れ
LICENSE_SUSPENDED	403	利用停止中
DOMAIN_LIMIT_EXCEEDED	403	登録可能ドメイン数超過
PLUGIN_NOT_ALLOWED	403	対象プラグインではない
CONTRACT_NOT_FOUND	404	契約情報なし
主な処理
1.	APIキー確認
2.	ライセンスキー存在確認
3.	契約状態確認
4.	有効期限確認
5.	対象プラグイン確認
6.	kintoneドメイン登録または照合
7.	認証ログ登録
8.	認証結果返却
________________________________________
API-002 ライセンス状態確認API
目的
プラグイン起動時または定期実行時に、ライセンスが有効か確認する。
エンドポイント
GET /v1/licenses/status
クエリパラメータ
項目	型	必須	内容
licenseKey	string	〇	ライセンスキー
pluginId	string	〇	プラグインID
kintoneDomain	string	〇	kintoneドメイン
リクエスト例
GET /v1/licenses/status?licenseKey=LIC-XXXX-XXXX-XXXX&pluginId=plugin_001&kintoneDomain=sample.cybozu.com
正常レスポンス
{
  "success": true,
  "code": "LICENSE_ACTIVE",
  "message": "ライセンスは有効です。",
  "data": {
    "licenseStatus": "active",
    "expireDate": "2026-12-31",
    "daysRemaining": 120,
    "available": true
  }
}
エラー
コード	HTTP	内容
LICENSE_NOT_FOUND	404	ライセンスなし
LICENSE_EXPIRED	403	期限切れ
DOMAIN_MISMATCH	403	登録ドメイン不一致
PLUGIN_MISMATCH	403	プラグイン不一致
________________________________________
API-003 ライセンス解除API
目的
プラグイン利用停止時に、登録済みkintoneドメインを解除する。
エンドポイント
POST /v1/licenses/deactivate
リクエスト
{
  "licenseKey": "LIC-XXXX-XXXX-XXXX",
  "pluginId": "plugin_001",
  "kintoneDomain": "sample.cybozu.com",
  "reason": "user_deactivated"
}
正常レスポンス
{
  "success": true,
  "code": "LICENSE_DEACTIVATED",
  "message": "ライセンス登録を解除しました。",
  "data": {
    "licenseStatus": "inactive",
    "deactivatedAt": "2026-01-15T10:00:00+09:00"
  }
}
________________________________________
API-004 プラグイン更新確認API
目的
現在利用中のプラグインバージョンと最新バージョンを比較し、更新要否を返却する。
エンドポイント
GET /v1/plugins/version
クエリパラメータ
項目	型	必須	内容
pluginId	string	〇	プラグインID
currentVersion	string	〇	現在のバージョン
正常レスポンス
{
  "success": true,
  "code": "VERSION_CHECKED",
  "message": "バージョン確認が完了しました。",
  "data": {
    "pluginId": "plugin_001",
    "currentVersion": "1.0.0",
    "latestVersion": "1.2.0",
    "updateRequired": true,
    "forceUpdate": false,
    "releaseNote": "軽微な不具合を修正しました。",
    "releasedAt": "2026-01-10"
  }
}
________________________________________
API-005 プラグイン一覧取得API
目的
WordPress会員サイト上で、利用可能なプラグイン一覧を表示する。
エンドポイント
GET /v1/plugins
クエリパラメータ
項目	型	必須	内容
memberId	string	〇	会員ID
正常レスポンス
{
  "success": true,
  "code": "PLUGIN_LIST_FOUND",
  "message": "プラグイン一覧を取得しました。",
  "data": [
    {
      "pluginId": "plugin_001",
      "pluginName": "サンプルプラグイン",
      "latestVersion": "1.2.0",
      "licenseStatus": "active",
      "downloadAvailable": true
    }
  ]
}
________________________________________
API-006 プラグインダウンロードURL発行API
目的
認証済み利用者に対して、一時的に利用可能なプラグインZIPダウンロードURLを発行する。
エンドポイント
POST /v1/plugins/download-token
リクエスト
{
  "memberId": "mem_001",
  "pluginId": "plugin_001",
  "licenseKey": "LIC-XXXX-XXXX-XXXX"
}
正常レスポンス
{
  "success": true,
  "code": "DOWNLOAD_TOKEN_CREATED",
  "message": "ダウンロードURLを発行しました。",
  "data": {
    "downloadUrl": "https://api.example.com/v1/plugins/download?token=xxxxx",
    "expiresIn": 300
  }
}
補足
•	ダウンロードURLは5分で失効
•	1トークン1回のみ利用可能
•	ダウンロード履歴を保存する
________________________________________
API-007 認証ログ登録API
目的
認証処理、状態確認、エラー発生時のログを保存する。
エンドポイント
POST /v1/auth-logs
リクエスト
{
  "licenseKey": "LIC-XXXX-XXXX-XXXX",
  "pluginId": "plugin_001",
  "kintoneDomain": "sample.cybozu.com",
  "eventType": "authenticate",
  "result": "success",
  "message": "ライセンス認証成功",
  "ipAddress": "203.0.113.10",
  "userAgent": "Mozilla/5.0"
}
正常レスポンス
{
  "success": true,
  "code": "LOG_CREATED",
  "message": "ログを登録しました。",
  "data": {
    "logId": "log_001"
  }
}
________________________________________
API-008 契約情報取得API
目的
WordPress会員サイトで契約状態、利用可能プラグイン、有効期限を表示する。
エンドポイント
GET /v1/contracts/status
クエリパラメータ
項目	型	必須	内容
memberId	string	〇	会員ID
正常レスポンス
{
  "success": true,
  "code": "CONTRACT_FOUND",
  "message": "契約情報を取得しました。",
  "data": {
    "memberId": "mem_001",
    "contractStatus": "active",
    "planName": "Standard",
    "contractStartDate": "2026-01-01",
    "contractEndDate": "2026-12-31",
    "licenses": [
      {
        "licenseKey": "LIC-XXXX-XXXX-XXXX",
        "pluginId": "plugin_001",
        "pluginName": "サンプルプラグイン",
        "status": "active",
        "expireDate": "2026-12-31"
      }
    ]
  }
}
________________________________________
API-009 ヘルスチェックAPI
目的
監視システムからAPIサーバーの稼働状態を確認する。
エンドポイント
GET /v1/health
正常レスポンス
{
  "success": true,
  "code": "HEALTHY",
  "message": "API is running.",
  "data": {
    "status": "ok",
    "timestamp": "2026-01-15T10:00:00+09:00"
  }
}
________________________________________
5. エラーコード一覧
コード	内容
OK	正常
INVALID_REQUEST	リクエスト不正
INVALID_API_KEY	APIキー不正
LICENSE_NOT_FOUND	ライセンスなし
INVALID_LICENSE_KEY	ライセンスキー不正
LICENSE_EXPIRED	ライセンス期限切れ
LICENSE_SUSPENDED	ライセンス停止中
DOMAIN_MISMATCH	登録ドメイン不一致
DOMAIN_LIMIT_EXCEEDED	登録可能ドメイン数超過
PLUGIN_NOT_FOUND	プラグインなし
PLUGIN_MISMATCH	プラグイン不一致
PLUGIN_NOT_ALLOWED	利用対象外プラグイン
CONTRACT_NOT_FOUND	契約なし
CONTRACT_EXPIRED	契約期限切れ
RATE_LIMIT_EXCEEDED	アクセス制限超過
INTERNAL_SERVER_ERROR	サーバー内部エラー
________________________________________
6. 認証・認可設計
6.1 APIキー認証
各リクエストには X-API-Key を付与する。
X-API-Key: xxxxxxxx
6.2 ライセンス認証
ライセンスキー、プラグインID、kintoneドメインの組み合わせで認証する。
6.3 ドメイン制御
1ライセンスに対して登録可能なkintoneドメイン数を制御する。
例：
プラン	登録可能ドメイン数
Basic	1
Standard	3
Enterprise	無制限
________________________________________
7. ログ設計
7.1 認証ログ
項目	内容
ログID	一意ID
日時	発生日時
ライセンスキー	対象ライセンス
プラグインID	対象プラグイン
kintoneドメイン	利用ドメイン
イベント種別	authenticate / status / deactivate / error
結果	success / failure
IPアドレス	接続元
User-Agent	利用環境
メッセージ	詳細内容
7.2 保存期間
ログ種別	保存期間
認証ログ	1年
APIアクセスログ	1年
エラーログ	2年
________________________________________
8. レート制限
対象	制限
ライセンス認証API	1分あたり30回 / IP
状態確認API	1分あたり60回 / ライセンス
更新確認API	1時間あたり60回 / ライセンス
ダウンロードURL発行API	1時間あたり10回 / 会員
________________________________________
9. セキュリティ要件
項目	内容
通信暗号化	HTTPS必須
APIキー	サーバー側で管理
ライセンスキー	平文保存禁止、ハッシュ化推奨
ログ	個人情報を最小限にする
ダウンロードURL	短時間・一回限り
CORS	許可ドメインのみ
SQLインジェクション対策	プレースホルダ利用
XSS対策	レスポンス値のエスケープ
________________________________________
10. kintoneプラグイン側の呼び出しタイミング
タイミング	API
初回設定保存時	ライセンス認証API
プラグイン起動時	ライセンス状態確認API
1日1回	ライセンス状態確認API
設定画面表示時	プラグイン更新確認API
利用停止時	ライセンス解除API
________________________________________
11. 備考
本設計書は、構成図をもとに作成したAPI詳細設計ドラフトである。
実装時には、以下を確定する必要がある。
•	正式なドメイン名
•	APIサーバー構成
•	WordPress会員IDとの連携方式
•	kintone管理アプリのフィールドコード
•	ライセンスキー生成方式
•	ダウンロードファイル保存先
•	課金システムとの連携有無

