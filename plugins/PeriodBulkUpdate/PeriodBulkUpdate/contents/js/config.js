// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';



  if (!(typeof KNTP271910certification === 'function')) {
    displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
    return;
  } else {
    if (!(await KNTP271910certification())) {
      return;
    }
  }

  const $submitButton = $('#submit');
  const $cancelButton = $('.js-cancel-button');
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  const legacyPluginIds = Array.from(new Set([PLUGIN_ID, 'acgdhcpcojijcmkcgkldmmelakjmlpno']));

  if (Object.keys(config).length) {
    //[JSON型に変換]
    config.settings = JSON.parse(config.settings);
  } else {
    // 旧バージョンの設定を取り込む
    try {
      for (const legacyPluginId of legacyPluginIds) {
        const config2 = kintone.plugin.app.getConfig(legacyPluginId);
        if(config2.dateField) {
          // 変換処理
          config.settings = [];
          const item = {
            dateField : config2.dateField,
            outputField: config2.outputField,
          }
          config.settings.push(item);

          displayAlert('完了','旧バージョンの設定を読み込みました。','info','OK');
          break;
        }
      }
    } catch { }
  }

  const fieldList = await getFieldList();
  const dateFieldList = filterField(fieldList, true, 'DATE');
  const singleLineTextFieldList = filterField(fieldList, true, 'SINGLE_LINE_TEXT');


  //ドロップダウン作成////
  createOption(dateFieldList, $('.date-field'));
  createOption(singleLineTextFieldList, $('.output-field'));

  //設定保持/////////////////////////////////////////////////////////////////////////
  if (Object.keys(config).length) {

    //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
    for (let i = 1, length = config.settings.length; i < length; i++) {
      const parent = document.querySelector('#parent');
      const clone = parent.firstElementChild.cloneNode(true);
      parent.appendChild(clone);
    }
    //[プラグイン保存設定反映]
    for (let i = 0, length = config.settings.length; i < length; i++) {
      $('.date-field')[i].value = config.settings[i].dateField;
      $('.output-field')[i].value = config.settings[i].outputField;
    }

    currentSelect();


    //changeEvent();

  } else {
    search();
    //changeEvent();

  }

  ////////////////////////////////////////////////////////////////////////////////////////
  // 保存ボタン押下時//////////////////////////////////////////////////////////////
  $submitButton.on('click', function () {
    const value = submit();

    if (blankCheck(value)) {
      displayAlert('エラー', '選択されていないフィールドがあります。', 'error', 'OK');
      return false;
    }

    if (dupCheck(value)) {
      displayAlert('エラー', '選択されたフィールドが重複しています。', 'error', 'OK');
      return false;
    }

    if (tableCheck(value)) {
      displayAlert('エラー', '異なるテーブルに属するフィールドは指定できません。', 'error', 'OK');
      return false;
    }

    //[文字列に変換]
    value.settings = JSON.stringify(value.settings);
    kintone.plugin.app.setConfig(value);
  });
  //////////////////////////////////////////////////////////////////////////////////////////
  // キャンセルボタンクリック時イベント
  $cancelButton.on('click', function () {
    window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  });

  //[追加ボタンクリック時の処理]
  $(document).on('click', '.add-row',function (obj) {
    $('.date-field').select2('destroy');
    $('.output-field').select2('destroy');

    const parent = document.querySelector('#parent');
    const mainContents = obj.target.parentNode.parentNode;
    const clone = parent.firstElementChild.cloneNode(true);

    parent.insertBefore(clone, mainContents.nextSibling);

    currentSelect();
  });

  //[削除ボタンクリック時の処理]
  $(document).on('click', '.remove-row',function (obj) {
    const parent = document.querySelector('#parent');
    const mainContents = obj.target.parentNode.parentNode;
    if (parent.childElementCount > 1) {
      mainContents.remove();
    }
    currentSelect();
  });

  //[値変更時の処理]
  $(document).on('change', '.date-field, .output-field', function () {
    var scrollPosition = window.scrollY;
    currentSelect();
    window.scrollTo(0, scrollPosition);
  });

  /********************************************
   * [プラグイン設定保存処理関数]
   * @returns [プラグイン保存設定内容オブジェクト]
   ********************************************/
  function submit() {
    const value = {
      settings: [],
    };
    for (let i = 0, length = $('.main-contents').length; i < length; i++) {
      const item = {
        dateField: $('.date-field')[i].value ? $('.date-field')[i].value : '',
        outputField: $('.output-field')[i].value ? $('.output-field')[i].value : '',
      };
      value.settings.push(item);
    }
    return value;
  };

  function blankCheck(value) {
    for (let i = 0; i < value.settings.length; i++) {
      if (value.settings[i].dateField == '' || value.settings[i].outputField == '') {
        return true;
      }
    }
    return false;
  };

  /***********************************************************
   * [重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  function dupCheck(value) {
    const array = [];
    value.settings.forEach((item) => {
      array.push(item.dateField);
      array.push(item.outputField);
    });
    const a = new Set(array);
    return a.size !== array.length;
  };

  /***********************************************************
   * [テーブル跨ぎチェック処理関数]
   * @param {array} value [テーブル跨ぎチェックを行う配列]
   * @returns [跨いでいる場合 true　いない場合 falseを返す]
   **********************************************************/
  function tableCheck (value) {
    let flag = false;

    value.settings.forEach((item) => {
      if (getTableName(item.dateField) !== getTableName(item.outputField)) flag = true;
    });
    return flag;
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

  function currentSelect() {

    let array = [];

    $('.main-contents').each(function () {
      array.push($(this).find('.date-field').val());
      array.push($(this).find('.output-field').val());
    });

    $('.main-contents').each(function () {

      //currentSelect1
      const currentSelect1 = $(this).find('.date-field');
      const currentValue1 = currentSelect1.val();
      const newOptions1 = dateFieldList.filter(option => !array.includes(option.code) || option.code === currentValue1);

      currentSelect1.empty();
      createOption(newOptions1, currentSelect1);
      currentSelect1.val(currentValue1);

      const currentSelect2 = $(this).find('.output-field');
      const currentValue2 = currentSelect2.val();
      const newOptions2 = singleLineTextFieldList.filter(option => !array.includes(option.code) || option.code === currentValue2);

      currentSelect2.empty();
      createOption(newOptions2, currentSelect2);
      currentSelect2.val(currentValue2);

    });

    setLength();
  }

  function setLength() {
    search();

    for (let i = 0; i < $('.main-contents').length; i++) {
      const $mainContent = $('.main-contents').eq(i);
      const len1 = $mainContent.find('.date-field option:selected').text().length;
      const len2 = $mainContent.find('.output-field option:selected').text().length;

      let len = Math.max(len1, len2) * 17 + 20;
      if (len < 290) len = 290;
  
      $mainContent.find('.tip-container').find('.select2-selection--single').css('width', len + 'px');
      $mainContent.find('.tip-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $mainContent.css('width', len + 50 + 'px');
    }
  }

  /***************************************
   * [フォームに設置してある全フィールド取得]
   * @returns [フォームの左上から順番のフィールドリスト]
   **************************************/
  async function getFieldList() {
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
          ));
        }
      });

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
  }


  /************************************************
   * [指定したフィールドを抽出する関数]
   * @param {Array} フィルターをかけるフィールドリスト
   * @param {boolean} 指定したフィールドタイプを抽出 true   以外を抽出 false
   * @param {Array} 抽出するフィールドタイプリスト
   * @returns [第二引数がtrueなら指定したフィールドタイプのフィールドリスト
   * 　　　　　　　　　 falseなら指定したフィールドタイプ以外のフィールドリスト]
   ************************************************/
  function filterField(fieldList, flg, ...limitFieldType) {
    if (!limitFieldType.length) return fieldList;
    if (flg) fieldList = fieldList.filter((x) => limitFieldType.includes(x.type));
    else fieldList = fieldList.filter((x) => !limitFieldType.includes(x.type));
    return fieldList;
  }

  /***************************************
   * [ドロップダウンに検索機能追加・CSS追加]
   **************************************/
  function search() {
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
      top: '8px',
      left: '260px',
    });

    $('.select2-container--default .select2-selection--single .select2-selection__arrow b').css({
      'border-color': '#3498db transparent transparent transparent',
    });

  }

  function displayAlert(title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button
    })
  }
  /***********************************************
   * [オプション作成処理関数]
   * @param {Array} fields [フィールドリスト]
   * @param {HTMLAllCollection} name [クラス・ID名]
   ***********************************************/
  function createOption (fields, name) {
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
  }

})(jQuery, kintone.$PLUGIN_ID);
