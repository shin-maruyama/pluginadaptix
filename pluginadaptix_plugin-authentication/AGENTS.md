# AGENTS.md

> 分割元: ルート `AGENTS.md` の認証システム設計・実装規約。

- 実装前に `docs/openapi.yaml`、`docs/05_table_definition.md`、`docs/er-diagram.md` を確認する。
- 仕様優先順位はOpenAPI、テーブル定義、ER図、API詳細設計、ソースコードとする。
- TypeScriptはstrict、`any` 禁止、export関数は戻り値型を明記する。
- Controllerは入出力と検証、Serviceは業務ロジック、Repositoryはkintoneアクセスを担当する。
- レスポンスは `{ success, code, message, data? }` 形式とし、共通エラーコードを使う。
- kintoneレコード番号を業務キーにせず、設計済みIDとフィールドコードを使う。
- APIキー、秘密鍵、トークン、Cookieを保存せず、ライセンスキーをログへ平文出力しない。
- 変更時は正常系、バリデーション、認証、NotFound、期限切れを含むテストを追加し、lint、typecheck、test、buildを実行する。
