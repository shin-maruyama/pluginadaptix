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


  /**
   * @param $submit       [保存ボタン要素]
   * @param config        [プラグイン設定内容オブジェクト]
   */
  const $submit = $('#submit');
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  // console.log(config);

  //[処理用オブジェクト]
  const recordLock = {};


  recordLock.checkCertificationFile = function () {
    if (typeof KNTP177310certification === 'function') {
      return true;
    } else {
      return false;
    }
  }


  /********************************************
   * [プラグイン設定保存処理関数]
   * @returns [プラグイン保存設定内容オブジェクト]
   ********************************************/
  recordLock.submit = function () {
    const value = {
      fieldCode: 'recordLockUserSelect0001',
    };
    return value;
  };

  /**********************************************************
   * [プラグイン設定画面表示時処理関数]
   * @param {object} config [プラグイン保存設定内容オブジェクト]
   **********************************************************/
  recordLock.config = async function (config) {
    const that = this;

    if (!(that.checkCertificationFile())) {
      that.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
      return;
    } else {
      if (!(await KNTP177310certification())) {
        return;
      }
    }

    /**
     * [保存・削除ボタンクリック時の処理]
     */
    that.buttonClickEvent();

    const fieldList = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList).filter(
      (x) => x.var === 'recordLockUserSelect0001'
    );

    //[既にプラグイン設定が保存されている場合の処理]
    if (!fieldList.length) {
      const body = {
        app: kintone.app.getId(),
        properties: {
          recordLockUserSelect0001: {
            type: 'USER_SELECT',
            code: 'recordLockUserSelect0001',
            label: 'レコード編集者',
            noLabel: false,
            required: false,
            entities: [],
            defaultValue: [],
          },
        },
      };
      return callKintoneApi(kintone.api.url('/k/v1/preview/app/form/fields.json', true), 'POST', body);
    }
  };

  /******************************************
   * [アラートの表示処理関数]
   * @param {string} title  [タイトル]
   * @param {string} text   [説明文]
   * @param {string} type   [アラートタイプ]
   * @param {string} button [ボタン名表示文字]
   * 使用例 ： that.displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');
   *****************************************/
  recordLock.displayAlert = function (title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button,
    });
  };

  /************************************************
   * [保存ボタンクリック時イベント処理関数]
   ***********************************************/
  recordLock.buttonClickEvent = function () {
    const that = this;

    $submit.on('click', function (e) {
      e.preventDefault();

      const value = that.submit();

      kintone.plugin.app.setConfig(value);
    });
  };

  //[関数実行]
  recordLock.config(config);
})(jQuery, kintone.$PLUGIN_ID);
