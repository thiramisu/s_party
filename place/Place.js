// @ts-check
"use strict";

import { キャラクター } from "../character/Character.js";
import { ログ書き込み君 } from "../logger/Logger.js";
import { ランダムな1要素, 空文字列 } from "../Util.js";

/**
 * @typedef {import("../character/Member.js").メンバー} プレイヤー
 * 
 */

export class 場所 extends ログ書き込み君  {
  更新要求() {
    更新日時.更新();
    new 場所別キャラクター読み込み君(this);
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {Iterable<any> | ArrayLike<any>} キャラクターリスト
   */
  メイン(プレイヤー, キャラクターリスト) {
    this._キャラクターリスト = キャラクターリスト;
    this._名前からキャラクター取得用キャッシュ = new Map(Array.from(キャラクターリスト, 場所.#一覧生成, 場所));
    const チャット内容 = $encode(チャットフォーム.内容);
    チャットフォーム.保存した内容を消去();
    プレイヤー.チャット書き込み予約(チャット内容);
    try {
      this.#こうどうを実行(チャット内容);
      プレイヤー.予約チャットを書き込んでから読み込む();
    }
    catch (e) {
      // 意図的な処理停止でないなら
      if (typeof e !== "string") {
        throw e;
      }
      else {
        console.log(e);
      }
      // TODO マルチならチャット更新&画面更新
    }
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {string} オーバーライド場所名
   */
  ヘッダー出力(プレイヤー, オーバーライド場所名) {
    return `${this._ヘッダー用出力(オーバーライド場所名)}${プレイヤー.ヘッダー用出力()}`;
  }

  固定NPC出力() {
    return this._NPC.場所用出力();
  }

  メンバー出力() {
    const 断片 = document.createDocumentFragment();
    if (this._NPC) {
      断片.appendChild(this._NPC.場所用出力());
    }
    for (const キャラクター of this._キャラクターリスト) {
      断片.appendChild(キャラクター.場所用出力());
    }
    return 断片;
  }

  こうどう出力() {
    const 断片 = document.createDocumentFragment();
    if (!this._こうどうリストリスト) {
      return 断片;
    }
    for (const こうどうリスト of this._こうどうリストリスト) {
      断片.appendChild(こうどうリスト.出力());
    }
    return 断片;
  }

  チャットを書き込んでから読み込む(チャット) {
    if (チャット === undefined && this._NPCのチャット === undefined) {
      データベース操作.場所別ログを読み込む(this.ログ名, this.ログ読み込み後の処理.bind(this));
      return;
    }
    const 対象チャット = [チャット, this._NPCのチャット].filter(場所.#未定義でない要素);
    データベース操作.チャットを書き込んでから読み込む(対象チャット, this.ログ名, this.ログ読み込み後の処理.bind(this));
    this._NPCのチャット = undefined;
  }

  NPCに話させる(内容, 宛て先) {
    if (this._NPCのチャット) {
      this._NPCのチャット.内容追加(内容, 宛て先);
    }
    else {
      this._NPCのチャット = (this._NPC ?? 場所.#チャットのデフォルトNPC).チャット(内容, 宛て先);
    }
  }

  get 移動可能() { return true; }
  get NPC() { return new キャラクター(this.サーバー, チャットのデフォルトのNPC名, "none.gif") }

  get 名前() { return this.constructor.name; }
  /**
   * @type {string}
   * @interface
   */
  get 背景画像() { return "none.gif"; }
  get ログ名() { return this.名前; }

  static 初期化() {
    場所.#一覧 = new Map([
      new 町("ガイア国", "quest.gif", 10, new Set(["021", "022", "023", "024", "025", "026", "027", "028"]), 5000, 20),
      new 町("スライム町", "stage16.gif", 10, new Set(["013", "014", "015", "016", "017", "018", "019", "020"]), 3000, 15),
      new 町("キノコ町", "park.gif", 10, new Set(["005", "006", "007", "008", "009", "010", "011", "012"]), 1500, 10),
      new 町("メケメケ村", "stage8.gif", 10, new Set(["001", "002", "003", "004"]), 500, 5)
    ].map(場所.#一覧生成, 場所));
  }

  static * 全場所名(訪問方法) {
    for (const [名前, _場所] of 場所.#一覧) {
      if (訪問方法 !== undefined && _場所._訪問方法 !== 訪問方法) {
        continue;
      }
      yield 名前;
    }
  }

  static 一覧(場所名, エラーを出す = true) {
    return 場所.#一覧.get(場所名) ?? ((!エラーを出す || console.error(`場所「${場所名}」は存在しません`)) ? undefined : undefined);
  }


  _名前からキャラクター取得(名前) {
    return this._名前からキャラクター取得用キャッシュ.get(名前);
  }

  _NPCをしらべる(通知内容, クリック時文字列) {
    通知欄.追加(通知内容 ?? `しかし何も見つからなかった…`, クリック時文字列);
  }

  _はなす(...言葉リスト) {
    if (!言葉リスト?.length) {
      通知欄.追加("返事がない、ただのしかばねのようだ…");
      return;
    }
    this.NPCに話させる(ランダムな1要素(言葉リスト));
  }

  _ヘッダー用出力(場所名 = this.名前, 半角スペースを入れる = true) {
    return `【${場所名}】${半角スペースを入れる ? " " : 空文字列}`;
  }

  _名前;
  _NPC;
  _背景画像;
  _こうどうリストリスト = [];
  _キャラクターリスト = new Set();
  _NPCの発言;

  /**
   * @param {プレイヤー} プレイヤー
   * @param {} データベースイベント
   */
  ログ読み込み後の処理(プレイヤー, データベースイベント) {
    this._チャットリスト = new Set(データベースイベント.target.result.map(チャット.オブジェクトから));
    this._チャット欄.更新(this._チャットリスト);
    プレイヤー.データベースに保存();
    画面.一覧("ゲーム画面").更新(this);
  }

  #こうどうを実行(チャット内容) {
    const こうどう情報 = チャット内容.match(場所.#こうどう名抽出);
    if (!こうどう情報) {
      return false;
    }
    const [, こうどう名, 対象] = こうどう情報;
    for (const こうどうリスト of this._こうどうリストリスト) {
      if (こうどうリスト.名前が一致したこうどうを実行(こうどう名, 対象)) {
        return true;
      }
    }
    return false;
  }

  /**
   * @param {場所} 場所
   */
  static #一覧生成(場所) {
    return [場所.名前, 場所];
  }

  static #未定義でない要素(要素) {
    return 要素 !== undefined;
  }

  static #一覧;

  static #チャットのデフォルトNPC;
  static #こうどう名抽出 = new RegExp(/＠(.+?)(?:[\x20　]?&gt;(.+?))?(?:[\x20　]|$)/);
  static _訪問方法 = Object.freeze({
    特殊: Symbol("特殊"),
    いどう: Symbol("いどう"),
    まち: Symbol("まち")
  });
}
