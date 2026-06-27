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


  if (!(await KNTP283810certification())) {
    return;
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  try {
    if (Object.keys(config).length) {
      config.settings = JSON.parse(config.settings);
    }
    // console.log(config);
  } catch (ignore) { }

  const obj = {
    events1: {},
    events2: {},
    func: {},
  };

  obj.events1.type = [];
  if (config.settings && config.settings.length) {
    for (const setting of config.settings) {
      const s = setting.source.split('　');
      const field = s.length > 1 ? s[1] : s[0];
      obj.events1.type.push('mobile.app.record.edit.change.' + field);
      obj.events1.type.push('mobile.app.record.create.change.' + field);
      obj.events1.type.push('mobile.app.record.index.edit.change.' + field);
    }
  }

  obj.events2.type = ['mobile.app.record.index.show'];

  obj.events1.handler = function (e) {
    // if (!Object.keys(config).length) return e;
    // obj.func.jsonParse();

    for (const setting of config.settings) {
      // フィールド名の分割
      const sourceSplit = setting.source.split('　');
      const sourceName = sourceSplit.length === 1 ? sourceSplit[0] : sourceSplit[1];
      const destinationSplit = setting.destination.split('　');
      const destinationName = destinationSplit.length === 1 ? destinationSplit[0] : destinationSplit[1];
      let tableCode = '';
      if (destinationSplit.length !== 1) {
        tableCode = destinationSplit[0];
        if (!e.record[tableCode]) tableCode = '';
      }

      //[フィールド存在チェック]
      if (obj.func.existenceCheck(tableCode, sourceName, destinationName, e)) continue;

      //[テーブル外フィールド]
      if (tableCode == '') {
        const sourceField = e.record[sourceName];
        const destinationField = e.record[destinationName];

        if (sourceField.value.length) {
          const sourceFieldValueMap = sourceField.value.map((x) => x['name']);
          destinationField.value = sourceFieldValueMap.join(setting.delimiter);
        }

      //[テーブル内フィールド]
      } else {
        for (const row of e.record[tableCode].value) {
          const sourceField = row.value[sourceName];
          const destinationField = row.value[destinationName];

          if (sourceField.value.length) {
            const sourceFieldValueMap = sourceField.value.map((x) => x['name']);
            destinationField.value = sourceFieldValueMap.join(setting.delimiter);
          }
        }
      }
    }
    return e;
  };

  obj.events2.handler = async function (e) {
    if (!config.settings || !config.settings.length) return e;

    const fieldList = await obj.func.getFieldList();
    if (!fieldList || fieldList.length === 0) return e;

    const missingFields = [];

    for (const setting of config.settings) {
      if (setting.destination && setting.destination !== 'none') {
        const exists = fieldList.some(field => field.code === setting.destination);
        if (!exists) {
          missingFields.push(`[反映先フィールド] ${setting.destination}`);
        }
      }

      if (setting.source && setting.source !== 'none') {
        const exists = fieldList.some(field => field.code === setting.source);
        if (!exists) {
          missingFields.push(`[反映元フィールド] ${setting.source}`);
        }
      }
    }

    const uniqueMissingFields = [...new Set(missingFields)];

    if (uniqueMissingFields.length > 0) {
      const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
      const fieldHtml = uniqueMissingFields
        .map(code => `・${code}`)
        .join('<br>');

      obj.func.displayAlert(
        '警告',
        '「ユーザー選択→文字列1行代入プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        imageUrl,
        'OK'
      );
    }

    return e;
  };

  // obj.func.jsonParse = function () {
  //   try {
  //     config.settings = JSON.parse(config.settings);
  //     // console.log(config);
  //   } catch (ignore) { }
  // };

  /**
   * [指定したフィールドが存在するか確認]
   * @param {string} tableCode [テーブル名]
   * @param {string} source  [ユーザー選択名]
   * @param {string} destination  [文字列名]
   * @param {object} record  [イベント実行時のフォーム情報]
   * @returns [存在しない場合true 存在する場合false]
   */
  obj.func.existenceCheck = function (tableCode, source, destination, { record }) {
    if (!tableCode) {
      const field = record[destination];
      const field2 = record[source];
      if (!field || !field2) return true;
      return false;
    } else {
      const tableField = record[tableCode];
      if (!tableField) return true;
      const field = tableField.value[0].value[destination];
      const field2 = tableField.value[0].value[source];
      if (!field || !field2) return true;
      return false;
    }
  };

  obj.func.getFieldList = async function () {
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
              properties: Object.values(fieldList2.find((x) => x.var === row.code).fieldList).find(
                (y) => y.var === field.code
              ).properties,
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
            //fieldList.push(field)
          ));
        }
      });
    } catch { }

    fieldList.forEach((field) => {
      const target = fieldList2.find((x) => x.var === field.code);
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
    return fieldList;
  };

  obj.func.displayAlert = function (title, text, type, button) {
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

  kintone.events.on(obj.events1.type, obj.events1.handler);
  kintone.events.on(obj.events2.type, obj.events2.handler);
})(jQuery, kintone.$PLUGIN_ID);
