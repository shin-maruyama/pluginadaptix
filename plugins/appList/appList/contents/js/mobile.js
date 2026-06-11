// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  kintone.events.on('mobile.app.record.index.show', async (event) => {
    if (!(await KNTP708010certification())) return event;

    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    const elements = JSON.parse(config.element);
    let elementsTree = JSON.parse(config.element);
    const listId = JSON.parse(config.listId);
    const radioValue = config.radioValue;
    let treeName = config.treeName;
    const menuColor = config.menuColor;
    const treeColorName = config.treeColor
    const appSizeMobile = config.appSizeMobile;
    const domain = document.domain; //ドメイン取得
    let treeColor;

    switch (treeColorName) {
      case 'デフォルト':
        treeColor = '#52a9e2';
        break;
      case '青藤色':
        treeColor = '#5c83c7';
        break;
      case '赤色':
        treeColor = '#990000';
        break;
      case '小豆色':
        treeColor = '#833430';
        break;
      case '甚三紅':
        treeColor = '#f0645d';
        break;
      case '緑色':
        treeColor = '#009966';
        break;
      case '萌葱色':
        treeColor ='#015340';
        break;
      case '青緑':
        treeColor ='#087c73';
        break;
      case '黄色':
        treeColor = '#adac00';
        break;
      case '黄朽葉色':
        treeColor = '#b8882a';
        break;
      case '菜種油色':
        treeColor = '#7e6d00';
        break;
      case '紫色':
        treeColor = '#8f12a5';
        break;
      case '紅藤色':
        treeColor = '#a76d92';
        break;
      case '紫鳶':
        treeColor = '#472933';
        break;
      case '橙色':
        treeColor = '#ca8a02';
        break;
      case '朱色':
        treeColor = '#c25304';
        break;
      case '灰色':
        treeColor = '#6d6060';
        break;
      case '黒色':
        treeColor = '#000000';
        break;
      default:
        treeColor = treeColorName;
    }

    //ツリー用のカテゴリー配列作成
    for (let i = 0; i < elementsTree.length; i++) {
      if (elementsTree[i]['subCategoryCheck'] === true) {
        let box = elementsTree.splice(i, 1);
        elementsTree[i - 1]['subCategory'].push(box[0]);
        i--;
      }
    }

    if (listId === event.viewId) {
      //setConfigのIDと同じIDの場合の処理

      if (radioValue === 'ツリー型') {
        //______ツリー型の処理_________________________________________________________________________

        let ulMain, ulParent, ulChild, ulSubChild, liMain, liParent, liChild, liSub, liSubChild, a;

        liMain = $('<li>', { text: treeName, class: 'li-main' });
        ulMain = $('<ul>', { class: 'ul-main' });
        ulParent = $('<ul>', { class: 'ul-parent' }); //ulタグ作成

        const root = document.querySelector(':root')
        root.style.setProperty("--color", treeColor);

        // カテゴリ配列の数分ループ
        for (let element of elementsTree) {
          liParent = $('<li>', { text: element.name, class: 'li-parent' }); //liタグ作成
          ulChild = $('<ul>', { class: 'ul-child' }); //ulタグ作成
          for (let app of element.apps) {
            liChild = $('<li>', { class: 'li-child' });
            a = $('<a>', {
              //aタグ作成
              href: 'https://' + domain + '/k/' + app.appId + '/',
              target: '_blank',
              text: app.appName,
              class: 'l-tag'
            });
            liChild.append(a);
            ulChild.append(liChild);
          }

          // サブカテゴリ配列の数分ループ
          for (let subCategory of element.subCategory) {
            liSub = $('<li>', { text: subCategory.name, class: 'li-sub' }); //liタグ作成
            ulSubChild = $('<ul>', { class: 'ul-sub-child' }); //ulタグ作成
            for (let app of subCategory.apps) {
              liSubChild = $('<li>', { class: 'li-sub-child' });
              a = $('<a>', {
                //aタグ作成
                href: 'https://' + domain + '/k/' + app.appId + '/',
                target: '_blank',
                text: app.appName,
              });
              liSubChild.append(a);
              ulSubChild.append(liSubChild);
            }
            liSub.append(ulSubChild);
            ulChild.append(liSub);
          }
          liParent.append(ulChild);
          ulParent.append(liParent);
        }
        liMain.append(ulParent);
        ulMain.append(liMain);
        $('#applist-container').append(ulMain); //#applist-containerのdivタグにulを追加
        //_________________________________________________________________________________________
      } else if (radioValue === 'ボタン型') {
        //_____ボタン型の処理___________________________________________________________________________
        let tr, td, subContent, categoryName, app, link; //タグを格納する変数の宣言

        const table = $('<table>', {}); //tableタグ作成

        elements.forEach((element) => {
          //カテゴリーの個数分処理
          categoryName = $('<h1>', {
            //カテゴリー名のh1タグ作成
            class: 'category-name',
            text: element.name,
          });
          tr = $('<tr>', {}); //trタグ作成
          td = $('<td>', {}); //tdタグ作成
          subContent = $('<div>', { class: 'sub-content' }); //divタグ作成
          subContent.append(categoryName);
          element.apps.forEach((element) => {
            //各カテゴリーのアプリの個数分処理
            app = $('<div>', { class: 'app-name' }); //アプリ名が入るdivタグ作成
            link = $('<a>', {
              //aタグ作成
              href: 'https://' + domain + '/k/' + element.appId + '/',
              target: '_blank',
              text: element.appName.split(' ')[1],
              class: 'a-tag',
            });
            app.append(link);
            subContent.append(app);
          });
          td.append(subContent);
          tr.append(td);
          table.append(tr);
        });
        $('#applist-container').append(table); //#applist-containerのdivタグにテーブルを追加

        //_______________________________________________________________________________________

        //css動的変換の処理_____________________________________________________________________________
        //アプリ表示名大きさ変更
        switch (appSizeMobile) {
          case '大':
            $('.a-tag').css({
              'font-size': '27px',
              height: '35px',
              'line-height': '22px',
            });
            $('.app-name').css({
              width: '295px',
            });
            break;

          case '中':
            $('.a-tag').css({
              'font-size': '20px',
              height: '20px',
              'line-height': '17px',
            });
            $('.app-name').css({
              width: '295px',
            });
            break;

            case '小':
            $('.a-tag').css({
              'font-size': '13px',
              height: '15px',
              'line-height': '12px',
            });
            $('.app-name').css({
              width: '130px',
            });
            break;
        }

        //メニュー色変換
        const menuColorFunc = (baseColor, hoverColor, hoverBackColor) => {
          $('.sub-content').css({ 'border-color': baseColor });
          $('.category-name').css({
            'background-color': baseColor,
            'border-color': baseColor,
          });
          $('.a-tag').css({
            'color': baseColor,
            'border-color': baseColor,
          });
          
          $('.a-tag').on('touchstart',
            function () {
              $(this).css({
                'color': hoverColor,
                'border-color': hoverColor,
                'background-color':"#" + hoverBackColor,
              });
            });

            $('.a-tag').on('touchend',
            function () {
              $(this).css({
                'color': baseColor,
                'border-color': baseColor,
                'background-color': '',
              });
            });
        };

        //マウスオーバーした時の色を求める。
        const invertColor = (colorCode) => {
          const codes = [colorCode.slice(1, 3), colorCode.slice(3, 5), colorCode.slice(5, 7)]
          return codes.map(code => compositeColor(code,0.1)).join("");
          function compositeColor(code,alpha){
            const colorCode = parseInt(code, 16) * alpha + 255 * (1 - alpha);
            return Math.floor(colorCode).toString(16);
          }
        }

          //カラーピッカーから選択された色の場合
          if(menuColor.substr(0,1) == "#"){
            menuColorFunc(menuColor, menuColor, invertColor(menuColor))
          };
          
          switch (menuColor) {
            case 'デフォルト':
              menuColorFunc('#52a9e2', '#52a9e2', '#ad561e');
              break;
            case '青藤色':
              menuColorFunc('#84a2d4', '#5c83c7', '#e9f1ff');
              break;
            case '赤色':
              menuColorFunc('#e95744', '#990000', '#fee9e6');
              break;
            case '小豆色':
              menuColorFunc('#96514d', '#833430', '#fddfdb');
              break;
            case '甚三紅':
              menuColorFunc('#ee827c', '#f0645d', '#ffdfdd');
              break;
            case '緑色':
              menuColorFunc('#66CC99', '#009966', '#CCFFCC');
              break;
            case '萌葱色':
              menuColorFunc('#006e54', '#015340', '#e2fff8');
              break;
            case '青緑':
              menuColorFunc('#00a497', '#087c73', '#dbfffc');
              break;
            case '黄色':
              menuColorFunc('#d6d500', '#adac00', '#ffffd6');
              break;
            case '黄朽葉色':
              menuColorFunc('#d3a243', '#b8882a', '#ffebc2');
              break;
            case '菜種油色':
              menuColorFunc('#a69425', '#7e6d00', '#ebe3b3');
              break;
            case '紫色':
              menuColorFunc('#e065f6', '#8f12a5', '#fae1fe');
              break;
            case '紅藤色':
              menuColorFunc('#c59ab6', '#a76d92', '#fff7fc');
              break;
            case '紫鳶':
              menuColorFunc('#5f414b', '#472933', '#dbc8cf');
              break;
            case '橙色':
              menuColorFunc('#ffad00', '#ca8a02', '#fef0d2');
              break;
            case '朱色':
              menuColorFunc('#eb6101', '#c25304', '#ffd2b1');
              break;
            case '灰色':
              menuColorFunc('#7d7d7d', '#6d6060', '#ece9e9');
              break;
            case '黒色':
              menuColorFunc('#222222', '#000000', '#EEEEEE');
              break;
        }
        //__________________________________________________________________________________________
      }
    }
  });
})(jQuery, kintone.$PLUGIN_ID);
