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


  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  let select = [];
  try {
    select = config.elementArray ? JSON.parse(config.elementArray) : [];
  } catch (error) {
    select = [];
  }

  kintone.events.on(
    ['mobile.app.record.create.show', 'mobile.app.record.edit.show', 'mobile.app.record.detail.show'],
    async function (event) {
      if (!(await KNTP932510certification())) return event;
      if (!select || !select.length) return event;

      select.forEach((val) => {
        if (!val) return event;

        if (val.split(' ').length === 1) {
          //[グループまたはテーブル内フィールドではない場合]
          kintone.mobile.app.record.setFieldShown(val, false);
        } else {
          //[テーブル内、グループ内フィールドの場合]
          const fieldName = val.split(' ')[1];
          if (!fieldName) return event;

          kintone.mobile.app.record.setFieldShown(fieldName, false);
        }
      });

      return event;
    }
  );

  /******************************************
   * [一覧画面表示時の設定済みフィールド存在チェック]
   * - フィールド削除・フィールドコード変更を検知
   * - 一覧表示時に毎回警告表示
   * - 対象フィールドコード一覧を表示
   ******************************************/
  kintone.events.on('mobile.app.record.index.show', async function () {

    if (!(await KNTP932510certification())) return;
    if (!select || !select.length) return;

    const filteredFieldList = await getFields();

    if (!filteredFieldList) return;

    // 不存在フィールド格納
    const missingFields = [];

    // 設定済みフィールド存在チェック
    for (let i = 0; i < select.length; i++) {

      if (select[i] !== 'none') {

        const exists = filteredFieldList.some(
          field => field.fieldName === select[i]
        );

        if (!exists) {
          missingFields.push(`[非表示対象] ${select[i]}`);
        }
      }
    }

    // 重複除去
    const uniqueMissingFields = [...new Set(missingFields)];

    // 不存在フィールドがある場合のみ警告表示
    if (uniqueMissingFields.length > 0) {

      const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';

      const fieldHtml = uniqueMissingFields
        .map((code) => `・${code}`)
        .join('<br>');

      displayAlert(
        '警告',
        '「非表示プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        imageUrl,
        'OK'
      );
    }

  });


  async function getFields() {

    const fieldList = [];

    try {

      const resp = await callKintoneApi(
        kintone.api.url('/k/v1/app/form/layout.json', true),
        'GET',
        {
          app: kintone.mobile.app.getId(),
        }
      );

      resp.layout.forEach((row) => {

        if (row.type === 'ROW') {
          row.fields.forEach((field) => fieldList.push(field));

        } else if (row.type === 'SUBTABLE') {

          fieldList.push(row);

        } else if (row.type === 'GROUP') {

          fieldList.push(row);

        }

      });

      let fieldList2 = Object.values(
        cybozu.data.page.FORM_DATA.schema.table.fieldList
      );

      fieldList2 = [
        ...fieldList2,
        ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)
      ];

      fieldList.forEach((field) => {

        const target = fieldList2.find((x) => x.var === field.code);

        if (!target) return;

        field.id = target.id;
        field.properties = target.properties;
        field.label = target.label;

        if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;

        field.fields.forEach((inField) => {

          const inTarget = Object.values(target.fieldList)
            .find((x) => x.var === inField.code);

          inField.id = inTarget.id;
          inField.properties = inTarget.properties;
          inField.label = inTarget.label;

        });

      });

    } catch(error) {

      console.log(error);

    }

    let filteredFieldList = [];

    fieldList.forEach((row) => {

      if (row.type === 'GROUP') {

        filteredFieldList.push({
          fieldName: row.code
        });

        row.layout.forEach((childRow) => {

          childRow.fields.forEach((field) => {

            filteredFieldList.push({
              fieldName:
                (row.code ? row.code : row.label) + ' ' + field.code
            });

          });

        });

      } else if (row.type === 'SUBTABLE') {

        filteredFieldList.push({
          fieldName: row.code
        });

        row.fields.forEach((subField) => {

          filteredFieldList.push({
            fieldName:
              (row.code ? row.code : row.label) + ' ' + subField.code
          });

        });

      } else {

        filteredFieldList.push({
          fieldName: row.code
        });

      }

    });

    return filteredFieldList;
  }

  function displayAlert(title, text, type, button) {

    swal.fire({
      title: title,
      html: text,
      imageUrl: type,
      confirmButtonText: button,
      customClass: {
        popup: 'my-popup-class',
      }
    });

  };

})(jQuery, kintone.$PLUGIN_ID);
