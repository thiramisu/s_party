// @ts-check
"use strict";

import { 交換所 } from "./Shop.js"
import { 場所 } from "./Place.js";
import { キャラクター } from "../character/Character.js";

export class 闇市場 extends 交換所 {
  constructor(サーバー, チャンネル) {
    super(サーバー, チャンネル, 場所._訪問方法.特殊,
      道具, 1, "どれと取引するんだ…？", "レアポイント不足だ…", "とりひき", [
      new 裏取引アイテム("時の砂", 1),
      new 裏取引アイテム("ﾌｧｲﾄ一発", 4),
      ...[...アイテム.範囲("ｼﾙﾊﾞｰｵｰﾌﾞ", "ﾊﾟｰﾌﾟﾙｵｰﾌﾞ")].map((アイテム) =>
        new 裏取引アイテム(アイテム.名前, 2)
      )
    ]);
    const ささげる = new こうどう("ささげる", this._ささげる.bind(this), undefined, this._ささげるクリック時.bind(this));
    this._こうどうリストリスト[0].こうどう追加(ささげる);
  }

  ヘッダー出力(プレイヤー) {
    return `${super._ヘッダー用出力()}レアポイント **${プレイヤー._レアポイント.所持}**ポイント${プレイヤー.ヘッダー用装備出力()}`;
  }

  get 背景画像() { return "none.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@闇商人", "chr/025.gif"); }
  get 移動可能() { return false; }

  _はなす() {
    super._はなす(
      "よく来たな…。ここは闇市場だ…",
      "表の世界では手に入れられない物を取引している…",
      "物の取引は金では買えないもの…。つまり、魂…ｺﾞﾎｯｺﾞﾎｯ…ではなく、レアアイテムだ…",
      "お前の魂…ではなく、お前が装備しているレアアイテムをささげろ…",
      "レアアイテムをささげることによって…お前のレアポイントが増える…",
      "レアポイントにより取引できるアイテムが違う…"
    );
  }

  _NPCをしらべる() {
    super._NPCをしらべる("…お前の魂で取引したいのか？");
  }

  _ささげる(プレイヤー, 対象) {
    if (!対象) {
      const 出力 = プレイヤー.装備.こうどう用出力("ささげる");
      通知欄.追加((出力.childElementCount === 0) ? "ささげるものを装備して来い…" : 出力);
      return;
    }
    if (!プレイヤー.が装備中(対象)) {
      通知欄.追加("ささげるものを装備して来い…");
      return;
    }
    if (!闇市場.#レアアイテム名一覧.has(対象)) {
      this.NPCに話させる(`…${対象}…か…。ダメだな…。そのアイテムは…めずらしくない…`);
      return;
    }
    プレイヤー._レアポイント.収支(1);
    this.NPCに話させる(`…${対象}…か…。レアだな…。いいだろう…。お前のレアポイントを加算しておこう…`);
    プレイヤー.装備アイテムを売る(対象, 0);
  }

  _かう(対象) {
    super._かう(対象, プレイヤー._レアポイント);
  }

  static 初期化() {
    闇市場.#レアアイテム名一覧 = new Set([
      "隼の剣", "奇跡の剣", ...アイテム.名前範囲("ｶﾞｲｱの剣", "ﾊｸﾞﾚﾒﾀﾙの剣"),
      ...アイテム.名前範囲("神秘の鎧", "ﾊｸﾞﾚﾒﾀﾙの鎧"),
      "勇者の証", "邪神像", "ｼﾞｪﾉﾊﾞ細胞", ...アイテム.名前範囲("ﾌｧｲﾄ一発", "天空の盾と兜"), "時の砂", ...アイテム.名前範囲("次元のｶｹﾗ", "宝物庫の鍵"), "ｲﾝﾃﾘﾒｶﾞﾈ"
    ]);
  }

  _倉庫送信時の会話内容を取得(アイテム) { return `取引成立だ…。${アイテム.名前} はお前の預かり所に送っておいた…`; }

  static #レアアイテム名一覧;
  static #取引アイテム一覧;
}