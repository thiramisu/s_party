// @ts-check
"use strict";

import { PlaceActionCommand } from "../command/PlaceActionCommand.js";
import { PlaceCommandGroup } from "../command/PlaceCommandGroup.js";
import { アイテム } from "../item/Item.js";
import { 一般的な場所 } from "./General.js"
import { 通貨 } from "../Currency.js"

/**
 * @typedef {import("../Server.js").サーバー} サーバー
 * @typedef {import("../character/Member.js").メンバー} メンバー
 */

/**
 * @typedef {import("discord.js").TextBasedChannels} チャンネル
 */

export class 店インターフェース extends 一般的な場所 {
  /**
   * @param {import("../Server.js").サーバー} サーバー
   * @param {import("discord.js").TextBasedChannels} チャンネル
   * @param {typeof import("../item/Item.js").アイテム} 商品の種類
   * @param {number} 販売価格係数
   * @param {string} 陳列棚表示時の通知内容
   * @param {string} 金欠時の通知内容
   */
  constructor(サーバー, チャンネル, 
    商品の種類, 販売価格係数, 陳列棚表示時の通知内容, 金欠時の通知内容,
    購入のためのこうどう名 = "かう") {
    super(サーバー, チャンネル);
    this.#商品の種類 = 商品の種類;// TODO getPrototypeOf?
    this.#販売価格係数 = 販売価格係数;
    this.#陳列棚表示時の通知内容 = 陳列棚表示時の通知内容;
    this.#金欠時の通知内容 = 金欠時の通知内容;
    this.#購入のためのこうどう名 = 購入のためのこうどう名;
  }

  static get コマンド() { return this.#コマンド ?? this.#コマンドを登録(); }

  /**
   * 
   * @interface
   * @param {メンバー} プレイヤー 
   * @param {string} 商品名 
   * @returns 
   */
  _かう(プレイヤー, 商品名) { throw new Error("未定義です"); }

  /**
   * @param {any[] | Set<any> | Map<any, any>} 販売アイテムリスト
   */
  _かうクリック時(販売アイテムリスト) {
    通知欄.追加([
      this.#陳列棚表示時の通知内容,
      this.#商品の種類.陳列棚出力(販売アイテムリスト.values(), this.#購入のためのこうどう名, this.#販売価格係数)
    ]);
  }

  /**
   * @param {メンバー} プレイヤー
   * @param {アイテム} 商品
   * @param {通貨} [通貨]
   */
  _かうメイン(プレイヤー, 商品, 通貨) {
    if (!通貨.収支(-商品.価値 * this.#販売価格係数)) {
      通知欄.追加(this.#金欠時の通知内容 ?? this._金欠時の通知内容を取得(商品));
      return;
    }
    if (this._装備時の会話内容を取得 === undefined) {
      プレイヤー.アイテム倉庫.追加(商品.アイテム名);
      this.NPCに話させる(this._倉庫送信時の会話内容を取得(商品));
      return;
    }
    this.NPCに話させる(
      (プレイヤー.装備または倉庫に送る(商品.アイテム名) ? this._装備時の会話内容を取得 : this._倉庫送信時の会話内容を取得)(商品)
    );
  }

  get _装備時の会話内容を取得() { return undefined; }

  /**
   * @interface
   * @param {アイテム} 取引アイテム 
   */
  _倉庫送信時の会話内容を取得(取引アイテム) { throw new Error("未設定です"); }
  /**
   * @interface
   * @param {string} アイテム名
   * @param {number} 売却価格
   */
  _売却確認時の通知内容を取得(アイテム名, 売却価格) { throw new Error("未設定です"); }
  /**
   * @interface
   * @param {string} アイテム名
   * @param {number} 売却価格
   */
  _売却時の会話内容を取得(アイテム名, 売却価格) { throw new Error("未設定です"); }

  static #コマンドを登録() {
    this.#コマンド = new PlaceCommandGroup();
    // TODO
    this.#コマンド.追加(
      new PlaceActionCommand("buy", 店インターフェース.prototype._かう)
        .引数追加("STRING", "weapon", "武器", false)
    );
    return this.#コマンド;
  }

  #商品の種類;
  #販売価格係数;
  #陳列棚表示時の通知内容;
  #金欠時の通知内容;
  #購入のためのこうどう名;

  /**
   * @type {PlaceCommandGroup}
   */
  static #コマンド;
}

export class 販売店 extends 店インターフェース {
  // TODO 何でも屋は除外
  /**
   * @param {メンバー} プレイヤー
   * @param {string} 商品名
   */
  _かう(プレイヤー, 商品名) {
    const
      商品 = アイテム.一覧(商品名, false),
      品揃え = this._品揃えアイテム名リストを取得(),
      候補 = new Set(品揃え);
    if (!候補.has(商品名)) {
      this._かうクリック時(アイテム.リスト(品揃え));
      return;
    }
    this._かうメイン(プレイヤー, 商品, プレイヤー.所持金);
  }

  _かうクリック時(販売アイテムリスト = アイテム.リスト(this._品揃えアイテム名リストを取得())) {
    super._かうクリック時(販売アイテムリスト);
  }

  /**
   * @interface
   * @returns {string[]}
   */
  _品揃えアイテム名リストを取得() { return []; }
}

export class 専門店 extends 販売店 {
  /**
   * @param {サーバー} サーバー
   * @param {チャンネル} チャンネル
   * @param {string} 背景画像
   * @param {any} 訪問方法
   * @param {import("../character/Character.js").キャラクター} キャラクター
   * @param {typeof import("../item/Item.js").アイテム} 商品の種類
   * @param {number} 販売価格係数
   * @param {string} 陳列棚表示時の通知内容
   * @param {string} 金欠時の通知内容
   * @param {string} [購入のためのこうどう名]
   */
  constructor(サーバー, チャンネル, 商品の種類, 販売価格係数, 陳列棚表示時の通知内容, 金欠時の通知内容, 購入のためのこうどう名,
    買取価格係数 = 0.5) {
    super(...arguments);
    this.#買取価格係数 = 買取価格係数;
  }

  /**
   * @param {メンバー} プレイヤー
   * @param {string} 対象
   * @param {import("../character/EquipmentSlot.js").装備スロット} 装備スロット
   */
  _うる(プレイヤー, 対象, 装備スロット) {
    const 売却価格 = 装備スロット.装備.価値 * this.#買取価格係数;
    if (!装備スロット.装備中 || 装備スロット.売る(対象, 売却価格)) {
      this._うるクリック時(装備スロット);
      return;
    }
    プレイヤー.現在地.NPCに話させる(this._売却時の会話内容を取得(対象, 売却価格));
  }

  /**
   * @param {import("../character/EquipmentSlot.js").装備スロット} 装備スロット
   * @param {string} [無装備時の通知内容]
   */
  _うるクリック時(装備スロット, 無装備時の通知内容) {
    if (装備スロット.装備中) {
      通知欄.追加(無装備時の通知内容);
      return;
    }
    const アイテム = 装備スロット.装備;
    console.log(アイテム);
    const 売却価格 = アイテム.価値 * this.#買取価格係数;
    通知欄.追加(this._売却確認時の通知内容を取得(アイテム.名前, 売却価格), `＠うる>${アイテム.名前} `);
  }

  #買取価格係数;
}

export class 交換所 extends 店インターフェース {
  /**
   * @param {サーバー} サーバー
   * @param {チャンネル} チャンネル
   * @param {any} 背景画像
   * @param {any} 訪問方法
   * @param {any} キャラクター
   * @param {any} 商品の種類
   * @param {any} 販売価格係数
   * @param {any} 陳列棚表示時の通知内容
   * @param {any} 金欠時の通知内容
   * @param {any} 購入のためのこうどう名
   * @param {{ map: (arg0: (取引アイテム: any) => any[]) => Iterable<readonly [any, any]>; }} 販売取引アイテムリスト
   */
  constructor(サーバー, チャンネル, 商品の種類, 販売価格係数, 陳列棚表示時の通知内容, 金欠時の通知内容, 購入のためのこうどう名,
    販売取引アイテムリスト) {
    super(...arguments);
    this.#販売取引アイテムリスト = new Map(販売取引アイテムリスト.map((/** @type {{ 名前: any; }} */ 取引アイテム) => [取引アイテム.名前, 取引アイテム]));
  }

  /**
   * @param {メンバー} プレイヤー
   * @param {string} 商品名
   * @param {通貨} 通貨
   */
  _かう(プレイヤー, 商品名, 通貨) {
    const 商品 = this.#販売取引アイテムリスト.get(商品名);
    if (商品 === undefined) {
      this._かうクリック時(this.#販売取引アイテムリスト);
      return;
    }
    this._かうメイン(プレイヤー, 商品, 通貨);
  }

  _かうクリック時(販売取引アイテムリスト = this.#販売取引アイテムリスト) {
    super._かうクリック時(販売取引アイテムリスト);
  }

  #販売取引アイテムリスト;

}
