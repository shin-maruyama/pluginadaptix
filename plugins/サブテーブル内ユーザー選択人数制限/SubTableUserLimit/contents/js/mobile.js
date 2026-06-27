// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP800710certification())) {
    return;
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  //[JSON型に変換]
  if (Object.keys(config).length) {
    config.table = JSON.parse(config.table);
    config.field = JSON.parse(config.field);
    config.limitNumber = JSON.parse(config.limitNumber);
    // console.log(config);
  }

  //[処理用オブジェクト]
  const limit = {};

  /**********************
   * [イベント実行処理関数]
   *********************/
  limit.eventStart = function () {
    const that = this;

    kintone.events.on(that.eventCreate(), function (event) {
      const record = event.record;

      if (Object.keys(config).length) {
        for (let i = 0; i < config.table.length; i++) {
          if (record[config.table[i]] && config.table[i] !== 'none') {
            record[config.table[i]].value.forEach((row) => {
              if (config.field[i] && config.field[i] !== 'none') {
                if (row.value[config.field[i].split('　')[1]].value.length > config.limitNumber[i]) {
                  row.value[config.field[i].split('　')[1]].error = `ユーザーは${config.limitNumber[i]}人しか選択できません。`;
                } else {
                  row.value[config.field[i].split('　')[1]].error = null;
                }
              }

            });
          }
        }
      }
      return event;
    });

    kintone.events.on(['mobile.app.record.create.submit', 'mobile.app.record.edit.submit'], function (e) {
      const record = e.record;

      if (Object.keys(config).length) {
        for (let i = 0; i < config.table.length; i++) {
          if (record[config.table[i]] && config.table[i] !== 'none') {
            record[config.table[i]].value.forEach((row) => {
              if (config.field[i] && config.field[i] !== 'none') {
                if (row.value[config.field[i].split('　')[1]].value.length > config.limitNumber[i]) {
                  row.value[config.field[i].split('　')[1]].error = `ユーザーは${config.limitNumber[i]}人しか選択できません。`;
                  e.error = 'ユーザー選択フィールドでエラー';
                }
              }
            });
          }
        }
      }
      return e;
    });

    kintone.events.on('mobile.app.record.index.show', function (e) {
      if (!config.table || !config.table.length) return e;
      const tableFieldList = Object.values(cybozu.data.page.FORM_DATA.schema.subTable);
      const missingFields = [];

      for (let i = 0; i < config.table.length; i++) {
        if (config.table[i] && config.table[i] !== 'none') {
          const table = tableFieldList.find((x) => x.var === config.table[i]);

          if (!table) {
            missingFields.push(`[テーブルフィールド] ${config.table[i]}`);
            continue;
          }

          if (config.field[i] && config.field[i] !== 'none') {
            const userSelectFieldList = Object.values(table.fieldList || {}).filter((x) => x.type === 'USER_SELECT');
            const fieldCode = config.field[i].split('　')[1];
            const field = userSelectFieldList.find((x) => x.var === fieldCode);

            if (!field) {
              missingFields.push(`[ユーザー選択フィールド] ${config.field[i]}`);
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

        that.displayAlert(
          '警告',
          '「サブテーブル内ユーザー選択人数制限プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
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
   * [チェンジイベント作成処理]
   *************************/
  limit.eventCreate = function () {
    const that = this;
    const events = [];

    if (!config.field || !config.field.length) return events;
    for (let i = 0; i < config.field.length; i++) {
      if (config.field[i] && config.field[i] !== '') {
        events.push('mobile.app.record.edit.change.' + config.field[i].split('　')[1]);
        events.push('mobile.app.record.create.change.' + config.field[i].split('　')[1]);
        events.push('mobile.app.record.index.edit.change.' + config.field[i].split('　')[1]);
      }
    }
    return events;
  };

  limit.displayAlert = function (title, text, type, button) {
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

  //[関数実行]
  limit.eventStart();
})(jQuery, kintone.$PLUGIN_ID);
