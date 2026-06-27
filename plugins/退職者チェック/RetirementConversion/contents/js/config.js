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


  //[処理用オブジェクト]
  const obj = {
    /**
     * @param $submit [保存ボタン要素]
     * @param $cancel [キャンセルボタン要素]
     * @param config  [プラグイン設定内容オブジェクト]
     */
    $submit: $('#submit'),
    $cancel: $('#cancel'),
    config: kintone.plugin.app.getConfig(PLUGIN_ID),
    resp: null,

    /********************************************
     * [プラグイン設定保存処理関数]
     * @returns [プラグイン保存設定内容オブジェクト]
     ********************************************/
    submit: function () {
      const value = {
        settings: [],
      };

      for (let i = 0; i < $('.main-contents').length; i++) {
        const $mainContent = $('.main-contents').eq(i);

        const item = {
          staffSelect: $mainContent.find('.staff-select').val() ? $mainContent.find('.staff-select').val() : 'none',
          userSelect: $mainContent.find('.user-select').val() ? $mainContent.find('.user-select').val() : 'none',
        };
        value.settings.push(item);
      }
      return value;
    },

    /**********************************************************
     * [プラグイン設定画面表示時処理関数]
     * @param {object} config [プラグイン保存設定内容オブジェクト]
     **********************************************************/
    configShow: async function (config) {

      if (typeof KNTP276110certification === 'function') {
        if (!(await KNTP276110certification())) {
          return;
        }
      } else {
        obj.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
        return;
      }

      /**
       * [保存・削除ボタンクリック時の処理]
       * [追加・削除ボタンクリック時の処理]
       */
      obj.buttonClickEvent();
      obj.rowButtonClickEvent();
      obj.changeEvent();

      /**
       * @param {Array} fieldList [フォームの左上から順のフィールドリスト]
       */
      const fieldList = await obj.getFieldList(true);
      const sourceFieldList = obj.filterField(fieldList, true, 'CREATOR', 'MODIFIER');
      const destinationFieldList = obj.filterField(fieldList, true, 'USER_SELECT');

      //[ドロップダウンにオプション追加]
      obj.createOption(sourceFieldList, $('.staff-select'));
      //obj.createOption(destinationFieldList, $('.user-select'));

      //[既にプラグイン設定が保存されている場合の処理]
      if (Object.keys(config).length) {
        //[JSON型に変換]
        config.settings = JSON.parse(config.settings);
        const { settings } = config;

        //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
        for (let i = 1; i < settings.length; i++) {
          const $clone = $('.main-contents:first').clone(true);
          $('#parent').append($clone);
        }

        let array = [];
        settings.forEach(setting => {
          array.push(setting.userSelect);
        });

        //[プラグイン保存設定反映]
        for (let i = 0; i < settings.length; i++) {
          const $mainContent = $('.main-contents').eq(i);
          $mainContent.find('.staff-select').val(settings[i].staffSelect);
          const newOption = destinationFieldList.filter(option => !array.includes(option.code) || option.code === settings[i].userSelect);
          obj.createOption(newOption, $mainContent.find('.user-select'));
          $mainContent.find('.user-select').val(settings[i].userSelect);
        }

        obj.search();
        for (let i = 0; i < settings.length; i++) {
          let maxLen = 0;
          const $mainContent = $('.main-contents').eq(i);
          const str1 = settings[i].staffSelect.length;
          const str2 = settings[i].userSelect.length;
          if (str1 > str2) {
            maxLen = str1;
          } else {
            maxLen = str2;
          }
          maxLen = maxLen * 17 + 20;
          if (maxLen < 290) maxLen = 290;
          $mainContent.find('.container').find('.select2-selection--single').css('width', maxLen + 'px');
          $mainContent.find('.container').find('.select2-selection__arrow').css('left', maxLen - 30 + 'px');
          $mainContent.css('width', maxLen + 50 + 'px');
        }

      } else {
        obj.createOption(destinationFieldList, $('.user-select'));
        obj.search();
      }

      $('#parent').sortable();
    },

    changeEvent: function () {
      $(document).on('change', '.staff-select', function () {
        var scrollPosition = window.scrollY;
        obj.adjustDis();
        window.scrollTo(0, scrollPosition);
      });

      $(document).on('change', '.user-select', async function () {
        var scrollPosition = window.scrollY;
        await obj.createNewOption();
        obj.adjustDis();
        window.scrollTo(0, scrollPosition);
      });
    },

    adjustDis: function () {
      obj.search();
      $('.main-contents').each(function () {
        let maxLen = 0;
        const str1 = $(this).find('.staff-select option:selected').text().length;
        const str2 = $(this).find('.user-select option:selected').text().length;
        if (str1 > str2) {
          maxLen = str1;
        } else {
          maxLen = str2;
        }
        maxLen = maxLen * 17 + 20;
        if (maxLen < 290) maxLen = 290;
        $(this).find('.container').find('.select2-selection--single').css('width', maxLen + 'px');
        $(this).find('.container').find('.select2-selection__arrow').css('left', maxLen - 30 + 'px');
        $(this).css('width', maxLen + 50 + 'px');
      });
    },

    createNewOption: async function () {
      let array = [];
      $('.main-contents').each(function () {
        array.push($(this).find('.user-select').val());
      });
      const fieldList = await obj.getFieldList(true);
      const userList = obj.filterField(fieldList, true, 'USER_SELECT');
      $('.main-contents').each(function () {
        const name = $(this).find('.user-select');
        const value = name.val();
        name.empty();
        const newOption = userList.filter(option => !array.includes(option.code) || option.code === value);
        obj.createOption(newOption, name);
        name.val(value);
      });
    },

    /*************************************
     * [設定追加・削除ボタンクリック時の処理関数]
     ************************************/
    rowButtonClickEvent: function () {
      //[追加ボタンクリック時の処理]
      $(document).on('click', '.add-row', async function () {
        $('.staff-select').select2('destroy');
        $('.user-select').select2('destroy');

        const $clone = $('.main-contents:first').clone(true);

        $(this).closest('.main-contents').after($clone);

        await obj.createNewOption();
        //obj.search();
        obj.adjustDis();
      });

      //[削除ボタンクリック時の処理]
      $(document).on('click', '.remove-row', async function () {
        if ($('.main-contents').length > 1) $(this).closest('.main-contents').remove();
        await obj.createNewOption();
        //obj.search();
        obj.adjustDis();
      });
    },

    /*************************************************
     * [自アプリフォームのフィールドリストを取得する]
     * @param {boolean} subTable [サブテーブル内も取得する場合true しない場合false]
     * @returns [自アプリフォームの左上から順番にフィールド取得]
     ************************************************/
    getFieldList: async function (subTable = false) {
      const fieldList = [];
      const fieldList2 = [
        ...Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList),
        ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
      ];

      try {
        let resp;
        if(obj.resp){
          resp = obj.resp;
        } else {
          resp = await callKintoneApi(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
            app: kintone.app.getId(),
          });
          obj.resp = resp;
        }

        resp.layout.forEach((row) => {
          if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push(field));
          else if (row.type === 'SUBTABLE') {
            fieldList.push(row);
            if (!subTable) return;
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
      } catch {

      }

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
    },

    /************************************************
     * [指定したフィールドを抽出する関数]
     * @param {Array}   fieldList      [フィルターをかけるフィールドリスト]
     * @param {boolean} flg            [指定したフィールドタイプを抽出 true   以外を抽出 false]
     * @param {Array}   limitFieldType [抽出するフィールドタイプリスト]
     * @returns [第二引数がtrueなら指定したフィールドタイプのフィールドリスト
     *                    falseなら指定したフィールドタイプ以外のフィールドリスト]
     ************************************************/
    filterField: function (fieldList, flg, ...limitFieldType) {
      if (!limitFieldType.length) return fieldList;
      if (flg) return fieldList.filter((x) => limitFieldType.includes(x.type));
      else return fieldList.filter((x) => !limitFieldType.includes(x.type));
    },

    /***************************************
     * [ドロップダウンに検索機能追加・CSS追加]
     **************************************/
    search: function () {
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
      
    },

    /***********************************************
     * [オプション作成処理関数]
     * @param {Array}  fields [フィールドリスト]
     * @param {jQuery} name   [クラス・ID名]
     ***********************************************/
    createOption: function (fields, name) {
      const $noneOption = $('<option>', {
        value: 'none',
        text: '',
      });
      name.append($noneOption);

      fields.forEach((field) => {
        if (field.type !== 'SPACER') {
          const $option = $('<option>', {
            value: field.code,
            text: field.code,
          });
          name.append($option);
        } else {
          const $option = $('<option>', {
            value: field.elementId,
            text: field.elementId,
          });
          name.append($option);
        }
      });
    },

    /******************************************
     * [アラートの表示処理関数]
     * @param {string} title  [タイトル]
     * @param {string} text   [説明文]
     * @param {string} type   [アラートタイプ]
     * @param {string} button [ボタン名表示文字]
     * 使用例 ： obj.displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');
     *****************************************/
    displayAlert: function (title, text, type, button) {
      swal.fire({
        title: title,
        html: text,
        icon: type,
        confirmButtonText: button,
      });
    },

    /***********************************************************
     * [未入力チェック処理関数]
     * @param {array} value [保存設定内容]
     * @returns [未入力がある場合 true　ない場合 falseを返す]
     **********************************************************/
    blankCheck: function (value) {
      for(const item of value.settings) {
        if (item.staffSelect === 'none' || item.userSelect === 'none') return true;
      }
      return false;
    },

    /***********************************************************
     * [重複チェック処理関数]
     * @param {array} value [保存設定内容]
     * @returns [重複している場合 true　していない場合 falseを返す]
     **********************************************************/
    dupCheck: function (value) {
      const array = [];

      value.settings.forEach((item) => {
        array.push(item.userSelect);
      });
      const a = new Set(array);
      return a.size !== array.length;
    },

    /************************************************
     * [保存・キャンセルボタンクリック時イベント処理関数]
     ***********************************************/
    buttonClickEvent: function () {
      //[保存ボタンクリック時イベント]
      obj.$submit.on('click', function (e) {
        e.preventDefault();

        const value = obj.submit();
        if (obj.blankCheck(value)) {
          obj.displayAlert('エラー', '選択されていないフィールドがあります。', 'error', 'OK');
          return false;
        }
        if (obj.dupCheck(value)) {
          obj.displayAlert('エラー', '選択された反映先フィールドが重複しています。', 'error', 'OK');
          return false;
        }
        //[文字列に変換]
        value.settings = JSON.stringify(value.settings);

        kintone.plugin.app.setConfig(value);
      });

      //[キャンセルボタンクリック時イベント]
      obj.$cancel.on('click', function () {
        window.location.href = '../../' + kintone.app.getId() + '/plugin/';
      });
    },
  };

  //[関数実行]
  obj.configShow(obj.config);
})(jQuery, kintone.$PLUGIN_ID);
