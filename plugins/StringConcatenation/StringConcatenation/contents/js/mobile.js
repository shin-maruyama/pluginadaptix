// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP217910certification())) {
    return;
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  //[JSON型に変換]
  if (Object.keys(config).length) {
    config.delimiter = JSON.parse(config.delimiter);
    config.field = JSON.parse(config.field);
    config.paddingSelect = JSON.parse(config.paddingSelect);
    config.digit = JSON.parse(config.digit);
    config.connectionField = JSON.parse(config.connectionField);
    // console.log(config);
  }

  //[処理用オブジェクト]
  const connection = {};
  /**
   * @param events [イベント配列]
   */
  connection.events = [];



  /**********************
   * [イベント実行処理関数]
   **********************/
  connection.eventStart = function () {
    const that = this;

    if (!config.field || !config.field.length) return;
    for (const fields of config.field) {
      fields.forEach((item) => {
        that.events.push('mobile.app.record.create.change.' + that.getCodePart(item));
        that.events.push('mobile.app.record.edit.change.' + that.getCodePart(item));
      });
    }

    kintone.events.on(that.events, function (event) {
      const { record } = event;
      // console.log(record);

      if (!Object.keys(config).length) return event;

      for (let i = 0, length = config.field.length; i < length; i++) {
        const fieldValueList = [];


        config.field[i].forEach((field) => {

          if (field.split('　').length === 1) {
            //[フォームにフィールドがない場合ループを次に進める]
            if (!record[field]) return;

            //[数値フィールドの場合]
            if (record[field].type === 'NUMBER') {
              if (record[field].value) {
                config.paddingSelect[i] === 'y'
                  ? fieldValueList.push(that.zeroPadding(record[field].value, config.digit[i]))
                  : fieldValueList.push(record[field].value);
              }

              //[文字列1行フィールドの場合]
            } else if (record[field].type === 'SINGLE_LINE_TEXT') fieldValueList.push(record[field].value);
          } else {
            const tableCode = field.split('　')[0];
            const fieldCode = field.split('　')[1];
            if (!record[tableCode]) {
              if (!record[fieldCode]) return;

              //[数値フィールドの場合]
              if (record[fieldCode].type === 'NUMBER') {
                if (record[fieldCode].value) {
                  config.paddingSelect[i] === 'y'
                    ? fieldValueList.push(that.zeroPadding(record[fieldCode].value, config.digit[i]))
                    : fieldValueList.push(record[fieldCode].value);
                }

                //[文字列1行フィールドの場合]
              } else if (record[fieldCode].type === 'SINGLE_LINE_TEXT') fieldValueList.push(record[fieldCode].value);

            } else {
              if (!event.changes.row || !event.changes.row.value) return event;
              if (!event.changes.row.value[fieldCode]) return;
              if (event.changes.row.value[fieldCode].type === 'NUMBER') {
                if (event.changes.row.value[fieldCode].value) {
                  config.paddingSelect[i] === 'y'
                    ? fieldValueList.push(that.zeroPadding(event.changes.row.value[fieldCode].value, config.digit[i]))
                    : fieldValueList.push(event.changes.row.value[fieldCode].value);
                }
              } else if (event.changes.row.value[fieldCode].type === 'SINGLE_LINE_TEXT') fieldValueList.push(event.changes.row.value[fieldCode].value);

            }
          }
        });
        //[連結先フィールドがある場合代入]
        if (config.connectionField[i].split('　').length === 1) {
          if (record[config.connectionField[i]])
            record[config.connectionField[i]].value = fieldValueList
              .filter((x) => x !== undefined && x !== 'undefined' && x !== 'ndefined')
              .join(config.delimiter[i]);
        } else {
          const tableCode2 = config.connectionField[i].split('　')[0];
          const fieldCode2 = config.connectionField[i].split('　')[1];
          if (!record[tableCode2]) {
            if (record[fieldCode2]) {
              record[fieldCode2].value = fieldValueList
                .filter((x) => x !== undefined && x !== 'undefined' && x !== 'ndefined')
                .join(config.delimiter[i]);
            }
          } else {
            if (!event.changes.row || !event.changes.row.value) return event;
            if (record[tableCode2].value[0].value[fieldCode2]) {
              event.changes.row.value[fieldCode2].value = fieldValueList
                .filter((x) => x !== undefined && x !== 'undefined' && x !== 'ndefined')
                .join(config.delimiter[i]);
            }
          }
        }

      }
      return event;
    });

    kintone.events.on('mobile.app.record.index.show', async function (event) {
      const fieldList = await that.getFieldList();
      if (!fieldList || !fieldList.length) return event;
      if (!Object.keys(config).length) return event;

      const missingFields = [];

      for (let i = 0, length = config.field.length; i < length; i++) {
        config.field[i].forEach((field) => {
          if (field && field !== '') {
            const re = fieldList.find((x) => x.code === field);
            if (!re) {
              missingFields.push(`[連結元フィールド] ${field}`);
            }
          }
        });

        if (config.connectionField[i] && config.connectionField[i] !== '') {
          const re = fieldList.find((x) => x.code === config.connectionField[i]);
          if (!re) {
            missingFields.push(`[連結先フィールド] ${config.connectionField[i]}`);
          }
        }
      }

      const uniqueMissingFields = [...new Set(missingFields)];

      if (uniqueMissingFields.length > 0) {
        const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
        const fieldHtml = uniqueMissingFields
          .map((code) => `・${code}`)
          .join('<br>');

        that.displayAlert(
          '警告',
          '「文字列結合プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          fieldHtml +
          '<br><br>プラグイン設定を修正してください。',
          imageUrl,
          'OK'
        );
      }

      return event;
    });

  };

  connection.getFieldList = async function () {
    const fieldList = [];
    const fieldList2 = [
      ...Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList),
      ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
    ];

    try {
      const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
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

  /**********************************
   * [0埋め処理関数]
   * @param {String} value [対象数値]
   * @param {String} digit [桁数]
   * @returns [0埋め後の文字列]
   *********************************/
  connection.zeroPadding = function (value, digit) {
    const cut3 = value.replace(/(\.\d{3})\d*/, '$1');
    const cut3len = cut3.length;
    if (cut3len >= digit){
      return cut3.slice(0, digit);
    }
    let zero = '';
    for (let i = cut3len; i < digit; i++) zero += '0';
    return zero + cut3;
  };

  connection.getCodePart = function (code) {
    const parts = code.split('　');
    return parts.length === 2 ? parts[1] : code;
  };

  connection.displayAlert = function (title, text, type, button) {
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


  //[関数実行]
  connection.eventStart();
})(jQuery, kintone.$PLUGIN_ID);
