// @ts-check
"use strict";

import { キャラクター } from "../character/Character.js"
import { クエスト } from "./Quest.js"
import { 家 } from "./Home.js"
import { ギルド } from "../Guild.js"
import { エラー } from "../Error.js"

export class 場所マネージャー {
  constructor() {
    this._チャットのデフォルトNPC = new キャラクター(設定.チャットのデフォルトのNPC名);
    一般的な場所.初期化();
    this._一覧 = new Map([
      new 冒険に出る(),
      new カジノ(),
      new 預かり所(),
      new 武器屋(),
      new 防具屋(),
      new 道具屋(),
      new 秘密の店(),
      new ルイーダの酒場(),
      new 福引所(),
      new モンスターじいさん(),
      new フォトコン会場(),
      new オラクル屋(),
      new 闇市場(),
      new メダル王の城(),
      new ダーマ神殿(),
      new 交流広場(),
      new オークション会場(),
      new イベント広場(),
      new 願いの泉(),
      new 復活の祭壇(),
      new ギルド協会(),
      new 命名の館(),
      new 追放騎士団(),
      new 何でも屋(),
      new 錬金場(),
      new 天界(),
      new 町("ガイア国", "quest.gif", 10, new Set(["021", "022", "023", "024", "025", "026", "027", "028"]), 5000, 20),
      new 町("スライム町", "stage16.gif", 10, new Set(["013", "014", "015", "016", "017", "018", "019", "020"]), 3000, 15),
      new 町("キノコ町", "park.gif", 10, new Set(["005", "006", "007", "008", "009", "010", "011", "012"]), 1500, 10),
      new 町("メケメケ村", "stage8.gif", 10, new Set(["001", "002", "003", "004"]), 500, 5)
    ].map(this._一覧生成, this));
    this._家一覧 = new Map(); // TODO [所有者名, new 家]
    this._クエスト一覧 = new Map(); // TODO [クエスト名, new クエスト]
    this._ギルド一覧 = new Map(); // TODO [ギルド名, new ギルド]
  }

  一時的な場所を登録(名前, _場所) {
    if (_場所 instanceof クエスト)
      this._クエスト一覧.set(名前, _場所);
    else if (_場所 instanceof 家)
      this._家一覧.set(名前, _場所);
    else if (_場所 instanceof ギルド)
      this._ギルド一覧.set(名前, _場所);
    else
      throw new TypeError(`${_場所}は有効な場所ではありません`);
    this._一覧.set(名前, _場所);
  }

  一覧(場所名, エラーを出す = true) {
    return this._一覧.get(場所名) ?? ((!エラーを出す || console.error(`場所「${場所名}」は存在しません`)) ? undefined : undefined);
  }

  一時的な場所を自動削除() {
    for (const 場所リスト of [this._家一覧, this._ギルド一覧, this._クエスト一覧])
      for (const _場所 of 場所リスト)
        if (_場所.最終更新日時 + 設定.一時的な場所の自動削除秒数 < Date.now() / 1000)
          _場所.削除();
  }

  async 家一覧(所有者名) {
    if (this._家一覧.has(所有者名)) {
      return this._家一覧.get(所有者名);
    }
    //あなた.家を検索して移動(所有者名);
    //throw "非同期処理";
  }

  async クエスト一覧(クエスト名, エラーを出す = true) {
    return this._クエスト一覧.get(クエスト名) ?? ((!エラーを出す || エラー.表示("すでにパーティーが解散してしまったようです")) ? undefined : undefined);
  }

  ギルド一覧(ギルド名) {
    if (this._ギルド一覧.has(ギルド名)) {
      return this._ギルド一覧.get(ギルド名);
    }
    //あなた.ギルドを検索して移動(ギルド名);
    //throw "非同期処理";
  }

  _ギルドを登録() {

  }

  _未定義でない要素(要素) {
    return 要素 !== undefined;
  }

  _一覧生成(場所) {
    return [場所.名前, 場所]
  }
  /* TODO
    static _こうどう名抽出 = new RegExp(/＠(.+?)(?:[\x20　]?&gt;(.+?))?(?:[\x20　]|$)/);
    static _訪問方法 = Object.freeze({
      特殊: Symbol("特殊"),
      いどう: Symbol("いどう"),
      まち: Symbol("まち")
    });
    */

  static #家一覧 = new Map(); // TODO [所有者名, new 家]
  static #クエスト一覧 = new Map(); // TODO [クエスト名, new クエスト]
  static #ギルド一覧 = new Map(); // TODO [ギルド名, new ギルド]
}