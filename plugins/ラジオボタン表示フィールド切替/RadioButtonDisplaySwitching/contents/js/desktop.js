// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  try {
    if (Object.keys(config).length) {

      config.settings = JSON.parse(config.settings);
      config.groupNameHideCheck = JSON.parse(config.groupNameHideCheck);
    }
    //console.log(config);
  } catch (ignore) { }

  const obj = {
    events1: {},
    events2: {},
  };

  obj.events1.type = ['app.record.create.show', 'app.record.edit.show', 'app.record.detail.show'];
  obj.events1.fieldList = [];
  obj.events1.groupFieldList = {}; // グループ名をキーとした、「グループに属するフィールドの配列」を値とした連想配列
  obj.events2.type = ['app.record.index.show'];
  obj.formFields = {};

  obj.events1.handler = async function (e) {

    if (!(await KNTP484410certification())) return e;
    // if (!Object.keys(config).length) return e;

    // 新規作成時の本関数動作タイミングではまだフィールドに初期値が入っていないため、ここでフォーム設定情報を取得しておく。
    obj.formFields = await kintone.api(kintone.api.url('/k/v1/app/form/fields.json', true), 'GET', { app: kintone.app.getId() });

    if (!config.settings || !config.settings.length) return e;
    obj.events1.fieldList = await obj.events2.getFieldList();
    const type = ['GROUP'];
    var filterFieldList = obj.events1.fieldList.filter((x) => type.includes(x.type));
    if (filterFieldList && filterFieldList.length) {
      for (const field of filterFieldList) {
        kintone.app.record.setGroupFieldOpen(field.code, true);
        obj.events1.groupFieldList[field.code] = [];
      }
      obj.events1.groupNameHide(config);
    }

    for (const field of obj.events1.fieldList) {
      if (!field.label) continue;
      const fields = field.label.split('　');
      if (fields.length == 2) {
        obj.events1.groupFieldList[fields[0]].push(fields[1]);
      }
    }

    obj.events1.displayHandler(e);

    //[ラジオボタンフィールドに、関連フィールドの情報を属性として与える]
    let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
    fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];

    for (let i = 0; i < config.settings.length; i++) {
      const setting = config.settings[i];
      const target = fieldList2.find((x) => x.var === setting.radioSelect);
      if (!target) continue;
      const fieldWrap2 = document.querySelector(`.field-${target.id}`);
      if (!fieldWrap2) continue;
      fieldWrap2.setAttribute('radioButtonPlugin', JSON.stringify(setting.categories));
    }

    if (e.type === 'app.record.detail.show') return e;

    for (let i = 0; i < config.settings.length; i++) {
      const setting = config.settings[i];

      //[切替用フィールドが存在しない場合処理を飛ばす]
      if (!e.record[setting.radioSelect]) continue;

      kintone.events.on(
        [`app.record.create.change.${setting.radioSelect}`, `app.record.edit.change.${setting.radioSelect}`],
        obj.events1.displayHandler
      );
    }
    return e;
  };

  obj.events2.handler = async function (e) {
    if (!(await KNTP484410certification())) return e;
    if (!config.settings || !config.settings.length) return e;

    const fieldList = await obj.events2.getFieldList();
    const missingFields = [];

    for (let i = 0; i < config.settings.length; i++) {
      const setting = config.settings[i];

      // 切替用ラジオボタンの存在確認
      if (setting.radioSelect && setting.radioSelect !== '') {
        const switcherSelect = fieldList.find((x) => x.code === setting.radioSelect);
        if (!switcherSelect) {
          missingFields.push(obj.events2.createMissingFieldInfo({
            settingIndex: i + 1,
            settingName: '切替用ラジオボタン',
            fieldCode: setting.radioSelect,
          }));
        }
      }

      // 表示対象フィールドの存在確認
      for (let j = 0; j < setting.categories.length; j++) {
        const category = setting.categories[j];
        for (let k = 0; k < category.fields.length; k++) {
          const field = category.fields[k];
          if (field && field !== '') {
            const re = fieldList.find((x) => x.code === field);
            if (!re) {
              missingFields.push(obj.events2.createMissingFieldInfo({
                settingIndex: i + 1,
                settingName: '表示対象フィールド',
                fieldCode: field,
                categoryName: category.categoryName,
              }));
            }
          }
        }
      }
    }

    const uniqueMissingFields = obj.events2.uniqueMissingFields(missingFields);

    if (uniqueMissingFields.length > 0) {
      const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';

      obj.events2.displayAlert(
        '警告',
        obj.events2.createWarningHtml('ラジオボタン表示フィールド切替', uniqueMissingFields),
        imageUrl,
        'OK'
      );
    }

    return e;
  };

  obj.events2.escapeHtml = function (value) {
    return String(value ?? '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[char];
    });
  };

  obj.events2.createMissingFieldInfo = function ({ settingIndex, settingName, fieldCode, categoryName = '' }) {
    return {
      key: [settingIndex, settingName, categoryName, fieldCode].join('|'),
      settingIndex,
      settingName,
      fieldCode,
      fieldName: '未保存（設定値にフィールド名は保存されていません）',
      categoryName,
      currentState: 'このフィールドはアプリ内に存在しません。フィールドコードが変更された、またはフィールドが削除された可能性があります。',
    };
  };

  obj.events2.uniqueMissingFields = function (missingFields) {
    const keys = new Set();
    return missingFields.filter((field) => {
      if (keys.has(field.key)) return false;
      keys.add(field.key);
      return true;
    });
  };

  obj.events2.createWarningHtml = function (featureName, missingFields) {
    const rows = missingFields.map((field, index) => {
      const categoryLine = field.categoryName
        ? '<br>対象カテゴリ:<br>' + obj.events2.escapeHtml(field.categoryName)
        : '';

      return [
        'No.' + (index + 1),
        '<br>対象機能:<br>' + obj.events2.escapeHtml(featureName),
        '<br>設定番号:<br>' + obj.events2.escapeHtml(field.settingIndex),
        '<br>設定項目:<br>' + obj.events2.escapeHtml(field.settingName),
        categoryLine,
        '<br>保存されているフィールドコード:<br>' + obj.events2.escapeHtml(field.fieldCode),
        '<br>保存されているフィールド名:<br>' + obj.events2.escapeHtml(field.fieldName),
        '<br>現在の状態:<br>' + obj.events2.escapeHtml(field.currentState),
      ].join('');
    }).join('<br><br>');

    return 'プラグイン設定で指定されているフィールドが見つかりません。<br><br>' +
      rows +
      '<br><br>プラグイン設定画面を開き、対象フィールドを再設定してください。';
  };

  /**
   * [フィールド表示切替]
   * @param {Object} e [イベントオブジェクト]
   */
  obj.events1.displayHandler = function (e) {
    // 各対象項目の表示有無を決定する
    const displayState = obj.events1.getDisplayState(e);
    // 非表示扱いのフィールドの値を消去する
    obj.events1.clearValue(e.record, displayState);
    // 各対象項目の表示有無を設定する
    obj.events1.showHide(displayState);
  };

  /**
   * [フィールド表示状態取得]
   * @param {Object} record [レコードオブジェクト]
   */
  obj.events1.getDisplayState = function (e) {
    const record = e.record;
    const state = {};
    // 設定が存在しない場合何もしない
    if (!config.settings || !config.settings.length) return state;
    // 各設定を上から処理
    for (let i = 0; i < config.settings.length; i++) {
      const setting = config.settings[i];
      // [切替用フィールドが存在しない場合処理を飛ばす]
      if (!record[setting.radioSelect]) continue;

      // 当該設定の全選択肢に含まれる項目を非表示とする
      // グループが指定されていれば、グループ内のフィールドも非表示とする
      const hideFieldList = obj.events1.getAllFieldList(setting);
      for (const hideField of hideFieldList) {
        state[hideField] = false;
        if (obj.events1.groupFieldList[hideField]) {
          for (const field2 of obj.events1.groupFieldList[hideField]) {
            state[field2] = false;
          }
        }
      }

      // [切替用フィールドが既に非表示になっている場合、表示処理を飛ばす]
      if (state[setting.radioSelect] === false) continue;

      //[他のプラグインで、非表示にされている場合に、処理をとばす。]
      let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
      fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
      const target = fieldList2.find((y) => y.var === setting.radioSelect);
      if (!target) continue;

      const fieldWrap2 = document.querySelector(`.field-${target.id}`);
      if (!fieldWrap2) continue;
      if (fieldWrap2.hasAttribute('field-hidden-by')) continue;
      if (fieldWrap2.style.display === 'none') continue;

      // 切替用フィールドで選択中の値を取得
      let switcherValue = record[setting.radioSelect].value;
      // 新規作成画面を開いて起動した、かつswitcherValueが空白の場合は初期値で処理する
      if (switcherValue == "" && e.type == 'app.record.create.show') {
        switcherValue = obj.formFields.properties[setting.radioSelect].defaultValue;
      }
      // 空文字列の場合、処理をスキップ
      if (!switcherValue) continue;

      // 表示対象を取得
      const targetCategory = setting.categories.find((x) => x.categoryName === switcherValue);
      if (!targetCategory) continue;
      const showFieldList = targetCategory.fields;

      for (const showField of showFieldList) {
        state[showField] = true;
        if (obj.events1.groupFieldList[showField]) {
          for (const field2 of obj.events1.groupFieldList[showField]) {
            state[field2] = true;
          }
        }
      }
    }
    return state;
  };

  /**
   * [値クリア]
   * @param {Object} record [レコードオブジェクト]
   * @param {Object} state [表示有無オブジェクト]
   */
  obj.events1.clearValue = function (record, state) {
    for (const field in state) {
      // 表示する項目であればスキップ
      if (state[field]) continue;
      if (record.hasOwnProperty(field)) {
        // 通常項目の場合
        const re = record[field];
        // 型により分岐
        switch (re.type.toUpperCase()) {
          // 集合型
          case 'CHECK_BOX':
          case 'MULTI_SELECT':
          case 'USER_SELECT':
          case 'ORGANIZATION_SELECT':
          case 'GROUP_SELECT':
            re.value = [];
            break;
          // サブテーブル
          case 'SUBTABLE':
            re.value.forEach(function (row) {
              Object.keys(row.value).forEach(function (key) {
                if (
                  row.value[key].type == 'CHECK_BOX' ||
                  row.value[key].type == 'MULTI_SELECT' ||
                  row.value[key].type == 'USER_SELECT' ||
                  row.value[key].type == 'ORGANIZATION_SELECT' ||
                  row.value[key].type == 'GROUP_SELECT'
                ) {
                  row.value[key].value = [];
                } else {
                  row.value[key].value = '';
                }
              });
            });
            break;
          // 一般の項目
          default:
            re.value = '';
            break;
        }
      }
    }
  };

  /**
   * [フィールドの表示/非表示]
   * @param {Object} state [表示有無オブジェクト]
   */
  obj.events1.showHide = function (state) {
    for (const field in state) {
      if (!obj.events1.hasAttributefieldHidden(field)) {
        kintone.app.record.setFieldShown(field, state[field]);
      }
    }
  };

  /**
   * [非表示プラグインにより非表示設定されていないか調べる]
   * @param {Object} field [表示有無オブジェクト]
   * @retuen {boolean} [非表示設定されていればtrue、されていなければfalse]
   */
  obj.events1.hasAttributefieldHidden = function (fieldorigin) {
    if (!fieldorigin || fieldorigin == "undefined") { return true; }
    const filedSplit = fieldorigin.split('　');
    const field = filedSplit.length == 2 ? filedSplit[1] : filedSplit[0];
    let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
    fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
    const target = fieldList2.find((x) => x.var == field);
    if (!target) return true;

    let fieldWrap2 = null;
    if (target.type != undefined) {
      fieldWrap2 = document.querySelector(`.field-${target.id}`);
    } else {
      fieldWrap2 = document.querySelector(`.subtable-row-${target.id}`);
    }
    if (!fieldWrap2) return true;

    return fieldWrap2.hasAttribute('field-hidden-by');
  };

  /**
   * [選択した切替用フィールドに設定されているフィールドを全て取得]
   * @param {Object} setting [プラグイン設定]
   * @returns [フィールドリスト]
   */
  obj.events1.getAllFieldList = function (setting) {
    return setting.categories.flatMap((x) => x.fields);
  };

  /**
   * [指定した切替用フィールドの指定した値に設定されているフィールドを全て取得]
   * @param {Object} setting [プラグイン設定]
   * @param {String} switcherValue [選択した切替用フィールドの値]
   * @returns [フィールドリスト]
   */
  obj.events1.getFieldList = function (setting, switcherValue) {
    const category = setting.categories.find((x) => x.categoryName === switcherValue);
    return category ? category.fields : [];
  };


  /**
   * [グループ名・枠線を非表示にする]
   */
  obj.events1.groupNameHide = function ({ groupNameHideCheck }) {
    if (!groupNameHideCheck) return;
    for (const elem of $('.control-group-field-gaia')) {
      $(elem).css('borderStyle', 'none');
      $(elem).find('.group-label-gaia').hide();
    }
  };

  obj.events2.getFieldList = async function () {
    const fieldList = [];
    try {
      const resp = await kintone.api('/k/v1/app/form/layout.json', 'GET', { app: kintone.app.getId() });
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
          row.layout.forEach((childRow) => childRow.fields.forEach((field) => {
            fieldList.push({
              type: field.type,
              code: field.code ? field.code : '',
              id: field.id,
              properties: field.properties,
              elementId: field.elementId ? field.elementId : field.code,
              label: field.code ? row.code + '　' + field.code : row.code + '　' + field.elementId,
            });
          }
          ));
        }
      });

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
          if (!inTarget) return;
          inField.id = inTarget.id;
          inField.properties = inTarget.properties;
          inField.label = inField.code;
        });
      });
    } catch { }
    return fieldList;
  };

  obj.events2.displayAlert = function (title, text, type, button) {
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

  kintone.events.on(obj.events1.type, obj.events1.handler);
  kintone.events.on(obj.events2.type, obj.events2.handler);
})(jQuery, kintone.$PLUGIN_ID);
