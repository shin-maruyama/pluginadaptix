# FractionCalculation バグ修正準備計画

作業日: 2026-06-26

## 1. 修正対象バグ

- BUG-009: No.1 2026-24-06 BUG-009 mobile.jsの設定済みフィールド確認でdesktop APIのgetIdを使用している

## 2. 優先順位

1. BUG-009: 重大度 Medium、確度 高確度

## 3. 修正対象ファイル

- plugins/端数計算/FractionCalculation/contents/js/mobile.js

## 4. 修正対象関数

- BUG-009: getFieldList（315行付近）

## 5. 修正方針

- BUG-009: `kintone.mobile.app.getId()` を利用する。

## 6. 影響範囲

- BUG-009: 中 - モバイル一覧で設定済みフィールドの存在チェックが失敗し、警告表示が機能しない可能性がある。

## 7. 修正前に確認すること

- AGENTS.md、specification.md、codex/work-instructions.md、codex/test-plan.md、codex/troubleshooting.md、codex/next-tasks.md を確認する。
- bug-analysis.md の対象行周辺と原因候補を確認する。
- 修正対象が元ソースであり、難読化済みファイルではないことを確認する。
- バグごとの影響画面、イベント、設定値、APIを確認する。

## 8. 修正後に確認すること

- 構文エラー、未使用変数、console残置がないこと。
- 対象イベントで既存動作を壊していないこと。
- PC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を確認すること。
- 必要に応じて難読化版とZIPを元ソースから生成し、manifest整合性を確認すること。

## 9. テスト項目

- 静的確認: 対象ファイルの構文、参照、定数、console残置。
- Node.js確認: 可能な範囲で設定値・条件分岐・パス整合性を確認。
- REST API確認: kintone.api 利用箇所がある場合にメソッド、パラメータ、エラー処理を確認。
- Playwright確認: 対象画面だけを必要最小回数で確認。
- kintone実機確認: 必要な場合のみ、設定画面、対象画面、保存処理を確認。

## 10. リスク

- 既存設定値との互換性を壊すリスク。
- desktop/mobile APIの置換時に画面差分を見落とすリスク。
- サブテーブル、DOM、関連プラグイン属性のnullチェック追加で既存表示条件が変わるリスク。
- CSV本体未確認のため、BUG.md外に追加バグがある可能性。

## 11. 保留事項

- `bug-management-list.csv` の入手と差分照合。
- 実機またはPlaywrightでの再現確認。
- 修正後の難読化・ZIP化手順確認。

## 12. 次回作業

1. BUG.md、bug-analysis.md、fix-plan.md を確認する。
2. 優先順位の高いBUGから、元ソースのみを最小変更で修正する。
3. test-plan.md に従い、静的確認、コーディング規約確認、必要なAPI/Node.js/Playwright確認を行う。
4. 修正結果を handover、next-tasks、必要に応じて troubleshooting に記録する。
