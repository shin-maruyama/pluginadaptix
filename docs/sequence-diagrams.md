シーケンス図
kintoneプラグイン認証システム
________________________________________
SQ-001 初回ライセンス認証
概要
kintoneプラグイン設定画面でライセンスキーを登録する際の認証フロー
sequenceDiagram

    actor User as 利用者
    participant Plugin as kintone Plugin
    participant API as License API Server
    participant Kintone as kintone Apps

    User->>Plugin: ライセンスキー入力

    Plugin->>API: POST /licenses/authenticate

    API->>Kintone: ライセンス検索

    Kintone-->>API: ライセンス情報

    API->>Kintone: 契約状態取得

    Kintone-->>API: 契約情報

    API->>Kintone: 登録ドメイン確認

    Kintone-->>API: 登録状況

    alt 有効ライセンス
        API->>Kintone: ドメイン登録
        API->>Kintone: 認証ログ登録

        API-->>Plugin: success
        Plugin-->>User: 認証成功
    else 無効ライセンス
        API->>Kintone: 認証失敗ログ登録
        API-->>Plugin: error
        Plugin-->>User: 認証失敗
    end
________________________________________
SQ-002 起動時ライセンス確認
概要
プラグイン起動時にライセンス有効性を確認する。
sequenceDiagram

    participant Plugin as kintone Plugin
    participant API as License API Server
    participant Kintone as kintone Apps

    Plugin->>API: GET /licenses/status

    API->>Kintone: ライセンス取得

    Kintone-->>API: ライセンス情報

    API->>Kintone: ドメイン照合

    Kintone-->>API: ドメイン情報

    API->>Kintone: 契約状態確認

    Kintone-->>API: 契約情報

    alt 利用可能
        API->>Kintone: 最終認証日時更新
        API->>Kintone: 認証ログ登録

        API-->>Plugin: available=true
        Plugin-->>Plugin: 通常動作
    else 利用不可
        API->>Kintone: エラーログ登録

        API-->>Plugin: available=false
        Plugin-->>Plugin: 機能停止
    end
________________________________________
SQ-003 プラグインダウンロード
概要
WordPress会員サイトからプラグインZIPを取得する。
sequenceDiagram

    actor User as 利用者
    participant WP as WordPress
    participant API as License API Server
    participant Kintone as kintone Apps
    participant Storage as File Storage

    User->>WP: ダウンロードボタン押下

    WP->>API: POST /plugins/download-token

    API->>Kintone: 契約確認

    Kintone-->>API: 契約情報

    API->>Kintone: ライセンス確認

    Kintone-->>API: ライセンス情報

    alt 契約有効
        API->>Kintone: ダウンロードログ登録
        API-->>WP: Download Token

        WP->>Storage: ZIP取得

        Storage-->>WP: ZIP
        WP-->>User: ダウンロード開始
    else 契約無効
        API-->>WP: エラー
        WP-->>User: ダウンロード不可
    end
________________________________________
SQ-004 プラグイン更新確認
概要
プラグイン設定画面表示時に最新版確認を行う。
sequenceDiagram

    participant Plugin as kintone Plugin
    participant API as License API Server
    participant Kintone as kintone Apps

    Plugin->>API: GET /plugins/version

    API->>Kintone: 最新Version取得

    Kintone-->>API: latestVersion

    alt 更新あり
        API-->>Plugin: updateRequired=true
        Plugin-->>Plugin: 更新通知表示
    else 最新版
        API-->>Plugin: updateRequired=false
    end
________________________________________
SQ-005 ライセンス解除
概要
利用停止または環境移行時の解除処理
sequenceDiagram

    actor User as 利用者
    participant Plugin as kintone Plugin
    participant API as License API Server
    participant Kintone as kintone Apps

    User->>Plugin: ライセンス解除

    Plugin->>API: POST /licenses/deactivate

    API->>Kintone: 登録ドメイン検索

    Kintone-->>API: ドメイン情報

    API->>Kintone: domain_status=解除

    API->>Kintone: current_domain_count更新

    API->>Kintone: 認証ログ登録

    API-->>Plugin: success

    Plugin-->>User: 解除完了
________________________________________
SQ-006 管理者によるライセンス発行
概要
kintone管理画面からライセンスを発行する。
sequenceDiagram

    actor Admin as 管理者
    participant Kintone as kintone Apps
    participant API as License Service

    Admin->>Kintone: ライセンス発行

    Kintone->>API: ライセンスキー生成要求

    API-->>Kintone: ライセンスキー

    Kintone->>Kintone: ライセンスレコード作成

    Kintone-->>Admin: 発行完了
________________________________________
SQ-007 日次ライセンス監査バッチ
概要
毎日実行される契約・ライセンス監査処理
sequenceDiagram

    participant Batch as Scheduler
    participant API as License API Server
    participant Kintone as kintone Apps

    Batch->>API: Daily Audit

    API->>Kintone: 期限切れ契約検索

    Kintone-->>API: 契約一覧

    loop 契約毎
        API->>Kintone: status=期限切れ
    end

    API->>Kintone: 監査ログ登録

    API-->>Batch: 完了
________________________________________
実装優先度
優先度	シーケンス	Issue
★★★★★	SQ-001 初回認証	#6
★★★★★	SQ-002 起動時認証	#7
★★★★★	SQ-003 ダウンロード	#11
★★★★☆	SQ-004 更新確認	#9
★★★★☆	SQ-005 ライセンス解除	#8
★★☆☆☆	SQ-006 ライセンス発行	管理機能
★★☆☆☆	SQ-007 監査バッチ	運用機能
________________________________________
Codex実装開始条件
以下が揃えば実装を開始できる。
•	基本設計書
•	API詳細設計書
•	テーブル定義書
•	ER図
•	シーケンス図
•	OpenAPI仕様書
•	AGENTS.md
これらを docs/ 配下へ配置し、Issue #1（モノレポ構築）から着手する。

