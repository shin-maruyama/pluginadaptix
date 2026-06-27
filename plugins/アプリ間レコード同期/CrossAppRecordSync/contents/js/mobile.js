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


  if (!(await KNTP496810certification())) {
    return;
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  const obj = {
    events1: {},
    events2: {},
    func: {}
  };

  obj.events1.type = 'mobile.app.record.index.show';

  obj.events1.handler = async function (e) {

    if (!Object.keys(config).length) return e;
    obj.func.jsonParse();

    if (!(await obj.events1.checkFields())) return e;

    //[一覧画面表示時]
    if (config.timing === '1') {

      await obj.events1.synchronize();

      //[一覧ボタンクリック時]
    } else {

      if (document.querySelector('#synchronize-button')) return e;
      const button = $('<button>', {
        id: 'synchronize-button',
        text: '同期'
      });
      $(document).on('click', '#synchronize-button', obj.events1.synchronize);
      //console.log(kintone.mobile.app.getHeaderSpaceElement());
      $(kintone.mobile.app.getHeaderSpaceElement()).append(button);

    }
    return e;
  }

  obj.events1.synchronize = async function () {
    try {
      if (config.timing === '1') {
        if (window.name === '1') return;
        window.name = '1';
      }

      //[スピナー開始]
      obj.func.spinner(true);



      //[クライアントの作成]
      const client = new KintoneRestAPIClient();

      //[コピー元アプリの全レコード取得]
      const sourceAllRecords = await client.record.getAllRecords({
        app: config.copyDestinationAppId
      });

      //[コピー先のアプリ（自アプリ）の全レコード取得]
      const destinationAllRecords = await client.record.getAllRecords({
        app: kintone.mobile.app.getId()
      });



      await outputCSV(destinationAllRecords);

      // console.log(destinationAllRecords);

      const updateRecords = [];//[更新用配列]
      const addRecords = [];//[新規登録用配列]

      try {
        var filterList = await obj.func.filterRecordOrRowOfTable(sourceAllRecords);
      } catch (error) {
        console.error(error);
      }

      if (!filterList) return;
      //filterList.reverse();
      //console.log(filterList);
      var num = 0;

      for (const sRecord of filterList) {
        const recordIdCopyField = obj.func.getCodePart(config.recordIdCopyField);
        const targetRecord = destinationAllRecords.find(dRecord => dRecord[recordIdCopyField].value === sRecord['$id'].value);

        //[更新対象のレコードが存在する場合]
        if (targetRecord) {
          if (config.rewriteField && config.rewriteField !== '') {
            const rewriteField = obj.func.getCodePart(config.rewriteField);
            if (targetRecord[rewriteField].value[0] !== 'する') continue;
          }
          //[更新用レコードオブジェクト作成]
          const recordObj = {
            id: targetRecord['$id'].value,
            record: {}
          };


          for (const field of config.copyField) {
            if (field.sourceField.split('　').length === 1) {
              const noUpdateFieldTypeList = ['CREATOR', 'CREATED_TIME', 'MODIFIER', 'UPDATED_TIME'];
              if (noUpdateFieldTypeList.includes(sRecord[field.sourceField].type)) continue;

              const destination = obj.func.getCodePart(field.destinationField);
              if (sRecord[field.sourceField].type === 'FILE') {
                recordObj.record[destination] = {
                  value: await getNewFileKey(sRecord[field.sourceField].value)
                };
              } else {
                recordObj.record[destination] = {
                  value: sRecord[field.sourceField].value
                };
              }

            } else {
              const tableCode = field.sourceField.split('　')[0];
              const source = field.sourceField.split('　')[1];
              if (!sRecord[tableCode]) {
                const destination = obj.func.getCodePart(field.destinationField);

                if (sRecord[source].type === 'FILE') {
                  recordObj.record[destination] = {
                    value: await getNewFileKey(sRecord[source].value)
                  };
                } else {
                  recordObj.record[destination] = {
                    value: sRecord[source].value
                  };
                }

              } else {
                const destinationTableFieldCode = field.destinationField.split('　')[0];
                const destination = field.destinationField.split('　')[1];
                if (!recordObj.record[destinationTableFieldCode]) {
                  recordObj.record[destinationTableFieldCode] = {
                    value: []
                  };
                }


                for (let i = 0; i < sRecord[tableCode].value.length; i++) {
                  //console.log(recordObj);
                  const row = sRecord[tableCode].value[i];
                  let rowObj = recordObj.record[destinationTableFieldCode].value[i];
                  //console.log(rowObj);
                  if (!rowObj) {
                    const rowObj2 = {
                      id: row.id,
                      value: {},
                    };
                    recordObj.record[destinationTableFieldCode].value.push(rowObj2);
                    rowObj = recordObj.record[destinationTableFieldCode].value[i];
                  }

                  if (row.value[source].type === 'FILE') {
                    rowObj.value[destination] = {
                      value: await getNewFileKey(row.value[source].value)
                    };
                  } else {
                    rowObj.value[destination] = {
                      value: row.value[source].value
                    };
                  }
                }
              }
            }
          }

          //console.log(recordObj);
          updateRecords.push(recordObj);

        } else {
          //[登録用レコードオブジェクト作成]
          const recordObj = {};

          recordObj[recordIdCopyField] = {
            value: sRecord['$id'].value
          }

          //console.log(recordObj);
          if (config.isNumberCheck) {
            if (config.numberSelect && config.numberSelect !== '') {
              const numberSelect = obj.func.getCodePart(config.numberSelect);
              if (destinationAllRecords.length > 0) {
                //const index = destinationAllRecords.length - 1;
                const type = destinationAllRecords[0][numberSelect].type;
                // if (type === 'NUMBER') {
                // const str = destinationAllRecords[index][numberSelect].value;
                // //console.log(str);
                // if (num === 0) {
                //   num = parseInt(str, 10);
                // }
                // if (!isNaN(num)) {
                //   num += 1;
                //   //console.log(num);
                //   let saiban = String(num);
                //   recordObj[numberSelect] = {
                //     value: saiban
                //   }
                // }
                // } else {

                const str = destinationAllRecords[0][numberSelect].value;
                //console.log(str);
                if (num === 0) {
                  num = parseInt(str, 10);
                }
                if (!isNaN(num)) {
                  num += 1;
                  //console.log(num);
                  let saiban = String(num);
                  //console.log(saiban);
                  if (type === 'SINGLE_LINE_TEXT') {
                    saiban = saiban.padStart(str.length, '0');
                  }

                  //console.log(saiban);
                  recordObj[numberSelect] = {
                    value: saiban
                  }

                }

                // }
              } else {
                num += 1;
                let saiban = String(num);
                if (config.digit && config.digit !== '') {
                  saiban = saiban.padStart(config.digit, '0');
                }
                recordObj[numberSelect] = {
                  value: saiban
                }
              }

            }
          }

          //console.log(recordObj);
          for (const field of config.copyField) {
            if (field.sourceField.split('　').length === 1) {
              const noUpdateFieldTypeList = ['CREATOR', 'CREATED_TIME', 'MODIFIER', 'UPDATED_TIME'];
              if (noUpdateFieldTypeList.includes(sRecord[field.sourceField].type)) continue;

              const destination = obj.func.getCodePart(field.destinationField);

              if (sRecord[field.sourceField].type === 'FILE') {
                recordObj[destination] = {
                  value: await getNewFileKey(sRecord[field.sourceField].value)
                };
              } else {
                recordObj[destination] = {
                  value: sRecord[field.sourceField].value
                };
              }

            } else {
              const tableCode = field.sourceField.split('　')[0];
              const source = field.sourceField.split('　')[1];
              if (!sRecord[tableCode]) {
                const destination = obj.func.getCodePart(field.destinationField);
                if (sRecord[source].type === 'FILE') {
                  recordObj[destination] = {
                    value: await getNewFileKey(sRecord[source].value)
                  };
                } else {
                  recordObj[destination] = {
                    value: sRecord[source].value
                  };
                }
              } else {
                const destinationTableFieldCode = field.destinationField.split('　')[0];
                const destination = field.destinationField.split('　')[1];
                if (!recordObj[destinationTableFieldCode]) {
                  recordObj[destinationTableFieldCode] = {
                    value: []
                  };
                }

                for (let i = 0; i < sRecord[tableCode].value.length; i++) {
                  const row = sRecord[tableCode].value[i];
                  let rowObj = recordObj[destinationTableFieldCode].value[i];
                  if (!rowObj) {
                    const rowObj2 = {
                      id: row.id,
                      value: {},
                    };
                    recordObj[destinationTableFieldCode].value.push(rowObj2);
                    rowObj = recordObj[destinationTableFieldCode].value[i];
                  }

                  if (row.value[source].type === 'FILE') {
                    rowObj.value[destination] = {
                      value: await getNewFileKey(row.value[source].value)
                    };
                  } else {
                    rowObj.value[destination] = {
                      value: row.value[source].value
                    };
                  }
                }
              }
            }
          }


          addRecords.push(recordObj);
          //console.log(addRecords);

        }
      }

      //[更新用配列が空ではない場合]
      if (updateRecords.length) {
        try {
          await client.record.updateAllRecords({
            app: kintone.mobile.app.getId(),
            records: updateRecords
          });
        } catch (error) {
          console.error(error);
        }

      }

      //[登録用配列が空ではない場合]
      if (addRecords.length) {
        try {
          await client.record.addAllRecords({
            app: kintone.mobile.app.getId(),
            records: addRecords
          })
        } catch (error) {
          console.error(error);
        }

      }

      //[スピナー終了]
      obj.func.spinner();
      // setTimeout(() => {
      alert('同期されました。');
      location.reload();
      //  }, 10000); 

    } catch (error) {
      console.error(error);
    }

  }

  obj.events1.checkFields = async function () {
    const destinationFields = await getFieldList(kintone.mobile.app.getId());
    const appList = await getAppList();

    if (!appList || !appList.length) return true;

    const appId = config.copyDestinationAppId;
    if (!appId || appId === '') return true;

    const app = appList.find((x) => String(x.appId) === String(appId));
    if (!app) {
      displayAlert(
        '1',
        'エラー',
        '「アプリ間レコード同期プラグイン」に設定済みのアプリが削除されています。<br><br>' +
        '対象アプリID：<br>' +
        `・${appId}` +
        '<br><br>プラグイン設定を修正してください。',
        'error',
        'OK'
      );
      return false;
    }

    const sourceFields = await getFieldList(appId);
    const missingFields = [];

    if (config.recordIdCopyField && config.recordIdCopyField !== '') {
      const exists = destinationFields.some((x) => x.code === config.recordIdCopyField);
      if (!exists) {
        missingFields.push(`[レコード番号のコピー先フィールド] ${config.recordIdCopyField}`);
      }
    }

    if (config.rewriteField && config.rewriteField !== '') {
      const exists = destinationFields.some((x) => x.code === config.rewriteField);
      if (!exists) {
        missingFields.push(`[上書き許可フィールド] ${config.rewriteField}`);
      }
    }

    if (config.isNumberCheck) {
      if (config.numberSelect && config.numberSelect !== '') {
        const exists = destinationFields.some((x) => x.code === config.numberSelect);
        if (!exists) {
          missingFields.push(`[採番フィールド] ${config.numberSelect}`);
        }
      }
    }

    if (config.conditionField && config.conditionField.length > 0) {
      for (const condition of config.conditionField) {
        if (condition.sourceField && condition.sourceField !== '') {
          const source = sourceFields.find((x) => x.code === condition.sourceField);
          if (!source) {
            missingFields.push(`[同期条件フィールド（コピー元）] ${condition.sourceField}`);
          }
        }
      }
    }

    if (config.copyField && config.copyField.length > 0) {
      for (const copy of config.copyField) {
        if (copy.sourceField && copy.sourceField !== '') {
          const source = sourceFields.find((x) => x.code === copy.sourceField);
          if (!source) {
            missingFields.push(`[同期フィールド コピー元] ${copy.sourceField}`);
          }
        }

        if (copy.destinationField && copy.destinationField !== '') {
          const destination = destinationFields.find((x) => x.code === copy.destinationField);
          if (!destination) {
            missingFields.push(`[同期フィールド コピー先] ${copy.destinationField}`);
          }
        }
      }
    }

    const uniqueMissingFields = [...new Set(missingFields)];

    if (uniqueMissingFields.length > 0) {
      const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
      const fieldHtml = uniqueMissingFields
        .map((code) => `・${code}`)
        .join('<br>');

      displayAlert(
        '2',
        '警告',
        '「アプリ間レコード同期プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        imageUrl,
        'OK'
      );
    }

    return true;
  }


  obj.events2.type = ['mobile.app.record.create.show', 'mobile.app.record.edit.show'];

  obj.events2.handler = function (e) {
    if (!Object.keys(config).length) return e;
    obj.func.jsonParse();
    //[画面表示時にコピー先フィールドを編集不可にする]
    for (const field of config.copyField) {
      obj.func.disabled(field.destinationField, e.record);
    }

    //[レコード番号格納先を編集不可]
    obj.func.disabled(config.recordIdCopyField, e.record);
    if (config.isNumberCheck) {
      obj.func.disabled(config.numberSelect, e.record);
    }
    return e;
  }

  obj.func.filterRecordOrRowOfTable = async function (sourceRecords) {
    //console.log(config);
    if (!config.conditionField || config.conditionField.length === 0) return sourceRecords;
    let query = '';
    for (const condition of config.conditionField) {
      if (condition.sourceField && condition.sourceField !== '' && condition.copyCond && condition.copyCond !== '') {

        if (condition.condType === 'DATE') {
          const s = obj.func.getCodePart(condition.sourceField);
          const z = condition.dateSelect;
          //console.log(z);
          if (!z || !condition.dateSelect) continue;
          if (query !== '') {
            query += ' and ';
          }
          switch (condition.copyCond) {
            case '1':
              query += `${s} = "${z}"`;
              break;
            case '2':
              query += `${s} != "${z}"`;
              break;
            case '3':
              query += `${s} <= "${z}"`;
              break;
            case '4':
              query += `${s} < "${z}"`;
              break;
            case '5':
              query += `${s} >= "${z}"`;
              break;
            case '6':
              query += `${s} > "${z}"`;
              break;
          }
        } else {
          const s = obj.func.getCodePart(condition.sourceField);
          if (!condition.condSelect || !condition.condSelect) continue;
          if (query !== '') {
            query += ' and ';
          }
          if (condition.copyCond === '1') {
            const z = condition.condSelect;
            query += `${s} in ("${z}")`;

          } else {
            const z = condition.condSelect;
            query += `${s} not in ("${z}")`;
          }
        }
      }
      //console.log(query);
    }


    let records = [];
    //[カーソルID取得]
    try {
      const client = new KintoneRestAPIClient();
      records = await client.record.getAllRecords({ app: config.copyDestinationAppId, condition: query });
    } catch (error) {
      console.error('Error fetching records:', error);
    }
    //console.log(records);
    return records;
  }




  obj.func.getCodePart = function (code) {
    const parts = code.split('　');
    return parts.length === 2 ? parts[1] : code;
  }


  obj.func.jsonParse = function () {
    try {
      config.copyField = JSON.parse(config.copyField);
      config.conditionField = JSON.parse(config.conditionField);
      config.isNumberCheck = JSON.parse(config.isNumberCheck);
      //console.log(config);
    } catch (ignore) { }
  }


  /**
   * @param {String} fieldCode [編集不可にするフィールドコード] 
   * @param {object} record    [イベントで受け取るフォーム情報] 
   * [取得したフィールドコードを編集不可にする]
   */
  obj.func.disabled = function (fieldCode, record) {
    //console.log(fieldCode);
    if (!fieldCode) return;
    if (fieldCode.split('　').length === 1) {
      const field = record[fieldCode];
      const isExistingField = field !== undefined;
      if (!isExistingField) return;
      field.disabled = true;
    } else {
      const tableCode = fieldCode.split('　')[0];
      const code = fieldCode.split('　')[1];
      if (!record[tableCode]) {
        const field = record[code];
        const isExistingField = field !== undefined;
        if (!isExistingField) return;
        field.disabled = true;
      } else {
        const field = record[tableCode];
        const isExistingField = field !== undefined;
        if (!isExistingField) return;

        for (const row of field.value) {
          const insideTheTableField = row.value[code];
          const isExistingInsideTheTableField = insideTheTableField !== undefined;
          if (!isExistingInsideTheTableField) return;
          insideTheTableField.disabled = true;
        }

        const events = [
          `mobile.app.record.create.change.${tableCode}`,
          `mobile.app.record.edit.change.${tableCode}`
        ];

        //[指定テーブルの行追加時にテーブル内フィールドを編集不可]
        kintone.events.on(events, function (e) {
          for (const copyField of config.copyField) {
            if (copyField.destinationField.split('　').length === 2 && e.record[copyField.destinationField.split('　')[0]]) {
              obj.func.disabled(copyField.destinationField, e.record);
            }
          }
          return e;
        })

      }
    }

  }


  /**
   *スピナー表示/非表示
   *@param {boolean} status [表示=true 非表示=false] 
   */
  obj.func.spinner = function (status = false) {
    // 要素作成等初期化処理
    if ($('.kintone-spinner').length == 0) {
      // スピナー設置用要素と背景要素の作成
      const spin_div = $('<div id ="kintone-spin" class="kintone-spinner"></div>');
      const spin_bg_div = $('<div id ="kintone-spin-bg" class="kintone-spinner"></div>');

      // スピナー用要素をbodyにappend
      $(document.body).append(spin_div, spin_bg_div);

      // スピナー動作に伴うスタイル設定
      $(spin_div).css({
        'position': 'fixed',
        'top': '50%',
        'left': '50%',
        'z-index': '510',
        'background-color': '#fff',
        'padding': '26px',
        '-moz-border-radius': '4px',
        '-webkit-border-radius': '4px',
        'border-radius': '4px'
      });
      $(spin_bg_div).css({
        'position': 'fixed',
        'top': '0px',
        'left': '0px',
        'z-index': '500',
        'width': '100%',
        'height': '200%',
        'background-color': '#000',
        'opacity': '0.5',
        'filter': 'alpha(opacity=50)',
        '-ms-filter': "alpha(opacity=50)"
      });

      // スピナーに対するオプション設定
      const opts = {
        'color': '#000'
      };

      // スピナーを作動
      new Spinner(opts).spin(document.getElementById('kintone-spin'));
    }

    if (status) {
      // スピナー表示
      $('.kintone-spinner').show();
    } else {
      // スピナー非表示
      $('.kintone-spinner').hide();
    }
  }



  async function getNewFileKey(value) {
    const client = new KintoneRestAPIClient();
    const updateValue = [];
    if (!Array.isArray(value) || !value.length) return updateValue;

    for (const f of value) {
      const blob = await client.file.downloadFile({
        fileKey: f.fileKey
      });

      const file = {
        name: f.name,
        data: blob
      };

      const uploadFileKey = await client.file.uploadFile({
        file: file
      });

      updateValue.push({
        fileKey: uploadFileKey.fileKey
      });
    }

    return updateValue;
  }

  async function getAppList(offset = 0, limit = 100, apps = []) {
    const params = {
      'offset': offset,
      'limit': limit
    }

    const resp = await callKintoneApi(kintone.api.url('/k/v1/apps', true), 'GET', params);
    apps = apps.concat(resp.apps);
    if (resp.apps.length === limit) {
      return await getAppList(offset + limit, limit, apps);
    }
    return apps;
  }

  async function getFieldList(appId) {
    const fieldList = [];
    try {
      const resp = await callKintoneApi('/k/v1/app/form/layout.json', 'GET', { app: appId });
      resp.layout.forEach(row => {
        if (row.type === 'ROW') row.fields.forEach(field => {
          if (field.type !== 'SPACER') {
            fieldList.push(field);
          }
        });
        else if (row.type === 'SUBTABLE') {
          //fieldList.push(row);
          //if (!subTable) return;
          row.fields.forEach(field => {
            if (field.type !== 'SPACER') {
              const fieldInfo = {
                type: field.type,
                code: `${row.code}　${field.code}`,
                label: field.code,
              };
              fieldList.push(fieldInfo);
            }

          })
        }
        else if (row.type === 'GROUP') {
          //fieldList.push(row);
          row.layout.forEach(childRow => childRow.fields.forEach(field => {
            if (field.type !== 'SPACER') {
              const fieldInfo = {
                type: field.type,
                code: `${row.code}　${field.code}`,
                label: field.code,
              };
              fieldList.push(fieldInfo);
            }
          }));
        };
      })

      let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
      let targetArray = Object.values(cybozu.data.page.FORM_DATA.schema.subTable);
      //console.log(targetArray);
      fieldList.forEach(field => {
        const target = fieldList2.find(x => x.var === obj.func.getCodePart(field.code));
        if (target) {
          field.id = target.id;
          field.properties = target.properties;
          field.label = target.label;

        } else {
          targetArray.forEach(target => {
            Object.values(target.fieldList).forEach(targetField => {
              if (obj.func.getCodePart(field.code) === targetField.var) {
                field.label = targetField.label;
              }
            });
          });
        }


      })
    } catch { }
    return fieldList;
  }

  function displayAlert(flag, title, text, type, button) {
    if (flag === '1') {
      swal.fire({
        title: title,
        html: text,
        icon: type,
        confirmButtonText: button,
        customClass: {
          popup: 'my-popup-class',
        }
      });
    } else {
      swal.fire({
        title: title,
        html: text,
        imageUrl: type,
        confirmButtonText: button,
        customClass: {
          popup: 'my-popup-class',
        }
      });
    }
  }

  async function outputCSV(records) {

    records.reverse();
    const fields = await getFieldList(kintone.mobile.app.getId());
    const limitTypes = ['HR', 'LABEL', 'SPACER', 'REFERENCE_TABLE', 'FILE'];
    const fieldList = fields.filter(field => !limitTypes.includes(field.type));
    const processedFields = fieldList
      .filter(field => !limitTypes.includes(field.type))
      .map(field => {
        return `${field.label}`;
      });
    //console.log(processedFields);
    const header = 'レコードの開始行,' + processedFields.join(',') + '\r\n';
    //console.log(header);
    let rowData = '';
    const typeList = ['USER_SELECT', 'ORGANIZATION_SELECT', 'GROUP_SELECT'];
    const typeList2 = ['CHECK_BOX', 'MULTI_SELECT'];
    //console.log(records);
    //console.log(fieldList);

    records.forEach(record => {
      const tableList = [];
      const tableLength = [];
      fieldList.forEach(field => {
        if (field.code.split('　').length === 2) {
          if (record[field.code.split('　')[0]]) {
            const r = tableList.find(x => x === field.code.split('　')[0]);
            if (!r) {
              tableList.push(field.code.split('　')[0]);
              tableLength.push(record[field.code.split('　')[0]].value.length);
            }
          }
        }
      });

      rowData += '*';

      if (tableList.length > 0) {
        for (let i = 0; i < tableList.length; i++) {

          for (let j = 0; j < tableLength[i]; j++) {
            if (rowData.endsWith("*")) {
              rowData += ',';
            } else {
              rowData += '' + ',';
            }

            fieldList.forEach(field => {
              if (field.code.split('　').length === 1) {
                //if (record[field.code].type !== 'FILE') {
                if (typeList.includes(record[field.code].type)) {
                  const userNames = record[field.code].value.map(user => user.code).join(';');
                  rowData += userNames + ',';
                } else if (typeList2.includes(record[field.code].type)) {
                  const value = record[field.code].value.join(';');
                  rowData += value + ',';
                } else {
                  rowData += record[field.code].value + ',';
                }
                //}

              } else {
                const tableCode = field.code.split('　')[0];
                const fieldCode = field.code.split('　')[1];
                if (!record[tableCode]) {
                  //if (record[fieldCode].type !== 'FILE') {
                  if (typeList.includes(record[fieldCode].type)) {
                    const userNames = record[fieldCode].value.map(user => user.code).join(';');
                    rowData += userNames + ',';
                  } else if (typeList2.includes(record[fieldCode].type)) {
                    const value = record[fieldCode].value.join(';');
                    rowData += value + ',';
                  } else {
                    rowData += record[fieldCode].value + ',';
                  }

                  //}
                } else {
                  if (tableCode === tableList[i]) {
                    //if (record[tableCode].value[j].value[fieldCode].type !== 'FILE') {
                    if (typeList.includes(record[tableCode].value[j].value[fieldCode].type)) {
                      const userNames = record[tableCode].value[j].value[fieldCode].value.map(user => user.code).join(';');
                      rowData += userNames + ',';
                    } else if (typeList2.includes(record[tableCode].value[j].value[fieldCode].type)) {
                      const value = record[tableCode].value[j].value[fieldCode].value.join(';');
                      rowData += value + ',';
                    } else {
                      rowData += record[tableCode].value[j].value[fieldCode].value + ',';
                    }
                    // }
                  } else {
                    rowData += '' + ',';
                  }
                }
              }
            });
            rowData += '\r\n';
          }
        }
      } else {
        rowData += ',';
        fieldList.forEach(field => {
          if (field.code.split('　').length === 1) {
            //if (record[field.code].type !== 'FILE') {
            if (typeList.includes(record[field.code].type)) {
              const userNames = record[field.code].value.map(user => user.code).join(';');
              rowData += userNames + ',';
            } else if (typeList2.includes(record[field.code].type)) {
              const value = record[field.code].value.join(';');
              rowData += value + ',';
            } else {
              rowData += record[field.code].value + ',';
            }
            //}

          } else {
            const tableCode = field.code.split('　')[0];
            const fieldCode = field.code.split('　')[1];
            if (!record[tableCode]) {
              //if (record[fieldCode].type !== 'FILE') {
              if (typeList.includes(record[fieldCode].type)) {
                const userNames = record[fieldCode].value.map(user => user.code).join(';');
                rowData += userNames + ',';
              } else if (typeList2.includes(record[fieldCode].type)) {
                const value = record[fieldCode].value.join(';');
                rowData += value + ',';
              } else {
                rowData += record[fieldCode].value + ',';
              }

              //}
            } else {
              if (tableCode === tableList[i]) {
                //if (record[tableCode].value[j].value[fieldCode].type !== 'FILE') {
                if (typeList.includes(record[tableCode].value[j].value[fieldCode].type)) {
                  const userNames = record[tableCode].value[j].value[fieldCode].value.map(user => user.code).join(';');
                  rowData += userNames + ',';
                } else if (typeList2.includes(record[tableCode].value[j].value[fieldCode].type)) {
                  const value = record[tableCode].value[j].value[fieldCode].value.join(';');
                  rowData += value + ',';
                } else {
                  rowData += record[tableCode].value[j].value[fieldCode].value + ',';
                }
                // }
              } else {
                rowData += '' + ',';
              }
            }
          }
        });
        rowData += '\r\n';
      }

    })

    //console.log(rowData);

    const createDataUriFromString = str => {
      // 文字列を配列に変換
      const array = str.split('').map(s => s.charCodeAt());
      // エンコード
      const sjis_array = Encoding.convert(array, 'SJIS', 'UNICODE');
      const uInt8List = new Uint8Array(sjis_array);
      return uInt8List;
    };

    const str = createDataUriFromString(header + rowData);

    //5. CSVファイル作成
    const blob = new Blob([str], { type: "text\/csv" });
    const url = URL.createObjectURL(blob);

    //6. ダウンロード処理
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.download = `data_${timestamp}.csv`;
    a.href = url;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

  }

  kintone.events.on(obj.events1.type, obj.events1.handler);
  kintone.events.on(obj.events2.type, obj.events2.handler);

})(jQuery, kintone.$PLUGIN_ID);
