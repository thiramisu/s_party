// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js"

export class イベント広場 extends 一般的な場所 {
  constructor() {
    super("event.gif", 場所._訪問方法.いどう);
    this._こうどうリストリスト.unshift(new こうどうマネージャー(null,
      new ちゅうもん()
    ));
  }

  メイン(ログインメンバー, チャットリスト) {
    // TODO タイミングが若干微妙
    this.#人数を読み込んで背景と販売アイテムを切り替え(ログインメンバー.size);
    super.メイン(ログインメンバー, チャットリスト);
  }

  _NPCをしらべる() {
    super._NPCをしらべる("なんと、薬草を見つけた！…が人の物を盗ってはいけない…");
  }

  _はなす() {
    if (this.#イベント開催中()) {
      super._はなす(
        "おや、たくさんの人が集まって何かあるんですか？",
        "バザーでもやるんですかねぇ",
        "たくさん人がいて、にぎやかですね",
        "では、商売でもさせてもらいましょうか"
      );
    }
    else {
      super._はなす();
    }
  }

  #人数を読み込んで背景と販売アイテムを切り替え(人数) {
    this.#人数 = 人数;
    if (!this.#イベント開催中()) {
      this._NPC = undefined;
      return;
    }
    this._NPC = new キャラクター("@旅の商人", "chr/024.gif");
    this._背景画像 = `event${(this.#人数 < 20) ? 1 : (this.#人数 < 30) ? 2 : 3}.gif`;
  }

  #イベント開催中() {
    return this.#人数 >= 10;
  }

  #人数; // 商人を除く
}
