// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  let select = [];
  try {
    select = config.elementArray ? JSON.parse(config.elementArray) : [];
  } catch (error) {
    select = [];
  }

  kintone.events.on(
    ['app.record.create.show', 'app.record.edit.show', 'app.record.detail.show'],

    async function (event) {

      if (!(await KNTP932510certification())) return event;
      if (!select || !select.length) return event;

      const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
        app: kintone.app.getId(),
      });

      //ドロップダウンプラグイン、ラジオボタンプラグインの設定で、関連付けられたフィールドを属性をもとに取得する。
      const newSelect = await relatedFieldsGet(select)

      newSelect.forEach(async function (val) {
        if (!val) return event;

        const parts = val.split(' ');
        const fieldCode = parts.length === 1 ? parts[0] : parts[1];

        kintone.app.record.setFieldShown(fieldCode, false);

        markFieldByCode(fieldCode)
      });

      return event;
    }
  );

  async function relatedFieldsGet(select){
    return new Promise((resolve) => {
      const fieldList2 = [
      ...Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList),
      ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)
    ];

    setTimeout(() => {
      const newSelect = [...select];
      select.forEach((x) => {
        const target = fieldList2.find((y) => y.var === x);
        if (!target) return;

        let fieldWrap2 = null
        if(target.type != undefined){
            fieldWrap2 = document.querySelector(`.field-${target.id}`);
          }else{
            fieldWrap2 = document.querySelector(`.subtable-row-${target.id}`)
          }

        if(!fieldWrap2) return;
        if(fieldWrap2.hasAttribute('dropdownplugin')){
          const getAttribute = fieldWrap2.getAttribute('dropdownplugin')
          const getAttributeParse = JSON.parse(getAttribute)
          const optionElement = fieldWrap2.querySelector('.control-value-gaia span');
          const option = optionElement ? optionElement.textContent : '';
          const getAttributeTarget = getAttributeParse.find((x) => x.categoryName == option)
          if(getAttributeTarget && getAttributeTarget.fields) getAttributeTarget.fields.forEach((split) => kintone.app.record.setFieldShown(split, true))
        }
        if(fieldWrap2.hasAttribute('radioButtonPlugin')){
          const getAttribute = fieldWrap2.getAttribute('radioButtonPlugin')
          const getAttributeParse = JSON.parse(getAttribute)
          const querySelector = kintone.app.record.getFieldElement(target.var)
          let option = null;
          if(querySelector != null){
            option = querySelector.textContent;
          }else{
            const checked = fieldWrap2.querySelector('input[type="radio"]:checked')
            if(!checked) return;
            option = checked.value
          }
          const getAttributeTarget = getAttributeParse.find((x) => x.categoryName == option)
          if(getAttributeTarget && getAttributeTarget.fields) getAttributeTarget.fields.forEach((split) => kintone.app.record.setFieldShown(split, true))
        }
      });
      resolve(newSelect);
    }, 100)
  });
  }

  async function markFieldByCode(fieldorigin){
    if(!fieldorigin || fieldorigin == "undefined") {return;}
    const filedSplit = fieldorigin.split(' ')
    const fieldCode = filedSplit.length == 2 ? filedSplit[1] : filedSplit[0]
    let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
    fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
    const target = fieldList2.find((x) => x.var === fieldCode);
    if(!target) {return;}
    setTimeout(() => {
      if(target.type != undefined){
        const fieldWrap2 = document.querySelector(`.field-${target.id}`);
        fieldWrap2.setAttribute('field-hidden-by', 'FieldHiddenPlugin');
      }else{
        const fieldWrap2 = document.querySelector(`.subtable-row-${target.id}`);
        fieldWrap2.setAttribute('field-hidden-by', 'FieldHiddenPlugin');
      }
    }, 100);
  }

  /******************************************
   * [一覧画面表示時の設定済みフィールド存在チェック]
   * - フィールド削除・フィールドコード変更を検知
   * - 一覧表示時に毎回警告表示
   * - 対象フィールドコード一覧を表示
   ******************************************/
  kintone.events.on('app.record.index.show', async function () {
    if (!(await KNTP932510certification())) return;
    if (!select || !select.length) return;

    const filteredFieldList = await getFields();

    if (!filteredFieldList) return;

    // 不存在フィールド格納
    const missingFields = [];

    // 設定済みフィールド存在チェック
    for (let i = 0; i < select.length; i++) {
      if (select[i] !== 'none') {

        const exists = filteredFieldList.some(
          field => field.fieldName === select[i]
        );

        if (!exists) {
          missingFields.push(`[非表示対象] ${select[i]}`);
        }
      }
    }

    // 重複除去
    const uniqueMissingFields = [...new Set(missingFields)];

    // 不存在フィールドがある場合のみ警告表示
    if (uniqueMissingFields.length > 0) {

      const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';

      const fieldHtml = uniqueMissingFields
        .map((code) => `・${code}`)
        .join('<br>');

      displayAlert(
        '警告',
        '「非表示プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        imageUrl,
        'OK'
      );
    }

  });

  async function getFields() {
    const fieldList = [];
    try {
      const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
        app: kintone.app.getId(),
      });
      resp.layout.forEach((row) => {
        if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push(field));
        else if (row.type === 'SUBTABLE') fieldList.push(row);
        else if (row.type === 'GROUP') {
          fieldList.push(row);
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
    } catch { }

    let filteredFieldList = [];
    fieldList.forEach((row) => {
      if (row.type === 'GROUP') {
        filteredFieldList.push({
          fieldName: row.code
        });
        row.layout.forEach((childRow) => {
          childRow.fields.forEach((field) => {
            filteredFieldList.push({
              fieldName: (row.code ? row.code : row.label) + ' ' + field.code
            });
          });
        });
      } else if (row.type === 'SUBTABLE') {
        filteredFieldList.push({
          fieldName: row.code
        });
        row.fields.forEach((subField) => {
          filteredFieldList.push({
            fieldName: (row.code ? row.code : row.label) + ' ' + subField.code
          });
        });
      } else {
        filteredFieldList.push({
          fieldName: row.code
        });
      }
    });

    return filteredFieldList;
  }

  function displayAlert(title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      imageUrl: type,
      confirmButtonText: button,
      customClass: {
        popup: 'my-popup-class',
      }
    });
  };

})(jQuery, kintone.$PLUGIN_ID);
