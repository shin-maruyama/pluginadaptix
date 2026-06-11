// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP526110certification())) {
    return;
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  //[JSON型に変換]
  if (Object.keys(config).length) {
    config.settings = JSON.parse(config.settings);
    //console.log(config.settings);
  } else {
    return false;
  }

  const { settings } = config;

  const total = {};

  total.eventStart = function () {
    let self = this;

    kintone.events.on('app.record.index.show', async function () {

      await self.checkFields();
    });


    kintone.events.on(self.eventCreate(), function (event) {
      const record = event.record;
      if (!settings || !settings.length) return event;
      for (let i = 0; i < settings.length; i++) {
        //フィールド名の分割
        const dateSelectSplit = settings[i].dateSelect.split('　');
        const dateSelectName = dateSelectSplit.length === 1 ? dateSelectSplit[0] : dateSelectSplit[1];
        const yearSelectSplit = settings[i].yearSelect.split('　');
        const yearSelectName = yearSelectSplit.length === 1 ? yearSelectSplit[0] : yearSelectSplit[1];
        const monthSelectSplit = settings[i].monthSelect.split('　');
        const monthSelectName = monthSelectSplit.length === 1 ? monthSelectSplit[0] : monthSelectSplit[1];
        const daySelectSplit = settings[i].daySelect.split('　');
        const daySelectName = daySelectSplit.length === 1 ? daySelectSplit[0] : daySelectSplit[1];

        let dateSelecttableCode = "";
        if (dateSelectSplit.length !== 1) {
          dateSelecttableCode = dateSelectSplit[0];
          if (!event.record[dateSelecttableCode]) dateSelecttableCode = "";
        }

        //[テーブル外フィールド]
        if (dateSelecttableCode == "") {
          const dateSelectField = record[dateSelectName];
          const yearSelectField = record[yearSelectName];
          const monthSelectField = record[monthSelectName];
          const daySelectField = record[daySelectName]

          if (dateSelectField.value) {
            const dateParts = dateSelectField.value.split('-');
            if (yearSelectName !== 'none' && yearSelectField) {
              yearSelectField.value = parseInt(dateParts[0], 10);
            }

            if (monthSelectName !== 'none' && monthSelectField) {
              monthSelectField.value = parseInt(dateParts[1], 10);
            }

            if (daySelectName !== 'none' && daySelectField) {
              daySelectField.value = parseInt(dateParts[2], 10);
            }

          } else {
            if (yearSelectName !== 'none' && yearSelectField) {
              yearSelectField.value = null;
            }

            if (monthSelectName !== 'none' &&  monthSelectField) {
              monthSelectField.value = null;
            }

            if (daySelectName !== 'none' && daySelectField) {
              daySelectField.value = null;
            }
          }

        } else {
          
          for (const row of record[dateSelecttableCode].value) {
            const dateSelectField = row.value[dateSelectName];
            const yearSelectField = row.value[yearSelectName];
            const monthSelectField = row.value[monthSelectName];
            const daySelectField = row.value[daySelectName];

            if (dateSelectField.value) {
            const dateParts = dateSelectField.value.split('-');
            if (yearSelectName !== 'none' && yearSelectField) {
              yearSelectField.value = parseInt(dateParts[0], 10);
            }

            if (monthSelectName !== 'none' && monthSelectField) {
              monthSelectField.value = parseInt(dateParts[1], 10);
            }

            if (daySelectName !== 'none' && daySelectField) {
              daySelectField.value = parseInt(dateParts[2], 10);
            }

          } else {
            if (yearSelectName !== 'none' && yearSelectField) {
              yearSelectField.value = null;
            }

            if (monthSelectName !== 'none' &&  monthSelectField) {
              monthSelectField.value = null;
            }

            if (daySelectName !== 'none' && daySelectField) {
              daySelectField.value = null;
            }
          }
          }
        }
      }
      return event;
    });

  };

  total.eventCreate = function () {
    let self = this;
    let events = [];

    events.push('app.record.edit.show');
    //events.push('app.record.detail.show');
    events.push('app.record.create.show');

    for (let i = 0; i < config.settings.length; i++) {
      if ((config.settings[i].dateSelect).indexOf('　') == -1) {
        events.push('app.record.edit.change.' + config.settings[i].dateSelect);
        events.push('app.record.create.change.' + config.settings[i].dateSelect);
      } else {
        var str = config.settings[i].dateSelect.split('　')[1];
        events.push('app.record.edit.change.' + str);
        events.push('app.record.create.change.' + str);
      }
    }

    return events;
  };

  total.getFields = async function () {
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
    return fieldList;
  }

  total.checkFields = async function () {

    const fieldList = await total.getFields();
    if (!fieldList) return;

    let filteredFieldList = [];
    fieldList.forEach((row) => {
      if (row.type === 'GROUP') {
        row.layout.forEach((childRow) => {
          childRow.fields.forEach((field) => {
            filteredFieldList.push({
              fieldName: (row.code ? row.code : row.label) + '　' + field.code
            });
          });
        });
      } else if (row.type === 'SUBTABLE') {
        row.fields.forEach((subField) => {
          filteredFieldList.push({
            fieldName: (row.code ? row.code : row.label) + '　' + subField.code
          });
        });
      } else {
        filteredFieldList.push({
          fieldName: row.code
        });
      }
    });

    const requiredMissingFields = [];
    const optionalMissingFields = [];

    for (let i = 0; i < config.settings.length; i++) {
      if (settings[i].dateSelect !== 'none') {
        const exists = filteredFieldList.some(field => field.fieldName === settings[i].dateSelect);
        if (!exists) {
          requiredMissingFields.push(`[指定日フィールド] ${settings[i].dateSelect}`);
        }
      }

      if (settings[i].yearSelect !== 'none') {
        const exists = filteredFieldList.some(field => field.fieldName === settings[i].yearSelect);
        if (!exists) {
          optionalMissingFields.push(`[(年)格納フィールド] ${settings[i].yearSelect}`);
        }
      }

      if (settings[i].monthSelect !== 'none') {
        const exists = filteredFieldList.some(field => field.fieldName === settings[i].monthSelect);
        if (!exists) {
          optionalMissingFields.push(`[(月)格納フィールド] ${settings[i].monthSelect}`);
        }
      }

      if (settings[i].daySelect !== 'none') {
        const exists = filteredFieldList.some(field => field.fieldName === settings[i].daySelect);
        if (!exists) {
          optionalMissingFields.push(`[(日)格納フィールド] ${settings[i].daySelect}`);
        }
      }
    }

    const uniqueRequiredMissingFields = [...new Set(requiredMissingFields)];
    const uniqueOptionalMissingFields = [...new Set(optionalMissingFields)];

    if (uniqueRequiredMissingFields.length > 0) {
      const fieldHtml = uniqueRequiredMissingFields
        .map((code) => `・${code}`)
        .join('<br>');

      total.displayAlert(
        '1',
        'エラー',
        '「日付分割プラグイン」に設定済みの必須フィールドコードが変更または削除されているため、処理を継続出来ません。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        'error',
        'OK'
      );
      return false;
    }

    if (uniqueOptionalMissingFields.length > 0) {
      const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
      const fieldHtml = uniqueOptionalMissingFields
        .map((code) => `・${code}`)
        .join('<br>');

      total.displayAlert(
        '2',
        '警告',
        '「日付分割プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        imageUrl,
        'OK'
      );
      return false;
    }

  }

  total.displayAlert = function (flag, title, text, type, button) {
    if (flag === '1') {
      swal.fire({
        title: title,
        html: text,
        icon: type,
        confirmButtonText: button,
        customClass: {
          popup: 'my-popup-class',
        }
      });
    } else {
      swal.fire({
        title: title,
        html: text,
        imageUrl: type,
        confirmButtonText: button,
        customClass: {
          popup: 'my-popup-class',
        }
      });
    }
  };



  total.getCodePart = function (code) {
    const parts = code.split(' ');
    return parts.length === 2 ? parts[1] : code;
  };



  total.eventStart();
})(jQuery, kintone.$PLUGIN_ID);
