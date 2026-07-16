# BUG.md

## 解析メモ

- 2026-06-26: bug-management-list.csv は未配置のため、既存 BUG.md のバグ情報を起点に関連ファイル解析と修正準備を実施しました。
- 対象プラグイン配下のファイル一覧、manifest、JS/CSS/HTML、codex文書、難読化版の存在を確認しました。
- 難読化済みファイルは参考扱いとし、修正対象候補は元ソース側に限定しています。

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
| ステータス | 修正済み |
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: `document.querySelector` の結果がnullでも `hasAttribute` を呼ぶ。<br>コード上で確認済み: DOM取得結果のnullチェック不足が対象行周辺にある。 |
| 修正準備状況 | 準備完了 |
| 修正日 | 2026-26-06 |
| 修正内容 | DOM取得結果がnullの場合は関連属性判定をスキップするガードを追加しました。 |
| 修正ファイル | plugins/非表示/FieldHidden/contents/js/desktop.js |
| 確認結果 | node --check 成功。DOM nullガードの静的確認済み。kintone実機確認は未実施。 |

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
| ステータス | 修正済み |
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: `find()` の戻り値を確認せず `getAttributeTarget.fields` を参照している。 |
| 修正準備状況 | 準備完了 |
| 修正日 | 2026-26-06 |
| 修正内容 | 関連属性の該当設定がない場合に `fields` 参照を行わない存在確認を追加しました。 |
| 修正ファイル | plugins/非表示/FieldHidden/contents/js/desktop.js |
| 確認結果 | node --check 成功。`getAttributeTarget` と `fields` の存在確認を静的確認済み。kintone実機確認は未実施。 |

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
| ステータス | 修正済み |
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: 設定値存在確認やtry/catchなしで `config.elementArray` をJSON.parseしている。<br>コード上で確認済み: 設定値の存在確認またはtry/catch前にJSON.parseが実行される可能性がある。 |
| 修正準備状況 | 準備完了 |
| 修正日 | 2026-26-06 |
| 修正内容 | 設定値 `elementArray` の存在確認とJSON.parse失敗時の安全な空配列フォールバックを追加しました。 |
| 修正ファイル | plugins/非表示/FieldHidden/contents/js/desktop.js<br>plugins/非表示/FieldHidden/contents/js/mobile.js |
| 確認結果 | node --check 成功。設定未保存/破損時のロード停止回避を静的確認済み。kintone実機確認は未実施。 |

---

## 2026-06-26 Medium潜在バグ修正

| ID | 重大度 | 分類 | 不具合内容 | 対象ファイル | ステータス | 修正日 | 修正内容 | 確認結果 |
|---|---|---|---|---|---|---|---|---|
| PB-0027 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/非表示/FieldHidden/contents/js/config.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0028 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/非表示/FieldHidden/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0029 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/非表示/FieldHidden/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
