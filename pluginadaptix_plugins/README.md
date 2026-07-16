# pluginadaptix_plugins

## 概要

各kintoneプラグイン本体と、仕様、マニュアル、テスト、不具合修正、引継ぎ資料を管理します。

## 管理対象

- 29個のkintoneプラグインの元ソース
- 難読化済み生成物と署名済み構成
- プラグイン別仕様書・Manual・BUG・テスト資料
- 共通バグ管理CSVと調査報告

## 主な機能

- kintoneデスクトップ・モバイル・設定画面処理
- プラグイン側ライセンス認証要求（`certification.js`）
- プラグイン別の仕様整理、動作確認、不具合管理

## ディレクトリ構成

```text
plugins/          プラグイン別ソース・生成物・ドキュメント
bug-management/  共通バグ一覧・調査資料
```

既存のプラグイン内参照を維持するため、各プラグインの内部構成は変更していません。

## 開発環境

- Node.js（構文確認・補助スクリプト）
- kintone Plugin
- Playwright（画面検証が必要な場合）

## セットアップ方法

対象プラグインの `specification.md` と `codex/work-instructions.md` を最初に確認してください。プラグインごとに必要な外部ライブラリは既存構成内に保持されています。

## 実行方法

対象プラグインの `manifest.json` を基準に、元ソースをkintoneプラグインとして検証します。ZIP生成は関連リポジトリ `pluginadaptix_packages` の責務です。

## テスト方法

```bash
node --check plugins/<プラグイン名>/<元ソース>/contents/js/desktop.js
```

加えて対象プラグインの `TEST_SPEC.md` と `codex/test-plan.md` に従います。

## 注意事項

- `<プラグイン名>e` の難読化済み生成物は直接修正しません。
- `PUBKEY` と `SIGNATURE` はプラグイン構成の一部ですが、秘密鍵はこの管理単位へ含めません。
- 実値を含む `.env`、APIキー、Cookie、認証トークンを保存しません。

## 関連リポジトリ

- `pluginadaptix_packages`
- `pluginadaptix_plugin-authentication`
