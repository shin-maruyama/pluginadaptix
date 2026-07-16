// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP271910certification())) {
    return;
  }

  //指定日付から現在までの期間（yy年mmヶ月dd日）を求める関数////
  function kikan(date) {
    const dateFrom = luxon.DateTime.fromISO(date); // 指定日付フィールドの日付
    const dateTo = luxon.DateTime.local().startOf('days'); // 現在の日付
    let result = "";

    const [start, end] = dateFrom < dateTo ? [dateFrom, dateTo] : [dateTo, dateFrom];

    if(dateFrom > dateTo){
      result = `0年0ヶ月0日`
      return result;
    }

    //開始日の残り日数
    const daysInMonthByfrom = start.daysInMonth;
    
    //次の月の初日
    let firstDayOfMonth = start.plus({ months: 1 }).startOf('month')

    //指定日日付から現在までの日数
    let daysBetweenFromAndTo = Math.floor(end.diff(start, 'days').days);

    let years = 0;//結果の年
    let months = 0;//結果の月
    let deductedDays = 0;//結果の日数を出すために、指定日日付から現在までの日数から引かれる日数

    // 月加算
    while (firstDayOfMonth.plus({ months: 1 }) <= end) {
      deductedDays = deductedDays + firstDayOfMonth.daysInMonth;
      firstDayOfMonth = firstDayOfMonth.plus({ months: 1 });
      months++;
      if(months == 12){years++;months = 0;}
    }

    //結果の日数
    let days = daysBetweenFromAndTo - deductedDays;
  
    //日数を月に換算する処理
    if(days >= daysInMonthByfrom){months++;days = days - daysInMonthByfrom}
    //月数を年に換算する処理
    if(months >= 12){years++;months = months - 12}

    result = Number.isNaN(days) ? "" : `${years}年${months}ヶ月${days}日`;

    return result;
  }

  function tableChangeEventCreate(tableCode, fieldCode, dateField) {
    kintone.events.on([`app.record.create.change.${tableCode}`, `app.record.edit.change.${tableCode}`], function (e) {
      if (!e.changes.row || !e.changes.row.value) return e;
      e.changes.row.value[fieldCode]['disabled'] = true;
      let date = e.changes.row.value[dateField].value; // 指定した日付フィールドの値
      let kinzokuYear = kikan(date); // 関数で求めた期間を代入
      e.changes.row.value[fieldCode].value = kinzokuYear; // 指定した出力フィールドの値を求めた期間に変更
      return e;
    });
  }

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
    } catch { }
    return fieldList;
  }
  ///////////////////////////////////////////////////////////

  var config = kintone.plugin.app.getConfig(PLUGIN_ID);
  const tableFields = [];
  const dateFields = [];
  const outputFields = [];
  const changeEvents = [];
  config.settings = JSON.parse(config.settings);
  for (let i = 0, length = config.settings.length; i < length; i++) {
    const partsd = config.settings[i].dateField.split('　');
    tableFields.push(partsd.length === 2 ? partsd[0] : '');
    const dateField = (partsd.length === 2 ? partsd[1] : partsd[0]);
    dateFields.push(dateField);
    changeEvents.push('app.record.create.change.' + dateField); // 新規レコード作成画面で日付フィールドの値を変更時発生イベント
    changeEvents.push('app.record.edit.change.' + dateField);   // レコード編集画面で日付フィールドの値を変更時発生イベント

    const partso = config.settings[i].outputField.split('　');
    outputFields.push(partso.length === 2 ? partso[1] : partso[0]);
  }

  let flg = false; //ボタンを無限増殖しないためのフラグ


  //期間自動入力///////////////////////////////////////////////////////////////
  kintone.events.on(changeEvents, function (e) {

    if(!tableFields || !tableFields.length) return e;
    for (let i = 0, length = tableFields.length; i < length; i++) {
      if (tableFields[i] && e.record[tableFields[i]]){
        //debugger;
        if (!e.changes.row || !e.changes.row.value) continue;
        if (!e.changes.row.value[outputFields[i]] || !e.changes.row.value[dateFields[i]]) continue;
        e.changes.row.value[outputFields[i]]['disable'] = true;
        let date = e.changes.row.value[dateFields[i]].value; // 指定した日付フィールドの値
        let kinzokuYear = kikan(date);
        e.changes.row.value[outputFields[i]].value = kinzokuYear; // 指定した出力フィールドの値を求めた期間に変更
      } else {
        if (!e.record[outputFields[i]] || !e.record[dateFields[i]]) continue;
        e.record[outputFields[i]]['disabled'] = true;
        let date = e.record[dateFields[i]].value; // 指定した日付フィールドの値
        let kinzokuYear = kikan(date);
        e.record[outputFields[i]].value = kinzokuYear; // 指定した出力フィールドの値を求めた期間に変更;
      }
    }
    return e;
  });
  ////////////////////////////////////////////////////////////////////////////

  const showEvents = [
    'app.record.create.show', // 新規レコード作成画面表示時発生イベント
    'app.record.edit.show', // レコード編集画面表示時発生イベント
  ];

  //期間自動入力///////////////////////////////////////////////////////////////
  kintone.events.on(showEvents, async function (e) {
    if (!(await KNTP271910certification())) return e;

    if(!tableFields || !tableFields.length) return e;
    for (let i = 0, length = tableFields.length; i < length; i++) {
      if (tableFields[i] && e.record[tableFields[i]]){
        for (const row of e.record[tableFields[i]].value) {
          row.value[outputFields[i]]['disabled'] = true;
          let date = row.value[dateFields[i]].value; // 指定した日付フィールドの値
          let kinzokuYear = kikan(date);
          row.value[outputFields[i]].value = kinzokuYear; // 指定した出力フィールドの値を求めた期間に変更
        }
        tableChangeEventCreate(tableFields[i], outputFields[i], dateFields[i]);
      }else{
        e.record[outputFields[i]]['disabled'] = true;
        let date = e.record[dateFields[i]].value; // 指定した日付フィールドの値
        let kinzokuYear = kikan(date);
        e.record[outputFields[i]].value = kinzokuYear; // 指定した出力フィールドの値を求めた期間に変更;
      }
    }
    return e;
  });
  ////////////////////////////////////////////////////////////////////////////

  //レコード一覧画面表示時発生イベント////////////////////////////////////////////
  kintone.events.on('app.record.index.show', async function (e) {
    // console.log(e);
    if (!(await KNTP271910certification())) return e;
    if(!config.settings) return e;

    const fieldList = await getFieldList();
    if (fieldList && fieldList.length > 0) {
      const missingFields = [];

      for (let i = 0, length = config.settings.length; i < length; i++) {
        const dateFieldExists = fieldList.some((x) => config.settings[i].dateField === x.code);
        const outputFieldExists = fieldList.some((x) => config.settings[i].outputField === x.code);

        if (!dateFieldExists) {
          missingFields.push(`[起点日付フィールド] ${config.settings[i].dateField}`);
        }

        if (!outputFieldExists) {
          missingFields.push(`[期間出力フィールド] ${config.settings[i].outputField}`);
        }
      }

      const uniqueMissingFields = [...new Set(missingFields)];

      if (uniqueMissingFields.length > 0) {
        const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
        const fieldHtml = uniqueMissingFields
          .map((code) => `・${code}`)
          .join('<br>');

        displayAlert(
          '警告',
          '「期間一括更新プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          fieldHtml +
          '<br><br>プラグイン設定を修正してください。',
          imageUrl,
          'OK'
        );
      }
    }

    const headerMenuSpace = kintone.app.getHeaderMenuSpaceElement(); // レコード一覧画面のヘッダーメニュー部分の要素取得

    const button = document.createElement('button'); // ボタンタグ作成
    button.id = 'update-button'; // ボタンのid設定
    button.innerText = '期間更新'; // ボタンの表示文字設定
    button.style = 'width: 100px; height: 48px'; // ボタンのCSS設定

    //ボタン押下時の処理
    button.onclick = () => {
      const params = {
        app: kintone.app.getId(), // アプリID
        records: [], // 更新するレコード配列
      };

      //レコードの数分ループ
      for (let i = 0; i < e.records.length; i++) {
        const recordObj = {
          id: e.records[i]['$id'].value,
          record: {},
        };
        for (let j = 0, length = tableFields.length; j < length; j++) {
          if (tableFields[j] && e.records[i][tableFields[j]]){
            // テーブルを更新
            recordObj.record[tableFields[j]] = {};
            recordObj.record[tableFields[j]].value = [];
            if (!e.records[i][tableFields[j]].value || !e.records[i][tableFields[j]].value.length) continue;
            for (const row of e.records[i][tableFields[j]].value) {
              const rowObj = {
                id: row.id,
                value: {},
              };
              let date = row.value[dateFields[j]].value;
              rowObj.value[outputFields[j]] = {};
              rowObj.value[outputFields[j]].value = kikan(date);
              recordObj.record[tableFields[j]].value.push(rowObj);
            }
          }else{
            let date = e.records[i][dateFields[j]].value;
            recordObj.record[outputFields[j]] = {};
            recordObj.record[outputFields[j]].value = kikan(date);
          }
        }
        params.records.push(recordObj);
      }

      // レコード一括更新
      kintone.api(
        kintone.api.url('/k/v1/records.json', true),
        'PUT',
        params,
        function (resp) {
          // success
          alert('更新に成功しました。ページが自動で更新されます。');
          location.reload();
        },
        (error) => {
          // error
          console.log(error);
          alert('更新に失敗しました。サポートに問い合わせてください。');
        }
      );
    };
    if (flg) return;
    headerMenuSpace.appendChild(button); // レコード一覧画面のヘッダーメニュー部分の要素にボタンをいれる
    flg = true;
  });

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
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
})(jQuery, kintone.$PLUGIN_ID);
