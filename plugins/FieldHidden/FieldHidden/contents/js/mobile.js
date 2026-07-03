// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  const select = parseElementArray(config.elementArray);

  kintone.events.on(
    ['mobile.app.record.create.show', 'mobile.app.record.edit.show', 'mobile.app.record.detail.show'],
    async function (event) {
      if (!(await KNTP932510certification())) return event;
      if (!select || !select.length) return event;

      select.forEach((val) => {
        const fieldCode = getFieldCode(val);
        if (!fieldCode) return;
        hideField(fieldCode);
      });

      return event;
    }
  );

  /******************************************
   * [一覧画面表示時の設定済みフィールド存在チェック]
   * - フィールド削除・フィールドコード変更を検知
   * - 一覧表示時に毎回警告表示
   * - 対象フィールドコード一覧を表示
   ******************************************/
  kintone.events.on('mobile.app.record.index.show', async function () {

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

      const fieldHtml = uniqueMissingFields
        .map((code) => `・${escapeHtml(code)}`)
        .join('<br>');

      displayAlert(
        '警告',
        '「非表示プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        'warning',
        'OK'
      );
    }

  });


  async function getFields() {

    const fieldList = [];

    try {

      const resp = await kintone.api(
        kintone.api.url('/k/v1/app/form/layout.json', true),
        'GET',
        {
          app: kintone.mobile.app.getId(),
        }
      );

      resp.layout.forEach((row) => {

        if (row.type === 'ROW') {
          row.fields.forEach((field) => fieldList.push(field));

        } else if (row.type === 'SUBTABLE') {

          fieldList.push(row);

        } else if (row.type === 'GROUP') {

          fieldList.push(row);

        }

      });

      let fieldList2 = Object.values(
        cybozu.data.page.FORM_DATA.schema.table.fieldList
      );

      fieldList2 = [
        ...fieldList2,
        ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)
      ];

      fieldList.forEach((field) => {

        const target = fieldList2.find((x) => x.var === field.code);

        if (!target) return;

        field.id = target.id;
        field.properties = target.properties;
        field.label = target.label;

        if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;

        field.fields.forEach((inField) => {

          const inTarget = Object.values(target.fieldList)
            .find((x) => x.var === inField.code);

          inField.id = inTarget.id;
          inField.properties = inTarget.properties;
          inField.label = inTarget.label;

        });

      });

    } catch(error) {

      console.error('[FieldHiddenPlugin] Failed to get form fields.', error);
    }

    let filteredFieldList = [];

    fieldList.forEach((row) => {

      if (row.type === 'GROUP') {

        filteredFieldList.push({
          fieldName: row.code
        });

        row.layout.forEach((childRow) => {

          childRow.fields.forEach((field) => {

            filteredFieldList.push({
              fieldName:
                (row.code ? row.code : row.label) + ' ' + field.code
            });

          });

        });

      } else if (row.type === 'SUBTABLE') {

        filteredFieldList.push({
          fieldName: row.code
        });

        row.fields.forEach((subField) => {

          filteredFieldList.push({
            fieldName:
              (row.code ? row.code : row.label) + ' ' + subField.code
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

  function parseElementArray(value) {
    if (!value) return [];

    const textValue = String(value).trim();
    if (!textValue) return [];

    if (textValue[0] !== '[' && textValue[0] !== '{') {
      return [textValue];
    }

    try {
      const parsed = JSON.parse(textValue);
      return Array.isArray(parsed)
        ? parsed.filter((item) => typeof item === 'string' && item !== '' && item !== 'none')
        : [];
    } catch (error) {
      console.error('[FieldHiddenPlugin] Failed to parse plugin config.', error);
      return [];
    }
  }

  function getFieldCode(value) {
    if (!value || value === 'none') return '';
    const parts = value.split(' ');
    return parts[parts.length - 1];
  }

  function hideField(fieldCode) {
    try {
      kintone.mobile.app.record.setFieldShown(fieldCode, false);
    } catch (error) {
      console.error('[FieldHiddenPlugin] Failed to hide field: ' + fieldCode, error);
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function displayAlert(title, text, type, button) {

    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button,
      customClass: {
        popup: 'my-popup-class',
      }
    });

  };

})(jQuery, kintone.$PLUGIN_ID);
