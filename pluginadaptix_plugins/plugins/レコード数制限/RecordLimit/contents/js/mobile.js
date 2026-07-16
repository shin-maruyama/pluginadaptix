// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  const obj = {
    config: kintone.plugin.app.getConfig(PLUGIN_ID),
    events: {
      show: ['mobile.app.record.index.show', 'mobile.app.record.detail.show', 'mobile.app.record.create.show'],
    },

    init: async function (e) {
      if (!(await KNTP921310certification())) return e;

      const eventType = e.type;

      if (isNaN(obj.config?.limitNumber)) return e;
      const allRecords = await obj.getAllRecords();

      //[レコード制限数]
      const limitNumber = Number(obj.config.limitNumber);
      const errorMessage = `レコード最大数が${limitNumber}に設定されているため、\nレコードを追加できません。`;

      if (allRecords.length >= limitNumber) {
        //[レコード一覧・詳細画面の「レコードを追加する」ボタンにチップツールを設定]
        $('.gaia-mobile-v2-app-indextoolbar-addrecord').prop('disabled', true);

        //[レコード詳細画面の「レコードを再利用する」ボタンにチップツールを設定]
        $('.gaia-mobile-v2-recordbottomsheet-menuitem-action-reuse').prop('disabled', true);

        //[レコード追加画面の保存ボタンを非表示]
        if (eventType !== 'mobile.app.record.create.show') return e;
        obj.displayAlert('エラー', errorMessage, 'error', 'OK');
        $('.gaia-mobile-v2-app-record-edittoolbar-save').hide();
      }

      return e;
    },

    /**
     * [全レコードを取得し、returnする]
     * @returns [全てのレコード]
     */
    getAllRecords: async function () {
      const client = new KintoneRestAPIClient();
      return await client.record.getAllRecords({ app: kintone.mobile.app.getId() });
    },

    /******************************************
     * [アラートの表示処理関数]
     * @param {string} title  [タイトル]
     * @param {string} text   [説明文]
     * @param {string} type   [アラートタイプ]
     * @param {string} button [ボタン名表示文字]
     * 使用例 ： obj.displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');
     *****************************************/
    displayAlert: function (title, text, type, button) {
      swal.fire({
        title: title,
        text: text,
        icon: type,
        confirmButtonText: button,
      });
    },
  };

  kintone.events.on(obj.events.show, obj.init);
})(jQuery, kintone.$PLUGIN_ID);
