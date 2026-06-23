# CharacterLimit 次回作業予定

## 未完了作業

- ビルド手順を確認し、codex/work-instructions.md に追記します。
- 難読化手順を確認し、codex/work-instructions.md に追記します。
- 仕様書の未確認事項を、実機またはPlaywright確認後に更新します。

## 保留事項

- 修正対象が指定された場合、作業前にAGENTS.md、specification.md、codex配下の運用文書を確認します。
- REST API、モバイル、サブテーブル、添付ファイル、設定保存への影響範囲を修正計画に記録します。
- 難読化済みファイルの生成手順と確認方法は未確定です。

## 今後の改善案

- プラグインごとの最小回帰テストケースを整備します。
- Playwrightで確認できる設定画面・実行画面の操作手順を整理します。
- バグ修正時の再現手順と再発防止策をtroubleshooting.mdに蓄積します。

## 次回優先タスク

1. 修正対象がある場合、修正目的、原因、修正方針、変更対象、影響範囲を記録する。
2. 元ソースのみを最小変更で修正する。
3. 静的確認、REST API確認、Node.js確認、Playwright確認、最終視覚確認の順で必要な確認を行う。
4. handover-YYYY-MM-DD.md と next-tasks.md を更新する。
