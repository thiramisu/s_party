// @ts-check
"use strict";

export class 陳列可能インターフェース {
  constructor(名前) {
    this.#名前 = 名前;
  }

  // TODO 数を区切って表示
  /**
   * @param {IterableIterator<any>} 商品リスト
   * @param {string} クリック時のこうどう名
   */
  static 陳列棚出力(商品リスト, クリック時のこうどう名, 価格係数 = 1) {
    const
      table = document.createElement("table"),
      tBody = document.createElement("tbody");
    table.classList.add("table1");
    let 最初 = true;
    for (const 商品 of 商品リスト) {
      if (最初) {
        最初 = false;
        if (this._陳列用ヘッダー項目名リスト !== undefined) {
          const tHead = document.createElement("thead");
          tHead.appendChild(テーブル行出力(this._陳列用ヘッダー項目名リスト, undefined, true));
          table.appendChild(tHead);
        }
      }
      // console.log(商品);
      tBody.appendChild(商品._陳列用出力(クリック時のこうどう名, 価格係数));
    }
    table.appendChild(tBody);
    return table;
  }

  get 名前() { return this.#名前; }

  /**
   * @param {string} クリック時のこうどう名
   * @param {any[]} 陳列用項目名リスト
   */
  _陳列用出力(クリック時のこうどう名, ...陳列用項目名リスト) {
    return テーブル行出力(陳列用項目名リスト, クリック時のこうどう名 ? `＠${クリック時のこうどう名}>${this.名前} ` : undefined, false);
  };

  static _陳列用ヘッダー項目名リスト = ["名前"];

  #名前;
}

export class 取引アイテムインターフェース extends 陳列可能インターフェース {
  constructor(名前, 価値) {
    super(名前);
    this.#価値 = 価値;
  }

  get アイテム名() { return this.名前; }
  get 価値() { return this.#価値; }

  #価値;
}