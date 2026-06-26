# BUG.md

## 解析メモ

- 2026-06-26: bug-management-list.csv は未配置のため、既存 BUG.md のバグ情報を起点に関連ファイル解析と修正準備を実施しました。
- 対象プラグイン配下のファイル一覧、manifest、JS/CSS/HTML、codex文書、難読化版の存在を確認しました。
- 難読化済みファイルは参考扱いとし、修正対象候補は元ソース側に限定しています。

## バグ履歴

### No.1 2026-24-06 BUG-009 mobile.jsの設定済みフィールド確認でdesktop APIのgetIdを使用している

| 項目 | 内容 |
|---|---|
| ID | BUG-009 |
| 重大度 | Medium |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | モバイル不具合 |
| 対象ファイル | FractionCalculation/FractionCalculation/contents/js/mobile.js |
| 行 | 324 |
| 影響 | モバイル一覧で設定済みフィールドの存在チェックが失敗し、警告表示が機能しない可能性がある。 |
| 詳細 | mobile.jsのフォームレイアウト取得で `kintone.app.getId()` を使用している。 |
| 推奨対応 | `kintone.mobile.app.getId()` を利用する。 |
| ステータス | 修正済み |
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: mobile.jsのフォームレイアウト取得で `kintone.app.getId()` を使用している。<br>コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。 |
| 修正準備状況 | 準備完了 |
| 修正日 | 2026-26-06 |
| 修正内容 | モバイル画面のフォームレイアウト取得で `kintone.mobile.app.getId()` を使用するよう修正しました。 |
| 修正ファイル | plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js |
| 確認結果 | node --check 成功。対象API呼び出しの静的確認済み。kintone実機確認は未実施。 |

---
