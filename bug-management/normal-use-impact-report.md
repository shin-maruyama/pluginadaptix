# 正常使用時影響 切り分け報告書

## 調査日

2026-06-26

## 対象CSV

`bug-management/potential-bug-list.csv`

## 件数サマリー

| 正常使用時影響 | 件数 |
|---|---:|
| あり | 0 |
| 条件付き | 79 |
| なし | 13 |
| 未確認 | 0 |

## 修正優先度サマリー

| 修正優先度 | 件数 |
|---|---:|
| 最優先 | 0 |
| 高 | 0 |
| 中 | 79 |
| 低 | 13 |
| 保留 | 0 |

## 正常使用時影響あり

| ID | プラグイン | 重大度 | 不具合内容 | 影響条件 | 修正優先度 |
|---|---|---|---|---|---|
| なし | なし | なし | なし | なし | なし |

## 条件付き影響

| ID | プラグイン | 重大度 | 不具合内容 | 影響条件 | 修正優先度 |
|---|---|---|---|---|---|
| PB-0001 | appList | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0002 | appList | Medium | DOM取得失敗時のnull参照リスク | 対象DOMが存在しない画面、設定不整合、フィールド削除/非表示、PC/モバイルのDOM差異がある場合 | 中 |
| PB-0003 | appList | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0004 | appList | Medium | DOM取得失敗時のnull参照リスク | 対象DOMが存在しない画面、設定不整合、フィールド削除/非表示、PC/モバイルのDOM差異がある場合 | 中 |
| PB-0005 | appList | Medium | DOM取得失敗時のnull参照リスク | 対象DOMが存在しない画面、設定不整合、フィールド削除/非表示、PC/モバイルのDOM差異がある場合 | 中 |
| PB-0006 | CharacterLimit | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0007 | CharacterLimit | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0008 | CharacterLimit | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0009 | ConditionalElapsedTimeAutomaticCalculation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0010 | ConditionalElapsedTimeAutomaticCalculation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0011 | ConditionalElapsedTimeAutomaticCalculation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0012 | CrossAppRecordSync | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0013 | CrossAppRecordSync | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0014 | CrossAppRecordSync | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0015 | CrossAppRecordSync | Medium | 添付ファイル存在確認漏れの可能性 | 添付ファイルが未設定、空配列、またはfileKeyが存在しないレコードを処理した場合 | 中 |
| PB-0016 | CrossAppRecordSync | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0017 | CrossAppRecordSync | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0018 | CrossAppRecordSync | Medium | 添付ファイル存在確認漏れの可能性 | 添付ファイルが未設定、空配列、またはfileKeyが存在しないレコードを処理した場合 | 中 |
| PB-0019 | CrossAppRecordSync | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0020 | CrossAppRecordSync | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0021 | DateSplit | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0022 | DateSplit | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0023 | DateSplit | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0024 | DoubleCheck | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0025 | DoubleCheck | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0026 | DoubleCheck | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0027 | FieldHidden | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0028 | FieldHidden | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0029 | FieldHidden | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0030 | FractionCalculation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0031 | FractionCalculation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0032 | FractionCalculation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0033 | FractionCalculation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0034 | FuriganaAutoInput | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0035 | FuriganaAutoInput | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0036 | FuriganaAutoInput | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0037 | GetWeek | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0038 | GetWeek | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0039 | GetWeek | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0040 | InputHintSetting | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0041 | InputHintSetting | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0042 | InputHintSetting | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0043 | KeywordLookup | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0044 | KeywordLookup | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0045 | KeywordLookup | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0046 | RecordRockb | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0047 | RecordRockb | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0048 | RecordRockb | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0049 | RetirementConversion | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0050 | RetirementConversion | Medium | DOM取得失敗時のnull参照リスク | 対象DOMが存在しない画面、設定不整合、フィールド削除/非表示、PC/モバイルのDOM差異がある場合 | 中 |
| PB-0051 | RetirementConversion | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0052 | RetirementConversion | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0053 | RetirementConversion | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0054 | RetirementConversion | Medium | DOM取得失敗時のnull参照リスク | 対象DOMが存在しない画面、設定不整合、フィールド削除/非表示、PC/モバイルのDOM差異がある場合 | 中 |
| PB-0055 | RetirementConversion | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0056 | RetirementConversion | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0057 | RetirementConversion | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0058 | StringConcatenation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0059 | StringConcatenation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0060 | StringConcatenation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0061 | SubTableAutosorte | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0062 | SubTableAutosorte | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0063 | SubTableAutosorte | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0064 | SubTableAutosorte | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0065 | SubTableAutosorte | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0066 | SubtableCopy | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0067 | SubtableCopy | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0068 | SubtableCopy | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0069 | SubtableCopy | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0070 | SubtableCopy | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0071 | TabDisplay | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0072 | TabDisplay | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0073 | TabDisplay | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0074 | TimeCalculation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0075 | TimeCalculation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0076 | TimeCalculation | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0077 | UserSelectStringAssignment | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0078 | UserSelectStringAssignment | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |
| PB-0079 | UserSelectStringAssignment | Medium | kintone REST API呼び出しのエラー処理が近傍で確認できない | API通信失敗、権限不足、対象アプリ/フォーム情報取得失敗、kintone APIレスポンスエラー時 | 中 |

## 通常利用への直接影響なし

| ID | プラグイン | 重大度 | 不具合内容 | 理由 |
|---|---|---|---|---|
| PB-0080 | appList | Low | !importantが使用されている | !importantが使用されているは現時点では主要機能停止ではなく、保守性または軽微な表示調整リスクとして扱う。 |
| PB-0081 | appList | Low | !importantが使用されている | !importantが使用されているは現時点では主要機能停止ではなく、保守性または軽微な表示調整リスクとして扱う。 |
| PB-0082 | appList | Low | !importantが使用されている | !importantが使用されているは現時点では主要機能停止ではなく、保守性または軽微な表示調整リスクとして扱う。 |
| PB-0083 | appList | Low | !importantが使用されている | !importantが使用されているは現時点では主要機能停止ではなく、保守性または軽微な表示調整リスクとして扱う。 |
| PB-0084 | appList | Low | !importantが使用されている | !importantが使用されているは現時点では主要機能停止ではなく、保守性または軽微な表示調整リスクとして扱う。 |
| PB-0085 | FieldHidden | Low | console.logが残置されている | console.log残置は運用時のノイズだが、処理停止や保存不可には直結しないため低優先とする。 |
| PB-0086 | FuriganaAutoInput | Low | console.logが残置されている | console.log残置は運用時のノイズだが、処理停止や保存不可には直結しないため低優先とする。 |
| PB-0087 | StringConcatenation | Low | !importantが使用されている | !importantが使用されているは現時点では主要機能停止ではなく、保守性または軽微な表示調整リスクとして扱う。 |
| PB-0088 | StringConcatenation | Low | !importantが使用されている | !importantが使用されているは現時点では主要機能停止ではなく、保守性または軽微な表示調整リスクとして扱う。 |
| PB-0089 | StringConcatenation | Low | !importantが使用されている | !importantが使用されているは現時点では主要機能停止ではなく、保守性または軽微な表示調整リスクとして扱う。 |
| PB-0090 | TabDisplay | Low | !importantが使用されている | !importantが使用されているは現時点では主要機能停止ではなく、保守性または軽微な表示調整リスクとして扱う。 |
| PB-0091 | TabDisplay | Low | !importantが使用されている | !importantが使用されているは現時点では主要機能停止ではなく、保守性または軽微な表示調整リスクとして扱う。 |
| PB-0092 | TabDisplay | Low | !importantが使用されている | !importantが使用されているは現時点では主要機能停止ではなく、保守性または軽微な表示調整リスクとして扱う。 |

## 未確認

| ID | プラグイン | 重大度 | 不具合内容 | 確認が必要な理由 |
|---|---|---|---|---|
| なし | なし | なし | なし | なし |

## 次回対応方針

1. `修正優先度=中` のうち、REST API呼び出しが設定保存・一括更新・同期など主要操作に近いものを優先して実機またはPlaywrightで確認する。
2. `CrossAppRecordSync` の添付ファイル処理は、添付なしレコードを含むデータで再現確認する。
3. DOMリスクは、対象フィールド削除、非表示、モバイル画面差異、設定不整合の条件を作って確認する。
4. `修正優先度=低` は通常利用への直接影響が小さいため、リリース前品質確認または他修正時に併せて対応する。
