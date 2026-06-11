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
    })

    //ラジオボタンでボタン型を選んだ時のdiv表示
    function divDisplayforButton(){
      $('#kintoneplugin-treename-input').css('display','none')
      $('#kintoneplugin-select-outer-tree').css('display','none')
      $('#kintoneplugin-select-outer').css('display','block')
      $('#kintoneplugin-select-outer1').css('display','block')
      $('#kintoneplugin-select-outer2').css('display','block')
    }

    //ラジオボタンでツリー型を選んだ時のdiv表示
    function divDisplayforTree(){
      $('#kintoneplugin-treename-input').css('display','block')
      $('#kintoneplugin-select-outer-tree').css('display','block')
      $('#kintoneplugin-select-outer').css('display','none')
      $('#kintoneplugin-select-outer1').css('display','none')
      $('#kintoneplugin-select-outer2').css('display','none')
    }

    //select2実行処理関数
    function search() {
      $('.select2').select2({
      }).on('select2:open', function (e) {
        const opnederDropdownId = $(this).prop("id")
        setTimeout(function () {
          var optionCount = $('.select2-results__option').length;
          if (optionCount > 5) {
            var newTop = 0;
          } else {
            var newTop = -40;
          }

          if(opnederDropdownId == "app-name"){
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
      const clone = $('#select-tbody tr:first').clone(true);
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
    });

    //一度選んだ選択肢を選択肢から除外する
    async function createNewOption (){

      const appList = await getAppList()
      let renderdAppIds = []

      const mainTbody = document.querySelectorAll("#main-tbody")

      mainTbody.forEach((x) => {
        const appName = x.querySelectorAll("#app-name")
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
      }
    });

    //カテゴリ追加ボタン押下時の処理
    $(document).on('click', '.kintoneplugin-button-add-category-image', function () {
      $('.app-name').select2('destroy');
      const clone = $('#table .category:first').clone(true);
      clone.find('input:first').val('');
      for (let i = 1, len = clone.find('.select-class').length; i < len; i++) {
        clone.find('.select-class:last').remove();
      }
      $(this).closest('.category').after(clone);

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
    });

    //カテゴリ削除ボタン押下時の処理
    $(document).on('click', '.kintoneplugin-button-remove-category-image', function () {
      if ($(this).closest('table').find('.category').length > 1) {
        $(this).closest('tbody').remove();
      }
    });

    //カラーピッカーからの色を反映する。
    $(document).on('change', '#color-picker', function () {
      const color = $('#color-picker').val();
      $('#color-select').val("抽出色");
      backgroundColorChange(color,'#show-color');
    });

    //ツリーのカラーピッカーからの色を反映する。
    $(document).on('change', '#color-picker-tree', function () {
      const color = $('#color-picker-tree').val();
      $('#color-select-tree').val("抽出色");
      backgroundColorChange(color, '#show-color-tree');
    });

    //[色変換時の処理]
    $(document).on('change', '#color-select', function () {
      let color = $(this).val();
      if(color == "抽出色"){color = $('#color-picker').val()}
      backgroundColorChange(color, '#show-color');
    });

     //[ツリーの色変換時の処理]
     $(document).on('change', '#color-select-tree', function () {
      let color = $(this).val();
      if(color == "抽出色"){color = $('#color-picker-tree').val()}
      backgroundColorChange(color, '#show-color-tree');
    });

    //[アプリ名を変更した時の処理]
    $(document).on('change', '#app-name', function(){
      createNewOption ()
    })

    //ドロップダウンリストのオプション追加
    getAppList().then((allApp) => {
      let select = document.getElementById('app-name');
      
      let nonoption = document.createElement('option');
        nonoption.setAttribute('value', null);
        nonoption.innerHTML = ``;
        select.appendChild(nonoption);

      allApp.forEach((element) => {
        //ドロップダウンにアプリを格納
        let option = document.createElement('option');
        option.setAttribute('value', element.appId);
        option.innerHTML = `${element.appId} ${element.name}`;
        select.appendChild(option);
      });

      //設定保持
      if (config.element) {
        const orijinalElements = JSON.parse(config.element);
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
        
        const radio = document.getElementsByName('radio');//ラジオボタンの値保存
        if(radioValue === 'ボタン型'){radio[0]['checked'] = true;divDisplayforButton();}
        else if(radioValue === 'ツリー型'){radio[1]['checked'] = true;divDisplayforTree();};

        document.getElementById('tree-name-input').value = treeName; //ツリー名の値保存
        document.getElementById('color-select').value = menuColor; //色選択ドロップダウンの値保存
        document.getElementById('color-select-tree').value = treeColor; //ツリーの色選択ドロップダウンの値保存
        document.getElementById('size-select').value = appSize; //アプリ表示名大きさの値保存
        document.getElementById('size-select-mobile').value = appSizeMobile; //アプリ表示名大きさの値（モバイル版）保存

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

          let tr = clone['childNodes']['3']['childNodes']['1']['childNodes']['1']['childNodes']['1'].children[0];
          let select = tr['childNodes']['1']['childNodes']['1']['childNodes']['1']['childNodes']['1'];

          select.value = elements[i]['apps'][0]['appId'];

          //問題個所-------------------------------------------------
          for (let j = 1; j < elements[i]['apps']['length']; j++) {
            let tbody = document.getElementsByClassName('select-tbody')[i];
            let cloneJ = tbody.firstElementChild.cloneNode(true);
            let select2 = cloneJ['childNodes']['1']['childNodes']['1']['childNodes']['1']['childNodes']['1'];
            select2.value = elements[i]['apps'][j]['appId'];
            tbody.appendChild(cloneJ);
          }
          
        } //________________________________________________________________________________________________________

        //カテゴリー1つ目の処理______________________________________________________________________________________
        if(elements.length != 0){
        document.getElementById('category-name-input').value = elements[0].name; //カテゴリー名の値代入
        let select1 = document.getElementsByClassName('app-name')[0];

        select1.value = elements[0]['apps'][0]['appId'];

        for (let i = 1; i < elements[0]['apps']['length']; i++) {
          let tbody = document.getElementsByClassName('select-tbody')[0];
          let clone = tbody.firstElementChild.cloneNode(true);
          let input = clone['childNodes']['1']['childNodes']['1']['childNodes']['1']['childNodes']['1'];
          
          input.value = elements[0]['apps'][i]['appId'];
          tbody.appendChild(clone);
        } //________________________________________________________________________________________________________

        //カテゴリー2つ目からの値代入(cloneすると同時に値を代入するとずれるためここに移動)
        for (let i = 1; i < elements.length; i++) {
          console.log(document.querySelectorAll('#category-name-input')[i].value)
          document.querySelectorAll('#category-name-input')[i].value = elements[i]['name'];
          document.querySelectorAll('.subcategory-check')[i].checked = elements[i]['subCategoryCheck']
        }
      }

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
      } else {
        //[色表示divの背景色変更]
        backgroundColorChange('デフォルト', '#show-color');
        backgroundColorChange('デフォルト', '#show-color-tree');
        $('#color-picker').val('#52A9E2')
        $('#color-picker-tree').val('#52A9E2')
        divDisplayforButton();

        //[ドロップダウンに検索機能追加]
        search();
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
            let categoryName =
              category[i]['childNodes']['1']['childNodes']['1']['childNodes']['1']['childNodes']['3']['value']; //カテゴリー名
            let subCategoryCheck =
              category[i].firstElementChild.firstElementChild.firstElementChild.children[2].checked;

            let value = {
              name: categoryName,
              subCategoryCheck: subCategoryCheck,
              subCategory: [],
              apps: [],
            };

            let select =
              category[i]['childNodes']['3']['childNodes']['1']['childNodes']['1']['childNodes']['1'].children; //tr要素の配列取得
        for (let j = 0; j < select.length; j++) {
          let select4 = select[j]['childNodes']['1']['childNodes']['1']['childNodes']['1']['childNodes']['1'];
              let appId = select4['value'];
              let selectedIndex = select4['selectedIndex'];
              if(selectedIndex == -1){selectedIndex = 0}//未選択で-1が返される場合がある。その場合は0にする。
              let appName = select4['options'][selectedIndex]['text'];
              let value2 = {
                appId: appId,
                appName: appName,
                selectedIndex: selectedIndex,
              };
              value.apps.push(value2);
            }
            element.push(value);
          }
          let radioValue;
          const radio = document.getElementsByName('radio');
          radio[0]['checked'] === true ? (radioValue = 'ボタン型') : (radioValue = 'ツリー型'); //一覧表示形式ラジオボタンの値保存

          const treeName = document.getElementById('tree-name-input').value;
          const menuColor = document.getElementById('color-select').value != "抽出色" ? document.getElementById('color-select').value : $('#color-picker').val()
          const treeColor = document.getElementById('color-select-tree').value != "抽出色" ? document.getElementById('color-select-tree').value : $('#color-picker-tree').val()
          const appSize = document.getElementById('size-select').value;
          const appSizeMobile = document.getElementById('size-select-mobile').value;
          const config = {
            element: JSON.stringify(element),
            listId: listId,
            radioValue: radioValue,
            treeName: treeName,
            menuColor: menuColor,
            treeColor: treeColor,
            appSize: appSize,
            appSizeMobile: appSizeMobile,
          };

          //未設定チェック
          let errMesseage = "";

          if(radioValue == "ツリー型" && !config.treeName){errMesseage = "ツリー名が未設定です。<br>";}
          element.forEach((x,i) =>{
            if(!x.name){errMesseage = errMesseage + (i + 1) + "番目のカテゴリー名が未設定です。<br>"}
            x.apps.forEach((y,j) => {if(!y.appId || y.appId == "null"){errMesseage = errMesseage + ((i + 1) + "ブロック目の" + (j + 1) + "つ目でアプリ名が未設定です。<br>")}})
          })

          if(errMesseage != ""){displayAlert('エラー', errMesseage, 'error', 'OK');return;}
          kintone.plugin.app.setConfig(config);
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
