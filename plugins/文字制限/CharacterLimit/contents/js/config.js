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


  const $form = $('.js-submit-settings');
  const $cancelButton = $('.js-cancel-button');
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  const fieldList = await getFieldList();

  var checkNum = 5;
  var razioNum = 3;

  if (typeof KNTP436810certification === 'function') {
    if (!(await KNTP436810certification())) {
      return;
    }
  } else {
    displayAlert('エラー', '不正ファイルのため<br>ご利用できません。', 'error', 'OK');
    return;
  }

  $(function () {

    //行追加ボタン押下時の処理
    $('.kintoneplugin-button-add-row-image').on("click", async function () {

      $('.characters-select').select2('destroy');

      //clone作成
      const clone = $('.main-contents:first').clone(true);
      // var clone = $('#main-table').children('tbody:first').clone(true);
      //
      //const clone = $('.main-contents:first').clone(true);

      for (var i = 1; i < 6; i++) {
        var checkboxId = 'checkbox-' + (checkNum + 5 + i);
        var labelFor = 'checkbox-' + (checkNum + 5 + i);

        var checkbox = clone.find('.kintoneplugin-input-checkbox-item').eq(i - 1).find('input[type="checkbox"]');
        checkbox.attr('id', checkboxId).prop('checked', false);
        clone.find('.kintoneplugin-input-checkbox-item').eq(i - 1).find('label').attr('for', labelFor);
      }


      var raziokakuInput = {
        zenkaku: clone.find('input[name="radiokaku"]').eq(0),
        hankaku: clone.find('input[name="radiokaku"]').eq(1),
        sinai: clone.find('input[name="radiokaku"]').eq(2)
      };
      raziokakuInput.zenkaku.prop('id', 'raziokaku-' + (razioNum + 2 + i));
      raziokakuInput.zenkaku.prop('name', 'raziokaku-' + (razioNum + 2 + i));
      raziokakuInput.zenkaku.next('label').attr('for', 'raziokaku-' + (razioNum + 2 + i));

      raziokakuInput.hankaku.prop('id', 'raziokaku-' + (razioNum + 50000 + i));
      raziokakuInput.hankaku.prop('name', 'raziokaku-' + (razioNum + 2 + i));
      raziokakuInput.hankaku.next('label').attr('for', 'raziokaku-' + (razioNum + 50000 + i));

      raziokakuInput.sinai.prop('id', 'raziokaku-' + (razioNum + 500000 + i));
      raziokakuInput.sinai.prop('name', 'raziokaku-' + (razioNum + 2 + i));
      raziokakuInput.sinai.next('label').attr('for', 'raziokaku-' + (razioNum + 500000 + i));

      raziokakuInput.zenkaku.prop('checked', true);

      var raziomojiInput = {
        oomoji: clone.find('input[name="radiomoji"]').eq(0),
        komoji: clone.find('input[name="radiomoji"]').eq(1),
        sinai: clone.find('input[name="radiomoji"]').eq(2)
      };
      raziomojiInput.oomoji.prop('id', 'raziomoji-' + (razioNum + 2 + i));
      raziomojiInput.oomoji.prop('name', 'raziomoji-' + (razioNum + 2 + i));
      raziomojiInput.oomoji.next('label').attr('for', 'raziomoji-' + (razioNum + 2 + i));

      raziomojiInput.komoji.prop('id', 'raziomoji-' + (razioNum + 50000 + i));
      raziomojiInput.komoji.prop('name', 'raziomoji-' + (razioNum + 2 + i));
      raziomojiInput.komoji.next('label').attr('for', 'raziomoji-' + (razioNum + 50000 + i));

      raziomojiInput.sinai.prop('id', 'raziomoji-' + (razioNum + 500000 + i));
      raziomojiInput.sinai.prop('name', 'raziomoji-' + (razioNum + 2 + i));
      raziomojiInput.sinai.next('label').attr('for', 'raziomoji-' + (razioNum + 500000 + i));

      raziomojiInput.oomoji.prop('checked', true);


      let array = [];
      $('.main-contents').each(function () {
        array.push($(this).find('.characters-select').val());
      });

      //const fieldList = await getFieldList();
      const singleLineText = filterField(fieldList, true, 'SINGLE_LINE_TEXT');
      clone.find('.characters-select').empty();
      const newOptions = singleLineText.filter(option => !array.includes(option.code));
      createOption(newOptions, clone.find('.characters-select'));

      // console.log(clone[0]);
      var clickRow = $(this).parent().parent().parent();
      $(this).closest('.main-contents').after(clone);
      checkNum += 5;
      razioNum += 3;

      adjustDis();
    });


    //行削除ボタン押下時の処理
    $('.kintoneplugin-button-remove-row-image').on('click',async function () {
      if ($('.main-contents').length > 1) $(this).closest('.main-contents').remove();
      let array = [];
      $('.main-contents').each(function () {
        array.push($(this).find('.characters-select').val());
      });
      //const fieldList = await getFieldList();
      const singleLineText = filterField(fieldList, true, 'SINGLE_LINE_TEXT');
      $('.main-contents').each(function () {
        const val = $(this).find('.characters-select').val();
        const newOptions = singleLineText.filter(x => !array.includes(x.code) || x.code === val);
        $(this).find('.characters-select').empty();
        createOption(newOptions,$(this).find('.characters-select'));
        $(this).find('.characters-select').val(val);
      });
      adjustDis();
    });


    //初期化ボタン押下時の処理
    $('.initialization-button').on('click', function () {
      var permitSymbolInput = $(this).closest('.main-contents').find('.kintoneplugin-input-text');
      permitSymbolInput.val('\\\/*+.,!?#$%&~|^@;:()[]{}');
    });
  });

  //const fieldList = await getFieldList();
  const singleLineText = filterField(fieldList, true, 'SINGLE_LINE_TEXT');
  // console.log(singleLineText);

  //設定保持
  if (Object.keys(config).length) {
    var elements = JSON.parse(config.elements);
    //console.log(elements);

    let array = [];
    elements.forEach(x => {
      array.push(x.limitField);
    });

    //-------------2つ目からの処理---------------------------------------------------------------------------------------------
    for (var i = 1; i < elements.length; i++) {
      //clone作成
      const clone = $('.main-contents:first').clone(true);
      // console.log(clone);
      for (var j = 1; j < 6; j++) {
        // clone[0].children[1].firstElementChild.children[j].firstElementChild.children[0].id = 'checkbox-' + (checkNum + 5 + j);
        // clone[0].children[1].firstElementChild.children[j].firstElementChild.children[1].setAttribute('for', 'checkbox-' + (checkNum + 5 + j));
        var checkboxId = 'checkbox-' + (checkNum + 5 + j);
        var labelFor = 'checkbox-' + (checkNum + 5 + j);

        var checkbox = clone.find('.kintoneplugin-input-checkbox-item').eq(j - 1).find('input[type="checkbox"]');
        checkbox.attr('id', checkboxId);
        clone.find('.kintoneplugin-input-checkbox-item').eq(j - 1).find('label').attr('for', labelFor);
      }

      //制限フィールドの要素を取得し値を代入
      var limitFieldSelect = clone.find('.characters-select');
      const newOptions = singleLineText.filter(x => !array.includes(x.code) || x.code === elements[i].limitField);
      createOption(newOptions, limitFieldSelect);
      limitFieldSelect.val(elements[i].limitField);

      //許可記号フィールドの要素を取得し値を代入
      var permitSymbolInput = clone.find('.kintoneplugin-input-text');
      permitSymbolInput.val(elements[i].permitSymbol);

      //ラジオボタンの要素取得しチェックをつける id for変更
      var raziokakuInput = {
        zenkaku: clone.find('input[name="radiokaku"]').eq(0),
        hankaku: clone.find('input[name="radiokaku"]').eq(1),
        sinai: clone.find('input[name="radiokaku"]').eq(2)
      };
      if (elements[i].raziokaku === '全角') {
        //raziokakuInput.zenkaku.checked = true;
        raziokakuInput.zenkaku.prop('checked', true);
      } else if (elements[i].raziokaku === '半角') {
        //raziokakuInput.hankaku.checked = true;
        raziokakuInput.hankaku.prop('checked', true);
      } else if (elements[i].raziokaku === 'しない') {
        //raziokakuInput.sinai.checked = true;
        raziokakuInput.sinai.prop('checked', true);
      }

      raziokakuInput.zenkaku.prop('id', 'raziokaku-' + (razioNum + 2 + i));
      raziokakuInput.zenkaku.prop('name', 'raziokaku-' + (razioNum + 2 + i));
      raziokakuInput.zenkaku.next('label').attr('for', 'raziokaku-' + (razioNum + 2 + i));

      raziokakuInput.hankaku.prop('id', 'raziokaku-' + (razioNum + 50000 + i));
      raziokakuInput.hankaku.prop('name', 'raziokaku-' + (razioNum + 2 + i));
      raziokakuInput.hankaku.next('label').attr('for', 'raziokaku-' + (razioNum + 50000 + i));

      raziokakuInput.sinai.prop('id', 'raziokaku-' + (razioNum + 500000 + i));
      raziokakuInput.sinai.prop('name', 'raziokaku-' + (razioNum + 2 + i));
      raziokakuInput.sinai.next('label').attr('for', 'raziokaku-' + (razioNum + 500000 + i));


      var raziomojiInput = {
        oomoji: clone.find('input[name="radiomoji"]').eq(0),
        komoji: clone.find('input[name="radiomoji"]').eq(1),
        sinai: clone.find('input[name="radiomoji"]').eq(2)
      };
      if (elements[i].raziomoji === '大文字') {
        // raziomojiInput.oomoji.checked = true;
        raziomojiInput.oomoji.prop('checked', true);
      } else if (elements[i].raziomoji === '小文字') {
        // raziomojiInput.komoji.checked = true;
        raziomojiInput.komoji.prop('checked', true);
      } else if (elements[i].raziomoji === 'しない') {
        //raziomojiInput.sinai.checked = true;
        raziomojiInput.sinai.prop('checked', true);
      }

      raziomojiInput.oomoji.prop('id', 'raziomoji-' + (razioNum + 2 + i));
      raziomojiInput.oomoji.prop('name', 'raziomoji-' + (razioNum + 2 + i));
      raziomojiInput.oomoji.next('label').attr('for', 'raziomoji-' + (razioNum + 2 + i));

      raziomojiInput.komoji.prop('id', 'raziomoji-' + (razioNum + 50000 + i));
      raziomojiInput.komoji.prop('name', 'raziomoji-' + (razioNum + 2 + i));
      raziomojiInput.komoji.next('label').attr('for', 'raziomoji-' + (razioNum + 50000 + i));

      raziomojiInput.sinai.prop('id', 'raziomoji-' + (razioNum + 500000 + i));
      raziomojiInput.sinai.prop('name', 'raziomoji-' + (razioNum + 2 + i));
      raziomojiInput.sinai.next('label').attr('for', 'raziomoji-' + (razioNum + 500000 + i));

      //制限文字チェックボックスの要素を取得し値を代入
      for (var chara of elements[i].limitChara) {
        switch (chara) {
          case 'ひらがな':
            clone.find('.kintoneplugin-input-checkbox-item').eq(0).find('input').prop('checked', true);
            break;
          case 'カタカナ':
            clone.find('.kintoneplugin-input-checkbox-item').eq(1).find('input').prop('checked', true);
            break;
          case '数字':
            clone.find('.kintoneplugin-input-checkbox-item').eq(2).find('input').prop('checked', true);
            break;
          case '英字':
            clone.find('.kintoneplugin-input-checkbox-item').eq(3).find('input').prop('checked', true);
            break;
          case '記号':
            clone.find('.kintoneplugin-input-checkbox-item').eq(4).find('input').prop('checked', true);
            break;
        }
      }
      $('#parent').append(clone);
      checkNum += 5;
      razioNum += 3;
    }
    //--------------------------------------------------------------------------------------------------------------------------

    //-------------1つ目の処理---------------------------------------------------------------------------------------------------

    // console.log(document.getElementsByClassName('main-tbody')[0]);
    //先頭のtbody取得
    var firstTbody = $('.main-contents').eq(0);
    // console.log(firstTbody);

    //制限フィールドの要素取得し値を代入
    var firstLimitFieldSelect = firstTbody.find('.characters-select');
    const newOptions = singleLineText.filter(x => !array.includes(x.code) || x.code === elements[0].limitField);
    createOption(newOptions, firstLimitFieldSelect);

    firstLimitFieldSelect.val(elements[0].limitField);

    //許可記号フィールドの要素を取得し値を代入
    var firstPermitSymbolInput = firstTbody.find('.kintoneplugin-input-text');
    firstPermitSymbolInput.val(elements[0].permitSymbol);

    //ラジオボタンの要素取得しチェックをつける
    var raziokakuInput = {
      zenkaku: firstTbody.find('input[name="radiokaku"]').eq(0),
      hankaku: firstTbody.find('input[name="radiokaku"]').eq(1),
      sinai: firstTbody.find('input[name="radiokaku"]').eq(2)
    };
    if (elements[0].raziokaku === '全角') {
      raziokakuInput.zenkaku.prop('checked', true);
    } else if (elements[0].raziokaku === '半角') {
      raziokakuInput.hankaku.prop('checked', true);
    } else if (elements[0].raziokaku === 'しない') {
      raziokakuInput.sinai.prop('checked', true);
    }


    var raziomojiInput = {
      oomoji: firstTbody.find('input[name="radiomoji"]').eq(0),
      komoji: firstTbody.find('input[name="radiomoji"]').eq(1),
      sinai: firstTbody.find('input[name="radiomoji"]').eq(2)
    };
    if (elements[0].raziomoji === '大文字') {
      raziomojiInput.oomoji.prop('checked', true);
    } else if (elements[0].raziomoji === '小文字') {
      raziomojiInput.komoji.prop('checked', true);
    } else if (elements[0].raziomoji === 'しない') {
      raziomojiInput.sinai.prop('checked', true);
    }
    //制限文字チェックボックスの要素を取得し値を代入
    for (var chara of elements[0].limitChara) {
      switch (chara) {
        case 'ひらがな':
          firstTbody.find('.kintoneplugin-input-checkbox-item').eq(0).find('input').prop('checked', true);
          break;
        case 'カタカナ':
          firstTbody.find('.kintoneplugin-input-checkbox-item').eq(1).find('input').prop('checked', true);
          break;
        case '数字':
          firstTbody.find('.kintoneplugin-input-checkbox-item').eq(2).find('input').prop('checked', true);
          break;
        case '英字':
          firstTbody.find('.kintoneplugin-input-checkbox-item').eq(3).find('input').prop('checked', true);
          break;
        case '記号':
          firstTbody.find('.kintoneplugin-input-checkbox-item').eq(4).find('input').prop('checked', true);
          break;
      }
    }
    //-------------------------------------------------------------------------------------------------------------------------




    //search();

    adjustDis();

  } else {

    createOption(singleLineText, $('.characters-select'));

    search();

  }

  $(document).on('change', '.characters-select', async function () {

    let array = [];
    $('.main-contents').each(function () {
      array.push($(this).find('.characters-select').val());
    });

    // const fieldList = await getFieldList();
    const singleLineText = filterField(fieldList, true, 'SINGLE_LINE_TEXT');
    $('.main-contents').each(function () {
      const name = $(this).find('.characters-select');
      const value = name.val();
      name.empty();
      const newOptions = singleLineText.filter(option => !array.includes(option.code) || option.code === value);
      createOption(newOptions,name);
      name.val(value);
    });

    adjustDis();
  })

  function adjustDis() {
    search();
    $('.main-contents').each(function () {
      const str = $(this).find('.characters-select option:selected').text().length;
      let len = str * 17 + 20;
      if (len < 290) len = 290;
      $(this).find('.container').find('.select2-selection--single').css('width', len + 'px');
      $(this).find('.container').find('.select2-selection__arrow').css('left', len - 30 + 'px');
      let mLen = len > 700 ? len + 10 : 700;
      $(this).css('width', mLen + 'px');
    })
  }


  //保存ボタン押下時の処理
  $form.on('submit', function (e) {
    e.preventDefault();

    var elements = [];
    const mainContentsLength = $('.main-contents').length;
    //制限フィールドの数分ループ
    for (var i = 0; i < mainContentsLength; i++) {
      //tbodyを一つ取り出す
      const mainContents = $('.main-contents').eq(i);
      // console.log(tbody);

      elements[i] = {
        limitField: mainContents.find('.characters-select').val(),
        permitSymbol: mainContents.find('.kintoneplugin-input-text').val(),
        limitChara: [],
      }
      //debugger;
      const radioButton = mainContents.find('.kintoneplugin-input-radio-item');
      //console.log(radioButton);

      // 選んだラジオボタンのラベルを代入
      if (radioButton.eq(0).find('input').prop('checked') === true) {
        elements[i].raziokaku = radioButton.eq(0).find('label').text();
      } else if (radioButton.eq(1).find('input').prop('checked') === true) {
        elements[i].raziokaku = radioButton.eq(1).find('label').text();;
      } else if (radioButton.eq(2).find('input').prop('checked') === true) {
        elements[i].raziokaku = radioButton.eq(2).find('label').text();;
      }

      if (radioButton.eq(3).find('input').prop('checked') === true) {
        elements[i].raziomoji = radioButton.eq(3).find('label').text();;
      } else if (radioButton.eq(4).find('input').prop('checked') === true) {
        elements[i].raziomoji = radioButton.eq(4).find('label').text();;
      } else if (radioButton.eq(5).find('input').prop('checked') === true) {
        elements[i].raziomoji = radioButton.eq(5).find('label').text();;
      }


      //チェックボックスの数分ループ
      const checkBoxLength = mainContents.find('.kintoneplugin-input-checkbox-item').length;
      for (var j = 0; j < checkBoxLength; j++) {
        //var checkbox : チェックボックスが入っているdivタグ取得
        var checkBox = mainContents.find('.kintoneplugin-input-checkbox-item').eq(j);
        var check = checkBox.find('input').prop('checked');
        var text = checkBox.find('label').text();
        //チェックされている場合、配列に値を代入
        if (check === true) {
          elements[i].limitChara.push(text);
        }
      }
    }

    //必須項目チェック
    if(reqCheck(elements)){displayAlert('エラー', '必須項目が抜けています。', 'error', 'OK');return false}
    
    const config = { elements: JSON.stringify(elements) };
    kintone.plugin.app.setConfig(config);
  });
  //キャンセルボタン押下時の処理
  $cancelButton.on('click', function () {
    window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  });

  function createOption(list, name) {
    const option = $('<option>', {
      value: '',
      text: ''
    });
    name.append(option);
    list.forEach(field => {
      const option = $('<option>', {
        value: field.code,
        text: field.code
      });
      name.append(option);
    })
  }

  /***************************************
 * [必須チェック]
 * @param {object} elements [保存情報]
 * @returns flag [必要事項が漏れていればtrue なければ false]
 **************************************/

  function reqCheck (elements){
    let flag = false;
    elements.forEach((x) => {
      if(!x.limitField){flag = true}
      if(x.limitChara.length == 0){flag = true}
      if(x.limitChara.includes("記号") && !x.permitSymbol){flag = true}
    })
    return flag;
  }

  /***************************************
 * [フォームに設置してある全フィールド取得]
 * @returns [フォームの左上から順番のフィールドリスト]
 **************************************/
  async function getFieldList() {
    const fieldList = [];
    try {
      const resp = await callKintoneApi('/k/v1/app/form/layout.json', 'GET', { app: kintone.app.getId() });
      resp.layout.forEach(row => {
        if (row.type === 'ROW') row.fields.forEach(field => fieldList.push(field));
        else if (row.type === 'SUBTABLE') {
          fieldList.push(row);
          //if (!subTable) return;
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
          row.layout.forEach(childRow => childRow.fields.forEach(field => {
            //fieldList.push(field)
            const fieldInfo = {
              type: field.type,
              code: `${row.code}　${field.code}`,
            };
            fieldList.push(fieldInfo);
          }));
        };
      })

      let fieldList2 = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
      fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];

      fieldList.forEach(field => {
        const target = fieldList2.find(x => x.var === field.code);
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
    } catch {

    }
    return fieldList;
  }


  /************************************************
   * [指定したフィールドを抽出する関数]
   * @param {Array} フィルターをかけるフィールドリスト
   * @param {boolean} 指定したフィールドタイプを抽出 true   以外を抽出 false
   * @param {Array} 抽出するフィールドタイプリスト
   * @returns [抽出したフィールドリスト] 
   ************************************************/
  function filterField(fieldList, flg, ...limitFieldType) {
    if (!limitFieldType.length) return fieldList;
    if (flg) fieldList = fieldList.filter(x => limitFieldType.includes(x.type));
    else fieldList = fieldList.filter(x => !limitFieldType.includes(x.type));
    return fieldList;
  }


  /***************************************
   * [ドロップダウンに検索機能追加・CSS追加]
   **************************************/
  function search() {
    $('.select2').select2({
      //width: '290px',
    }).on('select2:open', function (e) {
      setTimeout(function () {
        var optionCount = $('.select2-results__option').length;
        if (optionCount > 5) {
          var newTop = 0;
        } else {
          var newTop = -40;
        }
        $('.select2-search__field').css({
          height: '34px',
          'width': "280px",
        });
        $('.select2-search--dropdown').css({
         padding: '2px',
        });
        $('.select2-dropdown--below').css({
          'min-width': '290px',
          width: 'auto !important',
        });
        $('.select2-dropdown--above').css({
          'min-width': '290px',
          width: 'auto !important',
          'top': newTop + 'px',
        });
        $('.select2-results__option').css({
          'min-width': '290px',
          width: 'auto !important',
          height: '30px',
          padding: '4px 0px',
          'vartical-align': 'center',
          'white-space': 'nowrap',
          'overflow': 'visible',
        });
      }, 0);
    });

    $('.select2-selection--single').css({
      width: '290px',
      height: '55px',
      border: '1px solid #e3e7e8',
      'background-color': '#f7f9fa',
      'box-shadow': '1px 1px 1px #fff inset',
      'border-radius': '0',
      'text-overflow': 'ellipsis',
    });

    $('.select2-selection__rendered').css({
      color: '#34a3db',
      'text-align': 'center',
      'line-height': '55px',
    });

    $('.select2-selection__arrow').css({
      top: '8px',
      left: '260px',
    });

    $('.select2-container--default .select2-selection--single .select2-selection__arrow b').css({
      'border-color': '#3498db transparent transparent transparent',
    });
  }

  function displayAlert(title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button
    })
  }


})(jQuery, kintone.$PLUGIN_ID);
