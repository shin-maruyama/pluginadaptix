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
    filterFieldList: [],
    thisFieldList: [],
    thatFieldList: [],
    thatAppId: '',

    /********************************************
     * [プラグイン設定保存処理関数]
     * @returns [プラグイン保存設定内容オブジェクト]
     ********************************************/
    submit: function () {
      const value = {
        copyDestinationAppId: $('.app-select').val(),
        recordIdCopyField: $('.recordId-copy-field').val(),
        timing: $('.timing-select').val(),
        isNumberCheck: $('.isNumber').prop('checked'),
        numberSelect: $('.number-select').val(),
        digit: $('.digit').val(),
        copyField: [],
        conditionField: [],
        rewriteField: $('.rewrite-select').val(),
      };

      const conditionRowLength = $('.main-contents').find('.copy-condition-contents-row').length;
      for (let i = 0; i < conditionRowLength; i++) {
        const copyContentsRow = $('.main-contents').find('.copy-condition-contents-row').eq(i);

        const copyField = {
          sourceField: copyContentsRow.find('.copy-condition-source-field').val(),
          copyCond: copyContentsRow.find('.copy-cond').val(),
          condSelect: copyContentsRow.find('.cond-select') ? copyContentsRow.find('.cond-select').val() : '',
          dateSelect: copyContentsRow.find('.date-select') ? copyContentsRow.find('.date-select').val() : '',
          condType: copyContentsRow.find('.copy-condition-source-field option:selected').attr('type')
        };
        if(copyField.dateSelect){
          const year = parseInt(copyField.dateSelect.split('/')[0]);
          if(year > 9999) copyField.dateSelect = '';
        }

        value.conditionField.push(copyField);
      }

      const copyContentsRowLength = $('.main-contents').find('.copy-contents-row').length;
      for (let i = 0; i < copyContentsRowLength; i++) {
        const copyContentsRow = $('.main-contents').find('.copy-contents-row').eq(i);

        const copyField = {
          destinationField: copyContentsRow.find('.copy-destination-field').val(),
          sourceField: copyContentsRow.find('.copy-source-field').val()
        };

        value.copyField.push(copyField);
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
        if (!(await KNTP496810certification())) {
          return;
        }
      }

      obj.childRowButtonClickEvent();
      obj.buttonClickEvent();
      obj.appSelectChangeEvent();
      obj.sourceConditionSelectChangeEvent();
      obj.sourceCopySelectChangeEvent();
      obj.numberFieldValueCheck();

      /**
       * @param {Array} fieldList [フォームの左上から順のフィールドリスト]
       */
      obj.thisFieldList = await obj.getFieldList(kintone.app.getId());
      obj.filterFieldList = obj.filterField(obj.thisFieldList, false, 'HR', 'LABEL', 'SPACER', 'REFERENCE_TABLE', 'GROUP', 'SUBTABLE');
      const textAndNumberFieldList = obj.filterField2(obj.thisFieldList, 'SINGLE_LINE_TEXT', 'NUMBER');
      const checkboxList = obj.filterField2(obj.thisFieldList, 'CHECK_BOX');

      const apps = await obj.getAppList();

      //[ドロップダウンにオプション追加]
      for (const app of apps) {
        const $option = $('<option>', {
          text: `${app.appId} ${app.name}`,
          value: app.appId
        });
        $('.app-select').append($option);
      }

      //obj.createOption(obj.filterFieldList, $('.copy-condition-destination-field'));
      obj.createOption(obj.filterFieldList, $('.copy-destination-field'));
      obj.createOption(textAndNumberFieldList, $('.recordId-copy-field'));
      obj.createOption(textAndNumberFieldList, $('.number-select'));
      obj.createOption(checkboxList, $('.rewrite-select'));

      //await obj.designatedAppCreateOption();


      //[既にプラグイン設定が保存されている場合の処理]
      if (Object.keys(config).length) {
        //[JSON型に変換]
        config.copyField = JSON.parse(config.copyField);
        config.conditionField = JSON.parse(config.conditionField);
        config.isNumberCheck = JSON.parse(config.isNumberCheck);

        //console.log(config);


        $('.timing-select').val(config.timing);
        $('.app-select').val(config.copyDestinationAppId);
        $('.recordId-copy-field').val(config.recordIdCopyField);
        $('.number-select').val(config.numberSelect);
        $('.rewrite-select').val(config.rewriteField);
        $('.digit').val(config.digit);

        if (config.isNumberCheck) {
          $('.isNumber').prop('checked', true);
        } else {
          $('.isNumber').prop('checked', false);
        }


        await obj.designatedAppCreateOption();

        for (let i = 1; i < config.conditionField.length; i++) {
          const $clone = $('.copy-condition-contents-row:first').clone(true);
          $('.copy-condition-contents-row:first').after($clone);
        }


        //[保存した設定個数分クローン作成コピーフィールド(テーブル以外) *1つ目は既にあるので飛ばす]
        for (let i = 1; i < config.copyField.length; i++) {
          const $clone = $('.copy-contents-row:first').clone(true);
          $('.copy-contents-row:first').after($clone);
        }


        //[プラグイン保存設定反映コピーフィールド]
        for (let i = 0; i < config.conditionField.length; i++) {
          const $mainContent = $('.copy-condition-contents-row').eq(i);
          $mainContent.find('.copy-condition-source-field').val(config.conditionField[i].sourceField);
          const str = $mainContent.find('.copy-condition-source-field').val();
          const type = $mainContent.find('.copy-condition-source-field option:selected').attr('type');
          const appId = $('.app-select').val();
          if (!appId && appId === '') return;

          const $cond = $mainContent.find('.copy-cond');
          const $area = $mainContent.find('.blank-area');
          await obj.createCondOption(str, type, appId, $cond, $area);

          $mainContent.find('.copy-cond').val(config.conditionField[i].copyCond);
          if ($mainContent.find('.cond-select').length > 0) {
            $mainContent.find('.cond-select').val(config.conditionField[i].condSelect);
          }
          if ($mainContent.find('.date-select').length > 0) {
            $mainContent.find('.date-select').val(config.conditionField[i].dateSelect);
          }
        }


        for (let i = 0; i < config.copyField.length; i++) {
          const $mainContent = $('.copy-contents-row').eq(i);
          $mainContent.find('.copy-source-field').val(config.copyField[i].sourceField);
          const sourceFieldType = $mainContent.find('.copy-source-field option:selected').attr('type');

          $mainContent.find('.copy-destination-field').find('option').remove();
          if (sourceFieldType) {
            const filterList = obj.filterField(obj.filterFieldList, true, sourceFieldType);
            obj.createOption(filterList, $mainContent.find('.copy-destination-field'));
          } else {
            obj.createOption(obj.filterFieldList, $mainContent.find('.copy-destination-field'));
          }
          $mainContent.find('.copy-destination-field').val(config.copyField[i].destinationField);
        }



      }
      //obj.search();
      obj.adjustDis();
      await obj.createNewOption();
    },


    /*******************************
     * [コピー先アプリセレクト変更時]
     ******************************/
    appSelectChangeEvent: function () {
      $(document).on('change', '.app-select', async function () {
        $('.recordId-copy-field').val("");
        $('.timing-select').val("");
        $('.number-select').val("");
        $('.rewrite-select').val("");
        $('.cond-select').val("");
        $('.digit').val("");
        $('.copy-condition-source-field').val("");
        $('.copy-cond').val("");
        $('.copy-source-field').val("");
        $('.copy-destination-field').val("");
        $('.isNumber').prop("checked", false);

        obj.adjustDis();
        await obj.designatedAppCreateOption();
        await obj.createNewOption();
      });

    },


    /***********************************
     * [コピー元フィールド(テーブル以外)セレクト変更時]
     ***********************************/
    sourceConditionSelectChangeEvent: function () {
      $(document).on('change', '.copy-condition-source-field', async function () {
        //[コピー元と一致するオプションのみ表示する処理]
        const appId = $('.app-select').val();
        if (!appId && appId === '') return;
        const type = $(this).find("option:selected").attr('type');
        const str = $(this).val();

        const $cond = $(this).closest('.copy-condition-contents-row').find('.copy-cond');
        const $area = $(this).closest('.copy-condition-contents-row').find('.blank-area');
        const $cSelect = $(this).closest('.copy-condition-contents-row').find('.cond-select');
        const $dselect = $(this).closest('.copy-condition-contents-row').find('.date-select');

        obj.createCondOption(str, type, appId, $cond, $area, $cSelect, $dselect);
        //obj.search();
        obj.adjustDis();
        await obj.createNewOption();
      });

    },

    sourceCopySelectChangeEvent: function () {
      $(document).on('change', '.copy-source-field', async function () {
        
        //obj.search();
        obj.adjustDis();
        await obj.createNewOption();
      })

      $(document).on('change', '.recordId-copy-field,.number-select,.copy-destination-field,.rewrite-select', async function () {
        obj.adjustDis();
        await obj.createNewOption();
      });
    },


    createNewOption: async function () {
      let array1 = [];
      let array2 = [];
      const recordId = $('.recordId-copy-field').val();
      array1.push(recordId);
      $('.copy-condition-contents-row').each(function () {
        const val = $(this).find('.copy-condition-source-field').val();
        array2.push(val);
      });
      const number = $('.number-select').val();
      array1.push(number);
      const checkBox = $('.rewrite-select').val();
      array1.push(checkBox);
      $('.copy-contents-row').each(function () {
        const destination = $(this).find('.copy-destination-field').val();
        //const source = $(this).find('.copy-source-field').val();
        array1.push(destination);
        //array2.push(source);
      });
      const appId = $('.app-select').val();

      //console.log(array);

      const dNumberList = obj.filterField2(obj.thisFieldList, 'SINGLE_LINE_TEXT', 'NUMBER');
      const dFieldList = obj.filterField(obj.thisFieldList, false, 'HR', 'LABEL', 'SPACER', 'REFERENCE_TABLE', 'GROUP', 'SUBTABLE');
      const dCheckList = obj.filterField2(obj.thisFieldList, 'CHECK_BOX');
      const newOptions1 = dNumberList.filter(x => !array1.includes(x.code) || x.code === recordId);
      //レコード番号のコピー先フィールド
      $('.recordId-copy-field').empty();
      obj.createOption(newOptions1, $('.recordId-copy-field'));
      $('.recordId-copy-field').val(recordId);
      //採番フィールド
      $('.number-select').empty();
      const newOptions2 = dNumberList.filter(x => !array1.includes(x.code) || x.code === number);
      obj.createOption(newOptions2, $('.number-select'));
      $('.number-select').val(number);
      //上書き許可
      $('.rewrite-select').empty();
      const newOptions3 = dCheckList.filter(x => !array1.includes(x.code) || x.code === checkBox);
      obj.createOption(newOptions3, $('.rewrite-select'));
      $('.rewrite-select').val(checkBox);


      if (appId && appId !== '') {
        if (obj.thatAppId !== appId) {
          obj.thatFieldList = await obj.getFieldList(appId);
          obj.thatAppId = appId;
        }
        const sCondList = obj.filterField2(obj.thatFieldList, 'DATE', 'RADIO_BUTTON', 'DROP_DOWN');
        const sFieldList = obj.filterField(obj.thatFieldList, false, 'HR', 'LABEL', 'SPACER', 'REFERENCE_TABLE', 'GROUP', 'SUBTABLE');
        //同期条件フィールド
        $('.copy-condition-contents-row').each(function () {
          const val = $(this).find('.copy-condition-source-field').val();
          const newOption = sCondList.filter(x => !array2.includes(x.code) || x.code === val);
          $(this).find('.copy-condition-source-field').empty();
          obj.createOption(newOption, $(this).find('.copy-condition-source-field'));
          $(this).find('.copy-condition-source-field').val(val);
        });
        //同期フィールド コピー元
        // $('.copy-contents-row').each(function () {
        //   const val1 = $(this).find('.copy-source-field').val();
        //   const newOption = sFieldList.filter(x => !array2.includes(x.code) || x.code === val1);
        //   $(this).find('.copy-source-field').empty();
        //   obj.createOption(newOption, $(this).find('.copy-source-field'));
        //   $(this).find('.copy-source-field').val(val1);
        // });
      }

      //同期フィールド コピー先
      $('.copy-contents-row').each(function () {
        const val1 = $(this).find('.copy-destination-field').val();
        let newOption = dFieldList.filter(x => !array1.includes(x.code) || x.code === val1);
        const type = $(this).find('.copy-source-field option:selected').attr('type');
        if (type) newOption = obj.filterField(newOption, true, type);
        $(this).find('.copy-destination-field').empty();
        obj.createOption(newOption, $(this).find('.copy-destination-field'));
        $(this).find('.copy-destination-field').val(val1);
      });
    },

    /*************************************
     * 設定追加・削除ボタンクリック時の処理関数]
     ************************************/
    childRowButtonClickEvent: function () {
      //[追加ボタンクリック時の処理]
      $(document).on('click', '.add-field-row', async function () {
        $('.copy-destination-field').select2('destroy');
        $('.copy-source-field').select2('destroy');
        const clone = $(this).closest('.copy-contents-row').clone(true);
        clone.find('.copy-destination-field').find('option').remove();
        obj.createOption(obj.filterFieldList, clone.find('.copy-destination-field'));
        $(this).closest('.copy-contents-row').after(clone);
        //obj.search();
        obj.adjustDis();
        await obj.createNewOption();
      });

      //[削除ボタンクリック時の処理]
      $(document).on('click', '.remove-field-row', async function () {
        if ($(this).closest('.copy-contents').find('.copy-contents-row').length > 1) {
          $(this).closest('.copy-contents-row').remove();
        }
        obj.adjustDis();
        await obj.createNewOption();
      });

      //[追加ボタンクリック時の処理]
      $(document).on('click', '.add-condition-row', async function () {
        $('.copy-condition-source-field').select2('destroy');
        $('.copy-cond').select2('destroy');

        const clone = $(this).closest('.copy-condition-contents-row').clone(true);
        clone.find('.blank-area').empty().css('width', '');
        clone.find('.copy-cond').empty();
        $(this).closest('.copy-condition-contents-row').after(clone);
        obj.adjustDis();
        await obj.createNewOption();
      });

      //[削除ボタンクリック時の処理]
      $(document).on('click', '.remove-condition-row', async function () {
        if ($(this).closest('.copy-condition-contents').find('.copy-condition-contents-row').length > 1) {
          $(this).closest('.copy-condition-contents-row').remove();
        }
        obj.adjustDis();
        await obj.createNewOption();
      });
    },

    adjustDis: function () {
      obj.search();
      let lLen = obj.getLeftLength();
      let rLen = obj.getRightLength();
      lLen = lLen * 17 + 20;
      rLen = rLen * 17 + 20;
      if (lLen < 290) lLen = 290;
      if (rLen < 290) rLen = 290;
      obj.setLeftLength(lLen);
      obj.setRightLength(rLen);
      let mLen = obj.getMaxLength();
      if (mLen + 70 < 1000) mLen = 1000;
      $('.main-contents').css('width', mLen + 70 + 'px');
    },

    getLeftLength: function () {
      let maxLen = 0;
      let len1 = $('.app-select').find('option:selected').text().length;
      if (len1 > maxLen) maxLen = len1;
      let len2 = $('.timing-select').find('option:selected').text().length;
      if (len2 > maxLen) maxLen = len2;
      $('.copy-condition-contents-row').each(function () {
        let len3 = $(this).find('.copy-condition-source-field option:selected').text().length;
        if (len3 > maxLen) maxLen = len3;
      });
      let len4 = $('.rewrite-select').find('option:selected').text().length;
      if (len4 > maxLen) maxLen = len4;
      $('.copy-contents-row').each(function () {
        let len5 = $(this).find('.copy-destination-field option:selected').text().length;
        if (len5 > maxLen) maxLen = len5;
      })
      return maxLen;
    },

    getRightLength: function () {
      let maxLen = 0;
      let len1 = $('.recordId-copy-field').find('option:selected').text().length;
      if (len1 > maxLen) maxLen = len1;
      let len2 = $('.number-select').find('option:selected').text().length;
      if (len2 > maxLen) maxLen = len2;
      $('.copy-contents-row').each(function () {
        let len3 = $(this).find('.copy-source-field option:selected').text().length;
        if (len3 > maxLen) maxLen = len3;
      });
      return maxLen;
    },

    setLeftLength: function (len) {
      $('.left-container').find('.select2-selection--single').css('width', len + 'px');
      $('.left-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $('.left-container').css('width', len + 110 + 'px');
      $('.copy-container').find('.select2-selection--single').css('width', len + 'px');
      $('.copy-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $('.copy-container').css('width', len + 30 + 'px');
      $('.cond-container').find('.select2-selection--single').css('width', len + 'px');
      $('.cond-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $('.cond-container').css('width', len + 1 + 'px');
      $('.left-label').css('width', len + 110 + 'px');
    },

    setRightLength: function (len) {
      $('.right-container').find('.select2-selection--single').css('width', len + 'px');
      $('.right-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $('.right-container').css('width', len + 5 + 'px');
      $('.right-label').css('width', len + 5 + 'px');
    },

    getMaxLength: function () {
      let maxLen = 0;
      let len1 = $('.left-container').css('width');
      let len2 = $('.right-container').css('width');

      if (maxLen < parseInt(len1) + parseInt(len2) + 106) maxLen = parseInt(len1) + parseInt(len2) + 106;
      let len3 = parseInt(len1) - 109;
      //let len3 = $('.cond-container')[0].getBoundingClientRect().width;
      let len4 = $('.blank-area').css('width');
      if (maxLen < len3 + 291 + 291) maxLen = len3 + 291 + 291;

      return maxLen;
    },

    /**
     * [非表示ではなく、先頭のオプションのvalueを取得]
     * @param {jQuery} element 
     * @returns [非表示ではなく、先頭のオプションのvalue]
     */
    getFirstOption: function (element) {
      for (const option of element) {
        if ($(option).css('display') === 'none') continue;
        return $(option).val();
      }
      return '';
    },


    /*************************************************
     * [自アプリフォームのフィールドリストを取得する]
     * @param {boolean} subTable [サブテーブル内も取得する場合true しない場合false]
     * @returns [自アプリフォームの左上から順番にフィールド取得]
     ************************************************/
    getFieldList: async function (appId) {
      const fieldList = [];
      try {
        const resp = await callKintoneApi('/k/v1/app/form/layout.json', 'GET', { app: appId });
        resp.layout.forEach(row => {
          if (row.type === 'ROW') row.fields.forEach(field => fieldList.push(field));
          else if (row.type === 'SUBTABLE') {
            fieldList.push(row);
            //if (!subTable) return;
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
      return fieldList;
    },


    createCondOption: async function (str, type, appId, $cond, $area, $cSelect, $dselect) {
      let that = this;
      $cond.children('option').remove();
      if ($cSelect) {
        $cSelect.select2('destroy');
        $cSelect.remove();
      }
      if ($dselect) {
        $dselect.remove();
      }
      if (str === '') {
        $area.css('width', '');
        return;
      }
      if (type === 'DROP_DOWN' || type === 'RADIO_BUTTON') {
        const optionNull = $('<option>', {
          value: '',
          text: '',
        });
        $cond.append(optionNull);
        const option1 = $('<option>', {
          value: '1',
          text: '次のいずれかを含む',
        });
        $cond.append(option1);
        const option2 = $('<option>', {
          value: '2',
          text: '次のいずれも含まない',
        });
        $cond.append(option2);

        var newSelect = $('<select>', {
          class: 'cond-select select2'
        });

        const fieldList = await obj.getFormFieldArray(appId);

        let options = fieldList.find(x => x.code === obj.getCodePart(str)).options;


        //console.log(options);
        const option0 = $('<option>', {
          value: '',
          text: '',
        });
        newSelect.append(option0);
        Object.entries(options).forEach(([key, item]) => {
          const option = $('<option>', {
            value: item.label,
            text: item.label
          });
          //console.log(`Adding option: ${key} - ${item.label}`);
          newSelect.append(option);
        });


        //$('.blank-area').append(newSelect);
        $area.css('width', '291px').append(newSelect);
      } else if (type === 'DATE') {
        const option1 = $('<option>', {
          value: '1',
          text: '=（等しい）',
        });
        $cond.append(option1);
        const option2 = $('<option>', {
          value: '2',
          text: '≠（等しくない）',
        });
        $cond.append(option2);
        const option3 = $('<option>', {
          value: '3',
          text: '≤（以前）',
        });
        $cond.append(option3);
        const option4 = $('<option>', {
          value: '4',
          text: '<（より前）',
        });
        $cond.append(option4);
        const option5 = $('<option>', {
          value: '5',
          text: '≥（以降）',
        });
        $cond.append(option5);
        const option6 = $('<option>', {
          value: '6',
          text: '>（より後）',
        });
        $cond.append(option6);

        var newSelect = $('<input>', {
          class: 'date-select',
          type: 'date',
          style: 'width: 290px; height: 55px;margin-top:-3px;background-color: #f7f9fa;color: #34a3db;border:1px solid #e3e7e8;'
        });
        //$('.blank-area').append(newSelect);
        $area.css('width', '291px').append(newSelect);
      }
      //that.search();
      that.adjustDis();
    },


    /**********************************************
     * 指定したアプリのフィールドリストを取得する
     * @param  {String or Number} appId [アプリID]
     * @returns [フィールドリスト]
     *********************************************/
    // designatedAppGetFieldList: async function (appId) {
    //   const fieldList = [];

    //   const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', { app: appId });

    //   resp.layout.forEach(row => {
    //     if (row.type === 'ROW') row.fields.forEach(field => fieldList.push(field));
    //     else if (row.type === 'SUBTABLE') {
    //       fieldList.push(row);
    //     } else if (row.type === 'GROUP') {
    //       fieldList.push(row);
    //       row.layout.forEach(childRow => childRow.fields.forEach(field => fieldList.push(field)));
    //     };
    //   })
    //   return fieldList;
    // },


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

    /************************************************
     * [指定した種別の、テーブル外のフィールドを抽出する関数]
     * @param {Array}   fieldList      [フィルターをかけるフィールドリスト]
     * @param {Array}   limitFieldType [抽出するフィールドタイプリスト]
     * @returns [指定したフィールドタイプのフィールドリスト 
     ************************************************/
    filterField2: function (fieldList, ...limitFieldType) {
      if (!limitFieldType.length) return fieldList;
      const tableList = [];
      fieldList.forEach(field => {
        if(field.type == "SUBTABLE") tableList.push(field.code);
      });
      const retList = [];
      fieldList.forEach(field => {
        if(!field.code) return false;
        const parts = field.code.split('　');
        if (parts.length === 2 && tableList.includes(parts[0])) return false;
        if (limitFieldType.includes(field.type)) retList.push(field);
      });

      return retList;
    },

    /*************************************
     * [全アプリ取得]
     * @returns 全アプリの情報配列
     *************************************/
    getAppList: async function (offset = 0, limit = 100, apps = []) {
      const params = {
        'offset': offset,
        'limit': limit
      }

      const resp = await callKintoneApi(kintone.api.url('/k/v1/apps', true), 'GET', params);
      apps = apps.concat(resp.apps);
      if (resp.apps.length === limit) {
        return await obj.getAppList(offset + limit, limit, apps);
      }
      return apps;
    },

    getFormFieldArray: async function (appId) {
      try {
        const { properties } = await callKintoneApi(kintone.api.url('/k/v1/app/form/fields', true), 'GET', { app: appId });
        return Object.values(properties);
      } catch {
        return [];
      }
    },

    getCodePart: function (code) {
      const parts = code.split('　');
      return parts.length === 2 ? parts[1] : code;
    },


    /***************************************
     * [ドロップダウンに検索機能追加・CSS追加]
     **************************************/
    search: function () {
      $('.select2').select2({
        //width: '300px',
      }).on('select2:open', function (e) {
        const opnederDropdownId = $(this).prop("id")
        setTimeout(function () {
          var optionCount = $('.select2-results__option').length;
          if (optionCount > 5) {
            var newTop = 0;
          } else {
            var newTop = -40;
          }

          if(opnederDropdownId == "timing-select" || opnederDropdownId == "cond-select" || opnederDropdownId == "date-select"){
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
        'border-color': '#34a3db transparent transparent transparent',
      });
    },

     /**
  * [数値フィールドに、文字を入力する時にバリテーションチェックを行う。]
  */

  numberFieldValueCheck: function () {
    const that = this;
    $(document).on('blur','.digit', async function () {
      const reg = /^[1-9][0-9]*$/;
      if($(this).val() && !reg.test($(this).val())){$(this).val("");that.displayAlert('エラー', "1以上の整数を半角数字で入力してください。", 'error', 'OK')}
    })
  /**
   * [数値フィールドで、エンターキーを押した時のイベント(エラー画面に推移させない)。]
  */
    $(document).on('keydown',".digit",function(e){
      if(e.which == 13) {
        const reg = /^[1-9][0-9]*$/;
        if($(this).val() == ""){that.displayAlert('エラー', "空白は入力しないでください。", 'error', 'OK')}
        if($(this).val() && !reg.test($(this).val())){$(this).val("");that.displayAlert('エラー', "1以上の整数を半角数字で入力してください。", 'error', 'OK')}
        return false;
      }
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
        if (field.type === 'SPACER') {
          const $option = $('<option>', {
            value: field.elementId,
            text: field.elementId
          });
          name.append($option);
        } else if (field.type === 'SUBTABLE') {
          const $option = $('<option>', {
            value: field.code,
            text: field.code,
            type: field.type,
            fields: JSON.stringify(field.fields)
          });
          name.append($option);
        } else {
          const $option = $('<option>', {
            value: field.code,
            text: field.code,
            type: field.type,
          });
          name.append($option);
        }
      });
    },

    /**************************
     *相手アプリのフィールドを入れるドロップダウンを作成
     *************************/
    designatedAppCreateOption: async function () {
      $('.copy-condition-source-field').children('option').remove();
      $('.copy-source-field').children('option').remove();
      const appId = $('.app-select').val();
      //console.log(appId);
      if (appId !== '') {
        if (obj.thatAppId !== appId) {
          obj.thatFieldList = await obj.getFieldList(appId);
          obj.thatAppId = appId;
        }
        const filterDesignatedAppFieldList = obj.filterField(obj.thatFieldList, false, 'HR', 'LABEL', 'SPACER', 'REFERENCE_TABLE', 'GROUP', 'SUBTABLE');
        const sourceConditionList = obj.filterField2(obj.thatFieldList, 'DATE', 'RADIO_BUTTON', 'DROP_DOWN');
        //const filterDesignatedAppTableFieldList = obj.filterField(obj.thatFieldList, true, 'SUBTABLE');
        //console.log(sourceConditionList);
        obj.createOption(filterDesignatedAppFieldList, $('.copy-source-field'));
        obj.createOption(sourceConditionList, $('.copy-condition-source-field'));
      } else {
        obj.createOption([], $('.copy-source-field'));
        obj.createOption([], $('.copy-condition-source-field'));
      }
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
     * [テーブル跨ぎチェック処理関数]
     * @param {array} value [保存設定内容]
     * @returns [テーブル跨ぎがある場合 true　ない場合 falseを返す]
     **********************************************************/
    tableCheck: function (value) {
      const sTableList = [];
      obj.thatFieldList.forEach(field => {
        if(field.type == "SUBTABLE") sTableList.push(field.code);
      });
      const dTableList = [];
      obj.thisFieldList.forEach(field => {
        if(field.type == "SUBTABLE") dTableList.push(field.code);
      });

      let flag = false;
      value.copyField.forEach(item => {
        const parts = item.sourceField.split('　');
        const partd = item.destinationField.split('　');
        const tables = parts.length == 2 ? parts[0] : '';
        const tabled = partd.length == 2 ? partd[0] : '';
        if (sTableList.includes(tables) != dTableList.includes(tabled)) flag = true;
      })
      return flag;
    },

    /***********************************************************
     * [重複チェック処理関数]
     * @param {array} value [保存設定内容]
     * @returns [重複している場合 true　していない場合 falseを返す]
     **********************************************************/
    dupCheck: function (value) {
      const array = [];
      value.copyField.forEach(item => {
        array.push(item.destinationField);
      })
      array.push(value.recordIdCopyField);

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
        let ngFlag = false;

        if(value.copyDestinationAppId == ""){obj.displayAlert('エラー', 'コピー元アプリが選択されていません。', 'error', 'OK');return false;}
        if(value.recordIdCopyField == ""){obj.displayAlert('エラー', 'レコード番号のコピー先フィールドが選択されていません。', 'error', 'OK');return false;}
        if(value.timing == ""){obj.displayAlert('エラー', '同期タイミングが選択されていません', 'error', 'OK');return false;}
        if(value.isNumberCheck == true && value.numberSelect == ""){obj.displayAlert('エラー', '採番フィールドが選択されていません。', 'error', 'OK');return false;}
        if(value.isNumberCheck == true && value.digit == ""){obj.displayAlert('エラー', '桁数設定が入力されていません。', 'error', 'OK');return false;}
        value.conditionField.forEach((x) => {
          if(x.sourceField == null || x.sourceField == ""){obj.displayAlert('エラー', '同期条件フィールドが選択されていません。', 'error', 'OK');ngFlag = true; return false;}
          if(x.copyCond == null || x.copyCond == ""){obj.displayAlert('エラー', '同期条件が選択されていません。', 'error', 'OK');ngFlag = true; return false;}
          if(x.condType == "DATE" && x.dateSelect == ""){obj.displayAlert('エラー', '日付の同期条件フィールドに対して正しい日付が入力されていません。', 'error', 'OK');ngFlag = true; return false;}
          if((x.condType == "DROP_DOWN" || x.condType == "DROP_DOWN") && x.condSelect == ""){obj.displayAlert('エラー', '選択系の同期条件フィールドに対して選択肢が選択されていません。', 'error', 'OK');ngFlag = true; return false;}
        })
        if(ngFlag) return false;
        if(value.rewriteField == ""){obj.displayAlert('エラー', '上書き許可フィールドが選択されていません。', 'error', 'OK');return false;}
        const rewriteField = obj.thisFieldList.find(x => x.code === obj.getCodePart(value.rewriteField));
        if (!rewriteField || rewriteField.properties.options[0].label != 'する') {obj.displayAlert('エラー', '上書き許可フィールドの項目名が「する」ではありません。', 'error', 'OK');return false;}

        value.copyField.forEach((y) => {
          if(y.destinationField == null || y.destinationField == ""){obj.displayAlert('エラー', 'コピー先フィールドが選択されていません。', 'error', 'OK');ngFlag = true;return false;}
          if(y.sourceField == null || y.sourceField == ""){obj.displayAlert('エラー', 'コピー元フィールドが選択されていません。', 'error', 'OK');ngFlag = true;return false;}
        })
        if(ngFlag) return false;
        if (obj.tableCheck(value)) {obj.displayAlert('エラー', 'テーブル内からテーブル外へのコピー、またはその逆は出来ません。', 'error', 'OK');return false;}
        if (obj.dupCheck(value)) {obj.displayAlert('エラー', '選択されたコピー先フィールドが重複しています。', 'error', 'OK');return false;}
        
        //[文字列に変換]
        value.copyField = JSON.stringify(value.copyField);
        value.conditionField = JSON.stringify(value.conditionField);
        value.isNumberCheck = JSON.stringify(value.isNumberCheck);

        kintone.plugin.app.setConfig(value);
      });
      //[キャンセルボタンクリック時イベント]
      obj.$cancel.on('click', function () {
        window.location.href = '../../' + kintone.app.getId() + '/plugin/';
      });
    },

    checkCertificationFile: function () {
      if (typeof KNTP496810certification === 'function') {
        return true;
      } else {
        return false;
      }
    },

  };

  //[関数実行]
  obj.configShow(obj.config);

})(jQuery, kintone.$PLUGIN_ID);
