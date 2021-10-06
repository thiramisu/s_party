// @ts-check
"use strict";

import { 基底 } from "../Base.js"
/**
 * @typedef {import("discord.js").ColorResolvable} ColorResolvable
 * @typedef {import("../Server.js").サーバー} サーバー
 */

export class キャラクター extends 基底 {
  /**
   * 
   * @param {サーバー} サーバー
   * @param {string} 名前 
   * @param {string} アイコン 
   * @param {ColorResolvable} 色 
   * @param {number} 最終更新日時 
   * @param {number} 場所別ID 
   */
  constructor(サーバー, 名前, アイコン, 色 = 色名.NPC, 最終更新日時 = Infinity, 場所別ID = 0) {
    super(サーバー);
    this._名前 = 名前;
    this._アイコン = アイコン;
    this._色 = 色;
    this._最終更新日時 = 最終更新日時;
    this._場所別ID = 場所別ID;
  }

  get 名前() { return this._名前 }
  get 場所別ID() { return this._場所別ID; }
  get 最終更新日時() { return this._最終更新日時; }

  _名前;
  _色;
  _アイコン;
  _最終更新日時;
  _場所別ID;

  チャット(内容, 宛て先) {
    return new チャット(this._名前, this._色, 内容, 更新日時.取得(), 宛て先);
  }

  場所用出力() {
    return キャラクター.場所用出力(this);
  }

  場所から削除する() {
    return this._最終更新日時 + メンバー表示秒数 < 更新日時.取得();
  }

  /**
   * @param {キャラクター} キャラクター
   */
  は(キャラクター) {
    return this._名前 === キャラクター.名前;
  }

  はNPC色() {
    return this._色 === 色名.NPC;
  }

  /**
   * @param {string} 色コード
   */
  色を変更(色コード) {
    if (typeof 色コード !== "string") {
      return undefined;
    }
    const _色コード = 色コード.match(有効なカラーコードか)[0];
    if (_色コード === undefined) {
      return undefined;
    }
    this._色 = _色コード;
    return _色コード;
  }

  static 場所用出力(キャラクター) {
    const
      全体枠 = document.createElement("div"),
      名前 = document.createElement("div"),
      画像 = document.createElement("img");
    全体枠.classList.add("メンバー");
    名前.style.color = キャラクター._色;
    名前.classList.add("メンバー名");
    名前.textContent = キャラクター._名前;
    全体枠.appendChild(名前);
    画像.src = `resource/icon/${キャラクター._アイコン}`;
    画像.alt = キャラクター._名前;
    全体枠.appendChild(画像);
    チャットフォーム.文字列追加イベントを登録(全体枠, `>${キャラクター._名前} `);
    return 全体枠;
  }

  static オブジェクトから({ _名前, _アイコン, _色, _最終更新日時 }, 場所別ID) {
    return new キャラクター(_名前, _アイコン, _色, _最終更新日時, 場所別ID);
  }
}
