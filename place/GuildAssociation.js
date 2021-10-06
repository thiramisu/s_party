// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js";
import { キャラクター } from "../character/Character.js";
import { PlaceActionCommand } from "../command/PlaceActionCommand.js";
import { PlaceCommandGroup } from "../command/PlaceCommandGroup.js";
import { 色名 } from "../config.js";

/**
 * @typedef {import("../character/Member.js").メンバー} プレイヤー
 */

export class ギルド協会 extends 一般的な場所 {
  // TODO いちらん
  // TODO だったい以外でギルドが無くなっていた場合の処理

  さんか(プレイヤー, ギルド名) {
    if (プレイヤー.ギルド !== undefined) {
      通知欄.追加(`${プレイヤー.ギルド.名前}に参加しています。他のギルドに参加したい場合は、今のギルドを脱退してください。`);
      return;
    }
    const ギルド = プレイヤー.サーバー.ギルド.取得(ギルド名);
    if (ギルド === undefined) {
      通知欄.追加(
        "どのギルドに参加しますか？",
        `<span onclick="text_set('＠さんか>$gname ')">$gname</span> / `
      );
      return;
    }
    if (ギルド.参加申請中.has(プレイヤー)) {
      通知欄.追加(`${ギルド.名前}にはすでに参加申請を出しています`);
      return;
    }
    const ギルマス = ギルド.ギルマス;
    ギルマス.手紙を送る(`【＋参加申請＋】${ギルド.名前} 入団希望者 ${プレイヤー.名前}`);
    this.NPCに話させる(`${ギルド.名前}のギルマス ${ギルマス.名前} に参加申請の手紙を送りました。ギルマスからの返事を待ちましょう`);
  }

  async つくる(プレイヤー, ギルド名) {
    if (プレイヤー.ギルド !== undefined) {
      通知欄.追加(`${プレイヤー.ギルド.名前}に参加しています。新規にギルドを設立する場合は、今のギルドを脱退してください。`);
      return;
    }
    if (ギルド名 === undefined) {
      通知欄.追加(
        `設立金として $make_money Gかかります。`,
        `＠つくる>○○○ ○○○にはギルド名をいれてください(最大全角$max_guild_name_z文字[半角$max_guild_name文字]まで)`
      );
      return;
    }
    const ギルド = await this.サーバー.ギルド.設立(ギルド名);
    if (typeof ギルド === "string") {
      通知欄.追加(ギルド);
    }
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {string} マーク名
   */
  まーく(プレイヤー, マーク名) {
    if (this.#チェック(プレイヤー, ギルド協会.#ギルドマーク変更手数料, "ギルドマークを変更できるのは、ギルドマスターだけです", `ギルドマークを変更するのに **${ギルド協会.#ギルドマーク変更手数料}** G必要です`)) {
      return;
    }
    const
      ギルド = プレイヤー.ギルド,
      対象マーク = ギルドマーク.取得(マーク名);
    if (対象マーク === null) {
      通知欄.追加(`ギルドマークの変更には ${ギルド協会.#ギルドマーク変更手数料} Gかかります。どのギルドマークにしますか？<br />$p`);
      $p += `<span onclick="text_set('＠まーく>$no ')"><img src="$icondir/mark/$file_name" title="$no" /></span>`;
      return;
    }
    プレイヤー.ギルド.マーク変更(対象マーク);
    this.NPCに話させる(`${ギルド.名前}のギルドマークを <img src="$icondir/mark/$file_name" /> に変更しました`);
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {string} 壁紙名
   */
  かべがみ(プレイヤー, 壁紙名) {
    const 対象壁紙 = 壁紙.取得(壁紙名);
    if (this.#チェック(プレイヤー, 対象壁紙?.価値 ?? 0, "壁紙を変更できるのは、ギルドマスターだけです", "お金が足りません")) {
      return;
    }
    if (対象壁紙 === null) {
      "どの壁紙にしますか？"
      return;
    }
    プレイヤー.ギルド.壁紙を設定(対象壁紙);
    this.NPCに話させる(`$m{guild}の壁紙を ${壁紙.名前} に変更しました`);
  }

  /**
   * @param {プレイヤー} プレイヤー
   */
  だったい(プレイヤー) {
    const ギルド = プレイヤー.ギルド;
    if (ギルド === undefined) {
      通知欄.追加("ギルドに所属していません");
      return;
    }
    プレイヤー.軌跡.書き込む(`${ギルド.名前}から脱退する`);
    this.NPCに話させる(`${ギルド.名前}から脱退しました`);
    ギルド.メンバー削除(プレイヤー);
    プレイヤー.ギルド = undefined;
  }

  /**
   * @param {プレイヤー} プレイヤー
   */
  かいさん(プレイヤー) {
    const ギルド = プレイヤー.ギルド;
    if (ギルド === undefined) {
      通知欄.追加("ギルドに所属していません");
      return;
    }
    if (ギルド.ギルマス !== プレイヤー) {
      通知欄.追加("解散させることができるのはギルマスだけです");
      return;
    }
    ギルド.解散();
    プレイヤー.軌跡.書き込む(`${ギルド.名前}を解散させる`);
    this.NPCに話させる(`${ギルド.名前}を解散させました`);
    プレイヤー.ギルド = undefined;
  }

  get 背景画像() { return "join_guild.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@支配人", "chr/007.gif"); }

  _はなす() {
    super._はなす(
      "$auto_delete_guild_day 日以上「＠ぎるど」による出入りがない場合は、自動的に削除となります",
      "ギルドとは、気が合うメンバーの集まりです",
      "ギルド名は、途中で変えることができませんので、じっくり考えてください",
      "ギルマスとは、ギルドマスターの略称です。そのギルド内で一番の権限があります",
      "ギルマスは、メンバーに役職名をあたえることができるのです",
      "ギルドマークや壁紙は、お金がかかりますが何度でも変えることが可能です",
      "ギルド参加者は、ギルド戦ができるようになります",
      `ギルドを新しく作るには、${ギルド協会.#ギルド設立手数料} G必要です`,
      `ギルドマークを変更するには、${ギルド協会.#ギルドマーク変更手数料} G必要です`,
      "ギルド戦で優勝すると勝利メダルがギルド内に飾られていきます"
    );
  }

  static #ギルド設立手数料 = 3000;
  static #ギルドマーク変更手数料 = 3000;
  static #最大ギルド名文字数 = 16;

  static get コマンド() { return this.#コマンド ?? this.#コマンドを登録(); }

  static #コマンドを登録() {
    this.#コマンド = new PlaceCommandGroup("assosiation", "ギルド協会");

    this.#コマンド.追加(
      new PlaceActionCommand("join", this.prototype.さんか)
        .引数追加("STRING", "name", "名前", false),
      new PlaceActionCommand("create", this.prototype.つくる)
        .引数追加("STRING", "name", "名前", false),
      new PlaceActionCommand("mark", this.prototype.まーく),
      new PlaceActionCommand("wallpaper", this.prototype.かべがみ),
      new PlaceActionCommand("rename", this.prototype.かいめい),
      new PlaceActionCommand("leave", this.prototype.だったい),
      new PlaceActionCommand("disolve", this.prototype.かいさん),
    );
    return this.#コマンド;
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {number} 必要金額
   * @param {string} ギルドマスターでない時
   * @param {string} 所持金が足りない時
   * @returns {boolean}
   */
  #チェック(プレイヤー, 必要金額, ギルドマスターでない時, 所持金が足りない時) {
    const ギルド = プレイヤー.ギルド;
    try {
      if (ギルド === undefined)
        throw "ギルドに所属していません";
      if (!this.サーバー.ギルド.存在する(ギルド.名前)) {
        プレイヤー.ギルド = undefined;
        throw `${ギルド.名前}ギルドが存在しません`;
      }
      if (ギルド.ギルマスID !== プレイヤー.ID)
        throw ギルドマスターでない時;
      if (!プレイヤー.所持金.収支(-必要金額))
        throw 所持金が足りない時;
    } catch (エラー) {
      通知欄.通知(エラー);
      return true;
    }
    return false;
  }

  /**
   * @type {PlaceCommandGroup}
   */
  static #コマンド;
}