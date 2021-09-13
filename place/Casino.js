"use strict";

import { 一般的な場所 } from "./Place.js"


export class カジノ extends 一般的な場所 {
  constructor() {
    super("casino.gif", 場所._訪問方法.いどう, new キャラクター("@ﾊﾞﾆｰ", "chr/020.gif"));
    this._こうどうリストリスト.unshift(new こうどうマネージャー(null,
      new こうどう("つくる"),
      new こうどう("さんか"),
      new こうどう("けんがく"),
      new こうどう("＄1すろっと", () => { this.#スロット(1); }),
      new こうどう("＄10すろっと", () => { this.#スロット(10); }),
      new こうどう("＄50すろっと", () => { this.#スロット(50); }),
      new こうどう("＄100すろっと", () => { this.#スロット(100); }),
      new こうどう("こうかん"),
      new こうどう("りょうがえ")
    ));
  }

  ヘッダー出力() {
    const 断片 = document.createDocumentFragment();
    断片.append(
      super._ヘッダー用出力(),
      ` コイン`,
      あなた.メンバー.カジノコイン.ヘッダー用出力(),
      "枚 / ゴールド",
      あなた.メンバー.所持金.ヘッダー用出力(),
      "G"
      // TODO 部屋一覧
    );
    return 断片;
  }

  _はなす() {
    super._はなす(
      "コインは１枚20Gです☆",
      "ゴールドをコインに両替してね☆",
      "賞品は他ではなかなか手に入れることができないレアなアイテムばかりよ☆",
      "スロットの絵柄を３つそろえるとコインが増えて幸せになれるわよ☆",
      "ゆっくりしていってね☆"
    );
  }

  _NPCをしらべる() {
    super._NPCをしらべる(`${this._NPC.名前}「きゃぁッ☆エッチィ～☆」`);
  }

  #スロット(賭けた枚数) {
    if (あなた.メンバー.疲労確認()) {
      return;
    }
    if (!あなた.メンバー.カジノコイン.収支(-賭けた枚数)) {
      通知欄.追加(`＄${賭けた枚数}スロットをするコインが足りません。「＠りょうがえ」でコインを両替してください`, "＠りょうがえ ");
      return;
    }
    // TODO 行動時間半減
    const
      結果 = [
        ランダムな1要素(カジノのスロットの記号リスト),
        ランダムな1要素(カジノのスロットの記号リスト),
        ランダムな1要素(カジノのスロットの記号リスト)
      ],
      通知内容 = [
        `$${賭けた枚数}スロット`,
        `【${結果[0].記号}】【${結果[1].記号}】【${結果[2].記号}】`
      ];
    let 払い戻し = 0;
    if (結果[0] === 結果[1]) {
      if (結果[1] === 結果[2]) {
        払い戻し = 賭けた枚数 * 結果[0].倍率;
        通知内容.push(
          `なんと!! ${結果[0].記号} が3つそろいました!!`,
          "おめでとうございます!!",
          `***** コイン ${払い戻し} 枚 GET !! *****`
        );
      }
      else if (結果[0].おまけの倍率) {
        払い戻し = 賭けた枚数 * 結果[0].おまけの倍率;
        通知内容.push(
          "チェリーが2つそろいました♪",
          `コイン ${払い戻し} 枚Up♪`
        );
      }
    }
    if (払い戻し === 0) {
      通知内容.push("ハズレ");
    }
    あなた.メンバー.カジノコイン.収支(払い戻し);
    通知欄.追加(通知内容, `＠＄${賭けた枚数}すろっと`);
  }
}

class スロットの記号 {
  constructor(記号, 倍率, おまけの倍率) {
    this.#記号 = 記号;
    this.#倍率 = 倍率;
    this.#おまけの倍率 = おまけの倍率;
  }

  get 記号() { return this.#記号; }
  get 倍率() { return this.#倍率; }
  get おまけの倍率() { return this.#おまけの倍率 }

  #記号;
  #倍率;
  #おまけの倍率;
}