// Copyright (C) All in one Allright Reserved. 


jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';
  function handleKintoneApiError(error) {
    const message = error && error.message ? error.message : 'kintone REST APIの呼び出しに失敗しました。';
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'error',
        title: 'エラー',
        text: message
      });
    } else if (typeof alert === 'function') {
      alert(message);
    }
    throw error;
  }

  function callKintoneApi(...args) {
    return kintone.api.apply(kintone, args).catch(handleKintoneApiError);
  }


  if (!(await KNTP421310certification())) {
    return false;
  }

  const obj = {
    config: kintone.plugin.app.getConfig(PLUGIN_ID),
    events: {
      show: ['mobile.app.record.create.show', 'mobile.app.record.edit.show'],
      event: ['mobile.app.record.index.show'],
    },


    init: function (e) {
      if (!Object.keys(obj.config).length) return e;
      obj.jsonParse();
      //[画面表示時に変換先フィールドを編集不可にする]
      /*for (const setting of obj.config.settings) {
        obj.disabled(setting.destinationField.code, e.record);
      }
      //[テーブル行追加時に変換先フィールドを編集不可にする]
      obj.tableChangeEventCreate(e.record);*/

      for (const setting of obj.config.settings) {
        //[フィールド存在チェック]
        if (obj.existenceCheck(setting, e)) continue;
        //[変換元フィールドに文字が入力されたら、変換先フィールドにふりがなを表示する処理]
        obj.furiganaConversion(setting, e.record);
      }

      return e;
    },


    clearDestinationWhenSourceEmpty: function (sourceField, destinationField) {
      sourceField.off('input.automaticFuriganaClear change.automaticFuriganaClear');
      sourceField.on('input.automaticFuriganaClear change.automaticFuriganaClear', function () {
        if ($(this).val() === '') {
          destinationField.val('').change();

          if ($(this).is(':focus')) {
            $(this).trigger('blur');
            $(this).trigger('focus');
          }
        }
      });
    },

    furiganaConversion: function (setting, record) {
      //[テーブル内フィールドの場合]
      if (setting.sourceField.code.split('　').length === 2) {


        const tableCode = setting.sourceField.code.split('　')[0];

        if (record[tableCode]) {

          const inTableFieldList = Object.values(Object.values(cybozu.data.page.FORM_DATA.schema.subTable).find(_ => _.var === tableCode).fieldList);

          const subTableId = Object.values(cybozu.data.page.FORM_DATA.schema.subTable).find(_ => _.var === tableCode).id;
          const sourceFieldId = inTableFieldList.find(x => x.var === setting.sourceField.code.split('　')[1]).id;
          const destinationFieldId = inTableFieldList.find(x => x.var === setting.destinationField.code.split('　')[1]).id;


          for (const row of $(`.subtable-${subTableId} .subtable-row-gaia`)) {
            const sourceField = $(row).find(`.value-${sourceFieldId} input`);
            const destinationField = $(row).find(`.value-${destinationFieldId} input`);
            const katakanaCheck = setting.format;

            /**
             * [設定したふりがな形式を変換先フィールドに表示する]
             * [変換元フィールドに文字が入力されたら、変換先フィールドにふりがなを表示する]
             */
            if (katakanaCheck === "katakana") {
              destinationField.attr('placeholder', '(フリガナ)');
              $.fn.autoKana(sourceField, destinationField, { katakana: true });
              obj.clearDestinationWhenSourceEmpty(sourceField, destinationField);

              if (sourceField.is(':focus')) {
                sourceField.trigger('blur');
                sourceField.trigger('focus');
              }
            }
            if (katakanaCheck === "hiragana") {
              destinationField.attr('placeholder', '(ふりがな)');
              $.fn.autoKana(sourceField, destinationField);
              obj.clearDestinationWhenSourceEmpty(sourceField, destinationField);

              if (sourceField.is(':focus')) {
                sourceField.trigger('blur');
                sourceField.trigger('focus');
              }
            }
          }
        } else {
          const sourceField = $(`.value-${setting.sourceField.id} input`);
          const destinationField = $(`.value-${setting.destinationField.id} input`);
          const katakanaCheck = setting.format;

          /**
           * [設定したふりがな形式を変換先フィールドに表示する]
           * [変換元フィールドに文字が入力されたら、変換先フィールドにふりがなを表示する]
           */
          if (katakanaCheck === "katakana") {
            destinationField.attr('placeholder', '(フリガナ)');
            $.fn.autoKana(sourceField, destinationField, { katakana: true });
              obj.clearDestinationWhenSourceEmpty(sourceField, destinationField);

              if (sourceField.is(':focus')) {
                sourceField.trigger('blur');
                sourceField.trigger('focus');
              }
          }
          if (katakanaCheck === "hiragana") {
            destinationField.attr('placeholder', '(ふりがな)');
            $.fn.autoKana(sourceField, destinationField);
              obj.clearDestinationWhenSourceEmpty(sourceField, destinationField);

              if (sourceField.is(':focus')) {
                sourceField.trigger('blur');
                sourceField.trigger('focus');
              }
          }
        }

        //[テーブル外フィールドの場合]
      } else {
        const sourceField = $(`.value-${setting.sourceField.id} input`);
        const destinationField = $(`.value-${setting.destinationField.id} input`);
        const katakanaCheck = setting.format;

        /**
         * [設定したふりがな形式を変換先フィールドに表示する]
         * [変換元フィールドに文字が入力されたら、変換先フィールドにふりがなを表示する]
         */
        if (katakanaCheck === "katakana") {
          destinationField.attr('placeholder', '(フリガナ)');
          $.fn.autoKana(sourceField, destinationField, { katakana: true });
              obj.clearDestinationWhenSourceEmpty(sourceField, destinationField);

              if (sourceField.is(':focus')) {
                sourceField.trigger('blur');
                sourceField.trigger('focus');
              }
        }
        if (katakanaCheck === "hiragana") {
          destinationField.attr('placeholder', '(ふりがな)');
          $.fn.autoKana(sourceField, destinationField);
              obj.clearDestinationWhenSourceEmpty(sourceField, destinationField);

              if (sourceField.is(':focus')) {
                sourceField.trigger('blur');
                sourceField.trigger('focus');
              }
        }
      }
    },


    jsonParse: function () {
      try {
        obj.config.settings = JSON.parse(obj.config.settings);
        console.log(obj.config);
      } catch (ignore) {
      }
    },


    /**
     * @param {String} fieldCode [編集不可にするフィールドコード] 
     * @param {object} record    [イベントで受け取るフォーム情報] 
     * [取得したフィールドコードを編集不可にする]
     */
    disabled: function (fieldCode, record) {
      const isOutsideTheTable = fieldCode.split('　').length === 1;

      if (isOutsideTheTable) {
        const field = record[fieldCode];
        const isExistingField = field !== undefined;
        if (!isExistingField) return;
        field.disabled = true;
      } else {
        const tableCode = fieldCode.split('　')[0];
        fieldCode = fieldCode.split('　')[1];


        if (!record[tableCode]) {
          const field = record[fieldCode];
          const isExistingField = field !== undefined;
          if (!isExistingField) return;
          field.disabled = true;

        }
        else {
          const tableField = record[tableCode];
          const isExistingTable = tableField !== undefined;
          if (!isExistingTable) return;
          tableField.value.forEach(row => {
            const field = row.value[fieldCode];
            const isExistingField = field !== undefined;
            if (!isExistingField) return;
            field.disabled = true;
          })
        }

      }
    },


    /**
     * [指定したフィールドが存在するか確認]
     * @param {object} setting [プラグイン設定]
     * @param {object} record  [イベント実行時のフォーム情報]
     * @returns [存在しない場合true 存在する場合false]
     */
    existenceCheck: function (setting, { record }) {
      const isOutsideTheTable = setting.sourceField.code.split('　').length === 1;

      if (isOutsideTheTable) {
        const sourceField = record[setting.sourceField.code];
        const destinationField = record[setting.destinationField.code];
        if (!(sourceField && destinationField)) return true;
        return false;

      } else {
        const tableField = record[setting.sourceField.code.split('　')[0]];
        //if (!tableField) return true;
        if (!tableField) {
          const sourceField = record[setting.sourceField.code.split('　')[1]];
          const destinationField = record[setting.destinationField.code.split('　')[1]];
          if (!(sourceField && destinationField)) return true;
          return false;
        } else {
          const sourceField = tableField.value[0].value[setting.sourceField.code.split('　')[1]];
          const destinationField = tableField.value[0].value[setting.destinationField.code.split('　')[1]];
          if (!(sourceField && destinationField)) return true;
          return false;
        }
      }
    },


    tableChangeEventCreate: function (record) {
      const tableUseSettingList = obj.config.settings.filter(x => x.sourceField.code.split('　').length === 2);
      for (const setting of tableUseSettingList) {
        const tableCode = setting.sourceField.code.split('　')[0];
        if (record[tableCode]) {
          kintone.events.on([`mobile.app.record.create.change.${tableCode}`, `mobile.app.record.edit.change.${tableCode}`], function (e) {
            obj.disabled(setting.destinationField.code, e.record);
            obj.furiganaConversion(setting, e.record);
            return e;
          })
        }
      }
    },

    checkFields: async function () {
      if (!Object.keys(obj.config).length) return;
      obj.jsonParse();
      if (!obj.config.settings || !obj.config.settings.length) return;

      const fieldList = await obj.getFieldList();
      if (!fieldList || !fieldList.length) return;

      const missingFields = [];

      for (const setting of obj.config.settings) {
        if (
          setting.sourceField.code &&
          setting.sourceField.code !== 'none'
        ) {
          const source = fieldList.find((x) => x.code === setting.sourceField.code);
          if (!source) {
            missingFields.push(`[変換元フィールド] ${setting.sourceField.code}`);
          }
        }

        if (
          setting.destinationField.code &&
          setting.destinationField.code !== 'none'
        ) {
          const destination = fieldList.find((x) => x.code === setting.destinationField.code);
          if (!destination) {
            missingFields.push(`[変換先フィールド] ${setting.destinationField.code}`);
          }
        }
      }

      const uniqueMissingFields = [...new Set(missingFields)];

      if (uniqueMissingFields.length > 0) {
        const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
        const fieldHtml = uniqueMissingFields
          .map((code) => `・${code}`)
          .join('<br>');

        obj.displayAlert(
          '警告',
          '「ふりがな自動入力プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          fieldHtml +
          '<br><br>プラグイン設定を修正してください。',
          imageUrl,
          'OK'
        );
      }
    },

    getFieldList: async function () {
      const fieldList = [];
      try {
        const resp = await callKintoneApi(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', { app: kintone.mobile.app.getId() });
        resp.layout.forEach(row => {
          if (row.type === 'ROW') row.fields.forEach(field => fieldList.push(field));
          else if (row.type === 'SUBTABLE') {
            fieldList.push(row);
            row.fields.forEach(field => {
              const fieldInfo = {
                type: field.type,
                code: `${row.code}　${field.code}`,
              };
              fieldList.push(fieldInfo);
            })
          }
          else if (row.type === 'GROUP') {
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
          };
        })

        let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
        fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];

        fieldList.forEach(field => {
          if (field.code.split('　').length === 2 && field.type !== 'SUBTABLE') {
            var code = field.code.split('　')[1];
          } else {
            var code = field.code;
          }
          const target = fieldList2.find(x => x.var === code);
          if (!target) return;
          field.id = target.id;
          field.properties = target.properties;
          field.label = target.label;

          if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
          field.fields.forEach(inField => {
            const inTarget = Object.values(target.fieldList).find(x => x.var === inField.code);
            inField.id = inTarget.id;
            inField.properties = inTarget.properties;
            inField.label = inTarget.label;
          })
        })
      } catch (ignore) {

      }
      return fieldList;
    },

    displayAlert: function (title, text, type, button) {
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

  }

  kintone.events.on(obj.events.show, obj.init);
  kintone.events.on(obj.events.event, obj.checkFields);

})(jQuery, kintone.$PLUGIN_ID);