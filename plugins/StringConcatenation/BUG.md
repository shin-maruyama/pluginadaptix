# BUG.md

## 解析メモ

- 2026-06-26: bug-management-list.csv は未配置のため、既存 BUG.md のバグ情報を起点に関連ファイル解析と修正準備を実施しました。
- 対象プラグイン配下のファイル一覧、manifest、JS/CSS/HTML、codex文書、難読化版の存在を確認しました。
- 難読化済みファイルは参考扱いとし、修正対象候補は元ソース側に限定しています。

## バグ履歴

### No.1 2026-24-06 BUG-021 undefined除外のfilter条件が常にtrueになる

| 項目 | 内容 |
|---|---|
| ID | BUG-021 |
| 重大度 | Medium |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | 値変換不具合 |
| 対象ファイル | StringConcatenation/StringConcatenation/contents/js/desktop.js |
| 行 | 107 |
| 影響 | 未入力フィールドを含む結合時に、余分な区切りや想定外の値が混入する可能性がある。 |
| 詳細 | `!== undefined \|\| !== "ndefined"` は常にtrueになり、undefined除外として機能しない。文字列も `undefined` ではなく `ndefined` になっている。 |
| 推奨対応 | `&&` 条件にし、文字列 `undefined` も含めて除外条件を整理する。mobile.jsも同様確認。 |
| ステータス | 修正済み |
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: OR条件により undefined 除外条件が常にtrueになる可能性がある。 |
| 修正準備状況 | 準備完了 |
| 修正日 | 2026-26-06 |
| 修正内容 | undefined除外条件をORからANDへ修正し、文字列 `undefined` と既存 typo の `ndefined` も除外するようにしました。 |
| 修正ファイル | plugins/StringConcatenation/StringConcatenation/contents/js/desktop.js<br>plugins/StringConcatenation/StringConcatenation/contents/js/mobile.js |
| 確認結果 | node --check 成功。filter条件の静的確認済み。kintone実機確認は未実施。 |

---
