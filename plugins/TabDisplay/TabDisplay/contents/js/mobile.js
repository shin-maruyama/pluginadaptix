// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  const obj = {
    config: kintone.plugin.app.getConfig(PLUGIN_ID),
    events: ['mobile.app.record.create.show', 'mobile.app.record.edit.show', 'mobile.app.record.detail.show'],

    init: async function (e) {
      if (!(await KNTP930310certification())) return e;
      if (!Object.keys(obj.config).length) return e;
      obj.jsonParse();
      obj.allFieldHide();
      obj.groupBorderHide();
      await obj.groupNameHide();
      obj.createTab();
      obj.firstTabField();
      return e;
    },

    jsonParse: function () {
      try {
        obj.config.settings = JSON.parse(obj.config.settings);
        obj.config.buttonHideChecked = JSON.parse(obj.config.buttonHideChecked);
        obj.config.fieldNameHideChecked = JSON.parse(obj.config.fieldNameHideChecked);
      } catch (ignore) { }
    },

    //[選択したフィールドを全て取得する]
    getFieldList: function () {
      const fieldList = [];

      obj.config.settings.forEach((setting) => {
        setting.fields.forEach((field) => fieldList.push(field));
      });
      return fieldList;
    },

    //[選択したグループフィールドを全て取得する]
    getGroupFieldList: function () {
      const fieldList = obj.getFieldList();
      const groupFieldList = fieldList.filter((field) => field.type === 'GROUP');
      return groupFieldList;
    },

    //[グループの枠線を非表示にする]
    groupBorderHide: function () {
      const groupFieldList = obj.getGroupFieldList();
      for (const field of groupFieldList) {
        $(`.field-${field.id}`).css({ 'border-style': 'none' });
      }
    },

    //[グループ名を全て非表示にする]
    groupNameHide: async function () {
      const checked = obj.config.fieldNameHideChecked;
      if (!checked) return;
      // グループを全て開く
      const fieldList2 = await obj.getFieldList2();
      const type = ['GROUP'];
      const filterFieldList = fieldList2.filter((x) => type.includes(x.type));
      for (const field of filterFieldList) {
        kintone.app.record.setGroupFieldOpen(field.code, true);
      }
      // 非表示にする
      $('.group-label-gaia').hide();
    },

    //[選択したフィールドを全て非表示にする]
    allFieldHide: function () {
      const fieldList = obj.getFieldList();
      fieldList.forEach((field) => kintone.mobile.app.record.setFieldShown(field.code, false));
    },

    //[選択したフィールドを全て表示する]
    allFieldShow: function () {
      const fieldList = obj.getFieldList();
      fieldList.forEach((field) => kintone.mobile.app.record.setFieldShown(field.code, true));
    },

    //[最初のTABボタンのフィールドを表示・TAB色変更]
    firstTabField: function () {
      const fieldList = obj.config.settings[0].fields;
      fieldList.forEach((field) => kintone.mobile.app.record.setFieldShown(field.code, true));
      $('.tab').eq(0).css({ 'background-color': obj.config.titleColor });
      $('.tab').eq(0).addClass('active');
    },

    //[全表示タブを作成する]
    showAllTab: function () {
      const tab = $('<span>', {
        text: '全表示',
        class: 'tab',
        click: function () {
          obj.allFieldShow();
          $('.active').removeClass('active');
          $(this).addClass('active');
          $('.tab').css({ 'background-color': 'rgb(228, 230, 231)' });
          $(this).css({ 'background-color': obj.config.titleColor });
        },
        //[カーソルが要素の上にある時]
      }).hover(
        function () {
          $(this).css({
            'background-color': obj.config.titleColor,
          });
          //[カーソルが要素から外れた時]
        },
        function () {
          if ($(this).hasClass('active')) return;
          $(this).css({
            'background-color': '',
          });
        }
      );
      return tab;
    },

    //[タブを作成する]
    createTab: function () {
      const spaceFieldId = obj.config.spaceFieldId;
      const settings = obj.config.settings;
      const checked = obj.config.buttonHideChecked;

      //[スペースフィールドの要素取得]
      const space = kintone.mobile.app.record.getSpaceElement(spaceFieldId);

      if (obj.config.tabWidth) {
        space.style.maxWidth = obj.config.tabWidth + 'px';
        space.style.wordWrap = 'break-word';
        space.style.whiteSpace = 'normal';
      }


      settings.forEach((setting) => {
        //[TABタイトル作成]
        const tab = $('<span>', {
          text: setting.tabName,
          class: 'tab',
          click: function () {
            obj.allFieldHide();
            setting.fields.forEach((field) => kintone.mobile.app.record.setFieldShown(field.code, true));

            $('.active').removeClass('active');
            $(this).addClass('active');
            $('.tab').css({ 'background-color': 'rgb(228, 230, 231)' });
            $(this).css({ 'background-color': obj.config.titleColor });
          },
          //[カーソルが要素の上にある時]
        }).hover(
          function () {
            $(this).css({
              'background-color': obj.config.titleColor,
            });
            //[カーソルが要素から外れた時]
          },
          function () {
            if ($(this).hasClass('active')) return;
            $(this).css({
              'background-color': '',
            });
          }
        );
        $(space).append(tab);
      });
      //[「全表示TABタイトルを表示しない」がチェックされていない場合、全画面表示]
      if (checked) return;
      const showAllTab = obj.showAllTab();
      $(space).append(showAllTab);
    },

    getFieldList2: async function () {
      const fieldList = [];
      try {
        const resp = await kintone.api('/k/v1/app/form/layout.json', 'GET', { app: kintone.mobile.app.getId() });
        resp.layout.forEach(row => {
          if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push({
            type: field.type,
            code: field.code ? field.code : '',
            id: field.id,
            properties: field.properties,
            elementId: field.elementId ? field.elementId : field.code,
            label: field.code ? field.code : field.elementId,
          }));
          else if (row.type === 'SUBTABLE') fieldList.push(row);
          else if (row.type === 'GROUP') {
            fieldList.push({
              type: row.type,
              code: row.code,
              id: row.id,
              properties: row.properties,
              elementId: '',
              label: row.code,
            });
            //row.layout.forEach(childRow => childRow.fields.forEach(field => fieldList.push(field)));
            row.layout.forEach((childRow) => childRow.fields.forEach((field) => {
              fieldList.push({
                type: field.type,
                code: field.code ? field.code : '',
                id: field.id,
                properties: field.properties,
                elementId: field.elementId ? field.elementId : field.code,
                label: field.code ? row.code + '　' + field.code : row.code + '　' + field.elementId,
              })
            }
              //fieldList.push(field)
            ));
          };
        })

        let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
        fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];

        fieldList.forEach(field => {
          const target = fieldList2.find(x => x.var === field.code);
          if (!target) return;
          field.id = target.id;
          field.properties = target.properties;


          if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
          field.label = field.code;
          field.fields.forEach(inField => {
            const inTarget = Object.values(target.fieldList).find(x => x.var === inField.code);
            inField.id = inTarget.id;
            inField.properties = inTarget.properties;
            inField.label = inField.code;
          })
        })
      } catch { }
      return fieldList;
    },

    checkFields: async function (e) {
      if (!(await KNTP930310certification())) return e;
      if (!Object.keys(obj.config).length) return e;
      obj.jsonParse();

      const fieldList2 = await obj.getFieldList2();
      const fieldList = obj.getFieldList();

      if (!fieldList2 || !fieldList2.length) return e;

      const missingFields = [];

      // TABタイトル表示スペースの存在確認
      if (obj.config.spaceFieldId && obj.config.spaceFieldId !== 'none') {
        const spaceExists = fieldList2.some(field => field.elementId === obj.config.spaceFieldId);
        if (!spaceExists) {
          missingFields.push(`[TABタイトル表示スペース] ${obj.config.spaceFieldId}`);
        }
      }

      // TAB表示対象フィールドの存在確認
      if (fieldList && fieldList.length) {
        for (const field of fieldList) {
          if (field.code && field.code !== 'none') {
            const fieldExists = fieldList2.some(field2 => field2.code === field.code);
            if (!fieldExists) {
              missingFields.push(`[TAB表示対象] ${field.code}`);
            }
          }
        }
      }

      const uniqueMissingFields = [...new Set(missingFields)];

      if (uniqueMissingFields.length > 0) {
        const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
        const fieldHtml = uniqueMissingFields.map((code) => `・${code}`).join('<br>');

        obj.displayAlert(
          '2',
          '警告',
          '「TAB表示プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          fieldHtml +
          '<br><br>プラグイン設定を修正してください。',
          imageUrl,
          'OK'
        );
      }

      return e;
    },

    displayAlert: function (flag, title, text, type, button) {
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
    },

  };

  kintone.events.on('mobile.app.record.index.show', obj.checkFields);
  kintone.events.on(obj.events, obj.init);

})(jQuery, kintone.$PLUGIN_ID);