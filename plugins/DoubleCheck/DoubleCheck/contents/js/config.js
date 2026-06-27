// Copyright (C) All in one Allright Reserved.

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
   * @param $cancelButton [キャンセルボタン要素]
   * @param config        [プラグイン設定内容オブジェクト]
   */
  const $submit = $('#submit');
  const $cancelButton = $('.js-cancel-button');
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  //[処理用オブジェクト]
  const obj = {};

  obj.checkCertificationFile = async function () {
    if (typeof KNTP608210certification === 'function') {
      return true;
    } else {
      return false;
    }
  }

  /********************************************
   * [プラグイン設定保存処理関数]
   * @returns [プラグイン保存設定内容オブジェクト]
   ********************************************/
  obj.submit = function () {
    const value = {
      field: [],
      condition: [],
    };
    for (let i = 0, length = $('.main-contents').length; i < length; i++) {
      value.field.push($('.dup-field')[i].value ? $('.dup-field')[i].value : 'none');
      value.condition.push($('.condition')[i].value ? $('.condition')[i].value : 'none');
    }
    return value;
  };

  /**********************************************************
   * [プラグイン設定画面表示時処理関数]
   * @param {object} config [プラグイン保存設定内容オブジェクト]
   **********************************************************/
  obj.config = async function (config) {
    const that = this;


    if (!(await that.checkCertificationFile())) {
      that.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
      return;
    } else {
      if (!(await KNTP608210certification())) {
        return;
      }
    }

    /**
     * [保存・削除ボタンクリック時の処理]
     * [追加・削除ボタンクリック時の処理]
     */
    that.buttonClickEvent();
    that.rowButtonClickEvent();
    that.changeEvent();

    /**
     * @param {Array} fieldList [フォームの左上から順のフィールド]
     */
    that.fieldList = await that.getFieldList();
    const filterFieldList = that.filterField(
      that.fieldList,
      true,
      'SINGLE_LINE_TEXT',
      'MULTI_LINE_TEXT',
      'NUMBER',
      'CALC',
      'RADIO_BUTTON',
      'DROP_DOWN',
      'DATE',
      'TIME',
      'DATETIME',
      'LINK'
    );

    //[ドロップダウンにオプション追加]
    that.createOption(filterFieldList, $('.dup-field'));

    //[既にプラグイン設定が保存されている場合の処理]
    if (Object.keys(config).length) {
      //[JSON型に変換]
      config.field = JSON.parse(config.field);
      config.condition = JSON.parse(config.condition);
      // console.log(config);

      //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
      for (let i = 1, length = config.field.length; i < length; i++) {
        const clone = $('.main-contents:first').clone(true);
        $('#parent').append(clone);
      }

      //[プラグイン保存設定反映]
      for (let i = 0, length = config.field.length; i < length; i++) {
        $('.dup-field')[i].value = config.field[i];
        $('.condition')[i].value = config.condition[i];
      }

      that.currentSelect();
    } else {
      that.search();
    }
  };

  /***************************************
   * [フォームに設置してある全フィールド取得]
   * @returns [フォームの左上から順番のフィールドリスト]
   **************************************/
  obj.getFieldList = async function () {
    const fieldList = [];
    try {
      const resp = await callKintoneApi(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
        app: kintone.app.getId(),
      });
      resp.layout.forEach((row) => {
        if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push(field));
        else if (row.type === 'SUBTABLE') fieldList.push(row);
        else if (row.type === 'GROUP') {
          fieldList.push(row);
          //row.layout.forEach((childRow) => childRow.fields.forEach((field) => fieldList.push(field)));
        }
      });
      let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
      fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
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
    } catch { }
    return fieldList;
  };

  /************************************************
   * [指定したフィールドを抽出する関数]
   * @param {Array} フィルターをかけるフィールドリスト
   * @param {boolean} 指定したフィールドタイプを抽出 true   以外を抽出 false
   * @param {Array} 抽出するフィールドタイプリスト
   * @returns [第二引数がtrueなら指定したフィールドタイプのフィールドリスト
   * 　　　　　　　　　　 falseなら指定したフィールドタイプ以外のフィールドリスト]
   ************************************************/
  obj.filterField = function (fieldList, flg, ...limitFieldType) {
    // if (!limitFieldType.length) return fieldList;
    // if (flg) fieldList = fieldList.filter((x) => limitFieldType.includes(x.type));
    // else fieldList = fieldList.filter((x) => !limitFieldType.includes(x.type));
    // return fieldList;

    if (!limitFieldType.length) return fieldList;
    let filteredFieldList = [];

    fieldList.forEach((row) => {
      if (row.type === 'GROUP') {
        row.layout.forEach((childRow) => {
          childRow.fields.forEach((field) => {
            if (limitFieldType.includes(field.type)) {
              filteredFieldList.push({
                fieldName: (row.code ? row.code : row.label) + ' ' + field.code,
                code: field.code
              });
            }
          });
        });
      } else if (row.type === 'SUBTABLE') {
        row.fields.forEach((subField) => {
          if (limitFieldType.includes(subField.type)) {
            filteredFieldList.push({
              fieldName: (row.code ? row.code : row.label) + ' ' + subField.code,
              code: subField.code
            });
          }
        });
      } else {
        if (limitFieldType.includes(row.type)) {
          filteredFieldList.push({
            fieldName: row.code,
            code: row.code
          });
        }
      }
    });
    if (flg) {
      return filteredFieldList;
    } else {
      return fieldList.filter((x) => !limitFieldType.includes(x.type));
    }
  };

  /***************************************
   * [ドロップダウンに検索機能追加・CSS追加]
   **************************************/
  obj.search = function () {
    $('.select2').select2({
      //width: '290px',
    }).on('select2:open', function (e) {
      const opnederDropdownId = $(this).prop("id")
      setTimeout(function () {
        var optionCount = $('.select2-results__option').length;
        if (optionCount > 5) {
          var newTop = 0;
        } else {
          var newTop = -40;
        }

        if(opnederDropdownId == "condition"){
          $('.select2-search--dropdown').css({
            display: 'none',
          });
        }else{
          $('.select2-search__field').css({
            height: '34px',
            'width': "280px",
          });

          $('.select2-search--dropdown').css({
            padding: '2px',
          });
        }

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
      top: '11px',
      left: '260px',
    });

    $('.select2-container--default .select2-selection--single .select2-selection__arrow b').css({
      'border-color': '#3498db transparent transparent transparent',
    });
  };

  /*************************************
   * [追加・削除ボタンクリック時の処理関数]
   ************************************/
  obj.rowButtonClickEvent = function () {
    const that = this;
    //[追加ボタンクリック時の処理]
    $(document).on('click', '.add-row', function () {
      $('.dup-field').select2('destroy');
      $('.condition').select2('destroy');
      const clone = $(this).closest('.main-contents').clone(true);
      $(this).closest('.main-contents').after(clone);
      that.currentSelect();
    });

    //[削除ボタンクリック時の処理]
    $(document).on('click', '.remove-row', function () {
      if ($('.main-contents').length > 1) $(this).closest('.main-contents').remove();

      that.currentSelect();
    });
  };

  /***********************************************
   * [オプション作成処理関数]
   * @param {Array} fields [フィールドリスト]
   * @param {HTMLAllCollection} name [クラス・ID名]
   ***********************************************/
  obj.createOption = function (fields, name) {
    const option = $('<option>', {
      value: '',
      text: '',
    });
    name.append(option);
    fields.forEach((field) => {
      const option = $('<option>', {
        value: field.fieldName,
        text: field.fieldName,
      });
      name.append(option);
    });
  };

  /******************************************
   * [アラートの表示処理関数]
   * @param {string} title  [タイトル]
   * @param {string} text   [説明文]
   * @param {string} type   [アラートタイプ]
   * @param {string} button [ボタン名表示文字]
   * 使用例 ： that.displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');
   *****************************************/
  obj.displayAlert = function (title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button,
    });
  };

  /***********************************************************
   * [未入力チェック処理関数]
   * @param {array} value [未入力チェックを行う配列]
   * @returns [未入力がある場合 true　ない場合 falseを返す]
   **********************************************************/
  obj.emptyCheck = function (value) {
    let flag = false;

    value.field.forEach((item) => {
      if(item === '' || item === 'none') flag = true;
    });
    return flag;
  };

  /***********************************************************
   * [重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  obj.dupCheck = function (value) {
    const array = [];

    value.field.forEach((item) => {
      array.push(item);
    });
    const a = new Set(array);
    return a.size !== array.length;
  };

  obj.conditionCheck = function (value) {
    const lastc = value.condition[value.condition.length - 1]
    return lastc !== 'none';
  };

  obj.changeEvent = function () {
    const that = this;
    $(document).on('change', '.dup-field', async function () {
      that.currentSelect();
    });
  };

  obj.setLength = function () {
    this.search();

    let len1 = 0;

    for (let i = 0; i < $('.main-contents').length; i++) {
      const $mainContent = $('.main-contents').eq(i);
      const str1 = $mainContent.find('.dup-field option:selected').text().length;
      

      let len = str1  * 17 + 20;

      if (len1 < str1  * 17 + 20) len1 = str1   * 17 + 20;
        if (len1 < 290) len1 = 290;

      if (len < 290) len = 290;

      if (len < len1) len = len1;

    };

    $('.main-contents').find('.tip-container').find('.select2-selection--single').css('width', len1 + 'px');
    $('.main-contents').find('.tip-container').find('.select2-selection__arrow').css('left', len1 - 30 + 'px');
    $('.main-contents').css('width', len1 + 50 + 'px');
    $('#parent').css('width', len1 + 430 + 'px');
    $('.main-contents').find('.tip-container1').css('left', len1  + 80 + 'px');
    $('.main-contents').find('.kintoneplugin-table-td-operation').css('left', len1 + 370 + 'px');
    $('#parent').find('.head').css('left', len1 + 80 + 'px');

  };

  obj.currentSelect = async function () {

    const that = this;
    let array = [];

    const filterFieldList = that.filterField(
      that.fieldList,
      true,
      'SINGLE_LINE_TEXT',
      'MULTI_LINE_TEXT',
      'NUMBER',
      'CALC',
      'RADIO_BUTTON',
      'DROP_DOWN',
      'DATE',
      'TIME',
      'DATETIME',
      'LINK'
    );

    $('.main-contents').each(function () {
      array.push($(this).find('.dup-field').val());
    });

    $('.main-contents').each(function () {
      //currentSelect1
      const currentSelect1 = $(this).find('.dup-field');
      const currentValue1 = currentSelect1.val();
      let newOptions1 = [];

      newOptions1 = filterFieldList.filter(option => !array.includes(option.fieldName) || option.fieldName === currentValue1);

      currentSelect1.empty();
      that.createOption(newOptions1, currentSelect1);
      currentSelect1.val(currentValue1);
    });

    that.setLength();
  };

  /************************************************
   * [保存・キャンセルボタンクリック時イベント処理関数]
   ***********************************************/
  obj.buttonClickEvent = function () {
    const that = this;

    //[保存ボタンクリック時イベント]
    $submit.on('click', function (e) {
      e.preventDefault();

      const value = that.submit();
      let fieldErrFlag = false;
      let conditionErrFlag = false;

      value.field.forEach((x) => {if(!x || x == 'none'){fieldErrFlag = true;}})

      if(fieldErrFlag){that.displayAlert('エラー', '重複禁止フィールドが選択されていません。', 'error', 'OK');return false;}

      for(var i = 0; i < (value.condition.length - 1);i++){
        if(!value.condition[i] || value.condition[i] == 'none'){
          conditionErrFlag = true;
        }
      }

      if(conditionErrFlag){that.displayAlert('エラー', 'AND/ORフィールドが選択されていません。', 'error', 'OK');return false;}
      
      if (that.dupCheck(value)) {
        that.displayAlert('エラー', '選択されたフィールドが重複しています。', 'error', 'OK');
        return false;
      }

      if (that.conditionCheck(value)) {
        that.displayAlert('エラー', '最終行のAND/ORは空欄にしてください。', 'error', 'OK');
        return false;
      }
      //[文字列に変換]
      value.field = JSON.stringify(value.field);
      value.condition = JSON.stringify(value.condition);

      kintone.plugin.app.setConfig(value);
    });

    //[キャンセルボタンクリック時イベント]
    $cancelButton.on('click', function () {
      window.location.href = '../../' + kintone.app.getId() + '/plugin/';
    });
  };

  //[関数実行]
  obj.config(config);
})(jQuery, kintone.$PLUGIN_ID);
