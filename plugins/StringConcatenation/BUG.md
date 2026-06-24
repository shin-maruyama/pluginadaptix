# BUG.md

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
| ステータス | 未対応（修正保留） |

---
