# Mediumバグ修正対象一覧

## 対象CSV

`bug-management/potential-bug-list.csv`

## 修正対象件数

79件

## 修正対象一覧

| ID | プラグイン | 不具合内容 | 正常使用時影響 | 影響条件 | 修正優先度 | 対象ファイル |
|---|---|---|---|---|---|---|
| PB-0001 | appList | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/アプリ一覧（カスタム版）/appList/contents/js/config.js |
| PB-0002 | appList | DOM取得失敗時のnull参照リスク | 条件付き | 対象DOMが存在しない画面、設定不整合、フィールド削除/非表示、PC/モバイルのDOM差異がある場合 | 中 | plugins/アプリ一覧（カスタム版）/appList/contents/js/config.js |
| PB-0003 | appList | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/アプリ一覧（カスタム版）/appList/contents/js/config.js |
| PB-0004 | appList | DOM取得失敗時のnull参照リスク | 条件付き | 対象DOMが存在しない画面、設定不整合、フィールド削除/非表示、PC/モバイルのDOM差異がある場合 | 中 | plugins/アプリ一覧（カスタム版）/appList/contents/js/desktop.js |
| PB-0005 | appList | DOM取得失敗時のnull参照リスク | 条件付き | 対象DOMが存在しない画面、設定不整合、フィールド削除/非表示、PC/モバイルのDOM差異がある場合 | 中 | plugins/アプリ一覧（カスタム版）/appList/contents/js/mobile.js |
| PB-0006 | CharacterLimit | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/文字制限/CharacterLimit/contents/js/config.js |
| PB-0007 | CharacterLimit | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/文字制限/CharacterLimit/contents/js/desktop.js |
| PB-0008 | CharacterLimit | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/文字制限/CharacterLimit/contents/js/mobile.js |
| PB-0009 | ConditionalElapsedTimeAutomaticCalculation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/js/config.js |
| PB-0010 | ConditionalElapsedTimeAutomaticCalculation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/js/desktop.js |
| PB-0011 | ConditionalElapsedTimeAutomaticCalculation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/js/mobile.js |
| PB-0012 | CrossAppRecordSync | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/config.js |
| PB-0013 | CrossAppRecordSync | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/config.js |
| PB-0014 | CrossAppRecordSync | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/config.js |
| PB-0015 | CrossAppRecordSync | 添付ファイル存在確認漏れの可能性 | 条件付き | 添付ファイルが未設定、空配列、またはfileKeyが存在しないレコードを処理した場合 | 中 | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/desktop.js |
| PB-0016 | CrossAppRecordSync | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/desktop.js |
| PB-0017 | CrossAppRecordSync | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/desktop.js |
| PB-0018 | CrossAppRecordSync | 添付ファイル存在確認漏れの可能性 | 条件付き | 添付ファイルが未設定、空配列、またはfileKeyが存在しないレコードを処理した場合 | 中 | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/mobile.js |
| PB-0019 | CrossAppRecordSync | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/mobile.js |
| PB-0020 | CrossAppRecordSync | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/mobile.js |
| PB-0021 | DateSplit | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/日付分割/DateSplit/contents/js/config.js |
| PB-0022 | DateSplit | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/日付分割/DateSplit/contents/js/desktop.js |
| PB-0023 | DateSplit | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/日付分割/DateSplit/contents/js/mobile.js |
| PB-0024 | DoubleCheck | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/フィールド重複チェック/DoubleCheck/contents/js/config.js |
| PB-0025 | DoubleCheck | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/フィールド重複チェック/DoubleCheck/contents/js/desktop.js |
| PB-0026 | DoubleCheck | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/フィールド重複チェック/DoubleCheck/contents/js/mobile.js |
| PB-0027 | FieldHidden | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/非表示/FieldHidden/contents/js/config.js |
| PB-0028 | FieldHidden | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/非表示/FieldHidden/contents/js/desktop.js |
| PB-0029 | FieldHidden | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/非表示/FieldHidden/contents/js/mobile.js |
| PB-0030 | FractionCalculation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/端数計算/FractionCalculation/contents/js/config.js |
| PB-0031 | FractionCalculation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/端数計算/FractionCalculation/contents/js/config.js |
| PB-0032 | FractionCalculation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/端数計算/FractionCalculation/contents/js/desktop.js |
| PB-0033 | FractionCalculation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/端数計算/FractionCalculation/contents/js/mobile.js |
| PB-0034 | FuriganaAutoInput | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/ふりがな自動入力/FuriganaAutoInput/contents/js/config.js |
| PB-0035 | FuriganaAutoInput | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/ふりがな自動入力/FuriganaAutoInput/contents/js/desktop.js |
| PB-0036 | FuriganaAutoInput | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/ふりがな自動入力/FuriganaAutoInput/contents/js/mobile.js |
| PB-0037 | GetWeek | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/日付曜日取得/GetWeek/contents/js/config.js |
| PB-0038 | GetWeek | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/日付曜日取得/GetWeek/contents/js/desktop.js |
| PB-0039 | GetWeek | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/日付曜日取得/GetWeek/contents/js/mobile.js |
| PB-0040 | InputHintSetting | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/入力ヒント設定/InputHintSetting/contents/js/config.js |
| PB-0041 | InputHintSetting | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js |
| PB-0042 | InputHintSetting | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js |
| PB-0043 | KeywordLookup | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/キーワードルックアップ/KeywordLookup/contents/js/config.js |
| PB-0044 | KeywordLookup | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/キーワードルックアップ/KeywordLookup/contents/js/desktop.js |
| PB-0045 | KeywordLookup | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/キーワードルックアップ/KeywordLookup/contents/js/mobile.js |
| PB-0046 | RecordRockb | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/レコードロック確認/RecordRockb/contents/js/config.js |
| PB-0047 | RecordRockb | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/レコードロック確認/RecordRockb/contents/js/desktop.js |
| PB-0048 | RecordRockb | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/レコードロック確認/RecordRockb/contents/js/mobile.js |
| PB-0049 | RetirementConversion | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/退職者チェック/RetirementConversion/contents/js/config.js |
| PB-0050 | RetirementConversion | DOM取得失敗時のnull参照リスク | 条件付き | 対象DOMが存在しない画面、設定不整合、フィールド削除/非表示、PC/モバイルのDOM差異がある場合 | 中 | plugins/退職者チェック/RetirementConversion/contents/js/desktop.js |
| PB-0051 | RetirementConversion | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/退職者チェック/RetirementConversion/contents/js/desktop.js |
| PB-0052 | RetirementConversion | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/退職者チェック/RetirementConversion/contents/js/desktop.js |
| PB-0053 | RetirementConversion | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/退職者チェック/RetirementConversion/contents/js/desktop.js |
| PB-0054 | RetirementConversion | DOM取得失敗時のnull参照リスク | 条件付き | 対象DOMが存在しない画面、設定不整合、フィールド削除/非表示、PC/モバイルのDOM差異がある場合 | 中 | plugins/退職者チェック/RetirementConversion/contents/js/mobile.js |
| PB-0055 | RetirementConversion | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/退職者チェック/RetirementConversion/contents/js/mobile.js |
| PB-0056 | RetirementConversion | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/退職者チェック/RetirementConversion/contents/js/mobile.js |
| PB-0057 | RetirementConversion | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/退職者チェック/RetirementConversion/contents/js/mobile.js |
| PB-0058 | StringConcatenation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/文字列結合/StringConcatenation/contents/js/config.js |
| PB-0059 | StringConcatenation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/文字列結合/StringConcatenation/contents/js/desktop.js |
| PB-0060 | StringConcatenation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/文字列結合/StringConcatenation/contents/js/mobile.js |
| PB-0061 | SubTableAutosorte | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js |
| PB-0062 | SubTableAutosorte | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js |
| PB-0063 | SubTableAutosorte | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js |
| PB-0064 | SubTableAutosorte | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js |
| PB-0065 | SubTableAutosorte | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js |
| PB-0066 | SubtableCopy | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/サブテーブルコピー/SubtableCopy/contents/js/config.js |
| PB-0067 | SubtableCopy | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/サブテーブルコピー/SubtableCopy/contents/js/config.js |
| PB-0068 | SubtableCopy | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/サブテーブルコピー/SubtableCopy/contents/js/desktop.js |
| PB-0069 | SubtableCopy | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/サブテーブルコピー/SubtableCopy/contents/js/mobile.js |
| PB-0070 | SubtableCopy | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/サブテーブルコピー/SubtableCopy/contents/js/mobile.js |
| PB-0071 | TabDisplay | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/TAB表示/TabDisplay/contents/js/config.js |
| PB-0072 | TabDisplay | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/TAB表示/TabDisplay/contents/js/desktop.js |
| PB-0073 | TabDisplay | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/TAB表示/TabDisplay/contents/js/mobile.js |
| PB-0074 | TimeCalculation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/時間計算/TimeCalculation/contents/js/config.js |
| PB-0075 | TimeCalculation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/時間計算/TimeCalculation/contents/js/desktop.js |
| PB-0076 | TimeCalculation | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/時間計算/TimeCalculation/contents/js/mobile.js |
| PB-0077 | UserSelectStringAssignment | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/ユーザー選択→文字列1行代入/UserSelectStringAssignment/contents/js/config.js |
| PB-0078 | UserSelectStringAssignment | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/ユーザー選択→文字列1行代入/UserSelectStringAssignment/contents/js/desktop.js |
| PB-0079 | UserSelectStringAssignment | kintone REST API呼び出しのエラー処理が近傍で確認できない | 条件付き | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 | plugins/ユーザー選択→文字列1行代入/UserSelectStringAssignment/contents/js/mobile.js |

## 今回対象外

| ID | 重大度 | 理由 |
|---|---|---|
| PB-0080 | Low | Mediumのみ修正対象のため今回対象外 |
| PB-0081 | Low | Mediumのみ修正対象のため今回対象外 |
| PB-0082 | Low | Mediumのみ修正対象のため今回対象外 |
| PB-0083 | Low | Mediumのみ修正対象のため今回対象外 |
| PB-0084 | Low | Mediumのみ修正対象のため今回対象外 |
| PB-0085 | Low | Mediumのみ修正対象のため今回対象外 |
| PB-0086 | Low | Mediumのみ修正対象のため今回対象外 |
| PB-0087 | Low | Mediumのみ修正対象のため今回対象外 |
| PB-0088 | Low | Mediumのみ修正対象のため今回対象外 |
| PB-0089 | Low | Mediumのみ修正対象のため今回対象外 |
| PB-0090 | Low | Mediumのみ修正対象のため今回対象外 |
| PB-0091 | Low | Mediumのみ修正対象のため今回対象外 |
| PB-0092 | Low | Mediumのみ修正対象のため今回対象外 |
