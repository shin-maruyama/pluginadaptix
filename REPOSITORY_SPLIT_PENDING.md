# リポジトリ分割保留一覧

| ファイルパス | 判断できない理由 | 想定される分類先 | 確認が必要な内容 |
|---|---|---|---|
| `_repository_split_pending/os-generated/**/.DS_Store` | OS生成ファイルであり開発目的に属さない | 移管対象外 | 独立リポジトリ作成前に削除してよいか |

## 解決済み

`_repository_split_pending/plugins/TAB表示/TabDisplay.ppk` は、難読化版 `TabDisplaye` に対応する秘密鍵と確認した。`TabDisplaye` は顧客および本番環境へ未配布であり、秘密鍵は2026-07-16にGit indexから除去してローカルファイルも削除した。秘密鍵の内容は調査・報告へ転記していない。

Git全履歴とリモートからの除去は2026-07-16に完了した。詳細は `SECURITY_KEY_REMEDIATION.md` を参照すること。保留領域は独立リポジトリへコピーしないこと。
