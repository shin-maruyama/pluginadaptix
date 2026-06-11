// Copyright (C) All in one Allright Reserved. 


jQuery.noConflict();

(function ($, PLUGIN_ID) {
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
  const dateCalculation = {};
  dateCalculation.resp = null;

  dateCalculation.checkCertificationFile = function () {
    if (typeof KNTP387010certification === 'function') {
      return true;
    } else {
      return false;
    }
  }


  /********************************************
   * [プラグイン設定保存処理関数]
   * @returns [プラグイン保存設定内容オブジェクト]
   ********************************************/
  dateCalculation.submit = function () {
    const value = {
      settings: []
    };
    for (let i = 0, length = $('.main-contents').length; i < length; i++) {
      const item = {
        starttimeSelect: $('.start-time-select')[i].value ? $('.start-time-select')[i].value : 'none',
        endtimeSelect: $('.end-time-select')[i].value ? $('.end-time-select')[i].value : 'none',
        answertimeSelect: $('.answer-time-select')[i].value ? $('.answer-time-select')[i].value : 'none',
        hourSelect: $('.hour-select')[i].value ? $('.hour-select')[i].value : 'none',
        minuteSelect: $('.minute-select')[i].value ? $('.minute-select')[i].value : 'none',
      }
      value.settings.push(item);
    }
    return value;
  }


  /**********************************************************
   * [プラグイン設定画面表示時処理関数]
   * @param {object} config [プラグイン保存設定内容オブジェクト]
   **********************************************************/
  dateCalculation.config = async function (config) {
    const that = this;

    if (!(that.checkCertificationFile())) {
      that.displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
      return;
    } else {
      if (!(await KNTP387010certification())) {
        return;
      }
    }

    /**
     * [保存・削除ボタンクリック時の処理]　
     * [追加・削除ボタンクリック時の処理]　
     */
    that.buttonClickEvent();
    that.rowButtonClickEvent();
    that.changeEvent();

    /**
     * @param {Array} fieldList [フィールドの左上から順のフィールド]
     */
    const fieldList = await that.getFieldList();
    const timeFieldList = that.filterField(fieldList, true, 'TIME');
    const numberFieldList = that.filterField(fieldList, true, 'NUMBER');

    //[ドロップダウンにオプション追加]
    that.createOption(timeFieldList, $('.start-time-select'));
    that.createOption(timeFieldList, $('.end-time-select'));
    that.createOption(timeFieldList, $('.answer-time-select'));
    that.createOption(numberFieldList, $('.hour-select'));
    that.createOption(numberFieldList, $('.minute-select'));


    //[既にプラグイン設定が保存されている場合の処理]
    if (Object.keys(config).length) {
      //[JSON型に変換]
      config.settings = JSON.parse(config.settings);
      // console.log(config);


      //[保存した設定個数分クローン作成 *1つ目は既にあるので飛ばす]
      for (let i = 1, length = config.settings.length; i < length; i++) {
        const parent = document.querySelector('#parent');
        const clone = parent.firstElementChild.cloneNode(true);
        parent.appendChild(clone);
      }


      //[プラグイン保存設定反映]
      for (let i = 0, length = config.settings.length; i < length; i++) {
        $('.start-time-select')[i].value = config.settings[i].starttimeSelect;
        $('.end-time-select')[i].value = config.settings[i].endtimeSelect;
        $('.answer-time-select')[i].value = config.settings[i].answertimeSelect;
        $('.hour-select')[i].value = config.settings[i].hourSelect;
        $('.minute-select')[i].value = config.settings[i].minuteSelect;
      }

      await that.currentSelect();

    } else {

      that.search();
    }

    $('#parent').sortable();
  }


  /***************************************
   * [フォームに設置してある全フィールド取得]
   * @returns [フォームの左上から順番のフィールドリスト]
   **************************************/
  dateCalculation.getFieldList = async function () {
    const fieldList = [];
    const fieldList2 = [
      ...Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList),
      ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
    ];

    try {
      let resp;
      if (dateCalculation.resp){
        resp = dateCalculation.resp;
      } else {
        resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
          app: kintone.app.getId(),
        });
        dateCalculation.resp = resp;
      }
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
          ));
        }
      });

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
    } catch { }
    return fieldList;
  }


  /************************************************
   * [指定したフィールドを抽出する関数]
   * @param {Array} フィルターをかけるフィールドリスト
   * @param {boolean} 指定したフィールドタイプを抽出 true   以外を抽出 false
   * @param {Array} 抽出するフィールドタイプリスト
   * @returns [第二引数がtrueなら指定したフィールドタイプのフィールドリスト 
   * 　　　　　　　　　　 falseなら指定したフィールドタイプ以外のフィールドリスト] 
   ************************************************/
  dateCalculation.filterField = function (fieldList, flg, ...limitFieldType) {
    if (!limitFieldType.length) return fieldList;
    if (flg) fieldList = fieldList.filter(x => limitFieldType.includes(x.type));
    else fieldList = fieldList.filter(x => !limitFieldType.includes(x.type));
    return fieldList;
  }


  /***************************************
   * [ドロップダウンに検索機能追加・CSS追加]
   **************************************/
  dateCalculation.search = function () {
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
  }


  /*************************************
   * [追加・削除ボタンクリック時の処理関数]
   ************************************/
  dateCalculation.rowButtonClickEvent = function () {
    const that = this;
    //[追加ボタンクリック時の処理]
    $(document).on('click', '.add-row', async (obj) => {
      $('.start-time-select').select2('destroy');
      $('.end-time-select').select2('destroy');
      $('.answer-time-select').select2('destroy');
      $('.hour-select').select2('destroy');
      $('.minute-select').select2('destroy');

      const parent = document.querySelector('#parent');
      const mainContents = obj.target.parentNode.parentNode;
      const clone = parent.firstElementChild.cloneNode(true);

      parent.insertBefore(clone, mainContents.nextSibling);

      await that.currentSelect();

    });

    //[削除ボタンクリック時の処理]
    $(document).on('click', '.remove-row', async (obj) => {
      const parent = document.querySelector('#parent');
      const mainContents = obj.target.parentNode.parentNode;
      if (parent.childElementCount > 1) {
        mainContents.remove();
      }

      await that.currentSelect();
    });

  }


  /***********************************************
   * [オプション作成処理関数]
   * @param {Array} fields [フィールドリスト]
   * @param {HTMLAllCollection} name [クラス・ID名]
   ***********************************************/
  dateCalculation.createOption = function (fields, name) {
    const option = $('<option>', {
      value: '',
      text: '',
    });
    name.append(option);
    fields.forEach(field => {
      const option = $('<option>', {
        value: field.code,
        text: field.code
      });
      name.append(option);
    });
  }


  /******************************************
   * [アラートの表示処理関数]
   * @param {string} title  [タイトル] 
   * @param {string} text   [説明文]
   * @param {string} type   [アラートタイプ]
   * @param {string} button [ボタン名表示文字]
   * 使用例 ： that.displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');  
   *****************************************/
  dateCalculation.displayAlert = function (title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button
    })
  }

   /***********************************************************
   * [開始時刻と終了時刻の関係重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [開始時刻と終了時刻の関係が重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  dateCalculation.relationDupCheck = function (value) {
    const array = [];
    value.settings.forEach(item => {
      array.push(item.starttimeSelect+item.endtimeSelect);
    })
    const a = new Set(array);
    return a.size !== array.length
  }

  /***********************************************************
   * [開始時刻または終了時刻と計算結果時刻フィールドの重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [開始時刻または終了時刻と計算結果時刻フィールドが重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  dateCalculation.ioDupCheck = function (value) {
    let flag = false;
    value.settings.forEach(item => {
      value.settings.forEach(item2 => {
        if(item.answertimeSelect === item2.starttimeSelect || 
        item.answertimeSelect === item2.endtimeSelect){flag = true;}
      })
    })
    return flag;
  }

  /***********************************************************
   * [開始時刻と終了時刻の重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [開始時刻と終了時刻が重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  dateCalculation.seDupCheck = function (value) {
    let flag = false;
    value.settings.forEach(item => {
      if(item.starttimeSelect === item.endtimeSelect){flag = true;}
    })
    return flag;
  }

  /***********************************************************
   * [開始時刻と別ブロックの終了時刻とのループチェック処理関数]
   * @param {array} value [ループチェックを行う配列]
   * @returns [開始時刻が別ブロックの終了時刻とループしている場合 true　していない場合 falseを返す]
   **********************************************************/
  dateCalculation.seRoopCheck = function (value) {
    let flag = false;
    value.settings.forEach((item,i) => {
      value.settings.forEach((item2,j)　=> {
        if(i === j) return;
        if(item.starttimeSelect === item2.endtimeSelect && item.endtimeSelect === item2.starttimeSelect){flag = true;}
      })
    })
    return flag;
  }

  /***********************************************************
   * [重複チェック処理関数]
   * @param {array} value [重複チェックを行う配列]
   * @returns [重複している場合 true　していない場合 falseを返す]
   **********************************************************/
  dateCalculation.dupCheck = function (value) {
    const array = [];
    value.settings.forEach(item => {
      if (item.answertimeSelect !== 'none') array.push(item.answertimeSelect);
      if (item.hourSelect !== 'none') array.push(item.hourSelect);
      if (item.minuteSelect !== 'none') array.push(item.minuteSelect);
    })
    const a = new Set(array);
    return a.size !== array.length;
  }

  dateCalculation.blankCheck = function (value) {
    //debugger;
    for (let i = 0; i < value.settings.length; i++) {
      if (value.settings[i].starttimeSelect === 'none' || value.settings[i].endtimeSelect === 'none') {
        return 1;
      }
      if (value.settings[i].answertimeSelect === 'none' && value.settings[i].hourSelect === 'none' && value.settings[i].minuteSelect === 'none') {
        return 2;
      }
    }
    return 0;
  };

  dateCalculation.tableCheck = async function (value) {
    const fieldList = await this.getFieldList(true);
    const subtableList = [];
    for (const row of fieldList) {
      if (row.type === 'SUBTABLE') subtableList.push(row.code);
    }

    for (const setting of value.settings) {
      const s = setting.starttimeSelect.split('　');
      let startTable = s.length > 1 ? s[0] : '';
      if (!subtableList.includes(startTable)) startTable = '';
      const targets = [];
      targets.push(setting.endtimeSelect);
      targets.push(setting.answertimeSelect);
      targets.push(setting.hourSelect);
      targets.push(setting.minuteSelect);
      for (const target of targets){
        if (target === "none") continue;
        const s2 = target.split('　');
        let destTable = s2.length > 1 ? s2[0] : '';
        if (!subtableList.includes(destTable)) destTable = '';
        if (startTable != destTable) return true;
      }
    }
    return false;
  }

  dateCalculation.changeEvent = function () {
    const that = this;
    $(document).on('change', '.start-time-select,.end-time-select,.answer-time-select,.hour-select,.minute-select', function () {
      var scrollPosition = window.scrollY;
      that.currentSelect();
      window.scrollTo(0, scrollPosition);
    });
  };

  dateCalculation.setLength = function () {
    this.search();

    for (let i = 0; i < $('.main-contents').length; i++) {
      const $mainContent = $('.main-contents').eq(i);
      const str1 = $mainContent.find('.start-time-select option:selected').text().length;
      const str2 = $mainContent.find('.end-time-select option:selected').text().length;
      const str3 = $mainContent.find('.answer-time-select option:selected').text().length;
      const str4 = $mainContent.find('.hour-select option:selected').text().length;
      const str5 = $mainContent.find('.minute-select option:selected').text().length;

      let arr = [str1, str2, str3, str4, str5]
      let len = Math.max(...arr) * 17 + 20;
      if (len < 290) len = 290;

      $mainContent.find('.tip-container').find('.select2-selection--single').css('width', len + 'px');
      $mainContent.find('.tip-container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $mainContent.css('width', len + 50 + 'px');
    }
  };

  dateCalculation.currentSelect = async function () {

    const that = this;
    that.setLength();

    let array = [];

    const fieldList = await that.getFieldList(true);
    const numberFieldList = that.filterField(
      fieldList,
      true,
      'NUMBER'
    );
    const timeFieldList = that.filterField(
      fieldList,
      true,
      'TIME',
    );

    $('.main-contents').each(function () {
      array.push($(this).find('.start-time-select').val());
      array.push($(this).find('.end-time-select').val());
      array.push($(this).find('.answer-time-select').val());
      array.push($(this).find('.hour-select').val());
      array.push($(this).find('.minute-select').val());
    });

    $('.main-contents').each(function () {

      //currentSelect1
      const currentSelect1 = $(this).find('.start-time-select');
      const currentValue1 = currentSelect1.val();
      let newOptions1 = [];

      //計算開始時刻開始フィールドは、同じものを選べるように変更する。
      newOptions1 = timeFieldList;
      //newOptions1 = timeFieldList.filter(option => !array.includes(option.code) || option.code === currentValue1);


      currentSelect1.empty();
      that.createOption(newOptions1, currentSelect1);
      currentSelect1.val(currentValue1);

      //currentSelect2
      const currentSelect2 = $(this).find('.end-time-select');
      const currentValue2 = currentSelect2.val();
      let newOptions2 = [];

      //計算終了時刻フィールドは、同じものを選べるように変更する。
      newOptions2 = timeFieldList;
      //newOptions2 = timeFieldList.filter(option => !array.includes(option.code) || option.code === currentValue2);


      currentSelect2.empty();
      that.createOption(newOptions2, currentSelect2);
      currentSelect2.val(currentValue2);

      //currentSelect3
      const currentSelect3 = $(this).find('.answer-time-select');
      const currentValue3 = currentSelect3.val();
      let newOptions3 = [];

      newOptions3 = timeFieldList.filter(option => !array.includes(option.code) || option.code === currentValue3);


      currentSelect3.empty();
      that.createOption(newOptions3, currentSelect3);
      currentSelect3.val(currentValue3);

      //currentSelect4
      const currentSelect4 = $(this).find('.hour-select');
      const currentValue4 = currentSelect4.val();
      let newOptions4 = [];

      newOptions4 = numberFieldList.filter(option => !array.includes(option.code) || option.code === currentValue4);


      currentSelect4.empty();
      that.createOption(newOptions4, currentSelect4);
      currentSelect4.val(currentValue4);

      //currentSelect5
      const currentSelect5 = $(this).find('.minute-select');
      const currentValue5 = currentSelect5.val();
      let newOptions5 = [];

      newOptions5 = numberFieldList.filter(option => !array.includes(option.code) || option.code === currentValue5);

      currentSelect5.empty();
      that.createOption(newOptions5, currentSelect5);
      currentSelect5.val(currentValue5);
    });

  };

  /************************************************
   * [保存・キャンセルボタンクリック時イベント処理関数]
   ***********************************************/
  dateCalculation.buttonClickEvent = function () {
    const that = this;

    //[保存ボタンクリック時イベント]
    $submit.on('click', async function (e) {
      e.preventDefault();

      const value = that.submit();

      if (that.blankCheck(value) === 1) {
        that.displayAlert('エラー', '必須項目が未設定です。', 'error', 'OK');
        return false;
      } else if (that.blankCheck(value) === 2) {
        that.displayAlert('警告', '計算結果出力のフィールドは最低1つ設定してください。', 'error', 'OK');
        return false;
      }

      if (that.relationDupCheck(value)) {
        that.displayAlert('エラー', '開始時刻と終了時刻の関係が重複しています。', 'error', 'OK');
        return false;
      }

      if (that.ioDupCheck(value)) {
        that.displayAlert('エラー', '開始時刻または終了時刻と計算結果時刻フィールドが重複しています。', 'error', 'OK');
        return false;
      }

      if (that.seDupCheck(value)) {
        that.displayAlert('エラー', '開始時刻と終了時刻のフィールドが重複しています。', 'error', 'OK');
        return false;
      }

      if (that.seRoopCheck(value)) {
        that.displayAlert('エラー', '開始時刻が別ブロックの終了時刻とループされています。', 'error', 'OK');
        return false;
      }

      if (that.dupCheck(value)) {
        that.displayAlert('エラー', '選択されたフィールドが重複しています。', 'error', 'OK');
        return false;
      }
      
      if (await that.tableCheck(value)) {
        that.displayAlert('エラー', '別テーブルのフィールドは選択できません。', 'error', 'OK');
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
  }

  //[関数実行]
  dateCalculation.config(config);

})(jQuery, kintone.$PLUGIN_ID);
