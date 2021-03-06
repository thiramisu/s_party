// @ts-check
"use strict";

import { キャラクター} from "./Character.js"
import { ステータス } from "./Status.js"
import { モンスター倉庫, アイテム倉庫 } from "./Yard.js"
import { 通貨 } from "../Currency.js"
import { 家 } from "../place/Home.js"
import { ログ書き込み君 } from "../logger/Logger.js"
import { 装備スロットマネージャー } from "./EquipmentSlotManager.js"
import { 色名 } from "../config.js";
import { プレイヤー錬金レシピマネージャー } from "./PlayerAlchemyRecipeManager.js";
import { 場所 } from "../place/Place.js";
import { メンバーの職業 } from "./MemberJob.js";
import { アイテム } from "../item/Item.js";
import { 空文字列 } from "../Util.js";

/**
 * @typedef {import("discord.js").ColorResolvable} ColorResolvable
 * @typedef {import("../Server.js").サーバー} サーバー
 */

export class ログインメンバー extends キャラクター {
  constructor(サーバー, 情報) {
    super(サーバー, 情報._名前, 情報._色, 情報._アイコン, 情報._最終更新日時);
    this._めっせーじ = 情報._めっせーじ;
    this._ギルド名 = 情報._ギルド名;
  }

  _ギルド名;
  _めっせーじ;

  /**
   * 
   * @param {boolean} ギルドを出力する 
   * @param {boolean} めっせーじを出力する 
   * @param {boolean} 無色 
   * @returns {import("discord.js").MessageEmbedOptions}
   */
  出力(ギルドを出力する = true, めっせーじを出力する = false, 無色 = false) {
    return {
      color: 無色 ? 色名.デフォルト : this._色,
      image: {
        url: this._アイコン
      },
      title: `${this._名前}${ギルドを出力する && this._ギルド名 ? `＠${this._ギルド名}` : 空文字列}${めっせーじを出力する ? `＠${this._めっせーじ}` : 空文字列}`
    };
  }
}

export class メンバー extends ログインメンバー {
  /**
   * 
   * @param {サーバー} サーバー 
   * @param {*} 情報 
   */
  constructor(サーバー, 情報) {
    super(サーバー, 情報);
    this.#アイテム倉庫 = new アイテム倉庫(サーバー, this);
    this.#モンスター倉庫 = new モンスター倉庫(サーバー, this);
    this.#装備マネージャー = new 装備スロットマネージャー(サーバー, this);
    this.#錬金レシピマネージャー = new プレイヤー錬金レシピマネージャー(サーバー, this);

    for (const [状態名, 状態] of Object.entries(情報)) {
      switch (状態名) {
        case "_ステータス":
          /**
           * @type {ステータス}
           */
          this[状態名] = ステータス.オブジェクトから(状態);
          break;
        case "_所持金":
        case "_カジノコイン":
        case "_福引券":
        case "_小さなメダル":
        case "_レアポイント":
          this[状態名] = 通貨.オブジェクトから(状態);
          break;
        case "_現職":
        case "_前職":
          this[状態名] = 状態 ? メンバーの職業.オブジェクトから(状態) : undefined;
          break;
        case "_現在地名":
          if (状態 === "家") {
            家.一覧(情報._家のユーザー名, this.#現在地を設定.bind(this), 情報._名前, 情報._ID);
          }
          else {
            this.#現在地を設定(場所.一覧(状態));
          }
          break;
        case "_実績":
          /**
           * @type {実績}
           */
          this[状態名] = new 実績(状態);
          break;
        default:
          this[状態名] = 状態;
          break;
      }
    }
    this._実績 ??= new 実績();
  }

  /**
   * 
   * @param {import("./Job.js").職業} 次職 
   * @returns 消費アイテム名
   */
  転職(次職) {
    this.ギルド?.ポイント増加(50);
    this.軌跡.書き込む(`${this.現職.名前}から${次職.名前}に転職`);
    // TODO 全体の傾向に追加
    // TODO ジョブマス確認
    const 消費アイテム名 = 次職.転職条件.消費アイテムを取得(this);
    if (消費アイテム名 !== undefined) {
      this.装備.アイテムからスロットを取得(消費アイテム名).売る(消費アイテム名, 0);
    }
    this._転職回数 += 1;
    this._レベル = 1;
    this._経験値 = 0;
    this.ステータス.半減();
    if (次職.名前 === this.現職.名前) {
      this.アイコンをリセット();
      return 消費アイテム名;
    }
    this._前職 = this.現職;
    if (次職.名前 === this.前職.名前) {

    }
    this._現職 = 次職;
    this.アイコンをリセット();
    return 消費アイテム名;
  }

  可能ならレベルアップ() {
    if (this._レベル * this._レベル * 10 > this._経験値)
      return false;
    this.現職.レベルアップ(this.ステータス);
    return true;
  }

  一気にレベルアップ() {
    while (this.可能ならレベルアップ());
  }

  現職SP増加(増加量) {
    const 増加前現職SP = this._現職.SP;
    this._現職.SP += 増加量;
    // TODO: スキル習得ログ
  }

  /**
   * 
   * @param {string} アイテム名 
   * @returns 
   */
  async アイテムを使う(アイテム名) {
    const _アイテム = アイテム.一覧(アイテム名);
    if (アイテム名 === undefined || _アイテム === undefined || !await this.アイテム倉庫.にある(アイテム名)) {
      return false;
    }
    if (_アイテム.使う()) {
      if (アイテム === this.道具.名前) {
        this.道具 = undefined;
      }
      this.アイテム倉庫.削除(アイテム名);
    }
  }

  プロフィールを更新(保存データ) {
    console.log(this._ID);
    データベース操作.プロフィールを更新(this._ID, 保存データ);
  }

  睡眠(時間, 上書きする = true) {
    this._起床時刻 = 時間 + ((上書きする || this.睡眠時間取得() === 0) ? 更新日時.取得() : this._起床時刻);
  }

  は睡眠中() {
    return this._起床時刻 !== undefined;
  }

  予定時刻を過ぎているなら起床する() {
    if (this._起床時刻 >= 更新日時.取得()) {
      return false;
    }
    this._起床時刻 = undefined;
    this._疲労 = 0;
    this.ステータス.ＨＰ.基礎値へ();
    this.ステータス.ＭＰ.基礎値へ();
    this._飲食済み = false;
    this.アイコンをリセット();
    return true;
  }

  睡眠時間取得() {
    return Math.max(this._起床時刻 - 更新日時.取得(), 0);
  }

  更新連打確認() {
    // TODO
    const 更新連打回数 = parseInt(ローカルセーブデータ.getItem("更新連打回数"));
    if (!更新連打回数) {
      return;
    }
    for (const [回数, 睡眠秒数] of 更新連打の睡眠秒数) {
      if (回数 > 更新連打回数)
        continue;
      this.睡眠(睡眠秒数, false);
      ローカルセーブデータ.setItem("更新連打回数", 0);
      データベース操作.プレイヤーを保存(this);
      エラー.表示(`<span class="die">前回のプレイ時に更新連打が${回数}回を超えていたので、${Math.round(睡眠秒数 / 60)}分間睡眠状態となります</span>`);
      return true;
    }
    ローカルセーブデータ.setItem("更新連打回数", 0);
    return false;
  }

  更新連打追加() {
    ローカルセーブデータ.setItem("更新連打回数", parseInt(ローカルセーブデータ.getItem("更新連打回数") + 1));
  }

  データベースに保存() {
    データベース操作.プレイヤーを保存(this);
  }

  /**
   * @param {import("../logger/HallOfFame.js").殿堂の名前} 種別
   */
  async コンプリート(種別) {
    // TODO 種別.name
    // TODO 職業・モンスター・錬金ならフラグ立て
    // TODO コレクションはテクニカルな感じで重複処理回避してるので要検討
    (await this.サーバー.殿堂.取得(種別)).登録(new ログインメンバー(this));
    this.軌跡.書き込む(`${種別} Complete!!`, 色名.コンプリート);
    this.サーバー.ニュース.書き込む(`${種別} ${this.名前}が${種別}をコンプリートする！`, 色名.コンプリート);
  }

  バックアップ() {

  }

  家を取得() {
    return new 家(this.名前, this._ID);
  }

  場所移動(行き先) {
    this.#現在地のキャラクターから消去();
    if (行き先 instanceof 家) {
      this._家のユーザー名 = 行き先.所有者名;
    }
    this.#現在地を設定(行き先);
  }

  async ログイン(めっせーじ) {
    if (this.更新連打確認()) {
      return;
    }
    this._めっせーじ = めっせーじ;
    this._最終更新日時 = 更新日時.取得();
    //TODO this.トップに登録();
    this.サーバー.ギルド.必要なら一覧出力();
    データベース操作.プレイヤーを保存(this);
    await this.サーバー.プレイヤー.必要ならプレイヤー削除と一覧更新();
  }

  ログアウト() {
    this.#現在地のキャラクターから消去();
    this.データベースに保存();
    throw "ログアウト";
  }

  削除(保存する = true) {
    this._ギルド.メンバー削除(this);
    this.サーバー.プレイヤー.削除(this);
    if (保存する)
      this.サーバー.プレイヤー.保存();
  }

  現職名または前職名(職業名) {
    return this.現職.名前 === 職業名 || this.前職?.名前 === 職業名;
  }

  アイコンをリセット() {
    this._アイコン = this.現職.アイコン名を取得(this._性別);
  }

  /**
   * @param {string} アイテム名
   */
  装備または倉庫に送る(アイテム名, アイテム図鑑に登録する = true) {
    this.アイテム倉庫.追加(アイテム名);
    const
      _アイテム = アイテム.一覧(アイテム名),
      スロット = this.装備.アイテムからスロットを取得(_アイテム);
    if (!スロット.装備中) {
      return false;
    }
    スロット.装着(_アイテム, アイテム図鑑に登録する);
    return true;
  }

  依頼を完了する(報酬名, ギルドポイント) {
    this.アイテム倉庫.追加(報酬名);
    if (ギルドポイント) {
      this._ギルド?.ポイント増加(ギルドポイント);
    }
    this._実績.依頼ポイント増加();
  }

  ヘッダー用出力() {
    // TODO ステータスは武器防具込みのもの、素早さのみ max(0,素早さ)
    return `ゴールド **${this.所持金.所持}G / ${this.ステータス.ヘッダー用3ステータス出力()} /${this.装備.ヘッダー用出力()}`;
  }

  疲労確認() {
    if (this._疲労 >= 疲労限界) {
      通知欄.追加("疲労がたまっています。「＠ほーむ」で家に帰り「＠ねる」で休んでください", "＠ほーむ");
      return true;
    }
    return false;
  }

  set ID(_ID) { this._ID = _ID; }
  /**
   * @deprecated
   */
  set _現在地(_現在地名) { console.error("代わりに メンバー.prototype.場所移動(場所名) を使え"); }

  get 残り睡眠秒数() { return this._起床時刻 - 更新日時.取得(); }
  get ギルド() { return this._ギルド; }
  get 色() { return this._色; }
  get 性別() { return this._性別; }
  get アイコン() { return this._アイコン; }
  get 現在地() { return this.#現在地; }
  get 転職回数() { return this._転職回数; }
  get 現職() { return this._現職; }
  get 前職() { return this._前職; }
  get 所持金() { return this._所持金; }
  get カジノコイン() { return this._カジノコイン; }
  get 小さなメダル() { return this._小さなメダル; }
  get 福引券() { return this._福引券; }
  get 実績() { return this._実績; }
  get ステータス() { return this._ステータス; }
  get レベル() { return this._レベル; }

  get 軌跡() { return this.#軌跡; }
  get 装備() { return this.#装備マネージャー; }
  get アイテム倉庫() { return this.#アイテム倉庫; }
  get モンスター倉庫() { return this.#モンスター倉庫; }
  get 錬金レシピ() { return this.#錬金レシピマネージャー; }

  static データベースから読み込む(名前, コールバック) {
    データベース操作.プレイヤーを読み込む(名前, コールバック);
  }

  static JSONから(サーバー, json) {
    const データ = JSON.parse(json);
    return new メンバー(サーバー, JSON);
  }

  toJSON() {

  }

  _ID;
  _ギルド;
  _性別;
  _最終ログイン日時;
  _現在地名;
  _家のユーザー名;
  _壁紙;
  #現在地;

  /**
   * @type {アイテム倉庫}
   */
  #アイテム倉庫;
  /**
   * @type {モンスター倉庫}
   */
  #モンスター倉庫;
  /**
   * @type { ログ書き込み君 }
   */
  #軌跡;
  /**
   * @type { プレイヤー錬金レシピマネージャー }
   */
  #錬金レシピマネージャー;
  /**
   * @type {装備スロットマネージャー} 
   */
  #装備マネージャー;

  /**
   * @type {number}
   */
  _レベル;
  /**
   * @type {number}
   */
  _経験値;

  /**
   * @type {import("./MemberJob.js").メンバーの職業}
   */
  _現職;
  _前職;
  _転職回数;
  /**
   * @type {通貨}
   */
  _所持金;
  /**
   * @type {通貨}
   */
  _カジノコイン;
  /**
   * @type {通貨}
   */
  _小さなメダル;
  /**
   * @type {通貨}
   */
  _福引券;
  /**
   * @type {通貨}
   */
  _レアポイント;
  _疲労;
  _オーブフラグ;
  _預かり所が空き;
  _宝を取得済み;
  _飲食済み;
  _ダンジョンイベント;
  _起床時刻;

  #プレイヤー一覧用出力() {
    const
      tr = document.createElement("tr"),
      項目名リスト = new Set(["_性別", "_ギルド", "_レベル", "_転職回数", "_現職", "_前職", "_ステータス", "_所持金", "_カジノコイン", "_小さなメダル", "_武器", "_防具", "_道具", "_実績"]),
      数値 = new Set(["_レベル", "_転職回数", "_ステータス", "_実績"]);
    const td = document.createElement("td");
    td.innerHTML = `<a href="../player.cgi?id=$dir_name">${this._名前}</a><img src="../$icondir/${this._アイコン}" />`;
    tr.appendChild(td);
    for (const 項目名 of 項目名リスト) {
      if (this[項目名].プレイヤー一覧用出力) {
        const fragment = document.createDocumentFragment();
        for (const 出力 of this[項目名].プレイヤー一覧用出力()) {
          const td = document.createElement("td");
          td.textContent = 出力;
          if (数値.has(項目名))
            td.classList.add("数値");
          fragment.appendChild(td);
        }
        tr.appendChild(fragment);
      }
      else {
        const td = document.createElement("td");
        td.textContent = this[項目名];
        if (数値.has(項目名))
          td.classList.add("数値");
      }
      tr.appendChild(td);
    }
    const td2 = document.createElement("td");
    td2.textContent = this._最終ログイン日時;
    tr.appendChild(td2);
    return tr;
  }

  #現在地を設定(場所) {
    this.#現在地 = 場所 ?? 場所.一覧("交流広場");
    this._現在地名 = this.#現在地.名前;
  }

  #現在地のキャラクターから消去() {
    // 放置で自動消去されたなら何もしない
    if (this._場所別ID === undefined) {
      return;
    }
    データベース操作.場所別キャラクター一覧から削除(this.#現在地.ログ名, [this._場所別ID]);
    this._場所別ID = undefined;
  }

  #自動削除対象なら削除() {
    if (this._最終ログイン日時
      + ((this.転職回数 === 0 && this.レベル < 2) ? 新規プレイヤー自動削除日数 : プレイヤー自動削除日数) * 60 * 60 * 24
      >= 更新日時.取得()) {
      return false;
    }
    this.削除();
    return true;
  }
}