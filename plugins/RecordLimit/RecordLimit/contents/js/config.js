// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP921310certification())) {
    return;
  }

  //[処理用オブジェクト]
  const obj = {
    /**
     * @param $submit [保存ボタン要素]
     * @param $cancel [キャンセルボタン要素]
     * @param config  [プラグイン設定内容オブジェクト]
     */
    $submit: $('#submit'),
    $cancel: $('#cancel'),
    config: kintone.plugin.app.getConfig(PLUGIN_ID),

    /********************************************
     * [プラグイン設定保存処理関数]
     * @returns [プラグイン保存設定内容オブジェクト]
     ********************************************/
    submit: function () {
      const value = {
        limitNumber: $('.main-contents:first').find('#limit_number').val(),
      };
      return value;
    },

    /**********************************************************
     * [プラグイン設定画面表示時処理関数]
     * @param {object} config [プラグイン保存設定内容オブジェクト]
     **********************************************************/
    configShow: async function (config) {
      /**
       * [保存・削除ボタンクリック時の処理]
       * [レコード制限数入力時の処理]
       */
      obj.buttonClickEvent();
      obj.inputEvent();

      //[既にプラグイン設定が保存されている場合の処理]
      if (Object.keys(config).length) {
        //[プラグイン保存設定反映]
        $('.main-contents:first').find('#limit_number').val(config.limitNumber);
      }
    },

    /**
     * [レコード制限数入力時イベント]
     */
    inputEvent: function () {
      const that = this;
      $(document).on('blur', '#limit_number', async function () {
        const reg = /^[1-9][0-9]*$/;
        if($(this).val() && !reg.test($(this).val())){$(this).val("");that.displayAlert('エラー', "1以上の整数を半角数字で入力してください。", 'error', 'OK')}
      })

    /**
     * [最大行数(半角数字)フィールドで、エンターキーを押した時のイベント(エラー画面に推移させない)。]
     */
      $(document).on('keydown',"#limit_number",function(e){
        if(e.which == 13) {
          const reg = /^[1-9][0-9]*$/;
          if($(this).val() == ""){that.displayAlert('エラー', "空白は入力しないでください。", 'error', 'OK')}
          if($(this).val() && !reg.test($(this).val())){$(this).val("");that.displayAlert('エラー', "1以上の整数を半角数字で入力してください。", 'error', 'OK')}
          return false;
        }
      })
    },

    /******************************************
     * [アラートの表示処理関数]
     * @param {string} title  [タイトル]
     * @param {string} text   [説明文]
     * @param {string} type   [アラートタイプ]
     * @param {string} button [ボタン名表示文字]
     * 使用例 ： that.displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');
     *****************************************/
    displayAlert : function (title, text, type, button) {
      swal.fire({
        title: title,
        html: text,
        icon: type,
        confirmButtonText: button,
      });
    },

    /**
     * [数字チェック]
     * @returns [レコード数が1以上の数値でない場合true 1以上の数値である場合false]
     */
    numCheck : function (value) {
      let num = parseInt(value.limitNumber, 10);
      if (isNaN(num) || num < 1) return true;
      return false;
    },

    /************************************************
     * [保存・キャンセルボタンクリック時イベント処理関数]
     ***********************************************/
    buttonClickEvent: function () {
      //[保存ボタンクリック時イベント]
      obj.$submit.on('click', function (e) {
        e.preventDefault();
        const value = obj.submit();

        if (obj.numCheck(value)) {
          obj.displayAlert('エラー', 'レコード制限数は1以上の値を半角数字で入力してください。', 'error', 'OK');
          return false;
        }
        value.limitNumber = parseInt(value.limitNumber, 10).toString();
  
        kintone.plugin.app.setConfig(value);
      });

      //[キャンセルボタンクリック時イベント]
      obj.$cancel.on('click', function () {
        window.location.href = '../../' + kintone.app.getId() + '/plugin/';
      });
    },
  };

  //[関数実行]
  obj.configShow(obj.config);
})(jQuery, kintone.$PLUGIN_ID);
