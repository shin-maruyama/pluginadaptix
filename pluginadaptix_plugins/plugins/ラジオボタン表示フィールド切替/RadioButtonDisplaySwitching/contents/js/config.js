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
        groupNameHideCheck: $('.group-name-hide').prop('checked'),
        settings: [],
      };

      for (let i = 0; i < $('.main-contents').length; i++) {
        const $mainContent = $('.main-contents').eq(i);
        const item = {
          radioSelect: $mainContent.find('.switcher-field-select').val(),
          //fieldControlCheckbox: $mainContent.find('.field-control-checkbox').prop('checked'),
          categories: [],
        };

        for (let j = 0; j < $mainContent.find('.category').length; j++) {
          const $category = $mainContent.find('.category').eq(j);
          const item2 = {
            categoryName: $category.find('.category-name').val(),
            fields: [],
          };

          for (let k = 0; k < $category.find('.field-select').length; k++) {
            const $fieldSelect = $category.find('.field-select').eq(k);
            item2.fields.push($fieldSelect.val());
          }
          item.categories.push(item2);
        }
        value.settings.push(item);
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
        if (!(await KNTP484410certification())) {
          return;
        }
      }

      /**
       * [保存・削除ボタンクリック時の処理]
       * [切替用フィールド追加・削除ボタンクリック時の処理]
       * [フィールド追加・削除ボタンクリック時の処理]
       * [フィールドセレクトチェンジ時の処理]
       */
      obj.buttonClickEvent();
      obj.rowButtonClickEvent();
      obj.rowFieldButtonClickEvent();
      obj.fieldSelectChangeEvent();

      /**
       * @param {Array} fieldList [フォームの左上から順のフィールドリスト]
       */
      obj.fieldList = await obj.getFieldList();
      // console.log(fieldList);
      const switcherFieldList = obj.filterField(obj.fieldList, true, 'RADIO_BUTTON');
      const filterFieldList = obj.filterField(obj.fieldList, false, 'SPACER', 'LABEL', 'HR');

      //[切替用フィールドのオプションリスト]
      const switcherFieldOptionListObj = {};
      for (const field of switcherFieldList) {
        switcherFieldOptionListObj[field.code] = field.properties.options.map((x) => x.label);
      }

      obj.switcherSelectChangeEvent(switcherFieldOptionListObj);

      //[ドロップダウンにオプション追加]
      obj.createOption(switcherFieldList, $('.switcher-field-select'));

      for (const field of filterFieldList) {
        const $option = $('<option>', {
          value: field.code,
          text: field.label,
        });
        $('.field-select').append($option);
      }

      //[既にプラグイン設定が保存されている場合の処理]
      if (Object.keys(config).length) {
        //[JSON型に変換]
        config.settings = JSON.parse(config.settings);
        const switcherFieldListCodes = switcherFieldList.map((x) => x.code);

        //[保存されている切替用フィールドから、削除された切替用フィールドを除外する。]
        //config.settings = config.settings.filter((item) => switcherFieldListCodes.includes(item.switcherSelect))

        config.groupNameHideCheck = JSON.parse(config.groupNameHideCheck);
        const { settings, groupNameHideCheck } = config;

        //[保存した設定個数分クローン作成]
        //[切替用フィールド]
        for (let i = 1; i < settings.length; i++) {
          const $clone = $('.main-contents:first').clone(true);
          $('#parent').append($clone);
        }

        //[カテゴリー]
        for (let i = 0; i < settings.length; i++) {
          const options = switcherFieldOptionListObj[settings[i].radioSelect];
          if (options && options.length) {
            for (let j = 1; j < options.length; j++) {
              const $clone = $('.main-contents').eq(i).find('.category:first').clone(true);
              $('.main-contents').eq(i).find('.category:first').after($clone);
            }

            for (let j = 0; j < options.length; j++) {
              $('.main-contents').eq(i).find('.category').eq(j).find('.category-name').val(options[j]);
            }
          }
        }

        //[フィールド]
        for (let i = 0; i < settings.length; i++) {
          const options = switcherFieldOptionListObj[settings[i].radioSelect];
          let categoryLength;
          if (options && options.length) {
            categoryLength = Math.min(options.length, settings[i].categories.length);
          } else {
            categoryLength = settings[i].categories.length;
          }

          for (let j = 0; j < categoryLength; j++) {
            for (let k = 1; k < settings[i].categories[j].fields.length; k++) {
              const $clone = $('.main-contents')
                .eq(i)
                .find('.category')
                .eq(j)
                .find('.field-select-area:first')
                .clone(true);
              $('.main-contents').eq(i).find('.category').eq(j).find('.field-select-area:first').after($clone);
            }
          }
        }

        //[プラグイン保存設定反映]
        $('.group-name-hide').prop('checked', groupNameHideCheck);

        for (let i = 0; i < settings.length; i++) {
          const $mainContent = $('.main-contents').eq(i);

          $mainContent.find('.switcher-field-select').val(settings[i].radioSelect);

          const options = switcherFieldOptionListObj[settings[i].radioSelect];
          let categoryLength;
          if (options && options.length) {
            categoryLength = Math.min(options.length, settings[i].categories.length);
          } else {
            categoryLength = settings[i].categories.length;
          }

          //[カテゴリー]
          for (let j = 0; j < categoryLength; j++) {
            const $category = $mainContent.find('.category').eq(j);
            const category = settings[i].categories[j];
            //[フィールド]
            for (let k = 0; k < category.fields.length; k++) {
              $category.find('.field-select').eq(k).val(category.fields[k]);
            }
          }
        }
      }

      await obj.createNewOption();
      obj.search();
      obj.adjustDis();
      $('.category-area').sortable();
      $('#parent').sortable();
    },

    /**
     * [切替用フィールドセレクトチェンジイベント]
     * @param {Object} optionObj [切替用フィールドのオプションリストが格納されているオブジェクト]
     */
    switcherSelectChangeEvent: function (optionObj) {
      $(document).on('change', '.switcher-field-select', async function () {
        $('.field-select').select2('destroy');
        //[カテゴリーをリセット]
        for (let i = 0, len = $(this).closest('.main-contents').find('.category').length - 1; i < len; i++) {
          $(this).closest('.main-contents').find('.category').eq(0).remove();
        }
        //[カテゴリー内をリセット]
        for (let i = 0, len = $(this).closest('.main-contents').find('.field-select-area').length - 1; i < len; i++) {
          $(this).closest('.main-contents').find('.field-select-area').eq(0).remove();
        }
        //[カテゴリー名をリセット]
        $(this).closest('.main-contents').find('.category-name').val('');
        $(this).closest('.main-contents').find('.field-select').val('');

        //[空欄を選択した場合終了する]
        if (!$(this).val()) {
          obj.search();
          return;
        }

        const usedSwitcherFields = [];
        const usedShowFields = [];

        for (const elem of $('.switcher-field-select').not(this)) {
          if (!elem.value) continue;
          usedSwitcherFields.push(elem.value);
        }

        for (const elem of $(this).closest('.main-contents').find('.field-select')) {
          if (!elem.value) continue;
          usedShowFields.push(elem.value);
        }

        if (usedSwitcherFields.includes($(this).val())) {
          window.alert('このフィールドはすでに切替用に設定されています。');
          $(this).val('');
          obj.search();
          return;
        }

        if (usedShowFields.includes($(this).val())) {
          window.alert('このフィールドはすでに表示用に設定されています。');
          $(this).val('');
          obj.search();
          return;
        }

        const options = optionObj[$(this).val()];

        for (let i = 0, len = options.length - 1; i < len; i++) {
          const $clone = $(this).closest('.main-contents').find('.category:first').clone(true);
          $(this).closest('.main-contents').find('.category:first').after($clone);
        }

        for (let i = 0, len = options.length; i < len; i++) {
          $(this).closest('.main-contents').find('.category').eq(i).find('.category-name').val(options[i]);
        }
        await obj.createNewOption();
        obj.search();
        obj.adjustDis();
      });
    },

    /**
     * フィールドセレクトチェンジイベント
     */
    fieldSelectChangeEvent: function () {
      $(document).on('change', '.field-select', async function () {
        const value = $(this).val();

        const usedFields = [];
        for (const elem of $(this).closest('.category').find('.field-select').not(this)) {
          if (!elem.value) continue;
          usedFields.push(elem.value);
        }

        for (const pElem of $('.category-area').not($(this).closest('.category-area'))) {
          for (const cElem of $(pElem).find('.field-select')) {
            if (!cElem.value) continue;
            usedFields.push(cElem.value);
          }
        }
        await obj.createNewOption();
        obj.adjustDis();

        if (!usedFields.includes(value)) return;

        window.alert('このフィールドはすでに表示用に設定されています。');
        $(this).val('');
      });
    },

    adjustDis: function () {
      $('.main-contents').each(function () {
        const str = $(this).find('.switcher-field-select option:selected').text().length;
        let rLen = str * 17 + 20;
        if (rLen < 290) rLen = 290;
        $(this).find('.switcher-container').find('.select2-selection--single').css('width', rLen + 'px');
        $(this).find('.switcher-container').find('.select2-selection__arrow').css('left', rLen - 30 + 'px');
        let cMaxLen = 0;
        $(this).find('.category').each(function () {
          let maxLen = 0;
          $(this).find('.field-select').each(function () {
            const s = $(this).find('option:selected').text().length;
            if (s > maxLen) maxLen = s;
          });
          let len = maxLen * 17 + 20;
          if (len < 290) len = 290;
          $(this).find('.field-container').find('.select2-selection--single').css('width', len + 'px');
          $(this).find('.field-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
          $(this).find('.field-container').css('width', len + 5 + 'px');
          let cLen = len + 5 + 70 + 215;
          if (cLen < 580) cLen = 580;
          $(this).css('width', cLen + 'px');
          if (cLen > cMaxLen) cMaxLen = cLen;
        });
        if (rLen > cMaxLen) cMaxLen = rLen;
        let mLen = cMaxLen + 120;
        if (mLen < 700) mLen = 700;
        $(this).css('width', mLen + 'px');
      });
    },

    createNewOption: async function () {
      let array = [];
      $('.main-contents').each(function () {
        array.push($(this).find('.switcher-field-select').val());
      });
      const switcherFieldList = obj.filterField(obj.fieldList, true, 'RADIO_BUTTON');
      const filterFieldList = obj.filterField(obj.fieldList, false, 'SPACER', 'LABEL', 'HR');
      $('.main-contents').each(function () {
        const val = $(this).find('.switcher-field-select').val();
        const newOptions = switcherFieldList.filter(x => !array.includes(x.code) || x.code === val);
        $(this).find('.switcher-field-select').empty();
        obj.createOption(newOptions, $(this).find('.switcher-field-select'));
        $(this).find('.switcher-field-select').val(val);

        let allFieldSelectValues = [];
        $('.main-contents').not($(this)).each(function () {
          $(this).find('.field-select').each(function () {
            allFieldSelectValues.push($(this).val());
          });
        });

        $(this).find('.category').each(function () {
          let array2 = [];
          const val1 = $(this).closest('.main-contents').find('.switcher-field-select').val();
          array2.push(val1);
          $(this).find('.field-select').each(function () {
            array2.push($(this).val());
          });

          $(this).find('.field-select').each(function () {
            const val2 = $(this).val();
            const newOptions2 = filterFieldList.filter(x => (!array2.includes(x.code) && !allFieldSelectValues.includes(x.code)) || x.code === val2);
            $(this).empty();
            obj.createOption(newOptions2, $(this));
            $(this).val(val2);
          });
        });
      });
    },

    /*************************************
     * [切替用フィールド追加・削除ボタンクリック時の処理関数]
     ************************************/
    rowButtonClickEvent: function () {
      //[追加ボタンクリック時の処理]
      $(document).on('click', '.add-row', async function () {
        $('.switcher-field-select').select2('destroy');
        $('.field-select').select2('destroy');
        const $clone = $('.main-contents:first').clone();
        //[カテゴリーをリセット]
        for (let i = 0, len = $clone.find('.category').length - 1; i < len; i++) {
          $clone.find('.category').eq(0).remove();
        }
        //[カテゴリー内をリセット]
        for (let i = 0, len = $clone.find('.field-select-area').length - 1; i < len; i++) {
          $clone.find('.field-select-area').eq(0).remove();
        }
        //[カテゴリー名をリセット]
        $clone.find('.category-name').val('');

        $(this).closest('.main-contents').after($clone);
        await obj.createNewOption();
        obj.search();
        obj.adjustDis();
      });

      //[削除ボタンクリック時の処理]
      $(document).on('click', '.remove-row', async function () {
        if ($('.main-contents').length > 1) $(this).closest('.main-contents').remove();
        await obj.createNewOption();
        obj.search();
        obj.adjustDis();
      });
    },

    /*************************************
     * [フィールド追加・削除ボタンクリック時の処理関数]
     ************************************/
    rowFieldButtonClickEvent: function () {
      //[追加ボタンクリック時の処理]
      $(document).on('click', '.add-field-row', async function () {
        $('.field-select').select2('destroy');
        const $clone = $(this).closest('.category').find('.field-select-area:first').clone(true);
        //[クローン 値リセット]
        $(this).closest('.field-select-area').after($clone);
        await obj.createNewOption();
        obj.search();
        obj.adjustDis();
      });

      //[削除ボタンクリック時の処理]
      $(document).on('click', '.remove-field-row', async function () {
        if ($(this).closest('.category').find('.field-select-area').length > 1)
          $(this).closest('.field-select-area').remove();
        await obj.createNewOption();
        obj.search();
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
      try {
        const resp = await kintone.api('/k/v1/app/form/layout.json', 'GET', { app: kintone.app.getId() });
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
            row.layout.forEach((childRow) => childRow.fields.forEach((field) => {
              fieldList.push({
                type: field.type,
                code: field.code ? field.code : '',
                id: field.id,
                properties: field.properties,
                elementId: field.elementId ? field.elementId : field.code,
                label: field.code ? row.code + '　' + field.code : row.code + '　' + field.elementId,
              });
            }));
          }
        });

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
            if (!inTarget) return;
            inField.id = inTarget.id;
            inField.properties = inTarget.properties;
            inField.label = inField.code;
          });
        });
      } catch { }
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
      }).on('select2:open', function () {
        setTimeout(function () {
          var optionCount = $('.select2-results__option').length;
          var newTop = optionCount > 5 ? 0 : -40;

          $('.select2-search__field').css({
            height: '34px',
            width: '280px',
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
            top: newTop + 'px',
          });
          $('.select2-results__option').css({
            'min-width': '290px',
            width: 'auto !important',
            height: '30px',
            padding: '4px 0px',
            'vartical-align': 'center',
            'white-space': 'nowrap',
            overflow: 'visible',
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
            value: field.code,
            text: field.label,
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
     * [重複チェック処理関数]
     * @param {array} value [保存設定内容]
     * @returns [切替用フィールドが重複している場合 true　していない場合 falseを返す]
     **********************************************************/
    dupCheck: function (value) {
      const array = [];

      value.settings.forEach((item) => {
        array.push(item.radioSelect);
      });

      const a = new Set(array);
      return a.size !== array.length;
    },

    /***********************************************************
     * [親子チェック処理関数]
     * @param {array} value [保存設定内容]
     * @returns [子が上にある場合 true　ない場合 falseを返す]
     **********************************************************/
    oyakoCheck: function (value) {
      const array = [];
      let flag = false;

      value.settings.forEach((item) => {
        array.push(item.radioSelect);
        // 切替用フィールドがグループ内の場合、グループも禁止対象とする
        const field2 = obj.fieldList.filter(x => x.code === item.radioSelect);
        if (!field2.length) return;

        const fields = field2[0].label.split('　');
        if (fields.length == 2) array.push(fields[0]);

        item.categories.forEach((category) => {
          category.fields.forEach((field) => {
            if (array.includes(field)) flag = true;
          });
        });
      });

      return flag;
    },

    /************************************************
     * [保存・キャンセルボタンクリック時イベント処理関数]
     ***********************************************/
    buttonClickEvent: function () {
      //[保存ボタンクリック時イベント]
      obj.$submit.on('click', async function (e) {
        e.preventDefault();

        const value = obj.submit();

        //必須チェック
        let switcherSelectFlag = false;

        value.settings.forEach((item) => {
          if (!item.radioSelect) switcherSelectFlag = true;
        });

        if (switcherSelectFlag) {
          obj.displayAlert('エラー', '切替用ラジオボタンが選択されていません。', 'error', 'OK');
          return false;
        }

        if (obj.dupCheck(value)) {
          obj.displayAlert('エラー', '切替用ラジオボタンが重複しています。', 'error', 'OK');
          return false;
        }
        if (obj.oyakoCheck(value)) {
          obj.displayAlert('エラー', '入れ子の場合、外側のラジオボタンを上にしてください。', 'error', 'OK');
          return false;
        }

        //[文字列に変換]
        value.settings = JSON.stringify(value.settings);
        value.groupNameHideCheck = JSON.stringify(value.groupNameHideCheck);

        kintone.plugin.app.setConfig(value);
      });

      //[キャンセルボタンクリック時イベント]
      obj.$cancel.on('click', function () {
        window.location.href = '../../' + kintone.app.getId() + '/plugin/';
      });
    },

    checkCertificationFile: function () {
      if (typeof KNTP484410certification === 'function') {
        return true;
      } else {
        return false;
      }
    },

  };

  //[関数実行]
  obj.configShow(obj.config);
})(jQuery, kintone.$PLUGIN_ID);