// @ts-check
"use strict";

import { メンバー } from "./Character.js";
import { 転職可能な職業 } from "./Job.js";
import { ステータス } from "./Status.js";
import { 基底 } from "../Base.js";
import { 色名 } from "../config.js";
import { Spreadsheet } from "../SpreadSheet.js";
import { 整数乱数, 空文字列 } from "../Util.js";

/**
 * @typedef {import("discord.js").Snowflake} プレイヤーID
 */

const プレイヤー一覧の更新周期日数 = Infinity;

export class プレイヤーマネージャー extends 基底 {
  /**
   * @param {import("../Server.js").サーバー} サーバー
   */
  constructor(サーバー) {
    super(サーバー);
    this.#一覧 = new Map();
  }

  /**
   * @param {import("discord.js").GuildMember} サーバーメンバー
   * @param {} _職業名
   * @param {} _性別
   */
  新規登録(サーバーメンバー, _職業名, _性別) {
    if (this.#登録チェック(_職業名, _性別))
      return;
    const
      _ステータス = new ステータス(
        整数乱数(32, 30, true),
        整数乱数(8, 6, true),
        整数乱数(8, 6, true),
        整数乱数(8, 6, true),
        整数乱数(8, 6, true)
      ),
      _メンバー = new メンバー(this.サーバー, {
        id: サーバーメンバー.id,
        _現職: {
          _職業名,
          _SP: 0
        },
        _所持金: {
          _所持: 200
        },
        _色: "#FFFFFF",
        _性別: _性別 === "f" ? "女" : "男",
        _現在地名: "交流広場",
        _転職回数: 0,
        _レベル: 1,
        _アイコン: 転職可能な職業.一覧(_職業名).アイコン名を取得(_性別),
        _ステータス
      }),
      名前 = サーバーメンバー.displayName;
    this.サーバー.ニュース.書き込む(`${名前} という冒険者が参加しました`, 色名.強調);
    _メンバー.軌跡.書き込む(`冒険者 ${名前} 誕生！`, 色名.強調); // 部分強調
    return _メンバー;
  }

  /**
   * 
   * @param {プレイヤーID} プレイヤーID 
   * @returns {Promise<?メンバー>} 取得できなかったなら`null`
   */
  async 取得(プレイヤーID, サーバーから取得する = false) {
    if (this.#一覧.has(プレイヤーID)) {
      return this.#一覧.get(プレイヤーID);
    }
    if (!サーバーから取得する) {
      return null;
    }
    const json = await Spreadsheet.searchPlayer(this.サーバー.guild.id, プレイヤーID);
    if (typeof json !== "string") {
      this.#一覧.set(プレイヤーID, null);
      return null;
    }
    const 追加メンバー = メンバー.JSONから(this.サーバー, json);
    this.#一覧.set(プレイヤーID, 追加メンバー);
    return 追加メンバー;
  }

  保存(プレイヤー) {

  }

  削除(プレイヤー) {

  }

  必要ならプレイヤー削除と一覧更新() {
    const 現在日時 = 更新日時.取得();
    if (セーブデータ.プレイヤー一覧更新日時.取得() + プレイヤー一覧の更新周期日数 * 60 * 60 * 24 > 現在日時)
      return;
    const tBody = document.createElement("tbody");
    実績.ランキング作成開始();
    /* TODO cursor化
    for (const _メンバー of メンバー.#一覧) {
      //_メンバー.データ破損チェック(バックアップがあれば復旧); 破損していなければバックアップへ;
      if (_メンバー.#自動削除対象なら削除()) {
        continue;
      }
      実績.ランキング判定1(_メンバー);
      tBody.appendChild(_メンバー.#プレイヤー一覧用出力());
    }
    実績.ランキング作成開始2();
    for (const _メンバー of メンバー.#一覧) {
      実績.ランキング判定2(_メンバー);
    }
    //*/
    実績.ランキング出力();
    this.サーバー.プレイヤー一覧.書き込む(tBody);
    this.サーバー.プレイヤー一覧更新日時.保存(現在日時);
  }

  #登録チェック(職業名, 性別) {
    try {
      if (性別 === 空文字列)
        throw "性別が入力されていません";
      if (性別 !== "f" && 性別 !== "m")
        throw "性別が異常です";

      if (!初期職業.has(職業名))
        throw "職業が異常です";
      if (this.サーバー.登録者数 >= 最大登録人数)
        throw "現在定員のため、新規登録は受け付けておりません";
    }
    catch (エラー内容) {
      エラー.表示(エラー内容);
      return true;
    }
    return false;
  }

  /**
   * @type {Map<プレイヤーID, ?メンバー>}
   */
  #一覧;
}