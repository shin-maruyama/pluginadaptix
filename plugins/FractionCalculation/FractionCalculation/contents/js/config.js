// Copyright (C) All in one Allright Reserved. 


jQuery.noConflict();

(function($, PLUGIN_ID) {
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
    $submit : $('#submit'),
    $cancel : $('.js-cancel-button'),
    config  : kintone.plugin.app.getConfig(PLUGIN_ID),
    formfields: {},
    resp: null,

    /********************************************
     * [プラグイン設定保存処理関数]
     * @returns [プラグイン保存設定内容オブジェクト]
     ********************************************/
    submit : function() {
      const value = {
        settings : []
      };

      for(let i = 0; i < $('.main-contents').length; i++) {
        const $mainContent = $('.main-contents').eq(i);
        const item = {
          target      : $mainContent.find('.target-select').val(),
          method      : $mainContent.find('.method-select').val(),
          location    : $mainContent.find('.location-select').val(),
          destination : $mainContent.find('.destination-select').val(),
        };
        value.settings.push(item);
      }
      return value;
    },


    /**********************************************************
     * [プラグイン設定画面表示時処理関数]
     * @param {object} config [プラグイン保存設定内容オブジェクト]
     **********************************************************/
    configShow : async function(config) {

      if (!(obj.checkCertificationFile())) {
        obj.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
        return;
      } else {
        if (!(await KNTP906610certification())) {
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
       * @param {Array} fieldList           [フォームの左上から順のフィールドリスト]
       * @param {Array} numAndCalcFieldList [数値、計算フィールドリスト]
       * @param {Array} dropdownFieldList   [ドロップダウンフィールドリスト]
       * @param {Array} numberFieldList     [数値フィールドリスト]
       */
      const fieldList = await obj.getFieldList(true);
      const numAndCalcFieldList = obj.filterField(fieldList, true, 'NUMBER', 'CALC');
      const dropdownFieldList   = obj.filterField(fieldList, true, 'DROP_DOWN');
      const numberFieldList     = obj.filterField(fieldList, true, 'NUMBER');

      //[ドロップダウンにオプション追加]
      obj.createOption(numAndCalcFieldList, $('.target-select'));
      obj.createOption(dropdownFieldList,   $('.method-select'));
      obj.createOption(dropdownFieldList,   $('.location-select'));
      obj.createOption(numberFieldList,     $('.destination-select'));

      //[既にプラグイン設定が保存されている場合の処理]
      if(Object.keys(config).length) {
        //[JSON型に変換]
        config.settings  = JSON.parse(config.settings);
        const {settings} = config;

        //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
        for(let i = 1; i < settings.length; i++) {
          const $clone = $('.main-contents:first').clone(true);
          $('#parent').append($clone);
        }

        //[プラグイン保存設定反映]
        for(let i = 0; i < settings.length; i++) {
          const setting = settings[i];
          const $mainContent = $('.main-contents').eq(i);

          $mainContent.find('.target-select').val(setting.target);
          $mainContent.find('.method-select').val(setting.method);
          $mainContent.find('.location-select').val(setting.location);
          $mainContent.find('.destination-select').val(setting.destination);
        }
      }
      await obj.currentSelect();

    },


    /*************************************
     * [設定追加・削除ボタンクリック時の処理関数]
     ************************************/
    rowButtonClickEvent : function() {
      //[追加ボタンクリック時の処理]
      $(document).on('click', '.add-row', async function() {
        $('.target-select').select2('destroy');
        $('.method-select').select2('destroy');
        $('.location-select').select2('destroy');
        $('.destination-select').select2('destroy');
        const $clone = $('.main-contents:first').clone(true);
        $(this).closest('.main-contents').after($clone);
        await obj.currentSelect();
      });

      //[削除ボタンクリック時の処理]
      $(document).on('click', '.remove-row', async function() {
        if($('.main-contents').length > 1) $(this).closest('.main-contents').remove();
        await obj.currentSelect();
      });
    },


    /*************************************************
     * [自アプリフォームのフィールドリストを取得する]
     * @param {boolean} subTable [サブテーブル内も取得する場合true しない場合false]
     * @returns [自アプリフォームの左上から順番にフィールド取得]
     ************************************************/
    getFieldList : async function(subTable = false) {
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
          if(row.type === 'ROW') row.fields.forEach(field => fieldList.push(field));
          else if(row.type === 'SUBTABLE') {
            fieldList.push(row);
            if(!subTable) return;
            row.fields.forEach(field => {
              const fieldInfo = {
                type : field.type,
                code : `${row.code}　${field.code}`,
              };
              fieldList.push(fieldInfo);
            })
          } 
          else if(row.type === 'GROUP'){
            fieldList.push(row);
              row.layout.forEach(childRow => childRow.fields.forEach((field) => {
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
            var tableCode = field.code.split('　')[0];
          } else {
            var code = field.code;
            var tableCode = '';
          }
          const target = fieldList2.find(x => x.var === code);
          if(target) {
            field.id = target.id;
            field.properties = target.properties;
            field.label = target.label;
          }

          if (tableCode == '') return;
          const tableData = fieldList2.find(x => x.var === tableCode);
          if (!tableData || !tableData.fieldList) return;
          const inTarget = Object.values(tableData.fieldList).find(x => x.var === code);
          if (!inTarget) return;
          field.id = inTarget.id;
          field.properties = inTarget.properties;
          field.label = inTarget.label;
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
    filterField : function(fieldList, flg, ...limitFieldType) {
      if(!limitFieldType.length) return fieldList;
      if(flg) return fieldList.filter(x => limitFieldType.includes(x.type));
      else return fieldList.filter(x => !limitFieldType.includes(x.type));
    },


    /***********************************************
     * [オプション作成処理関数]
     * @param {Array}  fields [フィールドリスト]
     * @param {jQuery} name   [クラス・ID名]
     ***********************************************/
    createOption : function( fields, name ) {

      const $noneOption = $('<option>', {
        value : 'none',
        text  : ''
      });
      name.append($noneOption);

      fields.forEach(field => {
        if(field.type !== 'SPACER') {
          const $option = $('<option>', {
            value : field.code,
            text  : field.code
          });
          name.append($option);
        }else {
          const $option = $('<option>', {
            value : field.elementId,
            text  : field.elementId
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

    },


    /******************************************
     * [アラートの表示処理関数]
     * @param {string} title  [タイトル] 
     * @param {string} text   [説明文]
     * @param {string} type   [アラートタイプ]
     * @param {string} button [ボタン名表示文字]
     * 使用例 ： obj.displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');  
     *****************************************/
    displayAlert : function(title ,text, type, button){
      swal.fire({
        title: title,
        html: text,
        icon: type,
        confirmButtonText: button
      })
    },

    changeEvent: function () {
      const that = this;
      $(document).on('change', '.target-select,.destination-select,.location-select,.method-select', async function () {
        var scrollPosition = window.scrollY;
        await that.currentSelect();
        window.scrollTo(0, scrollPosition);
      });
    },

    setLength: function () {
      this.search();

      for (let i = 0; i < $('.main-contents').length; i++) {
        const $mainContent = $('.main-contents').eq(i);

        const arr = []
        arr.push($mainContent.find('.target-select option:selected').text().length);
        arr.push($mainContent.find('.method-select option:selected').text().length);
        arr.push($mainContent.find('.location-select option:selected').text().length);
        arr.push($mainContent.find('.destination-select option:selected').text().length);

        let len = Math.max(...arr) * 17 + 20;
        if (len < 290) len = 290;

        $mainContent.find('.tip-container').find('.select2-selection--single').css('width', len + 'px');
        $mainContent.find('.tip-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
        $mainContent.css('width', len + 50 + 'px');
      }
    },

    currentSelect: async function () {

      const that = this;
      let array1 = [];//現在処理対象で選ばれている値
      let array2 = [];//現在格納先で選ばれている値

      that.setLength();

      const fieldList = await obj.getFieldList(true);
      const numAndCalcFieldList = obj.filterField(fieldList, true, 'NUMBER', 'CALC');
      const numberFieldList     = obj.filterField(fieldList, true, 'NUMBER');

      // 結果格納先に選んだものは処理対象では選べない
      // 処理対象,結果格納先に選んだものは結果格納先では選べない
      $('.main-contents').each(function () {
        if ($(this).find('.target-select').val() !== null) {
          array2.push($(this).find('.target-select').val());
        }
        if ($(this).find('.destination-select').val() !== null) {
          array1.push($(this).find('.destination-select').val());
          array2.push($(this).find('.destination-select').val());
        }
      });

      $('.main-contents').each(function () {

        //currentSelect1
        const currentSelect1 = $(this).find('.target-select');
        let currentValue1 = currentSelect1.val();
        const newOptions1 = numAndCalcFieldList.filter(option => !array1.includes(option.code) || option.code === currentValue1);

        currentSelect1.empty();
        that.createOption(newOptions1, currentSelect1);
        currentSelect1.val(currentValue1);

        //currentSelect2
        const currentSelect2 = $(this).find('.destination-select');
        let currentValue2 = currentSelect2.val();
        const newOptions2 = numberFieldList.filter(option => !array2.includes(option.code) || option.code === currentValue2);

        currentSelect2.empty();
        that.createOption(newOptions2, currentSelect2);
        currentSelect2.val(currentValue2);
      });

    },

    blankCheck : function(value) {
      for (const item of value.settings) {
        if (item.target == "none") return true;
        if (item.method == "none") return true;
        if (item.location == "none") return true;
        if (item.destination == "none") return true;
      }
      return false;
    },
    /***********************************************************
     * [重複チェック処理関数]
     * @param {array} value [重複チェックを行う配列]
     * @returns [重複している場合 true　していない場合 falseを返す]
     **********************************************************/
    dupCheck : function(value) {
      const targetSet = new Set();

      value.settings.forEach(item => {
        targetSet.add(item.target);
      });
      const targetCount = targetSet.size;
      value.settings.forEach(item => {
        targetSet.add(item.destination);
      });
      return targetSet.size !== targetCount + value.settings.length;
    },

     /***********************************************************
     * [ドロップダウン重複チェック処理関数]
     * @param {array} value [ドロップダウン重複チェックを行う配列]
     * @returns [重複している場合 true　していない場合 falseを返す]
     **********************************************************/
    dropdownDupCheck : function(value) {
      const targetSet = new Set();

      value.settings.forEach(item => {
        targetSet.add(item.method);
      });
      const targetCount = targetSet.size;
      value.settings.forEach(item => {
        targetSet.add(item.location);
      });
      return targetSet.size !== targetCount + value.settings.length;
    },

    /***********************************************************
     * [端数処理方法の選択肢が想定通りか確認する]
     * @param {array} value [選択肢チェックを行う配列]
     * @returns [選択肢が想定通りの場合false　選択肢が想定通りでない場合trueを返す]
     **********************************************************/
    methodOptionCheck : function(value) {
      let flag = false
      value.settings.forEach(item => {
        let split = item.method.split("　")
        let field = obj.formfields.properties[split[0]]
        if(field.type == 'SUBTABLE'){
          field = field.fields[split[1]]
        } else if(field.type == 'GROUP'){
          field = obj.formfields.properties[split[1]]
        }
        const actualOptions = Object.values(field.options).map(opt => opt.label.trim());
        const expectedOptions = ['切り上げ', '切り捨て', '四捨五入'];
        const hasAllExpected = expectedOptions.every(opt => actualOptions.includes(opt));
        const hasOnlyExpected = actualOptions.length === expectedOptions.length &&
                                actualOptions.every(opt => expectedOptions.includes(opt));
        if(!(hasAllExpected && hasOnlyExpected)) flag = true;
      });
      return flag;
    },

    /***********************************************************
     * [端数処理桁数の選択肢が想定通りか確認する]
     * @param {array} value [選択肢チェックを行う配列]
     * @returns [選択肢が想定通りの場合false　選択肢が想定通りでない場合trueを返す]
     **********************************************************/
    locationOptionCheck : function(value) {
      let flag = false
      value.settings.forEach(item => {
        let split = item.location.split("　")
        let field = obj.formfields.properties[split[0]]
        if(field.type == 'SUBTABLE'){
          field = field.fields[split[1]]
        } else if(field.type == 'GROUP'){
          field = obj.formfields.properties[split[1]]
        }
        const actualOptions = Object.values(field.options).map(opt => opt.label.trim());
        const expectedOptions = ['100円単位', '10円単位', '1円単位','小数点第一位', '小数点第二位', '小数点第三位'];
        const hasAllExpected = expectedOptions.every(opt => actualOptions.includes(opt));
        const hasOnlyExpected = actualOptions.length === expectedOptions.length &&
                                actualOptions.every(opt => expectedOptions.includes(opt));
        if(!(hasAllExpected && hasOnlyExpected)) flag = true;
      });
      return flag;
    },

    /***********************************************************
     * [四つの項目がテーブル外または同テーブル内に統一されているかチェック]
     * @param {array} value [統一チェックを行う配列]
     * @returns [統一されている場合false　されていない場合trueを返す]
     **********************************************************/
    unificationCheck : async function(value) {
      const fieldList = await obj.getFieldList(true);
      const tableList = [];
      for (const row of fieldList){
        if (row.type === 'SUBTABLE') tableList.push(row.code);
      }

      for(const setting of value.settings) {
        const targetTable = obj.getTable(setting.target, tableList);

        if (targetTable != obj.getTable(setting.destination, tableList)) return true;

        const methodTable = obj.getTable(setting.method, tableList);
        if (targetTable != methodTable && methodTable != '') return true;

        const locationTable = obj.getTable(setting.location, tableList);
        if (targetTable != locationTable && locationTable != '') return true;
      }
      return false;
    },

    getTable : function(code, tableList) {
      const s = code.split('　');
      if (s.length === 1) return '';
      if (tableList.includes(s[0])) return s[0];
      return '';
    },


    /************************************************
     * [保存・キャンセルボタンクリック時イベント処理関数]
     ***********************************************/
    buttonClickEvent : function() {

      //[保存ボタンクリック時イベント]
      obj.$submit.on('click', async function(e) {
        e.preventDefault();  

        const value = obj.submit();

        //ドロップダウン判定に、アプリのフィールドを獲得する。
        await callKintoneApi(kintone.api.url('/k/v1/app/form/fields', true),'GET',{ app: kintone.app.getId()})
        .then((resp) => obj.formfields = resp);

        if(obj.blankCheck(value)) {
          obj.displayAlert('エラー','選択されていない項目があります。','error','OK');  
          return false;
        }

        if(obj.methodOptionCheck(value)) {
          obj.displayAlert('エラー','端数処理方法ドロップダウンの選択肢が不良です。','error','OK');
        }
        if(obj.locationOptionCheck(value)) {
          obj.displayAlert('エラー','端数処理桁数ドロップダウンの選択肢が不良です。','error','OK');
        }
        if(obj.dupCheck(value)) {
          obj.displayAlert('エラー','結果格納先同士、または結果格納先と処理対象が重複しています。','error','OK');  
          return false;
        }
        if(obj.dropdownDupCheck(value)) {
          obj.displayAlert('エラー','端数処理桁数と端数処理方法が重複しています。','error','OK');  
          return false;
        }
        if(await obj.unificationCheck(value)) {
          obj.displayAlert('エラー','「処理対象」「端数処理桁数」「端数処理方法」「結果格納先」をテーブル外または同テーブル内に統一してください。','error','OK');  
          return false;
        }
        //[文字列に変換]
        value.settings = JSON.stringify(value.settings);

        kintone.plugin.app.setConfig(value);
      });

      //[キャンセルボタンクリック時イベント]
      obj.$cancel.on('click', function() {
        window.location.href = '../../' + kintone.app.getId() + '/plugin/';
      });
    },

    checkCertificationFile: function () {
      if (typeof KNTP906610certification === 'function') {
        return true;
      } else {
        return false;
      }
    }

  };


  //[関数実行]
  obj.configShow(obj.config);

})(jQuery, kintone.$PLUGIN_ID);
