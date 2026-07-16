# AGENTS.md

> 分割元: ルート `AGENTS.md` のkintoneプラグイン開発、修正、調査、バグ管理規約。

- 作業前に対象プラグインの `specification.md`、`codex/work-instructions.md`、`codex/test-plan.md`、`codex/troubleshooting.md`、`codex/next-tasks.md` を確認する。
- 変更対象は `plugins/<プラグイン名>/<元ソース>` とし、末尾 `e` の難読化済み生成物を直接修正しない。
- REST API調査、Node.js静的確認、Playwright、必要最小限の視覚確認の順で進める。
- 不要なリファクタリング、命名変更、ファイル移動、ライブラリ変更をしない。
- 修正後は対象プラグインのhandoverとnext-tasksを更新する。
- バグ対応では最初に `bug-management/bug-management-list.csv` を確認する。
- 秘密鍵、APIキー、トークン、Cookie、顧客情報を保存しない。
