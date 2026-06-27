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


  if (!(await KNTP183610certification())) {
    return;
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (Object.keys(config).length) {
    config.settings = JSON.parse(config.settings);
  } else {
    return false;
  }

  const obj = {};

  obj.eventStart = function () {
    let that = this;
    kintone.events.on('app.record.index.show', async function () {
      if (!config.settings || !config.settings.length) return;

      const apps = await that.getAllApps();
      if (!apps) return;

      const missingFields = [];

      for (let i = 0; i < config.settings.length; i++) {
        const setting = config.settings[i];

        if (setting.appId && setting.appId !== '') {
          const app = apps.find((x) => x.appId === setting.appId);
          if (!app) {
            that.displayAlert(
              '1',
              'エラー',
              '「サブテーブルコピープラグイン」に設定済みのコピー元アプリが削除された、または参照できないため、処理を継続出来ません。<br><br>' +
              '対象アプリ：<br>' +
              `・[コピー元アプリ] ${setting.appId}` +
              '<br><br>プラグイン設定を修正してください。',
              'error',
              'OK'
            );
            return false;
          }
        }

        if (!setting.appId || setting.appId === '') continue;

        const sourceList = await that.getFieldList(setting.appId);
        const destinationList = await that.getFieldList(kintone.app.getId());

        if (setting.sourceTable && setting.sourceTable !== '') {
          const sourceTable = sourceList.find((x) => x.code === setting.sourceTable);
          if (!sourceTable) {
            missingFields.push(`[コピー元テーブル] ${setting.sourceTable}`);
          }
        }

        if (setting.destinationTable && setting.destinationTable !== '') {
          const destinationTable = destinationList.find((x) => x.code === setting.destinationTable);
          if (!destinationTable) {
            missingFields.push(`[コピー先テーブル] ${setting.destinationTable}`);
          }
        }

        if (setting.fields && setting.fields.length > 0) {
          setting.fields.forEach((field, index) => {
            if (field.sourceField && field.sourceField !== '') {
              const sourceField = sourceList.find((x) => x.code === field.sourceField);
              if (!sourceField) {
                missingFields.push(`[コピー元テーブル内フィールド${index + 1}] ${field.sourceField}`);
              }
            }

            if (field.destinationField && field.destinationField !== '') {
              const destinationField = destinationList.find((x) => x.code === field.destinationField);
              if (!destinationField) {
                missingFields.push(`[コピー先テーブル内フィールド${index + 1}] ${field.destinationField}`);
              }
            }
          });
        }
      }

      const uniqueMissingFields = [...new Set(missingFields)];

      if (uniqueMissingFields.length > 0) {
        const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
        const fieldHtml = uniqueMissingFields
          .map((code) => `・${code}`)
          .join('<br>');

        that.displayAlert(
          '2',
          '警告',
          '「サブテーブルコピープラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          fieldHtml +
          '<br><br>プラグイン設定を修正してください。',
          imageUrl,
          'OK'
        );
      }

    });


    kintone.events.on(['app.record.create.show', 'app.record.edit.show'], async function (event) {
      //console.log(event.record);
      try {

        //プラグイン情報から、現存しないアプリIDを持つ設定を除外する。
        const allApps = await obj.getAllApps()
        const allAppsId = allApps.map((x) => {return x.appId})
        config.settings = config.settings.filter((y) => {return allAppsId.includes(y.appId)})
        const layout = await callKintoneApi('/k/v1/app/form/layout.json', 'GET', { app: kintone.app.getId() })
        
        if (!config.settings || !config.settings.length) return event;

        for (let i = 0; i < config.settings.length; i++) {
          if(!config.settings[i].appId || config.settings[i].appId === '') continue;
          const sourceRecord = await that.getRecord(config.settings[i].appId);
          //console.log('Source Record:', sourceRecord);

          if (!sourceRecord) continue;

          const sourceTable = config.settings[i].sourceTable;
          const destinationTable = config.settings[i].destinationTable;

          if (!sourceRecord[sourceTable] || !event.record[destinationTable]) continue;

          if (sourceRecord[sourceTable].value.length > 0) {
            const rows = sourceRecord[sourceTable].value.length;
            const destinationRows = event.record[destinationTable].value.length;

            if (rows > destinationRows) {
              for (let j = 0; j < destinationRows; j++) {
                const row = sourceRecord[sourceTable].value[j];
                for (let k = 0; k < config.settings[i].fields.length; k++) {
                  const sourceField = config.settings[i].fields[k].sourceField.split('　')[1];
                  const destinationField = config.settings[i].fields[k].destinationField.split('　')[1];

                  if (event.record[destinationTable].value[j].value.hasOwnProperty(destinationField) && row.value[sourceField]) {
                    event.record[destinationTable].value[j].value[destinationField].value = row.value[sourceField].value;
                  }
                }
              }

              for (let j = destinationRows; j < rows; j++) {
                const row = sourceRecord[sourceTable].value[j];
                const newRow = { value: {} };
                const targetTable = layout.layout.filter((x) => {return x.code == destinationTable})

                targetTable[0].fields.forEach(field => {
                  let value;
                  switch (field.type) {
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
                  newRow.value[field.code] = {
                    type: field.type,
                    value: value
                  };
                });

                for (let k = 0; k < config.settings[i].fields.length; k++) {
                  const sourceField = config.settings[i].fields[k].sourceField.split('　')[1];
                  const destinationField = config.settings[i].fields[k].destinationField.split('　')[1];

                  if (newRow.value.hasOwnProperty(destinationField) && row.value[sourceField]) {
                    newRow.value[destinationField].value = row.value[sourceField].value;
                    newRow.value[destinationField].type = row.value[sourceField].type || newRow.value[destinationField].type;
                  }
                }


                event.record[destinationTable].value.push({ id: null, value: newRow.value });
              }

            } else {
              for (let j = 0; j < rows; j++) {
                const row = sourceRecord[sourceTable].value[j];
                for (let k = 0; k < config.settings[i].fields.length; k++) {
                  const sourceField = config.settings[i].fields[k].sourceField.split('　')[1];
                  const destinationField = config.settings[i].fields[k].destinationField.split('　')[1];

                  if (event.record[destinationTable].value[j].value.hasOwnProperty(destinationField) && row.value[sourceField]) {
                    event.record[destinationTable].value[j].value[destinationField].value = row.value[sourceField].value;
                  }
                }
              }
            }
          }
        }

      } catch (error) {
        console.error('Error:', error);
      }

      return event;
    });

  };


  obj.getRecord = async function (appId) {
    var query = 'order by $id desc limit 1';
    var params = {
      app: appId,
      query: query
    };

    try {
      const resp = await callKintoneApi(kintone.api.url('/k/v1/records', true), 'GET', params);
      if (resp.records.length > 0) {
        return resp.records[0];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }


  obj.getFieldList = async function (appId) {
    const fieldList = [];
    try {
      const resp = await callKintoneApi('/k/v1/app/form/layout.json', 'GET', { app: appId });
      resp.layout.forEach(row => {
        if (row.type === 'SUBTABLE') {
          fieldList.push(row);
          row.fields.forEach(field => {
            const fieldInfo = {
              type: field.type,
              code: `${row.code}　${field.code}`,
            };
            fieldList.push(fieldInfo);
          })
        }
      })
    } catch { }
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
      });
    }

  };


  obj.eventStart();

})(jQuery, kintone.$PLUGIN_ID);
