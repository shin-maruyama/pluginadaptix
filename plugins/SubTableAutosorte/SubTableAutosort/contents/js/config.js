// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP227410certification())) {
    return;
  }

  var config = kintone.plugin.app.getConfig(PLUGIN_ID);

  var sortCon = {};

  sortCon.fieldType = 'SUBTABLE';
  sortCon.sortKey = 3;
  sortCon.dom = {
    table: $('#table'),
    submit: $('#submit'),
    cancel: $('#cancel'),
  };
  sortCon.idName = {
    field: '#sort-field',
    sort: '#sort',
    add: '#add',
    delete: '#delete',
    column: '.select-column',
  };
  sortCon.fieldList = [];
  sortCon.data2 = [];

  /**
   * [初期表示]
   * @param {object} _config [前回保存した設定情報]
   */
  sortCon.config = async function (_config) {
    var self = this;
    // プラグイン設定情報を引数から取得
    var saveConfig = _config;

    // リクエストパラメータ
    var body = {
      app: kintone.app.getId(),
    };
    //
    try {
      self.fieldList = await kintone.api(kintone.api.url('/k/v1/form', true), 'GET', body);
      self.data2 = await kintone.api(kintone.api.url('/k/v1/app/form/fields', true), 'GET', body);
    } catch (err) {
      console.error(err);
    }
    self.createForm(saveConfig, self.fieldList, self.data2);
    self.createNewOptionForSubTable();
    self.adjustDis();
    self.buttonEve();
    return;
  };

  /**
   * [設定画面入力フォームの作成]
   * @param {object} _config [前回保存した設定情報]
   * @param {object} data1   [各フォーム情報]
   * @param {object} data1   [各フィールド情報]
   */
  sortCon.createForm = function (_config, data1, data2) {
    var self = this;
    // 各プルダウンに選択肢を追加
    // データをサブテーブルのみにフィルタリング
    var fildata = self.filterType(data1, self.fieldType);
    // プルダウンにオプションを追加
    fildata.forEach(function (item) {
      self.createOption(self.dom.table, { value: item.code, text: item.label });
    });
    self.addEve(self.idName.add, self.idName.delete, '#0', data2);
    self.recreateSelectionfieldsOfSortKeys('#0', null);
    if (!self.isEmpty(_config)) {
      _config.conf = JSON.parse(_config.conf);

      //現在設定されている全サブテーブルのcodeをもとに、_config.confのサブテーブルから削除されているサブテーブルを除外させるため、mapする。
      let fildateCodes = fildata.map(function (x) { return x.code; });
      let target = _config.conf.filter(function (x) { return fildateCodes.includes(x.table); });

      // 設定情報をもとにフォームを作成
      target.forEach(function (item, i) {
        if (i == 0) {
          // 設定内容の反映
          self.createFormCon(item, i, data2);
        } else {
          // 選択項目をコピー
          var $content = $('#0').clone(true);
          // cloneのidの変更
          $content.attr('id', i);
          $('.js-submit-settings').append($content);
          // 設定内容の反映
          self.createFormCon(item, i, data2);
        }
      });
    } else {
      $('#0').find("#table").val("");//保存データが無い場合は、対象テーブルは空白にする。
    }
  };

  /**
   * [各設定内容の反映]
   * @param {object} item
   * @param {int}    i
   * @param {object} data2
   */
  sortCon.createFormCon = function (item, i, data2) {
    var self = this;
    // テーブルの設定内容を選択
    $('#' + i)
      .find('#table')
      .val(item.table);
    // 各選択肢にテーブル内のフィールド情報の追加
    for (var k = 0; k < self.sortKey; k++) {
      // 各フィールド選択肢の初期化
      $('#' + i)
        .find(self.idName.field + k)
        .children()
        .remove();
      // 初期値の追加
      self.createOption($('#' + i).find(self.idName.field + k), { value: '', text: '' });
      // テーブル内の選択肢の追加
      Object.entries(data2.properties[item.table].fields).forEach(function (item2) {

        self.createOption(
          $('#' + i)
            .children()
            .find(self.idName.field + k),
          { value: item2[1].code, text: item2[1].label }
        );
      });
    }

    //以前設定したソール対象フィールドが、現存していなければ、除外する。
    const tableFields = Object.keys(data2.properties[item.table].fields);
    const itemSortFilter = item.sort.filter((x) => tableFields.includes(x.sortField));

    for (var j = 0; j < itemSortFilter.length; j++) {
      // フィールドの設定内容を選択
      $('#' + i)
        .children()
        .find(self.idName.field + j)
        .val(itemSortFilter[j].sortField);
      $('#' + i)
        .children()
        .find(self.idName.sort + j)
        .val(itemSortFilter[j].sort);
    }
    self.addEve(self.idName.add, self.idName.delete, '#' + i, data2);
    self.recreateSelectionfieldsOfSortKeys('#' + i, { target: "start" });
  };

  /**
   * [選択肢を作成しプルダウンに追加]
   * @param {string} dom [選択肢の追加先要素]
   * @param {object} obj [選択肢の情報]
   */
  sortCon.createOption = function (dom, obj) {
    //引数の情報から選択肢を作成
    var option = $('<option>', {
      value: obj.value,
      text: obj.value,
    });
    //指定の要素に追加
    dom.append(option);
  };

  /**
   * [保存ボタン押下時の要素からの値取得処理]
   * @returns [各値を格納したオブジェクトを返却]
   */
  sortCon.submit = function () {
    var self = this;

    // 各項目要素
    var columns = $(self.idName.column);
    var data = [];
    for (var i = 0; i < columns.length; i++) {

      var value = {
        table: columns.eq(i).children().find('#table').val(),
        sort: [],
      };

      for (var j = 0; j < self.sortKey; j++) {

        // ★重要：sortField は「表示文字列」ではなく「フィールドコード(value)」を保存する
        var sortFieldCode = columns
          .eq(i)
          .children()
          .find('#sort-field' + j)
          .val();

        var sortVal = {
          sortField: sortFieldCode || '',
          sort: columns
            .eq(i)
            .children()
            .find(self.idName.sort + j)
            .val(),
        };

        value.sort.push(sortVal);
      }
      data.push(value);
    }
    return data;
  };

  /************************
   * [ドロップダウンの幅調整]
   ************************/
  sortCon.adjustDis = function () {
    sortCon.search();

    $('.select-column').each(function () {
      const str = $(this).find('.targettable option:selected').text().length;

      let selectColumnWidth = 680;
      let len = str * 17 + 20;
      if (len < 290) len = 290;
      if (len > selectColumnWidth) selectColumnWidth = len + 30;
      $(this).find('.targettable').find('.select2-selection--single').css('width', len + 'px');
      $(this).find('.targettable').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      $(this).find('.targettable').css('width', len + 5 + 'px');

      let maxLen = 0;
      $(this).find('.small-column').each(function () {
        const str = $(this).find('.sortCondition option:selected').text().length;
        if (str > maxLen) maxLen = str;
      });

      let len1 = maxLen * 17 + 20;
      if (len1 < 290) len1 = 290;
      if (len1 + 320 > selectColumnWidth) selectColumnWidth = len1 + 320;
      $(this).find('.small-column').each(function () {
        $(this).find('.select2-selection--single').first().css('width', len1 + 'px');
        $(this).find('.select2-selection__arrow').first().css('left', len1 - 30 + 'px');
        $(this).find('.select2-container--default').first().css('width', len1 + 'px');
        $(this).css('width', len1 + 320 + 'px');
        $(this).find('.select2-selection--single').last().css('left', '400px');
      });

      $(this).css('width', selectColumnWidth + 'px');
    });

  };

  /***************************************
   * [ドロップダウンに検索機能追加・CSS追加]
   **************************************/
  sortCon.search = function () {

    $('.select2').select2({
      'min-width': '290px',
    }).on('select2:open', function (e) {
      const opnederDropdownId = $(this).prop("id");
      setTimeout(function () {
        var optionCount = $('.select2-results__option').length;
        if (optionCount > 5) {
          var newTop = 0;
        } else {
          var newTop = -40;
        }

        if (opnederDropdownId == "sort0" || opnederDropdownId == "sort1" || opnederDropdownId == "sort2") {
          $('.select2-search--dropdown').css({
            display: 'none',
          });
        } else {
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

  };

  /**
   * [保存・キャンセルボタンの処理]
   */
  sortCon.buttonEve = function () {
    var self = this;
    // フォーム保存時の処理
    self.dom.submit.on('click', function () {
      var value = self.submit();

      let errMesseage = "";

      //未入力チェック
      value.forEach((x, i) =>
      {
        if (!x.table) { errMesseage = errMesseage + (i + 1) + "ブロック目の対象テーブルが未入力です<br>"; }
        x.sort.forEach((y, j) =>
        {
          if (y.sortField || y.sort || j == 0) {
            if (!y.sortField) { errMesseage = errMesseage + (i + 1) + "ブロック目" + (j + 1) + "番目のソートフィールドが未選択です。<br>"; }
            if (!y.sort) { errMesseage = errMesseage + (i + 1) + "ブロック目" + (j + 1) + "番目の降順昇順が未選択です。<br>"; }
          }
        }

        );
      });

      if (errMesseage != "") { self.displayAlert('エラー', errMesseage, 'error', 'OK'); return false; }
      // サブテーブルの重複チェック
      if (self.valCheck(value, 'table')) {
        self.displayAlert('エラー', '選択されたサブテーブルフィールドが重複しています。', 'error', 'OK');
        return false;
      }
      // ソート条件の重複チェック
      var flag = false;
      for (var i = 0; i < value.length; i++) {
        if (self.valCheck(value[i].sort, 'sortField')) {
          flag = true;
          break;
        }
      }
      if (flag) {
        self.displayAlert('エラー', 'ソート条件として選択されたフィールドが重複しています。', 'error', 'OK');
        return false;
      }
      // 設定データ
      var setConfig = {
        conf: JSON.stringify(value),
      };
      // 設定を保存
      kintone.plugin.app.setConfig(setConfig);

    });

    // フォームキャンセル時の処理
    self.dom.cancel.on('click', function () {
      window.history.back();
    });
  };

  /**
   * [アラートの表示]
   * @param {string} title    [タイトル]
   * @param {string} text     [説明文]
   * @param {string} type     [アラートタイプ]
   * @param {string} button   [ボタン]
   */
  sortCon.displayAlert = function (title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button,
    });
  };

  /**
   * [バリデーションチェック]
   * @param {object}} value [各設定項目の値]
   * @param {object}} key   [キー]
   */
  sortCon.valCheck = function (value, key) {
    var self = this;

    // 各値格納用の配列を作成
    let arr = [];
    // key情報をもとに値を代入
    value.forEach(function (item) {
      if (item[key]) {
        arr.push(item[key]);
      }
    });
    // 重複チェック
    return self.existSameValue(arr);
  };

  /**
   * [重複チェックを行う]
   * @param {array}} arr [重複チェックを行う配列]
   * @returns [重複がない場合はfalse 重複がある場合はtrueを返却]
   */
  sortCon.existSameValue = function (arr) {
    arr = arr.filter((x) => x != "");//未選択は、外す。
    var s = new Set(arr);
    return s.size != arr.length;
  };

  /**
   * [追加・削除ボタンの押下時の処理]
   * @param {string} add  [追加ボタンの要素id]
   * @param {string} del  [削除ボタンの要素id]
   * @param {string} id   [対象要素群のid]
   * @param {string} data [フィールド情報]
   */
  sortCon.addEve = function (add, del, id, data) {
    var self = this;
    // イベントの削除
    $(id).children().find(add).off('click');
    $(id).children().find(del).off('click');

    // 追加ボタンの処理内容
    $(id)
      .children()
      .find(add)
      .on('click', function () {

        //select2は一度destroyしないとcloneできない
        $('#table').select2('destroy');
        $('#sort0').select2('destroy');
        $('#sort1').select2('destroy');
        $('#sort2').select2('destroy');
        $('#sort-field0').select2('destroy');
        $('#sort-field1').select2('destroy');
        $('#sort-field2').select2('destroy');

        // 追加
        var $content = $('#0').clone(true);
        for (var i = 0; i < self.sortKey; i++) {
          // プルダウンの初期化
          $content
            .children()
            .find(self.idName.field + i)
            .children()
            .remove();
          // 初期値の追加
          self.createOption($content.children().find(self.idName.field + i), { value: '', text: '' });
        }
        $(id).after($content);
        // idを付与しなおす
        self.numbering(add, del, data);
        self.recreateSelectionfieldsOfSortKeys(id, { target: "addEve" });
        self.createNewOptionForSubTable();
        self.adjustDis();
      });
    // 削除ボタンの処理内容
    $(id)
      .children()
      .find(del)
      .on('click', function () {
        // 削除
        if ($(self.idName.column).length > 1) {
          $(id).remove();
          // idを付与しなおす
          self.numbering(add, del, data);
          self.recreateSelectionfieldsOfSortKeys(id, { target: "addEve" });
          self.createNewOptionForSubTable();
        }
      });
  };

  /**
   * [ソートのキーとなるフィールドの選択肢を作りなおす]
   * @param {string} id     [対象要素のid]
   * @param {object} e      [イベントの種類]
   */
  sortCon.recreateSelectionfieldsOfSortKeys = async function (id, e) {

    var self = this;

    var table = $(id).children().find('#table').val();
    let array = [];

    if (e != null && e.target != "select#table") {
      if ($(id).children().find('#sort-field0').val()) { array.push($(id).children().find('#sort-field0').val()); }
      if ($(id).children().find('#sort-field1').val()) { array.push($(id).children().find('#sort-field1').val()); }
      if ($(id).children().find('#sort-field2').val()) { array.push($(id).children().find('#sort-field2').val()); }
    }

    // プルダウンに選択肢の追加
    const targetFieldTypes = ['SINGLE_LINE_TEXT', 'NUMBER', 'DATE', 'TIME', 'DATETIME', 'DROP_DOWN', 'CHECK_BOX', 'FILE'];//選択肢にするフィールドタイプ(文字列１行、数値、日付、時刻、日時、添付ファイル)
    if (!self.data2.properties[table]) { self.createNewOptionForSubTable(); return; }

    for (var j = 0; j < self.sortKey; j++) {
      const val1 = $(id).children().find(self.idName.field + j).val();
      const newOptions1 = Object.entries(self.data2.properties[table].fields).filter(x => !array.includes(x[0]) || x[0] === val1);

      // 初期化
      $(id).children().find(self.idName.field + j).empty();

      // 初期値
      self.createOption($(id).children().find(self.idName.field + j), { value: null, text: "" });

      newOptions1.forEach((item, index) => {
        if (targetFieldTypes.includes(item[1].type)) {
          self.createOption(
            $(id)
              .children()
              .find(self.idName.field + j),
            { value: item[1].code, text: item[1].label }
          );
        }

        if (index === newOptions1.length - 1) {
          $(id).children().find(self.idName.field + j).val(val1);
        }
      });

      self.createNewOptionForSubTable();
    }
  };

  /**
   * [idによって判別できるようにidを順番に振っていく]
   * @param {string} add  [追加ボタンの要素id]
   * @param {string} del  [削除ボタンの要素id]
   * @param {object} data [フィールド情報]
   */
  sortCon.numbering = function (add, del, data) {
    var self = this;
    // idを付与しなおす
    var columns = $(self.idName.column);
    for (var i = 0; i < columns.length; i++) {
      columns[i].id = i;
      self.addEve(add, del, '#' + i, data);
    }
  };

  /**
   * [空オブジェクトかどうかを判定]
   * @param {object} obj [判定用オブジェクト]
   * @returns [空の場合はtrue,空じゃない場合はfalse]
   */
  sortCon.isEmpty = function (obj) {
    return !Object.keys(obj).length;
  };

  /**
   * [フィールドタイプでフィルタリングを行う]
   * @param {object} data [フィルタリング対象データ]
   * @param {string} type [フィルタリング対象フィールドタイプ]
   * @returns [フィルタリングされたデータ]
   */
  sortCon.filterType = function (data, type) {
    return data.properties.filter((x) => x.type === type);
  };

  /**
   * [新しく対象テーブルの選択肢を作成する。]
   */
  sortCon.createNewOptionForSubTable = async function () {
    const self = this;
    var columns = $(self.idName.column);//select-column
    let array = [];

    for (var i = 0; i < columns.length; i++) {
      array.push(columns.eq(i).children().find('#table').val());
    }

    var tableFieldList = self.filterType(self.fieldList, self.fieldType);

    for (var i = 0; i < columns.length; i++) {
      const val1 = columns.eq(i).children().find('#table').val();
      const newOptions1 = tableFieldList.filter(x => !array.includes(x.code) || x.code === val1);
      columns.eq(i).children().find('#table').empty();
      const $noneOption = $('<option>', {
        value: null,
        text: '',
      });

      columns.eq(i).children().find('#table').append($noneOption);

      newOptions1.forEach((field) => {
        const option = $('<option>', {
          value: field.code,
          text: field.code,
        });
        columns.eq(i).children().find('#table').append(option);
      });

      columns.eq(i).children().find('#table').val(val1);
    }
  };

  //[ソート条件フィールドの値を変えた時の処理]
  $(document).on('change', '#sort-field0, #sort-field1, #sort-field2', function (e) {
    const i = $(this).closest('.select-column').attr('id');
    sortCon.recreateSelectionfieldsOfSortKeys('#' + i, e);
    sortCon.adjustDis();
  });

  //[対象テーブルの値を変えた時の処理]
  $(document).on('change', '#table', function (e) {
    const i = $(this).closest('.select-column').attr('id');

    for (var k = 0; k < sortCon.sortKey; k++) {
      // 各フィールド選択肢の初期化
      $('#' + i).find(sortCon.idName.field + k).children().remove();
      sortCon.createOption($('#' + i).children().find(sortCon.idName.field + k), { value: "", text: "" });
      $('#' + i).children().find(sortCon.idName.field + k).val("");
      $('#' + i).children().find(sortCon.idName.sort + k).val("");
    }

    sortCon.recreateSelectionfieldsOfSortKeys('#' + i, e);
    sortCon.adjustDis();
  });

  //ソート条件のドロップボックスを変更した時のイベント
  $(document).on('change', '.sortCondition', function (e) {
    const i = $(this).closest('.select-column').attr('id');

    sortCon.recreateSelectionfieldsOfSortKeys('#' + i, e);
    sortCon.adjustDis();
  });

  await sortCon.config(config);
})(jQuery, kintone.$PLUGIN_ID);