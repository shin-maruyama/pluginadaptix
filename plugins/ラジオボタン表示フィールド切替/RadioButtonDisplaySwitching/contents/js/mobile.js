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

  obj.events1.type = ['mobile.app.record.create.show', 'mobile.app.record.edit.show', 'mobile.app.record.detail.show'];
  obj.events1.fieldList = [];
  obj.events1.groupFieldList = {}; // グループ名をキーとした、「グループに属するフィールドの配列」を値とした連想配列
  obj.events2.type = ['mobile.app.record.index.show'];
  obj.formFields = {};

  obj.events1.handler = async function (e) {

    if (!(await KNTP484410certification())) return e;
    // if (!Object.keys(config).length) return e;

    // 新規作成時の本関数動作タイミングではまだフィールドに初期値が入っていないため、ここでフォーム設定情報を取得しておく。
    obj.formFields = await kintone.api(kintone.api.url('/k/v1/app/form/fields.json', true), 'GET', { app: kintone.mobile.app.getId() });

    if (!config.settings || !config.settings.length) return e;
    obj.events1.fieldList = await obj.events2.getFieldList();
    const type = ['GROUP'];
    var filterFieldList = obj.events1.fieldList.filter((x) => type.includes(x.type));
    if (filterFieldList && filterFieldList.length) {
      for (const field of filterFieldList) {
        kintone.mobile.app.record.setGroupFieldOpen(field.code, true);
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
    if (e.type === 'app.record.detail.show') return e;

    for (let i = 0; i < config.settings.length; i++) {
      const setting = config.settings[i];

      //[切替用フィールドが存在しない場合処理を飛ばす]
      if (!e.record[setting.radioSelect]) continue;

      kintone.events.on(
        [
          `mobile.app.record.create.change.${setting.radioSelect}`,
          `mobile.app.record.edit.change.${setting.radioSelect}`,
        ],
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
          missingFields.push(`[切替用] ${setting.radioSelect}`);
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
              missingFields.push(`[表示対象] ${field}`);
            }
          }
        }
      }
    }

    const uniqueMissingFields = [...new Set(missingFields)];

    if (uniqueMissingFields.length > 0) {
      const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
      const fieldHtml = uniqueMissingFields.map((code) => `・${code}`).join('<br>');

      obj.events2.displayAlert(
        '警告',
        '「ラジオボタン表示フィールド切替プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        imageUrl,
        'OK'
      );
    }

    return e;
  };

  /**
   * [フィールド表示切替]
   * @param {Object} e [イベントオブジェクト]
   */
  obj.events1.displayHandler = function (e) {
    // 各対象項目の表示有無を決定する
    const displayState = obj.events1.getDisplayState(e);
    // 非表示扱いの項目の値を消去する
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

      // 切替用フィールドで選択中の値を取得
      let switcherValue = record[setting.radioSelect].value;
      // 新規作成画面を開いて起動した、かつswitcherValueが空白の場合は初期値で処理する
      if (switcherValue == "" && e.type == 'mobile.app.record.create.show') {
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
      kintone.app.record.setFieldShown(field, state[field]);
    }
  };

  /**
   * [選択した切替用フィールドに設定されているフィールドを全て取得]
   * @param {Object} setting [プラグイン設定]
   * @returns [フィールドリスト]
   */
  obj.events1.getAllFieldList = function (setting) {
    return setting.categories.map((x) => x.fields).flat();
  };

  /**
   * [指定した切替用フィールドの指定した値に設定されているフィールドを全て取得]
   * @param {Object} setting    [プラグイン設定]
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
    for (const elem of $('.control-group-outer-gaia')) {
      $(elem).find('.control-group-label').hide();
    }
  };

  obj.events2.getFieldList = async function () {
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