# pluginadaptix 分割作業ワークスペース

この親フォルダは、既存の `pluginadaptix` を独立管理可能な3単位へ整理した作業ワークスペースです。各フォルダをGitリポジトリとして初期化する作業は別工程です。

- `pluginadaptix_packages`: プラグインZIP生成・パッケージング
- `pluginadaptix_plugins`: 各kintoneプラグイン本体・仕様・テスト・バグ管理
- `pluginadaptix_plugin-authentication`: ライセンス認証API・認証クライアント・設計書
- `_repository_split_pending`: 新しい管理対象へ含めない保留・隔離ファイル

分類根拠は `REPOSITORY_SPLIT_PLAN.md`、作業結果は `REPOSITORY_SPLIT_REPORT.md`、保留理由は `REPOSITORY_SPLIT_PENDING.md` を参照してください。

TAB表示プラグインの隔離済み秘密鍵に関する監査結果と対応順序は `SECURITY_KEY_REMEDIATION.md` を参照してください。
