// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js"
import { キャラクター } from "../character/Character.js";

export class 追放騎士団 extends 一般的な場所 {
  ヘッダー出力(プレイヤー) {
    const 出力 = super.ヘッダー出力(プレイヤー, "荒らし追放騎士団");
    return 出力;
  }

  get 背景画像() { return "exile.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@追放騎士", "chr/015.gif"); }

  _はなす() {
    super._はなす(
      "ここは荒らし追放騎士団！荒らしや不正プレイヤーを取り締まっている！",
      "荒らしや不正プレイヤーなどを追放して、楽しい環境を作ろう！",
      "荒らしを見かけたらここで追放投票をしてくれ！荒らしのいない楽しい環境はお前達がつくっていくのだ。",
      "荒らしの発言に対して反応してはいけない。相手の反応を楽しむのが荒らしなのだ。無視が一番効果的だ。",
      "荒らしの不快な言葉に不快な言葉で返してしまうのは、荒らしと一緒に荒らしているのと同じことだ。",
      "感情的になっているときは、クールになれ！冷静な時こそ正しい判断をすることができるはずだ。",
      "なんとなくムカつくなどの感情的な判断で誤った追放申請をした場合、申請者が逆に罰を受けることになるぞ。",
      `判決に必要な票数は${追放申請の必要票数}票必要だ！`,
      "投票できるのは、転職回数が１回以上のプレイヤーのみだ！"
    );
  }

  _ついほう(対象) {
    const [プレイヤー名, 理由] = 対象.split("＠りゆう&gt;");
    if (this.#追放チェック(プレイヤー名))
      return;
    データベース操作.追放申請読み込み();
    this.NPCに話させる(`<span class="damage">${プレイヤー名}を追放者リストに追加しておいたぞ。判決がくだるのを待て！</span>`);
    ニュース.書き込み(`<span class="damage">${あなた}が${プレイヤー名}を${理由}の理由で追放申請しました</span>`);
  }

  #追放チェック(プレイヤー名, 理由) {
    try {
      if (プレイヤー名 === 空文字列 || 理由 === 空文字列)
        throw "『＠ついほう>○○○＠りゆう>△△△』○○○には荒らしの名前、△△△にはなぜ追放したいのかの理由を書いてくれ";
      if (あなた.メンバー.転職回数 < 1)
        throw "未転職の方は、申請することはできません";
      if (プレイヤー名 === あなた.toString())
        throw "自分自身を申請することはできません";
    }
    catch (エラー) {
      通知欄.追加(エラー);
      return true;
    }
    return false;
  }

  #投票(プレイヤー, 賛成する) {

  }

  static #却下プレイヤー拘束日数 = 25;
  static #申請取り消し禁止秒数 = 60 * 60 * 3;
}

class 追放申請 {
  constructor(申請者名, 被疑者名, 理由, 賛成者名リスト = [申請者名], 反対者名リスト = 空配列) {
    this._申請者名 = 申請者名;
    this._被疑者名 = 被疑者名;
    this._理由 = 理由;
    this._賛成者名リスト = new Set(賛成者名リスト);
    this._反対者名リスト = new Set(反対者名リスト);
  }

  async 新規登録() {
    if (await this.新規登録チェック()) {
      return false;
    }
    データベース操作.追放申請を保存(this);
    return true;
  }

  async 新規登録チェック() {
    try {
      if (!await メンバー.プレイヤーが存在(this._被疑者名))
        throw `${被疑者名}というプレイヤーは存在しません`;
      if (await データベース操作.追放申請を読み込み(this._被疑者名))
        throw `${被疑者名}はすでに追放申請されています`;
      if (await データベース操作.プレイヤーの追放申請提出数を取得() >= 追放申請数個人上限)
        throw "申請した追放者の判決を待ってください";
    }
    catch (エラー) {
      通知欄.追加(エラー);
      return true;
    }
    return false;
  }

  一覧用出力() {
    const
      断片 = document.createDocumentFragment(),
      賛成票数 = 強調テキスト("賛成 ", this._賛成者名リスト.length),
      反対票数 = 強調テキスト("反対 ", this._反対者名リスト.length);
    断片.append(
      document.createElement("hr"),
      `申請：${this.名前} / 追放：${this._被疑者} / 理由：${this._理由}`,
      document.createElement("br"),
      賛成票数, ` 票：${this._賛成者名リスト.join(",")}　`,
      反対票数, ` 票：${this._反対者名リスト.join(",")}`,
      document.createElement("br")
    );
    チャットフォーム.文字列追加イベントを登録(賛成票数, `＠さんせい>${this._被疑者} `);
    チャットフォーム.文字列追加イベントを登録(反対票数, `＠はんたい>${this._被疑者} `);
    return 断片;
  }

  投票(投票者名, 賛成する) {
    if (投票者名 === this._申請者名 && 賛成する === false) {
      this.取り消す();
      ニュース.書き込み(`<span class="revive">${投票者名}が${this._被疑者名}の追放申請を取り消しました</span>`);
      return;
    }
    if (this._賛成者名リスト.has(投票者名) || this._反対者名リスト.has(投票者名))
      throw "すでに追放投票に参加しています";
    if (投票者名 === this._被疑者名)
      throw "申請されている人は投票することはできません";
    const リスト = (賛成する ? this._賛成者名リスト : this._反対者名リスト);
    if (リスト.size < 追放申請の必要票数 - 1) {
      リスト.add(投票者名);
      データベース操作.追放申請を保存(this);
      // デフォルトを忠実に再現
      プレイヤー.現在地.NPCに話させる(`${this._被疑者名}の追放${(賛成する ? "：" : "の")}${this.#票数()}`);
      return;
    }
    this.#議決(賛成する);
  }

  取り消す() {
    // TODO 投票後は一定時間の取り消し制限
    データベース操作.追放申請を削除(this._被疑者名);
  }

  #議決(有罪) {
    const
      議決内容 = `【議決】${this.#票数()}。よって ${this._被疑者名}は${有罪 ? "有" : "無"}罪`,
      ニュース内容 = document.createElement("span"),
      ニュース外枠 = document.createElement("div"),
      NPCの話す内容 = [];
    ニュース内容.classList.add(有罪 ? "die" : "revive");
    ニュース内容.textContent = 議決内容 + (有罪 ? "として追放されました" : "となりました");
    ニュース外枠.appendChild(ニュース内容);
    ニュース.書き込み(ニュース外枠.innerHTML);
    ニュース内容.textContent = 議決内容 + (有罪 ? "！追放とする！以上！" : "！");
    NPCの話す内容.push(ニュース外枠.innerHTML);
    if (!有罪) {
      if (this._申請者名 && /^[^@]/.test(this._申請者名)) {
        const 眠りの刑 = `申請者の${this._申請者名}は $penalty_day日間の眠りの刑`;
        ニュース内容.classList.replace("revive", "die");
        ニュース内容.textContent = 眠りの刑 + "となりました";
        ニュース.書き込み(ニュース外枠.innerHTML);
        ニュース内容.textContent = 眠りの刑 + "とする！";
        NPCの話す内容.push(ニュース外枠.innerHTML);
        メンバー.データベースから読み込む(this._被疑者名, this.#睡眠追加);
      }
      NPCの話す内容.push("以上！");
    }
    あなた.現在地.NPCに話させる(NPCの話す内容.join(空文字列));
    データベース操作.追放申請を削除(this._被疑者名);
    if (有罪) {
      // TODO ブラックリストに追加
      // TODO 下の行多分エラーの元
      データベース操作.プレイヤーを削除(this._被疑者名);
    }
  }

  #票数() {
    return `賛成 ${this._賛成者名リスト.size} 票 / 反対 ${this._賛成者名リスト.size} 票`;
  }

  #睡眠追加(要求) {
    const 申請者 = new メンバー(要求.target.result);
    申請者.睡眠(60 * 60 * 24 * 追放申請が却下されたプレイヤーの拘束日数, true);
    データベース操作.プレイヤーを保存(申請者);
  }

  関係者(プレイヤー名) {
    return this._申請者名 === 申請者名
      || this._被疑者名 === プレイヤー名
      || this._賛成者名リスト.has(プレイヤー名)
      || this._反対者名リスト.has(プレイヤー名);
  }

  static 関係者(プレイヤー名) {
  }

  static オブジェクトから({ _申請者名, _被疑者名, _理由, _賛成者名リスト, _反対者名リスト }) {
    new 追放申請(_申請者名, _被疑者名, _理由, _賛成者名リスト, _反対者名リスト);
  }
}
