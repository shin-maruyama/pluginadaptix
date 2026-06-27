// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP295210certification())) {
    return;
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (Object.keys(config).length) {
    config.lookupField = JSON.parse(config.lookupField);
    config.fields = JSON.parse(config.fields);
    config.isTable = JSON.parse(config.isTable);
  } else {
    return false;
  }

  const obj = {};

  obj.events = [];

  obj.createEvents = function () {
    if (Object.keys(config).length) {
      if (config.lookupField.copyField && config.lookupField.copyField !== '') {
        obj.events.push('app.record.create.change.' + obj.getCodePart(config.lookupField.copyField));
        obj.events.push('app.record.edit.change.' + obj.getCodePart(config.lookupField.copyField));
      }
    }
    };

  obj.eventStart = async function () {
    let that = this;

    if (!config.lookupField || !config.lookupField.appId) return;
    const allRecords = await that.getAllRecords(config.lookupField.appId);

    kintone.events.on('app.record.index.show', async function () {
      if (!config.fields || !config.fields.length) return;

      const destinationList = await that.getFieldList(kintone.app.getId());
      const sourceList = await that.getFieldList(config.lookupField.appId);
      const missingFields = [];

      if (config.lookupField && config.lookupField.code) {
        const lookupField = destinationList.find((x) => x.code === config.lookupField.code);
        if (!lookupField) {
          missingFields.push(`[対象ルックアップフィールド] ${config.lookupField.code}`);
        }
      }

      config.fields.forEach(field => {
        if (field.sourceField && field.sourceField !== '') {
          const sourceField = sourceList.find((x) => x.code === field.sourceField);
          if (!sourceField) {
            missingFields.push(`[コピーフィールド コピー元] ${field.sourceField}`);
          }
        }

        if (field.destinationField && field.destinationField !== '') {
          const destinationField = destinationList.find((x) => x.code === field.destinationField);
          if (!destinationField) {
            missingFields.push(`[コピーフィールド コピー先] ${field.destinationField}`);
          }
        }
      });

      const uniqueMissingFields = [...new Set(missingFields)];

      if (uniqueMissingFields.length > 0) {
        const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
        const fieldHtml = uniqueMissingFields
          .map((code) => `・${code}`)
          .join('<br>');

        that.displayAlert(
          '2',
          '警告',
          '「ルックアップ連動プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          fieldHtml +
          '<br><br>プラグイン設定を修正してください。',
          imageUrl,
          'OK'
        );
      }
    });
    //対象ルックアップフィールドの、「ほかのフィールドのコピー」に設定がないときにエラーを表示する。
    kintone.events.on(['app.record.create.show','app.record.edit.show'], async function (event) {
      const resp = await kintone.api(kintone.api.url('/k/v1/app/form/fields', true),'GET',{ app: kintone.app.getId()})
      const fields = resp.properties;
      const arr = fields[config.lookupField.code].lookup.fieldMappings.filter(x => x.field == config.lookupField.copyField)
    
      if(!config.lookupField.copyField || config.lookupField.copyField === '' || arr.length == 0){
        const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
        const errMesseage = config.lookupField.code + '(ルックアップフィールド)の<br>「ほかのフィールドのコピー」に設定がないため<br>「ルックアップ連動プラグイン」は作動しません。<br>フォームで設定しても一度、設定画面で保存する必要があります。'
        obj.displayAlert('2', '警告', errMesseage, imageUrl, 'OK');
      }
    });

    kintone.events.on(that.events, function (event) {

      setTimeout(function () {
        const value = kintone.app.record.get().record[config.lookupField.code].value;
        const allRecords = that.getAllRecords(config.lookupField.appId);
      }, 500);

      if (that.isInTable(event.record, config.lookupField.code)) {
        const code = that.getCodePart(config.lookupField.code);
        if (!event.changes.row.value[code] || !event.changes.row.value[code].value) return;
        var lookupText = event.changes.row.value[code].value;
      } else {
        const code = that.getCodePart(config.lookupField.code);
        if (!event.record[code] || !event.record[code].value) return;
        var lookupText = event.record[code].value;
      }

      const referentRecord = allRecords.slice();
      const sourceRecord = that.filterRecord(lookupText, referentRecord);

      try {
        if (!config.fields || !config.fields.length) return event;
        if (!sourceRecord) return;
        config.fields.forEach(field => {

          const destinationFieldSplit = field.destinationField.split('　');
          const destinationFieldName = destinationFieldSplit.length === 1 ? destinationFieldSplit[0] : destinationFieldSplit[1];
          let destinationFieldTableCode = '';
          if (destinationFieldSplit.length !== 1) {
             destinationFieldTableCode = destinationFieldSplit[0];
            if (!event.record[destinationFieldTableCode]) destinationFieldTableCode = '';
          }

          const sourceFieldSplit = field.sourceField.split('　');
          const sourceFieldName = sourceFieldSplit.length === 1 ? sourceFieldSplit[0] : sourceFieldSplit[1];
          let sourceFieldTableCode = '';
          if (sourceFieldSplit.length !== 1) {
             sourceFieldTableCode = sourceFieldSplit[0];
            if (!sourceRecord[sourceFieldTableCode]) sourceFieldTableCode = '';
          }

          if (sourceFieldTableCode == '') {
            if (destinationFieldTableCode == '') {
              event.record[destinationFieldName].value = sourceRecord[sourceFieldName].value;
            } else {
              const destinationTable = destinationFieldTableCode;
              const destinationField = destinationFieldName
              event.record[destinationTable].value[0].value[destinationField].value = sourceRecord[sourceFieldName].value;
            }
          } else {
            const sourceTable = sourceFieldTableCode;
            const sourceField = sourceFieldName;
            if (destinationFieldTableCode == '') {
              event.record[destinationFieldName].value = sourceRecord[sourceTable].value[0].value[sourceField].value;
            } else {
              const destinationTable = destinationFieldTableCode;
              const destinationField = destinationFieldName;
              const sourceRows = sourceRecord[sourceTable].value.length;
              const destinationRows = event.record[destinationTable].value.length;
              if (sourceRows > destinationRows) {
                for (let j = 0; j < destinationRows; j++) {
                  const row = sourceRecord[sourceTable].value[j];

                  if (event.record[destinationTable].value[j].value.hasOwnProperty(destinationField) && row.value[sourceField]) {
                    event.record[destinationTable].value[j].value[destinationField].value = row.value[sourceField].value;
                  }
                }

                for (let j = destinationRows; j < sourceRows; j++) {
                  const row = sourceRecord[sourceTable].value[j];
                  const newRow = { value: {} };

                  const destinationFields = event.record[destinationTable].value[0].value;
                  Object.keys(destinationFields).forEach(field => {
                    let value;
                    switch (destinationFields[field].type) {
                      case 'CHECK_BOX':
                      case 'MULTI_SELECT':
                      case 'USER_SELECT':
                      case 'ORGANIZATION_SELECT':
                      case 'GROUP_SELECT':
                        value = [];
                        break;
                      default:
                        value = '';
                        break;
                    }
                    newRow.value[field] = {
                      type: destinationFields[field].type,
                      value: value
                    };
                  });

                  if (newRow.value.hasOwnProperty(destinationField) && row.value[sourceField]) {
                    newRow.value[destinationField].value = row.value[sourceField].value;
                    newRow.value[destinationField].type = row.value[sourceField].type || newRow.value[destinationField].type;
                  }

                  event.record[destinationTable].value.push({ id: null, value: newRow.value });
                }

              } else {
                for (let j = 0; j < sourceRows; j++) {
                  const row = sourceRecord[sourceTable].value[j];
                  if (event.record[destinationTable].value[j].value.hasOwnProperty(destinationField) && row.value[sourceField]) {
                    event.record[destinationTable].value[j].value[destinationField].value = row.value[sourceField].value;
                  }
                }
              }


            }

          }
        })

      } catch (error) {
        console.error('Error:', error);
      }

      return event;
    });

  };


  obj.isInTable = function (record, code) {
    if (code.split('　').length === 2) {
      if (record[code.split('　')[0]]) {
        return true;
      }
    }
    return false;
  };




  obj.getCodePart = function (code) {
    const parts = code.split('　');
    return parts.length === 2 ? parts[1] : code;
  }

  obj.getAllRecords = async function (appId) {
    const client = new KintoneRestAPIClient();
    return await client.record.getAllRecords({ app: appId });
  }

  obj.filterRecord = function (text, targetArray) {
    targetArray = targetArray.filter(function (record) {
      return record[config.lookupField.key].value === text;
    });
    return targetArray[0];
  };


  obj.getFieldList = async function (appId) {
    const fieldList = [];
    const fieldList2 = [
      ...Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList),
      ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
    ];

    try {
      const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
        app: appId,
      });
      resp.layout.forEach((row) => {
        if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push(field));
        else if (row.type === 'SUBTABLE') {
          fieldList.push(row);
          row.fields.forEach((field) => {
            const fieldInfo = {
              type: field.type,
              code: `${row.code}　${field.code}`,
            };
            fieldList.push(fieldInfo);
          });
        } else if (row.type === 'GROUP') {
          fieldList.push(row);
          row.layout.forEach((childRow) => childRow.fields.forEach((field) => {
            fieldList.push({
              type: field.type,
              code: row.code + '　' + field.code,
            })
          }
          ));
        }
      });
    } catch (error) {
      console.log(error);
    }

    return fieldList;
  };

  obj.getAllApps = async function (offset = 0, appList = []) {
    const client = new KintoneRestAPIClient();
    try {
      const resp = await client.app.getApps({ offset });
      appList.push(...resp.apps);
      if (resp.apps.length === 100)
        return obj.getAllApps(offset + 100, appList);
    } catch { }
    return appList;
  };

  obj.displayAlert = function (flag, title, text, type, button) {
    if (flag === '1') {
      swal.fire({
        title: title,
        html: text,
        icon: type,
        confirmButtonText: button,
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

  };

  obj.createEvents();
  obj.eventStart();

})(jQuery, kintone.$PLUGIN_ID);
