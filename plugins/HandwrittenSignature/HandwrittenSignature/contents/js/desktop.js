// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (Object.keys(config).length) {
    config.settings = JSON.parse(config.settings);
  } else {
    return false;
  }

  kintone.events.on(['app.record.index.show', 'app.record.detail.show', 'app.record.edit.show'], function (event) {
    // 保存先添付ファイルの内部IDを取得し、サムネイル表示と右クリックを禁止する。
    const fields = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
    for (let i = 0; i < config.settings.length; i++) {
      const fileId = fields.find(_ => _.var === config.settings[i].file).id;
      const container = document.querySelector('.value-' + fileId);
      if (!container) continue;
      const thumbnail = container.querySelector('.gaia-ui-slideshow-thumbnail');
      if (thumbnail) thumbnail.style.pointerEvents = 'none';
      container.addEventListener('contextmenu', function (event) {
        event.preventDefault();
      });
    }

    return event;
  });

  // 認証は後回し
  if (!(await KNTP341410certification())) {
    return;
  }

  kintone.events.on('app.record.index.show', async (e) => {
    if (!config.settings || !config.settings.length) return e;
    const fieldList = await getFieldList();

    if (!fieldList || !fieldList.length) return e;

    const missingFields = [];

    for (let i = 0; i < config.settings.length; i++) {
      const setting = config.settings[i];

      if (setting.space !== '' && setting.space !== 'none') {
        const exists = fieldList.some(field => field.elementId === setting.space);
        if (!exists) {
          missingFields.push(`[手書きサインを表示するスペース] ${setting.space}`);
        }
      }

      if (setting.file !== '' && setting.file !== 'none') {
        const exists = fieldList.some(field => field.code === setting.file);
        if (!exists) {
          missingFields.push(`[サインを保存する添付ファイル] ${setting.file}`);
        }
      }

      if (setting.date !== '' && setting.date !== 'none') {
        const exists = fieldList.some(field => field.code === setting.date);
        if (!exists) {
          missingFields.push(`[サインをした日時を格納するフィールド] ${setting.date}`);
        }
      }
    }

    const uniqueMissingFields = [...new Set(missingFields)];

    if (uniqueMissingFields.length > 0) {
      const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
      const fieldHtml = uniqueMissingFields
        .map((code) => `・${code}`)
        .join('<br>');

      displayAlert(
        '2',
        '警告',
        '「手書きサインプラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        imageUrl,
        'OK'
      );
    }

    return e;
  });



  kintone.events.on(['app.record.create.show', 'app.record.edit.show'], async (e) => {

    if (!config.settings || !config.settings.length) return e;

    // 保存先添付ファイルの内部IDを取得
    const fields = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
    const fileIds = [];
    for (let i = 0; i < config.settings.length; i++) {
      fileIds.push(fields.find(_ => _.var === config.settings[i].file).id);
    }

    // idがいずれかの保存先添付ファイルの内部IDを含むボタンを非表示
    var linkElements = document.querySelectorAll('.plupload-button-cybozu');
    if (linkElements && linkElements.length > 0) {
      linkElements.forEach(function (linkElement) {
        for (const fileId of fileIds){
          if(linkElement.id.includes(fileId)){
            linkElement.style.display = 'none';
          }
        }
      });
    }

    for (let i = 0; i < config.settings.length; i++) {
      if (config.settings[i].space && config.settings[i].space !== 'none') {
        var canvas = kintone.app.record.getSpaceElement(config.settings[i].space);

        const can1 = document.createElement('canvas');
        can1.id = 'WriteCanvas' + i;
        can1.setAttribute('width', 400);
        can1.setAttribute('height', 240);

        const div = document.createElement('div');

        const can2 = document.createElement('canvas');
        can2.id = 'ButtonCanvas' + i;
        can2.setAttribute('width', 400);
        can2.setAttribute('height', 40);
        div.append(can2);


        canvas.append(can1, div);
        init(can1.id, can2.id);
      }
    }


    function init(can1id, can2id) {
      // --------------------------------------------------------------
      // Stage1オブジェクト：WriteCanvas
      // --------------------------------------------------------------
      var stage1 = new createjs.Stage(can1id);

      // タッチイベントが有効なブラウザの場合、
      // CreateJSでタッチイベントを扱えるようにする
      if (createjs.Touch.isSupported()) {
        createjs.Touch.enable(stage1);
      }

      var shape = new createjs.Shape(); // シェイプを作成
      stage1.addChild(shape); // ステージに配置

      handleClick_reset();

      // ステージ上でマウスボタンを押した時のイベント設定
      stage1.addEventListener('stagemousedown', handleDown);

      // マウスを押した時に実行される
      function handleDown(event) {
        var paintColor = '#000'; // 筆ペンの色

        // 線の描画を開始
        shape.graphics
          .beginStroke(paintColor) // 指定のカラーで描画
          .setStrokeStyle(8, 'round') // 線の太さ、形
          .moveTo(event.stageX, event.stageY); // 描画開始位置を指定

        // ステージ上でマウスを動かした時と離した時のイベント設定
        stage1.addEventListener('stagemousemove', handleMove);
        stage1.addEventListener('stagemouseup', handleUp);
      }

      // マウスが動いた時に実行する
      function handleMove(event) {
        // マウス座標への線を引く
        shape.graphics.lineTo(event.stageX, event.stageY);
      }

      // マウスボタンが離された時に実行される
      function handleUp(event) {
        // マウス座標への線を引く
        shape.graphics.lineTo(event.stageX, event.stageY);

        // 線の描画を終了する
        shape.graphics.endStroke();

        // イベント解除
        stage1.removeEventListener('stagemousemove', handleMove);
        stage1.removeEventListener('stagemouseup', handleUp);
      }

      createjs.Ticker.timingMode = createjs.Ticker.RAF;
      createjs.Ticker.addEventListener('tick', onTick);

      function onTick() {
        stage1.update(); // Stageの描画を更新
      }

      // --------------------------------------------------------------
      // Stage2オブジェクト：ButtonCanvas
      // --------------------------------------------------------------
      var stage2 = new createjs.Stage(can2id);
      stage2.enableMouseOver();

      // ボタンを作成
      var btn = createButton('Reset!', 80, 30, '#d10a50');
      btn.x = 110;
      btn.y = 10;
      stage2.addChild(btn);

      // イベントを登録
      btn.addEventListener('click', handleClick_reset);

      // Rest!ボタン押下イベント
      function handleClick_reset(event) {
        // シェイプのグラフィックスを消去
        shape.graphics.clear();
        shape.graphics.beginFill('white');
        shape.graphics.drawRect(0, 0, 400, 240);
        shape.graphics.endFill();
        stage1.update();
      }

      // 時間経過イベント
      createjs.Ticker.addEventListener('tick', handleTick);
      function handleTick() {
        // Stage2の描画を更新
        stage2.update();
      }

      /**
       * @param {String} text ボタンのラベル文言です。
       * @param {Number} width ボタンの横幅(単位はpx)です。
       * @param {Number} height ボタンの高さ(単位はpx)です。
       * @param {String} keyColor ボタンのキーカラーです。
       * @returns {createjs.Container} ボタンの参照を返します。
       */
      function createButton(text, width, height, keyColor) {
        // ボタン要素をグループ化
        var button = new createjs.Container();
        button.name = text; // ボタンに参考までに名称を入れておく(必須ではない)
        button.cursor = 'pointer'; // ホバー時にカーソルを変更する

        // 通常時の座布団を作成
        var bgUp = new createjs.Shape();
        bgUp.graphics
          .setStrokeStyle(1.0)
          .beginStroke(keyColor)
          .beginFill('white')
          .drawRoundRect(0.5, 0.5, width - 1.0, height - 1.0, 4);
        button.addChild(bgUp);
        bgUp.visible = true; // 表示する

        // ロールオーバー時の座布団を作成
        var bgOver = new createjs.Shape();
        bgOver.graphics.beginFill(keyColor).drawRoundRect(0, 0, width, height, 4);
        bgOver.visible = false; // 非表示にする
        button.addChild(bgOver);

        // ラベルを作成
        var label = new createjs.Text(text, '18px sans-serif', keyColor);
        label.x = width / 2;
        label.y = height / 2;
        label.textAlign = 'center';
        label.textBaseline = 'middle';
        button.addChild(label);

        // ロールオーバーイベントを登録
        button.addEventListener('mouseover', handleMouseOver);
        button.addEventListener('mouseout', handleMouseOut);

        // マウスオーバイベント
        function handleMouseOver(event) {
          bgUp.visble = false;
          bgOver.visible = true;
          label.color = 'white';
        }

        // マウスアウトイベント
        function handleMouseOut(event) {
          bgUp.visble = true;
          bgOver.visible = false;
          label.color = keyColor;
        }

        return button;
      }
    }

    return e;
  });

  kintone.events.on(['app.record.create.submit.success', 'app.record.edit.submit.success'], async (event) => {

    if (!config.settings || !config.settings.length) return event;

    const record = event.record;
    const recordsToUpdate = {};

    for (let i = 0; i < config.settings.length; i++) {

      const setting = config.settings[i];

      if (record[setting.file].value.length) {
        continue;
      }

      const domain = window.location.host;
      const subDomain = domain.split('.')[0];


      const saveCanvas = (canvas_id) => {
        return new Promise((resolve, reject) => {
          try {
            const canvas = document.getElementById(canvas_id);
            const title = 'sign';

            const context = canvas.getContext('2d');
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let isBlank = true;

            for (let j = 0; j < pixels.length; j += 4) {
              if (pixels[j] !== 255 || pixels[i + j] !== 255 || pixels[j + 2] !== 255 || pixels[j + 3] !== 255) {
                isBlank = false;
                break;
              }
            }

            // if (!isBlank) {
            canvas.toBlob((blob) => {
              const formData = new FormData();
              formData.append('__REQUEST_TOKEN__', kintone.getRequestToken());
              formData.append('file', blob, title + '.png');

              const xmlHttp = new XMLHttpRequest();
              xmlHttp.open('POST', `https://${subDomain}.cybozu.com/k/v1/file.json`);
              xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
              xmlHttp.send(formData);

              xmlHttp.onload = () => {
                if (xmlHttp.status === 200) {
                  if (!isBlank) {
                    const key = JSON.parse(xmlHttp.responseText).fileKey;
                    recordsToUpdate[setting.file] = { value: [{ fileKey: key }] };
                    recordsToUpdate[setting.date] = { value: record['更新日時'].value };
                  } else {
                    recordsToUpdate[setting.file] = { value: [] };;
                    recordsToUpdate[setting.date] = { value: '' };
                  }
                  resolve();
                } else {
                  //reject(new Error('Failed to upload file.'));
                }
              };
            });
            //} 
            // else {
            //   resolve();
            // }
          } catch { }
        });
      };


      await saveCanvas('WriteCanvas' + i);
    }


    const body = {
      app: kintone.app.getId(),
      id: event.recordId,
      record: recordsToUpdate,
    };

    const isEdit = (event.type === 'app.record.edit.submit.success');

    try {
      kintone.api('/k/v1/record', 'PUT', body).then(
        function (resp) {
          if (isEdit) {
            setTimeout(function () {
              location.reload();
            }, 500);
          }
        },
        (err) => {
          console.log(err);
        }
      );

    } catch (err) {
      console.error('Error updating record:', err);
    }

    return event;
  });


  /***************************************
  * [フォームに設置してある全フィールド取得]
  * @returns [フォームの左上から順番のフィールドリスト]
  **************************************/
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
        if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push({
          type: field.type,
          code: field.code ? field.code : '',
          id: field.id,
          properties: field.properties,
          elementId: field.elementId ? field.elementId : field.code,
          label: field.code ? field.code : field.elementId,
        }));
        /*else if (row.type === 'SUBTABLE') {
          fieldList.push(row);
          if (!subTable) return;
          row.fields.forEach((field) => {
            const fieldInfo = {
              type: field.type,
              code: field.code,
              id: `${fieldList2.find((x) => x.var === row.code).id}　${Object.values(fieldList2.find((x) => x.var === row.code).fieldList).find((y) => y.var === field.code).id
                }`,
              properties: Object.values(fieldList2.find((x) => x.var === row.code).fieldList).find(
                (y) => y.var === field.code
              ).properties,
              elementId: field.elementId ? field.elementId : field.code,
              label: field.code ? `${row.code}　${field.code}` : `${row.code}　${field.elementId}`,
            };
            fieldList.push(fieldInfo);
          });
        }*/ else if (row.type === 'GROUP') {
          fieldList.push(row);
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
        }
      });
    } catch (error) {console.error(error)}

    fieldList.forEach((field) => {
      const target = fieldList2.find((x) => x.var === field.code);
      if (!target) return;
      field.id = target.id;
      field.properties = target.properties;
      //field.label = target.label;

      if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
      field.fields.forEach((inField) => {
        const inTarget = Object.values(target.fieldList).find((x) => x.var === inField.code);
        inField.id = inTarget.id;
        inField.properties = inTarget.properties;
        //inField.label = inTarget.label;
      });
    });

    return fieldList;

  };

  function displayAlert(flag, title, text, type, button) {
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
