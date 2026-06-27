// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  kintone.events.on('app.record.index.show', async (event) => {
    if (!(await KNTP708010certification())) return event;

    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    const parsePluginConfig = (value, fallback) => {
      if (!value) return fallback;
      try {
        return JSON.parse(value);
      } catch (error) {
        return fallback;
      }
    };
    const elements = parsePluginConfig(config.element, []);
    let elementsTree = parsePluginConfig(config.element, []);
    const listId = parsePluginConfig(config.listId, null);
    const radioValue = config.radioValue;
    let treeName = config.treeName;
    const menuColor = config.menuColor;
    const treeColorName = config.treeColor
    const appSize = config.appSize;
    const designTheme = config.designTheme || 'modern';
    const frameStyle = config.frameStyle || 'card';
    const buttonStyle = config.buttonStyle || 'outline';
    const domain = document.domain; //ドメイン取得
    let treeColor;
    const FRAME_STYLES = ['card', 'shadow', 'leftBorder', 'outline', 'none'];
    const BUTTON_STYLES = ['outline', 'solid', 'soft', 'pill', 'square', 'underline'];
    const PORTAL_COLUMN_COUNTS = [4, 5, 6];
    const PORTAL_MOBILE_COLUMN_COUNTS = [1, 2];
    const PORTAL_DESCRIPTION_LINES = [1, 2, 3, 4, 5];
    const PORTAL_TITLE_FONT_SIZES = [24, 26, 28, 30, 32];
    const PORTAL_DESCRIPTION_FONT_SIZES = [14, 16, 18, 20];
    const PORTAL_APP_FONT_SIZES = [14, 15, 16, 17, 18, 19];
    const PORTAL_SUBCATEGORY_FONT_SIZES = [16, 18, 20, 22];
    const CATEGORY_ICONS = [
      'none', 'clock', 'calendar', 'money', 'people', 'document', 'chart', 'gear', 'app',
      'phone', 'train', 'home', 'suitcase', 'bank', 'transfer', 'warning', 'lock', 'chat',
      'gift', 'checklist', 'idCard', 'shield', 'heart', 'lightbulb', 'yen', 'stamp', 'umbrella', 'bus',
    ];
    const DESIGN_THEMES = ['modern', 'simple', 'classic', 'iconic'];
    const ICON_SVG = {
      clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>',
      calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 10h18"></path></svg>',
      money: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"></rect><circle cx="12" cy="12" r="3"></circle><path d="M6 9h1M17 15h1"></path></svg>',
      people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="3"></circle><circle cx="17" cy="10" r="2.5"></circle><path d="M3 20c1-4 4-6 6-6s5 2 6 6"></path><path d="M14 20c.5-2 2-4 4-4 1.5 0 3 1 4 4"></path></svg>',
      document: '<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"></path><path d="M14 3v5h5M8 12h8M8 16h8"></path></svg>',
      chart: '<svg viewBox="0 0 24 24"><path d="M4 19h16"></path><rect x="6" y="11" width="3" height="6"></rect><rect x="11" y="7" width="3" height="10"></rect><rect x="16" y="4" width="3" height="13"></rect></svg>',
      gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"></path></svg>',
      app: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"></rect><rect x="14" y="4" width="6" height="6" rx="1"></rect><rect x="4" y="14" width="6" height="6" rx="1"></rect><rect x="14" y="14" width="6" height="6" rx="1"></rect></svg>',
      phone: '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"></path></svg>',
      train: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="14" rx="2"></rect><path d="M8 21l2-4M16 21l-2-4M8 8h8M8 12h3M13 12h3"></path><circle cx="9" cy="15" r="1"></circle><circle cx="15" cy="15" r="1"></circle></svg>',
      home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8"></path><path d="M5 10v11h14V10"></path><path d="M9 21v-6h6v6"></path></svg>',
      suitcase: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"></path></svg>',
      bank: '<svg viewBox="0 0 24 24"><path d="M3 10h18L12 4z"></path><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"></path></svg>',
      transfer: '<svg viewBox="0 0 24 24"><path d="M7 7h13l-4-4M17 17H4l4 4"></path></svg>',
      warning: '<svg viewBox="0 0 24 24"><path d="M12 3l10 18H2z"></path><path d="M12 9v5M12 18h.01"></path></svg>',
      lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2"></path></svg>',
      chat: '<svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3v-7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z"></path></svg>',
      gift: '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13" rx="2"></rect><path d="M12 8v13M3 12h18M7.5 8A2.5 2.5 0 1 1 12 6a2.5 2.5 0 1 1 4.5 2"></path></svg>',
      checklist: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M9 8l1 1 2-2M9 13l1 1 2-2M14 8h2M14 13h2M9 18h7"></path></svg>',
      idCard: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="9" cy="12" r="2"></circle><path d="M6 17c.7-2 2-3 3-3s2.3 1 3 3M14 10h4M14 14h4"></path></svg>',
      shield: '<svg viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"></path><path d="M9 12l2 2 4-4"></path></svg>',
      heart: '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path></svg>',
      lightbulb: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4z"></path></svg>',
      yen: '<svg viewBox="0 0 24 24"><path d="M6 4l6 8 6-8M12 12v8M8 12h8M8 16h8"></path></svg>',
      stamp: '<svg viewBox="0 0 24 24"><path d="M8 15h8l2 6H6z"></path><path d="M9 15V9a3 3 0 0 1 6 0v6M5 21h14"></path></svg>',
      umbrella: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 18 0z"></path><path d="M12 12v7a2 2 0 0 0 4 0M12 4v2"></path></svg>',
      bus: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="16" rx="2"></rect><path d="M8 7h8M7 12h10M8 19l-1 2M16 19l1 2"></path><circle cx="9" cy="16" r="1"></circle><circle cx="15" cy="16" r="1"></circle></svg>',
    };
    const COLOR_PRESETS = {
      'デフォルト': '#52a9e2',
      '青藤色': '#84a2d4',
      '赤色': '#e95744',
      '小豆色': '#96514d',
      '甚三紅': '#ee827c',
      '緑色': '#66CC99',
      '萌葱色': '#006e54',
      '青緑': '#00a497',
      '黄色': '#d6d500',
      '黄朽葉色': '#d3a243',
      '菜種油色': '#a69425',
      '紫色': '#e065f6',
      '紅藤色': '#c59ab6',
      '紫鳶': '#5f414b',
      '橙色': '#ffad00',
      '朱色': '#eb6101',
      '灰色': '#7d7d7d',
      '黒色': '#222222',
    };
    const resolveColor = (color) => {
      if (!color) return '#52a9e2';
      if (color.substr(0, 1) === '#') return color;
      return COLOR_PRESETS[color] || '#52a9e2';
    };
    const createHoverColor = (colorCode) => {
      if (!colorCode || colorCode.substr(0, 1) !== '#') return '#e0f5fc';
      const codes = [colorCode.slice(1, 3), colorCode.slice(3, 5), colorCode.slice(5, 7)];
      return '#' + codes.map((code) => {
        const color = parseInt(code, 16) * 0.1 + 255 * 0.9;
        const hex = Math.floor(color).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    };
    const normalizeDesignTheme = (theme) => {
      return DESIGN_THEMES.includes(theme) ? theme : 'modern';
    };
    const normalizeFrameStyle = (style) => {
      return FRAME_STYLES.includes(style) ? style : 'card';
    };
    const normalizeButtonStyle = (style) => {
      return BUTTON_STYLES.includes(style) ? style : 'outline';
    };
    const normalizePortalColumnCount = (columnCount) => {
      const value = parseInt(columnCount, 10);
      return PORTAL_COLUMN_COUNTS.includes(value) ? value : 6;
    };
    const normalizePortalMobileColumnCount = (columnCount) => {
      const value = parseInt(columnCount, 10);
      return PORTAL_MOBILE_COLUMN_COUNTS.includes(value) ? value : 1;
    };
    const normalizePortalDescriptionLines = (lines) => {
      const value = parseInt(lines, 10);
      return PORTAL_DESCRIPTION_LINES.includes(value) ? value : 3;
    };
    const normalizePortalFontSize = (fontSize, allowedSizes, defaultSize) => {
      const value = parseInt(fontSize, 10);
      return allowedSizes.includes(value) ? value : defaultSize;
    };
    const getPortalFontSizes = (source) => {
      return {
        title: normalizePortalFontSize(source.portalTitleFontSize, PORTAL_TITLE_FONT_SIZES, 28),
        description: normalizePortalFontSize(source.portalDescriptionFontSize, PORTAL_DESCRIPTION_FONT_SIZES, 18),
        app: normalizePortalFontSize(source.portalAppFontSize, PORTAL_APP_FONT_SIZES, 17),
        subcategory: normalizePortalFontSize(source.portalSubcategoryFontSize, PORTAL_SUBCATEGORY_FONT_SIZES, 20),
      };
    };
    const getPortalHeaderHeight = (lines, descriptionFontSize) => {
      return 64 + lines * Math.ceil(descriptionFontSize * 1.45);
    };
    const portalColumnCount = normalizePortalColumnCount(config.portalColumnCount);
    const portalMobileColumnCount = normalizePortalMobileColumnCount(config.portalMobileColumnCount);
    const portalDescriptionLines = normalizePortalDescriptionLines(config.portalDescriptionLines);
    const portalFontSizes = getPortalFontSizes(config);
    const normalizeCategoryIcon = (icon) => {
      return CATEGORY_ICONS.includes(icon) ? icon : 'none';
    };
    const createCategoryIcon = (icon) => {
      const categoryIcon = normalizeCategoryIcon(icon);
      if (categoryIcon === 'none') return null;
      return $('<span>', {
        class: 'applist-icon applist-icon-' + categoryIcon,
        'aria-hidden': 'true',
      }).html(ICON_SVG[categoryIcon]);
    };
    const getDisplayAppName = (appName) => {
      return String(appName || '').replace(/^\d+\s+/, '');
    };

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
    elementsTree.forEach((element) => {
      if (!Array.isArray(element.subCategory)) element.subCategory = [];
    });
    for (let i = 0; i < elementsTree.length; i++) {
      if (elementsTree[i]['subCategoryCheck'] === true && i > 0) {
        let box = elementsTree.splice(i, 1);
        elementsTree[i - 1]['subCategory'].push(box[0]);
        i--;
      }
    }

    if (listId === event.viewId) {
      //setConfigのIDと同じIDの場合の処理
      $('#applist-container')
        .addClass('applist')
        .addClass('applist-theme-' + normalizeDesignTheme(designTheme));

      if (radioValue === 'ツリー型') {
        //______ツリー型の処理_________________________________________________________________________

        let ulMain, ulParent, ulChild, ulSubChild, liMain, liParent, liChild, liSub, liSubChild, a;

        liMain = $('<li>', { text: treeName, class: 'li-main' });
        ulMain = $('<ul>', { class: 'ul-main' });
        ulParent = $('<ul>', { class: 'ul-parent' }); //ulタグ作成

        const root = document.querySelector(':root')
        if (root) root.style.setProperty("--color", treeColor);

        // カテゴリ配列の数分ループ
        for (let element of elementsTree) {
          liParent = $('<li>', { class: 'li-parent' }); //liタグ作成
          const parentIcon = createCategoryIcon(element.icon);
          if (parentIcon) liParent.append(parentIcon);
          liParent.append($('<span>', { text: element.name, class: 'applist-category-label' }));
          ulChild = $('<ul>', { class: 'ul-child' }); //ulタグ作成
          for (let app of element.apps) {
            liChild = $('<li>', { class: 'li-child' });
            a = $('<a>', {
              //aタグ作成
              href: 'https://' + domain + '/k/' + app.appId + '/',
              target: '_blank',
              rel: 'noopener noreferrer',
              text: app.appName,
              class: 'l-tag'
            });
            liChild.append(a);
            ulChild.append(liChild);
          }

          // サブカテゴリ配列の数分ループ
          for (let subCategory of element.subCategory) {
            liSub = $('<li>', { class: 'li-sub' }); //liタグ作成
            const subCategoryIcon = createCategoryIcon(subCategory.icon);
            if (subCategoryIcon) liSub.append(subCategoryIcon);
            liSub.append($('<span>', { text: subCategory.name, class: 'applist-category-label' }));
            ulSubChild = $('<ul>', { class: 'ul-sub-child' }); //ulタグ作成
            for (let app of subCategory.apps) {
              liSubChild = $('<li>', { class: 'li-sub-child' });
              a = $('<a>', {
                //aタグ作成
                href: 'https://' + domain + '/k/' + app.appId + '/',
                target: '_blank',
                rel: 'noopener noreferrer',
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

        const table = $('<table>', { class: 'applist-table' }); //tableタグ作成

        elements.forEach((element) => {
          //カテゴリーの個数分処理
          const categoryColor = resolveColor(element.color || menuColor);
          const categoryFrameStyle = normalizeFrameStyle(element.frameStyle || frameStyle);
          const categoryButtonStyle = normalizeButtonStyle(element.buttonStyle || buttonStyle);
          categoryName = $('<h1>', {
            //カテゴリー名のh1タグ作成
            class: 'category-name',
          });
          const categoryIcon = createCategoryIcon(element.icon);
          if (categoryIcon) categoryName.append(categoryIcon);
          categoryName.append($('<span>', { text: element.name, class: 'applist-category-label' }));
          tr = $('<tr>', {}); //trタグ作成
          td = $('<td>', {}); //tdタグ作成
          subContent = $('<div>', { class: 'sub-content applist-frame-' + categoryFrameStyle }); //divタグ作成
          subContent.css({
            '--category-color': categoryColor,
            '--category-hover-bg': createHoverColor(categoryColor),
          });
          subContent.append(categoryName);
          element.apps.forEach((element) => {
            //各カテゴリーのアプリの個数分処理
            app = $('<div>', { class: 'app-name' }); //アプリ名が入るdivタグ作成
            link = $('<a>', {
              //aタグ作成
              href: 'https://' + domain + '/k/' + element.appId + '/',
              target: '_blank',
              rel: 'noopener noreferrer',
              text: getDisplayAppName(element.appName),
              class: 'a-tag applist-button-' + categoryButtonStyle,
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
        switch (appSize) {
          case '大':
            $('.a-tag').css({
              'font-size': '25px',
              height: '35px',
              'line-height': '25px',
            });
            $('.app-name').css({
              width: '349px',
            });
            break;

          case '中':
            $('.a-tag').css({
              'font-size': '19px',
              height: '25px',
              'line-height': '17px',
            });
            $('.app-name').css({
              width: '195px',
            });
            break;

            case '小':
            $('.a-tag').css({
              'font-size': '13px',
              height: '20px',
              'line-height': '15px',
            });
            $('.app-name').css({
              width: '130px',
            });
            break;
        }

        //メニュー色変換
        const menuColorFunc = (baseColor, hoverColor, hoverBackColor) => {
          $('.sub-content').each(function() {
            if (!this.style.getPropertyValue('--category-color')) {
              this.style.setProperty('--category-color', baseColor);
              this.style.setProperty('--category-hover-bg', '#' + hoverBackColor);
            }
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
      } else if (radioValue === 'ポータル型') {
        const portalGrid = $('<div>', { class: 'applist-portal-grid' });
        portalGrid.css({
          '--portal-column-count': String(portalColumnCount),
          '--portal-mobile-column-count': String(portalMobileColumnCount),
          '--portal-description-lines': String(portalDescriptionLines),
          '--portal-header-height': getPortalHeaderHeight(portalDescriptionLines, portalFontSizes.description) + 'px',
          '--portal-title-font-size': portalFontSizes.title + 'px',
          '--portal-description-font-size': portalFontSizes.description + 'px',
          '--portal-app-font-size': portalFontSizes.app + 'px',
          '--portal-subcategory-font-size': portalFontSizes.subcategory + 'px',
        });

        elementsTree.forEach((element, index) => {
          const categoryColor = resolveColor(element.color || menuColor);
          const portalCard = $('<section>', { class: 'applist-portal-card' });
          portalCard.css({
            '--category-color': categoryColor,
            '--category-hover-bg': createHoverColor(categoryColor),
          });

          const portalHeader = $('<div>', { class: 'applist-portal-header' });
          portalHeader.append($('<span>', { class: 'applist-portal-number', text: index + 1 }));
          const portalTitleWrap = $('<div>', { class: 'applist-portal-title-wrap' });
          portalTitleWrap.append($('<h2>', { class: 'applist-portal-title', text: element.name }));
          if (element.description) {
            portalTitleWrap.append($('<p>', { class: 'applist-portal-description', text: element.description }));
          }
          portalHeader.append(portalTitleWrap);
          portalCard.append(portalHeader);

          const portalList = $('<div>', { class: 'applist-portal-list' });
          const categoryAppIconName = normalizeCategoryIcon(element.icon) === 'none' ? 'app' : element.icon;
          element.apps.forEach((appItem) => {
            const portalLink = $('<a>', {
              class: 'applist-portal-link',
              href: 'https://' + domain + '/k/' + appItem.appId + '/',
              target: '_blank',
              rel: 'noopener noreferrer',
            });
            const appIconName = normalizeCategoryIcon(appItem.icon);
            const appIcon = createCategoryIcon(appIconName === 'none' ? categoryAppIconName : appIconName);
            if (appIcon) portalLink.append(appIcon);
            portalLink.append($('<span>', { class: 'applist-portal-app-name', text: getDisplayAppName(appItem.appName) }));
            portalList.append(portalLink);
          });
          (element.subCategory || []).forEach((subCategory) => {
            const subCategoryIconName = normalizeCategoryIcon(subCategory.icon) === 'none' ? categoryAppIconName : subCategory.icon;
            const portalSubGroup = $('<div>', { class: 'applist-portal-subcategory' });
            const portalSubTitle = $('<h3>', { class: 'applist-portal-subcategory-title' });
            const subCategoryIcon = createCategoryIcon(subCategoryIconName);
            if (subCategoryIcon) portalSubTitle.append(subCategoryIcon);
            portalSubTitle.append($('<span>', { text: subCategory.name }));
            portalSubGroup.append(portalSubTitle);

            subCategory.apps.forEach((appItem) => {
              const portalLink = $('<a>', {
                class: 'applist-portal-link',
                href: 'https://' + domain + '/k/' + appItem.appId + '/',
                target: '_blank',
                rel: 'noopener noreferrer',
              });
              const appIconName = normalizeCategoryIcon(appItem.icon);
              const appIcon = createCategoryIcon(appIconName === 'none' ? subCategoryIconName : appIconName);
              if (appIcon) portalLink.append(appIcon);
              portalLink.append($('<span>', { class: 'applist-portal-app-name', text: getDisplayAppName(appItem.appName) }));
              portalSubGroup.append(portalLink);
            });
            portalList.append(portalSubGroup);
          });
          portalCard.append(portalList);
          portalGrid.append(portalCard);
        });
        $('#applist-container').append(portalGrid);
      }
    }
  });
})(jQuery, kintone.$PLUGIN_ID);
