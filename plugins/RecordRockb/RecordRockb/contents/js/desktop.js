jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';



  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  //[JSON型に変換]
  if (Object.keys(config).length) {
    // console.log(config);
  }

  //[処理用オブジェクト]
  const recordLock = {};

  /**********************
   * [イベント実行処理関数]
   **********************/
  recordLock.eventStart = function () {
    const that = this;

    if (!Object.keys(config).length) return false;

    //[レコード詳細・作成・編集画面表示時画面表示時]
    kintone.events.on(['app.record.detail.show', 'app.record.create.show', 'app.record.edit.show'], async function (e) {
      if (!(await KNTP177310certification())) return e;

      kintone.app.record.setFieldShown(config.fieldCode, false);
      if (e.type !== 'app.record.edit.show') return e;

      const { code, name } = kintone.getLoginUser();

      //[レコード情報取得]
      try {
        const r = await kintone.api(kintone.api.url('/k/v1/record.json', true), 'GET', { app: e.appId, id: e.recordId });

        //[編集しているユーザーがいる場合、エラーを表示]
        if (r.record[config.fieldCode].value.length) {
          if (r.record[config.fieldCode].value[0].code !== code) {
            that.displayAlert('エラー', `${r.record[config.fieldCode].value[0].name}が編集中です`, 'error', 'OK');
            history.back();
          }
        } else {
          const body = {
            app: e.appId,
            id: e.recordId,
            record: {
              [config.fieldCode]: {
                value: [
                  {
                    code: code,
                    name: name,
                  },
                ],
              },
            },
          };
          await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body).then(function () {
            location.reload();
          });
        }
      } catch (ignore) {

      }

      const unlockRecord = async function () {
        const body = {
          app: e.appId,
          id: e.recordId,
          record: {
            [config.fieldCode]: {
              value: [],
            },
          },
        };
        await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body);
      };

      //[キャンセルボタンクリック時にレコード編集者フィールドの値リセット]
      $('.gaia-ui-actionmenu-cancel').on('click', unlockRecord);
      window.addEventListener('pagehide', unlockRecord, { once: true });

      return e;
    });


    //[一覧画面表示時]
    kintone.events.on('app.record.index.show', async function (e) {
      if (!(await KNTP177310certification())) return e;

      const fieldList = await kintone.api(
        kintone.api.url('/k/v1/app/form/fields.json', true),
        'GET',
        {
          app: kintone.app.getId(),
        }
      );

      const fieldExists = Object.prototype.hasOwnProperty.call(
        fieldList.properties,
        config.fieldCode
      );

      if (!fieldExists) {
        const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';

        that.displayAlert(
          '警告',
          '「レコードロック確認プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          `・[レコード編集者フィールド] ${config.fieldCode} <br><br>` +
          'プラグイン設定を修正してください。',
          imageUrl,
          'OK'
        );
      }

      return e;
    });

    //[レコード編集保存実行前]
    kintone.events.on('app.record.edit.submit', async function (e) {
      if (!(await KNTP177310certification())) return e;

      e.record[config.fieldCode].value = [];
      return e;
    });
  };

  /******************************************
   * [アラートの表示処理関数]
   * @param {string} title  [タイトル]
   * @param {string} text   [説明文]
   * @param {string} type   [アラートタイプ]
   * @param {string} button [ボタン名表示文字]
   * 使用例 ： displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');
   *****************************************/
  recordLock.displayAlert = function (title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button,
    });
  };

  //[関数実行]
  recordLock.eventStart();
})(jQuery, kintone.$PLUGIN_ID);
