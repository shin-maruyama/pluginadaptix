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


  if (!(await KNTP608210certification())) {
    return;
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  //[JSON型に変換]
  if (Object.keys(config).length) {
    config.field = JSON.parse(config.field);
    config.condition = JSON.parse(config.condition);
    //console.log(config);
  }

  //[処理用オブジェクト]
  const obj = {};
  /**
   * @param events [イベント配列]
   */
  obj.events = ['app.record.create.submit', 'app.record.edit.submit'];

  /**********************
   * [イベント実行処理関数]
   **********************/
  obj.eventStart = async function () {
    const that = this;

    kintone.events.on('app.record.index.show', that.checkFields);

    if (!Object.keys(config).length) return false;

    const fieldList = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
    const fieldList2 = await that.getFields();

    kintone.events.on(that.events, async function (event) {
      const { record } = event;

      const body = {
        app: kintone.app.getId(),
        //fields: ['$id']
      };


      var recordList = [];
      //[カーソルID取得]
      const cursor = await callKintoneApi(kintone.api.url('/k/v1/records/cursor', true), 'POST', body);
      try {
        //[レコード取得]
        let flg = true;
        while (flg) {
          const resp = await callKintoneApi(kintone.api.url('/k/v1/records/cursor', true), 'GET', { id: cursor.id });
          recordList = recordList.concat(resp.records);
          flg = resp.next;
        }
      } catch (error) {
        console.error(error);
      }

      config.duplicateCheck = [];//重複チェック配列
      let l;//重複チェック配列番地

      const errorFieldList = [];
      let error = '';
      var tableName = '';
      var fieldName = '';
      let duplicateCheckFlag;//重複チェックフラグ

      if (recordList.length > 0) {
        for (let k = 0; k < recordList.length; k++) {
          var flag = false;
          const item = recordList[k];
          let str = [];
          let recordStr = [];
          //if (item.$id.value !== record.$id.value) {
          //debugger;
          if (event.type === 'app.record.edit.submit') {
            if (item.$id.value === record.$id.value) {
              continue;
            }
          }

          for (let i = 0; i < config.field.length; i++) {

             const filedSplit = config.field[i].split(' ');
            const fieldName = filedSplit.length === 1 ? filedSplit[0] : filedSplit[1];

            let tableCode = '';
            if(filedSplit.length !== 1) {
              tableCode = filedSplit[0];
              if(!record[tableCode]) tableCode = '';
            }

            if (tableCode == '') {
                  str.push(item[fieldName].value);
                  recordStr.push(record[fieldName].value);
                } else {
                  if (item[tableCode]) {
                    const table = item[tableCode].value;
                    if (table && table.length) {
                      for (let j = 0; j < table.length; j++) {
                        str.push(table[j].value[fieldName].value);
                      }
                    }

                    const reTable = record[tableCode].value;
                    if (reTable && reTable.length) {
                      for (let j = 0; j < reTable.length; j++) {
                        recordStr.push(reTable[j].value[fieldName].value);
                      }
                    }
                  }
                }
  
            duplicateCheckFlag = false;

            //重複チェック
            str.forEach(
              (x) => {recordStr.forEach(
                (y) => {if(x == y){duplicateCheckFlag = true}}
              )}
            )

            if(duplicateCheckFlag){config.duplicateCheck.push('true')}else{config.duplicateCheck.push('false')}

            str = [];
            recordStr = [];
          }
          //if (flag) break;

        }

        config.condition.forEach((condition,i) => {
          if(condition !== 'AND'){
            if(config.duplicateCheck[i] == 'true'){
              let tempList = [];
                tempList.push(config.field[i]);
                let count = 0;
                while (i - 1 >= 0 && config.condition[i - 1] === 'AND') {
                  if(config.duplicateCheck[i - 1] == 'false'){tempList = [];count = 0;break;}
                  tempList.push(config.field[i - 1]);
                  i--;
                  count++;
                }

                if (count >= 1) {
                  tempList.reverse();
                  tempList.forEach((x) => {
                    errorFieldList.push(x);
                  });
                } else {
                  tempList.forEach((x) => {
                    errorFieldList.push(x);
                  });
                }
              }
            }
          })  

        errorFieldList.forEach((field) => {
          if (field.indexOf(' ') !== -1) {
            const tableCode = field.split(' ')[0];
            if (record[tableCode]) {
              error += `「${fieldList2.find((_) => _.fieldName === field).label}」`;
            } else {
              error += `「${fieldList.find((_) => _.var === field.split(' ')[1]).label}」`;
            }

          } else {
            error += `「${fieldList.find((_) => _.var === field).label}」`;
          }
        });

        if (errorFieldList.length) {
          that.displayAlert('エラー', `フィールド${error}が他のレコードと重複しています。`, 'error', 'OK');
          return false;
        }

      }

    });

  };

  /******************************************
   * [アラートの表示処理関数]
   * @param {string} title  [タイトル]
   * @param {string} text   [説明文]
   * @param {string} type   [アラートタイプ]
   * @param {string} button [ボタン名表示文字]
   * 使用例 ： that.displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');
   *****************************************/
  obj.displayAlert = function (title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button,
    });
  };

  obj.displayAlert2 = function (title, text, type, button) {
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

  /***********************************************************
   * [重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  // obj.dupCheck = function (value) {
  //   const array = [];

  //   value.field.forEach((item) => {
  //     array.push(item);
  //   });
  //   const a = new Set(array);
  //   return a.size !== array.length;
  // };

  obj.getFields = async function () {
    const fieldList = [];
    try {
      const resp = await callKintoneApi(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
        app: kintone.app.getId(),
      });
      resp.layout.forEach((row) => {
        if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push(field));
        else if (row.type === 'SUBTABLE') fieldList.push(row);
        else if (row.type === 'GROUP') {
          fieldList.push(row);
          //row.layout.forEach((childRow) => childRow.fields.forEach((field) => fieldList.push(field)));
        }
      });
      let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
      fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
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
    } catch { }


    let filteredFieldList = [];
    fieldList.forEach((row) => {
      if (row.type === 'GROUP') {
        row.layout.forEach((childRow) => {
          childRow.fields.forEach((field) => {
            filteredFieldList.push({
              fieldName: (row.code ? row.code : row.label) + ' ' + field.code,
              label: field.label ? field.label : ''
            });
          });
        });
      } else if (row.type === 'SUBTABLE') {
        row.fields.forEach((subField) => {
          filteredFieldList.push({
            fieldName: (row.code ? row.code : row.label) + ' ' + subField.code,
            label: subField.label ? subField.label : ''
          });
        });
      } else {
        filteredFieldList.push({
          fieldName: row.code,
          label: row.label ? row.label : ''
        });
      }
    });


    return filteredFieldList;
  }

  obj.checkFields = async function () {
    if (!config.field || !config.field.length) return;

    const filteredFieldList = await obj.getFields();
    if (!filteredFieldList) return;

    const missingFields = [];

    for (let i = 0; i < config.field.length; i++) {
      const fieldCode = config.field[i];

      if (fieldCode && fieldCode !== 'none') {
        const exists = filteredFieldList.some(field => field.fieldName === fieldCode);
        if (!exists) {
          missingFields.push(`[重複禁止フィールド] ${fieldCode}`);
        }
      }
    }

    const uniqueMissingFields = [...new Set(missingFields)];

    if (uniqueMissingFields.length > 0) {
      const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
      const fieldHtml = uniqueMissingFields
        .map((code) => `・${code}`)
        .join('<br>');

      obj.displayAlert2(
        '警告',
        '「フィールド重複チェックプラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        imageUrl,
        'OK'
      );
    }
  };

  //[関数実行]
  obj.eventStart();
})(jQuery, kintone.$PLUGIN_ID);
