// Copyright (C) All in one Allright Reserved.

jQuery.noConflict();

(async function ($, PLUGIN_ID) {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (Object.keys(config).length) {
    config.elementArray = JSON.parse(config.elementArray);
    // console.log(config);
  }

  if (!Object.keys(config).length) return;

  kintone.events.on(['app.record.create.show', 'app.record.edit.show'], async function (event) {
    if (!(await KNTP162910certification())) return event;

    const { record } = event;
    const color = config.color;
    const select = config.elementArray;
    const inTableFieldList = [];
    let tableFieldCode = [];

    //[新規追加（ルックアップコピー先、計算フィールドの色変更 フィールド]//////////////////////////////////////////////////////////////////////////
    const fieldList = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList);
    const lookUpField = [];
    let resp = Object.values(
      (await kintone.api(kintone.api.url('/k/v1/app/form/fields.json', true), 'GET', { app: kintone.app.getId() }))
        .properties
    );
    resp = resp.filter((_) => 'lookup' in _);
    resp.forEach((item) => {
      const lookUpFieldP = [];
      item.lookup.fieldMappings.forEach((item2) => lookUpFieldP.push(item2));
      lookUpFieldP.forEach((item) => lookUpField.push(fieldList.find((_) => _.var === item.field)));
    });

    Array.from(document.querySelectorAll(`.disabled-cybozu.input-text-outer-cybozu`)).forEach(
      (item) => (item.style = `background-color: ${color};`)
    );
    Array.from(
      document.querySelectorAll('.disabled-cybozu.input-text-outer-cybozu.cybozu-ui-forms-editor-iframe .editor-cybozu')
    ).forEach((item) => (item.style = `background-color: ${color};`));

    lookUpField.forEach((item) => {
      if (item.type === 'DECIMAL' || item.type === 'CALC')
        document.querySelector(
          `.value-${item.id}`
        ).firstElementChild.children[1].firstElementChild.firstElementChild.style = `background-color: ${color};`;
      else if (item.type === 'SINGLE_LINE_TEXT' || item.type === 'LINK' || item.type === 'DATE' || item.type === 'TIME')
        document.querySelector(
          `.value-${item.id}`
        ).firstElementChild.firstElementChild.style = `background-color: ${color};`;
      else if (item.type === 'MULTIPLE_LINE_TEXT')
        document.querySelector(
          `.value-${item.id}`
        ).firstElementChild.firstElementChild.style = `background-color: ${color};`;
      else if (item.type === 'SINGLE_CHECK' || item.type === 'MULTIPLE_CHECK')
        document.querySelector(`.value-${item.id}`).firstElementChild.style = `background-color: ${color};`;
      else if (item.type === 'SINGLE_SELECT') {
        document.querySelector(
          `.value-${item.id}`
        ).firstElementChild.firstElementChild.style = `background-color: ${color};`;
        document.querySelector(
          `.value-${item.id}`
        ).firstElementChild.firstElementChild.children[1].style = `background-color: ${color};`;
      } else if (item.type === 'DATETIME') {
        document.querySelector(
          `.value-${item.id}`
        ).firstElementChild.firstElementChild.style = `background-color: ${color};`;
        document.querySelector(
          `.value-${item.id}`
        ).firstElementChild.children[1].firstElementChild.style = `background-color: ${color};`;
      } else if (item.type === 'USER_SELECT' || item.type === 'GROUP_SELECT' || item.type === 'ORGANIZATION_SELECT')
        document.querySelector(
          `.value-${item.id}`
        ).firstElementChild.children[1].firstElementChild.firstElementChild.firstElementChild.style = `background-color: ${color};`;
      else if (item.type === 'EDITOR')
        document.querySelector(
          `.value-${item.id}`
        ).firstElementChild.firstElementChild.style = `background-color: ${color};`;
      else if (item.type === 'MULTIPLE_SELECT') {
        document.querySelector(`.value-${item.id}`).firstElementChild.style = `background-color: ${color};`;
        Array.from(document.querySelector(`.value-${item.id}`).firstElementChild.firstElementChild.children).forEach(
          (item) => {
            item.style = `background-color: ${color};`;
          }
        );
      }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    select.forEach((val) => {
      if (val.split('　').length === 1) {
        if (val !== '選択' && val !== '' && record[val]) {
          //フィールドが設定されていない(又は削除されている)セレクトボックスを無視する条件分岐
          if (record[val].type === 'SUBTABLE') {
            //[テーブルフィールドの処理]
            record[val].value.forEach((row) => {
              Object.values(row.value).forEach((field) => {
                field.disabled = true;
              });
            });

            //[新規追加（テーブルの上の色を変える(仮)]///////////////////////////////////////////////////////////
            const fieldId = Object.values(cybozu.data.page.FORM_DATA.schema.subTable).find((_) => _.var === val).id;
            Array.from(
              document.querySelector(`.subtable-${fieldId}`).firstElementChild.firstElementChild.children
            ).forEach((item) => {
              item.style = `background-color: ${color};`;
            });
            ///////////////////////////////////////////////////////////
          } else {
            //[テーブルフィールド以外の処理（フィールドタイプごとに変更する]
            record[val]['disabled'] = true;

            //[新規追加　フィールドの色変更]///////////////////////////////////////////////////////////
            const fieldType = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList).find(
              (_) => _.var === val
            ).type;
            const fieldId = Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList).find(
              (_) => _.var === val
            ).id;
            //[ここに分岐処理]

            if (fieldType === 'DECIMAL')
              document.querySelector(
                `.value-${fieldId}`
              ).firstElementChild.children[1].firstElementChild.firstElementChild.style = `background-color: ${color};`;
            else if (
              fieldType === 'SINGLE_LINE_TEXT' ||
              fieldType === 'LINK' ||
              fieldType === 'DATE' ||
              fieldType === 'TIME'
            )
              document.querySelector(
                `.value-${fieldId}`
              ).firstElementChild.firstElementChild.style = `background-color: ${color};`;
            else if (fieldType === 'MULTIPLE_LINE_TEXT')
              document.querySelector(`.value-${fieldId} textarea`).style = `background-color: ${color};`;
            else if (fieldType === 'SINGLE_CHECK' || fieldType === 'MULTIPLE_CHECK')
              document.querySelector(`.value-${fieldId}`).firstElementChild.style = `background-color: ${color};`;
            else if (fieldType === 'SINGLE_SELECT') {
              document.querySelector(
                `.value-${fieldId}`
              ).firstElementChild.firstElementChild.style = `background-color: ${color};`;
              document.querySelector(
                `.value-${fieldId}`
              ).firstElementChild.firstElementChild.children[1].style = `background-color: ${color};`;
            } else if (fieldType === 'DATETIME') {
              document.querySelector(
                `.value-${fieldId}`
              ).firstElementChild.firstElementChild.style = `background-color: ${color};`;
              document.querySelector(
                `.value-${fieldId}`
              ).firstElementChild.children[1].firstElementChild.style = `background-color: ${color};`;
            } else if (
              fieldType === 'USER_SELECT' ||
              fieldType === 'GROUP_SELECT' ||
              fieldType === 'ORGANIZATION_SELECT'
            )
              document.querySelector(
                `.value-${fieldId}`
              ).firstElementChild.children[1].firstElementChild.firstElementChild.firstElementChild.style = `background-color: ${color};`;
            else if (fieldType === 'EDITOR')
              document.querySelector(
                `.value-${fieldId}`
              ).firstElementChild.firstElementChild.style = `background-color: ${color};`;
            else if (fieldType === 'MULTIPLE_SELECT') {
              document.querySelector(`.value-${fieldId}`).firstElementChild.style = `background-color: ${color};`;
              Array.from(
                document.querySelector(`.value-${fieldId}`).firstElementChild.firstElementChild.children
              ).forEach((item) => {
                item.style = `background-color: ${color};`;
              });
            }
            ///////////////////////////////////////////////////////////
          }
        }
      } else if (val.split('　').length === 2) {
        inTableFieldList.push(val.split('　'));
        tableFieldCode.push(val.split('　')[0]);
      }
    });
    tableFieldCode = Array.from(new Set(tableFieldCode));

    tableFieldCode.forEach((code) => {
      const tableField = inTableFieldList.filter((x) => x[0] === code);

      tableField.forEach((field) => {
        record[code].value.forEach((row) => {
          row.value[field[1]].disabled = true;
        });
      });
    });

    //[新規追加（ルックアップコピー先、計算フィールドの色変更　画面表示時のテーブルの色]//////////////////////////////////////////////////////////////////////////
    const subtableList = Object.values(cybozu.data.page.FORM_DATA.schema.subTable);
    const subtableField = [];

    subtableList.forEach((item) => Object.values(item.fieldList).forEach((item2) => subtableField.push(item2)));

    const tableLookUpField = [];
    let resp2 = Object.values(
      (await kintone.api(kintone.api.url('/k/v1/app/form/fields.json', true), 'GET', { app: kintone.app.getId() }))
        .properties
    );
    resp2 = resp2.filter((_) => _.type === 'SUBTABLE');
    resp2.forEach((item) => {
      const lookUp = Object.values(item.fields).filter((_) => 'lookup' in _);
      lookUp.forEach((item2) => {
        const tableLookUpFieldP = [];
        item2.lookup.fieldMappings.forEach((item3) => tableLookUpFieldP.push(item3));
        tableLookUpFieldP.forEach((item4) => tableLookUpField.push(subtableField.find((_) => _.var === item4.field)));
      });
    });

    Array.from(document.querySelectorAll(`.input-text-outer-cybozu .input-text-cybozu[disabled]`)).forEach(
      (item) => (item.style = `background-color: ${color};`)
    );
    Array.from(
      document.querySelectorAll('.disabled-cybozu.input-text-outer-cybozu.cybozu-ui-forms-editor-iframe .editor-cybozu')
    ).forEach((item) => (item.style = `background-color: ${color};`));

    //[画面表示時テーブルのルックアップ]
    tableLookUpField.forEach((item) => {
      if (item.type === 'DECIMAL' || item.type === 'CALC')
        Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
          item.firstElementChild.children[1].firstElementChild.firstElementChild.style = `background-color: ${color};`;
        });
      else if (item.type === 'SINGLE_LINE_TEXT' || item.type === 'LINK' || item.type === 'DATE' || item.type === 'TIME')
        Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
          item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
        });
      else if (item.type === 'MULTIPLE_LINE_TEXT')
        Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
          item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
        });
      else if (item.type === 'SINGLE_CHECK' || item.type === 'MULTIPLE_CHECK')
        Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
          item.firstElementChild.style = `background-color: ${color};`;
        });
      else if (item.type === 'SINGLE_SELECT') {
        Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
          item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
          item.firstElementChild.firstElementChild.children[1].style = `background-color: ${color};`;
        });
      } else if (item.type === 'DATETIME') {
        Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
          item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
          item.firstElementChild.children[1].firstElementChild.style = `background-color: ${color};`;
        });
      } else if (item.type === 'USER_SELECT' || item.type === 'GROUP_SELECT' || item.type === 'ORGANIZATION_SELECT')
        Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
          item.firstElementChild.children[1].firstElementChild.firstElementChild.firstElementChild.style = `background-color: ${color};`;
        });
      else if (item.type === 'EDITOR')
        Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
          item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
        });
      else if (item.type === 'MULTIPLE_SELECT') {
        Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
          item.style = `background-color: ${color};`;
          item.firstElementChild.style = `background-color: ${color};`;
          Array.from(item.firstElementChild.firstElementChild.children).forEach((item2) => {
            item2.style = `background-color: ${color};`;
          });
        });
      }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //[新規追加（テーブル内フィールド]///////////////////////////////////////////////////////////

    tableFieldCode.forEach((code) => {
      const tableField = inTableFieldList.filter((x) => x[0] === code);
      const fieldList = Object.values(
        Object.values(cybozu.data.page.FORM_DATA.schema.subTable).find((_) => _.var === code).fieldList
      );
      tableField.forEach((field) => {
        const fieldType = fieldList.find((_) => _.var === field[1]).type;
        const fieldId = fieldList.find((_) => _.var === field[1]).id;
        //[ここでフィールドごとのDOM操作を分岐する予定]

        //テーブル内のフィールド
        if (fieldType === 'DECIMAL')
          Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
            item.firstElementChild.children[1].firstElementChild.firstElementChild.style = `background-color: ${color};`;
          });
        else if (
          fieldType === 'SINGLE_LINE_TEXT' ||
          fieldType === 'LINK' ||
          fieldType === 'DATE' ||
          fieldType === 'TIME'
        )
          Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
            item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
          });
        else if (fieldType === 'MULTIPLE_LINE_TEXT')
          Array.from(document.querySelectorAll(`.value-${fieldId} textarea`)).forEach((item) => {
            item.style = `background-color: ${color};`;
          });
        else if (fieldType === 'SINGLE_CHECK' || fieldType === 'MULTIPLE_CHECK')
          Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
            item.firstElementChild.style = `background-color: ${color};`;
          });
        else if (fieldType === 'SINGLE_SELECT') {
          Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
            item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
            item.firstElementChild.firstElementChild.children[1].style = `background-color: ${color};`;
          });
        } else if (fieldType === 'DATETIME') {
          Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
            item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
            item.firstElementChild.children[1].firstElementChild.style = `background-color: ${color};`;
          });
        } else if (fieldType === 'USER_SELECT' || fieldType === 'GROUP_SELECT' || fieldType === 'ORGANIZATION_SELECT')
          Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
            item.firstElementChild.children[1].firstElementChild.firstElementChild.firstElementChild.style = `background-color: ${color};`;
          });
        else if (fieldType === 'EDITOR')
          Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
            item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
          });
        else if (fieldType === 'MULTIPLE_SELECT') {
          Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
            item.style = `background-color: ${color};`;
            item.firstElementChild.style = `background-color: ${color};`;
            Array.from(item.firstElementChild.firstElementChild.children).forEach((item2) => {
              item2.style = `background-color: ${color};`;
            });
          });
        }
      });
    });
    ///////////////////////////////////////////////////////////

    const events = [];
    tableFieldCode.forEach((field) => {
      events.push(`app.record.create.change.${field}`);
      events.push(`app.record.edit.change.${field}`);
    });

    kintone.events.on(events, function (e) {
      const { record } = e;

      tableFieldCode.forEach((code) => {
        const tableField = inTableFieldList.filter((x) => x[0] === code);

        tableField.forEach((field) => {
          record[code].value.forEach((row) => {
            row.value[field[1]].disabled = true;
          });
        });
      });

      //[新規追加（ルックアップコピー先、計算フィールドの色変更(テーブル行追加時)]//////////////////////////////////////////////////////////////////////////
      const subtableList = Object.values(cybozu.data.page.FORM_DATA.schema.subTable);
      const subtableField = [];

      kintone
        .api(kintone.api.url('/k/v1/app/form/fields.json', true), 'GET', { app: kintone.app.getId() })
        .then((resp) => {
          resp = Object.values(resp.properties);
          // console.log(resp);

          subtableList.forEach((item) => Object.values(item.fieldList).forEach((item2) => subtableField.push(item2)));

          const tableLookUpField = [];
          resp = resp.filter((_) => _.type === 'SUBTABLE');
          resp.forEach((item) => {
            const lookUp = Object.values(item.fields).filter((_) => 'lookup' in _);
            lookUp.forEach((item2) => {
              const tableLookUpFieldP = [];
              item2.lookup.fieldMappings.forEach((item3) => tableLookUpFieldP.push(item3));
              tableLookUpFieldP.forEach((item4) =>
                tableLookUpField.push(subtableField.find((_) => _.var === item4.field))
              );
            });
          });

          Array.from(document.querySelectorAll(`.input-text-outer-cybozu .input-text-cybozu[disabled]`)).forEach(
            (item) => (item.style = `background-color: ${color};`)
          );
          Array.from(
            document.querySelectorAll(
              '.disabled-cybozu.input-text-outer-cybozu.cybozu-ui-forms-editor-iframe .editor-cybozu'
            )
          ).forEach((item) => (item.style = `background-color: ${color};`));

          tableLookUpField.forEach((item) => {
            if (item.type === 'DECIMAL' || item.type === 'CALC')
              Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
                item.firstElementChild.children[1].firstElementChild.firstElementChild.style = `background-color: ${color};`;
              });
            else if (
              item.type === 'SINGLE_LINE_TEXT' ||
              item.type === 'LINK' ||
              item.type === 'DATE' ||
              item.type === 'TIME'
            )
              Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
                item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
              });
            else if (item.type === 'MULTIPLE_LINE_TEXT')
              Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
                item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
              });
            else if (item.type === 'SINGLE_CHECK' || item.type === 'MULTIPLE_CHECK')
              Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
                item.firstElementChild.style = `background-color: ${color};`;
              });
            else if (item.type === 'SINGLE_SELECT') {
              Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
                item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
                item.firstElementChild.firstElementChild.children[1].style = `background-color: ${color};`;
              });
            } else if (item.type === 'DATETIME') {
              Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
                item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
                item.firstElementChild.children[1].firstElementChild.style = `background-color: ${color};`;
              });
            } else if (
              item.type === 'USER_SELECT' ||
              item.type === 'GROUP_SELECT' ||
              item.type === 'ORGANIZATION_SELECT'
            )
              Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
                item.firstElementChild.children[1].firstElementChild.firstElementChild.firstElementChild.style = `background-color: ${color};`;
              });
            else if (item.type === 'EDITOR')
              Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
                item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
              });
            else if (item.type === 'MULTIPLE_SELECT') {
              Array.from(document.querySelectorAll(`.value-${item.id}`)).forEach((item) => {
                item.style = `background-color: ${color};`;
                item.firstElementChild.style = `background-color: ${color};`;
                Array.from(item.firstElementChild.firstElementChild.children).forEach((item2) => {
                  item2.style = `background-color: ${color};`;
                });
              });
            }
          });
        });

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      //[新規追加（テーブル内フィールド(テーブル行追加時)]///////////////////////////////////////////////////////////
      tableFieldCode.forEach((code) => {
        const tableField = inTableFieldList.filter((x) => x[0] === code);
        const fieldList = Object.values(
          Object.values(cybozu.data.page.FORM_DATA.schema.subTable).find((_) => _.var === code).fieldList
        );
        tableField.forEach((field) => {
          const fieldType = fieldList.find((_) => _.var === field[1]).type;
          const fieldId = fieldList.find((_) => _.var === field[1]).id;
          //[ここでフィールドごとのDOM操作を分岐する予定]

          if (fieldType === 'DECIMAL')
            Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
              item.firstElementChild.children[1].firstElementChild.firstElementChild.style = `background-color: ${color};`;
            });
          else if (
            fieldType === 'SINGLE_LINE_TEXT' ||
            fieldType === 'LINK' ||
            fieldType === 'DATE' ||
            fieldType === 'TIME'
          )
            Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
              item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
            });
          else if (fieldType === 'MULTIPLE_LINE_TEXT')
            Array.from(document.querySelectorAll(`.value-${fieldId} textarea`)).forEach((item) => {
              item.style = `background-color: ${color};`;
            });
          else if (fieldType === 'SINGLE_CHECK' || fieldType === 'MULTIPLE_CHECK')
            Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
              item.firstElementChild.style = `background-color: ${color};`;
            });
          else if (fieldType === 'SINGLE_SELECT') {
            Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
              item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
              item.firstElementChild.firstElementChild.children[1].style = `background-color: ${color};`;
            });
          } else if (fieldType === 'DATETIME') {
            Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
              item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
              item.firstElementChild.children[1].firstElementChild.style = `background-color: ${color};`;
            });
          } else if (fieldType === 'USER_SELECT' || fieldType === 'GROUP_SELECT' || fieldType === 'ORGANIZATION_SELECT')
            Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
              item.firstElementChild.children[1].firstElementChild.firstElementChild.firstElementChild.style = `background-color: ${color};`;
            });
          else if (fieldType === 'EDITOR')
            Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
              item.firstElementChild.firstElementChild.style = `background-color: ${color};`;
            });
          else if (fieldType === 'MULTIPLE_SELECT') {
            Array.from(document.querySelectorAll(`.value-${fieldId}`)).forEach((item) => {
              item.style = `background-color: ${color};`;
              item.firstElementChild.style = `background-color: ${color};`;
              Array.from(item.firstElementChild.firstElementChild.children).forEach((item2) => {
                item2.style = `background-color: ${color};`;
              });
            });
          }
        });
      });
      ///////////////////////////////////////////////////////////

      return e;
    });
    return event;
  });
})(jQuery, kintone.$PLUGIN_ID);
