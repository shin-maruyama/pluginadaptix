// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  /**
   * @param $submit       [保存ボタン要素]
   * @param $cancelButton [キャンセルボタン要素]
   * @param config        [設定保存内容]
   */
  const $submit = $('#submit');
  const $cancelButton = $('.js-cancel-button');
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  //処理用オブジェクト
  const sign = {};

  sign.checkCertificationFile = async function () {
    if (typeof KNTP341410certification === 'function') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @param fieldTypeSpace    [スペースフィールドのタイプ]
   * @param fieldTypeFile     [添付ファイルフィールドのタイプ]
   * @param fieldTypeDatetime [日時フィールドのタイプ]
   */
  sign.fieldTypeSpace = 'SPACER';
  sign.fieldTypeFile = 'FILE';
  sign.fieldTypeDatetime = 'DATETIME';

  /*******************
   * [設定保存処理関数]
   *******************/
  sign.submit = function () {
    const value = {
      settings: [],
    };
    for (let i = 0, length = $('.main-contents').length; i < length; i++) {
      const item = {
        space: $('.space-select')[i].value ? $('.space-select')[i].value : 'none',
        file: $('.file-select')[i].value ? $('.file-select')[i].value : 'none',
        date: $('.date-select')[i].value ? $('.date-select')[i].value : 'none',
      };
      value.settings.push(item);
    }
    return value;
  };

  /*********************************
   * [プラグイン設定画面表示時処理関数]
   *********************************/
  sign.config = async function (_config) {
    const that = this;
    const config = _config;

    if (!(that.checkCertificationFile())) {
      that.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
      return;
    } else {
      if (!(await KNTP341410certification())) {
        return;
      }
    }


    that.buttonClickEvent();
    that.rowButtonClickEvent();
    that.changeEvent();

    that.fieldList = await that.getFieldList();
    const fileFieldList = that.filterField(that.fieldList, true, this.fieldTypeFile);
    const dataFieldList = that.filterField(that.fieldList, true, that.fieldTypeDatetime);
    const spaceFieldList = that.filterField(that.fieldList, true, that.fieldTypeSpace);

    //[スペースフィールドドロップダウンにオプション追加]
    that.createOption(spaceFieldList, $('.space-select'));
    that.createOption(fileFieldList, $('.file-select'));
    that.createOption(dataFieldList, $('.date-select'));
   
    //[プラグイン設定が保存されている場合、設定を反映]
    if (Object.keys(config).length) {
      //[JSON型に変換]
      config.settings = JSON.parse(config.settings);

      for (let i = 1, length = config.settings.length; i < length; i++) {
        const parent = document.querySelector('#parent');
        const clone = parent.firstElementChild.cloneNode(true);
        parent.appendChild(clone);
      }

      //[設定を反映]
      for (let i = 0, length = config.settings.length; i < length; i++) {
        $('.space-select')[i].value = config.settings[i].space;
        $('.file-select')[i].value = config.settings[i].file;
        $('.date-select')[i].value = config.settings[i].date;
      }

      //that.search();
      await that.currentSelect();
    } else {
      that.search();
    }

    $('#parent').sortable();
  };

  /***************************************
   * [フォームに設置してある全フィールド取得]
   * @returns [フォームの左上から順番のフィールドリスト]
   **************************************/
  sign.getFieldList = async function () {

    const fieldList = [];
    const fieldList2 = [
      ...Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList),
      ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
    ];

    try {
      const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
        app: kintone.app.getId(),
      });

      resp.layout.forEach((row) => {
        if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push({
          type: field.type,
          code: field.code ? field.code : '',
          id: field.id,
          properties: field.properties,
          elementId: field.elementId ? field.elementId : field.code,
          label: field.code ? field.code : field.elementId,
        }));
        //一度サブテーブルは保留とする。
        /*else if (row.type === 'SUBTABLE') {
          fieldList.push(row);
          row.fields.forEach((field) => {
            const fieldInfo = {
              type: field.type,
              code: field.code,
              id: `${fieldList2.find((x) => x.var === row.code).id}　${Object.values(fieldList2.find((x) => x.var === row.code).fieldList).find((y) => y.var === field.code).id
                }`,
              properties: Object.values(fieldList2.find((x) => x.var === row.code).fieldList).find(
                (y) => y.var === field.code
              ).properties,
              elementId: field.elementId ? field.elementId : field.code,
              label: field.code ? `${row.code}　${field.code}` : `${row.code}　${field.elementId}`,
            };
            fieldList.push(fieldInfo);
          });
        }*/ else if (row.type === 'GROUP') {
          fieldList.push(row);
          row.layout.forEach((childRow) => childRow.fields.forEach((field) => {
            fieldList.push({
              type: field.type,
              code: field.code ? field.code : '',
              id: field.id,
              properties: field.properties,
              elementId: field.elementId ? field.elementId : field.code,
              label: field.code ? row.code + '　' + field.code : row.code + '　' + field.elementId,
            }) 
          }));
        }
      });
    } catch (error) {console.error(error) }

    fieldList.forEach((field) => {
      const target = fieldList2.find((x) => x.var === field.code);
      if (!target) return;
      field.id = target.id;
      field.properties = target.properties;
      //field.label = target.label;

      if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
      field.fields.forEach((inField) => {
        const inTarget = Object.values(target.fieldList).find((x) => x.var === inField.code);
        inField.id = inTarget.id;
        inField.properties = inTarget.properties;
        //inField.label = inTarget.label;
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
  sign.filterField = function (fieldList, flg, ...limitFieldType) {
    if (limitFieldType.length === 0) return fieldList;
    if (flg) fieldList = fieldList.filter((x) => limitFieldType.includes(x.type));
    else fieldList = fieldList.filter((x) => !limitFieldType.includes(x.type));
    return fieldList;
  };

  /****************************************
   * [ドロップダウンに検索機能追加・CSS追加]
   ***************************************/
  sign.search = function () {
    $('.select2').select2({
      //width: '290px',
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

  /****************************************
   * オプションの作成
   ***************************************/

  sign.createOption = function (fieldList, name) {
    const option = $('<option>', {
      value: 'none',
      text: '',
    });
    name.append(option);
    fieldList.forEach((field) => {
      if (field.type === 'SPACER') {
        const option = $('<option>', {
          value: field.elementId,
          text: field.label,
        });
        name.append(option);
      } else {
        const option = $('<option>', {
          value: field.code,
          text: field.label,
        });
        name.append(option);
      }

    });

  };
  /*************************************
   * [追加・削除ボタンクリック時の処理関数]
   ************************************/
  sign.rowButtonClickEvent = function () {
    const that = this;
    //[追加ボタンクリック時の処理]
    $(document).on('click', '.add-row', async (obj) => {
      $('.space-select').select2('destroy');
      $('.file-select').select2('destroy');
      $('.date-select').select2('destroy');

      const parent = document.querySelector('#parent');
      const mainContents = obj.target.parentNode.parentNode;
      const clone = parent.firstElementChild.cloneNode(true);

      parent.insertBefore(clone, mainContents.nextSibling);

      //that.search();
      await that.currentSelect();

    });

    //[削除ボタンクリック時の処理]
    $(document).on('click', '.remove-row', async (obj) => {
      const parent = document.querySelector('#parent');
      const mainContents = obj.target.parentNode.parentNode;
      if (parent.childElementCount > 1) {
        mainContents.remove();
      }
      await that.currentSelect();
    });
  };

  sign.changeEvent = function () {
    const that = this;
    $(document).on('change', '.space-select,.file-select,.date-select', async function () {
      var scrollPositionY = window.scrollY;
      var scrollPositionX = window.scrollX;
      await that.currentSelect();
      window.scrollTo(scrollPositionX, scrollPositionY);
    });
  };

  sign.setLength = function () {
    this.search();

    for (let i = 0; i < $('.main-contents').length; i++) {
      const $mainContent = $('.main-contents').eq(i);
      const str1 = $mainContent.find('.space-select option:selected').text().length;
      const str2 = $mainContent.find('.file-select option:selected').text().length;
      const str3 = $mainContent.find('date-select option:selected').text().length;

      let arr = [str1, str2, str3]
      let len = Math.max(...arr) * 17 + 20;
      if (len < 290) len = 290;

      $mainContent.find('.tip-container').find('.select2-selection--single').css('width', len + 'px');
      $mainContent.find('.tip-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $mainContent.css('width', len + 50 + 'px');
    };
  };

  sign.currentSelect = async function () {

    const that = this;
    let array = [];

    const fileFieldList = that.filterField(
      that.fieldList,
      true,
      'FILE'
    );

    const dataFieldList = that.filterField(
      that.fieldList,
      true,
      'DATETIME',
    );

    const spaceFieldList = that.filterField(
      that.fieldList,
      true,
      'SPACER',
    );

    $('.main-contents').each(function () {
      array.push($(this).find('.space-select').val());
      array.push($(this).find('.file-select').val());
      array.push($(this).find('.date-select').val());
    });

    $('.main-contents').each(function () {

      //手書きサインを表示するスペース
      const currentSelect1 = $(this).find('.space-select');
      const currentValue1 = currentSelect1.val();
      let newOptions1 = [];
      newOptions1 = spaceFieldList.filter(option => !array.includes(option.elementId) || option.elementId === currentValue1);
      currentSelect1.empty();
      that.createOption(newOptions1, currentSelect1);
      currentSelect1.val(currentValue1);

      //サインを保存する添付ファイル
      const currentSelect2 = $(this).find('.file-select');
      const currentValue2 = currentSelect2.val();
      let newOptions2 = [];
      newOptions2 = fileFieldList.filter(option => !array.includes(option.code) || option.code === currentValue2);
      currentSelect2.empty();
      that.createOption(newOptions2, currentSelect2);
      currentSelect2.val(currentValue2);

      //サインをした日時を格納するフィールド
      const currentSelect3 = $(this).find('.date-select');
      const currentValue3 = currentSelect3.val();
      let newOptions3 = [];
      newOptions3 = dataFieldList.filter(option => !array.includes(option.code) || option.code === currentValue3);
      currentSelect3.empty();
      that.createOption(newOptions3, currentSelect3);
      currentSelect3.val(currentValue3);

    });

    that.setLength();
  }

  /***********************************************************
   * [未入力チェック処理関数]
   * @param {array} value [未入力チェックを行う配列]
   * @returns [未入力がある場合 true　ない場合 falseを返す]
   **********************************************************/
  sign.emptyCheck = function (value) {
    let flag = false;

    value.settings.forEach((item) => {
      if (item.space === '' || item.space === 'none') flag = true;
      if (item.file === '' || item.file === 'none') flag = true;
    });
    return flag;
  };

  /***********************************************************
   * [重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  sign.dupCheck = function (value) {
    const array = [];

    value.settings.forEach((item) => {
      array.push(item.space);
      if (item.file !== 'none') array.push(item.file);
      if (item.date !== 'none') array.push(item.date);
    });
    const a = new Set(array);
    return a.size !== array.length;
  };

  /******************************************
   * [アラートの表示処理関数]
   * @param {string} title  [タイトル]
   * @param {string} text   [説明文]
   * @param {string} type   [アラートタイプ]
   * @param {string} button [ボタン名表示文字]
   * 使用例 ： that.displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');
   *****************************************/
  sign.displayAlert = function (title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button,
    });
  };

  /******************************************
   * [保存・キャンセルボタンクリック時の処理関数]
   *****************************************/
  sign.buttonClickEvent = function () {
    const that = this;

    //保存ボタンクリック時の処理
    $submit.on('click', function (e) {
      e.preventDefault();

      //[保存した設定取得]
      const value = that.submit();

      if (that.emptyCheck(value)) {
        that.displayAlert('エラー', 'スペースまたは添付ファイルが選択されていません。', 'error', 'OK');
        return false;
      }

      if (that.dupCheck(value)) {
        that.displayAlert('エラー', '選択されたフィールドが重複しています。', 'error', 'OK');
        return false;
      }

      //[文字列型に変換]
      value.settings = JSON.stringify(value.settings);


      kintone.plugin.app.setConfig(value);
    });

    //キャンセルボタンクリック時の処理
    $cancelButton.on('click', function () {
      window.location.href = '../../' + kintone.app.getId() + '/plugin/';
    });
  };

  //[関数実行]
  sign.config(config);
})(jQuery, kintone.$PLUGIN_ID);
