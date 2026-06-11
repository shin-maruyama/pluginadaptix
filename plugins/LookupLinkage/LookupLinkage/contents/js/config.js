// Copyright (C) All in one Allright Reserved. 


jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  const $submit = $('#submit');
  const $cancelButton = $('.js-cancel-button');
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);


  const obj = {};
  obj.lookupFieldList = [];
  obj.destinationFieldList = [];
  obj.sourceFieldList = [];

  /********************************************
   * [プラグイン設定保存処理関数]
   * @returns [プラグイン保存設定内容オブジェクト]
   ********************************************/
  obj.submit = function () {
    const mainContents = $('.main-contents');
    const value = {
      lookupField: {
        code: mainContents.find('.look-up').val().split(' ')[0],
        key: mainContents.find('.look-up').val().split(' ')[2],
        appId: mainContents.find('.look-up').val().split(' ')[1],
        id: mainContents.find('.look-up').val().split(' ')[3],
        copyField: mainContents.find('.look-up').val().split(' ')[4],
      },

      fields: [],
      isTable: $('.table-check').prop('checked'),
    };

    const copyContentsRowLength = mainContents.find('.copy-contents-row').length;
    for (let j = 0; j < copyContentsRowLength; j++) {
      const copyContentsRow = mainContents.find('.copy-contents-row').eq(j);

      const copyField = {
        destinationField: copyContentsRow.find('.destination-field').val(),
        sourceField: copyContentsRow.find('.source-field').val()
      };

      value.fields.push(copyField);
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
      if (!(await KNTP295210certification())) {
        return;
      }
    }

    that.buttonClickEvent();
    that.childRowButtonClickEvent();
    that.appsDropDownChangeEvent();

    obj.lookupFieldList = await obj.getFormFieldArray(kintone.app.getId());

    if (Object.keys(config).length) {
      //[JSON型に変換]
      config.lookupField = JSON.parse(config.lookupField);
      config.fields = JSON.parse(config.fields);
      config.isTable = JSON.parse(config.isTable);

      obj.destinationFieldList = await that.getFieldList(kintone.app.getId(), false);
      const lookList = that.filterField(obj.destinationFieldList, true, 'LOOKUP');
      that.createOption(lookList, $('.look-up'));

      const mainContents = $('.main-contents');

      for (let j = 1, len = config.fields.length; j < len; j++) {
        const clone = mainContents.find('.copy-contents-row:first').clone(true);
        mainContents.find('.copy-contents').append(clone);
      }

      mainContents.find('.look-up').val(`${config.lookupField.code} ${config.lookupField.appId} ${config.lookupField.key} ${config.lookupField.id} ${config.lookupField.copyField}`);

      //[検索先フィールド・コピー元ドロップダウンにオプション追加]
      const appId = config.lookupField.appId;
      if (appId && appId !== '') {
        obj.sourceFieldList = await that.getFieldList(appId, false);
        let sourceList = that.filterField(
          obj.sourceFieldList,
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
          'GROUP',
          'LOOKUP',
          'RICH_TEXT'
        );

        if(config.isTable){sourceList = sourceList.filter(obj => !("id" in obj))}

        for (let j = 0, len = config.fields.length; j < len; j++) {
          that.createOption(sourceList, mainContents.find('.copy-contents-row').eq(j).find('.source-field'));
          mainContents.find('.copy-contents-row').eq(j).find('.source-field').val(config.fields[j].sourceField);
          const source = mainContents.find('.copy-contents-row').eq(j).find('.source-field').val();
          if (source && source !== '') {
            const type = sourceList.find((x) => x.code === config.fields[j].sourceField).type;
            var destinationList = that.filterField(obj.destinationFieldList, true, type);
          } else {
            var destinationList = that.filterField(
              obj.sourceFieldList,
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
              'GROUP',
              'LOOKUP',
              'RICH_TEXT'
            );
          }

          that.createOption(destinationList, mainContents.find('.copy-contents-row').eq(j).find('.destination-field'));
          mainContents.find('.copy-contents-row').eq(j).find('.destination-field').val(config.fields[j].destinationField);
        }

        //サブテーブルのみ表示がtrueで保存された場合、チェックボックスに、チェックをつける。
        if(config.isTable == true){$(".table-check").prop('checked', true)}
      }

      //}
      await obj.createNewOption();
      //that.search();
      that.adjustDis();


      //[プラグイン設定が保存されていない場合の処理]
    } else {

      obj.destinationFieldList = await that.getFieldList(kintone.app.getId());
      const lookList = that.filterField(obj.destinationFieldList, true, 'LOOKUP');
      that.createOption(lookList, $('.look-up'));

      const destinationList = obj.filterField(
        obj.destinationFieldList,
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
        'GROUP',
        'LOOKUP',
        'RICH_TEXT'
      );
      that.createOption(destinationList, $('.destination-field'));
      that.createOption([], $('.source-field'));


      that.search();
      //that.adjustDis();
    }


  };


  /*****************************************
     * [アプリリストドロップダウン選択時イベント] 
     ****************************************/
  obj.appsDropDownChangeEvent = function () {
    $(document).on('change', '.look-up', async function () {

      var scrollPosition = window.scrollY;
      var lookupField = $(this).val().split(' ')[0];
      if (lookupField.split('　').length === 2) {
        lookupField = lookupField.split('　')[1];
      }
      const field = obj.lookupFieldList.find((x) => x.code === lookupField);
      $(this).closest('.main-contents').find('.source-field').find('option').remove();
      $(this).closest('.main-contents').find('.destination-field').find('option').remove();
      const isTable = $('.table-check').prop('checked');

      if (field) {
        const appId = field.lookup.relatedApp.app;
        if (appId && appId !== '') {
          obj.sourceFieldList = await obj.getFieldList(appId, isTable);
          const sourceList = obj.filterField(
            obj.sourceFieldList,
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
            'GROUP',
            'LOOKUP',
            'RICH_TEXT'
          );
          obj.createOption(sourceList, $(this).closest('.main-contents').find('.source-field'));
        } else {
          obj.createOption([], $(this).closest('.main-contents').find('.source-field'));
        }

      }

      //obj.search();
      obj.adjustDis();
      window.scrollTo(0, scrollPosition);
    });


    $(document).on('change', '.source-field', async function () {
      var scrollPosition = window.scrollY;
      await obj.createNewOption();
      //obj.search();
      obj.adjustDis();
      window.scrollTo(0, scrollPosition);
    });

    $(document).on('change', '.destination-field', async function () {
      await obj.createNewOption();
      obj.adjustDis();
    });

    $(document).on('change', '.table-check', async function () {
      const isTable = $(this).prop('checked');
      var lookupField = $(this).closest('.main-contents').find('.look-up').val().split(' ')[0];
      if (lookupField.split('　').length === 2) {
        lookupField = lookupField.split('　')[1];
      }
      const field = obj.lookupFieldList.find((x) => x.code === lookupField);
      if (field) {
        let sourceList = obj.filterField(
            obj.sourceFieldList,
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
            'GROUP',
            'LOOKUP',
            'RICH_TEXT'
          );
       
          if(isTable){sourceList = sourceList.filter(obj => !("id" in obj))}

          $('.copy-contents-row').each(function () {
            const val = $(this).find('.source-field').val();
            $(this).find('.source-field').empty();
            obj.createOption(sourceList, $(this).find('.source-field'));
            $(this).find('.source-field').val(val);
          })
      }

      let destinationList = obj.filterField(      
        obj.destinationFieldList,
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
        'GROUP',
        'LOOKUP',
        'RICH_TEXT'
      );

      if(isTable){destinationList = destinationList.filter(obj => !("id" in obj))}

      let array = [];
      $('.copy-contents-row').each(function () {
        array.push($(this).find('.destination-field').val());
      })

      $('.copy-contents-row').each(function () {
        const val = $(this).find('.destination-field').val();
        let newOptions = destinationList.filter(x => !array.includes(x.code) || x.code === val);
        if(isTable){newOptions = newOptions.filter(obj => !("id" in obj))}
        const type = $(this).find('.source-field option:selected').attr('type');
        newOptions = obj.filterField(newOptions, true, type);
        $(this).find('.destination-field').empty();
        obj.createOption(newOptions, $(this).find('.destination-field'));
        $(this).find('.destination-field').val(val);
      })

      //obj.search();
      obj.adjustDis();
    });

  },

    obj.createNewOption = async function () {
      let array = [];
      $('.left-container').each(function () {
        array.push($(this).find('.destination-field').val());
      })

      const isTable = $('.table-check').prop('checked');
      const destinationList = obj.filterField(
        obj.destinationFieldList,
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
        'GROUP',
        'LOOKUP',
        'RICH_TEXT'
      );

      $('.left-container').each(function () {
        const val = $(this).find('.destination-field').val();
        let newOptions = destinationList.filter(x => !array.includes(x.code) || x.code === val);
        const type = $(this).closest('.copy-contents-row').find('.source-field option:selected').attr('type');
        if (type) newOptions = obj.filterField(newOptions, true, type);
        if (!type) newOptions = [];
        if(isTable){newOptions = newOptions.filter(obj => !("id" in obj))}
        $(this).find('.destination-field').empty();
        obj.createOption(newOptions, $(this).find('.destination-field'));
        $(this).find('.destination-field').val(val);
      })

    },

    obj.adjustDis = function () {
      obj.search();
      let str1 = $('.main-contens').find('.look-up option:selected').text().length;
      let aLen = str1 * 17 + 20;
      if (aLen < 290) aLen = 290;
      $('.lookup-container').find('.select2-selection--single').css('width', aLen + 'px');
      $('.lookup-container').find('.select2-selection__arrow').css('left', aLen - 30 + 'px');
      $('.lookup-container').css('width', aLen + 5 + 'px');

      let str2 = 0;
      $('.left-container').each(function () {
        const str = $(this).find('.destination-field option:selected').text().length;
        if (str > str2) str2 = str;
      })
      let lLen = str2 * 17 + 20;
      if (lLen < 290) lLen = 290;
      $('.left-container').find('.select2-selection--single').css('width', lLen + 'px');
      $('.left-container').find('.select2-selection__arrow').css('left', lLen - 30 + 'px');
      $('.left-container').css('width', lLen + 30 + 'px');

      let str3 = 0;
      $('.right-container').each(function () {
        const str = $(this).find('.source-field option:selected').text().length;
        if (str > str3) str3 = str;
      });

      let rLen = str3 * 17 + 20;
      if (rLen < 290) rLen = 290;
      $('.right-container').find('.select2-selection--single').css('width', rLen + 'px');
      $('.right-container').find('.select2-selection__arrow').css('left', rLen - 30 + 'px');
      $('.right-container').css('width', rLen + 5 + 'px');

      let mLen = aLen;
      const len = lLen + 30 + 60 + rLen + 5 + 70 + 55;
      if (mLen < len) mLen = len;
      if (mLen < 800) mLen = 800;
      $('.main-contents').css('width', mLen + 'px');

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
      type:''
    });
    name.append(noneOption);

    fields.forEach(field => {
      if (field.type === 'LOOKUP') {
        const option = $('<option>', {
          value: `${field.code} ${field.appId} ${field.key} ${field.id} ${field.copyField}`,
          text: field.code,
        });
        name.append(option);
      } else {
        const option = $('<option>', {
          value: field.code,
          text: field.code,
          type:field.type,
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

  obj.getFormFieldArray = async function (appId) {
    // フォームのフィールドを取得
    try {
      const { properties } = await kintone.api(kintone.api.url('/k/v1/app/form/fields', true), 'GET', { app: appId });

      const propertiesWithLookup = [];

      Object.values(properties).forEach((property) => {
        if (property.hasOwnProperty('lookup')) {
          propertiesWithLookup.push(property);
        }
        if (property.type === 'SUBTABLE') {
          Object.values(property.fields).forEach((subField) => {
            if (subField.hasOwnProperty('lookup')) {
              propertiesWithLookup.push(subField);
            }
          });
        }
      });

      return propertiesWithLookup;
    } catch {
      return [];
    }

  }


  obj.childRowButtonClickEvent = function () {
    //[追加ボタンクリック時の処理]
    $(document).on('click', '.add-child-row',async function () {
      $('.destination-field').select2('destroy');
      $('.source-field').select2('destroy');
      const clone = $(this).closest('.copy-contents-row').clone(true);
      $(this).closest('.copy-contents-row').after(clone);
      //obj.search();
      await obj.createNewOption();
      obj.adjustDis();
    });

    //[削除ボタンクリック時の処理]
    $(document).on('click', '.remove-child-row',async function () {
      if ($(this).closest('.copy-contents').find('.copy-contents-row').length > 1) {
        $(this).closest('.copy-contents-row').remove();
      }
      await obj.createNewOption();
      obj.adjustDis();
    });
  };


  /*************************************************
    * 自アプリフォームのフィールドリストを取得する
    * @param {boolean} subTable [サブテーブル内も取得する場合true しない場合は実引数を入力しない]
    * @returns [自アプリフォームの左上から順番にフィールド取得]
    ************************************************/
  obj.getFieldList = async function (appId, isTable = false) {
    const fieldList = [];
    const fieldList2 = [
      ...Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList),
      ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
    ];

    try {
      const lookupList = await obj.getFormFieldArray(appId);

      const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
        app: appId,
      });

      resp.layout.forEach((row) => {
        if (row.type === 'ROW') {
          row.fields.forEach((field) => {
            if (isTable) return;

            const matchingProperty = lookupList.find(prop => prop.code === field.code);
            if (matchingProperty) {
              fieldList.push({
                type: 'LOOKUP',
                code: field.code,
                id: field.id,
                appId: matchingProperty.lookup.relatedApp.app,
                key: matchingProperty.lookup.relatedKeyField,
                copyField: matchingProperty.lookup.fieldMappings.length > 0 ? matchingProperty.lookup.fieldMappings[0].field : '',
              });
            } else {
              fieldList.push({
                type: field.type,
                code: field.code,
                id: field.id,
              });
            }
          });
        } else if (row.type === 'SUBTABLE') {
          fieldList.push(row);
          row.fields.forEach((field) => {
            const matchingProperty = lookupList.find(prop => prop.code === field.code);
            if (matchingProperty) {
              const fieldInfo = {
                type: 'LOOKUP',
                code: `${row.code}　${field.code}`,
                appId: matchingProperty.lookup.relatedApp.app,
                key: matchingProperty.lookup.relatedKeyField,
                copyField: matchingProperty.lookup.fieldMappings.length > 0 ? matchingProperty.lookup.fieldMappings[0].field : '',
              };
              fieldList.push(fieldInfo);
            } else {
              const fieldInfo = {
                type: field.type,
                code: `${row.code}　${field.code}`,
              };
              fieldList.push(fieldInfo);
            }
          });
        } else if (row.type === 'GROUP') {
          if (isTable) return;

          fieldList.push(row);
          row.layout.forEach((childRow) => {
            childRow.fields.forEach((field) => {
              const matchingProperty = lookupList.find(prop => prop.code === field.code);
              if (matchingProperty) {
                fieldList.push({
                  type: 'LOOKUP',
                  code: `${row.code}　${field.code}`,
                  id: field.id,
                  appId: matchingProperty.lookup.relatedApp.app,
                  key: matchingProperty.lookup.relatedKeyField,
                  copyField: matchingProperty.lookup.fieldMappings.length > 0 ? matchingProperty.lookup.fieldMappings[0].field : '',
                });
              } else {
                fieldList.push({
                  type: field.type,
                  code: `${row.code}　${field.code}`,
                  id: field.id,
                });
              }
            });
          });
        }
      });

      // fieldList.forEach((field) => {
      //   if (field.code.split('　').length === 2 && field.type !== 'SUBTABLE') {
      //     var code = field.code.split('　')[1];
      //   } else {
      //     var code = field.code;
      //   }
      //   const target = fieldList2.find((x) => x.var === code);
      //   if (!target) return;

      //   field.id = target.id;
      //   field.properties = target.properties;
      //   field.label = target.label;

      //   if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
      //   field.fields.forEach((inField) => {
      //     const inTarget = Object.values(target.fieldList).find((x) => x.var === inField.code);
      //     inField.id = inTarget.id;
      //     inField.properties = inTarget.properties;
      //     inField.label = inTarget.label;
      //   });
      // });

    } catch (error) {
      console.error(error);

      return [];
    }

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
  * [未入力チェック処理関数]
  * @param {array} value [未入力チェックを行う配列]
  * @returns [未入力がある場合true　ない場合falseを返す]
  **********************************************************/
  obj.emptyCheck = function (value) {
    if(!value.lookupField.code) return true;

    let flag = false;

    value.fields.forEach(field => {
      if(!field.destinationField) flag = true;
      if(!field.sourceField) flag = true;
    });

    return flag;

  };

    /***********************************************************
     * [テーブル跨ぎチェック処理関数]
     * @param {array} value [保存設定内容]
     * @returns [テーブル跨ぎがある場合 true　ない場合 falseを返す]
     **********************************************************/
  obj.tableCheck = function (value) {
    const sTableList = [];
    obj.sourceFieldList.forEach(field => {
      if(field.type == "SUBTABLE") sTableList.push(field.code);
    });
    const dTableList = [];
    obj.destinationFieldList.forEach(field => {
      if(field.type == "SUBTABLE") dTableList.push(field.code);
    });

    let flag = false;
    value.fields.forEach(item => {
      const parts = item.sourceField.split('　');
      const partd = item.destinationField.split('　');
      const tables = parts.length == 2 ? parts[0] : '';
      const tabled = partd.length == 2 ? partd[0] : '';
      if (sTableList.includes(tables) != dTableList.includes(tabled)) flag = true;
    });
    
    return flag;
  };

  /***********************************************************
  * [重複チェック処理関数]
  * @param {array} value [重複チェックを行う配列]
  * @returns [重複している場合true　していない場合falseを返す]
  **********************************************************/
  obj.dupCheck = function (value) {
    const array = [];

    value.fields.forEach(field => {
      array.push(field.destinationField);
    });

    const a = new Set(array);
    return a.size !== array.length;

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

  /************************************************
   * [保存・キャンセルボタンクリック時イベント処理関数]
   ***********************************************/
  obj.buttonClickEvent = function () {
    const that = this;

    //[保存ボタンクリック時イベント]
    $submit.on('click', function (e) {
      e.preventDefault();

      const value = that.submit();

      if (that.emptyCheck(value)) {
        that.displayAlert('エラー', '選択されていないフィールドがあります。', 'error', 'OK');
        return false;
      }
      if (that.tableCheck(value)) {
        that.displayAlert('エラー', 'テーブル内からテーブル外へのコピー、またはその逆は出来ません。', 'error', 'OK');
        return false;
      }
      if (that.dupCheck(value)) {
        that.displayAlert('エラー', 'コピー先として選択されたフィールドが重複しています。', 'error', 'OK');
        return false;
      }
      
      //[文字列に変換]
      value.lookupField = JSON.stringify(value.lookupField);
      value.fields = JSON.stringify(value.fields);
      value.isTable = JSON.stringify(value.isTable);

      kintone.plugin.app.setConfig(value);
    });

    //[キャンセルボタンクリック時イベント]
    $cancelButton.on('click', function () {
      window.location.href = '../../' + kintone.app.getId() + '/plugin/';
    });
  };

  obj.checkCertificationFile = async function () {
    if (typeof KNTP295210certification === 'function') {
      return true;
    } else {
      return false;
    }
  };

  //[関数実行]
  obj.config(config);


})(jQuery, kintone.$PLUGIN_ID);
