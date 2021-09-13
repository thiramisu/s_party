"use strict";

import { 一般的な場所 } from "./Place"

export class 天界 extends 一般的な場所 {
  constructor() {
    super("god.gif", 場所._訪問方法.特殊, new キャラクター("@神", "chr/052.gif"));
    this._こうどうリストリスト.unshift(new こうどうマネージャー(null,
      new ちゅうもん()
    ));
  }

  ヘッダー出力() {
    return this._ヘッダー用出力(undefined, false);
  }

  _NPCをしらべる() {
    通知欄.追加(`${this._NPC.名前}「本当の願いは自分の力で叶えるのだ…」`, "＠ねがう>メイドを雇いたい");
  }

  _はなす() {
    super._はなす(`${あなた}よ。よくぞここまできた。${あなた}の願いを一つだけ叶えてやろう`);
  }
}