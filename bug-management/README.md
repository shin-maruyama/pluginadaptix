# バグ管理CSV

## 最新CSV

```text
bug-management-list.csv
```

## 履歴CSV

```text
archive/
```

## 運用ルール

* 最新版は `bug-management/bug-management-list.csv` に保存する
* 履歴は `bug-management/archive/bug-management-list-YYYY-MM-DD.csv` に保存する
* CSV更新後は各プラグインの `BUG.md` と整合性確認を行う
* 確認結果は `bug-management/check-result.md` に保存する

## CSV文字コードルール

CSVは日本語を含むため、Excelで開いても文字化けしない形式で保存します。

- 文字コード: UTF-8 with BOM
- 改行コード: CRLF
- 区切り文字: カンマ
- 全セルをダブルクォートで囲む

CodexでCSVを作成・更新する場合は、必ずBOM付きUTF-8で保存してください。
