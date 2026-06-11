// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';


  /**
   * @param $submit       [保存ボタン要素]
   * @param $cancelButton [キャンセルボタン要素]
   * @param config        [プラグイン設定内容オブジェクト]
   */
  const $submit = $('#submit');
  const $cancelButton = $('.js-cancel-button');
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  //[処理用オブジェクト]
  const date = {};
  date.fieldList = [];

  date.checkCertificationFile = async function () {
    if (typeof KNTP867810certification === 'function') {
      return true;
    } else {
      return false;
    }
  }


  /********************************************
   * [プラグイン設定保存処理関数]
   * @returns [プラグイン保存設定内容オブジェクト]
   ********************************************/
  date.submit = function () {
    const value = {
      date: [],
      text: [],
      oneWordCheck: [],
    };

    for (let i = 0, length = $('.main-contents').length; i < length; i++) {
      value.date.push($('.date')[i].value);
      value.text.push($('.text')[i].value);
      value.oneWordCheck.push($('.oneWordCheck')[i].checked);
    }

    return value;
  };

  /**********************************************************
   * [プラグイン設定画面表示時処理関数]
   * @param {object} config [プラグイン保存設定内容オブジェクト]
   **********************************************************/
  date.config = async function (config) {
    const that = this;

    if (!(await that.checkCertificationFile())) {
      that.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
      return;
    } else {
      if (!(await KNTP867810certification())) {
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
     * @param {Array} fieldList [フィールドID順にフィールドのリスト取得]
     */
    that.fieldList = await that.getFieldList();
    const dateFieldList = that.filterField(that.fieldList, true, 'DATE');
    const textFieldList = that.filterField(that.fieldList, true, 'SINGLE_LINE_TEXT');

    //[ドロップダウンにオプション追加]
    that.createOption(dateFieldList, $('.date'));
    that.createOption(textFieldList, $('.text'));

    //[既にプラグイン設定が保存されている場合の処理]
    if (Object.keys(config).length) {
      //[JSON型に変換]
      config.date = JSON.parse(config.date);
      config.text = JSON.parse(config.text);
      config.oneWordCheck = JSON.parse(config.oneWordCheck);

      //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
      for (let i = 1, length = config.date.length; i < length; i++) {
        const clone = $('.main-contents:first').clone(true);
        $('#parent').append(clone);
      }

      //[プラグイン保存設定反映]
      for (let i = 0, length = config.date.length; i < length; i++) {
        $('.date')[i].value = config.date[i];
        $('.text')[i].value = config.text[i];
        $('.oneWordCheck')[i].checked = config.oneWordCheck[i];
      }

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
  date.getFieldList = async function () {
    const fieldList = [];
    try {
      const resp = await kintone.api('/k/v1/app/form/layout.json', 'GET', { app: kintone.app.getId() });
      resp.layout.forEach(row => {
        if (row.type === 'ROW') row.fields.forEach(field => fieldList.push(field));
        else if (row.type === 'SUBTABLE') {
          fieldList.push(row);
          //if (!subTable) return;
          row.fields.forEach(field => {
            const fieldInfo = {
              type: field.type,
              code: `${row.code}　${field.code}`,
            };
            fieldList.push(fieldInfo);
          })
        }
        else if (row.type === 'GROUP') {
          fieldList.push(row);
          row.layout.forEach(childRow => childRow.fields.forEach(field => {
            //fieldList.push(field)
            const fieldInfo = {
              type: field.type,
              code: `${row.code}　${field.code}`,
            };
            fieldList.push(fieldInfo);
          }));
        };
      })

      let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
      fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];

      fieldList.forEach(field => {
        const target = fieldList2.find(x => x.var === field.code);
        if (!target) return;
        field.id = target.id;
        field.properties = target.properties;
        field.label = target.label;

        if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
        field.fields.forEach(inField => {
          const inTarget = Object.values(target.fieldList).find(x => x.var === inField.code);
          inField.id = inTarget.id;
          inField.properties = inTarget.properties;
          inField.label = inTarget.label;
        })
      })
    } catch {

    }
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
  date.filterField = function (fieldList, flg, ...limitFieldType) {
    if (!limitFieldType.length) return fieldList;
    if (flg) fieldList = fieldList.filter((x) => limitFieldType.includes(x.type));
    else fieldList = fieldList.filter((x) => !limitFieldType.includes(x.type));
    return fieldList;
  };

  /***************************************
   * [ドロップダウンに検索機能追加・CSS追加]
   **************************************/
  date.search = function () {
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
  };

  /*************************************
   * [追加・削除ボタンクリック時の処理関数]
   ************************************/
  date.rowButtonClickEvent = function () {
    const that = this;
    //[追加ボタンクリック時の処理]
    $(document).on('click', '.add-row', async function () {
      $('.date').select2('destroy');
      $('.text').select2('destroy');

      const clone = $('.main-contents:first').clone(true);
      clone.find('.oneWordCheck').prop('checked', false);
      //[クローン 値リセット]
      $(this).closest('.main-contents').after(clone);

      await that.currentSelect();
    });

    //[削除ボタンクリック時の処理]
    $(document).on('click', '.remove-row', async function () {
      if ($('.main-contents').length > 1) {
        $(this).closest('.main-contents').remove();
      }

      await that.currentSelect();
    });
  };

  /***********************************************
   * [オプション作成処理関数]
   * @param {Array} fields [フィールドリスト]
   * @param {HTMLAllCollection} name [クラス・ID名]
   ***********************************************/
  date.createOption = function (fields, name) {
    const $noneOption = $('<option>', {
      value: 'none',
      text: ''
    });
    name.append($noneOption);
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
  date.displayAlert = function (title, text, type, button) {
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
  date.emptyCheck = function (value) {
    let flag = false;

    value.text.forEach((item) => {
      if(item == '' || item == 'none') flag = true;
    });

    value.date.forEach((item) => {
      if(item == '' || item == 'none') flag = true;
    });

    return flag;
  };

  /***********************************************************
   * [重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  date.dupCheck = function (value) {
    const array = [];

    value.text.forEach((item) => {
      array.push(item);
    });

    value.date.forEach((item) => {
      array.push(item);
    });

    const a = new Set(array);
    return a.size !== array.length;
  };

  /***********************************************************
    * [テーブル跨ぎチェック処理関数]
    * @param {array} value [テーブル跨ぎチェックを行う配列]
    * @returns [跨いでいる場合 true　いない場合 falseを返す]
  **********************************************************/
  date.tableCheck = function (value) {
    const that = this;
    let flag = false
    for(let i = 0; i < value.text.length; i++){
      const A = that.getTableName(value.text[i]);
      const B = that.getTableName(value.date[i])
      if (A !== '' && B !== '' && A !== B) flag = true;
      if ((A === '' && B !== '') || (A !== '' && B === '') || (A !== '' && B !== '' && A !== B)) {flag = true}
    }
    return flag;
  }

  /***********************************************************
    * [テーブル名抽出関数]
    * @param {array} value [テーブル跨ぎチェックを行う配列]
    * @returns [テーブル内の場合テーブル名　テーブル外の場合空文字列を返す]
  **********************************************************/
  date.getTableName = function(fieldName){
    const that = this;
    const parts = fieldName.split('　');
    if (parts.length !== 2) return '';
    const parent =that.fieldList.find((x) => x.code === parts[0]);
    if (parent.type === 'SUBTABLE') return parts[0];
    return '';
  }

  date.changeEvent = function () {
    const that = this;
    $(document).on('change', '.date,.text', async function () {
      var scrollPosition = window.scrollY;
      await that.currentSelect();
      window.scrollTo(0, scrollPosition);
    });
  };

  date.setLength = function () {
    this.search();

    for (let i = 0; i < $('.main-contents').length; i++) {
      const $mainContent = $('.main-contents').eq(i);
      const str1 = $mainContent.find('.date option:selected').text().length;
      const str2 = $mainContent.find('.text option:selected').text().length;

      let arr = [str1, str2]
      let len = Math.max(...arr) * 17 + 20;
      if (len < 290) len = 290;

      $mainContent.find('.tip-container').find('.select2-selection--single').css('width', len + 'px');
      $mainContent.find('.tip-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $mainContent.css('width', len + 50 + 'px');
    }
  };

  date.currentSelect = async function () {

    const that = this;
    let array = [];

    const useFieldList = that.filterField(
      that.fieldList,
      true,
      'SINGLE_LINE_TEXT'
    );

    const useFieldList1 = that.filterField(
      that.fieldList,
      true,
      'DATE'
    );

    $('.main-contents').each(function () {
      array.push($(this).find('.date').val());
      array.push($(this).find('.text').val());
    });

    $('.main-contents').each(function () {

      //currentSelect1
      const currentSelect1 = $(this).find('.date');
      let currentValue1 = currentSelect1.val();

      let newOptions1 = [];

      newOptions1 = useFieldList1.filter(option => !array.includes(option.code) || option.code === currentValue1);

      currentSelect1.empty();
      that.createOption(newOptions1, currentSelect1);
      currentSelect1.val(currentValue1);

      //currentSelect2
      const currentSelect2 = $(this).find('.text');

      let currentValue2 = currentSelect2.val();
      let newOptions2 = [];

      newOptions2 = useFieldList.filter(option => !array.includes(option.code) || option.code === currentValue2);

      currentSelect2.empty();
      that.createOption(newOptions2, currentSelect2);
      currentSelect2.val(currentValue2);
    });

    that.setLength();
  };

  /************************************************
   * [保存・キャンセルボタンクリック時イベント処理関数]
   ***********************************************/
  date.buttonClickEvent = function () {
    const that = this;

    //[保存ボタンクリック時イベント]
    $submit.on('click', function (e) {
      e.preventDefault();

      const value = that.submit();
      if (that.emptyCheck(value)) {
        that.displayAlert(
          'エラー',
          `選択された曜日を表示する日付フィールドまたは\n曜日を格納するフィールドが空欄です。`,
          'error',
          'OK'
        );
        return false;
      }

      if(that.tableCheck(value)) {
      that.displayAlert(
          'エラー',
          `別テーブルに属するフィールドは選択できません。。`,
          'error',
          'OK'
        );
        return false;
     }

      if (that.dupCheck(value)) {
        that.displayAlert(
          'エラー',
          `選択された曜日を表示する日付フィールドまたは\n曜日を格納するフィールドが重複しています。`,
          'error',
          'OK'
        );
        return false;
      }

      //[文字列に変換]
      value.date = JSON.stringify(value.date);
      value.text = JSON.stringify(value.text);
      value.oneWordCheck = JSON.stringify(value.oneWordCheck);

      kintone.plugin.app.setConfig(value);
    });

    //[キャンセルボタンクリック時イベント]
    $cancelButton.on('click', function () {
      window.location.href = '../../' + kintone.app.getId() + '/plugin/';
    });
  };

  //[関数実行]
  date.config(config);
})(jQuery, kintone.$PLUGIN_ID);
