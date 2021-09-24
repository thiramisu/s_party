// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js"
import { キャラクター } from "../character/Character.js";
import { PlaceCommandGroup } from "../command/PlaceCommandGroup.js";
import { PlaceActionCommand } from "../command/PlaceActionCommand.js";

export class 何でも屋 extends 一般的な場所 {
  ヘッダー出力(プレイヤー) {
    return super.ヘッダー出力(プレイヤー, "手助けクエスト");
  }

  get 背景画像() { return "helper.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@ﾘｯｶ", "chr/036.gif"); }

  static get コマンド() { return this.#コマンド ?? this.#コマンドを登録(); }

  _はなす() {
    super._はなす(
      "ここは困っている人達を助ける何でも屋よ",
      "アイテムやモンスターを依頼主の代わりに探してきてほしいの",
      "報酬は錬金に必要となる素材など、他では手に入らないアイテムよ",
      "たまにレアクエストといって、条件を満たすのが難しい依頼がくるの。でも、その時の報酬は他では手に入れることができないものよ",
      "誰も解決することができない依頼はしばらくすると違う依頼に変わるわ"
    );
  }

  みる() {
    通知欄.追加("手助けクエスト一覧");
    データベース操作.何でも屋の依頼を読み込む(this.#みる.bind(this));
  }

  #みる(データベースイベント) {
    const 依頼リスト = データベースイベント.target.result.map(何でも屋の依頼.オブジェクトから);
    通知欄.追加(何でも屋の依頼.陳列棚出力(依頼リスト, true));
  }

  かいけつ(依頼名) {
    const リクエスト = new 依頼解決のリクエスト(依頼名);
    データベース操作.何でも屋の依頼を読み込む(リクエスト.解決.bind(リクエスト));
    throw "非同期処理";
  }

  static #コマンドを登録() {
    this.#コマンド = new PlaceCommandGroup("helper", "何でも屋");
    this.#コマンド.追加(
      new PlaceActionCommand("buy", this.prototype.みる),
      new PlaceActionCommand("sell", this.prototype.かいけつ)
        .引数追加("STRING", "request", "いらい", false)
    );
    return this.#コマンド;
  }

  /**
   * @type {PlaceCommandGroup}
   */
  static #コマンド;
}

class 依頼解決のリクエスト {
  constructor(依頼名) {
    this.#依頼名 = 依頼名;
  }

  解決(データベースイベント) {
    const 依頼リスト = データベースイベント.target.result.map(何でも屋の依頼.オブジェクトから);
    // デフォルトに忠実
    let 喋った = false;
    const
      解決したい依頼 = 依頼リスト.find(this.#解決したい依頼か, this),
      解決内容 = 解決したい依頼?.解決();
    // デフォルト再現: 解決したい依頼があったが解決できなかった時は依頼を更新しない
    if (解決したい依頼 !== undefined && 解決内容 === undefined) {
      return;
    }
    for (const 依頼 of 依頼リスト) {
      if (依頼 === 解決したい依頼) {
        if (解決内容 !== undefined) {
          this.NPCに話させる(解決内容);
          喋った = true;
        }
        continue;
      }
      const 話す内容 = 依頼.期限切れなら更新();
      if (話す内容 !== undefined) {
        あなた.現在地.NPCに話させる(話す内容);
        喋った = true;
      }
    }
    if (!喋った) {
      通知欄.追加("手助けクエスト一覧");
      通知欄.追加(何でも屋の依頼.陳列棚出力(依頼リスト, false));
    }
    あなた.予約チャットを書き込んでから読み込む();
  }

  #解決したい依頼か(依頼名) {
    return 依頼名 === this.#依頼名;
  }

  #依頼名;
}