// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP214410certification())) {
    return;
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  //[JSON型に変換]
  if (Object.keys(config).length) {
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
    // console.log(config);
  }

  //[処理用オブジェクト]
  const obj = {};
  /**
   * @param events [イベント配列]
   */
  obj.events = [];

  /**********************
   * [イベント実行処理関数]
   **********************/
  obj.eventStart = function () {
    const that = this;

    if (!Object.keys(config).length) return false;

    that.events.push('mobile.app.record.create.change.' + that.getCodePart(config.startDate));
    that.events.push('mobile.app.record.edit.change.' + that.getCodePart(config.startDate));
    that.events.push('mobile.app.record.create.change.' + that.getCodePart(config.endDate));
    that.events.push('mobile.app.record.edit.change.' + that.getCodePart(config.endDate));

    kintone.events.on(that.events, function (event) {
      const { record } = event;

      const resultValueSplit = config.resultValue.split('　');
      const resultValueName = resultValueSplit.length === 1 ? resultValueSplit[0] : resultValueSplit[1];
      const startDateSplit = config.startDate.split('　');
      const startDateName = startDateSplit.length === 1 ? startDateSplit[0] : startDateSplit[1];
      const endDateSplit = config.endDate.split('　');
      const endDateName = endDateSplit.length === 1 ? endDateSplit[0] : endDateSplit[1];

      let tableCode = '';
      if (resultValueSplit.length !== 1) {
        tableCode = resultValueSplit[0];
        if (!record[tableCode]) tableCode = '';
      }

      if (tableCode == '') {
        if (!(record[startDateName] || record[endDateName] || record[resultValueName])) return false;
        if (record[startDateName].value === '' || record[endDateName].value === '') return false;
        
        const resultValueField = record[resultValueName]
        const startDate = new Date(record[startDateName].value);
        const endDate = new Date(record[endDateName].value);
        
        if (endDate.getTime() >= startDate.getTime()) {
          const resultTime = that.dateToHour(startDate, endDate);
          resultValueField.value = resultTime;
        } else if (endDate.getTime() && startDate.getTime()) {
          resultValueField.value = '';
          that.displayAlert('1', 'エラー', '開始日より終了日を前にすることは出来ません。', 'error', 'OK');
          return false;
        }
      } else {
        const fieldCode = config.resultValue.split('　')[1];
        if (!record[tableCode]) {
          if (record[that.getCodePart(startDateName)].value === '' || record[that.getCodePart(endDateName)].value === '') return false;

          const startDate = new Date(record[that.getCodePart(startDateName)].value);
          const endDate = new Date(record[that.getCodePart(endDateName)].value);

          if (endDate.getTime() >= startDate.getTime()) {
            const resultTime = that.dateToHour(startDate, endDate);
            record[fieldCode].value = resultTime;
          } else if (endDate.getTime() && startDate.getTime()) {
            record[fieldCode].value = '';
            that.displayAlert('1', 'エラー', '開始日より終了日を前にすることは出来ません。', 'error', 'OK');
            return false;
          }
        } else {
          if (!event.changes.row || !event.changes.row.value) return false;
          if (event.changes.row.value[that.getCodePart(startDateName)].value === '' || event.changes.row.value[that.getCodePart(endDateName)].value === '') return false;
          const startDate = new Date(event.changes.row.value[that.getCodePart(config.startDate)].value);
          const endDate = new Date(event.changes.row.value[that.getCodePart(config.endDate)].value);

          if (endDate.getTime() >= startDate.getTime()) {
            const resultTime = that.dateToHour(startDate, endDate);
            event.changes.row.value[fieldCode].value = resultTime;
          } else if (endDate.getTime() && startDate.getTime()) {
            event.changes.row.value[fieldCode].value = '';
            that.displayAlert('1', 'エラー', '開始日より終了日を前にすることは出来ません。', 'error', 'OK');
            return false;
          }

        }
      }
      // }
      return event;
    });

    kintone.events.on('mobile.app.record.index.show', async function (event) {
      const fieldList = await that.getFieldList();
      if (!fieldList || !fieldList.length) return event;
      if (!Object.keys(config).length) return event;

      const missingFields = [];

      if (config.startDate) {
        const exists = fieldList.some((field) => field.code === config.startDate);
        if (!exists) {
          missingFields.push(`[開始日フィールド] ${config.startDate}`);
        }
      }

      if (config.endDate) {
        const exists = fieldList.some((field) => field.code === config.endDate);
        if (!exists) {
          missingFields.push(`[終了日フィールド] ${config.endDate}`);
        }
      }

      if (config.resultValue) {
        const exists = fieldList.some((field) => field.code === config.resultValue);
        if (!exists) {
          missingFields.push(`[時間格納フィールド] ${config.resultValue}`);
        }
      }

      const uniqueMissingFields = [...new Set(missingFields)];

      if (uniqueMissingFields.length > 0) {
        const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
        const fieldHtml = uniqueMissingFields
          .map((code) => `・${code}`)
          .join('<br>');

        that.displayAlert(
          '2',
          '警告',
          '「条件付き経過時間自動計算プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          fieldHtml +
          '<br><br>プラグイン設定を修正してください。',
          imageUrl,
          'OK'
        );
      }

      return event;
    });
  };

  obj.getCodePart = function (code) {
    const parts = code.split('　');
    return parts.length === 2 ? parts[1] : code;
  };

  obj.displayAlert = function (flag, title, text, type, button) {
    if (flag === '1') {
      swal.fire({
        title: title,
        html: text,
        icon: type,
        confirmButtonText: button,
      });

    } else {
      swal.fire({
        title: title,
        html: text,
        imageUrl: type,
        confirmButtonText: button,
      });
    }

  };

  obj.getFieldList = async function () {
    const fieldList = [];
    const fieldList2 = [
      ...Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList),
      ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
    ];

    try {
      const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
        app: kintone.mobile.app.getId(),
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

  obj.dateToHour = function (startDate, endDate) {
    var dates = [];
    var week = [];
    var allMins = 1440;
    if (config.mondayCheck) week.push(1);
    if (config.tuesdayCheck) week.push(2);
    if (config.wednesdayCheck) week.push(3);
    if (config.thursdayCheck) week.push(4);
    if (config.fridayCheck) week.push(5);
    if (config.saturdayCheck) week.push(6);
    if (config.sundayCheck) week.push(0);
    const count = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    // console.log(count);
    for (let i = 0; i <= count; i++) {
      //debugger;
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      var today = new Date(currentDate);
      const index = today.getDay();
      const re = week.find((x) => x === index);
      if (re === undefined) {
        //debugger;
        if (!config.holidayCheck) {
          var holiday = JapaneseHolidays.isHoliday(today);
          if (!holiday) dates.push(today);
        } else {
          dates.push(today);
        }
      }
    }

    for (let i = 0; i < config.settings.length; i++) {
      const endTime = config.settings[i].endTime;
      const startTime = config.settings[i].startTime;
      if(!(endTime && startTime)) continue;
      let endMin = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
      if (endMin == 0) endMin = 1440;
      let startMin = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
      allMins -= (endMin - startMin);
    }

    const hour = dates.length * allMins / 60;
    return hour.toFixed(1);
  };


  //[関数実行]
  obj.eventStart();
})(jQuery, kintone.$PLUGIN_ID);
