# AGENTS.md

このリポジトリで Codex / AI エージェントが作業する際の開発運用ルールです。

## プロジェクト概要

このリポジトリは、kintone プラグインのライセンス認証、契約状態確認、プラグイン配布、WordPress 連携、kintone 管理アプリ連携を扱います。

主な構成は以下です。

- `apps/api-server`: Node.js / TypeScript / Express による API サーバー
- `apps/kintone-plugin`: kintone プラグイン
- `apps/wordpress-integration`: WordPress 連携
- `packages/shared`: 共有型・定数
- `packages/kintone-client`: kintone REST API クライアント
- `docs`: 設計書・運用文書

## 作業対象の原則

- 仕様や設計に迷う場合は、先に `docs/` 配下の設計書を確認する。
- API 仕様は `docs/openapi.yaml` を優先する。
- テーブル定義は `docs/05_table_definition.md` を優先する。
- 重要な設計判断は `docs/decisions/` に記録する。
- 次回作業や未完了事項は `docs/codex/next-tasks.md` に記録する。
- 障害対応や調査結果は `docs/codex/troubleshooting.md` に記録する。
- 作業終了時は `docs/codex/handover-YYYY-MM-DD.md` を作成または更新する。

## 実装方針

- REST API / Node.js / Playwright を優先して利用する。
- kintone や外部サービスとの連携は、可能な限り REST API と Node.js スクリプトで実施する。
- UI の自動確認やブラウザ操作が必要な場合は Playwright を優先する。
- Computer Use は最終確認、視覚確認、または Playwright だけでは確認できないブラウザ上の状態確認が必要な場合に限って使用する。
- 既存の構成、命名、責務分離に合わせる。
- 不要なリファクタリングやスコープ外の修正を行わない。
- アプリケーションコード、API 実装、テストコードを変更する場合は、依頼範囲に含まれることを確認する。

## セキュリティと環境変数

- `.env` は作成しない。
- 環境変数の例は `.env.example` のみで管理する。
- 秘密情報、API キー、トークン、ライセンスキー、Cookie、秘密鍵をリポジトリに追加しない。
- ログやドキュメントに秘密情報を平文で記録しない。
- `.env.example` には実値ではなく空値またはダミー値のみを書く。

## ドキュメント運用

### `docs/codex/`

Codex 作業の運用記録を置きます。

- `docs/codex/next-tasks.md`: 次回作業、未完了事項、確認待ち事項
- `docs/codex/troubleshooting.md`: 障害、原因、対応、再発防止
- `docs/codex/handover-template.md`: 引き継ぎテンプレート
- `docs/codex/handover-YYYY-MM-DD.md`: 作業日の引き継ぎ記録

### `docs/decisions/`

重要な設計判断を記録します。

記録対象の例:

- API 仕様やエンドポイント構成の判断
- データモデルや kintone アプリ定義の判断
- 認証、認可、ライセンス検証方式の判断
- 外部サービス連携方式の判断
- 大きな技術選定や運用方針の変更

判断を記録する際は、背景、選択肢、決定内容、影響範囲、日付を明記します。

## TypeScript / API ルール

- TypeScript は strict 前提で実装する。
- `any` は原則使用しない。
- 共通型や共通定数は `packages/shared` に配置する。
- Controller はリクエスト受け取り、バリデーション、レスポンス返却に集中する。
- Service は業務ロジックを担当する。
- Repository は kintone など外部データアクセスを担当する。
- Controller に業務ロジックを書かない。
- Repository に業務ロジックを書かない。

## 検証

実装変更を行った場合は、影響範囲に応じて以下を実行します。

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

ドキュメントのみの変更では、必要に応じてファイル存在、リンク、記載内容を確認します。

## Git 運用

- ブランチ名は `feature/<issue>-<summary>`、`fix/<issue>-<summary>`、`docs/<issue>-<summary>`、`chore/<issue>-<summary>` を基本とする。
- コミットメッセージは Conventional Commits を基本とする。
- PR には概要、対応 Issue、変更内容、検証結果、影響範囲を記載する。

## Definition of Done

- 依頼範囲の変更が完了している。
- スコープ外のアプリケーションコード、API 実装、テストコードを変更していない。
- 必要なドキュメントが更新されている。
- `.env` を作成していない。
- 秘密情報を追加していない。
- 作業終了時の引き継ぎが `docs/codex/handover-YYYY-MM-DD.md` に記録されている。
