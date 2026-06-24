# BUG.md

## バグ履歴

### No.1 2026-24-06 BUG-014 ユーザー一覧100件超過時の再帰呼び出しが未定義関数になっている

| 項目 | 内容 |
|---|---|
| ID | BUG-014 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | API処理不具合 |
| 対象ファイル | RetirementConversion/RetirementConversion/contents/js/desktop.js |
| 行 | 183 |
| 影響 | ユーザー数が100件を超える環境で退職者チェックが途中で失敗する。 |
| 詳細 | メソッド内で `getAllUsers` を直接呼んでいるが、関数スコープに定義されていない。 |
| 推奨対応 | `return total.getAllUsers(offset + 100, users);` のようにメソッド経由で呼ぶ。mobile.jsも同様確認。 |
| ステータス | 未対応（修正保留） |

---

### No.2 2026-24-06 BUG-019 空のサブテーブルで存在チェックがTypeErrorになる

| 項目 | 内容 |
|---|---|
| ID | BUG-019 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | サブテーブル不具合 |
| 対象ファイル | RetirementConversion/RetirementConversion/contents/js/desktop.js |
| 行 | 151 |
| 影響 | 空のサブテーブルを含む一覧で退職者チェック処理が落ちる可能性がある。 |
| 詳細 | サブテーブルの先頭行 `value[0]` が存在する前提でユーザー選択フィールドを確認している。 |
| 推奨対応 | 空行時の分岐を追加する。mobile.jsも同様確認。 |
| ステータス | 未対応（修正保留） |

---
