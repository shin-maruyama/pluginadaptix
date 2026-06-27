// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  const select = JSON.parse(config.elementArray);
  // console.log(select);

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
})(jQuery, kintone.$PLUGIN_ID);
