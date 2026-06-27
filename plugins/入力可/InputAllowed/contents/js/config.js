// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP318810certification())) {
    return;
  }

  const $submitButton = $('#submit');
  const $cancelButton = $('.js-cancel-button');
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  //console.log(config);

  //[フィールドリスト]
  let fieldList = await getFieldList();
  fieldList = filterField(fieldList, false, 'REFERENCE_TABLE', 'GROUP', 'HR', 'LABEL', 'SPACER');

  fieldList.forEach((field) => {
    const option = $('<option>', {
      value: field.code,
      text: field.code,
    });
    $('#selectA').append(option);
  });

  //[テーブルフィールドリスト]
  const tableFieldList = filterField(fieldList, true, 'SUBTABLE');

  tableFieldList.forEach((table) => {
    const tableFieldCode = table.code;

    const op = $('<option>', {
      value: tableFieldCode,
      text: tableFieldCode,
    });
    $('#selectA').append(op);

    table.fields.forEach((field) => {
      const option = $('<option>', {
        value: `${tableFieldCode}　${field.code}`,
        text: `${tableFieldCode}　${field.code}`,
      });
      $('#selectA').append(option);
    });
  });

  /////////////設定保持/////////////////////////////////////////////////////////////////////
  if (Object.keys(config).length) {
    //設定したドロップダウンリストのvalueリスト
    const dropList = JSON.parse(config.elementArray);

    selectA.value = dropList[0];
    for (let i = 1; i < dropList.length; i++) {
      const element = dropList[i];
      const tbody = document.getElementById('tbody');
      const clone = tbody.firstElementChild.cloneNode(true);
      const select = clone.firstElementChild.firstElementChild;
      select.value = element;
      tbody.appendChild(clone);
    }

    search();
  } else {
    search();
  }
  /////////////////////////////////////////////////////////////////////////////////////////

  //追加ボタン/////////////////////////////////////////
  $(document).on('click', '.kintoneplugin-button-add-row-image', (obj) => {
    $('.selectA').select2('destroy');
    const tbody = document.querySelector('#tbody');
    const tr = obj.target.parentNode.parentNode;
    const clone = tbody.firstElementChild.cloneNode(true);
    tbody.insertBefore(clone, tr.nextSibling);
    search();
  });
  //////////////////////////////////////////////////////

  //削除ボタン/////////////////////////////////////////////////////
  $(document).on('click', '.kintoneplugin-button-remove-row-image', (obj) => {
    const tbody = document.querySelector('#tbody');
    const tr = obj.target.parentNode.parentNode;
    if (tbody.childElementCount > 1) {
      tbody.removeChild(tr);
    }
  });
  ////////////////////////////////////////////////////////////////

  //保存ボタン押下時////////////////////////////////////////////////
  $submitButton.on('click', function () {
    const elementArray = [];
    const elementValue = document.getElementsByClassName('selectA');

    for (let i = 0; i < elementValue.length; i++) {
      elementArray.push(elementValue[i].value);
    }
    const config = { elementArray: JSON.stringify(elementArray) };
    kintone.plugin.app.setConfig(config);
  });
  //////////////////////////////////////////////////////////////////

  //キャンセルボタンクリック時
  $cancelButton.on('click', function () {
    window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  });

  /***************************************
   * [フォームに設置してある全フィールド取得]
   * @returns [フォームの左上から順番のフィールドリスト]
   **************************************/
  async function getFieldList() {
    const fieldList = [];
    const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
      app: kintone.app.getId(),
    });
    resp.layout.forEach((row) => {
      if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push(field));
      else if (row.type === 'SUBTABLE') fieldList.push(row);
      else if (row.type === 'GROUP') {
        fieldList.push(row);
        row.layout.forEach((childRow) => childRow.fields.forEach((field) => fieldList.push(field)));
      }
    });
    let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
    fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
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
  }

  /************************************************
   * [指定したフィールドを抽出する関数]
   * @param {Array} フィルターをかけるフィールドリスト
   * @param {boolean} 指定したフィールドタイプを抽出 true   以外を抽出 false
   * @param {Array} 抽出するフィールドタイプリスト
   * @returns [抽出したフィールドリスト]
   ************************************************/
  function filterField(fieldList, flg, ...limitFieldType) {
    if (limitFieldType.length === 0) return fieldList;
    if (flg) fieldList = fieldList.filter((x) => limitFieldType.includes(x.type));
    else fieldList = fieldList.filter((x) => !limitFieldType.includes(x.type));
    return fieldList;
  }

  /****************************************
   * [ドロップダウンに検索機能を追加・CSS追加]
   ****************************************/
  function search() {
    $('.select2').select2({
      width: '380px',
    });
    $('.select2-selection--single').css({
      height: '48px',
      border: '1px solid #e3e7e8',
      'background-color': '#f7f9fa',
      'box-shadow': '1px 1px 1px #fff inset',
      'border-radius': '0',
      'text-overflow': 'ellipsis',
      'margin-top': '-3px',
    });
    $('.select2-selection__rendered').css({
      color: '#3498db',
      'text-align': 'center',
      'line-height': '48px',
    });
    $('.select2-selection__arrow').css({
      top: '8px',
    });
    $('.select2-container--default .select2-selection--single .select2-selection__arrow b').css({
      'border-color': '#3498db transparent transparent transparent',
    });
  }
})(jQuery, kintone.$PLUGIN_ID);
