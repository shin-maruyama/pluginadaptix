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
  const connection = {};
  connection.fieldList = [];

  connection.checkCertificationFile = async function () {
    if (typeof KNTP217910certification === 'function') {
      return true;
    } else {
      return false;
    }
  }

  /********************************************
   * [プラグイン設定保存処理関数]
   * @returns [プラグイン保存設定内容オブジェクト]
   ********************************************/
  connection.submit = function () {
    const value = {
      delimiter: [],
      field: [],
      paddingSelect: [],
      digit: [],
      connectionField: [],
    };

    $('.main-contents').each(function () {
      const fields = [];
      value.delimiter.push($(this).find('.delimiter').val());
      value.paddingSelect.push($(this).find('.padding-select').val());
      const num = parseInt($(this).find('.digit').val(), 10);
      value.digit.push((isNaN(num) || num < 1) ? '' : num.toString());
      value.connectionField.push($(this).find('.connection-field').val());

      $(this).find('.clone-class').each(function () {
        fields.push($(this).find('.field').val());
      })
      value.field.push(fields);
    });

    return value;
  };

  /**********************************************************
   * [プラグイン設定画面表示時処理関数]
   * @param {object} config [プラグイン保存設定内容オブジェクト]
   **********************************************************/
  connection.config = async function (config) {
    const that = this;

    if (!(await that.checkCertificationFile())) {
      that.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
      return;
    } else {
      if (!(await KNTP217910certification())) {
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
    that.numberFieldValueCheck();

    /**
     * @param {Array} fieldList [フォームの左上から順のフィールドリスト]
     * @param {Array} numTextFiledList [数値と文字列1行に絞ったリスト]
     * @param {Array} singlelinetextFieldList [文字列1行のみに絞ったリスト]
     */
    that.fieldList = await that.getFieldList();
    const numTextFiledList = that.filterField(that.fieldList, true, 'NUMBER', 'SINGLE_LINE_TEXT');
    const singlelinetextFieldList = that.filterField(that.fieldList, true, 'SINGLE_LINE_TEXT');

    that.createOption(numTextFiledList, $('.field'));
    that.createOption(singlelinetextFieldList, $('.connection-field'));

    //[既にプラグイン設定が保存されている場合の処理]
    if (Object.keys(config).length) {
      // console.log(config)
      //[JSON型に変換]
      config.delimiter = JSON.parse(config.delimiter);
      config.field = JSON.parse(config.field);
      config.paddingSelect = JSON.parse(config.paddingSelect);
      config.digit = JSON.parse(config.digit);
      config.connectionField = JSON.parse(config.connectionField);
      // console.log(config);

      //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
      for (let i = 1, length = config.field.length; i < length; i++) {
        const parent = document.querySelector('#parent');
        const clone = parent.firstElementChild.cloneNode(true);
        parent.appendChild(clone);
      }
      //[連結するフィールドを保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
      Array.from($('.main-contents')).forEach((content, index) => {
        for (let l = 1, length = config.field[index].length; l < length; l++) {
          const childParent = content.children[4];
          const childClone = childParent.firstElementChild.cloneNode(true);
          childParent.appendChild(childClone);
        }
      });

      //[プラグイン保存設定反映]

      $('.main-contents').each(function (i) {
        $(this).find('.delimiter').val(config.delimiter[i])
        $(this).find('.padding-select').val(config.paddingSelect[i])
        $(this).find('.digit').val(config.digit[i])
        $(this).find('.connection-field').val(config.connectionField[i])

        $(this).find('.clone-class').each(function (j) {
          $(this).find('.field').val(config.field[i][j]);
        })

      });

      await that.currentSelect();
    } else {
      that.search();
    }

    $(document).on('change', '.delimiter', function () {
      const delimiter = $(this).val();
      if (delimiter === ' ' || delimiter === '　') {
        that.displayAlert('エラー', '区切り文字にスペース文字は使えません。', 'error', 'OK');
      }
    });
    $('#parent').sortable();
  };

  /***************************************
   * [フォームに設置してある全フィールド取得]
   * @returns [フォームの左上から順番のフィールドリスト]
   **************************************/
  connection.getFieldList = async function () {
    const fieldList = [];
    const fieldList2 = [
      ...Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList),
      ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
    ];

    try {
      const resp = await callKintoneApi(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
        app: kintone.app.getId(),
      });
      resp.layout.forEach((row) => {
        if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push(field));
        else if (row.type === 'SUBTABLE') {
          fieldList.push(row);
          //if (!subTable) return;
          row.fields.forEach((field) => {
            const fieldInfo = {
              type: field.type,
              code: `${row.code}　${field.code}`,
              id: `${fieldList2.find((x) => x.var === row.code).id}　${Object.values(fieldList2.find((x) => x.var === row.code).fieldList).find((y) => y.var === field.code).id
                }`,
              properties: Object.values(fieldList2.find((x) => x.var === row.code).fieldList).find(
                (y) => y.var === field.code
              ).properties,
            };
            fieldList.push(fieldInfo);
          });
        } else if (row.type === 'GROUP') {
          fieldList.push(row);
          row.layout.forEach((childRow) => childRow.fields.forEach((field) => {
            fieldList.push({
              type: field.type,
              code: row.code + '　' + field.code,
              id: field.id,
              properties: field.properties,
            })
          }
            //fieldList.push(field)
          ));
        }
      });
    } catch { }

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
    return fieldList;
  };

  /************************************************
   * [指定したフィールドを抽出する関数]
   * @param {Array} フィルターをかけるフィールドリスト
   * @param {boolean} 指定したフィールドタイプを抽出 true   以外を抽出 false
   * @param {Array} 抽出するフィールドタイプリスト
   * @returns [抽出したフィールドリスト]
   ************************************************/
  connection.filterField = function (fieldList, flg, ...limitFieldType) {
    if (!limitFieldType.length) return fieldList;
    if (flg) fieldList = fieldList.filter((x) => limitFieldType.includes(x.type));
    else fieldList = fieldList.filter((x) => !limitFieldType.includes(x.type));
    return fieldList;
  };

  /***************************************
   * [ドロップダウンに検索機能追加・CSS追加]
   **************************************/
  connection.search = function () {

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

        if(opnederDropdownId == "padding-select"){
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
  connection.rowButtonClickEvent = function () {
    const that = this;
    //[行追加ボタンクリック時の処理]
    $(document).on('click', '.add-row', async (obj) => {
      $('.field').select2('destroy');
      $('.connection-field').select2('destroy');
      $('.padding-select').select2('destroy');

      const parent = document.querySelector('#parent');
      const mainContents = obj.target.parentNode.parentNode;
      const clone = parent.firstElementChild.cloneNode(true);

      //[クローン 値リセット]
      clone.children[1].firstElementChild.firstElementChild.value = '';
      clone.children[7].children[1].firstElementChild.value = '';
      const classList = Array.from(clone.children[4].children);
      classList.forEach((item, index) => {
        if (index === classList.length - 1) return;
        item.remove();
      });

      parent.insertBefore(clone, mainContents.nextSibling);

      await that.currentSelect();
    });

    //[行削除ボタンクリック時の処理]
    $(document).on('click', '.remove-row', async (obj) => {
      const parent = document.querySelector('#parent');
      const mainContents = obj.target.parentNode.parentNode;
      if (parent.childElementCount > 1) {
        mainContents.remove();
      }

      await that.currentSelect();
    });

    //[フィールド追加ボタンクリック時の処理]
    $(document).on('click', '.add-field', async (obj) => {
      var scrollPosition = window.scrollY;
      $('.field').select2('destroy');
      $('.connection-field').select2('destroy');
      $('.padding-select').select2('destroy')

      const parent = obj.target.parentNode.parentNode.parentNode;
      const mainContents = obj.target.parentNode.parentNode;
      const clone = parent.firstElementChild.cloneNode(true);
      //[クローン 値リセット]

      parent.insertBefore(clone, mainContents.nextSibling);

      await that.currentSelect();
      window.scrollTo(0, scrollPosition);
    });

    //[フィールド削除ボタンクリック時の処理]
    $(document).on('click', '.remove-field', async (obj) => {
      const parent = obj.target.parentNode.parentNode.parentNode;
      const mainContents = obj.target.parentNode.parentNode;
      if (parent.childElementCount > 1) {
        mainContents.remove();
      }

      await that.currentSelect();
    });

  };

  /***********************************************
   * [数値フィールドバリデーションチェック関数]
   ***********************************************/
  connection.numberFieldValueCheck = function () {
    const that = this;
    $(document).on('blur', '.digit', async function () {
      const reg = /^[1-9][0-9]*$/;
      if($(this).val() && !reg.test($(this).val())){$(this).val("");connection.displayAlert('エラー', "1以上の整数を半角数字で入力してください。", 'error', 'OK')}
    })

   /**
   * [数値フィールドで、エンターキーを押した時のイベント(エラー画面に推移させない)。]
  */
   //$(function(){
    $(document).on('keydown',".digit",function(e){
      if(e.which == 13) {
        const reg = /^[1-9][0-9]*$/;
        if($(this).val() == ""){connection.displayAlert('エラー', "空白は入力しないでください。", 'error', 'OK')}
        if($(this).val() && !reg.test($(this).val())){$(this).val("");connection.displayAlert('エラー', "1以上の整数を半角数字で入力してください。", 'error', 'OK')}
        return false;
      }
    });
  }

  /***********************************************
   * [オプション作成処理関数]
   * @param {Array} fields [フィールドリスト]
   * @param {HTMLAllCollection} name [クラス・ID名]
   ***********************************************/
  connection.createOption = function (fields, name) {
    const option = $('<option>', {
      value: '',
      text: '',
    });
    name.append(option);
    fields.forEach((field) => {
      const option = $('<option>', {
        value: field.code,
        text: field.code,
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
   * 使用例 ： displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');
   *****************************************/
  connection.displayAlert = function (title, text, type, button) {
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
  connection.emptyCheck = function (value) {
    let flag = false;

    // 連結元フィールドのチェック
    value.field.forEach((item) => {
      item.forEach((item2) => {
        if (item2 == '') flag = true;
      });
    });

    // 連結先フィールドのチェック
    value.connectionField.forEach((item) => {
      if (item == '') flag = true;
    });

    return flag;
  };

  /***********************************************************
   * [0埋めの未入力チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [未入力がある場合 true　ない場合 falseを返す]
   **********************************************************/

  connection.padSelectEmptyCheck　= function (value) {
    let flag = false;

    // 0埋めセレクトのチェック
    value.paddingSelect.forEach((item,i) => {
      if(item == "y" && value.digit[i] == ""){
        flag = true;
      }
    });

    return flag;
  };

  /***********************************************************
   * [重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  connection.dupCheck = function (value) {
    const testSet = new Set();
    // 連結元フィールドの集合を作る
    value.field.forEach((item) => {
      item.forEach((item2) => {
        testSet.add(item2);
      });
    });
    // 連結元フィールドの要素数+連結先フィールドの数
    const cnt = testSet.size + value.connectionField.length;

    // 連結先フィールドを集合に追加
    value.connectionField.forEach((item) => {
      testSet.add(item);
    });
    // 連結先と連結元の重複、連結先同士の重複ともにこれで検出できる
    return testSet.size !== cnt;
  };

   /***********************************************************
   * [連結するフィールドの重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [重複している場合 true　していない場合 falseを返す]
   **********************************************************/
   connection.connectionFieldDupCheck = function (value) {
    let flag = false;
    value.field.forEach((x) =>{
      if(new Set(x).size !== x.length) {flag = true;}
    })
    return flag;
   }
  
  /***********************************************************
   * [テーブル跨ぎチェック処理関数]
   * @param {array} value [テーブル跨ぎチェックを行う配列]
   * @returns [跨いでいる場合 true　いない場合 falseを返す]
   **********************************************************/
  connection.tableCheck = function (value) {
    // グループ名のリストを取得する
    const that = this;
    const groupList = [];
    that.fieldList.forEach((field) => {
      if (field.type === 'GROUP') {
        groupList.push(field.code);
      }
    });

    let flag = false;
    const len = value.connectionField.length;
    for (let i = 0; i < len; i++) {
      // 連結先フィールドの属するテーブルを抽出、テーブル外なら空文字列
      const parts = value.connectionField[i].split('　');
      let tabled =  parts.length === 2 ? parts[0] : '';
      // グループに属する場合もテーブル外扱い
      if (groupList.includes(tabled)) tabled = '';
      value.field[i].forEach((item) => {
        // 連結元フィールドの属するテーブルを抽出
        const parts2 = item.split('　');
        let tables =  parts2.length === 2 ? parts2[0] : '';
        if (groupList.includes(tables)) tables = '';
        // 属するテーブルが異なる場合不可とする
        if(tables != tabled) flag = true;
      });
    }
    return flag;
  };

  /**
   * [数字チェック]
   * @returns [0埋めを実行するかつ桁数が数値でない場合true それ以外の場合false]
   */
  connection.numCheck = function (value) {
    let flag = false;
    const len = value.digit.length;
    for (let i = 0; i < len; i++) {
      if (value.paddingSelect[i] === 'y' && value.digit[i] === '')  flag = true;
    }
    return flag;
  };
    
  connection.checkSpace = function (value) {
    let flag = false;
    value.delimiter.forEach((item) => {
      if (item === ' ' || item === '　') {
        flag = true;
      }
    });
    return flag;
  };

  connection.changeEvent = function () {
    const that = this;
    $(document).on('change', '.field,.connection-field', async function () {
      var scrollPosition = window.scrollY;
      await that.currentSelect();
      window.scrollTo(0, scrollPosition);
    });
    $(document).on('change', '.digit', function () {
      if($(this).val() == '') return;
      let num = parseInt($(this).val());
      if (isNaN(num) || num < 1) {
        that.displayAlert('エラー', '0埋め桁数は正の整数を半角数字で入力してください。', 'error', 'OK');
      }
    });
  };

  connection.setLength = function () {
    this.search();

    for (let i = 0; i < $('.main-contents').length; i++) {
      const $mainContent = $('.main-contents').eq(i);

      let maxLen = $mainContent.find('.connection-field option:selected').text().length;
      $mainContent.find('.clone-class').each(function () {
        const str = $(this).find('.field option:selected').text().length;
        if(str > maxLen) maxLen = str;
      })

      //let arr = [str1, str2]
      let len = maxLen * 17 + 20;
      if (len < 290) len = 290;

      $mainContent.find('.tip-container').find('.select2-selection--single').css('width', len + 'px');
      $mainContent.find('.tip-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $mainContent.find('.clone-class').find('.kintoneplugin-table-td-operation').css('left', len + 50 + 'px');
      $mainContent.css('width', len + 110 + 'px');
    }
  };

  connection.currentSelect = async function () {

    const that = this;
    let array1 = []; // 連結元から抜くもの、連結先フィールド
    let array2 = []; // 連結先から抜くもの、連結先フィールドと連結元フィールド

    const numTextFiledList = that.filterField(
      that.fieldList,
      true,
      'NUMBER',
      "SINGLE_LINE_TEXT"
    );

    const singlelinetextFieldList = that.filterField(
      that.fieldList,
      true,
      "SINGLE_LINE_TEXT"
    );

    $('.main-contents').each(function () {
      array1.push($(this).find('.connection-field').val());
      array2.push($(this).find('.connection-field').val());
      $(this).find('.clone-class').each(function () {
        array2.push($(this).find('.field').val());
      })
    });

    $('.main-contents').each(function () {

      //currentSelect1

      $(this).find('.clone-class').each(function () {

        const currentSelect1 = $(this).find('.field');
        const currentValue1 = currentSelect1.val();
        let newOptions1 = [];

        newOptions1 = numTextFiledList.filter(option => !array1.includes(option.code) || option.code === currentValue1);

        currentSelect1.empty();
        that.createOption(newOptions1, currentSelect1);
        currentSelect1.val(currentValue1);
      })

      //currentSelect2
      const currentSelect2 = $(this).find('.connection-field');
      const currentValue2 = currentSelect2.val();
      let newOptions2 = [];

      newOptions2 = singlelinetextFieldList.filter(option => !array2.includes(option.code) || option.code === currentValue2);

      currentSelect2.empty();
      that.createOption(newOptions2, currentSelect2);
      currentSelect2.val(currentValue2);

    });

    that.setLength();
  }


  /************************************************
   * [保存・キャンセルボタンクリック時イベント処理関数]
   ***********************************************/
  connection.buttonClickEvent = function () {
    const that = this;

    //[保存ボタンクリック時イベント]
    $submit.on('click', function (e) {
      e.preventDefault();

      const value = that.submit();
      if (that.emptyCheck(value)) {
        that.displayAlert('エラー', '連結元または連結先フィールドが選択されていません。', 'error', 'OK');
        return false;
      }

      if (that.padSelectEmptyCheck(value)){
        that.displayAlert('エラー', '桁数が入力されていません。', 'error', 'OK');
        return false;
      }

      if (that.dupCheck(value)) {
        that.displayAlert('エラー', '連結先フィールド同士、または連結先と連結元が重複しています。', 'error', 'OK');
        return false;
      }

      if (that.connectionFieldDupCheck(value)) {
        that.displayAlert('エラー', '連結するフィールドに重複があります。', 'error', 'OK');
        return false;
      }

      if (that.tableCheck(value)) {
        that.displayAlert('エラー', '異なるテーブルに属するフィールドを連結しようとしています。', 'error', 'OK');
        return false;
      }

      if (that.numCheck(value)) {
        that.displayAlert('エラー', '0埋め桁数は正の整数を半角数字で入力してください。', 'error', 'OK');
        return false;
      }

      if (that.checkSpace(value)) {
        that.displayAlert('エラー', '区切り文字にスペース文字は使えません。', 'error', 'OK');
        return false;
      }

      //[文字列に変換]
      value.delimiter = JSON.stringify(value.delimiter);
      value.field = JSON.stringify(value.field);
      value.paddingSelect = JSON.stringify(value.paddingSelect);
      value.digit = JSON.stringify(value.digit);
      value.connectionField = JSON.stringify(value.connectionField);

      kintone.plugin.app.setConfig(value);
    });
    //[キャンセルボタンクリック時イベント]
    $cancelButton.on('click', function () {
      window.location.href = '../../' + kintone.app.getId() + '/plugin/';
    });
  };

  //[関数実行]
  connection.config(config);
})(jQuery, kintone.$PLUGIN_ID);
