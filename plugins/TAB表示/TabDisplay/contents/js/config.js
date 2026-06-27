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

  obj.checkCertificationFile = function () {
    if (typeof KNTP930310certification === 'function') {
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
      settings: [],
      buttonHideChecked: $('.common-setting').find('#button-hide').prop('checked'),
      fieldNameHideChecked: $('.common-setting').find('#fieldname-hide').prop('checked'),
      spaceFieldId: $('.common-setting').find('.space-field-id').val() ? $('.common-setting').find('.space-field-id').val() : 'none',
      titleColor: $('.common-setting').find('.title-color').val() ? $('.common-setting').find('.title-color').val() : 'none',
      tabWidth: $('.common-setting').find('.tab-width').val(),
    };

    for (let i = 0, length = $('.main-contents').length; i < length; i++) {
      const mainContents = $('.main-contents').eq(i);

      const item = {
        tabName: mainContents.find('.tab-name').val(),
        fields: []
      };

      for (let i = 0, len = mainContents.find('.field-select-contents').children('.field-select-area').length; i < len; i++) {
        const field = mainContents.find('.field-select-contents').children('.field-select-area').eq(i) ? mainContents.find('.field-select-contents').children('.field-select-area').eq(i) : 'none';
        item.fields.push({
          code: field.find('.field').val(),
          type: field.find('.field option:selected').attr('type'),
          id: field.find('.field option:selected').attr('fieldId')
        });
      }
      value.settings.push(item);
    }

    return value;
  }


  /**********************************************************
   * [プラグイン設定画面表示時処理関数]
   * @param {object} config [プラグイン保存設定内容オブジェクト]
   **********************************************************/
  obj.config = async function (config) {
    const that = this;

    if (!(that.checkCertificationFile())) {
      that.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
      return;
    } else {
      if (!(await KNTP930310certification())) {
        return;
      }
    }

    /**
     * [保存・削除ボタンクリック時の処理]　
     * [行追加・削除ボタンクリック時の処理]　
     * [フィールド追加・削除ボタンクリック時の処理]
     */
    that.buttonClickEvent();
    that.rowButtonClickEvent();
    that.fieldButtonClickEvent();
    that.changeEvent();
    that.numberFieldValueCheck();

    /**
     * @param {Array} fieldList [フォームの左上から順のフィールドリスト]
     * @param {Array} gtFieldList [グループ・テーブルフィールドリスト]
     * @param {Array} spaceFieldList [スペースフィールドリスト]
     */
    that.fieldList = await this.getFieldList();

    const gtFieldList = that.filterField(that.fieldList, false, 'SPACER', 'HR', 'LABEL');
    const spaceFieldList = that.filterField(that.fieldList, true, 'SPACER');

    //[ドロップダウンにオプション追加]
    that.createOption(spaceFieldList, $('.space-field-id'));

    // for (const field of gtFieldList) {
    //   const $option = $('<option>', {
    //     text: field.label,
    //     value: field.code,
    //     type: field.type,
    //     fieldId: field.id
    //   });
    //   $('.field').append($option);
    // }

    $('#title-color').on('change', function () {
      $('#demo-color').css({
        'background-color': $(this).val() != "none" ? $(this).val() : "#ffffff"
      })
    })

    $('#parent').sortable();

    //[既にプラグイン設定が保存されている場合の処理]
    if (Object.keys(config).length) {
      //[JSON型に変換]
      config.settings = JSON.parse(config.settings);
      config.buttonHideChecked = JSON.parse(config.buttonHideChecked);
      config.fieldNameHideChecked = JSON.parse(config.fieldNameHideChecked);
      const { settings } = config;

      //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
      for (let i = 1, len = settings.length; i < len; i++) {
        const clone = $('.main-contents:first').clone(true);
        $('#parent').append(clone);
      }

      for (let i = 0, len = $('.main-contents').length; i < len; i++) {
        for (let j = 1, len = settings[i].fields.length; j < len; j++) {
          const fieldClone = $('.field-select-area:first').clone(true);
          $('.main-contents').eq(i).find('.field-select-contents').append(fieldClone);
        }
      }

      //[プラグイン保存設定反映]

      //[チェックボックスのチェック反映]
      $('.common-setting').find('#button-hide').prop('checked', config.buttonHideChecked);
      $('.common-setting').find('#fieldname-hide').prop('checked', config.fieldNameHideChecked);
      $('.common-setting').find('.space-field-id').val(config.spaceFieldId);
      $('.common-setting').find('.title-color').val(config.titleColor);
      $('.common-setting').find('.tab-width').val(config.tabWidth);


      for (let i = 0, len = settings.length; i < len; i++) {
        const content = $('.main-contents').eq(i);
        const setting = settings[i];

        content.find('.tab-name').val(setting.tabName);

        //console.log(setting.fields);
        let array = [];
        setting.fields.forEach(field => {
          array.push(field.code);
        })
        for (let j = 0, len = content.find('.field').length; j < len; j++) {
          const list = gtFieldList.filter(option => !array.includes(option.code) || option.code === setting.fields[j].code);
          const field = content.find('.field').eq(j);
          //console.log(list);
          that.createOption(list, field);
          field.val(setting.fields[j].code);
        }
      }

      $('#demo-color').css({
        'background-color': $('#title-color').val()
      })

      that.adjustDis();

    } else {

      $('#demo-color').css({
        'background-color': $('#title-color').val()
      })
      that.createOption(gtFieldList, $('.field'));
      that.search();
    }


  }

  obj.changeEvent = function () {
    $(document).on('change', '.space-field-id', function () {
      obj.adjustDis();
    });

    $(document).on('change', '.field', async function () {
      var scrollPosition = window.scrollY;
      const mainContents = $(this).closest('.main-contents');
      await obj.createNewOption();
      obj.adjustDis();
      window.scrollTo(0, scrollPosition);
    });
  };

  obj.adjustDis = function () {
    obj.search();
    let sLen = $('.common-setting').find('.space-field-id option:selected').text().length;
    sLen = sLen * 17 + 20;
    if (sLen < 290) sLen = 290;
    $('.common-setting').find('.space-container').find('.select2-selection--single').css('width', sLen + 'px');
    $('.common-setting').find('.space-container').find('.select2-selection__arrow').css('left', sLen - 30 + 'px');
    $('.common-setting').css('width', sLen + 50 + 'px');

    $('.main-contents').each(function () {
      let maxLen = 0;
      $(this).find('.field-select-area').each(function () {
        const str = $(this).find('.field option:selected').text().length;
        if (str > maxLen) maxLen = str;
      });
      let len = maxLen * 17 + 20;
      if (len < 290) len = 290;
      $(this).find('.field-container').find('.select2-selection--single').css('width', len + 'px');
      $(this).find('.field-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $(this).find('.field-container').css('width', len + 5 + 'px');
      $(this).css('width', len + 90 + 'px');
    });

  };

  // obj.createOption = function (gtFieldList, name) {
  //   const $option = $('<option>', {
  //     text: 'none',
  //     value: 'none',
  //     type: '',
  //     fieldId: ''
  //   });
  //   name.append($option);
  //   for (const field of gtFieldList) {
  //     const $option = $('<option>', {
  //       text: field.label,
  //       value: field.code,
  //       type: field.type,
  //       fieldId: field.id
  //     });
  //     name.append($option);
  //   }
  // };
  obj.createNewOption = async function () {

    const gtFieldList = obj.filterField(obj.fieldList, false, 'SPACER', 'HR', 'LABEL');

    $('.main-contents').each(function () {
      let array = [];

      $(this).find('.field').each(function () {
        array.push($(this).val());
      });
      $(this).find('.field').each(function () {
        const value = $(this).val();
        const newOptions = gtFieldList.filter(option => !array.includes(option.code) || option.code === value);
        $(this).empty();
        obj.createOption(newOptions, $(this));
        $(this).val(value);
      });

    })

  };

  /*************************************
   * [行追加・削除ボタンクリック時の処理関数]
   ************************************/
  obj.rowButtonClickEvent = function () {
    //[追加ボタンクリック時の処理]
    $(document).on('click', '.add-row', async function () {
      $('.field').select2('destroy');
      const clone = $('.main-contents:first').clone(true);

      //[選択フィールドリセット]
      for (let i = 1, len = clone.find('.field-select-contents').children('.field-select-area').length; i < len; i++) {
        clone.find('.field-select-contents').children('.field-select-area').eq(0).remove();
      }
      //[TABボタン名リセット]
      clone.find('.tab-name').val('');

      $(this).closest('.main-contents').after(clone);
      await obj.createNewOption();
      obj.adjustDis();
    });

    //[削除ボタンクリック時の処理]
    $(document).on('click', '.remove-row', async function () {
      if ($('.main-contents').length > 1) $(this).closest('.main-contents').remove();
      await obj.createNewOption();
      obj.adjustDis();
    });
  }


  /**********************************************
   * [フィールド追加・削除ボタンクリック時の処理関数]
   *********************************************/
  obj.fieldButtonClickEvent = function () {
    //[追加ボタンクリック時の処理]
    $(document).on('click', '.add-field', async function () {
      $('.field').select2('destroy');
      const clone = $('.field-select-area:first').clone(true);
      //clone.addClass('row-margin');
      const mainContents = $(this).closest('.main-contents');
      //[クローン 値リセット]
      $(this).closest('.field-select-area').after(clone);
      await obj.createNewOption();
      obj.adjustDis();
    });

    //[削除ボタンクリック時の処理]
    $(document).on('click', '.remove-field', async function () {
      const mainContents = $(this).closest('.main-contents');

      if ($(this).closest('.field-select-contents').children('.field-select-area').length > 1) {
        $(this).closest('.field-select-area').remove();
      }

      await obj.createNewOption();
      obj.adjustDis();
    });
  }


  /*************************************************
   * フォームのフィールドリストを取得する
   * @returns [フォームの左上から順番にフィールド取得]
   ************************************************/
  obj.getFieldList = async function () {
    const fieldList = [];
    try {
      const resp = await callKintoneApi('/k/v1/app/form/layout.json', 'GET', { app: kintone.app.getId() });
      resp.layout.forEach(row => {
        if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push({
          type: field.type,
          code: field.code ? field.code : '',
          id: field.id,
          properties: field.properties,
          elementId: field.elementId ? field.elementId : field.code,
          label: field.code ? field.code : field.elementId,
        }));
        else if (row.type === 'SUBTABLE') fieldList.push(row);
        else if (row.type === 'GROUP') {
          fieldList.push({
            type: row.type,
            code: row.code,
            id: row.id,
            properties: row.properties,
            elementId: '',
            label: row.code,
          });
          //row.layout.forEach(childRow => childRow.fields.forEach(field => fieldList.push(field)));
          row.layout.forEach((childRow) => childRow.fields.forEach((field) => {
            fieldList.push({
              type: field.type,
              code: field.code ? field.code : '',
              id: field.id,
              properties: field.properties,
              elementId: field.elementId ? field.elementId : field.code,
              label: field.code ? row.code + '　' + field.code : row.code + '　' + field.elementId,
            })
          }
            //fieldList.push(field)
          ));
        };
      })

      let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
      fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];

      fieldList.forEach(field => {
        const target = fieldList2.find(x => x.var === field.code);
        if (!target) return;
        field.id = target.id;
        field.properties = target.properties;


        if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
        field.label = field.code;
        field.fields.forEach(inField => {
          const inTarget = Object.values(target.fieldList).find(x => x.var === inField.code);
          inField.id = inTarget.id;
          inField.properties = inTarget.properties;
          inField.label = inField.code;
        })
      })
    } catch { }
    return fieldList;
  }


  /************************************************
   * [指定したフィールドを抽出する関数]
   * @param {Array} フィルターをかけるフィールドリスト
   * @param {boolean} 指定したフィールドタイプを抽出 true   以外を抽出 false
   * @param {Array} 抽出するフィールドタイプリスト
   * @returns [第二引数がtrueなら指定したフィールドタイプのフィールドリスト 
   * 　　　　　　　　　　 falseなら指定したフィールドタイプ以外のフィールドリスト] 
   ************************************************/
  obj.filterField = function (fieldList, flg, ...limitFieldType) {
    if (!limitFieldType.length) return fieldList;
    if (flg) fieldList = fieldList.filter(x => limitFieldType.includes(x.type));
    else fieldList = fieldList.filter(x => !limitFieldType.includes(x.type));
    return fieldList;
  }


  /***********************************************
   * [オプション作成処理関数]
   * @param {Array} fields [フィールドリスト]
   * @param {HTMLAllCollection} name [クラス・ID名]
   ***********************************************/
  obj.createOption = function (fields, name) {
    const option = $('<option>', {
      text: '',
      value: 'none',
      type: '',
      fieldId: ''
    });
    name.append(option);
    fields.forEach(field => {
      if (field.type !== 'SPACER') {
        const option = $('<option>', {
          text: field.label,
          value: field.code,
          type: field.type,
          fieldId: field.id
        });
        name.append(option);
      } else {
        const option = $('<option>', {
          value: field.elementId,
          text: field.label
        });
        name.append(option);
      }
    });
  }


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

        if(opnederDropdownId == "title-color"){
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
      //'margin-top': '-3px',
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

   /******************************************
   * [バリデーションチェック]
   * 使用例 ： 無効な数値は、初期値に戻す。that.displayAlert('エラー','１以上の整数を入力してください。','error','OK');
   *****************************************/

   obj.numberFieldValueCheck = function (){
    const that = this;
    $(document).on('blur', '#tab-width', function() {
      const reg = /^[1-9][0-9]*$/;
      if($(this).val() && !reg.test($(this).val())){$(this).val("1000");that.displayAlert('エラー', '１以上の整数を入力してください。', 'error', 'OK');}
    })
  }

  /***********************************************************
   * [重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  obj.dupCheck = function (value) {
    let hasDuplicate = false;
    value.settings.forEach((items) => {
      const array = [];
      items.fields.forEach((item) => {
        if (item.code !== 'none') array.push(item.code);
      });

      const a = new Set(array);
      if (a.size !== array.length) {
        hasDuplicate = true;
      }
    });

    return hasDuplicate;
  };

  /***********************************************************
   * [必須項目処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns []
   **********************************************************/
  obj.blankCheck = function (value) {
    if (value.spaceFieldId === 'none') {
      return true;
    } else {
      return false;
    }
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
      let errMesseage = "";

      if (value.spaceFieldId === 'none') {errMesseage = errMesseage + "TABタイトル表示スペースが未設定です。<br>"}
      if (value.titleColor === 'none') {errMesseage = errMesseage + "TABタイトル配色が未設定です。<br>"}
      if (!value.tabWidth) {errMesseage = errMesseage + "TAB表示幅が未設定です。<br>"}
      
      value.settings.forEach((x,i) => {
      if(!x.tabName){errMesseage = errMesseage + (i + 1) +"番目のTABタイトルが未設定です。<br>"}
      x.fields.forEach((y,j) => {
          if(y.code == "none"){errMesseage = errMesseage + (i + 1) +"番目の" + (j + 1) + "つ目のフィールド選択が未設定です。<br>"}
        })
      })

      if(errMesseage != ""){
        that.displayAlert('エラー', errMesseage, 'error', 'OK');
        return false;
      }

      if (that.dupCheck(value)) {
        that.displayAlert('エラー', '選択されたフィールドが重複しています。', 'error', 'OK');
        return false;
      }
      //[文字列に変換]
      value.settings = JSON.stringify(value.settings);
      value.buttonHideChecked = JSON.stringify(value.buttonHideChecked);
      value.fieldNameHideChecked = JSON.stringify(value.fieldNameHideChecked);

      kintone.plugin.app.setConfig(value);
    });

    //[キャンセルボタンクリック時イベント]
    $cancelButton.on('click', function () {
      window.location.href = '../../' + kintone.app.getId() + '/plugin/';
    });
  }

  //[関数実行]
  obj.config(config);

})(jQuery, kintone.$PLUGIN_ID);
