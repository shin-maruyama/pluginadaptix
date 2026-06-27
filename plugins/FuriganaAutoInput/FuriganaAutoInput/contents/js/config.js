// Copyright (C) All in one Allright Reserved. 


jQuery.noConflict();

(function ($, PLUGIN_ID) {
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
        settings: []
      };

      for (let i = 0; i < $('.main-contents').length; i++) {
        const $mainContent = $('.main-contents').eq(i);
        if ($mainContent.find('.source-select').val() === 'none' || $mainContent.find('.source-select').val() === null || $mainContent.find('.destination-select').val() === 'none' || $mainContent.find('.destination-select').val() === null) {
          obj.displayAlert('エラー', '変換元または変換先が未入力です。', 'error', 'OK');
          return false;
        }
        const item = {
          sourceField: {
            code: $mainContent.find('.source-select').val().split(' ')[0],
            id: $mainContent.find('.source-select').val().split(' ')[1]
          },
          destinationField: {
            code: $mainContent.find('.destination-select').val().split(' ')[0],
            id: $mainContent.find('.destination-select').val().split(' ')[1]
          },
          format: $mainContent.find('.format-select').val(),

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
        if (!(await KNTP421310certification())) {
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
       * @param {Array} fieldList   [フォームの左上から順のフィールドリスト]
       * @param {Array} singleLineTextFieldList [文字列1行フィールドリスト]
       */
      const fieldList = await obj.getFieldList(true);
      const singleLineTextFieldList = obj.filterField(fieldList, true, 'SINGLE_LINE_TEXT');

      //[ドロップダウンにオプション追加]
      obj.createOption(singleLineTextFieldList, $('.source-select'));
      obj.createOption(singleLineTextFieldList, $('.destination-select'));

      //[既にプラグイン設定が保存されている場合の処理]
      if (Object.keys(config).length) {
        //[JSON型に変換]
        config.settings = JSON.parse(config.settings);
        const { settings } = config;
        //console.log(settings);

        //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
        for (let i = 1; i < settings.length; i++) {
          const $clone = $('.main-contents:first').clone(true);
          $('#parent').append($clone);
        }

        //[プラグイン保存設定反映]
        for (let i = 0; i < settings.length; i++) {
          const setting = settings[i];
          const $mainContent = $('.main-contents').eq(i);
          $mainContent.find('.source-select').val(`${setting.sourceField.code} ${setting.sourceField.id}`);
          $mainContent.find('.destination-select').val(`${setting.destinationField.code} ${setting.destinationField.id}`);
          $mainContent.find('.format-select').val(setting.format);
        }

      }

      await obj.currentSelect();
      $('#parent').sortable();
    },


    /*************************************
     * [設定追加・削除ボタンクリック時の処理関数]
     ************************************/
    rowButtonClickEvent: function () {
      //[追加ボタンクリック時の処理]
      $(document).on('click', '.add-row', async function () {
        $('.source-select').select2('destroy');
        $('.destination-select').select2('destroy');
        $('.format-select').select2('destroy');

        const $clone = $('.main-contents:first').clone(true);
        $(this).closest('.main-contents').after($clone);
        await obj.currentSelect();
      });

      //[削除ボタンクリック時の処理]
      $(document).on('click', '.remove-row', async function () {
        if ($('.main-contents').length > 1) $(this).closest('.main-contents').remove();
        await obj.currentSelect();
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
        let resp;
        if (obj.resp === null){
          resp = await callKintoneApi(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', { app: kintone.app.getId() });
          obj.resp = resp;
        } else {
          resp = obj.resp;
        }
        resp.layout.forEach(row => {
          if (row.type === 'ROW') row.fields.forEach(field => fieldList.push(field));
          else if (row.type === 'SUBTABLE') {
            fieldList.push(row);
            if (!subTable) return;
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
            row.layout.forEach((childRow) => childRow.fields.forEach((field) => {
              fieldList.push({
                type: field.type,
                code: row.code + '　' + field.code,
                id: field.id,
                properties: field.properties,
              })
            }
            ));
          };
        })

        let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
        fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];

        fieldList.forEach(field => {
          if (!field.code) return;
          if (field.code.split('　').length === 2 && field.type !== 'SUBTABLE') {
            var code = field.code.split('　')[1];
          } else {
            var code = field.code;
          }
          const target = fieldList2.find(x => x.var === code);
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
      if (flg) return fieldList.filter(x => limitFieldType.includes(x.type));
      else return fieldList.filter(x => !limitFieldType.includes(x.type));
    },


    /***********************************************
     * [オプション作成処理関数]
     * @param {Array}  fields [フィールドリスト]
     * @param {jQuery} name   [クラス・ID名]
     ***********************************************/
    createOption: function (fields, name) {

      const $noneOption = $('<option>', {
        value: 'none',
        text: ''
      });
      name.append($noneOption);

      fields.forEach(field => {
        if (field.type !== 'SPACER') {
          const $option = $('<option>', {
            value: `${field.code} ${field.id}`,
            text: field.code
          });
          name.append($option);
        } else {
          const $option = $('<option>', {
            value: field.elementId,
            text: field.elementId
          });
          name.append($option);
        }
      });
    },


    /***************************************
  * [ドロップダウンに検索機能追加・CSS追加]
  **************************************/
    search: function () {
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
          if(opnederDropdownId == "format-select"){
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
        confirmButtonText: button
      })
    },

    changeEvent: function () {
      const that = this;
      $(document).on('change', '.source-select,.destination-select', async function () {
        var scrollPosition = window.scrollY;
        await that.currentSelect();
        window.scrollTo(0, scrollPosition);
      });
    },

    setLength: function () {
      this.search();

      for (let i = 0; i < $('.main-contents').length; i++) {
        const $mainContent = $('.main-contents').eq(i);
        const str1 = $mainContent.find('.source-select option:selected').text().length;
        const str2 = $mainContent.find('.destination-select option:selected').text().length;

        let arr = [str1, str2]
        let len = Math.max(...arr) * 17 + 20;
        if (len < 290) len = 290;

        $mainContent.find('.tip-container').find('.select2-selection--single').css('width', len + 'px');
        $mainContent.find('.tip-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
        $mainContent.css('width', len + 50 + 'px');
      }
    },

    currentSelect: async function () {

      const that = this;
      let array = [];

      that.setLength();

      const fieldList = await that.getFieldList(true);
      const useFieldList = that.filterField(
        fieldList,
        true,
        'SINGLE_LINE_TEXT'
      );


      $('.main-contents').each(function () {

        //反映元は同じフィールドを選べるようにする。
        /*if ($(this).find('.source-select').val() !== null) {
          array.push($(this).find('.source-select').val().split(' ')[0]);
        }*/
        if ($(this).find('.destination-select').val() !== null) {
          array.push($(this).find('.destination-select').val().split(' ')[0]);
        }
      });

      $('.main-contents').each(function () {

        //currentSelect1
        const currentSelect1 = $(this).find('.source-select');
        let currentValue1 = currentSelect1.val();
        let currentValueId1 = currentSelect1.val();
        if (currentSelect1.val() !== null) {
          currentValue1 = currentValue1.split(' ')[0];
        }
        let newOptions1 = [];

        newOptions1 = useFieldList.filter(option => !array.includes(option.code) || option.code === currentValue1);

        //反映元は同じフィールドを選べるようにする。
        /*currentSelect1.empty();
        that.createOption(newOptions1, currentSelect1);
        currentSelect1.val(currentValueId1);*/


        //currentSelect2
        const currentSelect2 = $(this).find('.destination-select');

        let currentValue2 = currentSelect2.val();
        let currentValueId2 = currentSelect2.val();
        if (currentSelect2.val() !== null) {
          currentValue2 = currentValue2.split(' ')[0];
        }
        let newOptions2 = [];

        newOptions2 = useFieldList.filter(option => !array.includes(option.code) || option.code === currentValue2);

        currentSelect2.empty();
        that.createOption(newOptions2, currentSelect2);
        currentSelect2.val(currentValueId2);
      });

      //that.setLength();
    },

    /***********************************************************
   * [テーブル跨ぎチェック処理関数]
   * @param {array} value [テーブル跨ぎチェックを行う配列]
   * @returns [跨いでいる場合 true　いない場合 falseを返す]
   **********************************************************/
    tableCheck: async function (value,fieldList) {

      // グループ名のリストを取得する
      const that = this;
      const groupList = [];
      let flag = false;

      //const fieldList = await obj.getFieldList(true);
      fieldList.forEach((field) => {
        if (field.type === 'GROUP') {
          groupList.push(field.code);
        }
      });
      
      const len = value.settings.length
      for (let i = 0; i < len; i++) {
        // 連結先フィールドの属するテーブルを抽出、テーブル外なら空文字列
        const parts = value.settings[i].sourceField.code.split('　');
        let tabled =  parts.length === 2 ? parts[0] : '';
        // グループに属する場合もテーブル外扱い
        if (groupList.includes(tabled)) tabled = '';
        // 連結元フィールドの属するテーブルを抽出
        const parts2 = value.settings[i].destinationField.code.split('　');
        let tables =  parts2.length === 2 ? parts2[0] : '';
        if (groupList.includes(tables)) tables = '';
        // 属するテーブルが異なる場合不可とする
        if(tables != tabled) {flag = true};
      }
        return flag;
    },

    /***********************************************************
     * [重複チェック処理関数]
     * @param {array} value [保存設定内容]
     * @returns [重複している場合 true　していない場合 falseを返す]
     **********************************************************/
    dupCheck: function (value) {
      const array = [];

      value.settings.forEach(item => {
        array.push(item.destinationField.code);
      })
      const a = new Set(array);
      return a.size !== array.length;
    },

    /***********************************************************
    * [変換元と変換先フィールドの重複チェック処理関数]
    * @param {array} value [重複チェックを行う配列]
    * @returns [変換元と変換先のフィールドが重複している場合 true　していない場合 falseを返す]
    **********************************************************/
    ioDupCheck: function (value) {
      let flag = false;
      value.settings.forEach(item => {
        value.settings.forEach(item2 => {
          if(item.sourceField.code === item2.destinationField.code){flag = true;}
        })
      })
      return flag;
    },

    /***********************************************************
    * [変換元と変換先の重複チェック処理関数]
    * @param {array} value [重複チェックを行う配列]
    * @returns [変換元と変換先が重複している場合 true　していない場合 falseを返す]
    **********************************************************/
    sdDupCheck: function (value) {
      let flag = false;
      value.settings.forEach(item => {
        if(item.sourceField.code === item.destinationField.code){flag = true;}
      })
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
        if (!value.settings || value.settings.length === 0) return false;

        if (obj.dupCheck(value)) {
          obj.displayAlert('エラー', '選択された変換先フィールドが重複しています。', 'error', 'OK');
          return false;
        }

        const fieldList = await obj.getFieldList(true)
        if (await obj.tableCheck(value,fieldList)){
          obj.displayAlert('エラー', '異なるテーブルに属するフィールドが変換先になっています。', 'error', 'OK');
          return false;
        }

         if (await obj.sdDupCheck(value)) {
          obj.displayAlert('エラー', '変換元と変換先のフィールドが重複しています。', 'error', 'OK');
          return false;
        }

        if (await obj.ioDupCheck(value)) {
          obj.displayAlert('エラー', '変換元と別グループの変換先のフィールドが重複しています。', 'error', 'OK');
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
      if (typeof KNTP421310certification === 'function') {
        return true;
      } else {
        return false;
      }
    }

  };


  //[関数実行]
  obj.configShow(obj.config);

})(jQuery, kintone.$PLUGIN_ID);
