// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  /**
   * @param $submit       [保存ボタン要素]
   * @param $cancelButton [キャンセルボタン要素]
   * @param config        [プラグイン保存設定内容オブジェクト]
   * @param allFieldOfThisApp [このアプリの全フィールド]
   */
  const $submit = $('#submit');
  const $cancelButton = $('.js-cancel-button');
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  //[処理用オブジェクト]
  const limit = {};

  limit.checkCertificationFile = async function () {
    if (typeof KNTP800710certification === 'function') {
      return true;
    } else {
      return false;
    }
  }
  /**
   * @param fieldTypeUserSelect [ユーザー選択フィールドタイプ]
   */
  limit.fieldTypeUserSelect = 'USER_SELECT';

  /********************************************
   * [プラグイン設定保存処理関数]
   * @returns [プラグイン保存設定内容オブジェクト]
   ********************************************/
  limit.submit = function () {
    const value = {
      table: [],
      field: [],
      limitNumber: [],
    };
    //debugger;
    for (let i = 0; i < $('.main-contents').length; i++) {
      value.table.push($('.main-contents').eq(i).find('.table-select').val() ? $('.main-contents').eq(i).find('.table-select').val() : 'none');
      value.field.push($('.main-contents').eq(i).find('.field-select').val() ? $('.main-contents').eq(i).find('.field-select').val() : 'none');
      value.limitNumber.push($('.main-contents').eq(i).find('.kintoneplugin-input-text').val() ? $('.main-contents').eq(i).find('.kintoneplugin-input-text').val() : 'none');
    }
    return value;
  };

  /**********************************************************
   * [プラグイン設定画面表示時処理関数]
   * @param {Object} config [プラグイン保存設定内容オブジェクト]
   **********************************************************/
  limit.config = async function (config) {
    const that = this;

    if (!(await that.checkCertificationFile())) {
      that.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
      return;
    } else {
      if (!(await KNTP800710certification())) {
        return;
      }
    }


    //[保存・キャンセルボタンクリック時イベント処理関数実行]
    that.buttonClickEvent();

    //[テーブルフィールドリスト]
    const tableFieldList = Object.values(cybozu.data.page.FORM_DATA.schema.subTable);

    if (Object.keys(config).length) {
      config.table = JSON.parse(config.table);
      //[追加・削除ボタンクリック時イベント処理関数実行]
      that.rowButtonClickEvent(config.table.length, tableFieldList);
    } else {
      //[追加・削除ボタンクリック時イベント処理関数実行]
      that.rowButtonClickEvent(1, tableFieldList);
    }


    that.createOption(tableFieldList, $('.table-select'));

    //[プラグインの設定が保存されている場合実行]
    if (Object.keys(config).length) {
      //[JSON型に変換]
      config.field = JSON.parse(config.field);
      config.limitNumber = JSON.parse(config.limitNumber);

      //[設定情報のサブテーブルの配列から、現存しないサブテーブルを除外する。]
      const tableFieldListVars = tableFieldList.map(function (x){return x.var});
      const tableExistingMap = config.table.filter((item) => tableFieldListVars.includes(item))
      //[設定情報に存在し、かつ、現存するサブテーブルのクローンを作成]
      for (let i = 1; i < tableExistingMap.length; i++) {
        const clone = $('.main-contents:first').clone(true);
        $('#parent').append(clone);
      }

      let j = 0;//メインコンテンツの行数
      for (let i = 0; i < config.table.length; i++) {
        //サブテーブルが現存していなければ、次のターンに回す。
        if(!tableFieldListVars.includes(config.table[i])){continue;}
        const content = $('.main-contents').eq(j);
        if (config.table[i] !== 'none') {
          content.find('.table-select').val(config.table[i]);
          const userSelectFieldList = Object.values(
            tableFieldList.filter((x) => x.var === config.table[i])[0]?.fieldList || {}
          ).filter((x) => x.type === that.fieldTypeUserSelect);
          that.createFieldOption(config.table[i], userSelectFieldList, content.find('.field-select'));
          content.find('.field-select').val(config.field[i]);
          content.find('.kintoneplugin-input-text').val(config.limitNumber[i]);
          j++;//代入が終わったら、次の行のために１増やす。
        }

      }
      that.createNewOption();
      that.search();
      that.setLength();
      that.numberFieldValueCheck();
      //[プラグインの設定が保存さていない場合実行]
    } else {
      // that.createOption(tableFieldList, $('.table-select'));
      let option = $('<option>', {
        value: 'none',
        text: '',
      });
      $('.field-select').append(option);
      that.search();
    }

    $(document).on('change', '.table-select', function () {
      var scrollPosition = window.scrollY;
      var scrollPosition2 = window.scrollX;
     
      that.createNewOption();
      that.search();

      that.setLength();

      window.scrollTo(scrollPosition2, scrollPosition);
    });

    $(document).on('change', '.field-select', function () {
      var scrollPosition = window.scrollY;
      var scrollPosition2 = window.scrollX;

      that.createNewOption();
      that.search();

      that.setLength();

      window.scrollTo(scrollPosition2, scrollPosition);
    });

  };

  limit.createNewOption = function () {
    let array = [];
    const tableFieldList = Object.values(cybozu.data.page.FORM_DATA.schema.subTable);
    $('.main-contents').each(function () {
      if ($(this).find('.field-select').val() && $(this).find('.field-select').val() !== 'none') {
        array.push($(this).find('.field-select').val().split('　')[1]);
      } else {
        array.push($(this).find('.field-select').val());
      }
    });

    $('.main-contents').each(function () {
      const currentSelect = $(this).find('.field-select');
      const currentValue = currentSelect.val();
      let c = currentValue;
      if (currentValue && currentValue !== 'none') c = currentValue.split('　')[1];
      const selectedValue = $(this).find('.table-select').val();
      const userSelectFieldList = Object.values(
        tableFieldList.filter((x) => x.var === selectedValue)[0]?.fieldList || {}
      ).filter((x) => x.type === limit.fieldTypeUserSelect);
      const newOptions = userSelectFieldList.filter(option => !array.includes(option.var) || option.var === c);

      currentSelect.empty();
      limit.createFieldOption(selectedValue, newOptions, currentSelect);
      currentSelect.val(currentValue);
    });
  };

  limit.setLength = function () {
    let that = this;

    let tlen = that.getMaxTLength();
    tlen = tlen * 17 + 20;
    if (tlen < 290) tlen = 290;
    let flen = that.getMaxFLength();
    flen = flen * 17 + 20;
    if (flen < 290) flen = 290;


    $('.main-contents').each(function () {
      $(this).find('.table-container').find('.select2-selection--single').css('width', tlen + 'px');
      $(this).find('.table-container').find('.select2-selection__arrow').css('left', tlen - 30 + 'px');
      $(this).find('.table-container').css('width', tlen + 10 + 'px');
      $(this).find('.field-container').find('.select2-selection--single').css('width', flen + 'px');
      $(this).find('.field-container').find('.select2-selection__arrow').css('left', flen - 30 + 'px');
      $(this).find('.field-container').css('width', flen + 10 + 'px');
      $(this).find('.kintoneplugin-table-td-operation').css('left', tlen + flen + 290 + 35 + 'px');
    });
    $('.table-label').css('width', tlen + 10 + 'px');
    $('.field-label').css('width', flen + 10 + 'px');

    let mlen = tlen + flen + 400;
    if (mlen < 1000) mlen = 1000;
    $('#parent').css('width', mlen + 'px');
  }

  limit.getMaxTLength = function () {
    let maxLen = 0;
    $('.main-contents').each(function () {
      let len1 = $(this).find('.table-select option:selected').text().length;
      //let len2 = $(this).find('.field-select option:selected').text().length;
      if (len1 > maxLen) maxLen = len1;
    });
    return maxLen;
  }

  limit.getMaxFLength = function () {
    let maxLen = 0;
    $('.main-contents').each(function () {
      //let len1 = $(this).find('.table-select option:selected').text().length;
      let len2 = $(this).find('.field-select option:selected').text().length;
      if (len2 > maxLen) maxLen = len2;
    });
    return maxLen;
  }

  /*****************************************************
   * [追加・削除ボタンクリック時イベント処理関数]
   * @param {Number} length         [テーブル配列の長さ]
   * @param {Object} tableFieldList [テーブルフィールドリスト]
   *****************************************************/
  limit.rowButtonClickEvent = function (length, tableFieldList) {
    const that = this;

    let num = length;

    //[追加ボタンクリック時処理]
    $(document).on('click', '.kintoneplugin-button-add-row-image', function () {
      var scrollPosition = window.scrollY;
      var scrollPosition2 = window.scrollX;
      $('.table-select').select2('destroy');
      $('.field-select').select2('destroy');
      const mainContents = $(this).closest('.main-contents');
      const clone = mainContents.clone(true);

      clone.find('.field-select').empty();
      let option = $('<option>', {
        value: 'none',
        text: '',
      });
      clone.find('.field-select').append(option);
      clone.find('.kintoneplugin-input-text').val('1');

      mainContents.after(clone);
      that.createNewOption();
      that.search();
      that.setLength();
      window.scrollTo(scrollPosition2, scrollPosition);
    });

    //[削除ボタンクリック時処理]
    $(document).on('click', '.kintoneplugin-button-remove-row-image', function () {
      if ($('.main-contents').length > 1) $(this).closest('.main-contents').remove();
      that.createNewOption();
      that.search();
      that.setLength();
    });
  };

  /***********************************************
   * [オプション作成処理関数]
   * @param {Array} fields [フィールドリスト]
   * @param {HTMLAllCollection} name [クラス・ID名]
   ***********************************************/
  limit.createOption = function (fields, name) {
    name.empty();
    let option = $('<option>', {
      value: 'none',
      text: '',
    });
    name.append(option);
    fields.forEach((field) => {
      const option = $('<option>', {
        value: field.var,
        text: field.var,
      });
      name.append(option);
    });
  };

  /***********************************************
  * [オプション作成処理関数]
  * @param {Array} fields [フィールドリスト]
  * @param {HTMLAllCollection} name [クラス・ID名]
  ***********************************************/
  limit.createFieldOption = function (table, fields, name) {
    name.empty();
    let option = $('<option>', {
      value: 'none',
      text: '',
    });
    name.append(option);
    fields.forEach((field) => {
      const option = $('<option>', {
        value: table + '　' + field.var,
        text: table + '　' + field.var,
      });
      name.append(option);
    });
  };


  /**************************************************************
   * [重複チェック処理関数]
   * @param {object} value [プラグイン設定保存内容オブジェクト]
   * @returns [重複していたらtrueを返す　していなかったらfalseを返す]
   **************************************************************/
  limit.dupCheck = function (value) {
    const field = value.field;
    //[重複削除]
    const s = new Set(field);
    return s.size !== field.length;
  };

  /**********************
   * [アラート表示処理関数]
   **********************/
  limit.displayAlert = function (title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button,
    });
  };

  /***************************************
    * [ドロップダウンに検索機能追加・CSS追加]
    **************************************/
  limit.search = function () {
    $('.select2').select2({
      //width: '300px',
    }).on('select2:open', function (e) {
      setTimeout(function () {
        var optionCount = $('.select2-results__option').length;
        if (optionCount > 5) {
          var newTop = 0;
        } else {
          var newTop = -40;
        }

        $('.select2-search__field').css({
          height: '34px',
          'width': "280px",
        });

        $('.select2-search--dropdown').css({
          padding: '2px',
        });

        $('.select2-dropdown--below').css({
          'min-width': '290px',
          width: 'auto !important',
        });
        $('.select2-dropdown--above').css({
          'min-width': '290px',
          width: 'auto !important',
          'top': newTop + 'px',
        });
        $('.select2-results__option').css({
          'min-width': '290px',
          width: 'auto !important',
          height: '30px',
          padding: '4px 0px',
          'vartical-align': 'center',
          'white-space': 'nowrap',
          'overflow': 'visible',
        });
      }, 0);
    });

    $('.select2-selection--single').css({
      width: '290px',
      height: '55px',
      border: '1px solid #e3e7e8',
      'background-color': '#f7f9fa',
      'box-shadow': '1px 1px 1px #fff inset',
      'border-radius': '0',
      'text-overflow': 'ellipsis',
      'margin-top': '-3px',
    });

    $('.select2-selection__rendered').css({
      color: '#34a3db',
      'text-align': 'center',
      'line-height': '55px',
    });

    $('.select2-selection__arrow').css({
      top: '8px',
      left: '260px',
    });

    $('.select2-container--default .select2-selection--single .select2-selection__arrow b').css({
      'border-color': '#3498db transparent transparent transparent',
    });
  }

  /******************************************
   * [バリデーションチェック]
   * 使用例 ： 無効な数値は、空白に戻す。that.displayAlert('エラー','１以上の整数を入力してください。','error','OK');
   *****************************************/

  limit.numberFieldValueCheck = function (){
    const that = this;
    $(document).on('blur', "[id ^='limitNumber']", function() {
      console.log("エラー")
      const reg = /^[1-9][0-9]*$/;
      if($(this).val() && !reg.test($(this).val())){$(this).val("1");that.displayAlert('エラー', '１以上の整数を入力してください。', 'error', 'OK');}
    })
  }

  /**
   * [制限人数(半角数字)フィールドで、エンターキーを押した時のイベント(エラー画面に推移させない)。]
  */
    $(document).on('keydown',"[id ^='limitNumber']",function(e){
      if(e.which == 13) {
        const reg = /^[1-9][0-9]*$/;
        if($(this).val() == ""){limit.displayAlert('エラー', '空白は入力しないでください。', 'error', 'OK');}
        if($(this).val() && !reg.test($(this).val())){$(this).val("1");limit.displayAlert('エラー', '1以上の整数を半角数字で入力してください。', 'error', 'OK');}
          return false;
      }
    });

  /***********************************************
   * [保存・キャンセルボタンクリック時イベント処理関数]
   ***********************************************/
  limit.buttonClickEvent = function () {
    const that = this;
    //[保存ボタンクリック時イベント]
    $submit.on('click', function (e) {
      e.preventDefault();

      const value = that.submit();

      //[未入力チェック]

      let errMesseage = "";
      value.table.forEach((x,i) => {if(x == "none"){errMesseage = errMesseage + (i + 1) + "番目のテーブルフィールドが未入力です。<br>"}})
      value.field.forEach((y,j) => {if(y == "none"){errMesseage = errMesseage + (j + 1) + "番目のユーザー選択フィールドが未入力です。<br>"}})
      value.limitNumber.forEach((z,k) => {if(z == "none"){errMesseage = errMesseage + (k + 1) + "制限人数(半角数字)フィールドが未入力です。<br>"}})
        
      if(errMesseage != ""){
        that.displayAlert('エラー', errMesseage, 'error', 'OK');
        return false;
      }

      //[重複チェック]
      if (that.dupCheck(value)) {
        that.displayAlert('エラー', 'ユーザー選択フィールドが重複しています。', 'error', 'OK');
        return false;
      }


      //[文字列に変換]
      value.table = JSON.stringify(value.table);
      value.field = JSON.stringify(value.field);
      value.limitNumber = JSON.stringify(value.limitNumber);

      kintone.plugin.app.setConfig(value);
    });
    //[キャンセルボタンクリック時イベント]
    $cancelButton.on('click', function () {
      window.location.href = '../../' + kintone.app.getId() + '/plugin/';
    });
  };

  //[関数実行]
  limit.config(config);
})(jQuery, kintone.$PLUGIN_ID);
