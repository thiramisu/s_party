// @ts-check
"use strict";

import { 陳列可能インターフェース } from "./ItemInterface.js"

export class 壁紙 extends 陳列可能インターフェース {
  /**
   * @param {string} 画像
   * @param {number} 価値
   */
  constructor(画像, 価値) {
    super(画像.match(壁紙.#拡張子を除く)[0]);
    this.#画像 = 画像;
    this.#価値 = 価値;
  }

  get 価値() { return this.#価値; }

  _陳列用出力() {
    // デフォルトに忠実
    const
      td = document.createElement("td"),
      div = document.createElement("div"),
      span = document.createElement("span"),
      img = document.createElement("img");
    td.classList.add("壁紙一覧-td");
    span.classList.add("壁紙一覧-内容");
    img.src = `resource/bg/${this.#画像}`;
    img.title = this.名前;
    span.append(img, `${this.#価値} G`);
    td.appendChild(span);
    チャットフォーム.文字列追加イベントを登録(span, `＠かべがみ>${this.名前} `);
    return td;
  }

  static 陳列棚出力() {
    const table = document.createElement("table");
    table.classList.add("壁紙陳列棚");
    let
      tr,
      改行する = 0;
    for (const 壁紙 of this.#一覧.values()) {
      if (++改行する % 10 === 1) {
        tr = document.createElement("tr");
        table.appendChild(tr);
      }
      tr.appendChild(壁紙._陳列用出力());
    }
    return table;
  }

  static 初期化() {
    this.#一覧 = new Map([
      // Perlのソートアルゴリズムは同値の時に順番を維持するとは限らないので、
      // 必ず維持するJavascriptと順番が違う場合があります
      // 気になるならリストの順番を入れ変えてください

      new 壁紙("none.gif", 0),

      new 壁紙("farm.gif", 1000),
      new 壁紙("lot.gif", 1000),
      new 壁紙("sp_change.gif", 1500),
      new 壁紙("exile.gif", 1500),
      new 壁紙("depot.gif", 1500),
      new 壁紙("item.gif", 2000),
      new 壁紙("medal.gif", 2000),
      new 壁紙("bar.gif", 2500),
      new 壁紙("casino.gif", 2500),
      new 壁紙("goods.gif", 2500),
      new 壁紙("armor.gif", 3000),
      new 壁紙("job_change.gif", 3000),
      new 壁紙("park.gif", 3500),
      new 壁紙("auction.gif", 4000),
      new 壁紙("weapon.gif", 5000),
      new 壁紙("event.gif", 5000),

      new 壁紙("stage0.gif", 6000),
      new 壁紙("stage1.gif", 6500),
      new 壁紙("stage2.gif", 7000),
      new 壁紙("stage3.gif", 7500),
      new 壁紙("stage4.gif", 8000),
      new 壁紙("stage5.gif", 8500),
      new 壁紙("stage6.gif", 9000),
      new 壁紙("stage7.gif", 9500),
      new 壁紙("stage8.gif", 10000),
      new 壁紙("stage9.gif", 10500),
      new 壁紙("stage10.gif", 11000),
      new 壁紙("stage11.gif", 11500),
      new 壁紙("stage12.gif", 12000),
      new 壁紙("stage13.gif", 12500),
      new 壁紙("stage14.gif", 13000),
      new 壁紙("stage15.gif", 20000),
      new 壁紙("stage16.gif", 22000),
      new 壁紙("stage17.gif", 24000),
      new 壁紙("stage18.gif", 25000),
      new 壁紙("stage19.gif", 30000),
      new 壁紙("stage20.gif", 50000),

      new 壁紙("map1.gif", 3000),
      new 壁紙("map2.gif", 4500),
      new 壁紙("map3.gif", 5000)
    ].sort((壁紙1, 壁紙2) => 壁紙1.#価値 - 壁紙2.#価値).map((壁紙) => [壁紙.名前, 壁紙]));
  }

  /**
   * @param {string} 画像名
   * @returns {?壁紙}
   */
  static 一覧(画像名, エラーを出す = true) {
    return this.#一覧.get(画像名) ?? ((!エラーを出す || console.error(`壁紙「${画像名}」は存在しません`)) ? null : null);
  }

  #画像;
  #価値;

  /**
   * @type {Map<string, 壁紙>}
   */
  static #一覧;
  static #拡張子を除く = new RegExp(/.+(?=[.].+)/);
}
