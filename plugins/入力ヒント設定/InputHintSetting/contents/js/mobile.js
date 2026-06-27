// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
    'use strict';
  function handleKintoneApiError(error) {
    const message = error && error.message ? error.message : 'kintone REST APIの呼び出しに失敗しました。';
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'error',
        title: 'エラー',
        text: message
      });
    } else if (typeof alert === 'function') {
      alert(message);
    }
    throw error;
  }

  function callKintoneApi(...args) {
    return kintone.api.apply(kintone, args).catch(handleKintoneApiError);
  }


    const obj = {
        config: kintone.plugin.app.getConfig(PLUGIN_ID),
        events: {
            show: ['mobile.app.record.create.show', 'mobile.app.record.edit.show'],
            indexShow: ['mobile.app.record.index.show'],
        },

        init: async function (e) {
            if (!(await KNTP433610certification())) return e;
            if (!Object.keys(obj.config).length) return e;

            obj.jsonParse();

            for (const setting of obj.config.settings) {
                /*** [フィールド存在チェック]*/
                if (obj.existenceCheck(setting, e)) continue;

                /*** [フィールドにヒントを設定する処理]*/
                //[レコード追加・編集画面表示時]
                obj.tipSetting(setting, e);
                //[テーブル行追加時]
                obj.tableChangeEventCreate(e);
            }
            return e;
        },

        jsonParse: function () {
            try {
                obj.config.settings = JSON.parse(obj.config.settings);
            } catch (ignore) { }
        },

        /**
         * [指定したフィールドが存在するか確認]
         * @param {object} setting [プラグイン設定]
         * @param {object} record  [イベント実行時のフォーム情報]
         * @returns [存在しない場合true 存在する場合false]
         */
        existenceCheck: function (setting, { record }) {
          
            const settingTipSettingFieldCodeSplit = setting.tipSettingField.code.split('　')
            const settingTipSettingFieldCodeName = settingTipSettingFieldCodeSplit.length === 1 ? settingTipSettingFieldCodeSplit[0] : settingTipSettingFieldCodeSplit[1]
            let tableCode = '';
            if (settingTipSettingFieldCodeSplit.length !== 1){
              tableCode = settingTipSettingFieldCodeSplit[0];
              if (!record[tableCode]) {tableCode = ''};
            }
      
            if (tableCode == '') {
              const tipSettingField = record[settingTipSettingFieldCodeName];
              if (!tipSettingField) return true;
              return false;
            } else {
            const tableField = record[tableCode];
            const field = settingTipSettingFieldCodeName;
              if (!tableField.value || !tableField.value.length) return true;
              const tipSettingField = tableField.value[0].value[field];
              if (!tipSettingField) return true;
              return false;
            }
        },

        tableChangeEventCreate: function (event) {
            //[テーブル内フィールドを使用している設定のみに絞り込む]
            const settingsUsingTable = obj.config.settings.filter(
                (setting) => setting.tipSettingField.code.split('　').length === 2
            );

            for (const setting of settingsUsingTable) {
                const tableCode = setting.tipSettingField.code.split('　')[0];
                if (event.record[tableCode]) {
                    kintone.events.on(
                        [`mobile.app.record.create.change.${tableCode}`, `mobile.app.record.edit.change.${tableCode}`],
                        function (e) {
                            obj.tipSetting(setting, e);
                            return e;
                        }
                    );
                }
            }
        },

        tipSetting: function (setting, e) {
            const tipSettingFieldCodeSplit = setting.tipSettingField.code.split('　')
      const tipSettingFieldIdSplit = setting.tipSettingField.id.split('　')
      const tipSettingFieldIdNumber = tipSettingFieldIdSplit.length === 1 ? tipSettingFieldIdSplit[0] : tipSettingFieldIdSplit[1]
      let tableCode = '';
      if (tipSettingFieldCodeSplit.length !== 1) {
        tableCode = tipSettingFieldCodeSplit[0];
        if (!e.record[tableCode]) tableCode = '';
      }

        //[テーブル外フィールドの場合]
        if (tableCode == '') {
            tippy(`.field-${tipSettingFieldIdNumber}`, {
                content: setting.tipString,
            });
            //[テーブル内フィールドの場合]
        } else {
            for (const row of document.querySelectorAll(`.subtable-${setting.tipSettingField.id.split('　')[0]} .subtable-row-gaia`)) {
                tippy(row.querySelector(`.value-${setting.tipSettingField.id.split('　')[1]}`), {
                    content: setting.tipString,
                });
            }
        }
        },

        checkFields: async function () {

            if (!Object.keys(obj.config).length) return;

            obj.jsonParse();
            const fieldList = await obj.getFieldList();
            if (!fieldList || !fieldList.length) return false;
            if (!obj.config.settings || !obj.config.settings.length) return false;

            const missingFields = [];

            for (const setting of obj.config.settings) {
                if (setting.tipSettingField.code && setting.tipSettingField.code !== '') {
                    const result = fieldList.find((x) => x.code === setting.tipSettingField.code);
                    if (!result) {
                        missingFields.push(`[ヒント設定フィールド] ${setting.tipSettingField.code}`);
                    }
                }
            }

            const uniqueMissingFields = [...new Set(missingFields)];

            if (uniqueMissingFields.length > 0) {
                const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
                const fieldHtml = uniqueMissingFields
                    .map((code) => `・${code}`)
                    .join('<br>');

                obj.displayAlert(
                    '警告',
                    '「入力ヒント設定プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
                    '対象フィールドコード：<br>' +
                    fieldHtml +
                    '<br><br>プラグイン設定を修正してください。',
                    imageUrl,
                    'OK'
                );
            }
        },

        displayAlert: function (title, text, type, button) {
            swal.fire({
                title: title,
                html: text,
                imageUrl: type,
                confirmButtonText: button,
                customClass: {
                    popup: 'my-popup-class',
                }
            });
        },

        getFieldList: async function () {
            const fieldList = [];
            const fieldList2 = [
                ...Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList),
                ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
            ];
            try {
                const resp = await callKintoneApi(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
                    app: kintone.mobile.app.getId(),
                });
                resp.layout.forEach((row) => {
                    if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push(field));
                    else if (row.type === 'SUBTABLE') {
                        fieldList.push(row);
                        //if (!subTable) return;
                        row.fields.forEach((field) => {
                            const fieldInfo = {
                                type: field.type,
                                code: `${row.code}　${field.code}`,
                                id: `${fieldList2.find((x) => x.var === row.code).id}　${Object.values(fieldList2.find((x) => x.var === row.code).fieldList).find((y) => y.var === field.code).id
                                    }`,
                            };
                            fieldList.push(fieldInfo);
                        });
                    } else if (row.type === 'GROUP') {
                        fieldList.push(row);
                        row.layout.forEach((childRow) => childRow.fields.forEach((field) => {
                            fieldList.push({
                                type: field.type,
                                code: row.code + '　' + field.code,
                                id: field.id,
                                properties: field.properties,
                            })
                        }
                        ));
                    }
                });

                fieldList.forEach((field) => {
                    if (field.code.split('　').length === 2 && field.type !== 'SUBTABLE') {
                        var code = field.code.split('　')[1];
                    } else {
                        var code = field.code;
                    }
                    const target = fieldList2.find((x) => x.var === code);
                    if (!target) return;
                    field.id = target.id;
                    field.properties = target.properties;
                    field.label = target.label;

                    if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
                    field.fields.forEach((inField) => {
                        const inTarget = Object.values(target.fieldList).find((x) => x.var === inField.code);
                        inField.id = inTarget.id;
                        inField.properties = inTarget.properties;
                        inField.label = inTarget.label;
                    });
                });
            } catch (ignore) {

            }
            return fieldList;
        },
    };

    kintone.events.on(obj.events.show, obj.init);
    kintone.events.on(obj.events.indexShow, obj.checkFields);

})(jQuery, kintone.$PLUGIN_ID);
