// Copyright (C) All in one Allright Reserved. 


jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  if (!(await KNTP436810certification())) {
    return;
  }


  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  try {
    if (Object.keys(config).length) {
      var elements = JSON.parse(config.elements);
    }
  } catch (ignore) {

  }

  //許可された記号において、全角も許可するための処理
  elements.forEach((x) => {
    let permitString = x.permitSymbol
      permitString.split("").forEach((y) => {
        if(y == '\\'){permitString = permitString + "￥"};//\の場合、￥(全角も許可する)
        permitString = permitString + String.fromCharCode(y.charCodeAt(0) + 0xFEE0);
      })
      x.permitSymbol = permitString
  })

  function getCodePart(code) {
    const parts = code.split('　');
    return parts.length === 2 ? parts[1] : code;
  }

  //イベント作成\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  var events = [];
  if (!elements || !elements.length) return false;
  for (var element of elements) {
    events.push('app.record.create.change.' + getCodePart(element.limitField));
    events.push('app.record.edit.change.' + getCodePart(element.limitField));
  }
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  //制限文字のエラー処理
  kintone.events.on(events, function (e) {

    for (var element of elements) {
      var limitField = element.limitField;// 制限フィールド
      var permitSymbol = element.permitSymbol;// 許可記号
      var limitChara = element.limitChara;// 許可文字種

      var symbolStr = "";

      for (var i = 0; i < permitSymbol.length; i++) {
        if (permitSymbol[i] === '[' || permitSymbol[i] === ']' || permitSymbol[i] === '\\' || permitSymbol[i] === '/') {
          symbolStr += "\\" + permitSymbol[i];
        } else {
          symbolStr += permitSymbol[i];
        }
      }

      permitSymbol = symbolStr;

      var limitCharaFunc = {
        'ひらがな': 'ぁ-んー',
        'カタカナ': 'ァ-ンヴーｧ-ﾝﾞﾟ',
        '数字': '0-9０-９',
        '英字': 'a-zA-Zａ-ｚＡ-Ｚ',
        '記号': permitSymbol
      };
      var str = "";

      // 正規表現文字列作成
      for (var chara of limitChara) {
        str += limitCharaFunc[chara];
      }

      str = '[' + str + ']';
      str = new RegExp(str);

      //console.log(str);

      if (!limitField || limitField === '') return e;
      //フィールドに文字が入力されている場合
      if (limitField.split('　').length === 1) {
        if (e.record[limitField].value !== undefined) {

          var index = e.record[limitField].value.length - 1;

          for (var c of e.record[limitField].value) {

            if (!(c.match(str))) {
              e.record[limitField].error = '入力できない文字が含まれています';
            }
            else if (e.record[limitField].value[index] === c && e.record[limitField].error !== '入力できない文字が含まれています') {
              e.record[limitField].error = null;
             
            }
          }
        } else {
          e.record[limitField].error = null
        }
      } else {
        if (!e.record[limitField.split('　')[0]]) {
          const limit = limitField.split('　')[1];
          if (e.record[limit].value !== undefined) {

            var index = e.record[limit].value.length - 1;

            for (var c of e.record[limit].value) {

              if (!(c.match(str))) {
                e.record[limit].error = '入力できない文字が含まれています';
              }
              else if (e.record[limit].value[index] === c && e.record[limit].error !== '入力できない文字が含まれています') {
                e.record[limit].error = null;
              }
            }
          } else {
            e.record[limit].error = null;
          }
        } else {
          e.record[limitField.split('　')[0]].value.forEach((row) => {
            const limit = limitField.split('　')[1];
            if (row.value[limit].value !== undefined) {

              var index = row.value[limit].value.length - 1;

              for (var c of row.value[limit].value) {

                if (!(c.match(str))) {
                  row.value[limit].error = '入力できない文字が含まれています';
                }
                else if (row.value[limit].value[index] === c && row.value[limit].error !== '入力できない文字が含まれています') {
                  row.value[limit].error = null;
                }
              }
            } else {
              row.value[limit].error = null;
            }
          });
        }
      }
    }

    return e;
  });



  kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], function (e) {

    //文字変換関数群
    var conversionFunc = {


      //半角➡全角
      hankakuWoZenkaku: function (str) {
        var kanaMap = {
          'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
          'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
          'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
          'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
          'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
          'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
          'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
          'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
          'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
          'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
          'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
          'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
          'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
          'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
          'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
          'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
          'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
          'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
          "0": "０", "1": "１", "2": "２", "3": "３", "4": "４", "5": "５",
          "6": "６", "7": "７", "8": "８", "9": "９",
          "A": "Ａ", "B": "Ｂ", "C": "Ｃ", "D": "Ｄ", "E": "Ｅ", "F": "Ｆ",
          "G": "Ｇ", "H": "Ｈ", "I": "Ｉ", "J": "Ｊ", "K": "Ｋ", "L": "Ｌ",
          "M": "Ｍ", "N": "Ｎ", "O": "Ｏ", "P": "Ｐ", "Q": "Ｑ", "R": "Ｒ",
          "S": "Ｓ", "T": "Ｔ", "U": "Ｕ", "V": "Ｖ", "W": "Ｗ", "X": "Ｘ",
          "Y": "Ｙ", "Z": "Ｚ",
          "a": "ａ", "b": "ｂ", "c": "ｃ", "d": "ｄ", "e": "ｅ", "f": "ｆ",
          "g": "ｇ", "h": "ｈ", "i": "ｉ", "j": "ｊ", "k": "ｋ", "l": "ｌ",
          "m": "ｍ", "n": "ｎ", "o": "ｏ", "p": "ｐ", "q": "ｑ", "r": "ｒ",
          "s": "ｓ", "t": "ｔ", "u": "ｕ", "v": "ｖ", "w": "ｗ", "x": "ｘ",
          "y": "ｙ", "z": "ｚ",
        };
        var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
        return str
          .replace(reg, function (match) {
            return kanaMap[match];
          })
          .replace(/ﾞ/g, '゛')
          .replace(/ﾟ/g, '゜');
      },


      //全角➡半角）
      zenkakuWohankaku: function (str) {
        var kanaMap = {
          "ガ": "ｶﾞ", "ギ": "ｷﾞ", "グ": "ｸﾞ", "ゲ": "ｹﾞ", "ゴ": "ｺﾞ",
          "ザ": "ｻﾞ", "ジ": "ｼﾞ", "ズ": "ｽﾞ", "ゼ": "ｾﾞ", "ゾ": "ｿﾞ",
          "ダ": "ﾀﾞ", "ヂ": "ﾁﾞ", "ヅ": "ﾂﾞ", "デ": "ﾃﾞ", "ド": "ﾄﾞ",
          "バ": "ﾊﾞ", "ビ": "ﾋﾞ", "ブ": "ﾌﾞ", "ベ": "ﾍﾞ", "ボ": "ﾎﾞ",
          "パ": "ﾊﾟ", "ピ": "ﾋﾟ", "プ": "ﾌﾟ", "ペ": "ﾍﾟ", "ポ": "ﾎﾟ",
          "ヴ": "ｳﾞ", "ヷ": "ﾜﾞ", "ヺ": "ｦﾞ",
          "ア": "ｱ", "イ": "ｲ", "ウ": "ｳ", "エ": "ｴ", "オ": "ｵ",
          "カ": "ｶ", "キ": "ｷ", "ク": "ｸ", "ケ": "ｹ", "コ": "ｺ",
          "サ": "ｻ", "シ": "ｼ", "ス": "ｽ", "セ": "ｾ", "ソ": "ｿ",
          "タ": "ﾀ", "チ": "ﾁ", "ツ": "ﾂ", "テ": "ﾃ", "ト": "ﾄ",
          "ナ": "ﾅ", "ニ": "ﾆ", "ヌ": "ﾇ", "ネ": "ﾈ", "ノ": "ﾉ",
          "ハ": "ﾊ", "ヒ": "ﾋ", "フ": "ﾌ", "ヘ": "ﾍ", "ホ": "ﾎ",
          "マ": "ﾏ", "ミ": "ﾐ", "ム": "ﾑ", "メ": "ﾒ", "モ": "ﾓ",
          "ヤ": "ﾔ", "ユ": "ﾕ", "ヨ": "ﾖ",
          "ラ": "ﾗ", "リ": "ﾘ", "ル": "ﾙ", "レ": "ﾚ", "ロ": "ﾛ",
          "ワ": "ﾜ", "ヲ": "ｦ", "ン": "ﾝ",
          "ァ": "ｧ", "ィ": "ｨ", "ゥ": "ｩ", "ェ": "ｪ", "ォ": "ｫ",
          "ッ": "ｯ", "ャ": "ｬ", "ュ": "ｭ", "ョ": "ｮ",
          "０": "0", "１": "1", "２": "2", "３": "3", "４": "4", "５": "5",
          "６": "6", "７": "7", "８": "8", "９": "9",
          "Ａ": "A", "Ｂ": "B", "Ｃ": "C", "Ｄ": "D", "Ｅ": "E", "Ｆ": "F",
          "Ｇ": "G", "Ｈ": "H", "Ｉ": "I", "Ｊ": "J", "Ｋ": "K", "Ｌ": "L",
          "Ｍ": "M", "Ｎ": "N", "Ｏ": "O", "Ｐ": "P", "Ｑ": "Q", "Ｒ": "R",
          "Ｓ": "S", "Ｔ": "T", "Ｕ": "U", "Ｖ": "V", "Ｗ": "W", "Ｘ": "X",
          "Ｙ": "Y", "Ｚ": "Z",
          "ａ": "a", "ｂ": "b", "ｃ": "c", "ｄ": "d", "ｅ": "e", "ｆ": "f",
          "ｇ": "g", "ｈ": "h", "ｉ": "i", "ｊ": "j", "ｋ": "k", "ｌ": "l",
          "ｍ": "m", "ｎ": "n", "ｏ": "o", "ｐ": "p", "ｑ": "q", "ｒ": "r",
          "ｓ": "s", "ｔ": "t", "ｕ": "u", "ｖ": "v", "ｗ": "w", "ｘ": "x",
          "ｙ": "y", "ｚ": "z",
        }
        var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
        return str
          .replace(reg, function (match) {
            return kanaMap[match];
          })
          .replace(/゛/g, 'ﾞ')
          .replace(/゜/g, 'ﾟ');
      }
    }


    //変換処理///////////////////////////////////////////////////////////
    for (var i = 0; i < elements.length; i++) {
      var limitField = elements[i].limitField;// 制限フィールド
      var raziokaku = elements[i].raziokaku;//全角半角変換
      var raziomoji = elements[i].raziomoji;//大文字小文字変換
      var permitSymbol = elements[i].permitSymbol;// 許可記号
      var limitChara = elements[i].limitChara;// 許可文字種

      var symbolStr = "";

      for (var j = 0; j < permitSymbol.length; j++) {
        if (permitSymbol[j] === '[' || permitSymbol[j] === ']' || permitSymbol[j] === '\\' || permitSymbol[j] === '/') {
          symbolStr += "\\" + permitSymbol[j];
        } else {
          symbolStr += permitSymbol[j];
        }
      }

      permitSymbol = symbolStr;

      var limitCharaFunc = {
        'ひらがな': 'ぁ-んー',
        'カタカナ': 'ァ-ンヴーｧ-ﾝﾞﾟ',
        '数字': '0-9０-９',
        '英字': 'a-zA-Zａ-ｚＡ-Ｚ',
        '記号': permitSymbol
      };
      var text = "";

      // 正規表現文字列作成
      for (var chara of limitChara) {
        text += limitCharaFunc[chara];
      }

      text = '[' + text + ']';
      text = new RegExp(text);

      
      if (!limitField || limitField === '') continue;
      if (limitField.split('　').length === 1) {
        if (e.record[limitField].value !== undefined) {

          var index = e.record[limitField].value.length - 1;

          for (var c of e.record[limitField].value) {

            if (!(c.match(text))) {
              e.record[limitField].error = '入力できない文字が含まれています';
              e.error = '入力できない文字が含まれています';
            }
            else if (e.record[limitField].value[index] === c && e.record[limitField].error !== '入力できない文字が含まれています') {
              e.record[limitField].error = null;
              //大文字・小文字変換-----------------------------------
              if (raziomoji === '大文字') {
                var str = e.record[limitField].value;
                e.record[limitField].value = str.toUpperCase();
              }
              else if (raziomoji === '小文字') {
                var str = e.record[limitField].value;
                e.record[limitField].value = str.toLowerCase();
              }
              //----------------------------------------------------

              //全角・半角変換---------------------------------------
              if (raziokaku === '全角') {
                var str = e.record[limitField].value;
                e.record[limitField].value = conversionFunc.hankakuWoZenkaku(str);
              }
              else if (raziokaku === '半角') {
                var str = e.record[limitField].value;
                e.record[limitField].value = conversionFunc.zenkakuWohankaku(str);
              }
              //---------------------------------------------------
            }
          }
        } else {
          e.record[limitField].error = null
        }

      } else {
        
        if (!e.record[limitField.split('　')[0]]) {
          const limit = limitField.split('　')[1];
          if (e.record[limit].value !== undefined) {
            var index = e.record[limit].value.length - 1;
            
            for (var c of e.record[limit].value) {

              if (!(c.match(text))) {
                e.record[limit].error = '入力できない文字が含まれています';
                e.error = '入力できない文字が含まれています';
              }
              else if (e.record[limit].value[index] === c && e.record[limit].error !== '入力できない文字が含まれています') {
                e.record[limit].error = null;
                //大文字・小文字変換-----------------------------------
                if (raziomoji === '大文字') {
                  var str = e.record[limit].value;
                  e.record[limit].value = str.toUpperCase();
                }
                else if (raziomoji === '小文字') {
                  var str = e.record[limit].value;
                  e.record[limit].value = str.toLowerCase();
                }
                //----------------------------------------------------

                //全角・半角変換---------------------------------------
                if (raziokaku === '全角') {
                  var str = e.record[limit].value;
                  e.record[limit].value = conversionFunc.hankakuWoZenkaku(str);
                }
                else if (raziokaku === '半角') {
                  var str = e.record[limit].value;
                  e.record[limit].value = conversionFunc.zenkakuWohankaku(str);
                }
                //---------------------------------------------------
              }
            }
          } else {
            e.record[limit].error = null;
          }


        } else {
          const table = limitField.split('　')[0];
          const limit = limitField.split('　')[1];
          e.record[table].value.forEach((row) => {
            if (row.value[limit].value !== undefined) {
              var index = row.value[limit].value.length - 1;

              for (var c of row.value[limit].value) {

                if (!(c.match(text))) {
                  row.value[limit].error = '入力できない文字が含まれています';
                  e.error = '入力できない文字が含まれています';
                }
                else if (row.value[limit].value[index] === c && row.value[limit].error !== '入力できない文字が含まれています') {
                  row.value[limit].error = null;
                  //大文字・小文字変換-----------------------------------
                  if (raziomoji === '大文字') {
                    var str = row.value[limit].value;
                    row.value[limit].value = str.toUpperCase();
                  }
                  else if (raziomoji === '小文字') {
                    var str = row.value[limit].value;
                    row.value[limit].value = str.toLowerCase();
                  }
                  //----------------------------------------------------
                  //全角・半角変換---------------------------------------
                  if (raziokaku === '全角') {
                    var str = row.value[limit].value;
                    row.value[limit].value = conversionFunc.hankakuWoZenkaku(str);
                  }
                  else if (raziokaku === '半角') {
                    var str = row.value[limit].value;
                    row.value[limit].value = conversionFunc.zenkakuWohankaku(str);
                  }
                  //---------------------------------------------------
                }
              }
            } else {
              row.value[limit].error = null;
            }

          });
        }
      }
    }
    /////////////////////////////////////////////////////////////////////////
    return e;
  });

  kintone.events.on('app.record.index.show', async function (e) {
    var func = {
      getFieldList: async function () {
        const fieldList = [];
        try {
          const resp = await kintone.api('/k/v1/app/form/layout.json', 'GET', { app: kintone.app.getId() });
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

    const fieldList = await func.getFieldList();
    if (!elements || !elements.length) return e;
    if (!fieldList || !fieldList.length) return e;

    const missingFields = [];

    for (const element of elements) {
      if (element.limitField && element.limitField !== '') {
        const limitField = fieldList.find((x) => x.code === element.limitField);
        if (!limitField) {
          missingFields.push(`[制限フィールド] ${element.limitField}`);
        }
      }
    }

    const uniqueMissingFields = [...new Set(missingFields)];

    if (uniqueMissingFields.length > 0) {
      const imageUrl = 'https://allin-one.cybozu.com/k/api/record/download.do/-/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9.png?app=4215&thumbnail=true&field=6630014&detectType=true&record=6&row=1613353&id=247948&hash=f1024070e9eab225a306f666ea7b1c567b4bb325&revision=1&.png&w=150&h=150&flag=SHRINK';
      const fieldHtml = uniqueMissingFields
        .map((code) => `・${code}`)
        .join('<br>');

      func.displayAlert(
        '警告',
        '「文字制限プラグイン」に設定済みのフィールドコードが変更または削除されています。<br><br>' +
        '対象フィールドコード：<br>' +
        fieldHtml +
        '<br><br>プラグイン設定を修正してください。',
        imageUrl,
        'OK'
      );
    }

    return e;

  });

})(jQuery, kintone.$PLUGIN_ID);
