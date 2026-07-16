テーブル定義書
kintoneプラグイン認証システム
________________________________________
1. テーブル一覧
No	テーブル名	kintoneアプリ名	用途
TBL-001	customers	顧客管理	契約者・会員情報を管理する
TBL-002	contracts	契約管理	顧客ごとの契約情報を管理する
TBL-003	licenses	ライセンス管理	プラグイン利用ライセンスを管理する
TBL-004	plugins	プラグイン管理	配布対象プラグイン情報を管理する
TBL-005	plugin_versions	プラグインバージョン管理	プラグインの各バージョンを管理する
TBL-006	registered_domains	登録ドメイン管理	ライセンスに紐づくkintoneドメインを管理する
TBL-007	auth_logs	認証ログ管理	認証・状態確認・エラー履歴を管理する
TBL-008	download_logs	ダウンロードログ管理	プラグインZIPのDL履歴を管理する
TBL-009	api_settings	API設定管理	APIサーバー用設定値を管理する
________________________________________
TBL-001 customers
概要
顧客・会員情報を管理する。
主キー
項目	内容
PK	customer_id
カラム定義
No	カラム名	kintoneフィールドコード	型	必須	制約・備考
1	customer_id	customer_id	文字列	〇	顧客ID。例：CUS-000001
2	company_name	company_name	文字列	〇	会社名
3	company_kana	company_kana	文字列		会社名カナ
4	contact_name	contact_name	文字列	〇	担当者名
5	contact_email	contact_email	メール	〇	ログインIDとして利用可
6	phone_number	phone_number	文字列		電話番号
7	postal_code	postal_code	文字列		郵便番号
8	address	address	複数行文字列		住所
9	customer_status	customer_status	ドロップダウン	〇	仮登録 / 有効 / 停止 / 解約
10	wordpress_user_id	wordpress_user_id	文字列		WordPress側ユーザーID
11	registered_date	registered_date	日付	〇	登録日
12	remarks	remarks	複数行文字列		備考
13	created_at	created_at	日時	〇	作成日時
14	updated_at	updated_at	日時	〇	更新日時
________________________________________
TBL-002 contracts
概要
顧客ごとの契約情報を管理する。
主キー・外部キー
項目	内容
PK	contract_id
FK	customer_id → customers.customer_id
カラム定義
No	カラム名	kintoneフィールドコード	型	必須	制約・備考
1	contract_id	contract_id	文字列	〇	契約ID。例：CON-000001
2	customer_id	customer_id	ルックアップ	〇	顧客ID
3	company_name	company_name	文字列	〇	顧客管理から取得
4	plan_type	plan_type	ドロップダウン	〇	Basic / Standard / Enterprise
5	contract_status	contract_status	ドロップダウン	〇	有効 / 停止 / 解約 / 期限切れ
6	contract_start	contract_start	日付	〇	契約開始日
7	contract_end	contract_end	日付	〇	契約終了日
8	billing_cycle	billing_cycle	ドロップダウン		月額 / 年額 / 無償
9	contract_amount	contract_amount	数値		契約金額
10	max_domain_count	max_domain_count	数値	〇	登録可能ドメイン数
11	max_plugin_count	max_plugin_count	数値		利用可能プラグイン数
12	auto_renewal_flag	auto_renewal_flag	ラジオボタン		自動更新：有 / 無
13	remarks	remarks	複数行文字列		備考
14	created_at	created_at	日時	〇	作成日時
15	updated_at	updated_at	日時	〇	更新日時
________________________________________
TBL-003 licenses
概要
プラグイン利用ライセンスを管理する。
主キー・外部キー
項目	内容
PK	license_id
FK	customer_id → customers.customer_id
FK	contract_id → contracts.contract_id
FK	plugin_id → plugins.plugin_id
カラム定義
No	カラム名	kintoneフィールドコード	型	必須	制約・備考
1	license_id	license_id	文字列	〇	ライセンスID。例：LIC-000001
2	license_key	license_key	文字列	〇	ライセンスキー。重複不可
3	license_key_hash	license_key_hash	文字列	〇	API認証用ハッシュ値
4	customer_id	customer_id	ルックアップ	〇	顧客ID
5	contract_id	contract_id	ルックアップ	〇	契約ID
6	plugin_id	plugin_id	ルックアップ	〇	対象プラグイン
7	license_status	license_status	ドロップダウン	〇	未使用 / 有効 / 停止 / 期限切れ / 失効
8	issue_date	issue_date	日付	〇	発行日
9	expire_date	expire_date	日付	〇	有効期限
10	max_domain_count	max_domain_count	数値	〇	登録可能ドメイン数
11	current_domain_count	current_domain_count	数値	〇	現在登録中ドメイン数
12	last_auth_datetime	last_auth_datetime	日時		最終認証日時
13	last_auth_result	last_auth_result	文字列		最終認証結果
14	memo	memo	複数行文字列		管理メモ
15	created_at	created_at	日時	〇	作成日時
16	updated_at	updated_at	日時	〇	更新日時
________________________________________
TBL-004 plugins
概要
配布対象プラグインの基本情報を管理する。
主キー
項目	内容
PK	plugin_id
カラム定義
No	カラム名	kintoneフィールドコード	型	必須	制約・備考
1	plugin_id	plugin_id	文字列	〇	プラグインID。例：PLG-000001
2	plugin_code	plugin_code	文字列	〇	API識別用コード
3	plugin_name	plugin_name	文字列	〇	プラグイン名
4	plugin_description	plugin_description	複数行文字列		説明
5	plugin_category	plugin_category	ドロップダウン		カテゴリ
6	publish_status	publish_status	ドロップダウン	〇	開発中 / テスト / 公開 / 非公開 / 廃止
7	latest_version	latest_version	文字列	〇	最新バージョン
8	force_update_version	force_update_version	文字列		強制更新対象バージョン
9	support_url	support_url	リンク		サポートURL
10	manual_url	manual_url	リンク		マニュアルURL
11	created_at	created_at	日時	〇	作成日時
12	updated_at	updated_at	日時	〇	更新日時
________________________________________
TBL-005 plugin_versions
概要
プラグインのバージョン別ファイル・リリース情報を管理する。
主キー・外部キー
項目	内容
PK	version_id
FK	plugin_id → plugins.plugin_id
カラム定義
No	カラム名	kintoneフィールドコード	型	必須	制約・備考
1	version_id	version_id	文字列	〇	バージョンID。例：VER-000001
2	plugin_id	plugin_id	ルックアップ	〇	プラグインID
3	version	version	文字列	〇	例：1.0.0
4	release_status	release_status	ドロップダウン	〇	下書き / 公開 / 非公開
5	release_date	release_date	日付		リリース日
6	plugin_zip	plugin_zip	添付ファイル	〇	配布ZIP
7	file_name	file_name	文字列		ファイル名
8	file_size	file_size	数値		ファイルサイズ
9	checksum	checksum	文字列		改ざん検知用ハッシュ
10	release_note	release_note	複数行文字列		リリースノート
11	is_latest	is_latest	ラジオボタン	〇	はい / いいえ
12	is_force_update	is_force_update	ラジオボタン		はい / いいえ
13	created_at	created_at	日時	〇	作成日時
14	updated_at	updated_at	日時	〇	更新日時
________________________________________
TBL-006 registered_domains
概要
ライセンスに紐づくkintoneドメインを管理する。
主キー・外部キー
項目	内容
PK	domain_id
FK	license_id → licenses.license_id
カラム定義
No	カラム名	kintoneフィールドコード	型	必須	制約・備考
1	domain_id	domain_id	文字列	〇	ドメインID。例：DOM-000001
2	license_id	license_id	ルックアップ	〇	ライセンスID
3	license_key	license_key	文字列	〇	ライセンスキー
4	kintone_domain	kintone_domain	文字列	〇	例：sample.cybozu.com
5	app_id	app_id	文字列		kintoneアプリID
6	environment	environment	ドロップダウン		production / sandbox
7	domain_status	domain_status	ドロップダウン	〇	有効 / 停止 / 解除
8	registered_at	registered_at	日時	〇	登録日時
9	last_access_at	last_access_at	日時		最終アクセス日時
10	deactivated_at	deactivated_at	日時		解除日時
11	remarks	remarks	複数行文字列		備考
________________________________________
TBL-007 auth_logs
概要
認証APIの実行履歴を保存する。
主キー・外部キー
項目	内容
PK	log_id
FK	license_id → licenses.license_id
FK	plugin_id → plugins.plugin_id
カラム定義
No	カラム名	kintoneフィールドコード	型	必須	制約・備考
1	log_id	log_id	文字列	〇	ログID。例：LOG-000001
2	auth_datetime	auth_datetime	日時	〇	認証日時
3	event_type	event_type	ドロップダウン	〇	authenticate / status / deactivate / download / error
4	result_status	result_status	ドロップダウン	〇	success / failure / warning
5	license_id	license_id	文字列		ライセンスID
6	license_key	license_key	文字列		ライセンスキー
7	plugin_id	plugin_id	文字列		プラグインID
8	plugin_version	plugin_version	文字列		実行時バージョン
9	kintone_domain	kintone_domain	文字列		利用ドメイン
10	app_id	app_id	文字列		kintoneアプリID
11	ip_address	ip_address	文字列		接続元IP
12	user_agent	user_agent	複数行文字列		User-Agent
13	error_code	error_code	文字列		エラーコード
14	message	message	複数行文字列		詳細メッセージ
15	created_at	created_at	日時	〇	作成日時
________________________________________
TBL-008 download_logs
概要
プラグインファイルのダウンロード履歴を保存する。
主キー・外部キー
項目	内容
PK	download_log_id
FK	customer_id → customers.customer_id
FK	plugin_id → plugins.plugin_id
FK	version_id → plugin_versions.version_id
カラム定義
No	カラム名	kintoneフィールドコード	型	必須	制約・備考
1	download_log_id	download_log_id	文字列	〇	DLログID。例：DL-000001
2	download_datetime	download_datetime	日時	〇	ダウンロード日時
3	customer_id	customer_id	文字列	〇	顧客ID
4	plugin_id	plugin_id	文字列	〇	プラグインID
5	version_id	version_id	文字列	〇	バージョンID
6	version	version	文字列	〇	ダウンロードバージョン
7	download_token	download_token	文字列		一時トークン
8	token_expire_at	token_expire_at	日時		トークン失効日時
9	download_result	download_result	ドロップダウン	〇	success / failure
10	ip_address	ip_address	文字列		接続元IP
11	user_agent	user_agent	複数行文字列		User-Agent
12	message	message	複数行文字列		詳細
________________________________________
TBL-009 api_settings
概要
APIサーバーで使用するシステム設定値を管理する。
主キー
項目	内容
PK	setting_key
カラム定義
No	カラム名	kintoneフィールドコード	型	必須	制約・備考
1	setting_key	setting_key	文字列	〇	設定キー。重複不可
2	setting_name	setting_name	文字列	〇	設定名
3	setting_value	setting_value	複数行文字列	〇	設定値
4	setting_type	setting_type	ドロップダウン		string / number / boolean / json
5	enabled_flag	enabled_flag	ラジオボタン	〇	有効 / 無効
6	description	description	複数行文字列		説明
7	updated_at	updated_at	日時	〇	更新日時
________________________________________
2. リレーション定義
No	親テーブル	子テーブル	関連キー	関係
1	customers	contracts	customer_id	1:N
2	customers	licenses	customer_id	1:N
3	contracts	licenses	contract_id	1:N
4	plugins	licenses	plugin_id	1:N
5	plugins	plugin_versions	plugin_id	1:N
6	licenses	registered_domains	license_id	1:N
7	licenses	auth_logs	license_id	1:N
8	plugins	auth_logs	plugin_id	1:N
9	customers	download_logs	customer_id	1:N
10	plugins	download_logs	plugin_id	1:N
11	plugin_versions	download_logs	version_id	1:N
________________________________________
3. コード値定義
3.1 customer_status
値	意味
仮登録	登録直後・未契約
有効	利用可能
停止	一時停止
解約	契約終了
3.2 contract_status
値	意味
有効	契約中
停止	一時停止
解約	解約済み
期限切れ	契約期限超過
3.3 license_status
値	意味
未使用	発行済み・未認証
有効	利用可能
停止	管理者により停止
期限切れ	有効期限切れ
失効	無効化済み
3.4 publish_status
値	意味
開発中	開発中
テスト	検証中
公開	利用者へ公開中
非公開	一時非公開
廃止	提供終了
3.5 event_type
値	意味
authenticate	初回認証
status	状態確認
deactivate	利用解除
download	ダウンロード
error	エラー
________________________________________
4. インデックス・検索キー設計
kintoneでは物理インデックスは直接定義しないが、API検索・一覧検索で頻繁に利用する項目を検索キーとして設計する。
テーブル	検索キー
customers	customer_id, company_name, contact_email, wordpress_user_id
contracts	contract_id, customer_id, contract_status, contract_end
licenses	license_id, license_key, customer_id, plugin_id, license_status, expire_date
plugins	plugin_id, plugin_code, publish_status
plugin_versions	plugin_id, version, release_status, is_latest
registered_domains	license_id, kintone_domain, domain_status
auth_logs	auth_datetime, license_key, plugin_id, kintone_domain, result_status
download_logs	download_datetime, customer_id, plugin_id, version
api_settings	setting_key, enabled_flag
________________________________________
5. データ保持期間
テーブル	保持期間
customers	契約終了後5年
contracts	契約終了後5年
licenses	契約終了後5年
plugins	提供終了後3年
plugin_versions	提供終了後3年
registered_domains	契約終了後5年
auth_logs	1年
download_logs	1年
api_settings	無期限
________________________________________
6. 備考
本テーブル定義書は、kintoneを管理DBとして利用する前提で作成する。
APIサーバー側でRDBを併用する場合も、本定義を論理テーブル定義として利用できる。
実装時には以下を確定する。
•	実際のkintoneアプリID
•	各フィールドコード
•	ルックアップ元アプリ
•	自動採番方式
•	ライセンスキー生成方式
•	添付ファイル保存方式
•	APIトークン権限

