// @ts-check
"use strict";

import { 陳列可能インターフェース } from "./ItemInterface.js";
import { ランダムな1要素 } from "../Util.js";


export class 錬金レシピ extends 陳列可能インターフェース {
  constructor(素材1, 素材2, 完成品) {
    super();
    this.#素材1 = 素材1;
    this.#素材2 = 素材2;
    this.#完成品 = 完成品;
    this.#習得難易度 = 錬金レシピ.#難易度別の素材1.findIndex((セット) => セット.has(素材1));
    if (this.#習得難易度 === -1) {
      this.#習得難易度 = Infinity;
    }
  }

  _陳列用出力(完成品を表示する = true) {
    return super._陳列用出力([
      this.素材1,
      `×${this.素材2}`,
      `＝${完成品を表示する ? this.#完成品 : "？？？"}`
    ], `＠れんきん>${this.素材1}＠そざい>${this.素材2} `);
  }

  get 素材1() { return this.#素材1; }
  get 素材2() { return this.#素材2; }
  get 完成品() { return this.#完成品; }
  
  static 習得(習得済み錬金レシピ一覧, 難易度 = Infinity) {
    // 原作に忠実な実装
    const 習得レシピ = ランダムな1要素(ランダムな1要素(
      Array.from(錬金レシピ.#一覧, ([素材1, 錬金レシピリスト]) =>
        Array.from(錬金レシピリスト, ([素材2, 錬金レシピ]) =>
          (習得済み錬金レシピ一覧.get(素材1)?.get(素材2) || (難易度 !== Infinity && 錬金レシピ.#習得難易度 !== 難易度)) ? undefined : 錬金レシピ
          , 錬金レシピ).filter((素材2) => 素材2 !== undefined)
      ).filter((習得レシピ候補リスト) => 習得レシピ候補リスト.length !== 0)
    ));
    あなた.メンバー.データベースに錬金レシピを保存(習得レシピ);
  }

  static 初期化() {
    [
      new 錬金レシピ("薬草", "薬草", "上薬草"),
      new 錬金レシピ("薬草", "爆弾石", "ﾄﾞﾗｺﾞﾝ草"),
      new 錬金レシピ("上薬草", "上薬草", "特薬草"),
      new 錬金レシピ("特薬草", "命の木の実", "世界樹の葉"),
      new 錬金レシピ("毒消し草", "満月草", "ﾊﾟﾃﾞｷｱの根っこ"),
      new 錬金レシピ("世界樹の葉", "魔法の聖水", "世界樹のしずく"),
      new 錬金レシピ("魔法の聖水", "世界樹のしずく", "ｴﾙﾌの飲み薬"),
      new 錬金レシピ("幸せの種", "聖者の灰", "ｽｷﾙの種"),
      new 錬金レシピ("幸せの帽子", "幸せの種", "幸せのくつ"),
      new 錬金レシピ("幸せの帽子", "幸せのくつ", "幸福袋"),
      new 錬金レシピ("幸せのくつ", "幸せの種", "幸せの帽子"),
      new 錬金レシピ("ｽｷﾙの種", "魔法の粉", "幸せの種"),
      new 錬金レシピ("ｷﾒﾗの翼", "幸せのくつ", "宝物庫の鍵"),
      new 錬金レシピ("身代わり人形", "守りの石", "身代わり石像"),
      new 錬金レシピ("身代わり石像", "守りのﾙﾋﾞｰ", "上薬草"),
      new 錬金レシピ("魔法の粉", "馬のﾌﾝ", "悪魔の粉"),
      new 錬金レシピ("金の鶏", "魔物のｴｻ", "金塊"),
      new 錬金レシピ("魔獣の皮", "幸せの種", "福袋"),
      new 錬金レシピ("竜のｳﾛｺ", "皮の腰巻", "魔獣の皮"),
      new 錬金レシピ("銀のたてごと", "魔法の聖水", "魔除けの聖印"),
      new 錬金レシピ("ﾓﾝｽﾀｰ銅貨", "ﾓﾝｽﾀｰ銅貨", "ﾓﾝｽﾀｰ銀貨"),
      new 錬金レシピ("ﾓﾝｽﾀｰ銀貨", "ﾓﾝｽﾀｰ銀貨", "ﾓﾝｽﾀｰ金貨"),
      new 錬金レシピ("ﾓﾝｽﾀｰ金貨", "ﾓﾝｽﾀｰ金貨", "小さなﾒﾀﾞﾙ"),
      new 錬金レシピ("祈りの指輪", "金塊", "金の指輪"),
      new 錬金レシピ("金の指輪", "命の木の実", "命の指輪"),
      new 錬金レシピ("金の指輪", "不思議な木の実", "祈りの指輪"),
      new 錬金レシピ("金の指輪", "力の種", "上薬草"),
      new 錬金レシピ("金の指輪", "守りの種", "守りのﾙﾋﾞｰ"),
      new 錬金レシピ("金の指輪", "素早さの種", "はやてのﾘﾝｸﾞ"),
      new 錬金レシピ("金の指輪", "金の指輪", "金のﾌﾞﾚｽﾚｯﾄ"),
      new 錬金レシピ("金の指輪", "死者の骨", "ﾄﾞｸﾛの指輪"),
      new 錬金レシピ("闇のﾛｻﾞﾘｵ", "聖者の灰", "金のﾛｻﾞﾘｵ"),
      new 錬金レシピ("金のﾌﾞﾚｽﾚｯﾄ", "命の指輪", "命のﾌﾞﾚｽﾚｯﾄ"),
      new 錬金レシピ("力の指輪", "力の指輪", "ごうけつの腕輪"),
      new 錬金レシピ("はやてのﾘﾝｸﾞ", "はやてのﾘﾝｸﾞ", "ほしふる腕輪"),
      new 錬金レシピ("ごうけつの腕輪", "ほしふる腕輪", "ｱﾙｺﾞﾝﾘﾝｸﾞ"),
      new 錬金レシピ("ごうけつの腕輪", "爆弾石", "ﾒｶﾞﾝﾃの腕輪"),
      new 錬金レシピ("ごうけつの腕輪", "金塊", "怒りのﾀﾄｩｰ"),
      new 錬金レシピ("ｿｰｻﾘｰﾘﾝｸﾞ", "悪魔のしっぽ", "ﾄﾞｸﾛの指輪"),
      new 錬金レシピ("ﾄﾞｸﾛの指輪", "聖者の灰", "ｿｰｻﾘｰﾘﾝｸﾞ"),

      new 錬金レシピ("ひのきの棒", "ﾀﾞｶﾞｰﾅｲﾌ", "鉄の槍"),
      new 錬金レシピ("ひのきの棒", "鉄の槍", "ﾛﾝｸﾞｽﾋﾟｱ"),
      new 錬金レシピ("こんぼう", "ﾁｪｰﾝｸﾛｽ", "ﾓｰﾆﾝｸﾞｽﾀｰ"),
      new 錬金レシピ("ﾌﾞﾛﾝｽﾞﾅｲﾌ", "ﾌﾞﾛﾝｽﾞﾅｲﾌ", "銅の剣"),
      new 錬金レシピ("ﾌﾞﾛﾝｽﾞﾅｲﾌ", "聖者の灰", "聖なるﾅｲﾌ"),
      new 錬金レシピ("ﾀﾞｶﾞｰﾅｲﾌ", "どくばり", "ｱｻｼﾝﾀﾞｶﾞｰ"),
      new 錬金レシピ("ｿﾞﾝﾋﾞｷﾗｰ", "魔除けの聖印", "ｿﾞﾝﾋﾞﾊﾞｽﾀｰ"),
      new 錬金レシピ("ﾙｰﾝｽﾀｯﾌ", "ﾗｲﾄｱｰﾏｰ", "ﾗｲﾄｼｬﾑｰﾙ"),
      new 錬金レシピ("ﾛﾝｸﾞｽﾋﾟｱ", "聖なるﾅｲﾌ", "ﾎｰﾘｰﾗﾝｽ"),
      new 錬金レシピ("ﾛﾝｸﾞｽﾋﾟｱ", "悪魔のしっぽ", "ﾊﾞﾄﾙﾌｫｰｸ"),
      new 錬金レシピ("ﾊﾞﾄﾙﾌｫｰｸ", "どくばり", "ﾃﾞｰﾓﾝｽﾋﾟｱ"),
      new 錬金レシピ("ﾎｰﾘｰﾗﾝｽ", "悪魔のしっぽ", "ﾃﾞｰﾓﾝｽﾋﾟｱ"),
      new 錬金レシピ("ﾓｰﾆﾝｸﾞｽﾀｰ", "ﾄﾞﾗｺﾞﾝｷﾗｰ", "ﾄﾞﾗｺﾞﾝﾃｲﾙ"),
      new 錬金レシピ("鋼鉄の剣", "金塊", "ﾌﾟﾗﾁﾅｿｰﾄﾞ"),
      new 錬金レシピ("鋼鉄の剣", "馬のﾌﾝ", "古びた剣"),
      new 錬金レシピ("ｽﾗｲﾑﾋﾟｱｽ", "はやてのﾘﾝｸﾞ", "ｷﾗｰﾋﾟｱｽ"),
      new 錬金レシピ("理力の杖", "ﾄﾞﾗｺﾞﾝ草", "ﾄﾞﾗｺﾞﾝの杖"),
      new 錬金レシピ("ｸｻﾅｷﾞの剣", "聖者の灰", "ﾊﾞｽﾀｰﾄﾞｿｰﾄﾞ"),
      new 錬金レシピ("ﾊﾞｽﾀｰﾄﾞｿｰﾄﾞ", "氷の刃", "吹雪の剣"),
      new 錬金レシピ("ﾊﾞｽﾀｰﾄﾞｿｰﾄﾞ", "妖精の笛", "妖精の剣"),
      new 錬金レシピ("銅の剣", "魔除けの聖印", "聖銀のﾚｲﾋﾟｱ"),
      new 錬金レシピ("銅の剣", "馬のﾌﾝ", "古びた剣"),
      new 錬金レシピ("聖銀のﾚｲﾋﾟｱ", "悪魔のしっぽ", "堕天使のﾚｲﾋﾟｱ"),
      new 錬金レシピ("堕天使のﾚｲﾋﾟｱ", "はやてのﾘﾝｸﾞ", "疾風のﾚｲﾋﾟｱ"),
      new 錬金レシピ("鎖がま", "鎖がま", "鉄の斧"),
      new 錬金レシピ("鉄の斧", "鉄の斧", "ﾊﾞﾄﾙｱｯｸｽ"),
      new 錬金レシピ("鉄の斧", "金塊", "金の斧"),
      new 錬金レシピ("ﾊﾞﾄﾙｱｯｸｽ", "盗賊の衣", "山賊の斧"),
      new 錬金レシピ("山賊の斧", "王者のﾏﾝﾄ", "覇王の斧"),
      new 錬金レシピ("おおきづち", "鉄の斧", "おおかなづち"),
      new 錬金レシピ("ｳｫｰﾊﾝﾏｰ", "ごうけつの腕輪", "ｳｫｰﾊﾝﾏｰ･改"),
      new 錬金レシピ("ｳｫｰﾊﾝﾏｰ･改", "覇王の斧", "ﾒｶﾞﾄﾝﾊﾝﾏｰ"),
      new 錬金レシピ("隼の剣", "ほしふる腕輪", "隼の剣･改"),
      new 錬金レシピ("諸刃の剣", "聖者の灰", "諸刃の剣･改"),
      new 錬金レシピ("諸刃の剣", "魔除けの聖印", "氷の刃"),
      new 錬金レシピ("奇跡の剣", "命のﾌﾞﾚｽﾚｯﾄ", "奇跡の剣･改"),
      new 錬金レシピ("古びた剣", "ｵﾘﾊﾙｺﾝ", "ﾊｸﾞﾚﾒﾀﾙの剣"),
      new 錬金レシピ("ﾊｸﾞﾚﾒﾀﾙの剣", "ｽﾗｲﾑの冠", "ﾒﾀﾙｷﾝｸﾞの剣"),
      new 錬金レシピ("ﾒﾀﾙｷﾝｸﾞの剣", "ﾛﾄの印", "ﾛﾄの剣"),
      new 錬金レシピ("ﾄﾞﾗｺﾞﾝｷﾗｰ", "ごうけつの腕輪", "ﾄﾞﾗｺﾞﾝｽﾚｲﾔｰ"),
      new 錬金レシピ("ﾄﾞﾗｺﾞﾝｽﾚｲﾔｰ", "ｵﾘﾊﾙｺﾝ", "竜神の剣"),
      new 錬金レシピ("竜神の剣", "ﾊｸﾞﾚﾒﾀﾙの剣", "竜神王の剣"),

      new 錬金レシピ("布の服", "布の服", "旅人の服"),
      new 錬金レシピ("旅人の服", "魔獣の皮", "皮の鎧"),
      new 錬金レシピ("旅人の服", "騎士団の衣装", "騎士団の服"),
      new 錬金レシピ("旅人の服", "ﾁｪｰﾝｸﾛｽ", "鎖かたびら"),
      new 錬金レシピ("皮の鎧", "竜のｳﾛｺ", "うろこの鎧"),
      new 錬金レシピ("鎖かたびら", "銅の剣", "青銅の鎧"),
      new 錬金レシピ("鉄の鎧", "銀のたてごと", "ｼﾙﾊﾞｰﾒｲﾙ"),
      new 錬金レシピ("鉄の鎧", "馬のﾌﾝ", "古びた鎧"),
      new 錬金レシピ("鋼鉄の鎧", "諸刃の剣", "刃の鎧"),
      new 錬金レシピ("鋼鉄の鎧", "馬のﾌﾝ", "古びた鎧"),
      new 錬金レシピ("鋼鉄の鎧", "魔獣の皮", "あつでの鎧"),
      new 錬金レシピ("銀の胸当て", "金塊", "金の胸当て"),
      new 錬金レシピ("さまよう鎧", "魔除けの聖印", "ﾗｲﾄｱｰﾏｰ"),
      new 錬金レシピ("ｼﾙﾊﾞｰﾒｲﾙ", "ｿﾞﾝﾋﾞｷﾗｰ", "ｿﾞﾝﾋﾞﾒｲﾙ"),
      new 錬金レシピ("ｼﾙﾊﾞｰﾒｲﾙ", "魔獣の皮", "ﾄﾞﾗｺﾞﾝﾒｲﾙ"),
      new 錬金レシピ("ｿﾞﾝﾋﾞﾒｲﾙ", "聖者の灰", "ﾌﾟﾗﾁﾅﾒｲﾙ"),
      new 錬金レシピ("魔法の法衣", "聖者の灰", "賢者のﾛｰﾌﾞ"),
      new 錬金レシピ("賢者のﾛｰﾌﾞ", "炎の鎧", "紅蓮のﾛｰﾌﾞ"),
      new 錬金レシピ("光の鎧", "危ない水着", "神秘の鎧"),
      new 錬金レシピ("毛皮のﾏﾝﾄ", "はやてのﾘﾝｸﾞ", "盗賊の衣"),
      new 錬金レシピ("魔人の鎧", "ごうけつの腕輪", "ｷﾞｶﾞﾝﾄｱｰﾏｰ"),
      new 錬金レシピ("古びた鎧", "ｵﾘﾊﾙｺﾝ", "ﾊｸﾞﾚﾒﾀﾙの鎧"),
      new 錬金レシピ("ﾊｸﾞﾚﾒﾀﾙの鎧", "ｽﾗｲﾑの冠", "ﾒﾀﾙｷﾝｸﾞの鎧"),
      new 錬金レシピ("ﾒﾀﾙｷﾝｸﾞの鎧", "ﾛﾄの印", "ﾛﾄの鎧"),
      new 錬金レシピ("ﾄﾞﾗｺﾞﾝﾒｲﾙ", "ごうけつの腕輪", "ﾄﾞﾗｺﾞﾝｱｰﾏｰ"),
      new 錬金レシピ("ﾄﾞﾗｺﾞﾝｱｰﾏｰ", "ｵﾘﾊﾙｺﾝ", "竜神の鎧"),
      new 錬金レシピ("竜神の鎧", "ﾊｸﾞﾚﾒﾀﾙの鎧", "竜神王の鎧"),
    ].forEach(錬金レシピ.#一覧作成);
  }

  static 一覧(素材1, 素材2) {
    return this.#一覧.get(素材1)?.get(素材2);
  }

  static _陳列用ヘッダー項目名リスト = undefined;

  static #一覧作成(_錬金レシピ) {
    const
      新規作成する = !錬金レシピ.#一覧.has(_錬金レシピ._素材1),
      map = 新規作成する ? new Map() : 錬金レシピ.#一覧.get(_錬金レシピ._素材1);
    if (新規作成する) {
      錬金レシピ.#一覧.set(_錬金レシピ._素材1, map);
    }
    map.set(_錬金レシピ._素材2, _錬金レシピ);
  }

  #習得難易度;
  #素材1;
  #素材2;
  #完成品;

  static #一覧 = new Map();
  static #難易度別の素材1 = Object.freeze([
    new Set([
      "薬草", "上薬草", "特薬草", "毒消し草", "身代わり人形", "竜のｳﾛｺ", "ﾓﾝｽﾀｰ銅貨", "ﾓﾝｽﾀｰ銀貨", "闇のﾛｻﾞﾘｵ",
      "魔獣の皮", "祈りの指輪", "金の指輪", "ひのきの棒", "こんぼう", "ﾌﾞﾛﾝｽﾞﾅｲﾌ", "ﾀﾞｶﾞｰﾅｲﾌ", "ﾙｰﾝｽﾀｯﾌ", "ﾛﾝｸﾞｽﾋﾟｱ", "ｸｻﾅｷﾞの剣",
      "銅の剣", "聖銀のﾚｲﾋﾟｱ", "鎖がま", "鉄の斧", "金の斧", "おおきづち", "布の服", "旅人の服", "皮の鎧", "鎖かたびら",
      "鉄の鎧", "鋼鉄の鎧", "さまよう鎧", "ｿﾞﾝﾋﾞﾒｲﾙ", "魔法の法衣"
    ]),
    new Set([
      "世界樹の葉", "魔法の聖水", "幸せの種", "ｽｷﾙの種", "身代わり石像", "銀のたてごと", "魔法の粉", "悪魔の粉", "金の鶏", "ﾓﾝｽﾀｰ金貨",
      "金のﾌﾞﾚｽﾚｯﾄ", "怒りのﾀﾄｩｰ", "ｿｰｻﾘｰﾘﾝｸﾞ", "ｿﾞﾝﾋﾞｷﾗｰ", "ﾊﾞﾄﾙﾌｫｰｸ", "ﾎｰﾘｰﾗﾝｽ", "ﾓｰﾆﾝｸﾞｽﾀｰ", "鋼鉄の剣", "ｽﾗｲﾑﾋﾟｱｽ", "理力の杖",
      "ﾊﾞｽﾀｰﾄﾞｿｰﾄﾞ", "堕天使のﾚｲﾋﾟｱ", "ﾊﾞﾄﾙｱｯｸｽ", "山賊の斧", "銀の胸当て", "みかわしの服", "ｼﾙﾊﾞｰﾒｲﾙ", "賢者のﾛｰﾌﾞ", "毛皮のﾏﾝﾄ", "魔人の鎧"
    ])
  ]);
}