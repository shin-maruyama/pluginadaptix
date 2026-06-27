# appList バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-026: No.1 2026-24-06 BUG-026 設定保存後にconsole.logが残っている（重大度: Low、対象: plugins/appList/appList/contents/js/config.js:1199）

## 2. 解析対象ファイル一覧

- plugins/appList/BUG.md
- plugins/appList/Manual.md
- plugins/appList/appList/PUBKEY
- plugins/appList/appList/SIGNATURE
- plugins/appList/appList/contents/README.md
- plugins/appList/appList/contents/css/51-modern-default.css
- plugins/appList/appList/contents/css/config.css
- plugins/appList/appList/contents/css/desktop.css
- plugins/appList/appList/contents/css/mobile.css
- plugins/appList/appList/contents/html/config.html
- plugins/appList/appList/contents/image/icon.jpg
- plugins/appList/appList/contents/js/certification.js
- plugins/appList/appList/contents/js/config.js
- plugins/appList/appList/contents/js/desktop.js
- plugins/appList/appList/contents/js/mobile.js
- plugins/appList/appList/contents/manifest.json
- plugins/appList/appListe/PUBKEY
- plugins/appList/appListe/SIGNATURE
- plugins/appList/appListe/contents/css/51-modern-default.css
- plugins/appList/appListe/contents/css/config.css
- plugins/appList/appListe/contents/css/desktop.css
- plugins/appList/appListe/contents/css/mobile.css
- plugins/appList/appListe/contents/html/config.html
- plugins/appList/appListe/contents/image/icon.jpg
- plugins/appList/appListe/contents/js/certification.obfuscated.js
- plugins/appList/appListe/contents/js/config.obfuscated.js
- plugins/appList/appListe/contents/js/desktop.obfuscated.js
- plugins/appList/appListe/contents/js/mobile.obfuscated.js
- plugins/appList/appListe/contents/manifest.json
- plugins/appList/codex/handover-2026-06-23.md
- plugins/appList/codex/next-tasks.md
- plugins/appList/codex/test-plan.md
- plugins/appList/codex/troubleshooting.md
- plugins/appList/codex/work-instructions.md
- plugins/appList/decisions/README.md
- plugins/appList/specification.md

## 3. manifest.json解析

- ファイル: plugins/appList/appList/contents/manifest.json
- name: アプリ一覧プラグイン（カスタム版）
- version: 1.0.27
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/jqueryui/1.12.1/jquery-ui.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/mobile.css
- icon: image/icon.jpg

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/appList/appList
- 難読化版場所: plugins/appList/appListe（参考扱い）
- plugins/appList/appList/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/appList/appList/contents/js/config.js: events=0, api=2, dom=103, config=4, subtable=0, console=1
- plugins/appList/appList/contents/js/desktop.js: events=1, api=0, dom=1, config=2, subtable=0, console=0
- plugins/appList/appList/contents/js/mobile.js: events=1, api=0, dom=1, config=2, subtable=0, console=0

## 5. HTML解析

- plugins/appList/appList/contents/html/config.html

## 6. CSS解析

- plugins/appList/appList/contents/css/51-modern-default.css
- plugins/appList/appList/contents/css/config.css
- plugins/appList/appList/contents/css/desktop.css
- plugins/appList/appList/contents/css/mobile.css

## 7. 設定値解析

- plugins/appList/appList/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/appList/appList/contents/js/config.js:15: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/appList/appList/contents/js/config.js:198: return JSON.parse(value);
- plugins/appList/appList/contents/js/config.js:1165: element: JSON.stringify(element),
- plugins/appList/appList/contents/js/config.js:1196: kintone.plugin.app.setConfig(saveConfig);
- plugins/appList/appList/contents/js/desktop.js:11: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/appList/appList/contents/js/desktop.js:15: return JSON.parse(value);
- plugins/appList/appList/contents/js/mobile.js:11: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/appList/appList/contents/js/mobile.js:15: return JSON.parse(value);

## 8. kintoneイベント解析

- app.record.index.show
- mobile.app.record.index.show

## 9. kintone REST API解析

- plugins/appList/appList/contents/js/config.js:475: return kintone.api(kintone.api.url('/k/v1/apps'), 'GET', params).then((resp) => {
- plugins/appList/appList/contents/js/config.js:1086: return kintone.api(kintone.api.url('/k/v1/preview/app/views', true), 'PUT', body2);

## 10. DOM操作解析

- plugins/appList/appList/contents/js/config.js:113: const colorSelect = category.querySelector('[data-role="category-color-select"]');
- plugins/appList/appList/contents/js/config.js:114: const colorInput = category.querySelector('[data-role="category-color"]');
- plugins/appList/appList/contents/js/config.js:188: title: normalizePortalFontSize(document.getElementById('portal-title-font-size-select').value, PORTAL_TITLE_FONT_SIZES, DEFAULT_PORTAL_TITLE_FONT_SIZE),
- plugins/appList/appList/contents/js/config.js:189: description: normalizePortalFontSize(document.getElementById('portal-description-font-size-select').value, PORTAL_DESCRIPTION_FONT_SIZES, DEFAULT_PORTAL_DESCRIP
- plugins/appList/appList/contents/js/config.js:190: app: normalizePortalFontSize(document.getElementById('portal-app-font-size-select').value, PORTAL_APP_FONT_SIZES, DEFAULT_PORTAL_APP_FONT_SIZE),
- plugins/appList/appList/contents/js/config.js:191: subcategory: normalizePortalFontSize(document.getElementById('portal-subcategory-font-size-select').value, PORTAL_SUBCATEGORY_FONT_SIZES, DEFAULT_PORTAL_SUBCATE
- plugins/appList/appList/contents/js/config.js:209: const colorSelect = document.getElementById('color-select');
- plugins/appList/appList/contents/js/config.js:218: const colorMode = category.querySelector('[data-role="category-color-mode"]');
- plugins/appList/appList/contents/js/config.js:219: const colorSelect = category.querySelector('[data-role="category-color-select"]');
- plugins/appList/appList/contents/js/config.js:220: const colorInput = category.querySelector('[data-role="category-color"]');
- plugins/appList/appList/contents/js/config.js:221: const colorPreview = category.querySelector('[data-role="category-color-preview"]');
- plugins/appList/appList/contents/js/config.js:222: const colorPalette = category.querySelector('[data-role="category-color-palette"]');
- plugins/appList/appList/contents/js/config.js:233: category.querySelectorAll('[data-role="category-color-preset"]').forEach((swatch) => {
- plugins/appList/appList/contents/js/config.js:243: document.querySelectorAll('.category').forEach((category) => {
- plugins/appList/appList/contents/js/config.js:250: const categoryNameInput = category.querySelector('[data-role="category-name"]');
- plugins/appList/appList/contents/js/config.js:251: const categoryDescriptionInput = category.querySelector('[data-role="category-description"]');
- plugins/appList/appList/contents/js/config.js:252: const subCategoryCheck = category.querySelector('[data-role="subcategory-check"]');
- plugins/appList/appList/contents/js/config.js:253: const colorMode = category.querySelector('[data-role="category-color-mode"]');
- plugins/appList/appList/contents/js/config.js:254: const colorSelect = category.querySelector('[data-role="category-color-select"]');
- plugins/appList/appList/contents/js/config.js:255: const colorInput = category.querySelector('[data-role="category-color"]');
- plugins/appList/appList/contents/js/config.js:256: const frameStyleSelect = category.querySelector('[data-role="category-frame-style"]');
- plugins/appList/appList/contents/js/config.js:257: const buttonStyleSelect = category.querySelector('[data-role="category-button-style"]');
- plugins/appList/appList/contents/js/config.js:258: const iconSelect = category.querySelector('[data-role="category-icon"]');
- plugins/appList/appList/contents/js/config.js:277: const appSelect = row.querySelector('[data-role="app-name"]');
- plugins/appList/appList/contents/js/config.js:278: const appIconSelect = row.querySelector('[data-role="app-icon"]');
- plugins/appList/appList/contents/js/config.js:334: const categoryNameInput = category.querySelector('[data-role="category-name"]');
- plugins/appList/appList/contents/js/config.js:335: const categoryDescriptionInput = category.querySelector('[data-role="category-description"]');
- plugins/appList/appList/contents/js/config.js:336: const subCategoryCheckInput = category.querySelector('[data-role="subcategory-check"]');
- plugins/appList/appList/contents/js/config.js:337: const colorMode = category.querySelector('[data-role="category-color-mode"]');
- plugins/appList/appList/contents/js/config.js:338: const categoryIconSelect = category.querySelector('[data-role="category-icon"]');
- plugins/appList/appList/contents/js/config.js:339: const appRows = category.querySelectorAll('.select-class');
- plugins/appList/appList/contents/js/config.js:343: const appSelect = row.querySelector('[data-role="app-name"]');
- plugins/appList/appList/contents/js/config.js:344: const appIconSelect = row.querySelector('[data-role="app-icon"]');
- plugins/appList/appList/contents/js/config.js:393: const portalRadio = document.getElementById('radio-2');
- plugins/appList/appList/contents/js/config.js:404: const columnCount = normalizePortalColumnCount(document.getElementById('portal-column-count-select').value);
- plugins/appList/appList/contents/js/config.js:405: const descriptionLines = normalizePortalDescriptionLines(document.getElementById('portal-description-lines-select').value);
- plugins/appList/appList/contents/js/config.js:417: const categories = Array.from(document.querySelectorAll('.category')).map(readPortalPreviewCategory);
- plugins/appList/appList/contents/js/config.js:713: const mainTbody = document.querySelectorAll(".category")
- plugins/appList/appList/contents/js/config.js:716: const appName = x.querySelectorAll('[data-role="app-name"]')
- plugins/appList/appList/contents/js/config.js:829: const colorInput = category.querySelector('[data-role="category-color"]');
- plugins/appList/appList/contents/js/config.js:839: const colorMode = category.querySelector('[data-role="category-color-mode"]');
- plugins/appList/appList/contents/js/config.js:840: const colorSelect = category.querySelector('[data-role="category-color-select"]');
- plugins/appList/appList/contents/js/config.js:849: const colorMode = category.querySelector('[data-role="category-color-mode"]');
- plugins/appList/appList/contents/js/config.js:850: const colorSelect = category.querySelector('[data-role="category-color-select"]');
- plugins/appList/appList/contents/js/config.js:851: const colorInput = category.querySelector('[data-role="category-color"]');
- plugins/appList/appList/contents/js/config.js:862: document.querySelectorAll('.category').forEach((category) => {
- plugins/appList/appList/contents/js/config.js:863: const colorMode = category.querySelector('[data-role="category-color-mode"]');
- plugins/appList/appList/contents/js/config.js:864: const colorSelect = category.querySelector('[data-role="category-color-select"]');
- plugins/appList/appList/contents/js/config.js:865: const colorInput = category.querySelector('[data-role="category-color"]');
- plugins/appList/appList/contents/js/config.js:901: let select = document.querySelector('[data-role="app-name"]');
- plugins/appList/appList/contents/js/config.js:903: let nonoption = document.createElement('option');
- plugins/appList/appList/contents/js/config.js:910: let option = document.createElement('option');
- plugins/appList/appList/contents/js/config.js:951: document.getElementById('tree-name-input').value = treeName; //ツリー名の値保存
- plugins/appList/appList/contents/js/config.js:952: document.getElementById('color-select').value = menuColor; //色選択ドロップダウンの値保存
- plugins/appList/appList/contents/js/config.js:953: document.getElementById('color-select-tree').value = treeColor; //ツリーの色選択ドロップダウンの値保存
- plugins/appList/appList/contents/js/config.js:954: document.getElementById('size-select').value = appSize; //アプリ表示名大きさの値保存
- plugins/appList/appList/contents/js/config.js:955: document.getElementById('size-select-mobile').value = appSizeMobile; //アプリ表示名大きさの値（モバイル版）保存
- plugins/appList/appList/contents/js/config.js:956: document.getElementById('design-theme-select').value = designTheme;
- plugins/appList/appList/contents/js/config.js:957: document.getElementById('frame-style-select').value = frameStyle;
- plugins/appList/appList/contents/js/config.js:958: document.getElementById('button-style-select').value = buttonStyle;
- plugins/appList/appList/contents/js/config.js:959: document.getElementById('portal-column-count-select').value = portalColumnCount;
- plugins/appList/appList/contents/js/config.js:960: document.getElementById('portal-mobile-column-count-select').value = portalMobileColumnCount;
- plugins/appList/appList/contents/js/config.js:961: document.getElementById('portal-description-lines-select').value = portalDescriptionLines;
- plugins/appList/appList/contents/js/config.js:962: document.getElementById('portal-title-font-size-select').value = portalFontSizes.title;
- plugins/appList/appList/contents/js/config.js:963: document.getElementById('portal-description-font-size-select').value = portalFontSizes.description;
- plugins/appList/appList/contents/js/config.js:964: document.getElementById('portal-app-font-size-select').value = portalFontSizes.app;
- plugins/appList/appList/contents/js/config.js:965: document.getElementById('portal-subcategory-font-size-select').value = portalFontSizes.subcategory;
- plugins/appList/appList/contents/js/config.js:975: const table = document.getElementById('table');
- plugins/appList/appList/contents/js/config.js:979: applyAppConfig(clone.querySelector('.select-class'), elements[i]['apps'][0]);
- plugins/appList/appList/contents/js/config.js:983: let tbody = clone.querySelector('.select-tbody');
- plugins/appList/appList/contents/js/config.js:993: const categories = document.querySelectorAll('.category');
- plugins/appList/appList/contents/js/config.js:995: applyAppConfig(categories[0].querySelector('.select-class'), elements[0]['apps'][0]);
- plugins/appList/appList/contents/js/config.js:998: let tbody = categories[0].querySelector('.select-tbody');
- plugins/appList/appList/contents/js/config.js:1042: document.getElementById('design-theme-select').value = DEFAULT_DESIGN_THEME;
- plugins/appList/appList/contents/js/config.js:1043: document.getElementById('frame-style-select').value = DEFAULT_CATEGORY_FRAME_STYLE;
- plugins/appList/appList/contents/js/config.js:1044: document.getElementById('button-style-select').value = DEFAULT_BUTTON_STYLE;
- plugins/appList/appList/contents/js/config.js:1045: document.getElementById('portal-column-count-select').value = DEFAULT_PORTAL_COLUMN_COUNT;
- plugins/appList/appList/contents/js/config.js:1046: document.getElementById('portal-mobile-column-count-select').value = DEFAULT_PORTAL_MOBILE_COLUMN_COUNT;
- plugins/appList/appList/contents/js/config.js:1047: document.getElementById('portal-description-lines-select').value = DEFAULT_PORTAL_DESCRIPTION_LINES;
- plugins/appList/appList/contents/js/config.js:1048: document.getElementById('portal-title-font-size-select').value = DEFAULT_PORTAL_TITLE_FONT_SIZE;
- ほか 25件は同種のDOM処理として確認済み

## 11. サブテーブル関連解析

- 該当処理は確認できなかった

## 12. 添付ファイル関連解析

- 該当処理は確認できなかった

## 13. 権限関連解析

- plugins/appList/appList/contents/js/config.js:1201: if (error.match(/権限がありません/)) {
- plugins/appList/appList/contents/js/config.js:1202: displayAlert('エラー', '[エラー内容] <br> kintoneシステム管理者権限が無効なユーザーです。<br> [対処方法] <br> kintoneシステム管理者権限が有効なユーザーで実施してください。', 'error', 'OK')

## 14. 各バグとの関連性

### BUG ID: BUG-026

#### 該当する可能性が高いファイル

- plugins/appList/appList/contents/js/config.js

#### 該当する可能性が高い関数

- createNewOption（708行付近）

#### 関連するkintoneイベント

- 該当処理は確認できなかった

#### 関連する設定値

- plugins/appList/appList/contents/js/config.js:15: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/appList/appList/contents/js/config.js:198: return JSON.parse(value);
- plugins/appList/appList/contents/js/config.js:1165: element: JSON.stringify(element),
- plugins/appList/appList/contents/js/config.js:1196: kintone.plugin.app.setConfig(saveConfig);

#### 関連するAPI

- plugins/appList/appList/contents/js/config.js:475: return kintone.api(kintone.api.url('/k/v1/apps'), 'GET', params).then((resp) => {
- plugins/appList/appList/contents/js/config.js:1086: return kintone.api(kintone.api.url('/k/v1/preview/app/views', true), 'PUT', body2);

#### 原因候補

- コード上で確認済み: 設定保存処理付近にデバッグログが残っている。
- コード上で確認済み: console出力が対象行に残っている。

#### 影響範囲

- コード上で確認済み: 機能影響は小さいが、運用時のコンソールノイズになる。
- 画面影響: 未確認

#### 修正時の注意点

- 修正フェーズで削除する。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
1195:           if(errMesseage != ""){displayAlert('エラー', errMesseage, 'error', 'OK');return;}
1196:           kintone.plugin.app.setConfig(saveConfig);
1197:         })
1198:         .catch((resp) => {
1199:           console.log(resp)
1200:           var error = resp.message;
1201:           if (error.match(/権限がありません/)) {
1202:             displayAlert('エラー', '[エラー内容] <br> kintoneシステム管理者権限が無効なユーザーです。<br> [対処方法] <br> kintoneシステム管理者権限が有効なユーザーで実施してください。', 'error', 'OK')
1203:           } else {
1204:             displayAlert('エラー','[エラー内容] <br> アプリ設定項目に未指定の項目があるか、 内部エラーが発生しました。 <br> [対処方法] <br> アプリの指定を見直してください。解決しない場合はサポートに問い合わせてください。', 'error', 'OK')
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
