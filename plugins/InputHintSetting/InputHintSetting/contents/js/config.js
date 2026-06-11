// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

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
    fieldList: [],

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
        if ($mainContent.find('.tip-setting-field').val() !== '' && $mainContent.find('.tip-setting-field').val() !== null) {
          const item = {
            tipSettingField: {
              code: $mainContent.find('.tip-setting-field').val().split(' ')[0],
              id: $mainContent.find('.tip-setting-field').val().split(' ')[1],
            },
            tipString: $mainContent.find('.tip-string').val(),
          };
          value.settings.push(item);
        } else {
          const item = {
            tipSettingField: {
              code: '',
              id: '',
            },
            tipString: $mainContent.find('.tip-string').val(),
          };
          value.settings.push(item);
        }

      }
      return value;
    },

    /**********************************************************
     * [プラグイン設定画面表示時処理関数]
     * @param {object} config [プラグイン保存設定内容オブジェクト]
     **********************************************************/
    configShow: async function (config) {

      if (!(obj.checkCertificationFile())) {
        obj.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
        return;
      } else {
        if (!(await KNTP433610certification())) {
          return;
        }
      }

      /**
       * [保存・削除ボタンクリック時の処理]
       * [追加・削除ボタンクリック時の処理]
       */
      obj.buttonClickEvent();
      obj.rowButtonClickEvent();
      obj.changeEvent();

      /**
       * @param {Array} fieldList    [フォームの左上から順のフィールドリスト]
       * @param {Array} useFieldList [使用するフィールドリスト]
       */
      obj.fieldList = await obj.getFieldList(true);
      const useFieldList = obj.filterField(
        obj.fieldList,
        false,
        'RECORD_NUMBER',
        'CREATOR',
        'CREATED_TIME',
        'MODIFIER',
        'UPDATED_TIME',
        'CALC',
        'SUBTABLE',
        'REFERENCE_TABLE',
        'LABEL',
        'SPACER',
        'HR',
        'GROUP'
      );

      //[ドロップダウンにオプション追加]
      //obj.createOption(useFieldList, $('.tip-setting-field'));

      //[既にプラグイン設定が保存されている場合の処理]
      if (Object.keys(config).length) {
        //[JSON型に変換]
        config.settings = JSON.parse(config.settings);
        const { settings } = config;
        // console.log(settings);

        //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
        for (let i = 1; i < settings.length; i++) {
          const $clone = $('.main-contents:first').clone(true);
          $('#parent').append($clone);
        }

        let array = [];

        for (let i = 0; i < settings.length; i++) {
          array.push(settings[i].tipSettingField.code);
        }

        //[プラグイン保存設定反映]
        for (let i = 0; i < settings.length; i++) {
          const $mainContent = $('.main-contents').eq(i);
          const setting = settings[i];
          const newOptions = useFieldList.filter(option => !array.includes(option.code) || option.code === setting.tipSettingField.code);
          obj.createOption(newOptions, $mainContent.find('.tip-setting-field'));
          $mainContent.find('.tip-setting-field').val(`${setting.tipSettingField.code} ${setting.tipSettingField.id}`);
          $mainContent.find('.tip-string').val(setting.tipString);
        }

        obj.setLength();
      } else {

        obj.createOption(useFieldList, $('.tip-setting-field'));
        obj.search();
      }
      $('#parent').sortable();
    },

    changeEvent: function () {
      $(document).on('change', '.tip-setting-field', async function () {

        obj.createNewOption();

        obj.setLength();

      });
    },

    setLength: function () {
      obj.search();

      for (let i = 0; i < $('.main-contents').length; i++) {
        const $mainContent = $('.main-contents').eq(i);
        const str = $mainContent.find('.tip-setting-field option:selected').text().length;

        let len = str * 17 + 20;
        if (len < 290) len = 290;

        $mainContent.find('.tip-container').find('.select2-selection--single').css('width', len + 'px');
        $mainContent.find('.tip-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
        $mainContent.css('width', len + 50 + 'px');
      }
    },

    /*************************************
     * [設定追加・削除ボタンクリック時の処理関数]
     ************************************/
    rowButtonClickEvent: function () {
      //[追加ボタンクリック時の処理]
      $(document).on('click', '.add-row', async function () {
        $('.tip-setting-field').select2('destroy');

        const $clone = $('.main-contents:first').clone(true);
        //[クローン 値リセット]
        $clone.find('.tip-string').val('');



        $(this).closest('.main-contents').after($clone);

        await obj.createNewOption();
        obj.setLength();

      });

      //[削除ボタンクリック時の処理]
      $(document).on('click', '.remove-row', async function () {
        if ($('.main-contents').length > 1) $(this).closest('.main-contents').remove();
        await obj.createNewOption();
        obj.setLength();
      });
    },


    createNewOption: async function () {
      let array = [];

      const useFieldList = obj.filterField(
        obj.fieldList,
        false,
        'RECORD_NUMBER',
        'CREATOR',
        'CREATED_TIME',
        'MODIFIER',
        'UPDATED_TIME',
        'CALC',
        'SUBTABLE',
        'REFERENCE_TABLE',
        'LABEL',
        'SPACER',
        'HR',
        'GROUP'
      );

      $('.main-contents').each(function () {
        if ($(this).find('.tip-setting-field').val() && $(this).find('.tip-setting-field').val() !== '') {
          array.push($(this).find('.tip-setting-field').val().split(' ')[0]);
        }
      });

      $('.main-contents').each(function () {
        const currentSelect = $(this).find('.tip-setting-field');
        const currentValue = currentSelect.val();
        let newOptions = [];
        if (currentValue && currentValue !== '') {
          newOptions = useFieldList.filter(option => !array.includes(option.code) || option.code === currentValue.split(' ')[0]);
        } else {
          newOptions = useFieldList.filter(option => !array.includes(option.code) || option.code === currentValue);
        }

        currentSelect.empty();

        obj.createOption(newOptions, currentSelect);
        currentSelect.val(currentValue);
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
        const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
          app: kintone.app.getId(),
        });
        resp.layout.forEach((row) => {
          if (row.type === 'ROW') row.fields.forEach((field) => {
            const target = fieldList2.find((x) => x.var === field.code);
            if (target) field.id = target.id;
            fieldList.push(field)
        });
          else if (row.type === 'SUBTABLE') {
            fieldList.push(row);
            if (!subTable) return;
            row.fields.forEach((field) => {
              const fieldInfo = {
                type: field.type,
                code: `${row.code}　${field.code}`,
                id: `${fieldList2.find((x) => x.var === row.code).id}　${Object.values(fieldList2.find((x) => x.var === row.code).fieldList).find((y) => y.var === field.code).id
                  }`,
              };
              fieldList.push(fieldInfo);
            });
          } else if (row.type === 'GROUP') {
            fieldList.push(row);
            row.layout.forEach((childRow) => childRow.fields.forEach((field) => {
              const target = fieldList2.find((x) => x.var === field.code);
              if (target) field.id = target.id;
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

      } catch (ignore) {

      }
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
        value: '',
        text: '',
      });
      name.append($noneOption);

      fields.forEach((field) => {
        if (field.type !== 'SPACER') {
          const $option = $('<option>', {
            value: `${field.code} ${field.id}`,
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
        text: text,
        icon: type,
        confirmButtonText: button,
      });
    },

    /***********************************************************
     * [重複チェック処理関数]
     * @param {array} value [保存設定内容]
     * @returns [重複している場合 true　していない場合 falseを返す]
     **********************************************************/
    dupCheck: function (value) {
      const array = [];

      value.settings.forEach((item) => {
        array.push(item.tipSettingField.code);
      });
      const a = new Set(array);
      return a.size !== array.length;
    },

    /***********************************************************
     * [空文字チェック処理関数]
     * @param {array} value [保存設定内容]
     * @returns [空文字のヒントがある場合 true　ない場合 falseを返す]
     **********************************************************/
    emptyCheck: function (value) {
      let flg = false;

      value.settings.forEach((item) => {
        if (item.tipSettingField.code === '') {
          flg = true;
        }
        if (item.tipString === '') {
          flg = true;
        }
      });
      return flg;
    },

    /************************************************
     * [保存・キャンセルボタンクリック時イベント処理関数]
     ***********************************************/
    buttonClickEvent: function () {
      //[保存ボタンクリック時イベント]
      obj.$submit.on('click', function (e) {
        e.preventDefault();

        const value = obj.submit();
        if (obj.emptyCheck(value)) {
          obj.displayAlert('エラー', 'フィールドが選択されていないか、ヒント文字列が空です。', 'error', 'OK');
          return false;
        }
        if (obj.dupCheck(value)) {
          obj.displayAlert('エラー', '選択されたフィールドが重複しています。', 'error', 'OK');
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

    checkCertificationFile: function () {
      if (typeof KNTP433610certification === 'function') {
        return true;
      } else {
        return false;
      }
    },
  };

  //[関数実行]
  obj.configShow(obj.config);
})(jQuery, kintone.$PLUGIN_ID);
