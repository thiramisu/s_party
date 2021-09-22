// @ts-check
"use strict";

import { 戦闘メンバー } from "./BattleMember.js";
import { 一時的状態 } from "./TempState.js"
import { アイテム, 武器, 防具 } from "../item/Item.js";
import { ランダムな1要素 } from "../Util.js";

export class 宝箱 {
  /**
   * @param {string} 接頭辞
   * @param {number} 画像ID
   */
  constructor(接頭辞, 画像ID) {
    this.#接頭辞 = 接頭辞;
    this.#画像ID = 画像ID;
  }

  static ランダム召喚(アイテム名) {
    // アイテム名決定のとこでオーブと道具確率up
    const
      _宝箱 = ランダムな1要素(宝箱.#一覧),
      _アイテム = アイテム.一覧(アイテム名);
    return 戦闘メンバー.オブジェクトから({
      _名前: `${_宝箱.#接頭辞}宝箱`,
      _アイコン: `mon/${_宝箱.画像ID}.gif`,
      _ＨＰ: 1000,
      _守備力: 1000,
      _一時的状態: 一時的状態.一覧("魔無効"),
      _経験値: (_アイテム instanceof 武器) ? 1
        : (_アイテム instanceof 防具) ? 2
          : 3,
      _所持金: _アイテム.種類別IDを取得() // TODO
    })
  }

  static 初期化() {
    宝箱.#一覧 = [
      new 宝箱("普通の", 900),
      new 宝箱("大きい", 901),
      new 宝箱("小さい", 902),
      new 宝箱("黒い", 903),
      new 宝箱("青い", 904),
      new 宝箱("古い", 905),
      new 宝箱("丸い", 906)
    ];
  }

  #接頭辞;
  #画像ID;

  static #一覧;
}
