# pluginadaptix_packages

## 概要

kintoneプラグインのZIP生成、検査、難読化、署名などのパッケージング処理を独立管理するためのリポジトリです。現時点で移管済みの実装は、認証用kintoneプラグインの通常版ZIP生成CLIです。

## 管理対象

- プラグインZIP生成CLI
- パッケージ構成・出力名・manifest検査
- 将来追加する難読化、署名、一括パッケージ処理

## 主な機能

- 認証用kintoneプラグインの必要ファイルをZIPへ格納
- 入力ソースと出力ZIPをCLI引数で指定
- 秘密鍵をZIPエントリへ含めない固定構成

## ディレクトリ構成

```text
scripts/   パッケージ生成CLI
```

## 開発環境

- Node.js 18以降
- 外部npm依存なし

## セットアップ方法

```bash
npm install
```

外部依存がないため、通常はインストールなしでも実行できます。

## 実行方法

先に対象プラグインをビルドし、ソースディレクトリと出力ZIPを指定します。

```bash
node scripts/build-authentication-plugin-zip.mjs \
  ../pluginadaptix_plugin-authentication/apps/kintone-plugin \
  dist/authentication-plugin.zip
```

## テスト方法

```bash
npm test
```

実ファイルを使う検証では、生成後に `unzip -t` と `unzip -l` で整合性と内容を確認します。

## 注意事項

- 秘密鍵、`.env`、`node_modules`、テスト結果をZIPへ含めません。
- 元ソースを正とし、生成ZIPを直接修正しません。
- 現時点では汎用難読化・署名・評価版生成の既存実装は見つかっていません。

## 関連リポジトリ

- `pluginadaptix_plugins`
- `pluginadaptix_plugin-authentication`
