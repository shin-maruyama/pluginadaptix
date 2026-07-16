# リポジトリ分割作業報告書

## 1. 作業概要

既存 `pluginadaptix` の全1,254ファイルを移動前に一覧化し、内容、配置、参照関係、実行時の責務を確認して、パッケージング、各kintoneプラグイン、認証システムの3管理単位へ整理した。移動前の詳細なファイル別分類は `REPOSITORY_SPLIT_PLAN.md` に記録した。

作業前は `master` ブランチ、ワークツリーcleanだった。追跡ファイル一覧を `/tmp/pluginadaptix-files-before.txt`、追跡外を含む全ファイル一覧を `/tmp/pluginadaptix-all-before.txt` に保存し、Git差分で移動を検証した。GitHubリポジトリ作成、リモート変更、push、履歴書き換えは実施していない。

## 2. 作成したフォルダ

- `pluginadaptix_packages/`
- `pluginadaptix_plugins/`
- `pluginadaptix_plugin-authentication/`
- `_repository_split_pending/`

各管理単位へ `README.md`、`.gitignore`、用途別 `AGENTS.md` を作成した。入れ子の `.git` は作成していない。

## 3. 移動したファイル一覧

| 分類先 | 移動数 | 主な移動元 | 主な移動先 |
|---|---:|---|---|
| packages | 1 | `apps/kintone-plugin/scripts/build-plugin-zip.mjs` | `pluginadaptix_packages/scripts/build-authentication-plugin-zip.mjs` |
| plugins | 1,145 | `plugins/`、`bug-management/` | `pluginadaptix_plugins/plugins/`、`pluginadaptix_plugins/bug-management/` |
| authentication | 74 | `apps/`、`packages/`、`docs/`、認証モノレポ設定・README・Issue | `pluginadaptix_plugin-authentication/` |
| pending | 32 | PEM RSA秘密鍵1件、`.DS_Store` 31件 | `_repository_split_pending/` |
| shared | 2 | `AGENTS.md`、`.gitignore` | 親ワークスペースに保持 |

1,254件すべての現在パス、分類理由、移動後パス、参照修正要否は `REPOSITORY_SPLIT_PLAN.md` のファイル別分類表を参照すること。

## 4. 分割したMarkdownファイル

- ルート `AGENTS.md` は原本を親ワークスペース規約として保持し、内容を用途別に要約した `AGENTS.md` を3管理単位へ作成した。各派生ファイルに分割元を記録した。
- 既存 `README.md` は認証システムの説明だったため認証管理へ移し、指定された共通項目を追加した。
- パッケージング、プラグイン、親ワークスペースのREADMEを新規作成した。
- 既存プラグイン別Markdownは、`plugins/` を各管理単位のルート直下に維持したため内容分割を行っていない。

## 5. 修正した参照パス

- ZIP生成スクリプトの入力元と出力先をCLI引数化し、認証管理フォルダへの固定相対パス依存を除去した。
- 認証用kintoneプラグインの `build` をTypeScriptコンパイルのみに変更し、ZIP生成をパッケージング管理の責務へ分離した。
- 親 `AGENTS.md` の設計書、認証ソース、プラグイン、バグ管理パスを分割後のパスへ更新した。
- 各READMEのセットアップ、実行、テスト、関連リポジトリ記述を分割後の構成へ更新した。
- プラグイン管理内は引き続き `plugins/...`、認証管理内は `apps/...`、`packages/...`、`docs/...` となる構成を維持したため、既存プラグイン文書、CSV、TypeScript import、workspace依存のパス変更は不要だった。

## 6. 新規作成したファイル

- `README.md`
- `REPOSITORY_SPLIT_PLAN.md`
- `REPOSITORY_SPLIT_PENDING.md`
- `REPOSITORY_SPLIT_REPORT.md`
- `pluginadaptix_packages/{README.md,AGENTS.md,.gitignore,package.json}`
- `pluginadaptix_plugins/{README.md,AGENTS.md,.gitignore}`
- `pluginadaptix_plugin-authentication/{AGENTS.md,.gitignore,.env.example}`

## 7. 削除したファイル

作業前から存在したファイルは削除していない。`.DS_Store` も削除せず保留領域へ隔離した。分類表生成にだけ使用した作業用スクリプトは報告書作成前に除去した。

## 8. 分類を保留したファイル

- `plugins/TAB表示/TabDisplay.ppk` はPEM RSA秘密鍵だったため、内容を表示・複製せず `_repository_split_pending/plugins/TAB表示/TabDisplay.ppk` へ隔離した。
- `.DS_Store` 31件は新しい管理単位へ含めず `_repository_split_pending/os-generated/` へ隔離した。
- 詳細は `REPOSITORY_SPLIT_PENDING.md` を参照すること。

## 9. 検証結果

### pluginadaptix_packages

- `npm test`: 成功。CLIヘルプと必須引数の案内を確認。
- 認証用kintoneプラグインを入力として `/tmp/pluginadaptix-authentication-plugin.zip` を生成: 成功。
- `unzip -t`: 成功。5エントリすべて破損なし。
- ZIP内容: `manifest.json`、`config.html`、認証クライアント・設定・desktopのビルド済みJSのみ。秘密鍵、`.env`、`node_modules` なし。
- 評価版、難読化、署名、一括処理: 対応する既存実装がなかったため未検証。

### pluginadaptix_plugins

- プラグインフォルダ数: 29。
- 既存プラグインmanifest数: 57。
- 認証用manifestを含む全58manifestのJSON読込とローカル参照先検査: 成功、参照切れ0件。
- プラグイン内の `plugins/...` 参照は、独立管理単位内でも同じ相対パスになることを確認。
- kintone実機・Playwright・最終視覚確認: コード変更ではなく配置変更のみのため未実施。

### pluginadaptix_plugin-authentication

- 共有パッケージとkintoneクライアントを先行ビルド後、4プロジェクトのTypeScript型検査: 成功。
- Vitest: 16ファイル、97テストすべて成功。Supertestのローカル待受がサンドボックスで拒否されたため、許可されたサンドボックス外実行で確認。
- APIサーバー、認証用kintoneプラグイン、shared、kintone-clientのビルド: 成功。
- 環境変数なしのAPIサーバー起動: 想定どおり起動せず `baseUrl is required.` を表示。
- `pnpm lint/typecheck/test/build` の一括実行: 実行環境の供給網ポリシーが `esbuild` のビルドスクリプトを未承認として停止したため、`pnpm install --ignore-scripts` 後にローカル `tsc` と `vitest` で同等項目を個別検証した。

### セキュリティ

- 新しい3管理単位を対象に実値用 `.env`、`.ppk`、`.pem`、`.key`、credentials名のファイルを検索: 該当なし。認証管理の `.env.example` は変数名と空値のみ。
- 新しい3管理単位を対象に秘密鍵ヘッダー、GitHub token形式、AWS access key形式を検索: 該当なし。
- `PUBKEY` と `SIGNATURE` は既存プラグイン構成として保持し、PEM秘密鍵だけを隔離した。

## 10. 発見した問題

1. `TabDisplay.ppk` が既存Git管理下に秘密鍵として含まれていた。今回の作業では新管理単位から隔離したが、過去Git履歴には残るため、所有者確認、失効・ローテーション、履歴からの除去を別工程で判断する必要がある。
2. `ラジオボタン表示フィールド切替` は元ソースのみで、他の28プラグインにある難読化版ディレクトリが存在しない。今回の整理作業では生成していない。
3. 認証APIの環境変数不足は明示的に停止するが、エラー名が `KINTONE_BASE_URL` ではなく `baseUrl` であり、運用者向けの不足変数表示としては曖昧である。
4. 設計上の `apps/wordpress-integration` は既存ファイルに存在しない。
5. 汎用の難読化、評価版生成、署名、一括パッケージ処理の既存ソースは確認できず、パッケージング管理へ移管できた実装は認証用通常版ZIP生成CLIのみだった。

秘密鍵の追加調査により、隔離した鍵から導出した公開鍵が `pluginadaptix_plugins/plugins/TAB表示/TabDisplaye/PUBKEY` と一致し、通常版 `TabDisplay/PUBKEY` とは一致しないことを確認した。鍵はRSA 1024-bitで、2026-06-10に追加され、2026-06-27に現在の日本語フォルダへ移動されている。追加・移動コミットは `origin/master` を含むリモート追跡ブランチに到達済みである。2026-07-16、`TabDisplaye` は顧客および本番環境へ未配布であることを確認し、秘密鍵を現在のGit indexから除去した。詳細は `SECURITY_KEY_REMEDIATION.md` を参照すること。

## 11. 未完了事項

- Git全履歴・リモートからの秘密鍵除去。
- 独立Gitリポジトリの初期化、リモート作成、push。
- 汎用パッケージング、難読化、署名、評価版生成機能の設計・実装。
- kintone実機およびPlaywrightによる全29プラグインの動作確認。
- `ラジオボタン表示フィールド切替` の難読化版が不要なのか欠落なのかの確認。

## 12. 今後必要な作業

1. 合意のうえGit全履歴とリモートから秘密鍵を除去し、既存クローン利用者へ再取得を依頼する。
2. 3管理単位ごとにクリーンな環境でセットアップとテストを再実行する。
3. パッケージングCLIの入力仕様を一般化し、manifest検査、難読化、署名、通常版・評価版生成を必要に応じて追加する。
4. ファイル整理と検証結果をレビュー後、別工程として各フォルダを独立Gitリポジトリ化する。
