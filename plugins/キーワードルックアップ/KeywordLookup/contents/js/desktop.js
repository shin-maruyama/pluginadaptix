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


  if (!(await KNTP679310certification())) {
    return;
  }

  const obj = {
    config: kintone.plugin.app.getConfig(PLUGIN_ID),
    showEvents: ['app.record.create.show', 'app.record.edit.show'],
    indexEvents: 'app.record.index.show',


    init: async function (e) {
      if (!Object.keys(obj.config).length) return e;
      obj.jsonParse();
      obj.disabledCopyDestinationFieldDisplayed(e);
      obj.disabledCopyDestinationFieldTableChange();
      obj.execution(obj.config);
      return e;
    },


    jsonParse: function () {
      try {
        obj.config.settings = JSON.parse(obj.config.settings);
        // console.log(obj.config);
      } catch (ignore) {
      }
    },


    getAllRecords: async function (appId) {
      const client = new KintoneRestAPIClient();
      return await client.record.getAllRecords({ app: appId });
    },


    //[画面表示時にコピー先フィールドを編集不可にする]
    disabledCopyDestinationFieldDisplayed: function ({ record }) {
      obj.config.settings.forEach(setting => {
        setting.copyFieldList.forEach(copy => {
          const fieldCode = copy.destinationField;
          obj.disabled(fieldCode, record);
        })
      })
    },

    //[テーブル行追加時にコピー先フィールドを編集不可にする]
    disabledCopyDestinationFieldTableChange: function () {
      const insideTheTableSettings = obj.config.settings.filter(x => x.copyFieldList[0].destinationField.split('　').length === 2);
      insideTheTableSettings.forEach(setting => {

        const tableCode = setting.copyFieldList[0].destinationField.split('　')[0];
        const tableChangeEvent = [
          `app.record.create.change.${tableCode}`,
          `app.record.edit.change.${tableCode}`
        ];
        kintone.events.on(tableChangeEvent, function (e) {
          const { record } = e;

          setting.copyFieldList.forEach(copy => {
            const fieldCode = copy.destinationField;
            obj.disabled(fieldCode, record);
          })
          return e;
        })
      })
    },


    /**
     * @param {String} fieldCode [編集不可にするフィールドコード] 
     * @param {object} record    [フォーム情報] 
     * [取得したフィールドコードを編集不可にする]
     */
    disabled: function (fieldCode, record) {
      const isOutsideTheTable = fieldCode.split('　').length === 1;

      if (isOutsideTheTable) {
        const field = record[fieldCode];
        const isExistingField = field !== undefined;
        if (!isExistingField) return;
        field.disabled = true;
      } else {
        const tableCode = fieldCode.split('　')[0];
        fieldCode = fieldCode.split('　')[1];

        if (record[tableCode]) {
          const tableField = record[tableCode];
          const isExistingTable = tableField !== undefined;
          if (!isExistingTable) return;
          tableField.value.forEach(row => {
            const field = row.value[fieldCode];
            const isExistingField = field !== undefined;
            if (!isExistingField) return;
            field.disabled = true;
          })
        } else {
          const field = record[fieldCode];
          const isExistingField = field !== undefined;
          if (!isExistingField) return;
          field.disabled = true;
        }

      }
    },


    execution: async function ({ settings }) {

      for (let i = 0, len = settings.length; i < len; i++) {
        const setting = settings[i];
        const { appId } = setting;

        const resp = await obj.getAllRecords(appId);

        const destinationRe = await obj.getFieldList(kintone.app.getId());
        const sourceRe = await obj.getFieldList(appId);

        //______________________________________________________
        //  ルックアップを行い指定したフィールドに結果を格納する
        //______________________________________________________

        // const inputFieldOutsideTheTable = setting.inputFieldCode1.split('　').length === 1;
        // const inputFieldInsideTheTable = setting.inputFieldCode1.split('　').length === 2;
        // const searchFieldOutsideTheTable = setting.searchFieldCode1.split('　').length === 1;
        // const searchFieldInsideTheTable = setting.searchFieldCode1.split('　').length === 2;

        let inputFieldOutsideTheTable = true;
        //let  inputFieldInsideTheTable = true;
        let searchFieldOutsideTheTable = true;
        //let  searchFieldInsideTheTable = true;
        if (setting.inputFieldCode1.split('　').length === 2) {
          const table = destinationRe.find((x) => x.code === setting.inputFieldCode1.split('　')[0]);
          if (table.type === 'SUBTABLE') {
            inputFieldOutsideTheTable = false;
          }
        }

        if (setting.searchFieldCode1.split('　').length === 2) {
          const table = sourceRe.find((x) => x.code === setting.searchFieldCode1.split('　')[0]);
          if (table.type === 'SUBTABLE') {
            searchFieldOutsideTheTable = false;
          }
        }

        //[参照元アプリのフィールドがテーブル外で参照先アプリのフィールドがテーブル外の場合]
        if (inputFieldOutsideTheTable && searchFieldOutsideTheTable) {
          obj.inputAndSearchFieldForOutsideTheTable(resp, setting);
        }
        //[参照元アプリのフィールドがテーブル内で参照先アプリのフィールドがテーブル外の場合]
        else if (!inputFieldOutsideTheTable && searchFieldOutsideTheTable) {
          obj.inputFieldOnlyTable(resp, setting);
        }
        //[参照元アプリのフィールドがテーブル外で参照先アプリのフィールドがテーブル内の場合]
        else if (inputFieldOutsideTheTable && !searchFieldOutsideTheTable) {
          obj.searchFieldOnlyTable(resp, setting);
        }
        //[参照元アプリのフィールドがテーブル内で参照先アプリのフィールドがテーブル内の場合]
        else if (!inputFieldOutsideTheTable && !searchFieldOutsideTheTable) {
          obj.inputAndSearchFieldForInsideTheTable(resp, setting);
        }

      }
    },


    inputAndSearchFieldForOutsideTheTable: function (resp, setting) {
      //イベント作成
      const changeEvents = obj.createFieldChangeEvent({ setting });

      kintone.events.on(changeEvents, function (e) {
        const { record: referencesRecord } = e;

        const referentRecord = resp.slice();

        //[入力フィールド]
        const input = {
          field1: referencesRecord[obj.getCodePart(setting.inputFieldCode1)],
          field2: referencesRecord[obj.getCodePart(setting.inputFieldCode2)],
          field3: referencesRecord[obj.getCodePart(setting.inputFieldCode3)]
        };
        //[検索先フィールド]
        const search = {
          field1: referentRecord[0][obj.getCodePart(setting.searchFieldCode1)],
          field2: referentRecord[0][obj.getCodePart(setting.searchFieldCode2)],
          field3: referentRecord[0][obj.getCodePart(setting.searchFieldCode3)]
        };
        //[ルックアップし絞り込みを行う]
        const filteredReferentRecord = obj.filterRecordOrRowOfTable(input, search, referentRecord, setting);

        //[フィールドのコピー設定行数分ループ]
        for (let j = 0, len = setting.copyFieldList.length; j < len; j++) {
          //debugger;
          const copyField = setting.copyFieldList[j];
          const copyDestinationField = referencesRecord[obj.getCodePart(copyField.destinationField)];
          if (filteredReferentRecord[0] === undefined) {
            switch (copyDestinationField.type) {
              case 'CHECK_BOX':
              case 'MULTI_SELECT':
              case 'USER_SELECT':
              case 'ORGANIZATION_SELECT':
              case 'GROUP_SELECT':
                copyDestinationField.value = [];
                break;
              default:
                copyDestinationField.value = '';
                break;
            }
            //break;
          }else{
            const copySourceField = filteredReferentRecord[0][obj.getCodePart(copyField.sourceField)];
            const isExistingField = copyDestinationField && copySourceField;
  
            if (!isExistingField) continue;
            //[コピー元フィールドの値をコピー先フィールドに格納]
            copyDestinationField.value = copySourceField.value;
          }
        }
        return e;
      });
    },


    inputFieldOnlyTable: function (resp, setting) {
      //イベント作成
      const changeEvents = obj.createFieldChangeEvent({ setting, insideTheTable: true });

      kintone.events.on(changeEvents, function (e) {

        const { value: changeRow } = e.changes.row;

        const referentRecord = resp.slice();

        //[入力フィールド]
        const input = {
          field1: changeRow[setting.inputFieldCode1.split('　')[1]],
          field2: changeRow[setting.inputFieldCode2.split('　')[1]],
          field3: changeRow[setting.inputFieldCode3.split('　')[1]]
        };
        //[検索先フィールド]
        const search = {
          field1: referentRecord[0][obj.getCodePart(setting.searchFieldCode1)],
          field2: referentRecord[0][obj.getCodePart(setting.searchFieldCode2)],
          field3: referentRecord[0][obj.getCodePart(setting.searchFieldCode3)]
        };
        //[ルックアップし絞り込みを行う]
        const filteredReferentRecord = obj.filterRecordOrRowOfTable(input, search, referentRecord, setting);

        //[フィールドのコピー設定行数分ループ]
        for (let j = 0, len = setting.copyFieldList.length; j < len; j++) {


          const copyField = setting.copyFieldList[j];
          const copyDestinationField = changeRow[copyField.destinationField.split('　')[1]];
          if (filteredReferentRecord[0] === undefined) {
            switch (copyDestinationField.type) {
              case 'CHECK_BOX':
              case 'MULTI_SELECT':
              case 'USER_SELECT':
              case 'ORGANIZATION_SELECT':
              case 'GROUP_SELECT':
                copyDestinationField.value = [];
                break;
              default:
                copyDestinationField.value = '';
                break;
            }
            //break;
          }else{
            const copySourceField = filteredReferentRecord[0][obj.getCodePart(copyField.sourceField)];
            const isExistingField = copyDestinationField && copySourceField;
  
            if (!isExistingField) continue;
            //[コピー元フィールドの値をコピー先フィールドに格納]
            copyDestinationField.value = copySourceField.value;
          }

        }
        return e;
      });

    },


    searchFieldOnlyTable: function (resp, setting) {
      //イベント作成
      const changeEvents = obj.createFieldChangeEvent({ setting });

      kintone.events.on(changeEvents, function (e) {
        const { record: referencesRecord } = e;

        const tableCode = setting.searchFieldCode1.split('　')[0];
        const referentRecord = resp.slice();
        const tableListRecord = referentRecord.map(x => x[tableCode]);
        const allRowForTable = [];

        tableListRecord.forEach(x =>
          x.value.forEach(y => allRowForTable.push(y.value))
        );

        //[入力フィールド]
        const input = {
          field1: referencesRecord[obj.getCodePart(setting.inputFieldCode1)],
          field2: referencesRecord[obj.getCodePart(setting.inputFieldCode2)],
          field3: referencesRecord[obj.getCodePart(setting.inputFieldCode3)]
        };
        //[検索先フィールド]
        const search = {
          field1: allRowForTable[0][setting.searchFieldCode1.split('　')[1]],
          field2: allRowForTable[0][setting.searchFieldCode2.split('　')[1]],
          field3: allRowForTable[0][setting.searchFieldCode3.split('　')[1]]
        };
        //[ルックアップし絞り込みを行う]
        const filteredAllRowForTable = obj.filterRecordOrRowOfTable(input, search, allRowForTable, setting);

        //[フィールドのコピー設定行数分ループ]
        for (let j = 0, len = setting.copyFieldList.length; j < len; j++) {

          const copyField = setting.copyFieldList[j];
          const copyDestinationField = referencesRecord[obj.getCodePart(copyField.destinationField)];
          if (filteredAllRowForTable[0] === undefined) {
            switch (copyDestinationField.type) {
              case 'CHECK_BOX':
              case 'MULTI_SELECT':
              case 'USER_SELECT':
              case 'ORGANIZATION_SELECT':
              case 'GROUP_SELECT':
                copyDestinationField.value = [];
                break;
              default:
                copyDestinationField.value = '';
                break;
            }
            //break;
          }else{
            const copySourceField = filteredAllRowForTable[0][copyField.sourceField.split('　')[1]];
            const isExistingField = copyDestinationField && copySourceField;
  
            if (!isExistingField) continue;
            //[コピー元フィールドの値をコピー先フィールドに格納]
            copyDestinationField.value = copySourceField.value;
          }
        }
        return e;
      });
    },


    inputAndSearchFieldForInsideTheTable: function (resp, setting) {
      //イベント作成
      const changeEvents = obj.createFieldChangeEvent({ setting, insideTheTable: true });

      kintone.events.on(changeEvents, function (e) {

        const { value: changeRow } = e.changes.row;

        const tableCode = setting.searchFieldCode1.split('　')[0];
        const referentRecord = resp.slice();
        const tableListRecord = referentRecord.map(x => x[tableCode]);
        const allRowForTable = [];

        tableListRecord.forEach(x =>
          x.value.forEach(y => allRowForTable.push(y.value))
        );

        //[入力フィールド]
        const input = {
          field1: changeRow[setting.inputFieldCode1.split('　')[1]],
          field2: changeRow[setting.inputFieldCode2.split('　')[1]],
          field3: changeRow[setting.inputFieldCode3.split('　')[1]]
        };
        //[検索先フィールド]
        const search = {
          field1: allRowForTable[0][setting.searchFieldCode1.split('　')[1]],
          field2: allRowForTable[0][setting.searchFieldCode2.split('　')[1]],
          field3: allRowForTable[0][setting.searchFieldCode3.split('　')[1]]
        };
        //[ルックアップし絞り込みを行う]
        const filteredAllRowForTable = obj.filterRecordOrRowOfTable(input, search, allRowForTable, setting);

        //[フィールドのコピー設定行数分ループ]
        for (let j = 0, len = setting.copyFieldList.length; j < len; j++) {
          const copyField = setting.copyFieldList[j];
          const copyDestinationField = changeRow[copyField.destinationField.split('　')[1]];
          if (filteredAllRowForTable[0] === undefined) {
            switch (copyDestinationField.type) {
              case 'CHECK_BOX':
              case 'MULTI_SELECT':
              case 'USER_SELECT':
              case 'ORGANIZATION_SELECT':
              case 'GROUP_SELECT':
                copyDestinationField.value = [];
                break;
              default:
                copyDestinationField.value = '';
                break;
            }

            //break;
          }else{
            const copySourceField = filteredAllRowForTable[0][copyField.sourceField.split('　')[1]];
            const isExistingField = copyDestinationField && copySourceField;
  
            if (!isExistingField) continue;
            //[コピー元フィールドの値をコピー先フィールドに格納]
            copyDestinationField.value = copySourceField.value;
          }
        
        }
        return e;
      });
    },


    /**
     * [チェンジイベント作成]
     * @param {Array}   setting        [プラグインの設定]
     * @param {boolean} insideTheTable [テーブル内フィールドのイベントを作成true テーブル外false] 
     * @returns [チェンジイベントリスト]
     */
    createFieldChangeEvent: function ({ setting, insideTheTable = false }) {
      if (insideTheTable) {
        return [
          `app.record.create.change.${setting.inputFieldCode1.split('　')[1]}`,
          `app.record.create.change.${setting.inputFieldCode2.split('　')[1]}`,
          `app.record.create.change.${setting.inputFieldCode3.split('　')[1]}`,
          `app.record.edit.change.${setting.inputFieldCode1.split('　')[1]}`,
          `app.record.edit.change.${setting.inputFieldCode2.split('　')[1]}`,
          `app.record.edit.change.${setting.inputFieldCode3.split('　')[1]}`
        ];
      } else {
        return [
          `app.record.create.change.${obj.getCodePart(setting.inputFieldCode1)}`,
          `app.record.create.change.${obj.getCodePart(setting.inputFieldCode2)}`,
          `app.record.create.change.${obj.getCodePart(setting.inputFieldCode3)}`,
          `app.record.edit.change.${obj.getCodePart(setting.inputFieldCode1)}`,
          `app.record.edit.change.${obj.getCodePart(setting.inputFieldCode2)}`,
          `app.record.edit.change.${obj.getCodePart(setting.inputFieldCode3)}`
        ];
      }
    },


    /**
     * [ルックアップし絞り込みを行う]
     * @param {object} input        [入力フィールド]
     * @param {object} search       [検索先フィールド]
     * @param {Array}  targetArray  [絞り込み対象リスト]
     * @param {Array}  setting      [プラグインの設定]
     * @returns [絞り込みを行った場合は、絞り込んだリストを返す。　行っていない場合はundefinedを返す]
     */
    filterRecordOrRowOfTable: function (input, search, targetArray, setting) {
      //[フィールドが存在するか]
      const isExistingField1 = input.field1 && search.field1;
      const isExistingField2 = input.field2 && search.field2;
      const isExistingField3 = input.field3 && search.field3;
      //[テーブル内のフィールドか]
      // const isInsideTheTable1 = setting.searchFieldCode1.split('　').length === 2;
      // const isInsideTheTable2 = setting.searchFieldCode2.split('　').length === 2;
      // const isInsideTheTable3 = setting.searchFieldCode3.split('　').length === 2;
      //[検索先フィールドコードの格納]
      // const searchFieldCode1 = isInsideTheTable1 ? setting.searchFieldCode1.split('　')[1] : setting.searchFieldCode1;
      // const searchFieldCode2 = isInsideTheTable2 ? setting.searchFieldCode2.split('　')[1] : setting.searchFieldCode2;
      // const searchFieldCode3 = isInsideTheTable3 ? setting.searchFieldCode3.split('　')[1] : setting.searchFieldCode3;
      const searchFieldCode1 = obj.getCodePart(setting.searchFieldCode1);
      const searchFieldCode2 = obj.getCodePart(setting.searchFieldCode2);
      const searchFieldCode3 = obj.getCodePart(setting.searchFieldCode3);

      let isFiltered = false;

      if (isExistingField1) {
        const inputFieldValue1 = input.field1.value;

        targetArray = targetArray.filter(function (record) {
          if (record[searchFieldCode1].type === 'USER_SELECT' && input.field1.type === 'USER_SELECT') {
            if (!(record[searchFieldCode1].value.length && inputFieldValue1.length)) return false;
            if (record[searchFieldCode1].value[0].code !== inputFieldValue1[0].code) return false;
            return true;
          } else {
            if (record[searchFieldCode1].value !== inputFieldValue1) return false;
            return true;
          }
        });
        isFiltered = true;
      }

      if (isExistingField2) {
        const inputFieldValue2 = input.field2.value;

        targetArray = targetArray.filter(function (record) {
          if (record[searchFieldCode2].type === 'USER_SELECT' && input.field2.type === 'USER_SELECT') {
            if (!(record[searchFieldCode2].value.length && inputFieldValue2.length)) return false;
            if (record[searchFieldCode2].value[0].code !== inputFieldValue2[0].code) return false;
            return true;
          } else {
            if (record[searchFieldCode2].value !== inputFieldValue2) return false;
            return true;
          }
        });
        isFiltered = true;
      }

      if (isExistingField3) {
        const inputFieldValue3 = input.field3.value;

        targetArray = targetArray.filter(function (record) {
          if (record[searchFieldCode3].type === 'USER_SELECT' && input.field3.type === 'USER_SELECT') {
            if (!(record[searchFieldCode3].value.length && inputFieldValue3.length)) return false;
            if (record[searchFieldCode3].value[0].code !== inputFieldValue3[0].code) return false;
            return true;
          } else {
            if (record[searchFieldCode3].value !== inputFieldValue3) return false;
            return true;
          }
        });
        isFiltered = true;
      }

      if (isFiltered) {
        return targetArray;
      } else {
        return undefined;
      }
    },

    getCodePart: function (code) {
      const parts = code.split('　');
      return parts.length === 2 ? parts[1] : code;
    },

    getFieldList: async function (appId) {
      const fieldList = [];
      try {
        const resp = await callKintoneApi('/k/v1/app/form/layout.json', 'GET', { app: appId });
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
      } catch { }
      return fieldList;
    },

    getAllApps: async function (offset = 0, appList = []) {
      const client = new KintoneRestAPIClient();
      try {
        const resp = await client.app.getApps({ offset });
        appList.push(...resp.apps);
        if (resp.apps.length === 100)
          return obj.getAllApps(offset + 100, appList);
      } catch { }
      return appList;
    },

    displayAlert: function (flag, title, text, type, button) {
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
    },

    checkFields: async function (e) {
      const destinationFields = await obj.getFieldList(kintone.app.getId());
      const appList = await obj.getAllApps();

      if (!Object.keys(obj.config).length) return e;

      obj.jsonParse();

      if (!appList || !appList.length) return e;

      const { settings } = obj.config;
      const missingFields = [];

      for (const setting of settings) {
        const appId = setting.appId;

        if (!appId || appId === '') return e;

        const app = appList.find((x) => x.appId === appId);

        if (!app) {
          obj.displayAlert(
            '1',
            'エラー',
            '「キーワードルックアッププラグイン」に設定済みの<br>関連付けるアプリが削除された、または参照できないため、処理を継続出来ません。<br><br>' +
            '対象アプリ：<br>' +
            `・[関連付けるアプリ] ${appId}` +
            '<br><br>プラグイン設定を修正してください。',
            'error',
            'OK'
          );
          return false;
        }

        const sourceFields = await obj.getFieldList(appId);

        const addMissingDestinationField = function (label, fieldCode) {
          if (!fieldCode || fieldCode === '') return;
          const field = destinationFields.find((x) => x.code === fieldCode);
          if (!field) {
            missingFields.push(`${label} ${fieldCode}`);
          }
        };

        const addMissingSourceField = function (label, fieldCode) {
          if (!fieldCode || fieldCode === '') return;
          const field = sourceFields.find((x) => x.code === fieldCode);
          if (!field) {
            missingFields.push(`${label} ${fieldCode}`);
          }
        };

        addMissingDestinationField('[入力フィールド1]', setting.inputFieldCode1);
        addMissingDestinationField('[入力フィールド2]', setting.inputFieldCode2);
        addMissingDestinationField('[入力フィールド3]', setting.inputFieldCode3);

        addMissingSourceField('[検索先フィールド1]', setting.searchFieldCode1);
        addMissingSourceField('[検索先フィールド2]', setting.searchFieldCode2);
        addMissingSourceField('[検索先フィールド3]', setting.searchFieldCode3);

        if (setting.copyFieldList && setting.copyFieldList.length > 0) {
          setting.copyFieldList.forEach((copyField, index) => {
            addMissingDestinationField(`[コピー先${index + 1}]`, copyField.destinationField);
            addMissingSourceField(`[コピー元${index + 1}]`, copyField.sourceField);
          });
        }
      }

      const uniqueMissingFields = [...new Set(missingFields)];

      if (uniqueMissingFields.length > 0) {
        const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
        const fieldHtml = uniqueMissingFields
          .map((code) => `・${code}`)
          .join('<br>');

        obj.displayAlert(
          '2',
          '警告',
          '「キーワードルックアッププラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          fieldHtml +
          '<br><br>プラグイン設定を修正してください。',
          imageUrl,
          'OK'
        );
      }

      return e;
    },

  }

  kintone.events.on(obj.showEvents, obj.init);
  kintone.events.on(obj.indexEvents, obj.checkFields);

})(jQuery, kintone.$PLUGIN_ID);