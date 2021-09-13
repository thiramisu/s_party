"use strict";

import { 一般的な場所 } from "./Place.js"

export class 家 extends 一般的な場所 {
  constructor(所有者名, 所有者ID) {
    super("../space.gif", 場所._訪問方法.特殊);
    this.#所有者名 = 所有者名;
    this.#所有者ID = 所有者ID;
    console.trace(this.#所有者ID);
    this._こうどうリストリスト.unshift(new こうどうマネージャー(() => this.は自分の家() && !あなた.メンバー.は睡眠中(),
      new アイテムをつかう(),
      new こうどう("てがみをかく", あなた.手紙を送る.bind(あなた)),
      new こうどう("てがみをよむ", あなた.受け取った手紙を見る.bind(あなた)),
      new こうどう("からー", this._からー.bind(this), undefined, this._色一覧を表示.bind(this)),
      new こうどう("ことばをおしえる", this._ことばをおしえる.bind(this), undefined, this._ことばをおしえる.bind(this))
    ));
    this._こうどうリストリスト.unshift(new こうどうマネージャー(() => this.は自分の家() && !あなた.メンバー.は睡眠中(),
      new こうどう("ねる", () => {
        // TODO ログイン人数に応じて睡眠時間増加
        あなた.チャット書き込み予約(`${あなた}はベッドにもぐりこんだ！`);
        あなた.メンバー.睡眠(睡眠秒数);
        あなた.メンバー.錬金を完成させる();
      }),
      new こうどう("あいてむずかん", () => {
        あなた.チャット書き込み停止();
        $id("アイテム図鑑-プレイヤー名").textContent = this.#所有者名;
        // TODO バグに注意
        if (this.は自分の家() && 0)
          あなた.メンバー.コンプリート確認();
        データベース操作.アイテム図鑑を読み込む(this.#所有者ID, 画面.一覧("アイテム図鑑").読み込み);
      }),
      new こうどう("もんすたーぶっく", () => {
        あなた.チャット書き込み停止();
        $id("モンスターブック-プレイヤー名1").textContent = $id("モンスターブック-プレイヤー名2").textContent = this.#所有者名;
        画面.一覧("モンスターブック").表示(this.#所有者ID);
        throw "モンスター図鑑表示";
      }),
      new こうどう("じょぶますたー", () => {
        あなた.チャット書き込み停止();
        $id("ジョブマスター-プレイヤー名").textContent = this.#所有者名;
        データベース操作.ジョブマスターを読み込む(this.#所有者ID, 画面.一覧("ジョブマスター").読み込み);
        throw "じょぶますたー表示";
      }),
      new こうどう("ぷろふぃーる", () => {
        あなた.チャット書き込み停止();
        プロフィール画面.名前を設定(this.#所有者名);
        const _プロフィール画面 = 画面.一覧("プロフィール");
        データベース操作.プロフィールを読み込む(
          this.#所有者ID,
          this.は自分の家() ? _プロフィール画面.入力画面読み込み : _プロフィール画面.表示画面読み込み
        );
        throw "ぷろふぃーる表示";
      }),
    ));
    家.#一覧.set(this.#所有者名, this);
  }

  更新要求() {
    // TODO 削除or改名プレイヤーの家の場合、自分の家に送還
    super.更新要求();
  }

  ヘッダー出力() {
    if (あなた.メンバー.は睡眠中()) {
      return this.#睡眠時用ヘッダー出力();
    }
    const 場所名 = this._家の名前を取得();
    if (!this.は自分の家()) {
      return this._ヘッダー用出力(場所名, false);
    }
    // TODO ○○が届いています home.cgi 40行目
    const 断片 = document.createDocumentFragment();
    断片.appendChild(this._ヘッダー用出力(場所名));
    断片.appendChild(強調テキスト(
      "Lv.", あなた.メンバー._レベル,
      " / 経験値", あなた.メンバー._経験値,
      "Exp / 次のLv.", あなた.メンバー._レベル * あなた.メンバー._レベル * 10,
      "Exp / 転職回数", あなた.メンバー.転職回数,
      "回 / ゴールド", あなた.メンバー.所持金.所持,
      "G / 疲労度", あなた.メンバー._疲労, "％"
    ));
    // TODO
    if (あなた.メンバー._武器) {
      `<span onclick="text_set('＠つかう>${あなた.メンバー._武器} ')"> / E：${あなた.メンバー._武器}</span>`
    }
    if (あなた.メンバー._防具) {
      `<span onclick="text_set('＠つかう>${あなた.メンバー._防具} ')"> / E：${あなた.メンバー._防具}</span>`
    }
    if (あなた.メンバー._道具) {
      `<span onclick="text_set('＠つかう>${あなた.メンバー._道具} ')"> / E：${あなた.メンバー._道具}</span>`
    }
    return 断片;
  }

  は自分の家() {
    return this.#所有者名 = あなた.名前;
  }

  static 一覧(メンバー名, コールバック, あなたの名前, あなたのID, エラーを出す = true) {
    if (this.#一覧.has(メンバー名)) {
      コールバック(this.#一覧.get(メンバー名));
      return;
    }
    if (あなたのID) {
      コールバック(new 家(あなたの名前, あなたのID));
      return;
    }
    if (メンバー名 === あなた.名前) {
      コールバック(あなた.メンバー.家を取得());
      return;
    }
    // TODO ログインメンバー一覧からの検索？
    // TODO 非同期
    データベース操作.プレイヤーを読み込む(メンバー名, (データベースイベント) => {
      const 結果 = データベースイベント.target.result;
      if (結果 === undefined) {
        if (エラーを出す) {
          エラー.表示(`${メンバー名}という家は見つかりません`);
        }
        else {
          コールバック(this.#一覧.get(あなた.名前));
        }
        return;
      }
      const _家 = new メンバー(結果).家を取得();
      家.#一覧.set(メンバー名, _家);
      コールバック(_家);
    });
  }

  get 所有者名() { return this.#所有者名; }
  get ログ名() { return this.#所有者ID; }


  static 削除(メンバー名) {
    家.#一覧.delete(メンバー名);
    // TODO ログの削除
  }

  _はなす() {
    if (this._キャラクターリスト.size <= 1) {
      通知欄.追加("しかし、誰もいなかった…");
      return;
    }
    データベース操作.話す言葉を取得(this.#所有者ID, (データベースイベント) => {
      const 言葉リスト = データベースイベント.target.result;
      if (言葉リスト.length === 0)
        return;
      super._はなす(...言葉リスト);
      あなた.予約チャットを書き込んでから読み込む();
    });
    throw "非同期処理";
  }

  _ことばをおしえる(言葉) {
    if (!言葉) {
      通知欄.追加("＠ことばをおしえる>○○○ で家にいるモンスターが＠はなすで話すようになります", "＠ことばをおしえる> ");
      return;
    }
    if (this._キャラクターリスト.size <= 1) {
      通知欄.追加("教える相手がいません");
      return;
    }
    if (全角を2とした文字列長(言葉) > 教える言葉の最大文字数) {
      通知欄.追加(`言葉が長すぎます(半角${教える言葉の最大文字数}文字まで)`);
      return;
    }
    this.NPCに話させる(言葉);
    データベース操作.言葉を教える(あなた.メンバー._ID, 言葉);
  }

  _からー(色コード) {
    const _色コード = あなた.メンバー.色を変更(色コード);
    if (色コード === undefined) {
      this._色一覧を表示();
      return;
    }
    あなた.チャット書き込み予約(`カラーを<span style="color: ${_色コード}">${_色コード}</span>に変更しました`);
  }

  _色一覧を表示() {
    通知欄.追加(["#から始まる(16進数の)カラーコードを記入してください", "サンプル＞"]);
    for (const [色コード, 色名] of サンプル色リスト) {
      const span = document.createElement("span");
      span.style.color = 色コード;
      span.textContent = 色名;
      通知欄.追加(span, `＠からー>${色コード} `);
      通知欄.追加(" ");
    }
  }

  _家の名前を取得() {
    return `${this.#所有者名}の家`;
  }

  get _NPC() {
    // TODO
    console.log(1);
    const キャラクター配列 = Array.from(this._キャラクターリスト);
    const NPC候補 = ランダムな1要素(キャラクター配列);
    return NPC候補.はNPC色() ? NPC候補 : キャラクター配列[0];
  }

  #睡眠時用ヘッダー出力() {
    const 場所名 = this._家の名前を取得();
    // TODO デフォルトに忠実に: 寝た瞬間に残り時間が表示されないようにする
    if (あなた.メンバー.予定時刻を過ぎているなら起床する()) {
      画面.一覧("ゲーム画面").睡眠時用ログアウトボタンを表示(false);
      return document.createTextNode(`【${場所名}】 ${あなた}のＨＰＭＰ疲労が回復した！`);
    }
    const 断片 = document.createDocumentFragment();
    const _睡眠タイマー = 睡眠タイマー.作成(あなた.メンバー.残り睡眠秒数);
    画面.一覧("ゲーム画面").睡眠時用ログアウトボタンを表示();
    断片.appendChild(document.createTextNode(`【${場所名}】 お休み中「Zzz...」 目覚めるまで `));
    断片.appendChild(_睡眠タイマー);
    return 断片;
  }

  // TODO 寝た瞬間はメンバーが表示されないのを修正

  #所有者名;
  #所有者ID;

  static #一覧 = new Map();
}
