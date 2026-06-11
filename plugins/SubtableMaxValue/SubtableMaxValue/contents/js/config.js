// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP929810certification())) {
    return;
  }

  /**
   * @param $submit 　　　[保存ボタン要素]
   * @param $cancelButton [キャンセルボタン要素]
   * @param config        [保存設定内容]
   */
  const $submit = $('#submit');
  const $cancelButton = $('.js-cancel-button');
  let config = kintone.plugin.app.getConfig(PLUGIN_ID);

  //処理用オブジェクト
  let tableMaxLimit = {};
  tableMaxLimit.fieldList = [];
  /**
   * [設定保存処理]
   */
  tableMaxLimit.submit = function () {
    let value = {
      tableSelect: [],
      limitNumber: [],
    };

    for (let i = 0; i < $('.tr').length; i++) {
      value.tableSelect.push($('.sub-table-select')[i].value);
      value.limitNumber.push($('.kintoneplugin-input-text')[i].value);
    }
    return value;
  };

  /**
   * [設定画面表示時の処理]
   */
  tableMaxLimit.config = async function (_config) {
    let that = this;
    let config = _config;

    //ボタンクリックイベント及びドロップダウン値変化イベント
    that.buttonClickEvent();
    that.rowButtonClickEvent();
    that.changeEvent();
    that.numberFieldValueCheck();

    that.fieldList = await that.getFieldList();
    const tableFieldList = await that.filterField(that.fieldList, true, 'SUBTABLE');
    const tableFieldListCodes = tableFieldList.map(function (x){return x.code});

    //未選択の選択肢を作成する。
    const nullOption = $('<option>', {
      value: "",
      text: "",
    });

    $('.sub-table-select').append(nullOption);
  
    tableFieldList.forEach((field) => {
      const option = $('<option>', {
        value: field.code,
        text: field.code,
      });
      $('.sub-table-select').append(option);
      that.createNewOption();
    });

    //設定情報がある場合、保存設定反映
    if (Object.keys(config).length) {
      //JSON型に変換
      config.tableSelect = JSON.parse(config.tableSelect);
      config.limitNumber = JSON.parse(config.limitNumber);

      //[設定情報のサブテーブルの配列から、現存しないサブテーブルを除外する。]
      const tableExistingMap = config.tableSelect.filter((item) => tableFieldListCodes.includes(item))
      //保存されている行数に合わせる
      for (let i = 1; i < tableExistingMap.length; i++) {
        let tbody = document.getElementById('tbody');
        let clone = tbody.firstElementChild.cloneNode(true);
        tbody.appendChild(clone);
      }

      //保存内容反映
      let j = 0;//設定項目の位置
      for (let i = 0; i < config.tableSelect.length; i++) {
        //サブテーブルが現存していなければ、次のターンに回す。
        if(!tableFieldListCodes.includes(config.tableSelect[i])){continue;}
        $('.sub-table-select')[j].value = config.tableSelect[i];
        $('.kintoneplugin-input-text')[j].value = config.limitNumber[i];
        j++;//代入が行われれば、設定項目の位置を１増やす。
      }
      that.createNewOption()
      that.search();
    } else {
      that.search();
    }
  };

  /***************************************
   * [フォームに設置してある全フィールド取得]
   * @returns [フォームの左上から順番のフィールドリスト]
   **************************************/
  tableMaxLimit.getFieldList = async function () {
    const fieldList = [];
    const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
      app: kintone.app.getId(),
    });
    resp.layout.forEach((row) => {
      if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push(field));
      else if (row.type === 'SUBTABLE') fieldList.push(row);
      else if (row.type === 'GROUP') {
        fieldList.push(row);
        row.layout.forEach((childRow) => childRow.fields.forEach((field) => fieldList.push(field)));
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
  tableMaxLimit.filterField = function (fieldList, flg, ...limitFieldType) {
    if (!limitFieldType.length) return fieldList;
    if (flg) fieldList = fieldList.filter((x) => limitFieldType.includes(x.type));
    else fieldList = fieldList.filter((x) => !limitFieldType.includes(x.type));
    return fieldList;
  };

  /***************************************
   * [ドロップダウンに検索機能追加・CSS追加]
   **************************************/
  tableMaxLimit.search = function () {
    $('.select2').select2({
      width: '280px',
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
      top: '11px',
      left: '260px',
    });

    $('.select2-container--default .select2-selection--single .select2-selection__arrow b').css({
      'border-color': '#3498db transparent transparent transparent',
    });
  };

  /**
   * [追加・削除ボタンクリック時の処理]
   */
  tableMaxLimit.rowButtonClickEvent = function () {
    const that = this;
    $(document).on('click', '.kintoneplugin-button-add-row-image', function () {
      $('.sub-table-select').select2('destroy');
      const clone = $('.tr:first').clone(true);
      clone.find('#maxNumberOfRows').val("");
      $(this).closest('.tr').after(clone);
      that.search();
      that.createNewOption()
    });

    $(document).on('click', '.kintoneplugin-button-remove-row-image', function () {
      if ($('.tr').length > 1) $(this).closest('.tr').remove();
      that.createNewOption()
    });
  };

  /**
   * [ドロップダウンの値を変化した時に、新しく選択肢を作るようにする。]
   */
  tableMaxLimit.changeEvent = function () {
    const that = this;
    $(document).on('change', '.sub-table-select', async function () {
      var scrollPositionY = window.scrollY;
      await that.createNewOption();
      window.scrollTo(0, scrollPositionY);
    });
  }

  /**
  * [最大行数(半角数字)フィールドに、文字を入力する時にバリテーションチェックを行う。]
  */

  tableMaxLimit.numberFieldValueCheck = function () {
    const that = this;
    $(document).on('blur', '#maxNumberOfRows', async function () {
      const reg = /^[1-9][0-9]*$/;
      if($(this).val() && !reg.test($(this).val())){$(this).val("");tableMaxLimit.displayAlert('エラー', "1以上の整数を半角数字で入力してください。", 'error', 'OK')}
    })
  }

   /**
   * [最大行数(半角数字)フィールドで、エンターキーを押した時のイベント(エラー画面に推移させない)。]
  */
   //$(function(){
    $(document).on('keydown',"#maxNumberOfRows",function(e){
      if(e.which == 13) {
        const reg = /^[1-9][0-9]*$/;
        if($(this).val() == ""){tableMaxLimit.displayAlert('エラー', "空白は入力しないでください。", 'error', 'OK')}
        if($(this).val() && !reg.test($(this).val())){$(this).val("");tableMaxLimit.displayAlert('エラー', "1以上の整数を半角数字で入力してください。", 'error', 'OK')}
        return false;
      }
    });
  //});

  /** 
   * [新しく選択肢を作成する。]
   */
  tableMaxLimit.createNewOption = async function () {
    const that = this;
    let array = [];
    const tableFieldList = that.filterField(that.fieldList, true, 'SUBTABLE');

      $('.tr').each(function () {
        array.push($(this).find('.sub-table-select').val());
        if(tableFieldList.length <= $('.tr').length){$(this).find('.kintoneplugin-button-add-row-image').hide()}
        else{$(this).find('.kintoneplugin-button-add-row-image').show()}
      });

      $('.tr').each(function () {
        const val1 = $(this).find('.sub-table-select').val();
        const newOptions1 = tableFieldList.filter(x => !array.includes(x.code) || x.code === val1);
        $(this).find('.sub-table-select').empty();
        const $noneOption = $('<option>', {
          value: null,
          text: ' ',
        });
        $(this).find('.sub-table-select').append($noneOption);
         
        newOptions1.forEach((field) => {
          const option = $('<option>', {
            value: field.code,
            text: field.code,
          });
          $(this).find('.sub-table-select').append(option);
        });

        $(this).find('.sub-table-select').val(val1);
      });

    },

  /**
   * [保存・キャンセルボタンクリック時の処理関数]
   */
  tableMaxLimit.buttonClickEvent = function () {
    let that = this;

    //保存ボタンクリック時の処理
    $submit.on('click', function (e) {
      e.preventDefault();

      let errMesseage = "";//エラーメッセージ
      let value = that.submit();

      for (let i = 0; i < value.tableSelect.length; i++) {
        if(value.tableSelect[i] == ""){errMesseage = errMesseage + Number(i + 1) + "番目のテーブルフィールドが選択されていません。<br>";}
        if(value.limitNumber[i] == ""){errMesseage = errMesseage + Number(i + 1) + "番目の最大行数が未入力です。<br>";}
      }
  
      if(errMesseage != ""){tableMaxLimit.displayAlert('エラー', errMesseage, 'error', 'OK');return;}//エラーがあった場合にリターン。

      //文字列に変換
      value.tableSelect = JSON.stringify(value.tableSelect);
      value.limitNumber = JSON.stringify(value.limitNumber);

      kintone.plugin.app.setConfig(value);

    });
    //キャンセルボタンクリック時の処理
    $cancelButton.on('click', function () {
      window.location.href = '../../' + kintone.app.getId() + '/plugin/';
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
  tableMaxLimit.displayAlert = function (title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button,
    });
  };

  //実行
  tableMaxLimit.config(config);
})(jQuery, kintone.$PLUGIN_ID);
