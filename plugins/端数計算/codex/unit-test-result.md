# FractionCalculation 単体テスト結果

## 1. 判定サマリー

| 項目 | 内容 |
|---|---|
| 総合判定 | NG |
| 対象プラグイン | FractionCalculation |
| 対象バージョン | 1.0.2 |
| 実施日 | 2026-06-27 |
| 実施者 | Codex |
| テスト種別 | 単体テスト |
| テスト対象ファイル数 | 13 |
| OK件数 | 8 |
| NG件数 | 2 |
| 要確認件数 | 6 |
| 未実施件数 | 1 |
| 対象外件数 | 2 |

---

## 2. 参照資料

| ファイル | 確認状況 | 備考 |
|---|---|---|
| specification.md | OK | 確認済み。 |
| Manual.md | OK | 確認済み。 |
| BUG.md | OK | 1件の履歴を確認。 |
| TEST_SPEC.md | なし | 不足。 |
| codex/test-plan.md | OK | 確認済み。 |
| codex/fix-plan.md | なし | 不足。 |
| manifest.json | OK | plugins/端数計算/FractionCalculation/contents/manifest.json を確認。plugins直下のmanifest.jsonはなし。 |

### 未確認・不足資料

- TEST_SPEC.md: 不足。
- codex/fix-plan.md: 不足。

---

## 3. 実行コマンド

| No | コマンド | 結果 | 備考 |
|---|---|---|---|
| 1 | npm test | 対象外 | plugins配下に個別package.jsonなし。 |
| 2 | npm run lint | 対象外 | plugins配下に個別package.jsonなし。 |
| 3 | npm run build | 対象外 | plugins配下に個別package.jsonなし。 |
| 4 | node --check <対象JS> | OK | 4件確認。構文エラーなし。 |

---

## 4. 単体テスト結果一覧

| No | テスト分類 | テスト項目 | 対象ファイル | 確認内容 | 実施方法 | 判定 | 詳細 |
|---|---|---|---|---|---|---|---|
| 1 | manifest | manifest.json構文 | plugins/端数計算/FractionCalculation/contents/manifest.json | JSONとして正しいか | JSON解析 | OK | version 1.0.2 を確認。 |
| 2 | manifest | 参照ファイル存在確認 | plugins/端数計算/FractionCalculation/contents/manifest.json | JS/CSS/HTML/iconの参照先が存在するか | 静的確認 | OK | ローカル参照先は存在。外部CDNは応答未確認。 |
| 3 | CSS | CSS構文確認 | plugins/端数計算/FractionCalculation/contents/css/51-modern-default.css<br>plugins/端数計算/FractionCalculation/contents/css/config.css<br>plugins/端数計算/FractionCalculation/contents/css/desktop.css<br>plugins/端数計算/FractionCalculation/contents/css/mobile.css | CSSの波括弧整合性を確認 | 静的解析 | OK | 4件確認。 |
| 4 | HTML | HTML構造確認 | plugins/端数計算/FractionCalculation/contents/html/config.html | 設定画面HTMLが空でないか | 静的解析 | OK | 1件確認。 |
| 5 | JavaScript | JS構文確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | 構文エラーがないか | node --check | OK | 4件すべて構文OK。 |
| 6 | JavaScript | 未定義変数確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | 未定義参照がないか | 静的解析 | 要確認 | kintone/browserグローバル依存のため静的解析のみでは完全判定不可。 |
| 7 | JavaScript | 未定義関数確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | 呼び出し関数が存在するか | 静的解析 | 要確認 | kintone/browserグローバル依存のため静的解析のみでは完全判定不可。 |
| 8 | 設定保存 | getConfig確認 | plugins/端数計算/FractionCalculation/contents/js/config.js | 設定取得処理があるか | 静的確認 | OK | getConfig呼び出しを確認。 |
| 9 | 設定保存 | setConfig確認 | plugins/端数計算/FractionCalculation/contents/js/config.js | 設定保存処理があるか | 静的確認 | OK | setConfig呼び出しを確認。 |
| 10 | JavaScript | 関数単位の入力・出力 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | 主要関数の入力・出力を実行確認できるか | 未実施 | 未実施 | kintone API、DOM、jQuery、外部ライブラリ依存があり、単体実行用ハーネスが未整備。 |
| 11 | kintoneイベント | イベント登録確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | 使用イベントが正しいか | 静的確認 | OK | kintone.events.on を確認。実機発火は未確認。 |
| 12 | REST API | API呼び出し確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | API呼び出し形式が正しいか | 静的確認 | 要確認 | kintone.api/kintone.proxy を確認。認証・権限・レスポンスは実機確認が必要。 |
| 13 | エラー処理 | try-catch確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | API・JSON処理にエラー処理があるか | 静的確認 | 要確認 | try/catch有無: あり。実行時の異常系は要実機確認。 |
| 14 | DOM | DOM取得確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | null参照の可能性がないか | 静的確認 | 対象外 | DOM生成・取得処理なし。 |
| 15 | サブテーブル | サブテーブル存在確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | value参照前に存在確認があるか | 静的確認 | 要確認 | サブテーブル処理を確認。空行・行追加は実機確認が必要。 |
| 16 | 添付ファイル | 添付ファイル存在確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | fileKey等の参照が安全か | 静的確認 | 対象外 | 添付ファイル処理なし。 |
| 17 | 権限 | 権限処理確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | 権限不足時の考慮があるか | 静的確認 | 要確認 | 権限差はkintone実機環境で確認が必要。 |
| 18 | モバイル | mobile処理確認 | plugins/端数計算/FractionCalculation/contents/js/mobile.js | PC処理と矛盾がないか | 静的確認 | NG | BUG.mdにモバイル処理の未対応項目あり。 |
| 19 | BUG.md | 修正済みバグ確認 | plugins/端数計算/BUG.md | 修正済みバグの対象箇所が反映済みか | 静的確認 | NG | 未対応BUG: BUG-009 |

---

## 5. NG一覧

| No | テスト項目 | 対象ファイル | 内容 | 影響 | 推奨対応 |
|---|---|---|---|---|---|
| 1 | mobile処理確認 | plugins/端数計算/FractionCalculation/contents/js/mobile.js | BUG.mdにモバイル処理の未対応項目あり。 | 該当機能が実行時に停止または誤動作する可能性がある。 | BUG.mdの推奨対応に従って修正する。 |
| 2 | 修正済みバグ確認 | plugins/端数計算/BUG.md | 未対応BUG: BUG-009 | 該当機能が実行時に停止または誤動作する可能性がある。 | BUG.mdの推奨対応に従って修正する。 |

---

## 6. 要確認一覧

| No | テスト項目 | 対象ファイル | 要確認理由 | 実機確認内容 |
|---|---|---|---|---|
| 1 | 未定義変数確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | kintone/browserグローバル依存のため静的解析のみでは完全判定不可。 | kintone実機で設定保存、画面表示、イベント発火、API権限差を確認する。 |
| 2 | 未定義関数確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | kintone/browserグローバル依存のため静的解析のみでは完全判定不可。 | kintone実機で設定保存、画面表示、イベント発火、API権限差を確認する。 |
| 3 | API呼び出し確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | kintone.api/kintone.proxy を確認。認証・権限・レスポンスは実機確認が必要。 | kintone実機で設定保存、画面表示、イベント発火、API権限差を確認する。 |
| 4 | try-catch確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | try/catch有無: あり。実行時の異常系は要実機確認。 | kintone実機で設定保存、画面表示、イベント発火、API権限差を確認する。 |
| 5 | サブテーブル存在確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | サブテーブル処理を確認。空行・行追加は実機確認が必要。 | kintone実機で設定保存、画面表示、イベント発火、API権限差を確認する。 |
| 6 | 権限処理確認 | plugins/端数計算/FractionCalculation/contents/js/certification.js<br>plugins/端数計算/FractionCalculation/contents/js/config.js<br>plugins/端数計算/FractionCalculation/contents/js/desktop.js<br>plugins/端数計算/FractionCalculation/contents/js/mobile.js | 権限差はkintone実機環境で確認が必要。 | kintone実機で設定保存、画面表示、イベント発火、API権限差を確認する。 |

---

## 7. 未実施一覧

| No | テスト項目 | 理由 | 次回実施方法 |
|---|---|---|---|
| 1 | 関数単位の入力・出力 | kintone API、DOM、jQuery、外部ライブラリ依存があり、単体実行用ハーネスが未整備。 | kintone API/DOMをモック化した単体テストハーネスを作成して実行する。 |

---

## 8. BUG.mdとの対応

| BUG ID | 不具合内容 | 修正状況 | 単体テスト判定 | 備考 |
|---|---|---|---|---|
| BUG-009 | mobile.jsの設定済みフィールド確認でdesktop APIのgetIdを使用している | 未対応 | NG | `kintone.mobile.app.getId()` を利用する。 |

---

## 9. 総合判定理由

BUG.mdに未対応バグ、または静的確認で明確なNGがあるため総合判定をNGとした。JS構文、manifest参照、CSS/HTMLの基礎確認は実施済み。

---

## 10. 次回対応

- BUG.mdに記載された未対応バグを修正する。
- 修正後に本ファイルを更新し、該当BUGの単体テスト判定を再確認する。
- kintone実機でモバイル、DOM、API、権限差を確認する。

---

## 11. 変更ファイル

- `plugins/端数計算/codex/unit-test-result.md`
