// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  let select = [];
  try {
    if (Object.keys(config).length && config.elementArray) {
      select = JSON.parse(config.elementArray);
    }
  } catch (ignore) { }
  // console.log(select);

  kintone.events.on('app.record.index.show', async function (event) {
    if (!(await KNTP318810certification())) return event;
    await showMissingFieldWarning(event);
    return event;
  });

  if (!select.length) return;

  kintone.events.on(
    ['app.record.create.show', 'app.record.edit.show'],
    async function (event) {
      if (!(await KNTP318810certification())) return event;

      const { record } = event;
      // console.log(record);
      const fieldNameList = [];
      const inTableFieldList = [];
      let tableFieldCode = [];

      for (let fieldName in record) {
        //存在するフィールドを配列で取得する処理
        fieldNameList.push(fieldName);
      }

      select.forEach((val) => {
        if (val.split('　').length === 1) {
          if (val !== '選択' && val !== '' && record[val]) {
            //フィールドが設定されていない(又は削除されている)セレクトボックスを無視する条件分岐
            if (record[val].type === 'SUBTABLE') {
              //[テーブルフィールドの処理]
              record[val].value.forEach((row) => {
                Object.values(row.value).forEach((field) => {
                  field.disabled = false;
                });
              });
            } else {
              //[テーブルフィールド以外の処理（フィールドタイプごとに変更する]
              record[val]['disabled'] = false;
            }
          }
        } else if (val.split('　').length === 2) {
          inTableFieldList.push(val.split('　'));
          tableFieldCode.push(val.split('　')[0]);
        }
      });

      tableFieldCode = Array.from(new Set(tableFieldCode));
      tableFieldCode.forEach((code) => {
        const tableField = inTableFieldList.filter((x) => x[0] === code);

        tableField.forEach((field) => {
          record[code].value.forEach((row) => {
            row.value[field[1]].disabled = false;
          });
        });
      });

      const events = [];
      tableFieldCode.forEach((field) => {
        events.push(`app.record.create.change.${field}`);
        events.push(`app.record.edit.change.${field}`);
      });

      kintone.events.on(events, (e) => {
        const { record } = e;

        tableFieldCode.forEach((code) => {
          const tableField = inTableFieldList.filter((x) => x[0] === code);

          tableField.forEach((field) => {
            record[code].value.forEach((row) => {
              row.value[field[1]].disabled = false;
            });
          });
        });
        return e;
      });
      return event;
    },
    (error) => {
      console.log(error);
    }
  );

  async function showMissingFieldWarning(event) {
    if (!select.length) return event;

    const fieldList = await getFieldList(kintone.app.getId());
    if (!fieldList.length) return event;

    const missingFields = getMissingFields(select, fieldList);
    if (!missingFields.length) return event;

    displayAlert(
      '警告',
      createWarningHtml('入力可', missingFields),
      'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK',
      'OK'
    );

    return event;
  }

  async function getFieldList(appId) {
    const fieldList = [];
    try {
      const resp = await kintone.api('/k/v1/app/form/layout.json', 'GET', { app: appId });
      resp.layout.forEach((row) => {
        if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push(field));
        else if (row.type === 'SUBTABLE') fieldList.push(row);
        else if (row.type === 'GROUP') {
          fieldList.push(row);
          row.layout.forEach((childRow) => childRow.fields.forEach((field) => fieldList.push(field)));
        }
      });
    } catch (ignore) { }
    return fieldList;
  }

  function getMissingFields(selectedFields, fieldList) {
    const missingFields = [];

    selectedFields.forEach((fieldCode, index) => {
      if (!fieldCode || fieldCode === '選択') return;

      const splitCode = fieldCode.split('　');
      if (splitCode.length === 2) {
        const table = fieldList.find((field) => field.type === 'SUBTABLE' && field.code === splitCode[0]);
        const tableField = table && table.fields ? table.fields.find((field) => field.code === splitCode[1]) : null;
        if (!table || !tableField) {
          missingFields.push(createMissingFieldInfo({
            settingIndex: index + 1,
            settingName: '入力可にするフィールド',
            fieldCode,
            currentState: !table
              ? 'このサブテーブルはアプリ内に存在しません。サブテーブルのフィールドコードが変更された、または削除された可能性があります。'
              : 'このサブテーブル内フィールドはアプリ内に存在しません。フィールドコードが変更された、または削除された可能性があります。',
          }));
        }
        return;
      }

      const field = fieldList.find((item) => item.code === fieldCode);
      if (!field) {
        missingFields.push(createMissingFieldInfo({
          settingIndex: index + 1,
          settingName: '入力可にするフィールド',
          fieldCode,
          currentState: 'このフィールドはアプリ内に存在しません。フィールドコードが変更された、またはフィールドが削除された可能性があります。',
        }));
      }
    });

    return uniqueMissingFields(missingFields);
  }

  function createMissingFieldInfo({ settingIndex, settingName, fieldCode, currentState }) {
    return {
      key: [settingIndex, settingName, fieldCode].join('|'),
      settingIndex,
      settingName,
      fieldCode,
      fieldName: '未保存（設定値にフィールド名は保存されていません）',
      currentState,
    };
  }

  function uniqueMissingFields(missingFields) {
    const keys = new Set();
    return missingFields.filter((field) => {
      if (keys.has(field.key)) return false;
      keys.add(field.key);
      return true;
    });
  }

  function createWarningHtml(featureName, missingFields) {
    const rows = missingFields.map((field, index) => [
      'No.' + (index + 1),
      '<br>対象機能:<br>' + escapeHtml(featureName),
      '<br>設定番号:<br>' + escapeHtml(field.settingIndex),
      '<br>設定項目:<br>' + escapeHtml(field.settingName),
      '<br>保存されているフィールドコード:<br>' + escapeHtml(field.fieldCode),
      '<br>保存されているフィールド名:<br>' + escapeHtml(field.fieldName),
      '<br>現在の状態:<br>' + escapeHtml(field.currentState),
    ].join('')).join('<br><br>');

    return 'プラグイン設定で指定されているフィールドが見つかりません。<br><br>' +
      rows +
      '<br><br>プラグイン設定画面を開き、対象フィールドを再設定してください。';
  }

  function displayAlert(title, html, imageUrl, button) {
    if (typeof swal !== 'undefined' && typeof swal.fire === 'function') {
      swal.fire({
        title,
        html,
        imageUrl,
        confirmButtonText: button,
        customClass: {
          popup: 'my-popup-class',
        }
      });
      return;
    }

    if (typeof alert === 'function') {
      alert(html.replace(/<br>/g, '\n').replace(/<[^>]*>/g, ''));
    }
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[char];
    });
  }
})(jQuery, kintone.$PLUGIN_ID);
