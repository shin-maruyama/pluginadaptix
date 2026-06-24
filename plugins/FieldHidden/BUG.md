# BUG.md

## バグ履歴

### No.1 2026-24-06 BUG-011 DOM取得失敗時にnullへhasAttributeを呼ぶ

| 項目 | 内容 |
|---|---|
| ID | BUG-011 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | DOM不具合 |
| 対象ファイル | FieldHidden/FieldHidden/contents/js/desktop.js |
| 行 | 61 |
| 影響 | 対象フィールドのDOMが存在しない、折りたたみ、削除、他プラグイン非表示などの条件で実行時エラーになる。 |
| 詳細 | `document.querySelector` の結果がnullでも `hasAttribute` を呼ぶ。 |
| 推奨対応 | `if (!fieldWrap2) return;` を追加し、関連属性の存在確認を行う。 |
| ステータス | 未対応（修正保留） |

---

### No.2 2026-24-06 BUG-012 関連属性の該当設定がない場合にfields参照で落ちる

| 項目 | 内容 |
|---|---|
| ID | BUG-012 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | DOM不具合 |
| 対象ファイル | FieldHidden/FieldHidden/contents/js/desktop.js |
| 行 | 66 |
| 影響 | ドロップダウン/ラジオ連動属性の選択肢名が一致しない場合に画面表示処理が停止する。 |
| 詳細 | `find()` の戻り値を確認せず `getAttributeTarget.fields` を参照している。 |
| 推奨対応 | `getAttributeTarget` と `fields` の存在確認を追加する。 |
| ステータス | 未対応（修正保留） |

---

### No.3 2026-24-06 BUG-022 設定未保存/破損時にJSON.parseでロード失敗する

| 項目 | 内容 |
|---|---|
| ID | BUG-022 |
| 重大度 | Medium |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | 設定値不具合 |
| 対象ファイル | FieldHidden/FieldHidden/contents/js/desktop.js |
| 行 | 9 |
| 影響 | 設定未保存、設定破損、旧設定形式の場合にプラグイン全体がロード時点で停止する。 |
| 詳細 | 設定値存在確認やtry/catchなしで `config.elementArray` をJSON.parseしている。 |
| 推奨対応 | 設定存在チェックとJSON parse失敗時の安全なreturnを追加する。mobile.jsも同様確認。 |
| ステータス | 未対応（修正保留） |

---
