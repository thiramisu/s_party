"use strict";

import { 専門店 } from "./Shop.js"

export class 防具屋 extends 専門店 {
  constructor() {
    super("armor.gif", 場所._訪問方法.いどう, new キャラクター("@ｱﾏﾉ", "chr/008.gif"),
      防具, 2, "どれを買うッスか？", "残念ながら、お金が足りないッス");
  }

  _はなす() {
    super._はなす(
      "ここは防具屋ッス！防具を装備すればダメージを減らすことができるッス！",
      "素早さがないと攻撃をかわすことができないッス！",
      "素早さに自信がない場合は、ステテコパンツがオススメッス！",
      "強さや重さは１回の戦闘ごとで変わるッス！",
      `${あなた}さんは$arms[$sales[int(rand(@sales))]][1]なんて似合いそうッスね！`,
      "重い鎧でガチガチに固めるか、ヒラヒラの服で回避率を上げるのか、どちらが好きッスか？",
      "いつかあっしもあぶない水着を着るのが夢ッス",
      `${あなた}さんの転職回数は${あなた.メンバー.転職回数}回ッスね！転職回数が多いと熟練者と見なし売れる物が増えるッス！`,
      `${あなた}さんの防御力は${あなた.メンバー.ステータス.守備力}ッスね！。なかなかの固さッスね！`
    );
  }

  _NPCをしらべる() {
    super._NPCをしらべる(`${this._NPC.名前}「な、な、何を見ているッスか！？」`)
  }

  _うる(対象) {
    super._うる(対象, あなた.メンバー._防具);
  }

  _うるクリック時() {
    super._うるクリック時(あなた.メンバー._防具, "売りたい防具がある場合は、装備してきて欲しいッス！");
  }

  _品揃えアイテム名リストを取得() {
    return [...アイテム.名前範囲("布の服", "皮の腰巻", あなた.メンバー.転職回数, "鋼鉄の鎧")];
  }

  _装備時の会話内容を取得(アイテム) { return `お買い上げありがとうッス！${アイテム.名前}どうぞ着てくださいッス`; }
  _倉庫送信時の会話内容を取得(アイテム) { return `お買い上げありがとうッス！${アイテム.名前}は${あなた}さんの預かり所に送っておいたッス！`; }
  _売却確認時の通知内容を取得(アイテム名, 売却価格) { return `${アイテム名}なら ${売却価格} Gで買い取るッス！`; }
  _売却時の会話内容を取得(アイテム名, 売却価格) { return `${アイテム名} の買取代の ${売却価格} Gだ！`; }
}
