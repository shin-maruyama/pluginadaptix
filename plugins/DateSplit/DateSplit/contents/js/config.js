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



  const dateCalculation = {};
  dateCalculation.resp = null;

  dateCalculation.checkCertificationFile = async function () {
    if (typeof KNTP526110certification === 'function') {
      return true;
    } else {
      return false;
    }
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

  var temp = config;

  /********************************************
   * [プラグイン設定保存処理関数]
   * @returns [プラグイン保存設定内容オブジェクト]
   ********************************************/
  dateCalculation.submit = function () {
    const value = {
      settings: [],
    };
    for (let i = 0, length = $('.main-contents').length; i < length; i++) {
      const item = {
        dateSelect: $('.date-select')[i].value ? $('.date-select')[i].value : 'none',
        yearSelect: $('.year-select')[i].value ? $('.year-select')[i].value : 'none',
        monthSelect: $('.month-select')[i].value ? $('.month-select')[i].value : 'none',
        daySelect: $('.day-select')[i].value ? $('.day-select')[i].value : 'none',
      };
      value.settings.push(item);
    }
    return value;
  };

  /**********************************************************
   * [プラグイン設定画面表示時処理関数]
   * @param {object} config [プラグイン保存設定内容オブジェクト]
   **********************************************************/
  dateCalculation.config = async function (config) {
    const that = this;

    if (!(await that.checkCertificationFile())) {
      that.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
      return;
    } else {
      if (!(await KNTP526110certification())) {
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
     * @param {Array} fieldList [フィールドの左上から順のフィールド]
     */
    const fieldList = await that.getFieldList();
    const dateFieldList = that.filterField(fieldList, true, 'DATE');
    const numberFieldList = that.filterField(fieldList, true, 'NUMBER');

    //[ドロップダウンにオプション追加]
    that.createOption(dateFieldList, $('.date-select'));
    that.createOption(numberFieldList, $('.year-select'));
    that.createOption(numberFieldList, $('.month-select'));
    that.createOption(numberFieldList, $('.day-select'));
   
    //[既にプラグイン設定が保存されている場合の処理]
    if (Object.keys(config).length) {
      //[JSON型に変換]
      config.settings = JSON.parse(config.settings);
      //console.log(config.settings);


      //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
      for (let i = 1, length = config.settings.length; i < length; i++) {
        const parent = document.querySelector('#parent');
        const clone = parent.firstElementChild.cloneNode(true);
        parent.appendChild(clone);
      }

      //[プラグイン保存設定反映]
      for (let i = 0, length = config.settings.length; i < length; i++) {
        $('.date-select')[i].value = config.settings[i].dateSelect;
        $('.year-select')[i].value = config.settings[i].yearSelect;
        $('.month-select')[i].value = config.settings[i].monthSelect;
        $('.day-select')[i].value = config.settings[i].daySelect;
      }

      that.currentSelect();
    } else {
      that.search();
    }

    $('#parent').sortable();

  };

  /***************************************
   * [フォームに設置してある全フィールド取得]
   * @returns [フォームの左上から順番のフィールドリスト]
   **************************************/
  dateCalculation.getFieldList = async function () {
    const fieldList = [];
    try {
      let resp;
      if(dateCalculation.resp) {
        resp = dateCalculation.resp;
      }else{
        resp = await callKintoneApi(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
          app: kintone.app.getId(),
        });
        dateCalculation.resp = resp;
      }

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
  dateCalculation.filterField = function (fieldList, flg, ...limitFieldType) {
    if (!limitFieldType.length) return fieldList;
    let filteredFieldList = [];

    fieldList.forEach((row) => {
      if (row.type === 'GROUP') {
        row.layout.forEach((childRow) => {
          childRow.fields.forEach((field) => {
            if (limitFieldType.includes(field.type)) {
              filteredFieldList.push({
                fieldName: (row.code ? row.code : row.label) + '　' + field.code
              });
            }
          });
        });
      } else if (row.type === 'SUBTABLE') {
        row.fields.forEach((subField) => {
          if (limitFieldType.includes(subField.type)) {
            filteredFieldList.push({
              fieldName: (row.code ? row.code : row.label) + '　' + subField.code
            });
          }
        });
      } else {
        if (limitFieldType.includes(row.type)) {
          filteredFieldList.push({
            fieldName: row.code
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
  dateCalculation.search = function () {
    $('.select2').select2({
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

  };

  /*************************************
   * [追加・削除ボタンクリック時の処理関数]
   ************************************/
  dateCalculation.rowButtonClickEvent = function () {
    const that = this;
    //[追加ボタンクリック時の処理]
    $(document).on('click', '.add-row', (obj) => {
      $('.date-select').select2('destroy');
      $('.year-select').select2('destroy');
      $('.month-select').select2('destroy');
      $('.day-select').select2('destroy');

      const parent = document.querySelector('#parent');
      const mainContents = obj.target.parentNode.parentNode;
      const clone = parent.firstElementChild.cloneNode(true);

      parent.insertBefore(clone, mainContents.nextSibling);

      that.currentSelect();
    });

    //[削除ボタンクリック時の処理]
    $(document).on('click', '.remove-row', (obj) => {
      const parent = document.querySelector('#parent');
      const mainContents = obj.target.parentNode.parentNode;
      if (parent.childElementCount > 1) {
        mainContents.remove();
      }

      that.currentSelect();
    });
  };

  /***********************************************
   * [オプション作成処理関数]
   * @param {Array} fields [フィールドリスト]
   * @param {HTMLAllCollection} name [クラス・ID名]
   ***********************************************/
  dateCalculation.createOption = function (fields, name) {
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
  dateCalculation.displayAlert = function (title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button,
    });
  };

  /***********************************************************
   * [重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  dateCalculation.dupCheck = function (value) {
    const array = [];

    value.settings.forEach((item) => {
      array.push(item.dateSelect);
      if (item.yearSelect !== 'none') array.push(item.yearSelect);
      if (item.monthSelect !== 'none') array.push(item.monthSelect);
      if (item.daySelect !== 'none') array.push(item.daySelect);
    });
    const a = new Set(array);
    return a.size !== array.length;
  };

  dateCalculation.blankCheck = function (value) {
    for (let i = 0; i < value.settings.length; i++) {
      if (value.settings[i].dateSelect === 'none') {
        return true;
      }    
    }
    return false;
  };

  dateCalculation.sblankCheck = function(value){
    for (let i = 0; i < value.settings.length; i++) {
      if(value.settings[i].yearSelect === 'none' && value.settings[i].monthSelect === 'none' && value.settings[i].daySelect === 'none'){
        return true;
      } 
    }
    return false;
    
  }

  dateCalculation.tableCheck = async function(value) {
    const fieldList = await this.getFieldList();
    for (let i = 0; i < value.settings.length; i++) {
      let dateTable = '';
      const parts1 = value.settings[i].dateSelect.split('　');
      if (parts1.length === 2) {
        const parent = fieldList.find((x) => x.code === parts1[0]);
        if (parent.type === 'SUBTABLE') dateTable = parts1[0];
      }
      let array = [];
      if(value.settings[i].yearSelect !== 'none') array.push(value.settings[i].yearSelect);
      if(value.settings[i].monthSelect !== 'none') array.push(value.settings[i].monthSelect);
      if(value.settings[i].daySelect !== 'none') array.push(value.settings[i].daySelect);
      for (let j = 0; j < array.length; j++) {
        let destTable = '';
        const parts2 = array[j].split('　');
        if (parts2.length === 2) {
          const parent = fieldList.find((x) => x.code === parts2[0]);
          if (parent.type === 'SUBTABLE') destTable = parts2[0];
        }
        if (dateTable != destTable) return true;
      }
    }
    return false;
  };

  /***********************************************************
   * [テーブル名抽出関数]
   * @param {array} value [フィールド名]
   * @returns [テーブル内の場合テーブル名　テーブル外の場合空文字列を返す]
   **********************************************************/

  function getTableName(fieldName){
    const parts = fieldName.split('　');
    if (parts.length !== 2) return '';
    const parent = fieldList.find((x) => x.code === parts[0]);
    if (parent.type === 'SUBTABLE') return parts[0];
    return '';
  }

  dateCalculation.changeEvent = function () {
    const that = this;
    $(document).on('change', '.date-select,.year-select,.month-select,.day-select', async function () {
      var scrollPosition = window.scrollY;
      await that.currentSelect();
      window.scrollTo(0, scrollPosition);
    });
  };

  dateCalculation.setLength = function () {
    this.search();

    for (let i = 0; i < $('.main-contents').length; i++) {
      const $mainContent = $('.main-contents').eq(i);
      const str1 = $mainContent.find('.date-select option:selected').text().length;
      const str2 = $mainContent.find('.year-select option:selected').text().length;
      const str3 = $mainContent.find('.month-select option:selected').text().length;
      const str4 = $mainContent.find('.day-select option:selected').text().length;

      let arr = [str1, str2, str3, str4]
      let len = Math.max(...arr) * 17 + 20;
      if (len < 290) len = 290;

      $mainContent.find('.tip-container').find('.select2-selection--single').css('width', len + 'px');
      $mainContent.find('.tip-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $mainContent.css('width', len + 50 + 'px');
    }
  }

  dateCalculation.currentSelect = async function () {

    const that = this;
    let array = [];

    that.setLength();

    const fieldList = await that.getFieldList(true);
    const useFieldList = that.filterField(
      fieldList,
      true,
      'NUMBER'
    );
    const useFieldList1 = that.filterField(
      fieldList,
      true,
      'DATE',
    );

    $('.main-contents').each(function () {
      array.push($(this).find('.date-select').val());
      array.push($(this).find('.year-select').val());
      array.push($(this).find('.month-select').val());
      array.push($(this).find('.day-select').val());
    });


    $('.main-contents').each(function () {

      //currentSelect1
      const currentSelect1 = $(this).find('.date-select');
      const currentValue1 = currentSelect1.val();
      let newOptions1 = [];

      newOptions1 = useFieldList1.filter(option => !array.includes(option.fieldName) || option.fieldName === currentValue1);


      currentSelect1.empty();
      that.createOption(newOptions1, currentSelect1);
      currentSelect1.val(currentValue1);

      //currentSelect2
      const currentSelect2 = $(this).find('.year-select');
      const currentValue2 = currentSelect2.val();
      let newOptions2 = [];

      newOptions2 = useFieldList.filter(option => !array.includes(option.fieldName) || option.fieldName === currentValue2);


      currentSelect2.empty();
      that.createOption(newOptions2, currentSelect2);
      currentSelect2.val(currentValue2);

      //currentSelect3
      const currentSelect3 = $(this).find('.month-select');
      const currentValue3 = currentSelect3.val();
      let newOptions3 = [];

      newOptions3 = useFieldList.filter(option => !array.includes(option.fieldName) || option.fieldName === currentValue3);


      currentSelect3.empty();
      that.createOption(newOptions3, currentSelect3);
      currentSelect3.val(currentValue3);

      //currentSelect4
      const currentSelect4 = $(this).find('.day-select');
      const currentValue4 = currentSelect4.val();
      let newOptions4 = [];

      newOptions4 = useFieldList.filter(option => !array.includes(option.fieldName) || option.fieldName === currentValue4);


      currentSelect4.empty();
      that.createOption(newOptions4, currentSelect4);
      currentSelect4.val(currentValue4);
    });

  }

  /************************************************
   * [保存・キャンセルボタンクリック時イベント処理関数]
   ***********************************************/
  dateCalculation.buttonClickEvent = function () {
    const that = this;

    //[保存ボタンクリック時イベント]
    $submit.on('click', async function (e) {
      e.preventDefault();

      const value = that.submit();

      if (that.blankCheck(value)) {
        that.displayAlert('エラー', '必須項目が未設定です。', 'error', 'OK');
        return false;
      }

      if (that.sblankCheck(value)) {
        that.displayAlert('エラー', '年、月、日の格納フィールドは最低どれか1つを<br>選択する必要があります。', 'error', 'OK');
        return false;
      }

      if (that.dupCheck(value)) {
        that.displayAlert('エラー', '選択されたフィールドが重複しています。', 'error', 'OK');
        return false;
      }

      if (await that.tableCheck(value)) {
        that.displayAlert('エラー', '異なるテーブルに属するフィールドは選択できません。', 'error', 'OK');
        return false;
      }
      //[文字列に変換]
      value.settings = JSON.stringify(value.settings);

      kintone.plugin.app.setConfig(value);
    });

    //[キャンセルボタンクリック時イベント]
    $cancelButton.on('click', function () {
      window.location.href = '../../' + kintone.app.getId() + '/plugin/';
    });
  };

  //[関数実行]
  dateCalculation.config(config);

})(jQuery, kintone.$PLUGIN_ID);
