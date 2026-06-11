// Copyright (C) All in one Allright Reserved. 

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP387010certification())) {
    return;
  }

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  //[JSON型に変換]
  if (Object.keys(config).length) {
    config.settings = JSON.parse(config.settings);
  } else {
    return false;
  }


  kintone.events.on('app.record.index.show', async function (event) {
    const filteredFieldList = await getFieldList();
    if (!filteredFieldList || !filteredFieldList.length) return event;

    if (!config.settings || !config.settings.length) return event;

    const requiredMissingFields = [];
    const optionalMissingFields = [];

    for (let i = 0; i < config.settings.length; i++) {
      const setting = config.settings[i];

      if (setting.starttimeSelect !== 'none') {
        const exists = filteredFieldList.some(field => field.code === setting.starttimeSelect);
        if (!exists) {
          requiredMissingFields.push(`[計算開始時刻フィールド] ${setting.starttimeSelect}`);
        }
      }

      if (setting.endtimeSelect !== 'none') {
        const exists = filteredFieldList.some(field => field.code === setting.endtimeSelect);
        if (!exists) {
          requiredMissingFields.push(`[計算終了時刻フィールド] ${setting.endtimeSelect}`);
        }
      }

      if (setting.answertimeSelect !== 'none') {
        const exists = filteredFieldList.some(field => field.code === setting.answertimeSelect);
        if (!exists) {
          optionalMissingFields.push(`[計算結果時刻フィールド] ${setting.answertimeSelect}`);
        }
      }

      if (setting.hourSelect !== 'none') {
        const exists = filteredFieldList.some(field => field.code === setting.hourSelect);
        if (!exists) {
          optionalMissingFields.push(`[結果（時間）数値フィールド] ${setting.hourSelect}`);
        }
      }

      if (setting.minuteSelect !== 'none') {
        const exists = filteredFieldList.some(field => field.code === setting.minuteSelect);
        if (!exists) {
          optionalMissingFields.push(`[結果（分）数値フィールド] ${setting.minuteSelect}`);
        }
      }
    }

    const uniqueRequiredMissingFields = [...new Set(requiredMissingFields)];
    const uniqueOptionalMissingFields = [...new Set(optionalMissingFields)];

    if (uniqueRequiredMissingFields.length > 0) {
      const fieldHtml = uniqueRequiredMissingFields
        .map(code => `・${code}`)
        .join('<br>');

      displayAlert(
        '1',
        'エラー',
        '「時間計算プラグイン」に設定済みの必須フィールドコードが変更または削除されているため、処理を継続出来ません。<br><br>' +
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
        .map(code => `・${code}`)
        .join('<br>');

      displayAlert(
        '2',
        '警告',
        '「時間計算プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        imageUrl,
        'OK'
      );
    }

    return event;
  });

  kintone.events.on(['app.record.create.show', 'app.record.edit.show'], async function (event) {

    if (!config.settings || !config.settings.length) return event;

    for (let i = 0; i < config.settings.length; i++) {
      if (existenceCheck(config.settings[i].starttimeSelect, event)) continue;
      if (existenceCheck(config.settings[i].endtimeSelect, event)) continue;

      const starttimeSelectSplit = config.settings[i].starttimeSelect.split('　');
      const starttimeSelectName = starttimeSelectSplit.length === 1 ? starttimeSelectSplit[0] : starttimeSelectSplit[1];
      const endtimeSelectSplit = config.settings[i].endtimeSelect.split('　');
      const endtimeSelectName = endtimeSelectSplit.length === 1 ? endtimeSelectSplit[0] : endtimeSelectSplit[1];
      const answertimeSelectSplit = config.settings[i].answertimeSelect.split('　');
      const answertimeSelectName = answertimeSelectSplit.length === 1 ? answertimeSelectSplit[0] : answertimeSelectSplit[1];
      const hourSelectSplit = config.settings[i].hourSelect.split('　');
      const hourSelectName = hourSelectSplit.length === 1 ? hourSelectSplit[0] : hourSelectSplit[1];
      const minuteSelectSplit = config.settings[i].minuteSelect.split('　');
      const minuteSelectName = minuteSelectSplit.length === 1 ? minuteSelectSplit[0] : minuteSelectSplit[1];

      let tableCode = '';
      if (starttimeSelectSplit.length !== 1) {
        tableCode = starttimeSelectSplit[0];
        if (!event.record[tableCode]) {tableCode = ''};
      }

      if (tableCode == '') {
      
        outsideTheTableFieldChange(event);
        const events = [];
        events.push('app.record.edit.change.' + starttimeSelectName);
        events.push('app.record.create.change.' + starttimeSelectName);
        events.push('app.record.edit.change.' + endtimeSelectName);
        events.push('app.record.create.change.' + endtimeSelectName);
        kintone.events.off(events, outsideTheTableFieldChange);
        kintone.events.on(events, outsideTheTableFieldChange);

        function outsideTheTableFieldChange(event) {
          const { record } = event;

          const starttimeSelectdate = record[starttimeSelectName].value;
          const m = strToMin(starttimeSelectdate);
          const endtimeSelectdate = record[endtimeSelectName].value;
          const m2 = strToMin(endtimeSelectdate);

          if (m >= 0 && m2 >= 0) {
            if (answertimeSelectName !== 'none' && record[answertimeSelectName]) {
              //var element = kintone.app.record.getFieldElement(answertimeSelect);
              if (m2 >= m) { record[answertimeSelectName].value = minToStr(m2 - m); }
              if (m > m2) { record[answertimeSelectName].value = minToStr(m - m2); }
            }

            if(hourSelectName !== 'none' && record[hourSelectName] && minuteSelectName === 'none'){
              const min = m2 - m;
              record[hourSelectName].value = parseInt(min / 60);
            }else if(minuteSelectName !== 'none' && record[minuteSelectName] && hourSelectName === 'none'){
              const min = m2 - m;
              record[minuteSelectName].value = min;
            }else if (hourSelectName !== 'none' && record[hourSelectName] && minuteSelectName !== 'none' && record[minuteSelectName]) {
              const min = m2 - m;
              record[hourSelectName].value = parseInt(min / 60);
              record[minuteSelectName].value = min % 60;
            }
            
          }


          return event;
        }
      } else {
        
          insideTheTableFieldInit(event);

          const events = [];
          events.push('app.record.edit.change.' + starttimeSelectName);
          events.push('app.record.create.change.' + starttimeSelectName);
          events.push('app.record.edit.change.' + endtimeSelectName);
          events.push('app.record.create.change.' + endtimeSelectName);
          kintone.events.off(events, insideTheTableFieldChange);
          kintone.events.on(events, insideTheTableFieldChange);

          function insideTheTableFieldChange(event) {

            if (!event.changes.row || !event.changes.row.value) return event;
            
            const starttimeSelectdate = event.changes.row.value[starttimeSelectName].value;
            const m = strToMin(starttimeSelectdate);
            const endtimeSelectdate = event.changes.row.value[endtimeSelectName].value;
            const m2 = strToMin(endtimeSelectdate);

            if (m >= 0 && m2 >= 0) {
              if (answertimeSelectName !== 'none') {
                if (event.changes.row.value[answertimeSelectName]) {
                  if (m2 >= m) { event.changes.row.value[answertimeSelectName].value = minToStr(m2 - m); }
                  if (m > m2) { event.changes.row.value[answertimeSelectName].value = minToStr(m - m2); }
                }
              }

              if(hourSelectName !== 'none' && minuteSelectName === 'none'){
                if(event.changes.row.value[hourSelectName]){
                  const min = m2 - m;
                  event.changes.row.value[hourSelectName].value = parseInt(min / 60);
                }
              }else if(minuteSelectName !== 'none' && hourSelectName === 'none'){
                if(event.changes.row.value[minuteSelectName]){
                  const min = m2 - m;
                  event.changes.row.value[minuteSelectName].value = min;
                }
              }else if (hourSelectName !== 'none' && minuteSelectName !== 'none') {
                if (event.changes.row.value[hourSelectName] && event.changes.row.value[minuteSelectName]) {
                  const min = m2 - m;
                  event.changes.row.value[hourSelectName].value = parseInt(min / 60);
                  event.changes.row.value[minuteSelectName].value = min % 60;
                }
              } 
            }
            return event;
          }

          function insideTheTableFieldInit(e) {
            const { record } = event;

            if(!record[tableCode]) return e;
            const table = record[tableCode].value;
            if (table && table.length) {
              for (let j = 0; j < table.length; j++) {
                if (!table[j].value[starttimeSelectName]) continue;
                if (!table[j].value[endtimeSelectName]) continue;
                const starttimeSelectdate = table[j].value[starttimeSelectName].value;
                const m = strToMin(starttimeSelectdate);
                const endtimeSelectdate = table[j].value[endtimeSelectName].value;
                const m2 = strToMin(endtimeSelectdate);

                if (m >= 0 && m2 >= 0) {
                  if (answertimeSelectName !== 'none') {
                    if (table[j].value[answertimeSelectName]) {
                      if (m2 >= m) { table[j].value[answertimeSelectName].value = minToStr(m2 - m); }
                      if (m > m2) { table[j].value[answertimeSelectName].value = minToStr(m - m2); }
                    }
                  }
                  
                  if(hourSelectName !== 'none' && minuteSelectName === 'none'){
                    if(table[j].value[hourSelectName]){
                      const min = m2 - m;
                      table[j].value[hourSelectName].value = parseInt(min / 60);
                    }
                  }else if(minuteSelectName !== 'none' && hourSelectName === 'none'){
                    if(table[j].value[minuteSelectName]){
                      const min = m2 - m;
                      table[j].value[minuteSelectName].value = min;
                    }
                  }else if (hourSelectName !== 'none' && minuteSelectName !== 'none') {
                    if (table[j].value[hourSelectName] && table[j].value[minuteSelectName]) {
                      const min = m2 - m;
                      table[j].value[hourSelectName].value = parseInt(min / 60);
                      table[j].value[minuteSelectName].value = min % 60;
                    }
                  }
                }

              }
            }
            return e;
        }
      }

    }

    tableChangeEventCreate(event.record);
    return event;
  });

  function strToMin(str) {
    if (!str) return parseInt(-1);
    var hm = str.split(":");
    return parseInt(hm[0]) * 60 + parseInt(hm[1]);
  };
  // 分をhh:mmに変換
  function minToStr(min) {
    var h = Math.floor(min / 60);
    if (0 <= h && h < 10) { h = "0" + h }
    if (-10 < h && h < 0) {
      h = h - 1;
      h = -(h);
      h = "0" + h;
      h = "-" + h;
    }
    var m = min % 60;
    if (0 <= m && m < 10) { m = "0" + m }
    if (-10 < m && m < 0) {
      m = m - 1;
      m = -(m);
      m = "0" + m;
      m = "-" + m;
    }
    return h + ":" + m;
  };

  function existenceCheck(setting, { record }) {
    const isOutsideTheTable = setting.split('　').length === 1;

    if (isOutsideTheTable) {
      const field = record[setting];
      //const field2 = record[setting.endtimeSelect];
      if (!field) return true;
      return false;
    } else {
      const tableField = record[setting.split('　')[0]];
      if (!tableField) {
        const field = record[setting.split('　')[1]];
        //const field2 = record[setting.endtimeSelect.split('　')[1]];
        if (!field) return true;
        return false;
      } else {
        const field = tableField.value[0].value[setting.split('　')[1]];
        //const field2 = tableField.value[0].value[setting.endtimeSelect.split('　')[1]];
        if (!field) return true;
        return false;
      }
    }
  };

  function tableChangeEventCreate(record) {
    // if (!Object.keys(config).length) return;

    // config.settings = JSON.parse(config.settings);
    if (!config.settings || !config.settings.length) return;
    for (let i = 0; i < config.settings.length; i++) {
      if (config.settings[i].starttimeSelect.split('　').length === 2 && record[config.settings[i].starttimeSelect.split('　')[0]]) {
        const tableCode = config.settings[i].starttimeSelect.split('　')[0];
        const starttimeSelect = config.settings[i].starttimeSelect.split('　')[1];
        const endtimeSelect = config.settings[i].endtimeSelect.split('　')[1];
        const answertimeSelect = config.settings[i].answertimeSelect;
        const hourSelect = config.settings[i].hourSelect;
        const minuteSelect = config.settings[i].minuteSelect;
        kintone.events.on([`app.record.create.change.${tableCode}`, `app.record.edit.change.${tableCode}`], function (event) {
          if (!event.changes.row || !event.changes.row.value) return event;
          //const { record } = event;
          const starttimeSelectdate = event.changes.row.value[starttimeSelect].value;
          const m = strToMin(starttimeSelectdate);
          const endtimeSelectdate = event.changes.row.value[endtimeSelect].value;
          const m2 = strToMin(endtimeSelectdate);

          if (m >= 0 && m2 >= 0) {
            if (answertimeSelect !== 'none' && answertimeSelect.split('　').length === 2) {
              //var element = kintone.app.record.getFieldElement(answertimeSelect);
              const answer = answertimeSelect.split('　')[1];
              if (event.changes.row.value[answer]) {
                if (m2 >= m) { event.changes.row.value[answer].value = minToStr(m2 - m); }
                if (m > m2) { event.changes.row.value[answer].value = minToStr(m - m2); }
              }
            }

            if(hourSelect !== 'none' && hourSelect.split('　').length === 2 && minuteSelect === 'none'){
              const hour = hourSelect.split('　')[1];
              if(event.changes.row.value[hour]){
                const min = m2 - m;
                event.changes.row.value[hour].value = parseInt(min / 60);
              }
            }else if(minuteSelect !== 'none' && minuteSelect.split('　').length === 2){
              const minute = minuteSelect.split('　')[1];
              if(event.changes.row.value[minute]){
                const min = m2 - m;
                event.changes.row.value[minute].value = min;
              }
            }else if (hourSelect !== 'none' && hourSelect.split('　').length === 2 && minuteSelect !== 'none' && minuteSelect.split('　').length === 2) {
              const hour = hourSelect.split('　')[1];
              const minute = minuteSelect.split('　')[1];
              if (event.changes.row.value[hour] && event.changes.row.value[minute]) {
                const min = m2 - m;
                event.changes.row.value[hour].value = parseInt(min / 60);
                event.changes.row.value[minute].value = min % 60;
              }
            }
          }
          return event;
        });
      }
    }
  };

  async function getFieldList() {
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
    } catch (error) { 
      console.error(error); 
    }
    return fieldList;
  };

  function displayAlert(flag,title, text, type, button) {
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


})(jQuery, kintone.$PLUGIN_ID);
