jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP227410certification())) return;

  // ===== 共通定数 =====
  const REENTRY_BLOCK_MS = 2000;
  const LOCK_GUARD_MS = 15000;
  const EMPTY_TO_BOTTOM = true;

  const RUNKEY = (appId, recordId) => `SubTableAutosortRunning:${appId}:${recordId}`;
  const POSTKEY = (appId, recordId) => `SubTableAutosortPost:${appId}:${recordId}`;

  // ===== フィールド定義キャッシュ（ルックアップ除外のため） =====
  let __FIELDS_DEF_CACHE = null;

  async function getFieldsDef() {
    if (__FIELDS_DEF_CACHE) return __FIELDS_DEF_CACHE;
    __FIELDS_DEF_CACHE = await kintone.api(
      kintone.api.url('/k/v1/app/form/fields.json', true),
      'GET',
      { app: kintone.app.getId() }
    );
    return __FIELDS_DEF_CACHE;
  }

  // サブテーブル内の「ルックアップ取得先（更新不可になりやすい）」フィールドコードを抽出
  async function getLookupReadonlyCodesInSubtable(tableCode) {
    const def = await getFieldsDef();
    const sub = def && def.properties ? def.properties[tableCode] : null;
    const fields = sub && sub.fields ? sub.fields : null;
    if (!fields) return new Set();

    const readonly = new Set();
    Object.keys(fields).forEach((code) => {
      const f = fields[code];
      // 取得先フィールドは lookup 情報を持つことが多く、PUTに含めると失敗要因になる
      if (f && f.lookup) readonly.add(code);
    });
    return readonly;
  }

  // PUT用に、readonlyCodes を含まない行データを作成
  function stripReadonlyFieldsFromRows(rows, readonlyCodes) {
    return rows.map((row) => {
      const newRow = { id: row.id, value: {} };
      Object.keys(row.value || {}).forEach((code) => {
        if (!readonlyCodes.has(code)) {
          newRow.value[code] = row.value[code];
        }
      });
      return newRow;
    });
  }

  function loadPluginConfig() {
    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    if (!config || !config.conf) return [];
    try { return JSON.parse(config.conf) || []; } catch { return []; }
  }

  async function checkConfiguredFields() {
    if (!(await KNTP227410certification())) return;

    const conf = loadPluginConfig();
    if (!conf.length) return;

    let fieldsDef;
    try {
      fieldsDef = await kintone.api(
        kintone.api.url('/k/v1/app/form/fields.json', true),
        'GET',
        { app: kintone.app.getId() }
      );
    } catch (error) {
      console.error('[SubTableAutosort] failed to get form fields:', error);
      return;
    }

    const properties = fieldsDef && fieldsDef.properties ? fieldsDef.properties : {};
    const missingFields = [];

    conf.forEach((block) => {
      if (!block || !block.table) return;

      const table = properties[block.table];

      if (!table) {
        missingFields.push(`[対象テーブル] ${block.table}`);
        return;
      }

      const tableFields = table.fields || {};

      (block.sort || []).forEach((sortSetting, index) => {
        if (!sortSetting || !sortSetting.sortField) return;

        if (!tableFields[sortSetting.sortField]) {
          missingFields.push(`[ソート条件${index + 1}] ${block.table} > ${sortSetting.sortField}`);
        }
      });
    });

    const uniqueMissingFields = [...new Set(missingFields)];

    if (uniqueMissingFields.length > 0) {
      const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
      const fieldHtml = uniqueMissingFields.map((code) => `・${code}`).join('<br>');

      swal.fire({
        title: '警告',
        html:
          '「サブテーブル自動ソートプラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
          '対象フィールドコード：<br>' +
          fieldHtml +
          '<br><br>プラグイン設定を修正してください。',
        imageUrl: imageUrl,
        confirmButtonText: 'OK',
      });
    }
  }

  function normalizeValue(v) {
    if (v === null || v === undefined) return undefined;

    // FILE / CHECK_BOX など配列になる値の比較不能回避
    if (Array.isArray(v)) {
      const s = v.map(x => (x && x.name) ? x.name : x).sort().join(',');
      return s === '' ? undefined : s;
    }

    if (v === '') return undefined;
    return v;
  }

  function isNumeric(v) {
    return (
      (typeof v === 'number' && Number.isFinite(v)) ||
      (typeof v === 'string' && v.trim() !== '' && /^-?\d+(?:\.\d+)?$/.test(v.trim()))
    );
  }

  function sortSubtableRows(rows, sortKeys) {
    if (!Array.isArray(rows) || rows.length === 0) return rows;
    const _rows = rows.slice();

    _rows.sort((a, b) => {
      for (const k of sortKeys) {
        const fieldCode = k.sortField;
        const dir = (k.sort === 'asc') ? 1 : -1;

        const avRaw = a.value[fieldCode] ? a.value[fieldCode].value : undefined;
        const bvRaw = b.value[fieldCode] ? b.value[fieldCode].value : undefined;

        let av = normalizeValue(avRaw);
        let bv = normalizeValue(bvRaw);

        if (isNumeric(av) && isNumeric(bv)) {
          av = Number(av);
          bv = Number(bv);
        }

        if (av === undefined && bv === undefined) continue;
        if (av === undefined) return EMPTY_TO_BOTTOM ? 1 : -1;
        if (bv === undefined) return EMPTY_TO_BOTTOM ? -1 : 1;

        if (av > bv) return dir * 1;
        if (av < bv) return dir * -1;
      }
      return 0;
    });

    return _rows;
  }

  function goDetailWithBust(appId, recordId) {
    const bust = Date.now();
    location.replace(`${location.origin}/k/${appId}/show?__autosort=${bust}#record=${recordId}`);
  }

  // ===== 詳細画面側で実行する：遷移しない PUTソート =====
  async function applySortByPut(recordId) {
    const appId = kintone.app.getId();
    const lockKey = RUNKEY(appId, recordId);

    const now = Date.now();
    const lockVal = sessionStorage.getItem(lockKey);
    if (lockVal && (now - Number(lockVal) < REENTRY_BLOCK_MS)) return;

    sessionStorage.setItem(lockKey, String(now));
    const guardTimer = setTimeout(() => {
      if (sessionStorage.getItem(lockKey) === String(now)) {
        sessionStorage.removeItem(lockKey);
      }
    }, LOCK_GUARD_MS);

    try {
      const conf = loadPluginConfig();
      if (!conf.length) return;

      // 最新レコード取得（添付ファイル含め確実）
      const res = await kintone.api(kintone.api.url('/k/v1/record.json', true), 'GET', {
        app: appId,
        id: recordId
      });
      const record = res.record;

      const updateRecord = {};
      let changed = false;

      for (const block of conf) {
        const tableCode = block.table;
        const sortKeysRaw = (block.sort || []).filter(x => x && x.sortField && x.sort);

        if (!record[tableCode] || !Array.isArray(record[tableCode].value)) continue;

        const before = record[tableCode].value;
        if (!before.length) continue;

        // 実在フィールドだけに絞る（設定ズレで不発を防ぐ）
        const existingFieldCodes = Object.keys((before[0] && before[0].value) ? before[0].value : {});
        const sortKeys = sortKeysRaw.filter(k => existingFieldCodes.includes(k.sortField));
        if (!sortKeys.length) continue;

        const after = sortSubtableRows(before, sortKeys);

        const same =
          before.length === after.length &&
          before.every((r, i) => r.id === after[i].id);

        if (!same) {
          // ★ルックアップ取得先（更新不可）を payload から除外してPUT
          const readonly = await getLookupReadonlyCodesInSubtable(tableCode);
          const cleanedAfter = stripReadonlyFieldsFromRows(after, readonly);

          updateRecord[tableCode] = { value: cleanedAfter };
          changed = true;
        }
      }

      if (changed) {
        await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', {
          app: appId,
          id: recordId,
          record: updateRecord
        });
      }
    } finally {
      clearTimeout(guardTimer);
      if (sessionStorage.getItem(lockKey) === String(now)) {
        sessionStorage.removeItem(lockKey);
      }
    }
  }

  kintone.events.on('app.record.index.show', checkConfiguredFields);

  // 1) 保存成功時：フラグのみ（編集画面から離脱しない＝ポップアップ回避）
  kintone.events.on(
    ['app.record.create.submit.success', 'app.record.edit.submit.success'],
    (event) => {
      const appId = kintone.app.getId();
      const recordId = event.recordId;
      if (recordId) {
        sessionStorage.setItem(POSTKEY(appId, recordId), '1');
      }
      return event;
    }
  );

  // 2) 詳細画面表示時：フラグがあればPUTソート→詳細を再表示（bust付き）
  kintone.events.on('app.record.detail.show', async (event) => {
    const appId = kintone.app.getId();
    const recordId = event.recordId || (kintone.app.record.getId && kintone.app.record.getId());
    if (!recordId) return event;

    const postKey = POSTKEY(appId, recordId);
    if (!sessionStorage.getItem(postKey)) return event;

    sessionStorage.removeItem(postKey);

    try {
      await applySortByPut(recordId);
    } catch (e) {
      console.error('[SubTableAutosort] applySortByPut failed:', e);
    }

    goDetailWithBust(appId, recordId);
    return event;
  });

})(jQuery, kintone.$PLUGIN_ID);