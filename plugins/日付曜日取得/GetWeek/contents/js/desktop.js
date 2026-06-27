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


  if (!(await KNTP867810certification())) {
    return;
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  //[JSON型に変換]
  if (Object.keys(config).length) {
    config.date = JSON.parse(config.date);
    config.text = JSON.parse(config.text);
    config.oneWordCheck = JSON.parse(config.oneWordCheck);
    // console.log(config);
  }

  //[処理用オブジェクト]
  const objName = {};

  /**********************
   * [イベント実行処理関数]
   **********************/
  objName.eventStart = function () {
    const that = this;


    if (!Object.keys(config).length) return false;

    const events = that.createChangeEvent(config.date);

    kintone.events.on(events, function (event) {
      const { record } = event;
      
       for(let i = 0; i < config.date.length; i++){
        const dateCode = config.date[i];
        const dateCodeSplit = dateCode.split('　');
        const dateCodeName = dateCodeSplit.length === 1 ? dateCodeSplit[0] : dateCodeSplit[1];
        const textCode = config.text[i];
        const textCodeSplit = textCode.split('　');
        const textCodeName = textCodeSplit.length === 1 ? textCodeSplit[0] : textCodeSplit[1];
        let tableCode = '';
        if (dateCodeSplit.length !== 1) {
          tableCode = dateCodeSplit[0];
          if(!record[tableCode]) tableCode = '';
        }

        if(tableCode == '') {
          const dateField = record[dateCodeName];
          const textField = record[textCodeName];
          if(dateField && textField) {
            if(dateField.value === undefined) {textField.value = undefined;}
            else {textField.value = that.dayOfWeekConversion(dateField.value, config.oneWordCheck[i])}
          }
        } else {
          for(const row of record[tableCode].value) {
            const dateField = row.value[dateCodeName];
            const textField = row.value[textCodeName];
            if (dateField && textField){
              if(dateField.value === undefined) {textField.value = undefined;}
              else {textField.value = that.dayOfWeekConversion(dateField.value, config.oneWordCheck[i])}
            }
          }
        }
      }
      return event;
    });

    kintone.events.on('app.record.index.show', async function (e) {
      const fieldList = await that.getFieldList();
      if (!config.date || !config.date.length) return e;
      if (!fieldList || !fieldList.length) return e;

      const missingFields = [];

      for (let i = 0; i < config.date.length; i++) {
        if (config.date[i] && config.date[i] !== '' && config.date[i] !== 'none') {
          const exists = fieldList.some((field) => field.code === config.date[i]);
          if (!exists) {
            missingFields.push(`[曜日を表示する日付フィールド] ${config.date[i]}`);
          }
        }

        if (config.text[i] && config.text[i] !== '' && config.text[i] !== 'none') {
          const exists = fieldList.some((field) => field.code === config.text[i]);
          if (!exists) {
            missingFields.push(`[曜日を格納するフィールド] ${config.text[i]}`);
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
          '「日付曜日取得プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          fieldHtml +
          '<br><br>プラグイン設定を修正してください。',
          imageUrl,
          'OK'
        );
      }

      return e;
    });
  };

  /**************************
   * [日付から曜日取得処理関数]
   * @param {string} date  [日付( 1970-01-01 )]
   * @returns [曜日]
   *************************/
  objName.dayOfWeekConversion = function (_date, flag) {
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    const date = new Date(_date);
    if (flag) return dayOfWeek[date.getDay()];
    else return `${dayOfWeek[date.getDay()]}曜日`;
  };

  /**********************************************************
   * [チェンジイベント作成処理関数]
   * @param {Array} dateField [チェンジイベント対象フィールド]
   * @returns [チェンジイベントリスト]
   *********************************************************/
  objName.createChangeEvent = function (dateField) {
    const events = [];
    dateField.forEach((field) => {
      const fieldCode = objName.getCodePart(field);
      events.push('app.record.create.change.' + fieldCode);
      events.push('app.record.edit.change.' + fieldCode);
    });
    return events;
  };


  objName.getCodePart = function (code) {
    const parts = code.split('　');
    return parts.length === 2 ? parts[1] : code;
  };

  objName.getFieldList = async function () {
    const fieldList = [];
    try {
      const resp = await callKintoneApi('/k/v1/app/form/layout.json', 'GET', { app: kintone.app.getId() });
      resp.layout.forEach(row => {
        if (row.type === 'ROW') row.fields.forEach(field => fieldList.push(field));
        else if (row.type === 'SUBTABLE') {
          fieldList.push(row);
          //if (!subTable) return;
          row.fields.forEach(field => {
            const fieldInfo = {
              type: field.type,
              code: `${row.code}　${field.code}`,
            };
            fieldList.push(fieldInfo);
          })
        }
        else if (row.type === 'GROUP') {
          fieldList.push(row);
          row.layout.forEach(childRow => childRow.fields.forEach(field => {
            //fieldList.push(field)
            const fieldInfo = {
              type: field.type,
              code: `${row.code}　${field.code}`,
            };
            fieldList.push(fieldInfo);
          }));
        };
      })

      let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
      fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];

      fieldList.forEach(field => {
        const target = fieldList2.find(x => x.var === field.code);
        if (!target) return;
        field.id = target.id;
        field.properties = target.properties;
        field.label = target.label;

        if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
        field.fields.forEach(inField => {
          const inTarget = Object.values(target.fieldList).find(x => x.var === inField.code);
          inField.id = inTarget.id;
          inField.properties = inTarget.properties;
          inField.label = inTarget.label;
        })
      })
    } catch {

    }
    return fieldList;
  };

  objName.displayAlert = function (title, text, type, button) {
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
  objName.eventStart();
})(jQuery, kintone.$PLUGIN_ID);
