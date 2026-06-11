// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP276110certification())) {
    return;
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  //[JSON型に変換]
  if (Object.keys(config).length) {
    config.settings = JSON.parse(config.settings);
  } else {
    return false;
  }
  const { settings } = config;
  const total = {};

  total.eventStart = function () {
    let that = this;


    kintone.events.on('app.record.index.show', async function (event) {

      const button = document.createElement('button');
      button.textContent = 'ユーザー選択更新';
      button.id = 'user_update_button';
      button.onclick = onClickButton;

      if (!document.getElementById('user_update_button')) {
        var space = kintone.app.getHeaderMenuSpaceElement();
        space.appendChild(button);
      }

      const { records } = event;

      await that.checkFields(event);

      async function onClickButton() {

        const body = {
          app: kintone.app.getId(),
          records: [],
        };

        const allUsers = await that.getAllUsers();
        if (!allUsers) return;

        for (const record of records) {
          const recordObj = {
            id: record['$id'].value,
            record: {},
          };

          for (const setting of settings) {
            if (that.existenceCheck(setting, { record })) continue;
            const staffCode = setting.staffSelect.split('　').length === 1 ? setting.staffSelect : setting.staffSelect.split('　')[1];
            const staffSelect = record[staffCode];
            if (!staffSelect) continue;

            //テーブル・グループ内ではない場合
            if (setting.userSelect.split('　').length === 1) {
              if (staffSelect.type === 'CREATOR' || staffSelect.type === 'MODIFIER') {
                const result = that.checkUser(allUsers, staffSelect);
                if (result) {
                  recordObj.record[setting.userSelect] = {};
                  recordObj.record[setting.userSelect].value = [{ code: result }];;
                } else {
                  const result = { code: 'taisyoku', name: '退職者' };
                  recordObj.record[setting.userSelect] = {};
                  recordObj.record[setting.userSelect].value = [{ code: result.code }];;
                }
              }
            } else {
              const tableCode = setting.userSelect.split('　')[0];
              const userCode = setting.userSelect.split('　')[1];
              //グループ内の場合
              if (!record[tableCode]) {
                if (staffSelect.type === 'CREATOR' || staffSelect.type === 'MODIFIER') {
                  const result = that.checkUser(allUsers, staffSelect);
                  if (result) {
                    recordObj.record[userCode] = {};
                    recordObj.record[userCode].value = [{ code: result }];;
                  } else {
                    const result = { code: 'taisyoku', name: '退職者' };
                    recordObj.record[userCode] = {};
                    recordObj.record[userCode].value = [{ code: result.code }];;
                  }
                }
              } else {
                //テーブル内の場合
                recordObj.record[tableCode] = {};
                recordObj.record[tableCode].value = [];

                if (!record[tableCode].value || !record[tableCode].value.length) continue;
                for (const row of record[tableCode].value) {
                  const rowObj = {
                    id: row.id,
                    value: {},
                  };

                  if (staffSelect.type === 'CREATOR' || staffSelect.type === 'MODIFIER') {
                    const result = that.checkUser(allUsers, staffSelect);
                    if (result) {
                      rowObj.value[userCode] = {};
                      rowObj.value[userCode].value = [{ code: result }];;
                    } else {
                      const result = { code: 'taisyoku', name: '退職者' };
                      rowObj.value[userCode] = {};
                      rowObj.value[userCode].value = [{ code: result.code }];;
                    }
                  }
                  recordObj.record[tableCode].value.push(rowObj);
                }

              }
            }

          }
          body.records.push(recordObj);
        }
        try {
          await kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', body);
          location.reload();
        } catch {

        }
      }

    });
  };

  //指定したユーザー選択が存在するかどうかチェックします
  total.existenceCheck = function (setting, { record }) {
    const isOutsideTheTable = setting.userSelect.split('　').length === 1;

    if (isOutsideTheTable) {
      const field = record[setting.userSelect];
      if (!field) return true;

    } else {
      const tableField = record[setting.userSelect.split('　')[0]];
      if (!tableField) {
        const field = record[setting.userSelect.split('　')[1]];
        if (!field) return true;

      } else {
        const field = tableField.value[0].value[setting.userSelect.split('　')[1]];
        if (!field) return true;
      }
    }

    const isOutsideTheTable2 = setting.staffSelect.split('　').length === 1;
    if (isOutsideTheTable2) {
      const field2 = record[setting.staffSelect];
      if (!field2) return true;

    } else {
      const tableField = record[setting.staffSelect.split('　')[0]];
      if (!tableField) {
        const field2 = record[setting.staffSelect.split('　')[1]];
        if (!field2) return true;

      } else {
        const field2 = tableField.value[0].value[setting.staffSelect.split('　')[1]];
        if (!field2) return true;
      }

    }

    return false;
  };

  //全体ユーザーの取得
  total.getAllUsers = async function (offset = 0, users = []) {
    try {
      const resp = await kintone.api(kintone.api.url('/v1/users.json'), 'GET', { offset });
      users = users.concat(resp.users);
      if (resp.users.length === 100) {
        return getAllUsers(offset + 100, users);
      }
    } catch { }

    return users;
  };

  //作成者・更新者のユーザーが在職かどうか確認
  total.checkUser = function (allUsers, staffSelect) {
    if (!staffSelect || !allUsers) return '';
    const user = allUsers.find((user) => user.code === staffSelect.value.code);
    if (!user) return '';
    const data = {
      name: user.name,
      code: user.code,
    };
    return data.code;
  };

  total.checkFields = async function (event) {
    if (!event.records) return event;
    if (!config.settings || !config.settings.length) return event;
    const fieldList = await total.getFieldList();
    if (!fieldList) return event;

    const missingFields = [];

    for (let i = 0; i < config.settings.length; i++) {
      if (config.settings[i].staffSelect !== 'none') {
        const exists = fieldList.some(field => field.code === config.settings[i].staffSelect);
        if (!exists) {
          missingFields.push(`[作成者・更新者] ${config.settings[i].staffSelect}`);
        }
      }

      if (config.settings[i].userSelect !== 'none') {
        const exists = fieldList.some(field => field.code === config.settings[i].userSelect);
        if (!exists) {
          missingFields.push(`[指定ユーザー選択] ${config.settings[i].userSelect}`);
        }
      }
    }

    const uniqueMissingFields = [...new Set(missingFields)];

    if (uniqueMissingFields.length > 0) {
      const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
      const fieldHtml = uniqueMissingFields
        .map((code) => `・${code}`)
        .join('<br>');

      total.displayAlert(
        '警告',
        '「退職者チェックプラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        imageUrl,
        'OK'
      );
    }

    return event;
  };

  total.getFieldList = async function () {
    const fieldList = [];
    const fieldList2 = [
      ...Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList),
      ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
    ];

    try {
      const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
        app: kintone.app.getId(),
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
          ));
        }
      });
    } catch {

    }

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

  total.displayAlert = function (title, text, type, button) {

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


  total.eventStart();
})(jQuery, kintone.$PLUGIN_ID);
