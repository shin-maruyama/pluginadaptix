// Copyright (C) All in one Allright Reserved. 


jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';

  const obj = {
    config  : kintone.plugin.app.getConfig(PLUGIN_ID),
    showEvents   : ['mobile.app.record.create.show',   'mobile.app.record.edit.show'],

    init : function(e) {
      if(!Object.keys(obj.config).length) return e;
      obj.jsonParse();
      //[画面表示時に結果格納先フィールドを編集不可にする]
      for(const setting of obj.config.settings) {
        obj.disabled(setting.destination, e.record);
      }
      //[テーブル行追加時に結果格納先フィールドを編集不可にする]
      obj.changeEventCreate();
      //[値変更時イベント登録]
      let events = [];
      events.push('app.record.edit.show');
      events.push('app.record.create.show');
      for(const setting of obj.config.settings) {
        //[フィールド存在チェック]
        if(obj.existenceCheck(setting, e.record)) continue;
        events.push('mobile.app.record.edit.change.'   + obj.getCodePart(setting.target));
        events.push('mobile.app.record.create.change.' + obj.getCodePart(setting.target));
        events.push('mobile.app.record.edit.change.'   + obj.getCodePart(setting.method));
        events.push('mobile.app.record.create.change.' + obj.getCodePart(setting.method));
        events.push('mobile.app.record.edit.change.'   + obj.getCodePart(setting.location));
        events.push('mobile.app.record.create.change.' + obj.getCodePart(setting.location));
      }

      kintone.events.on(events, obj.computeMain);

      return e;
    },


    checkFields : async function(e) {
      const filteredFieldList = await obj.getFieldList();
      if (!filteredFieldList || !filteredFieldList.length) return e;

      obj.jsonParse();

      if (!obj.config.settings || !obj.config.settings.length) return e;

      const missingFields = [];

      for (let i = 0; i < obj.config.settings.length; i++) {
        const setting = obj.config.settings[i];

        if (setting.target !== 'none') {
          const exists = filteredFieldList.some(field => field.code === setting.target);
          if (!exists) {
            missingFields.push(`[処理対象] ${setting.target}`);
          }
        }

        if (setting.method !== 'none') {
          const exists = filteredFieldList.some(field => field.code === setting.method);
          if (!exists) {
            missingFields.push(`[端数処理方法] ${setting.method}`);
          }
        }

        if (setting.location !== 'none') {
          const exists = filteredFieldList.some(field => field.code === setting.location);
          if (!exists) {
            missingFields.push(`[端数処理桁数] ${setting.location}`);
          }
        }

        if (setting.destination !== 'none') {
          const exists = filteredFieldList.some(field => field.code === setting.destination);
          if (!exists) {
            missingFields.push(`[結果格納先] ${setting.destination}`);
          }
        }
      }

      const uniqueMissingFields = [...new Set(missingFields)];

      if (uniqueMissingFields.length > 0) {
        const fieldHtml = uniqueMissingFields
          .map((code) => `・${code}`)
          .join('<br>');

        obj.displayAlert(
          '警告',
          '「端数計算プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          fieldHtml +
          '<br><br>プラグイン設定を修正してください。',
          'error',
          'OK'
        );
      }

      return e;
    },
      
    /**
     * [指定したフィールドが存在するか確認]
     * @param {object} setting [プラグイン設定]
     * @param {object} record  [イベント実行時のフォーム情報]
     * @returns [存在しない場合true 存在する場合false]
     */
    existenceCheck : function(setting, record) {
      return !(obj.getField(setting.target, record)
            && obj.getField(setting.method, record)
            && obj.getField(setting.location, record)
            && obj.getField(setting.destination, record)
            );
    },

    displayAlert : function(title ,text, type, button){
      swal.fire({
        title: title,
        html: text,
        icon: type,
        confirmButtonText: button
      })
    },

    computeMain : function(e) {
      for(const setting of obj.config.settings) {
        //[フィールド存在チェック]
        if(obj.existenceCheck(setting, e.record)) continue;
        //[計算し結果を格納する]
        obj.computeAndStore(setting, e);
      }
      return e;
    },

    jsonParse : function() {
      try{
        obj.config.settings = JSON.parse(obj.config.settings);
      }catch(ignore){
      }
    },

    /**
     * [指定したフィールドが存在するか確認]
     * @param {object} setting [プラグイン設定]
     * @param {object} record  [イベント実行時のフォーム情報]
     * @returns [存在しない場合true 存在する場合false]
     */
    existenceCheck : function(setting, record) {
      return !(obj.getField(setting.target, record)
            && obj.getField(setting.method, record)
            && obj.getField(setting.location, record)
            && obj.getField(setting.destination, record)
            );
    },

    getField : function(code, record){
      if(!code) return '';
      const s = code.split('　');
      if (s.length == 1) return record[code];
      const tableField = record[s[0]];
      if (!tableField) return record[s[1]];
      if (!tableField.value) return null;
      if (!tableField.value[0]) return null;
      return tableField.value[0].value[s[1]];
    },

    getCodePart : function(code){
      const s = code.split('　');
      return (s.length == 1) ? s[0] : s[1];
    },

    computeAndStore : function(setting, {record}) {
      
        const targetSplit = setting.target.split('　');
      const targetName = targetSplit.length === 1 ? targetSplit[0] : targetSplit[1];
      const methodSplit = setting.method.split('　');
      const methodName = methodSplit.length === 1 ? methodSplit[0] : methodSplit[1];
      const locationSplit = setting.location.split('　');
      const locationName = locationSplit.length === 1 ? locationSplit[0] : locationSplit[1];
      const destinationSplit = setting.destination.split('　');
      const destinationName = destinationSplit.length === 1 ? destinationSplit[0] : destinationSplit[1]
      
      let tablecode = ''
      if (targetSplit.length !== 1) {
        tablecode = targetSplit[0];
        if (!record[tablecode]) tablecode = '';
      }

      if(tablecode == '') {

        const targetFieldValue   = record[targetName].value;
        const methodFieldValue   = record[methodName].value;
        const locationFieldValue = record[locationName].value;
        const destinationField   = record[destinationName];
        if(!(targetFieldValue && methodFieldValue && locationFieldValue)) return;
        //[選択した端数処理の場所を数値変換する]
        const digitNumber = obj.getNumberOfProcessingDigit(locationFieldValue);
        //[指定した端数処理方法で計算を行う]
        const resultValue = obj.fractionProcessing(methodFieldValue, targetFieldValue, digitNumber);
        //[結果格納先フィールドに計算結果を格納]
        destinationField.value = resultValue;

      } else {
        const tableField = record[tablecode];
        const outMethodField = record[methodName];
        const outLocationField = record[locationName];

        for(const row of tableField.value){
          const targetFieldValue   = row.value[targetName].value;
          const methodFieldValue   = outMethodField ? outMethodField.value : row.value[methodName].value;
          const locationFieldValue = outLocationField ? outLocationField.value : row.value[locationName].value;
          const destinationField   = row.value[destinationName];
          if(!(targetFieldValue && methodFieldValue && locationFieldValue)) return;
          //[選択した端数処理の場所を数値変換する]
          const digitNumber = obj.getNumberOfProcessingDigit(locationFieldValue);
          //[指定した端数処理方法で計算を行う]
          const resultValue = obj.fractionProcessing(methodFieldValue, targetFieldValue, digitNumber);
          //[結果格納先フィールドに計算結果を格納]
          destinationField.value = resultValue;
        }
      }
    },


    /**
     * [選択した端数処理の場所を数値変換する]
     * @param {*} locationFieldValue [端数処理の場所]
     * @returns [端数処理の場所に対応した数値]
     */
    getNumberOfProcessingDigit : function(locationFieldValue) {
      switch(locationFieldValue){
        case '100円単位':
          return 0.001;
        case '10円単位':
          return 0.01;
        case '1円単位':
          return 0.1;
        case '小数点第一位':
          return 1;
        case '小数点第二位':
          return 10;
        case '小数点第三位':
          return 100;
      }
    },

    /**
     * [指定した端数処理方法で計算を行う]
     * @param {String} methodFieldValue 
     * @param {String} targetFieldValue 
     * @param {Number} digitNumber 
     * @returns [端数処理を行った数値]
     */
    fractionProcessing : function(methodFieldValue, targetFieldValue, digitNumber) {
      switch(methodFieldValue){
        case '切り上げ':
          return Math.ceil(targetFieldValue * digitNumber) / digitNumber;
        case '切り捨て':
          return Math.floor(targetFieldValue * digitNumber) / digitNumber;
        case '四捨五入':
          return Math.round(targetFieldValue * digitNumber) / digitNumber;
      }
    },


    /**
     * @param {String} code [編集不可にするフィールドコード] 
     * @param {object} record    [イベントで受け取るフォーム情報] 
     * [取得したフィールドコードを編集不可にする]
     */
    disabled : function(code, record) {
      
       const codeSplit = code.split('　');
      const codeName = codeSplit.length === 1 ? codeSplit[0] : codeSplit[1];

      let tableCode = ""

      if (codeSplit.length !== 1) {
        tableCode = codeSplit[0];
        if (!record[tableCode]) tableCode = '';
      }

      if(tableCode == '') {
        if(record[codeName] === undefined) return;
        const field = record[codeName];
        field.disabled = true;
      }else {
        const tableField = record[tableCode];
        tableField.value.forEach(row => {
          if(row.value[codeName] === undefined) return;
          const field = row.value[codeName];
          field.disabled = true;
        })
      }
    },


    changeEventCreate : function() {
      //[テーブル内フィールドを使用している設定のみに絞り込む]
      const settingsUsingTable = obj.config.settings.filter(setting => setting.target.split('　').length === 2);

      for(const setting of settingsUsingTable) {
        const tableCode = setting.target.split('　')[0];
        kintone.events.on([`mobile.app.record.create.change.${tableCode}`,`mobile.app.record.edit.change.${tableCode}`], function(e) {
          obj.disabled(setting.destination, e.record);
          return e;
        })
      }
    },

     getFieldList : async function() {
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
    },
  }

  kintone.events.on(obj.showEvents, obj.init);
  kintone.events.on('mobile.app.record.index.show', obj.checkFields);
  
})(jQuery, kintone.$PLUGIN_ID);
