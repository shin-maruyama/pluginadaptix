// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

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

  obj.checkCertificationFile = async function () {
    if (typeof KNTP214410certification === 'function') {
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
      startDate: $('.start-date').val(),
      endDate: $('.end-date').val(),
      resultValue: $('.result-value').val(),
      mondayCheck: $('.monday-check').prop('checked'),
      tuesdayCheck: $('.tuesday-check').prop('checked'),
      wednesdayCheck: $('.wednesday-check').prop('checked'),
      thursdayCheck: $('.thursday-check').prop('checked'),
      fridayCheck: $('.friday-check').prop('checked'),
      saturdayCheck: $('.saturday-check').prop('checked'),
      sundayCheck: $('.sunday-check').prop('checked'),
      holidayCheck: $('.holiday-check').prop('checked'),
      settings: [],
    };

    for (let i = 0; i < $('.time-select').length; i++) {
      const timeSelect = $('.time-select').eq(i);
      const item = {
        startTime: timeSelect.find('.start-time').val(),
        endTime: timeSelect.find('.end-time').val()
      }
      value.settings.push(item);
    }
    // for (let i = 0, length = $('.main-contents').length; i < length; i++) {
    // value.startDate.push($('.start-date').value);
    // value.endDate.push($('.end-date').value);
    // value.resultValue.push($('.result-value').value);
    //  }
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
      if (!(await KNTP214410certification())) {
        return;
      }
    }

    /**
     * [保存・削除ボタンクリック時の処理]
     * [追加・削除ボタンクリック時の処理]
     */
    that.buttonClickEvent();
    //that.rowButtonClickEvent();
    that.fieldButtonClickEvent();
    that.changeEvent();

    /**
     * @param {Array} fieldList [フィールドの左上から順のフィールド]
     */
    that.fieldList = await that.getFieldList();
    const dateFieldList = that.filterField(that.fieldList, true, 'DATE');
    const numberFieldList = that.filterField(that.fieldList, true, 'NUMBER');

    //[ドロップダウンにオプション追加]
    that.createOption(dateFieldList, $('.start-date'));
    that.createOption(dateFieldList, $('.end-date'));
    that.createOption(numberFieldList, $('.result-value'));

    //[既にプラグイン設定が保存されている場合の処理]

    if (Object.keys(config).length) {
      //[JSON型に変換]
      config.startDate = JSON.parse(config.startDate);
      config.endDate = JSON.parse(config.endDate);
      config.resultValue = JSON.parse(config.resultValue);
      config.mondayCheck = JSON.parse(config.mondayCheck);
      config.tuesdayCheck = JSON.parse(config.tuesdayCheck);
      config.wednesdayCheck = JSON.parse(config.wednesdayCheck);
      config.thursdayCheck = JSON.parse(config.thursdayCheck);
      config.fridayCheck = JSON.parse(config.fridayCheck);
      config.saturdayCheck = JSON.parse(config.saturdayCheck);
      config.sundayCheck = JSON.parse(config.sundayCheck);
      config.holidayCheck = JSON.parse(config.holidayCheck);
      config.settings = JSON.parse(config.settings);

      //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
      // for (let i = 1, length = config.resultValue.length; i < length; i++) {
      //   const parent = document.querySelector('#parent');
      //   const clone = parent.firstElementChild.cloneNode(true);
      //   parent.appendChild(clone);
      // }

      //[プラグイン保存設定反映]
      //for (let i = 0, length = config.resultValue.length; i < length; i++) {

      $('.start-date').val(config.startDate);
      $('.end-date').val(config.endDate);
      $('.result-value').val(config.resultValue);
      $('.monday-check').prop('checked', config.mondayCheck);
      $('.main-contents').find('.tuesday-check').prop('checked', config.tuesdayCheck);
      $('.wednesday-check').prop('checked', config.wednesdayCheck);
      $('.thursday-check').prop('checked', config.thursdayCheck);
      $('.friday-check').prop('checked', config.fridayCheck);
      $('.saturday-check').prop('checked', config.saturdayCheck);
      $('.sunday-check').prop('checked', config.sundayCheck);
      $('.holiday-check').prop('checked', config.holidayCheck);

      for (let i = 1; i < config.settings.length; i++) {
        const fieldClone = $('.time-select:first').clone(true);
        $('.time-area').append(fieldClone);
      }

      for (let i = 0; i < config.settings.length; i++) {
        const timeSelect = $('.time-select').eq(i);
        timeSelect.find('.start-time').val(config.settings[i].startTime);
        timeSelect.find('.end-time').val(config.settings[i].endTime);
      }

      //}

      await that.currentSelect();
    } else {
      await that.currentSelect();
      that.search();
    }
  };

  /***************************************
   * [フォームに設置してある全フィールド取得]
   * @returns [フォームの左上から順番のフィールドリスト]
   **************************************/
  obj.getFieldList = async function () {
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
        if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push(field));
        else if (row.type === 'SUBTABLE') {
          fieldList.push(row);
          //if (!subTable) return;
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
            //fieldList.push(field)
          ));
        }
      });
    } catch { }

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
  };

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
    if (!fieldList) return [];
    if (flg) fieldList = fieldList.filter((x) => limitFieldType.includes(x.type));
    else fieldList = fieldList.filter((x) => !limitFieldType.includes(x.type));
    return fieldList;
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
      top: '11px',
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
    $(document).on('click', '.add-row', (obj) => {
      // $('.start-date').select2('destroy');
      // $('.end-date').select2('destroy');
      // $('.result-value').select2('destroy');

      const parent = document.querySelector('#parent');
      const mainContents = obj.target.parentNode.parentNode;
      const clone = parent.firstElementChild.cloneNode(true);
      //[クローン 値リセット]

      parent.insertBefore(clone, mainContents.nextSibling);

      //that.search();
    });

    //[削除ボタンクリック時の処理]
    $(document).on('click', '.remove-row', (obj) => {
      const parent = document.querySelector('#parent');
      const mainContents = obj.target.parentNode.parentNode;
      if (parent.childElementCount > 1) {
        mainContents.remove();
      }
    });
  };

  /*************************************
   * [追加・削除ボタンクリック時の処理関数]
   ************************************/
  obj.fieldButtonClickEvent = function () {
    const that = this;
    //[追加ボタンクリック時の処理]
    $(document).on('click', '.add-field', function () {
      const clone = $(this).closest('.time-select').clone(true);
      clone.find('.start-time').val('');
      clone.find('.end-time').val('');
      $(this).closest('.time-select').after(clone);
    });

    //[削除ボタンクリック時の処理]
    $(document).on('click', '.remove-field', function () {
      if ($(this).closest('.time-area').find('.time-select').length > 1) {
        $(this).closest('.time-select').remove();
      }
    });

    $(document).on('blur', '.start-time, .end-time', function () {
      const timeChange = $(this).val();
      if (timeChange) {
        const minute = timeChange.split(':')[1];
        const pattern = /^[0-5]0$/;
        if (!pattern.test(minute)) {
          that.displayAlert('エラー', '除外時間開始フィールド、または、除外時間終了フィールドは10分刻みで設定してください。', 'error', 'OK');
          return false;
        }
        const startTime = $(this).closest('.time-select').find('.start-time').val();
        const endTime = $(this).closest('.time-select').find('.end-time').val();
        if (startTime && endTime) {
          if (startTime > endTime && endTime != "00:00") {
            that.displayAlert('エラー', '除外時間開始フィールドより、除外時間終了フィールドを前にすることは出来ません。', 'error', 'OK');
            return false;
          }
        }
      }

    })
    that.currentSelect();
  };

  /***********************************************
   * [オプション作成処理関数]
   * @param {Array} fields [フィールドリスト]
   * @param {HTMLAllCollection} name [クラス・ID名]
   ***********************************************/
  obj.createOption = function (fields, name) {
    const option = $('<option>', {
      value: '',
      text: '',
    });
    name.append(option);
    fields.forEach((field) => {
      const option = $('<option>', {
        value: field.code,
        text: field.code,
      });
      name.append(option);
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
      text: text,
      icon: type,
      confirmButtonText: button,
    });
  };

  /***********************************************************
   * [重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  obj.dupCheck = function (value) {
    const array = [];

    value.resultValue.forEach((item) => {
      array.push(item);
    });
    const a = new Set(array);
    return a.size !== array.length;
  };

  obj.minuteCheck = function (value) {
    var flag = false;
    const pattern = /^[0-5]0$/;
    value.settings.forEach((item) => {
      if (item.startTime) {
        if (!pattern.test(item.startTime.split(':')[1])) {
          flag = true;
        }
      }
      if (item.endTime) {
        if (!pattern.test(item.endTime.split(':')[1])) {
          flag = true
        }
      }
    });
    return flag;
  };

  obj.timeCheck = function (value) {
    var re = false;
    value.settings.forEach((item) => {
      if (item.startTime && item.endTime) {
        if (item.startTime > item.endTime && item.endTime != "00:00") {
          re = true;
        }
      }

    });

    return re;
  };

  obj.timeOverLapCheck = function (value){
    var flag = false;
    value.settings.forEach((item,i) => {
      value.settings.forEach((item2,j) => {
        if(i === j) return;
        if(item2.startTime <= item.stratTime && item.stratTime < item2.endTime){flag = true;}
        if(item2.startTime < item.endTime && item.endTime <= item2.endTime){flag = true;}
      })
    })
    return flag;
  }

  obj.fieldCheck = function (value) {
    var result = false;
    if (value.startDate === '' || value.endDate === '' || value.resultValue === '') {
      result = true;
    }
    return result;
  }

  obj.changeEvent = function () {
    const that = this;
    $(document).on('change', '.start-date,.end-date,.result-value', async function () {
      var scrollPosition = window.scrollY;
      await that.currentSelect();
      window.scrollTo(0, scrollPosition);
    });
  };

  obj.setLength = function () {
    this.search();

    for (let i = 0; i < $('.main-contents').length; i++) {
      const $mainContent = $('.main-contents').eq(i);
      const str1 = $mainContent.find('.start-date option:selected').text().length;
      const str2 = $mainContent.find('.end-date option:selected').text().length;
      const str3 = $mainContent.find('.result-value option:selected').text().length;

      let arr = [str1, str2, str3]
      let len = Math.max(...arr) * 17 + 20;
      if (len < 290) len = 290;

      $mainContent.find('.tip-container').find('.select2-selection--single').css('width', len + 'px');
      $mainContent.find('.tip-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $mainContent.css('width', len + 400 + 'px');
      $('#parent').css('width', len + 410 + 'px');
      $mainContent.find('.left-colunm').css('width', len + 384 + 'px');
    }
  };

  obj.currentSelect = async function () {

    const that = this;
    let array = [];

    const numFiledList = that.filterField(
      that.fieldList,
      true,
      'NUMBER',
    );

    const dateFieldList = that.filterField(
      that.fieldList,
      true,
      "DATE"
    );

    $('.main-contents').each(function () {
      array.push($(this).find('.start-date').val());
      array.push($(this).find('.end-date').val());
      array.push($(this).find('.result-value').val());
    });


    $('.main-contents').each(function () {

      //currentSelect1
      const currentSelect1 = $(this).find('.start-date');
      const currentValue1 = currentSelect1.val();
      let newOptions1 = [];

      newOptions1 = dateFieldList.filter(option => !array.includes(option.code) || option.code === currentValue1);

      currentSelect1.empty();
      that.createOption(newOptions1, currentSelect1);
      currentSelect1.val(currentValue1);

      //currentSelect2
      const currentSelect2 = $(this).find('.end-date');
      const currentValue2 = currentSelect2.val();
      let newOptions2 = [];

      newOptions2 = dateFieldList.filter(option => !array.includes(option.code) || option.code === currentValue2);

      currentSelect2.empty();
      that.createOption(newOptions2, currentSelect2);
      currentSelect2.val(currentValue2);

      //currentSelect2
      const currentSelect3 = $(this).find('.result-value');
      const currentValue3 = currentSelect3.val();
      let newOptions3 = [];

      newOptions3 = numFiledList.filter(option => !array.includes(option.code) || option.code === currentValue3);

      currentSelect3.empty();
      that.createOption(newOptions3, currentSelect3);
      currentSelect3.val(currentValue3);

    });

    that.setLength();
  }

  /************************************************
   * [保存・キャンセルボタンクリック時イベント処理関数]
   ***********************************************/
  obj.buttonClickEvent = function () {
    const that = this;

    //[保存ボタンクリック時イベント]
    $submit.on('click', function (e) {
      e.preventDefault();

      const value = that.submit();

      // if (that.dupCheck(value)) {
      //   that.displayAlert('エラー', '選択された時間格納フィールドが重複しています。', 'error', 'OK');
      //   return false;
      // }

      if (that.fieldCheck(value)) {
        that.displayAlert('エラー', '開始日、終了日、時間経過フィールドを設定ください。', 'error', 'OK');
        return false;
      }

      if (that.minuteCheck(value)) {
        that.displayAlert('エラー', '除外時間開始フィールド、または、除外時間終了フィールドは10分刻みで設定してください。', 'error', 'OK');
        return false;
      }

      if (that.timeOverLapCheck(value)) {
        that.displayAlert('エラー', '除外時間開始フィールド、または、除外時間終了フィールドにおいて時間が重なっています。', 'error', 'OK');
        return false;
      }

      if (that.timeCheck(value)) {
        that.displayAlert('エラー', '除外時間開始フィールドより、除外時間終了フィールドを前にすることは出来ません。', 'error', 'OK');
        return false;
      }

      //[文字列に変換]
      value.startDate = JSON.stringify(value.startDate);
      value.endDate = JSON.stringify(value.endDate);
      value.resultValue = JSON.stringify(value.resultValue);
      value.mondayCheck = JSON.stringify(value.mondayCheck);
      value.tuesdayCheck = JSON.stringify(value.tuesdayCheck);
      value.wednesdayCheck = JSON.stringify(value.wednesdayCheck);
      value.thursdayCheck = JSON.stringify(value.thursdayCheck);
      value.fridayCheck = JSON.stringify(value.fridayCheck);
      value.saturdayCheck = JSON.stringify(value.saturdayCheck);
      value.sundayCheck = JSON.stringify(value.sundayCheck);
      value.holidayCheck = JSON.stringify(value.holidayCheck);
      value.settings = JSON.stringify(value.settings);

      kintone.plugin.app.setConfig(value);
    });

    //[キャンセルボタンクリック時イベント]
    $cancelButton.on('click', function () {
      window.location.href = '../../' + kintone.app.getId() + '/plugin/';
    });
  };

  //[関数実行]
  obj.config(config);
})(jQuery, kintone.$PLUGIN_ID);
