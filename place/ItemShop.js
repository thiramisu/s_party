"use strict";

import { 専門店 } from "./Shop"

export class 道具屋 extends 専門店 {
  constructor() {
    super("item.gif", 場所._訪問方法.いどう, new キャラクター("@ｱｲﾃﾑｺ", "chr/004.gif"),
      道具, 2, "どれを買うニョ？", "ビンボーにゃの？働かにゃいの？");
    this._こうどうリストリスト[0].こうどう追加(new こうどう(
      "ひみつのみせ",
      () => { if (あなた.メンバー.転職回数 < /* TODO 7 */ 0) { return; } あなた.場所移動(場所.一覧("秘密の店")); },
      こうどう.状態固定.get(こうどう.状態.隠しコマンド)
    ));
  }

  _はなす() {
    super._はなす(
      `いらしゃいませぇ～ここは${this.名前}ニャ`,
      "冒険に出る前に道具があると便利ニャ",
      "初心者たんには薬草をオススメしてますぅ",
      "守りの石は相手からのだめぇじを軽減することができるらしいニャ",
      `${あなた}たんは顔色が悪そうなのでぇ、毒消し草を食べるといいニャ`,
      "この草おいしいニャ。モグモグ…。あぅっ！またお店の品を食べてしまったニャ…",
      "天使の鈴は頭が悪い人に使うといいらしぃニャ。あたしのことぢゃないニャ",
      `${あなた}たんの今日の夕食は薬草料理がオススメニャ`,
      `${あなた}たんはべじたりあんですかぁ？`,
      "魔法使いたんは魔法の聖水を持っていくとよいですよぉ",
      "この世界のどこかに秘密の店というあやしいお店があるらしいですよぉ",
      `今日のオススメ商品はコレニャ！じゃじゃ～ん <span class="強調">${ランダムな1要素(this._品揃えアイテム名リストを取得())}</span> ニャ！`
    );
  }

  _NPCをしらべる() {
    super._NPCをしらべる(`${this._NPC.名前}「ほえ？なんでしょうかぁ？」`, "＠ひみつのみせ に行きたい");
  }

  _うる(対象) {
    super._うる(対象, あなた.メンバー._道具);
  }

  _うるクリック時() {
    super._うるクリック時(あなた.メンバー._道具, "何を売るニョ？何も道具を持っていないニョ")
  }

  _品揃えアイテム名リストを取得() {
    const 転職回数 = あなた.メンバー.転職回数;
    return 転職回数 >= 7 ? ["薬草", "上薬草", "特薬草", "毒消し草", "満月草", "天使の鈴", "魔法の聖水", "戦いのﾄﾞﾗﾑ", "守りの石", "竜のｳﾛｺ", "ﾘｼﾞｪﾈﾎﾟｰｼｮﾝ", "ﾄﾞﾗｺﾞﾝ草", "爆弾石", "小人のﾊﾟﾝ", "基本錬金ﾚｼﾋﾟ"]
      : 転職回数 >= 5 ? ["薬草", "上薬草", "特薬草", "毒消し草", "満月草", "天使の鈴", "魔法の聖水", "戦いのﾄﾞﾗﾑ", "守りの石", "竜のｳﾛｺ", "ﾄﾞﾗｺﾞﾝ草", "爆弾石", "小人のﾊﾟﾝ", "基本錬金ﾚｼﾋﾟ"]
        : 転職回数 >= 3 ? ["薬草", "上薬草", "毒消し草", "満月草", "天使の鈴", "魔法の聖水", "守りの石", "竜のｳﾛｺ", "ﾄﾞﾗｺﾞﾝ草", "爆弾石", "基本錬金ﾚｼﾋﾟ"]
          : 転職回数 >= 1 ? ["薬草", "上薬草", "毒消し草", "満月草", "天使の鈴", "魔法の聖水", "守りの石", "竜のｳﾛｺ", "基本錬金ﾚｼﾋﾟ"]
            : ["薬草", "毒消し草", "満月草", "天使の鈴", "基本錬金ﾚｼﾋﾟ"]
  }

  _装備時の会話内容を取得(アイテム) { return `${アイテム.名前}ですね。はい、どうぞ！`; }
  _倉庫送信時の会話内容を取得(アイテム) { return `${アイテム.名前}は${あなた}ニャンの預かり所の方に投げましたニャ！`; }
  _売却確認時の通知内容を取得(アイテム名, 売却価格) { return `${アイテム名}なら ${売却価格} Gで買うニャ！`; }
  _売却時の会話内容を取得(アイテム名, 売却価格) { return `${売却価格} Gで ${アイテム名} を買い取りまちた`; }
}