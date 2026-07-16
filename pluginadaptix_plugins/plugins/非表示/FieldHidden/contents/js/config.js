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


  if (!(checkCertificationFile())) {
    displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
    return;
  } else {
    if (!(await KNTP932510certification())) {
      return;
    }
  }


  const $submit = $('#submit');
  const $cancelButton = $('.js-cancel-button');
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  //console.log(config);

  let fieldList = await getFieldList();
  fieldList = filterField(fieldList, false, 'LABEL', 'HR', 'SPACER');

  //ドロップダウンにオプション追加
  //createOption(fieldList, $('.field-select'));

  //設定保持
  if (Object.keys(config).length) {
    //設定したドロップダウンリストのvalueリスト
    const dropList = JSON.parse(config.elementArray);
    // console.log(dropList);
    const width = config.width;
    //保存した設定個数分ドロップダウンを増やす
    for (let i = 1, len = dropList.length; i < len; i++) {
      const clone = $('.main-contents:first').clone(true);
      $('#parent').append(clone);
    }

    //保存した設定を反映
    for (let i = 0; i < dropList.length; i++) {
      const newOptions = fieldList.filter(option => !dropList.includes(option.fieldName) || option.fieldName === dropList[i]);
      createOption(newOptions, $('.main-contents').find('.field-select').eq(i));
      $('.main-contents').find('.field-select').eq(i).val(dropList[i]);
    }

    let dis = 260 + parseInt(width) - 290;
    let pWidth = 370 + parseInt(width) - 290;
    $('.kintoneplugin-table-td-operation').css('margin-left', width);
    $('#parent').css('width', pWidth + 'px');
    search(width, dis + 'px');

  } else {
    createOption(fieldList, $('.field-select'));
    search('290px', '260px');
  }

  //追加ボタン
  $(document).on('click', '.add-button', async function () {
    const width = $('.select2-selection--single').css('width');
    $('.field-select').select2('destroy');

    const clone = $('.main-contents:first').clone(true);

    $(this).closest('.main-contents').after(clone);
    //await createNewOption();
    const dis = 260 + parseInt(width) - 290;
    search(width, dis + 'px');
    await createNewOption();//search関数によるCSS成形の前にawait関数があると、異常表示されるため移動した。
  });

  //削除ボタン
  $(document).on('click', '.delete-button',async function () {
    if ($('.main-contents').length > 1) {
      $(this).closest('.main-contents').remove();
    }
    const width = $('.select2-selection--single').css('width');
    await createNewOption();
    const dis = 260 + parseInt(width) - 290;
    search(width, dis + 'px');
  });

  $(document).on('change', '.field-select', async function () {
    var scrollPosition = window.scrollY;
    let width = $('.select2-selection--single').css('width');
    width = parseInt(width);

    await createNewOption();

    let maxWidth = 0;
    $('.field-select').each(function () {
      $(this).find('option:selected').each(function () {
        var textLength = $(this).text().length;
        if (textLength > maxWidth) {
          maxWidth = textLength;
        }
      });

    });

    $('.field-select').select2('destroy');
    let newWidth = maxWidth * 17 + 20;

    if (width !== newWidth) {
      if (newWidth > 290) {
        var dis = 260 + newWidth - 290;
        var pWidth = 370 + newWidth - 290;
        $('.kintoneplugin-table-td-operation').css('margin-left', newWidth + 'px');
        $('#parent').css('width', pWidth + 'px');
        search(newWidth + 'px', dis + 'px')
      } else {
        $('.kintoneplugin-table-td-operation').css('margin-left', '290px');
        $('#parent').css('width', '370px');
        search('290px', '260px');
      }
    } else {
      var dis = 260 + width - 290;
      var pWidth = 370 + width - 290;
      $('.kintoneplugin-table-td-operation').css('margin-left', width + 'px');
      $('#parent').css('width', pWidth + 'px');
      search(width + 'px', dis + 'px');
    }
    window.scrollTo(0, scrollPosition);
  });

  async function createNewOption() {
    //let fieldList = await getFieldList();
    //fieldList = filterField(fieldList, false, 'LABEL', 'HR', 'SPACER');

    let array = [];
    let maxWidth = 0;
    $('.field-select').each(function () {
      $(this).find('option:selected').each(function () {
        var textLength = $(this).text().length;
        if (textLength > maxWidth) {
          maxWidth = textLength;
        }
      });

      array.push($(this).val());

    });


    $('.field-select').each(function (index) {
      const currentSelect = $(this);
      const currentValue = currentSelect.val();
      const newOptions = fieldList.filter(option => !array.includes(option.fieldName) || option.fieldName === currentValue);

      currentSelect.empty();

      createOption(newOptions, currentSelect);
      currentSelect.val(array[index]);
    });
  }

  //保存ボタン押下時
  $submit.on('click', function (e) {
    e.preventDefault();
    const elementArray = [];

    for (let i = 0; i < $('.field-select').length; i++) {
      elementArray.push($('.field-select').eq(i).val() ? $('.field-select').eq(i).val() : 'none');
    }

    if (emptyCheck(elementArray)) {
      displayAlert('エラー', '未入力のフィールドがあります。', 'error', 'OK');
      return false;
    }

    if (dupCheck(elementArray)) {
      displayAlert('エラー', '選択されたフィールドが重複しています。', 'error', 'OK');
      return false;
    }

    const width = $('.select2-selection--single').css('width');

    const config = { elementArray: JSON.stringify(elementArray), width: width };
    kintone.plugin.app.setConfig(config);
  });

  //キャンセルボタンクリック時
  $cancelButton.on('click', function () {
    window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  });

  function createOption(fieldList, name) {
    const option = $('<option>', {
      value: '',
      text: '',
    });
    name.append(option);
    fieldList.forEach((field) => {
      const option = $('<option>', {
        value: field.fieldName,
        text: field.fieldName,
      });
      name.append(option);
    });
  }

  /***************************************
   * [フォームに設置してある全フィールド取得]
   * @returns [フォームの左上から順番のフィールドリスト]
   **************************************/
  async function getFieldList() {
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
    } catch {

    }
    return fieldList;
  }

  /************************************************
   * [指定したフィールドを抽出する関数]
   * @param {Array} フィルターをかけるフィールドリスト
   * @param {boolean} 指定したフィールドタイプを抽出 true   以外を抽出 false
   * @param {Array} 抽出するフィールドタイプリスト
   * @returns [抽出したフィールドリスト]
   ************************************************/
  function filterField(fieldList, flg, ...limitFieldType) {
    if (!limitFieldType.length) return fieldList;
    let filteredFieldList = [];

    if (!flg) {
      fieldList.forEach((row) => {
        if (row.type === 'GROUP') {
          filteredFieldList.push({
            fieldName: row.code,
            code: row.code
          });
          row.layout.forEach((childRow) => {
            childRow.fields.forEach((field) => {
              if (!limitFieldType.includes(field.type)) {
                filteredFieldList.push({
                  fieldName: (row.code ? row.code : row.label) + ' ' + field.code,
                  code: field.code
                });
              }
            });
          });
        } else if (row.type === 'SUBTABLE') {
          filteredFieldList.push({
            fieldName: row.code,
            code: row.code
          });
          row.fields.forEach((subField) => {
            if (!limitFieldType.includes(subField.type)) {
              filteredFieldList.push({
                fieldName: (row.code ? row.code : row.label) + ' ' + subField.code,
                code: subField.code
              });
            }
          });
        } else {
          if (!limitFieldType.includes(row.type)) {
            filteredFieldList.push({
              fieldName: row.code,
              code: row.code
            });
          }
        }
      });
    }

    return filteredFieldList;
  }

  /****************************************
   * [ドロップダウンに検索機能を追加・CSS追加]
   ****************************************/
  function search(selectWidth, arrowDis) {
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
      top: '11px',
      left: '260px',
    });

    $('.select2-container--default .select2-selection--single .select2-selection__arrow b').css({
      'border-color': '#3498db transparent transparent transparent',
    });
    
  }

  function checkCertificationFile() {
    if (typeof KNTP932510certification === 'function') {
      return true;
    } else {
      return false;
    }
  }

  /******************************************
  * [アラートの表示処理関数]
  * @param {string} title  [タイトル]
  * @param {string} text   [説明文]
  * @param {string} type   [アラートタイプ]
  * @param {string} button [ボタン名表示文字]
  * 使用例 ： that.displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');
  *****************************************/
  function displayAlert(title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button,
    });
  }

  /***********************************************************
* [重複チェック処理関数]
* @param {array} value [重複チェックを行う配列]
* @returns [重複している場合 true　していない場合 falseを返す]
**********************************************************/
  function dupCheck(value) {
    const array = [];

    value.forEach((item) => {
      array.push(item);
    });
    const a = new Set(array);
    return a.size !== array.length;
  };

  /***********************************************************
   * [未入力チェック処理関数]
   * @param {array} value [未入力チェックを行う配列]
   * @returns [未入力がある場合 true　ない場合 falseを返す]
   **********************************************************/
  function emptyCheck(value) {
    let flag = false;

    value.forEach((item) => {
      if(item === '' || item === 'none') flag = true;
    });
    return flag;
  };


})(jQuery, kintone.$PLUGIN_ID);
