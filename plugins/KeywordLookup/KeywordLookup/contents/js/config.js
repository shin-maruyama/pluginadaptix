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
     * @param $submit       [保存ボタン要素]
     * @param $cancelButton [キャンセルボタン要素]
     * @param config        [プラグイン設定内容オブジェクト]
     */
    $submit: $('#submit'),
    $cancelButton: $('.js-cancel-button'),
    config: kintone.plugin.app.getConfig(PLUGIN_ID),
    searchFieldTypeList: ['SINGLE_LINE_TEXT', 'NUMBER', 'RADIO_BUTTON', 'DROP_DOWN', 'DATE', 'TIME', 'DATETIME', 'LINK', 'USER_SELECT'],
    copyFieldTypeList: ['RECORD_NUMBER', 'CREATOR', 'CREATED_TIME', 'MODIFIER', 'UPDATED_TIME',
      'CALC', 'FILE', 'SUBTABLE', 'REFERENCE_TABLE', 'LABEL', 'SPACER', 'HR', 'GROUP'],
    allFieldData : {},
    allLayoutData : {},

    /********************************************
     * [プラグイン設定保存処理関数]
     * @returns [プラグイン保存設定内容オブジェクト]
     ********************************************/
    submit: function () {
      const value = {
        settings: []
      };

      const mainContentsLength = $('.main-contents').length;
      for (let i = 0; i < mainContentsLength; i++) {
        const mainContents = $('.main-contents').eq(i);
        const item = {
          appId: mainContents.find('.apps').val(),
          inputFieldCode1: mainContents.find('.input-field-1').val(),
          inputFieldCode2: mainContents.find('.input-field-2').val(),
          inputFieldCode3: mainContents.find('.input-field-3').val(),
          searchFieldCode1: mainContents.find('.search-field-1').val(),
          searchFieldCode2: mainContents.find('.search-field-2').val(),
          searchFieldCode3: mainContents.find('.search-field-3').val(),
          copyFieldList: []
        };

        const copyContentsRowLength = mainContents.find('.copy-contents-row').length;
        for (let j = 0; j < copyContentsRowLength; j++) {
          const copyContentsRow = mainContents.find('.copy-contents-row').eq(j);

          const copyField = {
            destinationField: copyContentsRow.find('.copy-destination-field').val(),
            sourceField: copyContentsRow.find('.copy-source-field').val()
          };

          item.copyFieldList.push(copyField);
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
        if (!(await KNTP679310certification())) {
          return;
        }
      }

      /**
       * [保存・削除ボタンクリック時の処理]
       * [アプリリストドロップダウン選択時の処理]
       * [フィールドのコピー追加・削除ボタンクリック時の処理関数]
       * [設定追加・削除ボタンクリック時の処理]
       */
      obj.buttonClickEvent();
      obj.appsDropDownChangeEvent();
      obj.childRowButtonClickEvent();
      obj.rowButtonClickEvent();

      /**
       * @param {Array} allAppsList     [全てのアプリリスト]
       * @param {Array} fieldList       [フォームの左上から順のフィールドリスト]
       * @param {Array} searchFieldList [検索対象フィールドリスト]
       * @param {Array} copyFieldList   [コピー対象フィールドリスト]
       */
      const allAppsList = await obj.getAllApps();
      const fieldList = await obj.getFieldList(true);
      const inputFieldList = obj.filterField(fieldList, true, ...obj.searchFieldTypeList);
      const copyDFieldList = obj.filterField(fieldList, false, ...obj.copyFieldTypeList);
      // console.log(fieldList);

      //[ドロップダウンにオプション追加]

      //[アプリの配列はcreateOption関数に当てはまらないため、直書き]
      const option = $('<option>', {
        value: '',
        text: '',
      });
      $('.apps').append(option);
      allAppsList.forEach(app => {
        const option = $('<option>', {
          value: app.appId,
          text: `${app.appId} ${app.name}`
        });
        $('.apps').append(option);
      })
      obj.createOption(inputFieldList, $('.input-field-1'));
      obj.createOption(inputFieldList, $('.input-field-2'));
      obj.createOption(inputFieldList, $('.input-field-3'));
      obj.createOption(copyDFieldList, $('.copy-destination-field'));

      //[既にプラグイン設定が保存されている場合の処理]
      if (Object.keys(config).length) {
        //[JSON型に変換]
        config.settings = JSON.parse(config.settings);
        const { settings } = config;
        //console.log(settings);

        //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
        for (let i = 1, len = settings.length; i < len; i++) {
          const clone = $('.main-contents:first').clone(true);
          $('#parent').append(clone);
        }

        //[保存した設定個数分フィールドのコピーのクローンを作成*1つ目は既にあるので飛ばす]
        for (let i = 0, len = settings.length; i < len; i++) {
          const mainContents = $('.main-contents').eq(i);

          for (let j = 1, len = settings[i].copyFieldList.length; j < len; j++) {
            const clone = mainContents.find('.copy-contents-row:first').clone(true);
            mainContents.find('.copy-contents').append(clone);
          }
        }

        //[プラグイン保存設定反映]
        for (let i = 0, len = settings.length; i < len; i++) {
          const mainContents = $('.main-contents').eq(i);

          mainContents.find('.apps').val(settings[i].appId);

          //[検索先フィールド・コピー元ドロップダウンにオプション追加]
          const appId = mainContents.find('.apps').val();
          const fieldList = await obj.getAppFormLayout(appId);
          const searchFieldList = obj.filterField(fieldList, true, ...obj.searchFieldTypeList);
          const copyFieldList = obj.filterField(fieldList, false, ...obj.copyFieldTypeList);
          
          obj.createOption(searchFieldList, mainContents.find('.search-field-1'));
          obj.createOption(searchFieldList, mainContents.find('.search-field-2'));
          obj.createOption(searchFieldList, mainContents.find('.search-field-3'));
          obj.createOption(copyFieldList, mainContents.find('.copy-source-field'));

          //[設定された値を反映]
          mainContents.find('.input-field-1').val(settings[i].inputFieldCode1);
          mainContents.find('.input-field-2').val(settings[i].inputFieldCode2);
          mainContents.find('.input-field-3').val(settings[i].inputFieldCode3);
          mainContents.find('.search-field-1').val(settings[i].searchFieldCode1);
          mainContents.find('.search-field-2').val(settings[i].searchFieldCode2);
          mainContents.find('.search-field-3').val(settings[i].searchFieldCode3);


          for (let j = 0, len = settings[i].copyFieldList.length; j < len; j++) { 
            mainContents.find('.copy-contents-row').eq(j).find('.copy-source-field').val(settings[i].copyFieldList[j].sourceField);
            mainContents.find('.copy-contents-row').eq(j).find('.copy-destination-field').val(settings[i].copyFieldList[j].destinationField);
          }

        }

        obj.adjustDis();
        await obj.createNewOption();
       
        //[プラグイン設定が保存されていない場合の処理]
      } else {
        const appId = $('.apps').val();
        if (appId && appId !== '') {
          const fieldList = await obj.getAppFormLayout(appId);
          const searchFieldList = obj.filterField(fieldList, true, ...obj.searchFieldTypeList);
          const copyFieldList = obj.filterField(fieldList, false, ...obj.copyFieldTypeList);
          obj.createOption(searchFieldList, $('.search-field-1'));
          obj.createOption(searchFieldList, $('.search-field-2'));
          obj.createOption(searchFieldList, $('.search-field-3'));
          obj.createOption(copyFieldList, $('.copy-source-field'));
        } else {
          const list = [];
          obj.createOption(list, $('.search-field-1'));
          obj.createOption(list, $('.search-field-2'));
          obj.createOption(list, $('.search-field-3'));
          obj.createOption(list, $('.copy-source-field'));
        }

        obj.search();
      }
      $('#parent').sortable();
    },


    getDLength: function (setting) {
      let maxLen = 0;
      let i1 = setting.inputFieldCode1.length;
      let i2 = setting.inputFieldCode2.length;
      let i3 = setting.inputFieldCode3.length;
      if (i1 > i2) maxLen = i1;
      if (i3 > maxLen) maxLen = i3;
      setting.copyFieldList.forEach(x => {
        let i4 = x.destinationField.length;
        if (i4 > maxLen) maxLen = i4;
      });
      return maxLen;
    },

    getSLength: function (setting) {
      let maxLen = 0;
      let i1 = setting.searchFieldCode1.length;
      let i2 = setting.searchFieldCode2.length;
      let i3 = setting.searchFieldCode3.length;
      if (i1 > i2) maxLen = i1;
      if (i3 > maxLen) maxLen = i3;
      setting.copyFieldList.forEach(x => {
        let i4 = x.sourceField.length;
        if (i4 > maxLen) maxLen = i4;
      });
      return maxLen;
    },



    /*****************************************
     * [アプリリストドロップダウン選択時イベント] 
     ****************************************/
    appsDropDownChangeEvent: function () {
      $(document).on('change', '.apps', async function () {
        const appId = $(this).val();

        //[ドロップダウンのオプション削除]
        $(this).closest('.main-contents').find('.search-field-1').find('option').remove();
        $(this).closest('.main-contents').find('.search-field-2').find('option').remove();
        $(this).closest('.main-contents').find('.search-field-3').find('option').remove();
        $(this).closest('.main-contents').find('.copy-source-field').find('option').remove();
        $(this).closest('.input-field-1').val("");
        $(this).closest('.input-field-2').val("");
        $(this).closest('.input-field-3').val("");

        if (appId && appId !== '') {
          const fieldList = await obj.getAppFormLayout(appId);
          const searchFieldList = obj.filterField(fieldList, true, ...obj.searchFieldTypeList);
          const copyFieldList = obj.filterField(fieldList, false, ...obj.copyFieldTypeList);

          //[ドロップダウンにオプション追加]
          obj.createOption(searchFieldList, $(this).closest('.main-contents').find('.search-field-1'));
          obj.createOption(searchFieldList, $(this).closest('.main-contents').find('.search-field-2'));
          obj.createOption(searchFieldList, $(this).closest('.main-contents').find('.search-field-3'));
          obj.createOption(copyFieldList, $(this).closest('.main-contents').find('.copy-source-field'));
        }

        obj.adjustDis();
      });

      $(document).on('change', '.input-field-1,.input-field-2,.input-field-3', async function () {
        //const array = [];
        const input = $(this).val();
        const mainContents = $(this).closest('.main-contents');
        let duplicateFound = false;

        await obj.createNewOption();

        if (input) {
          mainContents.find('.copy-destination-field').each(function () {
            const copyValue = $(this).val();
            if (copyValue === input) {
              duplicateFound = true;
              return false;
            }
          });
        }

        if (duplicateFound) {
          window.alert('このフィールドはすでにコピー用で設定されています。');
          return false;
        }
        obj.adjustDis();
      });


      $(document).on('change', '.search-field-1,.search-field-2,search-field-3', async function () {
        //const array = [];
        const input = $(this).val();
        const mainContents = $(this).closest('.main-contents');
        let duplicateFound = false;

        await obj.createNewOption();
        if (input) {
          mainContents.find('.copy-source-field').each(function () {
            const copyValue = $(this).val();
            if (copyValue === input) {
              duplicateFound = true;
              return false;
            }
          });
        }

        if (duplicateFound) {
          window.alert('このフィールドはすでにコピー用で設定されています。');
          return false;
        }
        obj.adjustDis();
      });


      $(document).on('change', '.copy-destination-field', async function () {
        var scrollPosition = window.scrollY;
        const destination = $(this).val();
        const mainContents = $(this).closest('.main-contents');
        let duplicateFound = false;

        await obj.createNewOption();

        if (destination) {
          const input1 = mainContents.find('.input-field-1').val();
          if (input1 === destination) duplicateFound = true;
          const input2 = mainContents.find('.input-field-2').val();
          if (input2 === destination) duplicateFound = true;
          const input3 = mainContents.find('.input-field-3').val();
          if (input3 === destination) duplicateFound = true;
        }

        if (duplicateFound) {
          window.alert('このフィールドはすでに検索用で設定されています。');
          return false;
        }
        obj.adjustDis();
        window.scrollTo(0, scrollPosition);
      });

      $(document).on('change', '.copy-source-field', async function () {
        var scrollPosition = window.scrollY;
        const source = $(this).val();
        const mainContents = $(this).closest('.main-contents');
        let duplicateFound = false;
  
        await obj.createNewOption();

        if (source) {
          const input1 = mainContents.find('.search-field-1').val();
          if (input1 === source) duplicateFound = true;
          const input2 = mainContents.find('.search-field-2').val();
          if (input2 === source) duplicateFound = true;
          const input3 = mainContents.find('.search-field-3').val();
          if (input3 === source) duplicateFound = true;
        }

        if (duplicateFound) {
          window.alert('このフィールドはすでに検索用で設定されています。');
          return false;
        }
        obj.adjustDis();
        window.scrollTo(0, scrollPosition);
      });


    },

    createNewOption: async function () {


      $('.main-contents').each(async function () {
        let array = [];
        array.push($(this).find('.search-field-1').val());
        array.push($(this).find('.search-field-2').val());
        array.push($(this).find('.search-field-3').val());
        $(this).find('.copy-source-field').each(function () {
          const copyValue = $(this).val();
          array.push(copyValue);
        });

        const appId = $(this).find('.apps').val();

        const fieldList = await obj.getAppFormLayout(appId);
        const searchFieldList = obj.filterField(fieldList, true, ...obj.searchFieldTypeList);
        const search1 = $(this).find('.search-field-1').val();
        const search2 = $(this).find('.search-field-2').val();
        const search3 = $(this).find('.search-field-3').val();
        $(this).find('.search-field-1').empty();
        $(this).find('.search-field-2').empty();
        $(this).find('.search-field-3').empty();
        const list1 = searchFieldList.filter(option => !array.includes(option.code) || option.code === search1);
        obj.createOption(list1, $(this).find('.search-field-1'));
        $(this).find('.search-field-1').val(search1);
        const list2 = searchFieldList.filter(option => !array.includes(option.code) || option.code === search2);
        obj.createOption(list2, $(this).find('.search-field-2'));
        $(this).find('.search-field-2').val(search2);
        const list3 = searchFieldList.filter(option => !array.includes(option.code) || option.code === search3);
        obj.createOption(list3, $(this).find('.search-field-3'));
        $(this).find('.search-field-3').val(search3);

        const copyList = obj.filterField(fieldList, false, ...obj.copyFieldTypeList);
        $(this).find('.copy-source-field').each(function () {
          const value = $(this).val();
          const newOptions = copyList.filter(option => !array.includes(option.code) || option.code === value);
          $(this).empty();
          obj.createOption(newOptions, $(this));
          $(this).val(value);
        });
      })

      const ilist = await obj.getFieldList(true);
      const inputFieldList = obj.filterField(ilist, true, ...obj.searchFieldTypeList);
      const copyList2 = obj.filterField(ilist, false, ...obj.copyFieldTypeList);
      let array2 = [];
      $('.main-contents').each(function () {
        array2.push($(this).find('.input-field-1').val());
        array2.push($(this).find('.input-field-2').val());
        array2.push($(this).find('.input-field-3').val());
        $(this).find('.copy-destination-field').each(function () {
          const copyValue = $(this).val();
          array2.push(copyValue);
        });
      })


      $('.main-contents').each(function () {
        const input1 = $(this).find('.input-field-1').val();
        const input2 = $(this).find('.input-field-2').val();
        const input3 = $(this).find('.input-field-3').val();
        $(this).find('.input-field-1').empty();
        $(this).find('.input-field-2').empty();
        $(this).find('.input-field-3').empty();
        let list4 = inputFieldList.filter(option => !array2.includes(option.code) || option.code === input1);
        const type1 = $(this).find('.search-field-1 option:selected').attr('type');
        if (type1) list4 = obj.filterField(list4, true, type1);
        obj.createOption(list4, $(this).find('.input-field-1'));
        $(this).find('.input-field-1').val(input1);
        let list5 = inputFieldList.filter(option => !array2.includes(option.code) || option.code === input2);
        const type2 = $(this).find('.search-field-2 option:selected').attr('type');
        if (type2) list5 = obj.filterField(list5, true, type2);
        obj.createOption(list5, $(this).find('.input-field-2'));
        $(this).find('.input-field-2').val(input2);
        let list6 = inputFieldList.filter(option => !array2.includes(option.code) || option.code === input3);
        const type3 = $(this).find('.search-field-3 option:selected').attr('type');
        if (type3) list6 = obj.filterField(list6, true, type3);
        obj.createOption(list6, $(this).find('.input-field-3'));
        $(this).find('.input-field-3').val(input3);

        $(this).find('.copy-destination-field').each(function () {
          const value = $(this).val();
          let newOptions = copyList2.filter(option => !array2.includes(option.code) || option.code === value);
          $(this).empty();
          const type = $(this).closest('.copy-contents-row').find('.copy-source-field option:selected').attr('type');
          if (type) newOptions = obj.filterField(newOptions, true, type);
          obj.createOption(newOptions, $(this));
          $(this).val(value);
        });
      })

    },

    adjustDis: function () {
      obj.search();
      for (let i = 0; i < $('.main-contents').length; i++) {
        const mainContent = $('.main-contents').eq(i);
        let aLen = mainContent.find('.apps').find('option:selected').text().length;
        aLen = aLen * 17 + 20;
        let lLen = obj.getLeftLength(mainContent);
        lLen = lLen * 17 + 20;
        let rLen = obj.getRightLength(mainContent);
        rLen = rLen * 17 + 20;

        if (lLen < 290) lLen = 290;
        if (rLen < 290) rLen = 290;
        if (aLen < 290) aLen = 290;
        mainContent.find('.app-container').find('.select2-selection--single').css('width', aLen);
        mainContent.find('.app-container').find('.select2-selection--single').css('height', '55px');
        mainContent.find('.app-container').find('.select2-selection__arrow').css('left', parseInt(aLen) - 30 + 'px');

        obj.setLeftLength(mainContent, lLen + 'px');
        obj.setRightLength(mainContent, rLen + 'px');

        let nLen = obj.getMaxLength(mainContent);
        nLen = nLen + 200;

        if (nLen > 800) {
          mainContent.css('width', nLen + 'px');
        } else {
          mainContent.css('width', '800px');
        }
      }
    },

    getLeftLength: function (name) {
      let maxLen = 0;

      name.find('.input-container').each(function (i) {
        let index = i + 1;
        let rowLen = $(this).find(`.input-field-${index} option:selected`).text().length;
        if (rowLen > maxLen) maxLen = rowLen;
      });

      name.find('.copy-contents-row').each(function () {
        let t = $(this).find('.copy-destination-container').find('.copy-destination-field option:selected').text().length;
        if (t > maxLen) maxLen = t;
      });

      return maxLen;
    },

    getRightLength: function (name) {
      let maxLen = 0;

      name.find('.search-container').each(function (i) {
        let index = i + 1;
        let rowLen = $(this).find(`.search-field-${index} option:selected`).text().length;
        if (rowLen > maxLen) maxLen = rowLen;
      });

      name.find('.copy-contents-row').each(function () {
        let t = $(this).find('.copy-source-container').find('.copy-source-field option:selected').text().length;
        if (t > maxLen) maxLen = t;
      });

      return maxLen;
    },

    setLeftLength: function (name, len) {
      const dLen = parseInt(len) + 30;
      const aLen = parseInt(len) - 290 + 260;
      const label = parseInt(len) - 290 + 400;


      name.find('.input-container').find('.select2-selection--single').css('width', len);
      name.find('.input-container').css('width', dLen + 'px');
      name.find('.input-container').find('.select2-selection__arrow').css('left', aLen + 'px');
      name.find('.left-label').css('width', label + 'px');


      name.find('.copy-destination-container').find('.select2-selection--single').css('width', len);
      name.find('.copy-destination-container').css('width', dLen + 'px');
      name.find('.copy-destination-container').find('.select2-selection__arrow').css('left', aLen + 'px');

    },

    setRightLength: function (name, len) {
      const dLen = parseInt(len) + 5;
      const aLen = parseInt(len) - 290 + 260;
      const bLen = parseInt(len) - 290 + 740;


      name.find('.search-container').find('.select2-selection--single').css('width', len);
      name.find('.search-container').css('width', dLen + 'px');
      name.find('.search-container').find('.select2-selection__arrow').css('left', aLen + 'px');

      name.find('.copy-source-container').find('.select2-selection--single').css('width', len);
      name.find('.copy-source-container').css('width', dLen + 'px');
      name.find('.copy-source-container').find('.select2-selection__arrow').css('left', aLen + 'px');
      //name.find('.copy-contents-row').find('.kintoneplugin-table-td-operation').css('left', bLen + 'px');

    },

    getMaxLength: function (name) {
      let len = 0;

      let clen = name.find('.app-container').find('.select2-selection--single').css('width');
      clen = parseInt(clen, 10) || 0;
      if (clen > len) len = clen;

      let len1 = parseInt(name.find('.input-container').find('.select2-selection--single').css('width'));
      let len2 = parseInt(name.find('.search-container').find('.select2-selection--single').css('width'));

      clen = len1 + len2;
      if (clen > len) len = clen;

      return len;

    },


    /*******************************************************
     * [フィールドのコピー追加・削除ボタンクリック時の処理関数]
     ******************************************************/
    childRowButtonClickEvent: function () {
      //[追加ボタンクリック時の処理]
      $(document).on('click', '.add-child-row', async function () {
        $('.copy-destination-field').select2('destroy');
        $('.copy-source-field').select2('destroy');
        const clone = $(this).closest('.copy-contents-row').clone(true);
        
        $(this).closest('.copy-contents-row').after(clone);

        obj.adjustDis();
        await obj.createNewOption();
      });

      //[削除ボタンクリック時の処理]
      $(document).on('click', '.remove-child-row', async function () {
        if ($(this).closest('.copy-contents').find('.copy-contents-row').length > 1) {
          $(this).closest('.copy-contents-row').remove();
        }
        obj.adjustDis();
        await obj.createNewOption();
      });
    },


    /*************************************
     * [設定追加・削除ボタンクリック時の処理関数]
     ************************************/
    rowButtonClickEvent: function () {
      //[追加ボタンクリック時の処理]
      $(document).on('click', '.add-row', async function () {

        $('.apps').select2('destroy');
        $('.input-field-1').select2('destroy');
        $('.input-field-2').select2('destroy');
        $('.input-field-3').select2('destroy');
        $('.search-field-1').select2('destroy');
        $('.search-field-2').select2('destroy');
        $('.search-field-3').select2('destroy');
        $('.copy-destination-field').select2('destroy');
        $('.copy-source-field').select2('destroy');

        const clone = $('.main-contents:first').clone(true);
        //[フィールドのコピーの設定数を初期化]
        for (let i = 1, len = clone.find('.copy-contents-row').length; i < len; i++) {
          clone.find('.copy-contents-row').eq(0).remove();
        }

        //[検索先フィールド・コピー元ドロップダウンのオプション初期化]
        const appId = clone.find('.apps').val();


        $(this).closest('.main-contents').after(clone);
        //obj.search();
        obj.adjustDis();
        await obj.createNewOption();
      });

      //[削除ボタンクリック時の処理]
      $(document).on('click', '.remove-row', async function () {
        if ($('.main-contents').length > 1) $(this).closest('.main-contents').remove();
        //obj.search();
        obj.adjustDis();
        await obj.createNewOption();
      });
    },


    /**************************
     * [全てのアプリを取得する]
     * @returns [全アプリリスト]
     **************************/
    getAllApps: async function (offset = 0, appList = []) {
      const client = new KintoneRestAPIClient();
      try {
        const resp = await client.app.getApps({ offset });
        appList.push(...resp.apps);
        if (resp.apps.length === 100)
          return obj.getAllApps(offset + 100, appList);
      } catch { }
      return appList;
    },


    /*********************************
     * [指定したアプリのフォーム情報取得]
     * @returns [フォームレイアウト]
     *********************************/
    getAppFormLayout: async function (appId) {
      if (appId in obj.allLayoutData) return obj.allLayoutData[appId];

      const client = new KintoneRestAPIClient();
      const appList = await this.getAllApps();

      const app = appList.find((x) => x.appId === appId);
      if (!app) return [];
      const resp = await client.app.getFormLayout({ app: appId });
      const fieldList = [];
      resp.layout.forEach(row => {
        if (row.type === 'ROW') row.fields.forEach(field => fieldList.push(field));
        else if (row.type === 'SUBTABLE') {
          fieldList.push(row);
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
      });
      obj.allLayoutData[appId] = fieldList;
      return fieldList;
    },


    /*************************************************
     * 自アプリフォームのフィールドリストを取得する
     * @param {boolean} subTable [サブテーブル内も取得する場合true しない場合は実引数を入力しない]
     * @returns [自アプリフォームの左上から順番にフィールド取得]
     ************************************************/
    getFieldList: async function (subTable = false) {
      if (subTable in obj.allFieldData) return obj.allFieldData[subTable];

      const fieldList = [];
      try {
        const resp = await callKintoneApi('/k/v1/app/form/layout.json', 'GET', { app: kintone.app.getId() });
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
      } catch { }
      obj.allFieldData[subTable] = fieldList;
      return fieldList;
    },


    /************************************************
     * [指定したフィールドを抽出する関数]
     * @param {Array}   フィルターをかけるフィールドリスト
     * @param {boolean} 指定したフィールドタイプを抽出 true   以外を抽出 false
     * @param {Array}   抽出するフィールドタイプリスト
     * @returns [第二引数がtrueなら指定したフィールドタイプのフィールドリスト 
     *                    falseなら指定したフィールドタイプ以外のフィールドリスト] 
     ************************************************/
    filterField: function (fieldList, flg, ...limitFieldType) {
      if (!limitFieldType.length) return fieldList;
      if (flg) return fieldList.filter(x => limitFieldType.includes(x.type));
      else return fieldList.filter(x => !limitFieldType.includes(x.type));
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
        top: '8px',
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

      const noneOption = $('<option>', {
        value: '',
        text: '',
        type: ''
      });
      name.append(noneOption);

      fields.forEach(field => {
        if (field.type !== 'SPACER') {
          const option = $('<option>', {
            value: field.code,
            text: field.code,
            type: field.type,
          });
          name.append(option);
        } else {
          const option = $('<option>', {
            value: field.elementId,
            text: field.elementId
          });
          name.append(option);
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
        confirmButtonText: button
      })
    },


    /***********************************************************
     * [重複チェック処理関数]
     * @param {array} value [重複チェックを行う配列]
     * @returns [重複している場合true　していない場合falseを返す]
     **********************************************************/
    dupCheck: function (value) {
      const array = [];

      value.settings.forEach(setting => {
        setting.copyFieldList.forEach(copy => {
          array.push(copy.destinationField);
        })
      })
      const a = new Set(array);
      return a.size !== array.length;
    },


    /**
     * [入力フィールドとコピー先、検索フィールドとコピー元がそれぞれ、
     * テーブル外または同テーブル内フィールドで統一されているかチェック]
     * @param {array} value [チェックを行う配列]
     * @returns [統一されている場合true されいない場合false]
     */
    unificationCheck: async function (value) {
      const fieldList = await obj.getFieldList(true);
      for (const setting of value.settings) {
        let referencesFieldList = [];
        const appId = setting.appId;
        const sourceFieldList = await obj.getAppFormLayout(appId);

        setting.copyFieldList.forEach(copy => {
          referencesFieldList.push(copy.destinationField);
        })
        referencesFieldList.push(setting.inputFieldCode1);
        referencesFieldList.push(setting.inputFieldCode2);
        referencesFieldList.push(setting.inputFieldCode3);
        referencesFieldList = referencesFieldList.filter(x => x !== '');


        for (let i = 1, len = referencesFieldList.length; i < len; i++) {
          // if (referencesFieldList[0].split('　').length === referencesFieldList[i].split('　').length) {
          //   if (referencesFieldList[0].split('　').length === 2) {
          //     if (referencesFieldList[0].split('　')[0] !== referencesFieldList[i].split('　')[0]) return true;
          //   }
          // } else {
          //   return true;
          // }
          if (referencesFieldList[0]) {
            if (referencesFieldList[0].split('　').length === 1) {
              if (referencesFieldList[i]) {
                if (referencesFieldList[i].split('　').length === 2) {
                  const referencesField = fieldList.find((x) => x.code === referencesFieldList[i].split('　')[0]);
                  if (referencesField.type === 'SUBTABLE') return true;
                }
              }
            } else {
              const referencesField0 = fieldList.find((x) => x.code === referencesFieldList[0].split('　')[0]);
              if (referencesField0.type === 'SUBTABLE') {
                if (referencesFieldList[i]) {
                  if (referencesFieldList[i].split('　').length === 1) return true;
                  const referencesField = fieldList.find((x) => x.code === referencesFieldList[i].split('　')[0]);
                  if (referencesField0.type !== referencesField.type) return true;
                }
              } else {
                if (referencesFieldList[i]) {
                  if (referencesFieldList[i].split('　').length === 2) {
                    const referencesField = fieldList.find((x) => x.code === referencesFieldList[i].split('　')[0]);
                    if (referencesField.type === 'SUBTABLE') return true;
                  }
                }
              }
            }
          }

        }

        let referentFieldList = [];

        setting.copyFieldList.forEach(copy => {
          referentFieldList.push(copy.sourceField);
        })
        referentFieldList.push(setting.searchFieldCode1);
        referentFieldList.push(setting.searchFieldCode2);
        referentFieldList.push(setting.searchFieldCode3);
        referentFieldList = referentFieldList.filter(x => x !== '');

        for (let i = 1, len = referentFieldList.length; i < len; i++) {
          // if (referentFieldList[0].split('　').length === referentFieldList[i].split('　').length) {
          //   if (referentFieldList[0].split('　').length === 2) {
          //     if (referentFieldList[0].split('　')[0] !== referentFieldList[i].split('　')[0]) return true;
          //   }
          // } else {
          //   return true;
          // }
          if (referentFieldList[0]) {
            if (referentFieldList[0].split('　').length === 1) {
              if (referentFieldList[i]) {
                if (referentFieldList[i].split('　').length === 2) {
                  const referentField = sourceFieldList.find((x) => x.code === referentFieldList[i].split('　')[0]);
                  if (referentField.type === 'SUBTABLE') return true;
                }
              }
            } else {
              const referentField0 = sourceFieldList.find((x) => x.code === referentFieldList[0].split('　')[0]);
              if (referentField0.type === 'SUBTABLE') {
                if (referentFieldList[i]) {
                  if (referentFieldList[i].split('　').length === 1) return true;
                  const referentField = sourceFieldList.find((x) => x.code === referentFieldList[i].split('　')[0]);
                  if (referentField0.type !== referentField.type) return true;
                }
              } else {
                if (referentFieldList[i]) {
                  if (referentFieldList[i].split('　').length === 2) {
                    const referentField = sourceFieldList.find((x) => x.code === referentFieldList[i].split('　')[0]);
                    if (referentField.type === 'SUBTABLE') return true;
                  }
                }
              }
            }
          }
        }
      }
      return false;
    },


    /************************************************
     * [保存・キャンセルボタンクリック時イベント処理関数]
     ***********************************************/
    buttonClickEvent: function () {

      //[保存ボタンクリック時イベント]
      obj.$submit.on('click', async function (e) {
        e.preventDefault();

        let flag = false;//未入力があればtrue(保存させない)

        //入力フィールド、検索フィールド、または両方にに値があるかのflag（値があればtrue）
        let f1 = false ,f2 = false,f3 = false,f4 = false,f5 = false,f6 = false,l1 = true,l2 = true,l3 = true;

        const value = obj.submit();

        //未入力チェック
        value.settings.forEach((x) => {
          
          if(!x.appId){obj.displayAlert('エラー', '関連付けるアプリが選択されていません。', 'error', 'OK');flag = true;return false;}

          f1 = false ,f2 = false,f3 = false,f4 = false,f5 = false,f6 = false,l1 = true,l2 = true,l3 = true
          if(x.inputFieldCode1){f1 = true;}
          if(x.searchFieldCode1){f2 = true;}
          if(x.inputFieldCode2){f3 = true;}
          if(x.searchFieldCode2){f4 = true;}
          if(x.inputFieldCode3){f5 = true;}
          if(x.searchFieldCode3){f6 = true;}
          if(!f1 && !f2){l1 = false}//一つ目の検索ワードが両方とも未選択ならfalse
          if(!f3 && !f4){l2 = false}//二つ目の検索ワードが両方とも未選択ならfalse
          if(!f5 && !f6){l3 = false}//三つ目の検索ワードが両方とも未選択ならfalse

          if(!f1 && f2 || !f1 && !f2){obj.displayAlert('エラー', '入力フィールド1が選択されていません。', 'error', 'OK');flag = true;return false;}
          if(f1 && !f2){obj.displayAlert('エラー', '検索先フィールド1が選択されていません。', 'error', 'OK');flag = true;return false;}
          if((!l1 && l2) || (!l1 && l3)){obj.displayAlert('エラー', '一つ目の検索ワードを開けないでください。', 'error', 'OK');flag = true;return false;}
          if(!f3 && f4){obj.displayAlert('エラー', '入力フィールド2が選択されていません。', 'error', 'OK');flag = true;return false;}
          if(f3 && !f4){obj.displayAlert('エラー', '検索先フィールド2が選択されていません。', 'error', 'OK');flag = true;return false;}
          if((!l2 && l3)){obj.displayAlert('エラー', '二つ目の検索ワードを開けないでください。', 'error', 'OK');flag = true;return false;}
          if(!f5 && f6){obj.displayAlert('エラー', '入力フィールド3が選択されていません。', 'error', 'OK');flag = true;return false;}
          if(f5 && !f6){obj.displayAlert('エラー', '検索先フィールド3が選択されていません。', 'error', 'OK');flag = true;return false;}
          
          x.copyFieldList.forEach((y,i) => {
            
            if(i == 0 && (!y.destinationField || !y.sourceField)){
              if(!y.destinationField){obj.displayAlert('エラー', 'コピー先が選択されていません。', 'error', 'OK');flag = true;return false;}
              if(!y.sourceField){obj.displayAlert('エラー', 'コピー元が選択されていません。', 'error', 'OK');flag = true;return false;}
            }

            if(i != 0 && !(y.destinationField == "" && y.sourceField == "")){
              if(!y.destinationField){obj.displayAlert('エラー', 'コピー先が選択されていません。', 'error', 'OK');flag = true;return false;}
              if(!y.sourceField){obj.displayAlert('エラー', 'コピー元が選択されていません。', 'error', 'OK');flag = true;return false;
            }
                          }
            })
        })

         //未入力があれば、保存させない
        if(flag == true){return false}
        
        if (obj.dupCheck(value)) {
          obj.displayAlert('エラー', '選択されたコピー先フィールドが重複しています。', 'error', 'OK');
          return false;
        }
        if (await obj.unificationCheck(value)) {
          obj.displayAlert('エラー', '入力フィールドとコピー先、検索フィールドとコピー元を、それぞれテーブル外または同テーブル内フィールドで統一してください。', 'error', 'OK');
          return false;
        }

        //[文字列に変換]
        value.settings = JSON.stringify(value.settings);

        kintone.plugin.app.setConfig(value);
      });

      //[キャンセルボタンクリック時イベント]
      obj.$cancelButton.on('click', function () {
        window.location.href = '../../' + kintone.app.getId() + '/plugin/';
      });
    },

    checkCertificationFile: function () {
      if (typeof KNTP679310certification === 'function') {
        return true;
      } else {
        return false;
      }
    },


  };

  //[関数実行]
  obj.configShow(obj.config);

})(jQuery, kintone.$PLUGIN_ID);
