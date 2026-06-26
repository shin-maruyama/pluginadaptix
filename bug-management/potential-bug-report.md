# 潜在バグ調査報告書

## 調査日

2026-06-26

## 対象範囲

- 対象: `plugins/` 配下の全プラグイン
- 除外: `node_modules/`, `dist/`, `coverage/`, `playwright-report/`, `test-results/`, `.git/`, `.DS_Store`, `Thumbs.db`, `*.zip`
- 実施内容: manifest参照整合性、JS構文、kintoneイベント/API/DOM/設定取得保存、CSS、HTML ID参照、通常版/難読化版manifest差異、既存BUG.md関連を静的確認
- JS構文確認: 全JSで `node --check` を実行し、構文エラーなし
- HTML ID確認: 設定画面JSの静的ID参照と `config.html` のIDは不一致なし

## 調査対象プラグイン

- CharacterLimit
- ConditionalElapsedTimeAutomaticCalculation
- CrossAppRecordSync
- DateSplit
- DoubleCheck
- FieldHidden
- FractionCalculation
- FuriganaAutoInput
- GetWeek
- HandwrittenSignature
- InputHintSetting
- KeywordLookup
- LookupLinkage
- PeriodBulkUpdate
- RecordLimit
- RecordRockb
- RetirementConversion
- StringConcatenation
- SubTableAutosorte
- SubTableUserLimit
- SubtableCopy
- SubtableMaxValue
- TabDisplay
- TimeCalculation
- UserSelectStringAssignment
- appList

## 検出件数

| 重大度 | 件数 |
|---|---:|
| Critical | 0 |
| High | 0 |
| Medium | 79 |
| Low | 13 |

## プラグイン別件数

| プラグイン | 件数 |
|---|---:|
| CharacterLimit | 3 |
| ConditionalElapsedTimeAutomaticCalculation | 3 |
| CrossAppRecordSync | 9 |
| DateSplit | 3 |
| DoubleCheck | 3 |
| FieldHidden | 4 |
| FractionCalculation | 4 |
| FuriganaAutoInput | 4 |
| GetWeek | 3 |
| HandwrittenSignature | 0 |
| InputHintSetting | 3 |
| KeywordLookup | 3 |
| LookupLinkage | 0 |
| PeriodBulkUpdate | 0 |
| RecordLimit | 0 |
| RecordRockb | 3 |
| RetirementConversion | 9 |
| StringConcatenation | 6 |
| SubTableAutosorte | 5 |
| SubTableUserLimit | 0 |
| SubtableCopy | 5 |
| SubtableMaxValue | 0 |
| TabDisplay | 6 |
| TimeCalculation | 3 |
| UserSelectStringAssignment | 3 |
| appList | 10 |

## 主な検出内容

| 分類 | 件数 |
|---|---:|
| REST API | 72 |
| CSS | 11 |
| DOM | 5 |
| JavaScript | 2 |
| 添付ファイル | 2 |

主な内容:

- PB-0001 appList: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/appList/appList/contents/js/config.js:475)
- PB-0002 appList: DOM取得失敗時のnull参照リスク (plugins/appList/appList/contents/js/config.js:901)
- PB-0003 appList: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/appList/appList/contents/js/config.js:1086)
- PB-0004 appList: DOM取得失敗時のnull参照リスク (plugins/appList/appList/contents/js/desktop.js:252)
- PB-0005 appList: DOM取得失敗時のnull参照リスク (plugins/appList/appList/contents/js/mobile.js:243)
- PB-0006 CharacterLimit: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/CharacterLimit/CharacterLimit/contents/js/config.js:479)
- PB-0007 CharacterLimit: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/CharacterLimit/CharacterLimit/contents/js/desktop.js:425)
- PB-0008 CharacterLimit: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/CharacterLimit/CharacterLimit/contents/js/mobile.js:425)
- PB-0009 ConditionalElapsedTimeAutomaticCalculation: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/js/config.js:173)
- PB-0010 ConditionalElapsedTimeAutomaticCalculation: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/js/desktop.js:204)
- PB-0011 ConditionalElapsedTimeAutomaticCalculation: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/js/mobile.js:204)
- PB-0012 CrossAppRecordSync: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/config.js:509)
- PB-0013 CrossAppRecordSync: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/config.js:732)
- PB-0014 CrossAppRecordSync: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/config.js:742)
- PB-0015 CrossAppRecordSync: 添付ファイル存在確認漏れの可能性 (plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/desktop.js:679)
- PB-0016 CrossAppRecordSync: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/desktop.js:705)
- PB-0017 CrossAppRecordSync: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/desktop.js:716)
- PB-0018 CrossAppRecordSync: 添付ファイル存在確認漏れの可能性 (plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/mobile.js:692)
- PB-0019 CrossAppRecordSync: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/mobile.js:718)
- PB-0020 CrossAppRecordSync: kintone REST API呼び出しのエラー処理が近傍で確認できない (plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/mobile.js:729)

解析サマリ:

| プラグイン | 解析ファイル数 | manifest数 | イベント種別数 | API呼び出し数 | getConfig | setConfig | 既存BUG.md ID |
|---|---:|---:|---:|---:|---:|---:|---|
| CharacterLimit | 34 | 2 | 10 | 3 | 3 | 1 | なし |
| ConditionalElapsedTimeAutomaticCalculation | 34 | 2 | 6 | 3 | 3 | 1 | なし |
| CrossAppRecordSync | 34 | 2 | 10 | 7 | 3 | 1 | なし |
| DateSplit | 34 | 2 | 10 | 3 | 3 | 1 | なし |
| DoubleCheck | 38 | 2 | 6 | 7 | 3 | 1 | BUG-003 |
| FieldHidden | 38 | 2 | 11 | 4 | 3 | 1 | BUG-011; BUG-012; BUG-022 |
| FractionCalculation | 38 | 2 | 10 | 4 | 3 | 1 | BUG-009 |
| FuriganaAutoInput | 36 | 2 | 10 | 3 | 3 | 1 | なし |
| GetWeek | 34 | 2 | 6 | 3 | 3 | 1 | なし |
| HandwrittenSignature | 34 | 2 | 7 | 5 | 3 | 1 | なし |
| InputHintSetting | 38 | 2 | 10 | 3 | 3 | 1 | BUG-016; BUG-006 |
| KeywordLookup | 34 | 2 | 10 | 3 | 3 | 1 | なし |
| LookupLinkage | 38 | 2 | 11 | 6 | 3 | 1 | BUG-004; BUG-005 |
| PeriodBulkUpdate | 38 | 2 | 10 | 5 | 4 | 1 | BUG-024 |
| RecordLimit | 34 | 2 | 7 | 0 | 3 | 1 | なし |
| RecordRockb | 38 | 2 | 12 | 9 | 3 | 1 | BUG-025 |
| RetirementConversion | 38 | 2 | 2 | 7 | 3 | 1 | BUG-014; BUG-019 |
| StringConcatenation | 38 | 2 | 6 | 3 | 3 | 1 | BUG-021 |
| SubTableAutosorte | 38 | 2 | 9 | 10 | 3 | 1 | BUG-008 |
| SubTableUserLimit | 38 | 2 | 12 | 0 | 3 | 1 | BUG-028 |
| SubtableCopy | 34 | 2 | 6 | 9 | 3 | 1 | なし |
| SubtableMaxValue | 34 | 2 | 14 | 3 | 3 | 1 | なし |
| TabDisplay | 39 | 2 | 12 | 3 | 3 | 1 | BUG-007; BUG-013 |
| TimeCalculation | 34 | 2 | 10 | 3 | 3 | 1 | なし |
| UserSelectStringAssignment | 34 | 2 | 8 | 3 | 3 | 1 | なし |
| appList | 39 | 2 | 2 | 2 | 3 | 1 | BUG-026 |

## Critical一覧

| ID | プラグイン | 内容 | ファイル |
|---|---|---|---|
| なし | なし | なし | なし |

## High一覧

| ID | プラグイン | 内容 | ファイル |
|---|---|---|---|
| なし | なし | なし | なし |

## 修正優先順位

1. REST API呼び出しで近傍にcatchまたはtry-catchが確認できない箇所を、設定画面・保存処理・一括更新処理から優先して確認する。
2. 添付ファイルを扱う `CrossAppRecordSync` のPC/モバイル処理で、添付なしレコードの挙動を確認する。
3. 実行画面でDOM取得結果を直接操作している箇所について、対象画面・権限・モバイル差異で要素が存在しないケースを確認する。
4. CSSの `!important` と実行される `console.log` は、配布前の保守性確認として必要性を整理する。

## 今後の対応方針

- 今回はBUG.mdへ直接追記せず、`bug-management/potential-bug-list.csv` を次フェーズの入力として扱う。
- 各行は静的解析による潜在リスクのため、修正前に対象関数・再現条件・実機またはPlaywrightでの確認を行う。
- 既存BUG.mdと関連が推定できるものはCSVの `関連BUG.md` に記録した。

## 未確認事項

- kintone実機、REST API実通信、Playwrightによる画面操作は未実施。
- 権限不足時の実レスポンス、モバイル実画面、フィールド削除後の挙動は未確認。
- REST APIエラー処理は近傍コードによる静的判定のため、呼び出し元で一括catchしている場合は追加確認が必要。
