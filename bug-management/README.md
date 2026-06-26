# バグ管理CSV

## 目的

このフォルダは、kintoneプラグイン調査で見つかったバグ一覧CSVを管理するためのフォルダです。

## 最新CSV

最新版は以下です。

```text
bug-management-list.csv
```

## 履歴CSV

過去分は以下に保存します。

```text
archive/
```

## CSV列

CSVには以下の列を含めます。

```text
ID
プラグイン
重大度
確度
分類
不具合内容
ファイル
行
影響
詳細
推奨対応
ステータス
```

## 運用ルール

* 最新版は `bug-management-list.csv` として保存する
* 履歴は `archive/bug-management-list-YYYY-MM-DD.csv` として保存する
* Codexでバグ調査・修正を行う場合は、まずこのCSVを確認する
* CSVの内容をもとに各プラグインの `BUG.md` を更新する
