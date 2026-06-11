// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

      if (!(await KNTP708010certification())) {
        return;
      }

  $(function () {
    const $form = $('.js-submit-settings');
    const $cancelButton = $('.js-cancel-button');
    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    const DEFAULT_COLOR = '#52a9e2';
    const DEFAULT_DESIGN_THEME = 'modern';
    const DEFAULT_CATEGORY_ICON = 'none';
    const DEFAULT_CATEGORY_FRAME_STYLE = 'card';
    const DEFAULT_BUTTON_STYLE = 'outline';
    const DEFAULT_PORTAL_COLUMN_COUNT = '6';
    const DEFAULT_PORTAL_MOBILE_COLUMN_COUNT = '1';
    const DEFAULT_PORTAL_DESCRIPTION_LINES = '3';
    const DEFAULT_PORTAL_TITLE_FONT_SIZE = '28';
    const DEFAULT_PORTAL_DESCRIPTION_FONT_SIZE = '18';
    const DEFAULT_PORTAL_APP_FONT_SIZE = '17';
    const DEFAULT_PORTAL_SUBCATEGORY_FONT_SIZE = '20';
    const FRAME_STYLES = ['card', 'shadow', 'leftBorder', 'outline', 'none'];
    const BUTTON_STYLES = ['outline', 'solid', 'soft', 'pill', 'square', 'underline'];
    const PORTAL_COLUMN_COUNTS = ['4', '5', '6'];
    const PORTAL_MOBILE_COLUMN_COUNTS = ['1', '2'];
    const PORTAL_DESCRIPTION_LINES = ['1', '2', '3', '4', '5'];
    const PORTAL_TITLE_FONT_SIZES = ['24', '26', '28', '30', '32'];
    const PORTAL_DESCRIPTION_FONT_SIZES = ['14', '16', '18', '20'];
    const PORTAL_APP_FONT_SIZES = ['14', '15', '16', '17', '18', '19'];
    const PORTAL_SUBCATEGORY_FONT_SIZES = ['16', '18', '20', '22'];
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

    function resolveColor(color) {
      if (!color) return DEFAULT_COLOR;
      if (color.substr(0, 1) === '#') return color;
      return COLOR_PRESETS[color] || DEFAULT_COLOR;
    }

    function getPresetNameByColor(color) {
      if (!color || color.substr(0, 1) !== '#') return color || 'デフォルト';
      const lowerColor = color.toLowerCase();
      const presetNames = Object.keys(COLOR_PRESETS);
      for (let i = 0; i < presetNames.length; i++) {
        const presetName = presetNames[i];
        if (COLOR_PRESETS[presetName].toLowerCase() === lowerColor) {
          return presetName;
        }
      }
      return '抽出色';
    }

    function getCategorySelectedColor(category) {
      const colorSelect = category.querySelector('[data-role="category-color-select"]');
      const colorInput = category.querySelector('[data-role="category-color"]');
      if (colorSelect && colorSelect.value !== '抽出色') {
        return resolveColor(colorSelect.value);
      }
      return colorInput ? colorInput.value : DEFAULT_COLOR;
    }

    function normalizeElements(elements) {
      if (!Array.isArray(elements)) return [];
      return elements.map((element) => {
        const hasFrameStyle = Object.prototype.hasOwnProperty.call(element, 'frameStyle');
        const frameStyle = hasFrameStyle ? element.frameStyle : DEFAULT_CATEGORY_FRAME_STYLE;
        const buttonStyle = element.buttonStyle || null;
        return {
          name: element.name || '',
          description: element.description || '',
          color: element.color || null,
          icon: CATEGORY_ICONS.includes(element.icon) ? element.icon : DEFAULT_CATEGORY_ICON,
          frameStyle: FRAME_STYLES.includes(frameStyle) ? frameStyle : null,
          buttonStyle: BUTTON_STYLES.includes(buttonStyle) ? buttonStyle : null,
          subCategoryCheck: element.subCategoryCheck === true,
          subCategory: Array.isArray(element.subCategory) ? element.subCategory : [],
          apps: Array.isArray(element.apps) ? element.apps.map((app) => {
            return Object.assign({}, app, {
              icon: normalizeCategoryIcon(app.icon),
            });
          }) : [],
        };
      });
    }

    function normalizeDesignTheme(designTheme) {
      return DESIGN_THEMES.includes(designTheme) ? designTheme : DEFAULT_DESIGN_THEME;
    }

    function normalizeFrameStyle(frameStyle) {
      return FRAME_STYLES.includes(frameStyle) ? frameStyle : DEFAULT_CATEGORY_FRAME_STYLE;
    }

    function normalizeButtonStyle(buttonStyle) {
      return BUTTON_STYLES.includes(buttonStyle) ? buttonStyle : DEFAULT_BUTTON_STYLE;
    }

    function normalizePortalColumnCount(columnCount) {
      const value = String(columnCount || '');
      return PORTAL_COLUMN_COUNTS.includes(value) ? value : DEFAULT_PORTAL_COLUMN_COUNT;
    }

    function normalizePortalMobileColumnCount(columnCount) {
      const value = String(columnCount || '');
      return PORTAL_MOBILE_COLUMN_COUNTS.includes(value) ? value : DEFAULT_PORTAL_MOBILE_COLUMN_COUNT;
    }

    function normalizePortalDescriptionLines(lines) {
      const value = String(lines || '');
      return PORTAL_DESCRIPTION_LINES.includes(value) ? value : DEFAULT_PORTAL_DESCRIPTION_LINES;
    }

    function normalizePortalFontSize(fontSize, allowedSizes, defaultSize) {
      const value = String(fontSize || '');
      return allowedSizes.includes(value) ? value : defaultSize;
    }

    function getPortalFontSizesFromConfig(source) {
      return {
        title: normalizePortalFontSize(source.portalTitleFontSize, PORTAL_TITLE_FONT_SIZES, DEFAULT_PORTAL_TITLE_FONT_SIZE),
        description: normalizePortalFontSize(source.portalDescriptionFontSize, PORTAL_DESCRIPTION_FONT_SIZES, DEFAULT_PORTAL_DESCRIPTION_FONT_SIZE),
        app: normalizePortalFontSize(source.portalAppFontSize, PORTAL_APP_FONT_SIZES, DEFAULT_PORTAL_APP_FONT_SIZE),
        subcategory: normalizePortalFontSize(source.portalSubcategoryFontSize, PORTAL_SUBCATEGORY_FONT_SIZES, DEFAULT_PORTAL_SUBCATEGORY_FONT_SIZE),
      };
    }

    function getPortalFontSizesFromForm() {
      return {
        title: normalizePortalFontSize(document.getElementById('portal-title-font-size-select').value, PORTAL_TITLE_FONT_SIZES, DEFAULT_PORTAL_TITLE_FONT_SIZE),
        description: normalizePortalFontSize(document.getElementById('portal-description-font-size-select').value, PORTAL_DESCRIPTION_FONT_SIZES, DEFAULT_PORTAL_DESCRIPTION_FONT_SIZE),
        app: normalizePortalFontSize(document.getElementById('portal-app-font-size-select').value, PORTAL_APP_FONT_SIZES, DEFAULT_PORTAL_APP_FONT_SIZE),
        subcategory: normalizePortalFontSize(document.getElementById('portal-subcategory-font-size-select').value, PORTAL_SUBCATEGORY_FONT_SIZES, DEFAULT_PORTAL_SUBCATEGORY_FONT_SIZE),
      };
    }

    function parsePluginConfig(value, fallback) {
      if (!value) return fallback;
      try {
        return JSON.parse(value);
      } catch (error) {
        return fallback;
      }
    }

    function normalizeCategoryIcon(icon) {
      return CATEGORY_ICONS.includes(icon) ? icon : DEFAULT_CATEGORY_ICON;
    }

    function getCurrentMenuColor() {
      const colorSelect = document.getElementById('color-select');
      if (colorSelect && colorSelect.value === '抽出色') {
        return $('#color-picker').val() || DEFAULT_COLOR;
      }
      return resolveColor(colorSelect ? colorSelect.value : config.menuColor);
    }

    function updateCategoryColorControl(category) {
      if (!category) return;
      const colorMode = category.querySelector('[data-role="category-color-mode"]');
      const colorSelect = category.querySelector('[data-role="category-color-select"]');
      const colorInput = category.querySelector('[data-role="category-color"]');
      const colorPreview = category.querySelector('[data-role="category-color-preview"]');
      const colorPalette = category.querySelector('[data-role="category-color-palette"]');
      if (!colorMode || !colorSelect || !colorInput || !colorPreview) return;

      const isCustomColor = colorMode.value === 'custom';
      const previewColor = isCustomColor ? getCategorySelectedColor(category) : getCurrentMenuColor();
      const isPickerColor = colorSelect.value === '抽出色';
      colorSelect.disabled = !isCustomColor;
      colorInput.disabled = !isCustomColor || !isPickerColor;
      colorInput.value = previewColor;
      colorPreview.style.backgroundColor = previewColor;
      colorPreview.textContent = isCustomColor ? '個別色' : '全体色';
      category.querySelectorAll('[data-role="category-color-preset"]').forEach((swatch) => {
        swatch.disabled = !isCustomColor;
        swatch.classList.toggle('is-active', isCustomColor && swatch.getAttribute('data-color') === colorSelect.value);
      });
      if (colorPalette) {
        colorPalette.classList.toggle('is-disabled', !isCustomColor);
      }
    }

    function updateAllCategoryColorControls() {
      document.querySelectorAll('.category').forEach((category) => {
        updateCategoryColorControl(category);
      });
    }

    function applyCategoryConfig(category, element) {
      if (!category || !element) return;
      const categoryNameInput = category.querySelector('[data-role="category-name"]');
      const categoryDescriptionInput = category.querySelector('[data-role="category-description"]');
      const subCategoryCheck = category.querySelector('[data-role="subcategory-check"]');
      const colorMode = category.querySelector('[data-role="category-color-mode"]');
      const colorSelect = category.querySelector('[data-role="category-color-select"]');
      const colorInput = category.querySelector('[data-role="category-color"]');
      const frameStyleSelect = category.querySelector('[data-role="category-frame-style"]');
      const buttonStyleSelect = category.querySelector('[data-role="category-button-style"]');
      const iconSelect = category.querySelector('[data-role="category-icon"]');

      if (categoryNameInput) categoryNameInput.value = element.name;
      if (categoryDescriptionInput) categoryDescriptionInput.value = element.description || '';
      if (subCategoryCheck) subCategoryCheck.checked = element.subCategoryCheck;
      if (iconSelect) iconSelect.value = normalizeCategoryIcon(element.icon);
      if (frameStyleSelect) frameStyleSelect.value = element.frameStyle || '';
      if (buttonStyleSelect) buttonStyleSelect.value = element.buttonStyle || '';
      if (colorMode && colorSelect && colorInput) {
        const presetName = getPresetNameByColor(element.color);
        colorMode.value = element.color ? 'custom' : '';
        colorSelect.value = element.color ? presetName : 'デフォルト';
        colorInput.value = element.color ? resolveColor(element.color) : getCurrentMenuColor();
      }
      updateCategoryColorControl(category);
    }

    function applyAppConfig(row, app) {
      if (!row || !app) return;
      const appSelect = row.querySelector('[data-role="app-name"]');
      const appIconSelect = row.querySelector('[data-role="app-icon"]');
      if (appSelect) appSelect.value = app.appId;
      if (appIconSelect) appIconSelect.value = normalizeCategoryIcon(app.icon);
    }

    function getDisplayAppName(appName) {
      return String(appName || '').replace(/^\d+\s+/, '');
    }

    function getPortalPreviewIconLabel(icon) {
      const labels = {
        clock: 'CL',
        calendar: 'CA',
        money: 'MO',
        people: 'PE',
        document: 'DO',
        chart: 'CH',
        gear: 'GE',
        app: 'AP',
        phone: 'PH',
        train: 'TR',
        home: 'HO',
        suitcase: 'SU',
        bank: 'BA',
        transfer: 'TF',
        warning: 'WA',
        lock: 'LO',
        chat: 'CT',
        gift: 'GI',
        checklist: 'CK',
        idCard: 'ID',
        shield: 'SH',
        heart: 'HE',
        lightbulb: 'LI',
        yen: 'YE',
        stamp: 'ST',
        umbrella: 'UM',
        bus: 'BU',
      };
      return labels[icon] || 'IC';
    }

    function createPortalPreviewIcon(icon) {
      const normalizedIcon = normalizeCategoryIcon(icon);
      if (normalizedIcon === 'none') return null;
      return $('<span>', {
        class: 'portal-preview-icon portal-preview-icon-' + normalizedIcon,
        title: normalizedIcon,
      }).html(ICON_SVG[normalizedIcon]);
    }

    function getPortalPreviewHeaderHeight(lines, descriptionFontSize) {
      return 56 + parseInt(lines, 10) * Math.ceil(parseInt(descriptionFontSize, 10) * 1.1);
    }

    function readPortalPreviewCategory(category) {
      const categoryNameInput = category.querySelector('[data-role="category-name"]');
      const categoryDescriptionInput = category.querySelector('[data-role="category-description"]');
      const subCategoryCheckInput = category.querySelector('[data-role="subcategory-check"]');
      const colorMode = category.querySelector('[data-role="category-color-mode"]');
      const categoryIconSelect = category.querySelector('[data-role="category-icon"]');
      const appRows = category.querySelectorAll('.select-class');

      const apps = [];
      appRows.forEach((row) => {
        const appSelect = row.querySelector('[data-role="app-name"]');
        const appIconSelect = row.querySelector('[data-role="app-icon"]');
        const appId = appSelect ? appSelect.value : '';
        if (!appId || appId === 'null') return;
        const selectedOption = appSelect.options[appSelect.selectedIndex];
        apps.push({
          appName: selectedOption ? selectedOption.text : '',
          icon: appIconSelect ? normalizeCategoryIcon(appIconSelect.value) : DEFAULT_CATEGORY_ICON,
        });
      });

      return {
        name: categoryNameInput && categoryNameInput.value ? categoryNameInput.value : 'カテゴリー',
        description: categoryDescriptionInput ? categoryDescriptionInput.value : '',
        color: colorMode && colorMode.value === 'custom' ? getCategorySelectedColor(category) : getCurrentMenuColor(),
        icon: categoryIconSelect ? normalizeCategoryIcon(categoryIconSelect.value) : DEFAULT_CATEGORY_ICON,
        subCategoryCheck: subCategoryCheckInput ? subCategoryCheckInput.checked : false,
        subCategory: [],
        apps: apps,
      };
    }

    function buildPortalPreviewTree(categories) {
      const parentCategories = [];
      let currentParent = null;
      categories.forEach((category) => {
        category.subCategory = [];
        if (category.subCategoryCheck && currentParent) {
          currentParent.subCategory.push(category);
          return;
        }
        parentCategories.push(category);
        currentParent = category;
      });
      return parentCategories;
    }

    function appendPortalPreviewApp(container, appItem, fallbackIconName) {
      const previewLink = $('<div>', { class: 'portal-preview-link' });
      const appIconName = normalizeCategoryIcon(appItem.icon);
      const appIcon = createPortalPreviewIcon(appIconName === 'none' ? fallbackIconName : appIconName);
      if (appIcon) previewLink.append(appIcon);
      previewLink.append($('<span>', {
        class: 'portal-preview-app-name',
        text: getDisplayAppName(appItem.appName),
      }));
      container.append(previewLink);
    }

    function renderPortalPreview() {
      const portalRadio = document.getElementById('radio-2');
      const previewSection = $('#portal-preview-section');
      if (!portalRadio || !portalRadio.checked) {
        previewSection.css('display', 'none');
        return;
      }

      previewSection.css('display', 'block');
      const previewRoot = $('#portal-preview-root');
      previewRoot.empty();

      const columnCount = normalizePortalColumnCount(document.getElementById('portal-column-count-select').value);
      const descriptionLines = normalizePortalDescriptionLines(document.getElementById('portal-description-lines-select').value);
      const portalFontSizes = getPortalFontSizesFromForm();
      previewRoot.css({
        '--portal-preview-columns': columnCount,
        '--portal-preview-lines': descriptionLines,
        '--portal-preview-header-height': getPortalPreviewHeaderHeight(descriptionLines, portalFontSizes.description) + 'px',
        '--portal-preview-title-font-size': Math.max(14, Math.round(parseInt(portalFontSizes.title, 10) * 0.65)) + 'px',
        '--portal-preview-description-font-size': Math.max(12, Math.round(parseInt(portalFontSizes.description, 10) * 0.78)) + 'px',
        '--portal-preview-app-font-size': Math.max(12, Math.round(parseInt(portalFontSizes.app, 10) * 0.76)) + 'px',
        '--portal-preview-subcategory-font-size': Math.max(13, Math.round(parseInt(portalFontSizes.subcategory, 10) * 0.75)) + 'px',
      });

      const categories = Array.from(document.querySelectorAll('.category')).map(readPortalPreviewCategory);
      const portalCategories = buildPortalPreviewTree(categories);
      if (portalCategories.length === 0) {
        previewRoot.append($('<p>', { class: 'portal-preview-empty', text: 'プレビュー対象がありません。' }));
        return;
      }

      portalCategories.forEach((category, index) => {
        const categoryColor = category.color || DEFAULT_COLOR;
        const previewCard = $('<section>', { class: 'portal-preview-card' });
        previewCard.css({ '--category-color': categoryColor });

        const previewHeader = $('<div>', { class: 'portal-preview-header' });
        previewHeader.append($('<span>', { class: 'portal-preview-number', text: index + 1 }));
        const previewTitleWrap = $('<div>', { class: 'portal-preview-title-wrap' });
        previewTitleWrap.append($('<h2>', { class: 'portal-preview-category-title', text: category.name }));
        if (category.description) {
          previewTitleWrap.append($('<p>', { class: 'portal-preview-description', text: category.description }));
        }
        previewHeader.append(previewTitleWrap);
        previewCard.append(previewHeader);

        const previewList = $('<div>', { class: 'portal-preview-list' });
        const categoryAppIconName = normalizeCategoryIcon(category.icon) === 'none' ? 'app' : category.icon;
        category.apps.forEach((appItem) => {
          appendPortalPreviewApp(previewList, appItem, categoryAppIconName);
        });

        category.subCategory.forEach((subCategory) => {
          const subCategoryIconName = normalizeCategoryIcon(subCategory.icon) === 'none' ? categoryAppIconName : subCategory.icon;
          const previewSubGroup = $('<div>', { class: 'portal-preview-subcategory' });
          const previewSubTitle = $('<h3>', { class: 'portal-preview-subcategory-title' });
          const subCategoryIcon = createPortalPreviewIcon(subCategoryIconName);
          if (subCategoryIcon) previewSubTitle.append(subCategoryIcon);
          previewSubTitle.append($('<span>', { text: subCategory.name }));
          previewSubGroup.append(previewSubTitle);
          subCategory.apps.forEach((appItem) => {
            appendPortalPreviewApp(previewSubGroup, appItem, subCategoryIconName);
          });
          previewList.append(previewSubGroup);
        });

        previewCard.append(previewList);
        previewRoot.append(previewCard);
      });
    }

    //アプリ一覧を取得する再帰関数_______________________________________________________________
    function getAppList(T_offset, T_limit, T_apps) {
      let offset = T_offset || 0;
      let limit = T_limit || 100;
      let allApp = T_apps || [];

      let params = {
        offset: offset,
        limit: limit,
      };

      return kintone.api(kintone.api.url('/k/v1/apps'), 'GET', params).then((resp) => {
        allApp = allApp.concat(resp.apps);
        if (resp.apps.length === limit) {
          return getAppList(offset + limit, limit, allApp);
        }
        return allApp;
      });
    } //________________________________________________________________________________________

    //ラジオボタンで、ボタン型、ツリー型どちらを選択するかによって、各々のdivの表示・非表示を切り替える。
    $('input[name="radio"]').change(function(){
      if($(this).val() == "0"){
        divDisplayforButton();
      }
      if($(this).val() == "1"){
        divDisplayforTree()
      }
      if($(this).val() == "2"){
        divDisplayforPortal()
      }
    })

    //ラジオボタンでボタン型を選んだ時のdiv表示
    function divDisplayforButton(){
      $('#kintoneplugin-treename-input').css('display','none')
      $('#kintoneplugin-select-outer-tree').css('display','none')
      $('#kintoneplugin-select-outer').css('display','block')
      $('#kintoneplugin-select-outer1').css('display','block')
      $('#kintoneplugin-select-outer2').css('display','block')
      $('#kintoneplugin-portal-settings').css('display','none')
      renderPortalPreview();
    }

    function divDisplayforPortal(){
      $('#kintoneplugin-treename-input').css('display','none')
      $('#kintoneplugin-select-outer-tree').css('display','none')
      $('#kintoneplugin-select-outer').css('display','block')
      $('#kintoneplugin-select-outer1').css('display','none')
      $('#kintoneplugin-select-outer2').css('display','none')
      $('#kintoneplugin-portal-settings').css('display','block')
      renderPortalPreview();
    }

    //ラジオボタンでツリー型を選んだ時のdiv表示
    function divDisplayforTree(){
      $('#kintoneplugin-treename-input').css('display','block')
      $('#kintoneplugin-select-outer-tree').css('display','block')
      $('#kintoneplugin-select-outer').css('display','none')
      $('#kintoneplugin-select-outer1').css('display','none')
      $('#kintoneplugin-select-outer2').css('display','none')
      $('#kintoneplugin-portal-settings').css('display','none')
      renderPortalPreview();
    }

    //select2実行処理関数
    function search() {
      $('.select2').select2({
      }).on('select2:open', function (e) {
        const isAppNameDropdown = $(this).is('[data-role="app-name"]')
        setTimeout(function () {
          var optionCount = $('.select2-results__option').length;
          if (optionCount > 5) {
            var newTop = 0;
          } else {
            var newTop = -40;
          }

          if(isAppNameDropdown){
            $('.select2-search__field').css({
              height: '34px',
              'width': "280px",
            });
  
            $('.select2-search--dropdown').css({
              padding: '2px',
            });
          }else{
            $('.select2-search--dropdown').css({
              display: 'none',
            });
          }

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
        top: '11px',
        left: '260px',
      });
      
      $('.select2-container--default .select2-container--forcus .select2-selection--single .select2-selection__arrow b').css({
        'border-color': '#3498db transparent transparent transparent',
      });
    }

    /******************************************
   * [アラートの表示処理関数]
   * @param {string} title  [タイトル]
   * @param {string} text   [説明文]
   * @param {string} type   [アラートタイプ]
   * @param {string} button [ボタン名表示文字]
   * 使用例 ： displayAlert('エラー','選択されたフィールドが重複しています。','error','OK');
   *****************************************/
  function displayAlert(title, text, type, button) {
    swal.fire({
      title: title,
      html: text,
      icon: type,
      confirmButtonText: button,
    });
  };
    
    //ドロップダウンで選択されている色で、色表示divの背景色を変更する処理関数
    function backgroundColorChange(color, target) {
      $(target).css({ 'background-color': resolveColor(color) });
      if (!color) return;

      //カラーピッカーから選択された色の場合
      if(color.substr(0,1) == "#"){$(target).css({ 'background-color': color })};

      switch (color) {
        case 'デフォルト':
          $(target).css({ 'background-color': '#52a9e2' });
          break;
        case '青藤色':
          $(target).css({ 'background-color': '#84a2d4' });
          break;
        case '赤色':
          $(target).css({ 'background-color': '#e95744' });
          break;
        case '小豆色':
          $(target).css({ 'background-color': '#96514d' });
          break;
        case '甚三紅':
          $(target).css({ 'background-color': '#ee827c' });
          break;
        case '緑色':
          $(target).css({ 'background-color': '#66CC99' });
          break;
        case '萌葱色':
          $(target).css({ 'background-color': '#006e54' });
          break;
        case '青緑':
          $(target).css({ 'background-color': '#00a497' });
          break;
        case '黄色':
          $(target).css({ 'background-color': '#d6d500' });
          break;
        case '黄朽葉色':
          $(target).css({ 'background-color': '#d3a243' });
          break;
        case '菜種油色':
          $(target).css({ 'background-color': '#a69425' });
          break;
        case '紫色':
          $(target).css({ 'background-color': '#e065f6' });
          break;
        case '紅藤色':
          $(target).css({ 'background-color': '#c59ab6' });
          break;
        case '紫鳶':
          $(target).css({ 'background-color': '#5f414b' });
          break;
        case '橙色':
          $(target).css({ 'background-color': '#ffad00' });
          break;
        case '朱色':
          $(target).css({ 'background-color': '#eb6101' });
          break;
        case '灰色':
          $(target).css({ 'background-color': '#7d7d7d' });
          break;
        case '黒色':
          $(target).css({ 'background-color': '#222222' });
          break;
      }
    }

    //アプリ追加ボタン押下時の処理
    $(document).on('click', '.kintoneplugin-button-add-row-image', function () {
      $('.app-name').select2('destroy');
      const clone = $(this).closest('.select-tbody').find('tr:first').clone(true);
      clone.find('[data-role="app-name"]').val(null);
      clone.find('[data-role="app-icon"]').val(DEFAULT_CATEGORY_ICON);
      $(this).parent().parent().after(clone);
      //[ドロップダウンに検索機能追加]
      search();
      //[ドロップダウンをドラッグアンドドロップで並び替え処理]
      $('.select-tbody').sortable({
        connectWith: '.select-tbody',
      });
      $('#table').sortable({
        connectWith: '#table',
      });

      createNewOption()
      renderPortalPreview();
    });

    //一度選んだ選択肢を選択肢から除外する
    async function createNewOption (){

      const appList = await getAppList()
      let renderdAppIds = []

      const mainTbody = document.querySelectorAll(".category")

      mainTbody.forEach((x) => {
        const appName = x.querySelectorAll('[data-role="app-name"]')
        appName.forEach((x) => {renderdAppIds.push($(x).val())})

        appName.forEach((appName) => {
          const val1 = appName.value
          const newOption = appList.filter((appList) => !renderdAppIds.includes(appList.appId) || $(appName).val() === appList.appId)
          $(appName).empty();

          const $noneOption = $('<option>', {
            value: null,
            text: ' ',
          });
          $(appName).append($noneOption);

          newOption.forEach((field) => {
          const option = $('<option>', {
            value: field.appId,
            text: `${field.appId} ${field.name}`,
            })
            $(appName).append(option);
          })
          appName.value = val1;
        });

      })
    }

    //アプリ削除ボタン押下時の処理
    $(document).on('click', '.kintoneplugin-button-remove-row-image', function () {
      if ($(this).closest('tbody').find('tr').length > 1) {
        $(this).closest('tr').remove();
        createNewOption();
        renderPortalPreview();
      }
    });

    //カテゴリ追加ボタン押下時の処理
    $(document).on('click', '.kintoneplugin-button-add-category-image', function () {
      $('.app-name').select2('destroy');
      const clone = $('#table .category:first').clone(true);
      clone.find('[data-role="category-name"]').val('');
      clone.find('[data-role="category-description"]').val('');
      clone.find('[data-role="subcategory-check"]').prop('checked', false);
      clone.find('[data-role="category-icon"]').val(DEFAULT_CATEGORY_ICON);
      clone.find('[data-role="category-color-mode"]').val('');
      clone.find('[data-role="category-color-select"]').val('デフォルト');
      clone.find('[data-role="category-color"]').val(getCurrentMenuColor());
      clone.find('[data-role="category-frame-style"]').val('');
      clone.find('[data-role="category-button-style"]').val('');
      clone.find('[data-role="app-name"]').val(null);
      clone.find('[data-role="app-icon"]').val(DEFAULT_CATEGORY_ICON);
      for (let i = 1, len = clone.find('.select-class').length; i < len; i++) {
        clone.find('.select-class:last').remove();
      }
      $(this).closest('.category').after(clone);
      updateAllCategoryColorControls();

      //[ドロップダウンに検索機能追加]
      search();

      //[ドロップダウンをドラッグアンドドロップで並び替え処理]
      $('#table').sortable();
      $('.select-tbody').sortable({
        connectWith: '.select-tbody',
      });
      $('#table').sortable({
        connectWith: '#table',
      });
      createNewOption();
      renderPortalPreview();
    });

    //カテゴリ削除ボタン押下時の処理
    $(document).on('click', '.kintoneplugin-button-remove-category-image', function () {
      if ($(this).closest('table').find('.category').length > 1) {
        $(this).closest('tbody').remove();
        renderPortalPreview();
      }
    });

    //カラーピッカーからの色を反映する。
    $(document).on('change', '#color-picker', function () {
      const color = $('#color-picker').val();
      $('#color-select').val("抽出色");
      backgroundColorChange(color,'#show-color');
      updateAllCategoryColorControls();
      renderPortalPreview();
    });

    //ツリーのカラーピッカーからの色を反映する。
    $(document).on('change', '#color-picker-tree', function () {
      const color = $('#color-picker-tree').val();
      $('#color-select-tree').val("抽出色");
      backgroundColorChange(color, '#show-color-tree');
      renderPortalPreview();
    });

    //[色変換時の処理]
    $(document).on('change', '#color-select', function () {
      let color = $(this).val();
      if(color == "抽出色"){color = $('#color-picker').val()}
      backgroundColorChange(color, '#show-color');
      updateAllCategoryColorControls();
      renderPortalPreview();
    });

    $(document).on('change', '[data-role="category-color-mode"]', function () {
      updateCategoryColorControl(this.closest('.category'));
      renderPortalPreview();
    });

    $(document).on('change', '[data-role="category-color-select"]', function () {
      const category = this.closest('.category');
      const colorInput = category.querySelector('[data-role="category-color"]');
      if (this.value !== '抽出色' && colorInput) {
        colorInput.value = resolveColor(this.value);
      }
      updateCategoryColorControl(category);
      renderPortalPreview();
    });

    $(document).on('change', '[data-role="category-color"]', function () {
      const category = this.closest('.category');
      const colorMode = category.querySelector('[data-role="category-color-mode"]');
      const colorSelect = category.querySelector('[data-role="category-color-select"]');
      if (colorMode) colorMode.value = 'custom';
      if (colorSelect) colorSelect.value = '抽出色';
      updateCategoryColorControl(category);
      renderPortalPreview();
    });

    $(document).on('click', '[data-role="category-color-preset"]', function () {
      const category = this.closest('.category');
      const colorMode = category.querySelector('[data-role="category-color-mode"]');
      const colorSelect = category.querySelector('[data-role="category-color-select"]');
      const colorInput = category.querySelector('[data-role="category-color"]');
      const presetName = this.getAttribute('data-color');
      if (colorMode) colorMode.value = 'custom';
      if (colorSelect) colorSelect.value = presetName;
      if (colorInput) colorInput.value = resolveColor(presetName);
      updateCategoryColorControl(category);
      renderPortalPreview();
    });

    $(document).on('click', '[data-role="apply-menu-color-to-categories"]', function () {
      const menuColor = getCurrentMenuColor();
      document.querySelectorAll('.category').forEach((category) => {
        const colorMode = category.querySelector('[data-role="category-color-mode"]');
        const colorSelect = category.querySelector('[data-role="category-color-select"]');
        const colorInput = category.querySelector('[data-role="category-color"]');
        if (colorMode && colorSelect && colorInput) {
          const presetName = getPresetNameByColor(menuColor);
          colorMode.value = 'custom';
          colorSelect.value = presetName;
          colorInput.value = menuColor;
        }
        updateCategoryColorControl(category);
      });
      renderPortalPreview();
    });

     //[ツリーの色変換時の処理]
     $(document).on('change', '#color-select-tree', function () {
      let color = $(this).val();
      if(color == "抽出色"){color = $('#color-picker-tree').val()}
      backgroundColorChange(color, '#show-color-tree');
      renderPortalPreview();
    });

    //[アプリ名を変更した時の処理]
    $(document).on('change', '[data-role="app-name"]', function(){
      createNewOption ()
      renderPortalPreview();
    })

    $form.on('input change', 'input, select, textarea', function () {
      renderPortalPreview();
    });

    $(document).on('click', '[data-role="portal-preview-refresh"]', function () {
      renderPortalPreview();
    });

    //ドロップダウンリストのオプション追加
    getAppList().then((allApp) => {
      let select = document.querySelector('[data-role="app-name"]');
      
      let nonoption = document.createElement('option');
        nonoption.setAttribute('value', null);
        nonoption.textContent = '';
        select.appendChild(nonoption);

      allApp.forEach((element) => {
        //ドロップダウンにアプリを格納
        let option = document.createElement('option');
        option.setAttribute('value', element.appId);
        option.textContent = `${element.appId} ${element.name}`;
        select.appendChild(option);
      });

      //設定保持
      if (config.element) {
        const orijinalElements = normalizeElements(parsePluginConfig(config.element, []));
        const allAppIds = allApp.map(function (x){return x.appId});
        const mapElements = orijinalElements.map(function(x){
          //現在設定されている全アプリのIDをもとに、allconfigのappsから削除されているアプリを除外させるため、mapする。
          x.apps = x.apps.filter(item => allAppIds.includes(item.appId));
          return x  
        })
        //configのappsより、削除されているアプリを除外した結果、appsが空なら、その設定を外す。
        const elements = mapElements.filter(function(x){return x.apps.length != 0})
        const radioValue = config.radioValue;
        if(config.menuColor == undefined){config.menuColor = "#52A9E2"}
        if(config.treeColor == undefined){config.treeColor = "#52A9E2"}
        const menuColor = config.menuColor.substr(0,1) != "#" ? config.menuColor : "抽出色"
        if(config.menuColor.substr(0,1) == "#"){$('#color-picker').val(config.menuColor)}//抽出色であれば、カラーピッカーに摘要する。
        const treeColor = config.treeColor.substr(0,1) != "#" ? config.treeColor : "抽出色"
        if(config.treeColor.substr(0,1) == "#"){$('#color-picker-tree').val(config.treeColor)}//抽出色であれば、ツリーのカラーピッカーに摘要する。
        const appSize = config.appSize;
        const appSizeMobile = config.appSizeMobile;
        const treeName = config.treeName
        const designTheme = normalizeDesignTheme(config.designTheme);
        const frameStyle = normalizeFrameStyle(config.frameStyle);
        const buttonStyle = normalizeButtonStyle(config.buttonStyle);
        const portalColumnCount = normalizePortalColumnCount(config.portalColumnCount);
        const portalMobileColumnCount = normalizePortalMobileColumnCount(config.portalMobileColumnCount);
        const portalDescriptionLines = normalizePortalDescriptionLines(config.portalDescriptionLines);
        const portalFontSizes = getPortalFontSizesFromConfig(config);
        
        const radio = document.getElementsByName('radio');//ラジオボタンの値保存
        if(radioValue === 'ボタン型'){radio[0]['checked'] = true;divDisplayforButton();}
        else if(radioValue === 'ツリー型'){radio[1]['checked'] = true;divDisplayforTree();}
        else if(radioValue === 'ポータル型'){radio[2]['checked'] = true;divDisplayforPortal();}
        else {radio[0]['checked'] = true;divDisplayforButton();}

        document.getElementById('tree-name-input').value = treeName; //ツリー名の値保存
        document.getElementById('color-select').value = menuColor; //色選択ドロップダウンの値保存
        document.getElementById('color-select-tree').value = treeColor; //ツリーの色選択ドロップダウンの値保存
        document.getElementById('size-select').value = appSize; //アプリ表示名大きさの値保存
        document.getElementById('size-select-mobile').value = appSizeMobile; //アプリ表示名大きさの値（モバイル版）保存
        document.getElementById('design-theme-select').value = designTheme;
        document.getElementById('frame-style-select').value = frameStyle;
        document.getElementById('button-style-select').value = buttonStyle;
        document.getElementById('portal-column-count-select').value = portalColumnCount;
        document.getElementById('portal-mobile-column-count-select').value = portalMobileColumnCount;
        document.getElementById('portal-description-lines-select').value = portalDescriptionLines;
        document.getElementById('portal-title-font-size-select').value = portalFontSizes.title;
        document.getElementById('portal-description-font-size-select').value = portalFontSizes.description;
        document.getElementById('portal-app-font-size-select').value = portalFontSizes.app;
        document.getElementById('portal-subcategory-font-size-select').value = portalFontSizes.subcategory;

        //[色表示divの背景色変更]
        backgroundColorChange(config.menuColor, "#show-color");
        $("#color-picker").css({ 'color': config.menuColor });
        backgroundColorChange(config.treeColor, "#show-color-tree");
        $("#color-picker-tree").css({ 'color': config.treeColor });
        
        //カテゴリー2つ目からの処理__________________________________________________________________________________
        for (let i = 1; i < elements.length; i++) {
          const table = document.getElementById('table');
          let clone = table.firstElementChild.cloneNode(true);
          table.appendChild(clone);

          applyAppConfig(clone.querySelector('.select-class'), elements[i]['apps'][0]);

          //問題個所-------------------------------------------------
          for (let j = 1; j < elements[i]['apps']['length']; j++) {
            let tbody = clone.querySelector('.select-tbody');
            let cloneJ = tbody.firstElementChild.cloneNode(true);
            applyAppConfig(cloneJ, elements[i]['apps'][j]);
            tbody.appendChild(cloneJ);
          }
          
        } //________________________________________________________________________________________________________

        //カテゴリー1つ目の処理______________________________________________________________________________________
        if(elements.length != 0){
        const categories = document.querySelectorAll('.category');
        applyCategoryConfig(categories[0], elements[0]);
        applyAppConfig(categories[0].querySelector('.select-class'), elements[0]['apps'][0]);

        for (let i = 1; i < elements[0]['apps']['length']; i++) {
          let tbody = categories[0].querySelector('.select-tbody');
          let clone = tbody.firstElementChild.cloneNode(true);
          applyAppConfig(clone, elements[0]['apps'][i]);
          tbody.appendChild(clone);
        } //________________________________________________________________________________________________________

        //カテゴリー2つ目からの値代入(cloneすると同時に値を代入するとずれるためここに移動)
        for (let i = 1; i < elements.length; i++) {
          applyCategoryConfig(categories[i], elements[i]);
        }
      }
        updateAllCategoryColorControls();

        //[ドロップダウンに検索昨日追加]
        search();

        $(function () {
          //ドラッグアンドドロップで並び替え（アプリ）
          $('.select-tbody').sortable({
            connectWith: '.select-tbody',
          });
          $('#table').sortable({
            connectWith: '#table',
          });
        });

        $('.table').sortable(); //ドラッグアンドドロップで並び替え（カテゴリ）

        $('.kintoneplugin-button-add-category-image').on('click', () => {
          $('.table').sortable({
            connectWith: '.table'
          });
        });

        //[ドロップダウンに検索昨日追加]
        search();
        createNewOption ()
        renderPortalPreview();
      } else {
        //[色表示divの背景色変更]
        backgroundColorChange('デフォルト', '#show-color');
        backgroundColorChange('デフォルト', '#show-color-tree');
        $('#color-picker').val('#52A9E2')
        $('#color-picker-tree').val('#52A9E2')
        document.getElementById('design-theme-select').value = DEFAULT_DESIGN_THEME;
        document.getElementById('frame-style-select').value = DEFAULT_CATEGORY_FRAME_STYLE;
        document.getElementById('button-style-select').value = DEFAULT_BUTTON_STYLE;
        document.getElementById('portal-column-count-select').value = DEFAULT_PORTAL_COLUMN_COUNT;
        document.getElementById('portal-mobile-column-count-select').value = DEFAULT_PORTAL_MOBILE_COLUMN_COUNT;
        document.getElementById('portal-description-lines-select').value = DEFAULT_PORTAL_DESCRIPTION_LINES;
        document.getElementById('portal-title-font-size-select').value = DEFAULT_PORTAL_TITLE_FONT_SIZE;
        document.getElementById('portal-description-font-size-select').value = DEFAULT_PORTAL_DESCRIPTION_FONT_SIZE;
        document.getElementById('portal-app-font-size-select').value = DEFAULT_PORTAL_APP_FONT_SIZE;
        document.getElementById('portal-subcategory-font-size-select').value = DEFAULT_PORTAL_SUBCATEGORY_FONT_SIZE;
        divDisplayforButton();
        updateAllCategoryColorControls();

        //[ドロップダウンに検索機能追加]
        search();
        renderPortalPreview();
      }
    });
    //保存ボタン押下時
    $form.on('submit', function (e) {
      e.preventDefault();

      //一覧取得
      let body = {
        app: kintone.app.getId(),
      };
      return kintone
        .api(kintone.api.url('/k/v1/app/views', true), 'GET', body)
        .then((resp) => {
          
          let views = resp.views;

          views['アプリ一覧'] = {
            index: '100',
            type: 'CUSTOM',
            html: '<div id="applist-container" class="customview-container"></div>',
            name: 'アプリ一覧',
            device: 'ANY',
          };
        
          let body2 = {
            app: kintone.app.getId(),
            views: views,
          };
          return kintone.api(kintone.api.url('/k/v1/preview/app/views', true), 'PUT', body2);
        })
        .then((resp) => {

          let element = [];
          let listId = resp.views['アプリ一覧']['id'];
          let category = document.getElementsByClassName('category');

          for (let i = 0; i < category.length; i++) {
            let categoryNameInput = category[i].querySelector('[data-role="category-name"]');
            let categoryDescriptionInput = category[i].querySelector('[data-role="category-description"]');
            let subCategoryCheckInput = category[i].querySelector('[data-role="subcategory-check"]');
            let categoryColorMode = category[i].querySelector('[data-role="category-color-mode"]');
            let categoryFrameStyleSelect = category[i].querySelector('[data-role="category-frame-style"]');
            let categoryButtonStyleSelect = category[i].querySelector('[data-role="category-button-style"]');
            let categoryIconSelect = category[i].querySelector('[data-role="category-icon"]');
            let categoryName = categoryNameInput ? categoryNameInput.value : ''; //カテゴリー名
            let categoryDescription = categoryDescriptionInput ? categoryDescriptionInput.value : '';
            let subCategoryCheck = subCategoryCheckInput ? subCategoryCheckInput.checked : false;
            let categoryColor = categoryColorMode && categoryColorMode.value === 'custom' ? getCategorySelectedColor(category[i]) : null;
            let categoryFrameStyle = categoryFrameStyleSelect && categoryFrameStyleSelect.value ? normalizeFrameStyle(categoryFrameStyleSelect.value) : null;
            let categoryButtonStyle = categoryButtonStyleSelect && categoryButtonStyleSelect.value ? normalizeButtonStyle(categoryButtonStyleSelect.value) : null;
            let categoryIcon = categoryIconSelect ? normalizeCategoryIcon(categoryIconSelect.value) : DEFAULT_CATEGORY_ICON;

            let value = {
              name: categoryName,
              description: categoryDescription,
              color: categoryColor,
              icon: categoryIcon,
              frameStyle: categoryFrameStyle,
              buttonStyle: categoryButtonStyle,
              subCategoryCheck: subCategoryCheck,
              subCategory: [],
              apps: [],
            };

            let select = category[i].querySelectorAll('[data-role="app-name"]');
            for (let j = 0; j < select.length; j++) {
              let select4 = select[j];
              let appId = select4['value'];
              let selectedIndex = select4['selectedIndex'];
              if(selectedIndex == -1){selectedIndex = 0}//未選択で-1が返される場合がある。その場合は0にする。
              let appName = select4['options'][selectedIndex]['text'];
              let appRow = select4.closest('.select-class');
              let appIconSelect = appRow ? appRow.querySelector('[data-role="app-icon"]') : null;
              let appIcon = appIconSelect ? normalizeCategoryIcon(appIconSelect.value) : DEFAULT_CATEGORY_ICON;
              let value2 = {
                appId: appId,
                appName: appName,
                icon: appIcon,
                selectedIndex: selectedIndex,
              };
              value.apps.push(value2);
            }
            element.push(value);
          }
          let radioValue;
          const radio = document.getElementsByName('radio');
          if (radio[0]['checked'] === true) {
            radioValue = 'ボタン型';
          } else if (radio[1]['checked'] === true) {
            radioValue = 'ツリー型';
          } else {
            radioValue = 'ポータル型';
          }

          const treeName = document.getElementById('tree-name-input').value;
          const menuColor = document.getElementById('color-select').value != "抽出色" ? document.getElementById('color-select').value : $('#color-picker').val()
          const treeColor = document.getElementById('color-select-tree').value != "抽出色" ? document.getElementById('color-select-tree').value : $('#color-picker-tree').val()
          const appSize = document.getElementById('size-select').value;
          const appSizeMobile = document.getElementById('size-select-mobile').value;
          const designTheme = normalizeDesignTheme(document.getElementById('design-theme-select').value);
          const frameStyle = normalizeFrameStyle(document.getElementById('frame-style-select').value);
          const buttonStyle = normalizeButtonStyle(document.getElementById('button-style-select').value);
          const portalColumnCount = normalizePortalColumnCount(document.getElementById('portal-column-count-select').value);
          const portalMobileColumnCount = normalizePortalMobileColumnCount(document.getElementById('portal-mobile-column-count-select').value);
          const portalDescriptionLines = normalizePortalDescriptionLines(document.getElementById('portal-description-lines-select').value);
          const portalFontSizes = getPortalFontSizesFromForm();
          const saveConfig = {
            element: JSON.stringify(element),
            listId: listId,
            radioValue: radioValue,
            treeName: treeName,
            menuColor: menuColor,
            treeColor: treeColor,
            appSize: appSize,
            appSizeMobile: appSizeMobile,
            designTheme: designTheme,
            frameStyle: frameStyle,
            buttonStyle: buttonStyle,
            portalColumnCount: portalColumnCount,
            portalMobileColumnCount: portalMobileColumnCount,
            portalDescriptionLines: portalDescriptionLines,
            portalTitleFontSize: portalFontSizes.title,
            portalDescriptionFontSize: portalFontSizes.description,
            portalAppFontSize: portalFontSizes.app,
            portalSubcategoryFontSize: portalFontSizes.subcategory,
            iconMode: config.iconMode || DEFAULT_CATEGORY_ICON,
          };

          //未設定チェック
          let errMesseage = "";

          if(radioValue == "ツリー型" && !saveConfig.treeName){errMesseage = "ツリー名が未設定です。<br>";}
          element.forEach((x,i) =>{
            if(!x.name){errMesseage = errMesseage + (i + 1) + "番目のカテゴリー名が未設定です。<br>"}
            x.apps.forEach((y,j) => {if(!y.appId || y.appId == "null"){errMesseage = errMesseage + ((i + 1) + "ブロック目の" + (j + 1) + "つ目でアプリ名が未設定です。<br>")}})
          })

          if(errMesseage != ""){displayAlert('エラー', errMesseage, 'error', 'OK');return;}
          kintone.plugin.app.setConfig(saveConfig);
        })
        .catch((resp) => {
          console.log(resp)
          var error = resp.message;
          if (error.match(/権限がありません/)) {
            displayAlert('エラー', '[エラー内容] <br> kintoneシステム管理者権限が無効なユーザーです。<br> [対処方法] <br> kintoneシステム管理者権限が有効なユーザーで実施してください。', 'error', 'OK')
          } else {
            displayAlert('エラー','[エラー内容] <br> アプリ設定項目に未指定の項目があるか、 内部エラーが発生しました。 <br> [対処方法] <br> アプリの指定を見直してください。解決しない場合はサポートに問い合わせてください。', 'error', 'OK')
          }
        });
    });
    //キャンセルボタン押下時
    $cancelButton.on('click', () => {
      window.location.href = '../../' + kintone.app.getId() + '/plugin/';
    });
  });
})(jQuery, kintone.$PLUGIN_ID);
