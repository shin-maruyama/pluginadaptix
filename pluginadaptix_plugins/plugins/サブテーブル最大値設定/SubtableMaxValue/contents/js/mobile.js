// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP929810certification())) {
    return;
  }

  //保存設定内容
  var config = kintone.plugin.app.getConfig(PLUGIN_ID);

  //処理用オブジェクト
  let tableMaxLimit = {};

  /**
   * [チェンジイベント実行処理]
   */
  tableMaxLimit.changeEventStart = function () {
    let self = this;

    //JSON型に変換
    if (Object.keys(config).length) {
      config.tableSelect = JSON.parse(config.tableSelect);
      config.limitNumber = JSON.parse(config.limitNumber);
    }

    //レコード編集ビュー、レコード追加ビューを開いた時のイベント
    kintone.events.on(['mobile.app.record.edit.show','mobile.app.record.create.show'], function (event) {
      
      let record = event.record;

      //指定したテーブル分ループ
      for (let i = 0; i < config.tableSelect.length; i++) {
        //指定最大数を超えた場合、チェンジしたフィールドと同じ場合実行

        const fields = Object.values(cybozu.data.page.FORM_DATA.schema.subTable)
        const targetField = fields.filter((x) => x.var == config.tableSelect[i])
        if(targetField.length == 0){continue;}//サブテーブルが削除されていたら、スキップ
        const rows = $(".subtable-" + targetField[0].id).find(".subtable-row-gaia");

        if (
          record[config.tableSelect[i]] &&
          record[config.tableSelect[i]].value.length + 1 > config.limitNumber[i]
        ) {
          for (let j = 0; j < rows.length; j++) {
            $(rows[j].getElementsByClassName("subtable-row-add-gaia")).hide();
          }

        }else{
          for (let j = 0; j < rows.length; j++) {
            $(rows[j].getElementsByClassName("subtable-row-add-gaia")).show();
          }
        }
      }
      return event;

      
    });

    //サブテーブルに行が追加された時のイベント
    kintone.events.on(self.changeEventCreate(config), function (event) {

      let record = event.record;
      let changeField = event.type.split('.')[5];

      //指定したテーブル分ループ
      for (let i = 0; i < config.tableSelect.length; i++) {
        //指定最大数を超えた場合、チェンジしたフィールドと同じ場合実行
        
        const fields = Object.values(cybozu.data.page.FORM_DATA.schema.subTable)
        const targetField = fields.filter((x) => x.var == config.tableSelect[i])
        if(targetField.length == 0){continue;}//サブテーブルが削除されていたら、スキップ
        const rows = $(".subtable-" + targetField[0].id).find(".subtable-row-gaia");
        
        if (
          record[config.tableSelect[i]] &&
          record[config.tableSelect[i]].value.length + 1 > config.limitNumber[i] &&
          config.tableSelect[i] === changeField
        ) {
          for (let j = 0; j < rows.length; j++) {
            $(rows[j].getElementsByClassName("subtable-row-add-gaia")).hide();
          }

        }else{
          for (let j = 0; j < rows.length; j++) {
            $(rows[j].getElementsByClassName("subtable-row-add-gaia")).show();
        }
      }
    }
      return event;
    });

    kintone.events.on(['mobile.app.record.create.submit', 'mobile.app.record.edit.submit'], function (event) {

      let record = event.record;
      let errStr = ' ';

      for (let i = 0; i < config.tableSelect.length; i++) {
        //指定最大数を超えた場合、チェンジしたフィールドと同じ場合実行
        if (record[config.tableSelect[i]] && record[config.tableSelect[i]].value.length > config.limitNumber[i]) {
          //エラー文を作成
          errStr +=
            '　テーブルコード(' + config.tableSelect[i] + ')は最大' + config.limitNumber[i] + '行まで登録できます。';
        }
      }

      if (errStr === ' ') {
        event.error = null;
      } else {
        event.error = errStr;
      }

      return event;
    });

    kintone.events.on('mobile.app.record.index.show', async function () {
      if (!(await KNTP929810certification())) return;
      if (!config.tableSelect || !config.tableSelect.length) return;

      const filteredFieldList = await self.getFields();
      if (!filteredFieldList || !filteredFieldList.length) return;

      const missingFields = [];

      for (let i = 0; i < config.tableSelect.length; i++) {
        const tableCode = config.tableSelect[i];
        if (!tableCode || tableCode === '') continue;

        const exists = filteredFieldList.some(field => field.code === tableCode);
        if (!exists) {
          missingFields.push(`[テーブルフィールド] ${tableCode}`);
        }
      }

      const uniqueMissingFields = [...new Set(missingFields)];

      if (uniqueMissingFields.length > 0) {
        const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
        const fieldHtml = uniqueMissingFields
          .map((code) => `・${code}`)
          .join('<br>');

        self.displayAlert(
          '警告',
          '「サブテーブル最大値設定プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          fieldHtml +
          '<br><br>プラグイン設定を修正してください。',
          imageUrl,
          'OK'
        );
      }

    });

  };

  /**
   * [チェンジイベント作成処理]
   */
  tableMaxLimit.changeEventCreate = function (_config) {
    let config = _config;
    let events = [];

    for (let i = 0; i < config.tableSelect.length; i++) {
      events.push('mobile.app.record.edit.change.' + config.tableSelect[i]);
      events.push('mobile.app.record.create.change.' + config.tableSelect[i]);
    }

    return events;
  };
  tableMaxLimit.getFields = async function () {
    const fieldList = [];
    try {
      const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
        app: kintone.app.getId(),
      });
      resp.layout.forEach((row) => {
        if (row.type === 'SUBTABLE') fieldList.push(row);
      });
    } catch { }

    return fieldList;
  }
  tableMaxLimit.displayAlert = function (title, text, type, button) {
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

  tableMaxLimit.changeEventStart();
})(jQuery, kintone.$PLUGIN_ID);
