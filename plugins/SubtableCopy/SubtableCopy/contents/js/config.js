// Copyright (C) All in one Allright Reserved. 


jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  const $submit = $('#submit');
  const $cancelButton = $('.js-cancel-button');
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);


  const obj = {};
  const allFieldData = {};

  /********************************************
   * [プラグイン設定保存処理関数]
   * @returns [プラグイン保存設定内容オブジェクト]
   ********************************************/
  obj.submit = function () {
    const value = {
      settings: [],
    };
    for (let i = 0, length = $('.main-contents').length; i < length; i++) {
      const mainContents = $('.main-contents').eq(i);
      const item = {
        appId: $('.apps')[i].value,
        destinationTable: $('.destination-table')[i].value,
        sourceTable: $('.source-table')[i].value,
        fields: []
      };

      const copyContentsRowLength = mainContents.find('.copy-contents-row').length;
      for (let j = 0; j < copyContentsRowLength; j++) {
        const copyContentsRow = mainContents.find('.copy-contents-row').eq(j);

        const copyField = {
          destinationField: copyContentsRow.find('.destination-field').val(),
          sourceField: copyContentsRow.find('.source-field').val()
        };

        item.fields.push(copyField);
      }
      value.settings.push(item);

    }
    return value;
  };

  /**********************************************************
   * [プラグイン設定画面表示時処理関数]
   * @param {object} config [プラグイン保存設定内容オブジェクト]
   **********************************************************/

  obj.config = async function (config) {

    const that = this;


    if (!(await that.checkCertificationFile())) {
      that.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
      return;
    } else {
      if (!(await KNTP183610certification())) {
        return;
      }
    }

    that.buttonClickEvent();
    that.rowButtonClickEvent();
    that.childRowButtonClickEvent();
    that.appsDropDownChangeEvent();
    that.changeEvent();

    const allAppsList = await that.getAllApps();
    const destinationFieldList = await that.getFieldList(kintone.app.getId());
    const tableList = that.filterField(destinationFieldList, true, 'SUBTABLE');

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
    });

    that.createOption(tableList, $('.destination-table'));


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

        for (let j = 1, len = settings[i].fields.length; j < len; j++) {
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
        if (appId && appId !== '') {
          const fieldList = await that.getFieldList(appId);
          const tableList = that.filterField(fieldList, true, 'SUBTABLE');
          that.createOption(tableList, mainContents.find('.source-table'));

          //[設定された値を反映]
          mainContents.find('.destination-table').val(settings[i].destinationTable);
          mainContents.find('.source-table').val(settings[i].sourceTable);

          for (let j = 0, len = settings[i].fields.length; j < len; j++) {
            const sourceList = that.getSourceTableList(fieldList, settings[i].sourceTable);
            that.createOption(sourceList, mainContents.find('.copy-contents-row').eq(j).find('.source-field'));
            mainContents.find('.copy-contents-row').eq(j).find('.source-field').val(settings[i].fields[j].sourceField);
            const source = mainContents.find('.copy-contents-row').eq(j).find('.destination-field').val();
            if (source && source !== '') {
              const type = sourceList.find((x) => x.code === settings[i].fields[j].sourceField).type;
              var destinationList = that.getDestinationTableList(destinationFieldList, settings[i].destinationTable, type);
            } else {
              var destinationList = that.getSourceTableList(destinationFieldList, settings[i].destinationTable);
            }

            that.createOption(destinationList, mainContents.find('.copy-contents-row').eq(j).find('.destination-field'));
            mainContents.find('.copy-contents-row').eq(j).find('.destination-field').val(settings[i].fields[j].destinationField);
          }

        }
      }

      // that.search();
      that.adjustDis();

      //[プラグイン設定が保存されていない場合の処理]
    } else {

      const list = [];
      that.createOption(list, $('.source-field'));
      that.createOption(list, $('.destination-field'));

      const appId = $('.apps').val();
      if (appId && appId !== '') {
        const fieldList = await that.getFieldList(appId);
        const tableList = that.filterField(fieldList, true, 'SUBTABLE');
        that.createOption(tableList, $('.source-table'));
      } else {
        that.createOption(list, $('.source-table'));
      }

      // that.search();
      that.adjustDis();

    }
    $('#parent').sortable();

    // that.search();
    that.adjustDis();
    await that.createNewOption();
  };


  /*****************************************
     * [アプリリストドロップダウン選択時イベント] 
     ****************************************/
  obj.appsDropDownChangeEvent = function () {
    $(document).on('change', '.apps', async function () {
      var scrollPosition = window.scrollY;
      const appId = $(this).val();

      //[ドロップダウンのオプション削除]
      $(this).closest('.main-contents').find('.source-table').find('option').remove();
      $(this).closest('.main-contents').find('.source-field').find('option').remove();

      if (appId && appId !== '') {
        const fieldList = await obj.getFieldList(appId);
        const searchFieldList = obj.filterField(fieldList, true, 'SUBTABLE');

        //[ドロップダウンにオプション追加]
        obj.createOption(searchFieldList, $(this).closest('.main-contents').find('.source-table'));
      } else {
        obj.createOption([], $(this).closest('.main-contents').find('.source-table'));
      }

      // obj.search();
      obj.adjustDis();
      window.scrollTo(0, scrollPosition);
    });
  },

    obj.changeEvent = function () {
      let that = this;

      $(document).on('change', '.source-table', async function () {
        var scrollPosition = window.scrollY;
        const table = $(this).val();
        const appId = $(this).closest('.main-contents').find('.apps').val();

        //[ドロップダウンのオプション削除]
        $(this).closest('.main-contents').find('.source-field').find('option').remove();

        if (table) {
          if (appId && appId !== '') {
            const fieldList = await obj.getFieldList(appId);
            const copyFieldList = obj.getSourceTableList(fieldList, table);
            obj.createOption(copyFieldList, $(this).closest('.main-contents').find('.source-field'));
          }
        } else {
          obj.createOption([], $(this).closest('.main-contents').find('.source-field'));
        }


        obj.adjustDis();
        window.scrollTo(0, scrollPosition);
      });

      $(document).on('change', '.source-field', async function () {
        var scrollPosition = window.scrollY;
        await obj.createNewOption();
        obj.adjustDis();
        window.scrollTo(0, scrollPosition);
      });


      $(document).on('change', '.destination-table', async function () {
        var scrollPositionY = window.scrollY;
        var scrollPositionX = window.scrollX;
        await that.createNewOption();
        //that.search();
        that.adjustDis();
        window.scrollTo(scrollPositionX, scrollPositionY);

      });

      $(document).on('change', '.destination-field', async function () {
        var scrollPositionY = window.scrollY;
        var scrollPositionX = window.scrollX;
        await that.createNewOption();
        that.adjustDis();
        window.scrollTo(scrollPositionX, scrollPositionY);
      });

    }

  obj.createNewOption = async function () {
    let that = this;
    let array1 = [];

    const destinationFieldList = await that.getFieldList(kintone.app.getId());
    const tableList = that.filterField(destinationFieldList, true, 'SUBTABLE');

    // const tableList = await that.getFieldList(kintone.app.getId(), false);
    $('.main-contents').each(function () {
      array1.push($(this).find('.destination-table').val());
      $(this).find('.copy-contents-row').each(function () {
        array1.push($(this).find('.destination-field').val());
      });
    });

    await Promise.all($('.main-contents').map(async function () {
      const dTabel = $(this).find('.destination-table').val();
      const newOptions = tableList.filter(x => !array1.includes(x.code) || x.code === dTabel);
      $(this).find('.destination-table').empty();
      that.createOption(newOptions, $(this).find('.destination-table'));
      $(this).find('.destination-table').val(dTabel);
      let dList = [];
      if (dTabel && dTabel !== '') {
        const fieldList = await that.getFieldList(kintone.app.getId(), true, dTabel);
        const copyFieldList = obj.getSourceTableList(fieldList, dTabel);
        dList = that.filterField(copyFieldList, false, 'HR', 'LABEL', 'SPACER', 'REFERENCE_TABLE', 'GROUP', 'SUBTABLE');
      }

      const sTable = $(this).find('.source-table').val();
      const appId = $(this).find('.apps').val();
      let sList = [];
      if (appId && appId !== '') {
        if (sTable && sTable !== '') {
          const fieldList = await that.getFormFieldArray(appId, true, sTable);
          sList = that.filterField(fieldList, false, 'HR', 'LABEL', 'SPACER', 'REFERENCE_TABLE', 'GROUP', 'SUBTABLE');
        }
      }

      $(this).find('.copy-contents-row').each(function () {
        const val1 = $(this).find('.destination-field').val();
        let newOption1 = dList.filter(x => !array1.includes(x.code) || x.code === val1);
        const type = $(this).find('.source-field option:selected').attr('type');
        if (type) newOption1 = that.filterField(newOption1, true, type);
        $(this).find('.destination-field').empty();
        that.createOption(newOption1, $(this).find('.destination-field'));
        $(this).find('.destination-field').val(val1);
      })

    }).get());
  };

  obj.adjustDis = function () {
    obj.search();
    $('.main-contents').each(function () {
      let aLen = $(this).find('.apps option:selected').text().length;
      aLen = aLen * 17 + 20;
      if (aLen < 290) aLen = 290;
      let lLen = obj.getLeftLength($(this));
      let rLen = obj.getRightLength($(this));
      lLen = lLen * 17 + 20;
      rLen = rLen * 17 + 20;
      if (lLen < 290) lLen = 290;
      if (rLen < 290) rLen = 290;
      obj.setLeftLength($(this), lLen);
      obj.setRightLength($(this), rLen);
      $(this).find('.app-container').find('.select2-selection--single').css('width', aLen + 'px');
      $(this).find('.app-container').find('.select2-selection__arrow').css('left', aLen - 30 + 'px');
      let maxLen = aLen;
      if (aLen < lLen + rLen + 220) maxLen = lLen + rLen + 220;
      if (maxLen < 850) maxLen = 850;
      $(this).css('width', maxLen + 'px');

    });
  }

  obj.getLeftLength = function (name) {
    let maxLen = name.find('.destination-table').find('option:selected').text().length;

    name.find('.copy-contents-row').each(function () {
      let len2 = $(this).find('.destination-field option:selected').text().length;
      if (len2 > maxLen) maxLen = len2;

    });

    return maxLen;
  },

    obj.getRightLength = function (name) {
      let maxLen = name.find('.source-table').find('option:selected').text().length;

      name.find('.copy-contents-row').each(function () {
        let len2 = $(this).find('.source-field option:selected').text().length;
        if (len2 > maxLen) maxLen = len2;
      });
      return maxLen;
    },

    obj.setLeftLength = function (name, len) {
      name.find('.left-container').find('.select2-selection--single').css('width', len + 'px');
      name.find('.left-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      name.find('.left-container').css('width', len + 30 + 'px');
      name.find('.left-label').css('width', len + 110 + 'px');
    },

    obj.setRightLength = function (name, len) {
      name.find('.right-container').find('.select2-selection--single').css('width', len + 'px');
      name.find('.right-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      name.find('.right-container').css('width', len + 5 + 'px');
    },

    obj.getSourceTableList = function (fieldList, code) {
      const list = [];
      fieldList.forEach((x) => {
        if (x.type !== 'SUBTABLE' && x.code.split('　')[0] === code)
          list.push(x);
      });
      return list;
    };

  obj.getDestinationTableList = function (fieldList, code, type) {
    const list = [];
    fieldList.forEach((x) => {
      if (x.type === type && x.code.split('　')[0] === code)
        list.push(x);
    });
    return list;
  };

  obj.getFormFieldArray = async function (appId, subTable = false, name = '') {
    const fieldList = [];
    try {
      const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
        app: appId,
      });
      resp.layout.forEach((row) => {
        if (row.type === 'SUBTABLE') {
          fieldList.push(row);
          if (!subTable) return;
          if (row.code === name) {
            row.fields.forEach((field) => {
              const fieldInfo = {
                type: field.type,
                code: `${row.code}　${field.code}`,
                id: '',
              };
              fieldList.push(fieldInfo);
            });
          }
        }
      });
    } catch { }
    return fieldList;
  }

  /************************************************
 * [指定したフィールドを抽出する関数]
 * @param {Array}   フィルターをかけるフィールドリスト
 * @param {boolean} 指定したフィールドタイプを抽出 true   以外を抽出 false
 * @param {Array}   抽出するフィールドタイプリスト
 * @returns [第二引数がtrueなら指定したフィールドタイプのフィールドリスト 
 *                    falseなら指定したフィールドタイプ以外のフィールドリスト] 
 ************************************************/
  obj.filterField = function (fieldList, flg, ...limitFieldType) {
    if (!limitFieldType.length) return fieldList;
    if (flg) return fieldList.filter(x => limitFieldType.includes(x.type));
    else return fieldList.filter(x => !limitFieldType.includes(x.type));
  };



  /***********************************************
     * [オプション作成処理関数]
     * @param {Array}  fields [フィールドリスト]
     * @param {jQuery} name   [クラス・ID名]
     ***********************************************/
  obj.createOption = function (fields, name) {
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
          type: field.type
        });
        name.append(option);
      } else {
        const option = $('<option>', {
          value: field.elementId,
          text: field.elementId,
          type: field.type
        });
        name.append(option);
      }
    });
  };

  /***************************************
  * [ドロップダウンに検索機能追加・CSS追加]
  **************************************/
  obj.search = function () {
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

  };

  /*************************************
   * [追加・削除ボタンクリック時の処理関数]
   ************************************/
  obj.rowButtonClickEvent = function () {
    const that = this;
    //[追加ボタンクリック時の処理]
    $(document).on('click', '.add-row', async function () {
      $('.apps').select2('destroy');
      $('.destination-table').select2('destroy');
      $('.source-table').select2('destroy');
      $('.destination-field').select2('destroy');
      $('.source-field').select2('destroy');

      const clone = $('.main-contents:first').clone(true);
      //[フィールドのコピーの設定数を初期化]
      for (let i = 1, len = clone.find('.copy-contents-row').length; i < len; i++) {
        clone.find('.copy-contents-row').eq(0).remove();
      }

      //[検索先フィールド・コピー元ドロップダウンのオプション初期化]
      const appId = clone.find('.apps').val();

      //[ドロップダウンのオプション削除]
      clone.find('.source-table').find('option').remove();
      clone.find('.source-field').find('option').remove();
      clone.find('.destination-field').find('option').remove();

      if (appId && appId !== '') {
        const fieldList = await that.getFieldList(appId);
        const searchFieldList = that.filterField(fieldList, true, ...obj.searchFieldTypeList);
        //const copyFieldList = that.filterField(fieldList, false, ...obj.copyFieldTypeList);
        //[ドロップダウンにオプション追加]
        obj.createOption(searchFieldList, clone.find('.source-table'));
        obj.createOption([], clone.find('.source-field'));
      } else {
        obj.createOption([], clone.find('.source-table'));
        obj.createOption([], clone.find('.source-field'));
        obj.createOption([], clone.find('.destination-field'));
      }

      $(this).closest('.main-contents').after(clone);


      // that.search();
      that.adjustDis();
      await that.createNewOption();
    });

    //[削除ボタンクリック時の処理]
    $(document).on('click', '.remove-row', async function () {
      if ($('.main-contents').length > 1) $(this).closest('.main-contents').remove();
      obj.adjustDis();
      await obj.createNewOption();
    });
  };

  obj.childRowButtonClickEvent = function () {
    //[追加ボタンクリック時の処理]
    $(document).on('click', '.add-child-row', async function () {
      $('.destination-field').select2('destroy');
      $('.source-field').select2('destroy');
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
  };


  /*************************************************
    * 自アプリフォームのフィールドリストを取得する
    * @param {boolean} subTable [サブテーブル内も取得する場合true しない場合は実引数を入力しない]
    * @returns [自アプリフォームの左上から順番にフィールド取得]
    ************************************************/
  obj.getFieldList = async function (appId) {
    if (appId in allFieldData) return allFieldData[appId];
    const fieldList = [];
    try {
      const resp = await kintone.api('/k/v1/app/form/layout.json', 'GET', { app: appId });
      resp.layout.forEach(row => {
        if (row.type === 'SUBTABLE') {
          fieldList.push(row);
          row.fields.forEach(field => {
            const fieldInfo = {
              type: field.type,
              code: `${row.code}　${field.code}`,
            };
            fieldList.push(fieldInfo);
          })
        }
      })
    } catch { }
    allFieldData[appId] = fieldList;
    return fieldList;
  };


  /**************************
     * [全てのアプリを取得する]
     * @returns [全アプリリスト]
     **************************/
  obj.getAllApps = async function (offset = 0, appList = []) {
    const client = new KintoneRestAPIClient();
    try {
      const resp = await client.app.getApps({ offset });
      appList.push(...resp.apps);
      if (resp.apps.length === 100)
        return obj.getAllApps(offset + 100, appList);
    } catch { }
    return appList;
  };


  /***********************************************************
  * [重複チェック処理関数]
  * @param {array} value [重複チェックを行う配列]
  * @returns [重複している場合true　していない場合falseを返す]
  **********************************************************/
  obj.dupCheck = function (value) {
    let flag = false;
    const array1 = [];
    const array2 = [];
    const array3 = [];

    value.settings.forEach(setting => {
      if (setting.destinationTable !== '' && setting.sourceTable !== '') {
        array1.push(setting.destinationTable);
        let str = setting.sourceTable + setting.destinationTable;
        array1.push(str);
      }
      setting.fields.forEach(field => {
        if (field.sourceField !== '') array2.push(field.sourceField);
        if (field.destinationField !== '') array3.push(field.destinationField);
      });
      const b = new Set(array2);
      if (b.size !== array2.length) flag = true;

      const c = new Set(array3);
      if (c.size !== array3.length) flag = true;

    });

    const a = new Set(array1);
    if (a.size !== array1.length) flag = true;

    return flag;
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


  obj.buttonClickEvent = function () {
    const that = this;

    //[保存ボタンクリック時イベント]
    $submit.on('click', function (e) {
      e.preventDefault();

      const value = that.submit();
      let flag = false;//未入力flag、trueの時は、保存させない

      //[未入力チェック]
      value.settings.forEach((x) => {
        if(x.appId == ""){that.displayAlert('エラー', 'コピー元アプリが選択されていません。', 'error', 'OK');flag=true;return false;}
        if(x.destinationTable == ""){that.displayAlert('エラー', 'コピー先テーブルが選択されていません。', 'error', 'OK');flag=true;return false;}
        if(x.sourceTable == ""){that.displayAlert('エラー', 'コピー元テーブルが選択されていません。', 'error', 'OK');flag=true;return false;}
          x.fields.forEach((y) => {
            if(y.destinationField == ""){that.displayAlert('エラー', 'コピー先テーブル内フィールドが選択されていません。', 'error', 'OK');flag=true;return false;}
            if(y.sourceField == ""){that.displayAlert('エラー', 'コピー元テーブル内フィールドが選択されていません。', 'error', 'OK');flag=true;return false;}
          })
        }
      )

      if(flag){return false;}

      if (that.dupCheck(value)) {
        that.displayAlert('エラー', '選択されたフィールドが重複しています。', 'error', 'OK');
        return false;
      }
      //[文字列に変換]
      value.settings = JSON.stringify(value.settings);

      kintone.plugin.app.setConfig(value);
    });

    //[キャンセルボタンクリック時イベント]
    $cancelButton.on('click', function () {
      window.location.href = '../../' + kintone.app.getId() + '/plugin/';
    });
  };

  obj.checkCertificationFile = async function () {
    if (typeof KNTP183610certification === 'function') {
      return true;
    } else {
      return false;
    }
  };

  //[関数実行]
  obj.config(config);


})(jQuery, kintone.$PLUGIN_ID);
