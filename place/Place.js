"use strict";

export class 場所 {
  constructor(背景画像, 訪問方法 = 場所._訪問方法.特殊, _NPC) {
    const 名前 = this.constructor.name;
    this._名前 = 名前;
    this._背景画像 = 背景画像;
    this._訪問方法 = 訪問方法;
    this._チャット欄 = new チャット欄(名前);
    this._NPC = _NPC;
  }

  更新要求() {
    更新日時.更新();
    new 場所別キャラクター読み込み君(this);
  }

  メイン(キャラクターリスト) {
    this._キャラクターリスト = キャラクターリスト;
    this._名前からキャラクター取得用キャッシュ = new Map(Array.from(キャラクターリスト, 場所.#一覧生成, 場所));
    const チャット内容 = $encode(チャットフォーム.内容);
    チャットフォーム.保存した内容を消去();
    あなた.チャット書き込み予約(チャット内容);
    try {
      this.#こうどうを実行(チャット内容);
      あなた.予約チャットを書き込んでから読み込む();
    }
    catch (e) {
      // 意図的な処理停止でないなら
      if (typeof e !== "string") {
        throw e;
      }
      else {
        console.log(e);
      }
      // TODO マルチならチャット更新&画面更新
    }
  }

  ヘッダー出力(オーバーライド場所名) {
    const 断片 = document.createDocumentFragment();
    断片.appendChild(this._ヘッダー用出力(オーバーライド場所名));
    断片.appendChild(あなた.メンバー.ヘッダー用出力());
    return 断片;
  }

  固定NPC出力() {
    return this._NPC.場所用出力();
  }

  メンバー出力() {
    const 断片 = document.createDocumentFragment();
    if (this._NPC) {
      断片.appendChild(this._NPC.場所用出力());
    }
    for (const キャラクター of this._キャラクターリスト) {
      断片.appendChild(キャラクター.場所用出力());
    }
    return 断片;
  }

  こうどう出力() {
    const 断片 = document.createDocumentFragment();
    if (!this._こうどうリストリスト) {
      return 断片;
    }
    for (const こうどうリスト of this._こうどうリストリスト) {
      断片.appendChild(こうどうリスト.出力());
    }
    return 断片;
  }

  チャット出力() {
    return this._チャット欄.出力();
  }

  チャットを書き込んでから読み込む(チャット) {
    if (チャット === undefined && this._NPCのチャット === undefined) {
      データベース操作.場所別ログを読み込む(this.ログ名, this.ログ読み込み後の処理.bind(this));
      return;
    }
    const 対象チャット = [チャット, this._NPCのチャット].filter(場所.#未定義でない要素);
    データベース操作.チャットを書き込んでから読み込む(対象チャット, this.ログ名, this.ログ読み込み後の処理.bind(this));
    this._NPCのチャット = undefined;
  }

  NPCに話させる(内容, 宛て先) {
    if (this._NPCのチャット) {
      this._NPCのチャット.内容追加(内容, 宛て先);
    }
    else {
      this._NPCのチャット = (this._NPC ?? 場所.#チャットのデフォルトNPC).チャット(内容, 宛て先);
    }
  }

  get 名前() { return this._名前; }
  get 背景画像() { return this._背景画像; }
  get ログ名() { return this.名前; }

  static 初期化() {
    場所.#チャットのデフォルトNPC = new キャラクター(チャットのデフォルトのNPC名);
    一般的な場所.初期化();
    場所.#一覧 = new Map([
      new 冒険に出る(),
      new カジノ(),
      new 預かり所(),
      new 武器屋(),
      new 防具屋(),
      new 道具屋(),
      new 秘密の店(),
      new ルイーダの酒場(),
      new 福引所(),
      new モンスターじいさん(),
      new フォトコン会場(),
      new オラクル屋(),
      new 闇市場(),
      new メダル王の城(),
      new ダーマ神殿(),
      new 交流広場(),
      new オークション会場(),
      new イベント広場(),
      new 願いの泉(),
      new 復活の祭壇(),
      new ギルド協会(),
      new 命名の館(),
      new 追放騎士団(),
      new 何でも屋(),
      new 錬金場(),
      new 天界(),
      new 町("ガイア国", "quest.gif", 10, new Set(["021", "022", "023", "024", "025", "026", "027", "028"]), 5000, 20),
      new 町("スライム町", "stage16.gif", 10, new Set(["013", "014", "015", "016", "017", "018", "019", "020"]), 3000, 15),
      new 町("キノコ町", "park.gif", 10, new Set(["005", "006", "007", "008", "009", "010", "011", "012"]), 1500, 10),
      new 町("メケメケ村", "stage8.gif", 10, new Set(["001", "002", "003", "004"]), 500, 5)
    ].map(場所.#一覧生成, 場所));
  }

  static * 全場所名(訪問方法) {
    for (const [名前, _場所] of 場所.#一覧) {
      if (訪問方法 !== undefined && _場所._訪問方法 !== 訪問方法) {
        continue;
      }
      yield 名前;
    }
  }

  static 一覧(場所名, エラーを出す = true) {
    return 場所.#一覧.get(場所名) ?? ((!エラーを出す || console.error(`場所「${場所名}」は存在しません`)) ? undefined : undefined);
  }

  static 一時的な場所を登録(名前, _場所) {
    if (_場所 instanceof クエスト)
      場所.#クエスト一覧.set(名前, _場所);
    else if (_場所 instanceof 家)
      場所.#家一覧.set(名前, _場所);
    else if (_場所 instanceof ギルド)
      場所.#ギルド一覧.set(名前, _場所);
    else
      throw new TypeError(`${_場所}は有効な場所ではありません`);
    場所.#一覧.set(名前, _場所);
  }

  static 一時的な場所を自動削除() {
    for (const 場所リスト of [場所.#家一覧, 場所.#ギルド一覧, 場所.#クエスト一覧])
      for (const _場所 of 場所リスト)
        if (_場所.最終更新日時 + 一時的な場所の自動削除秒数 < 更新日時.取得())
          _場所.削除();
  }

  static 家一覧(所有者名) {
    if (場所.#家一覧.has(場所名)) {
      return 場所.#家一覧.get(場所名);
    }
    あなた.家を検索して移動(所有者名);
    throw "非同期処理";
  }

  static クエスト一覧(クエスト名, エラーを出す = true) {
    return 場所.#クエスト一覧.get(場所名) ?? ((!エラーを出す || エラー.表示("すでにパーティーが解散してしまったようです")) ? undefined : undefined);
  }

  static ギルド一覧(ギルド名) {
    if (場所.#ギルド一覧.has(ギルド名)) {
      return 場所.#ギルド一覧.get(ギルド名);
    }
    あなた.ギルドを検索して移動(所有者名);
    throw "非同期処理";
  }

  _名前からキャラクター取得(名前) {
    return this._名前からキャラクター取得用キャッシュ.get(名前);
  }

  _NPCをしらべる(通知内容, クリック時文字列) {
    通知欄.追加(通知内容 ?? `しかし何も見つからなかった…`, クリック時文字列);
  }

  _はなす(...言葉リスト) {
    if (!言葉リスト?.length) {
      通知欄.追加("返事がない、ただのしかばねのようだ…");
      return;
    }
    this.NPCに話させる(ランダムな1要素(言葉リスト));
  }

  _ヘッダー用出力(オーバーライド場所名, 半角スペースを入れる = true) {
    return document.createTextNode(`【${オーバーライド場所名 ?? this.名前}】${半角スペースを入れる ? " " : 空文字列}`);
  }

  _名前;
  _NPC;
  _背景画像;
  _こうどうリストリスト = [];
  _キャラクターリスト = new Set();
  _チャット欄;
  _NPCの発言;

  ログ読み込み後の処理(データベースイベント) {
    this._チャットリスト = new Set(データベースイベント.target.result.map(チャット.オブジェクトから));
    this._チャット欄.更新(this._チャットリスト);
    あなた.メンバー.データベースに保存();
    画面.一覧("ゲーム画面").更新(this);
  }

  #こうどうを実行(チャット内容) {
    const こうどう情報 = チャット内容.match(場所.#こうどう名抽出);
    if (!こうどう情報) {
      return false;
    }
    const [, こうどう名, 対象] = こうどう情報;
    for (const こうどうリスト of this._こうどうリストリスト) {
      if (こうどうリスト.名前が一致したこうどうを実行(こうどう名, 対象)) {
        return true;
      }
    }
    return false;
  }

  static #一覧生成(場所) {
    return [場所.名前, 場所];
  }

  static #ギルドを登録() {

  }

  static #未定義でない要素(要素) {
    return 要素 !== undefined;
  }

  static #一覧;
  static #家一覧 = new Map(); // TODO [所有者名, new 家]
  static #クエスト一覧 = new Map(); // TODO [クエスト名, new クエスト]
  static #ギルド一覧 = new Map(); // TODO [ギルド名, new ギルド]

  static #チャットのデフォルトNPC;
  static #こうどう名抽出 = new RegExp(/＠(.+?)(?:[\x20　]?&gt;(.+?))?(?:[\x20　]|$)/);
  static _訪問方法 = Object.freeze({
    特殊: Symbol("特殊"),
    いどう: Symbol("いどう"),
    まち: Symbol("まち")
  });
}

export class 一般的な場所 extends 場所 {
  constructor() {
    super(...arguments);
    this._こうどうリストリスト = [一般的な場所._一般的なこうどう];
  }

  static 初期化() {
    一般的な場所._一般的なこうどう = new こうどうマネージャー(null,
      new いどう(),
      new まち(),
      new こうどう("ほーむ", () => { あなた.プレイヤーの家に移動(); }),
      new こうどう("ぎるど", () => { console.log("guild"); }, () => あなた.メンバー.ギルド === undefined ? こうどう.状態.無効 : こうどう.状態.有効),
      new こうどう("ささやき", () => { console.log("ささやき"); }),
      new こうどう("はなす", () => { あなた.現在地._はなす(); }),
      new こうどう("しらべる", (対象) => { あなた.チャット書き込み停止(); if (あなた.現在地._NPC?.名前 === 対象) { あなた.現在地._NPCをしらべる(); return; } console.log("プレイヤーデータ"); }),
      new こうどう("ろぐあうと", () => { あなた.ろぐあうと(); }),
      new こうどう("すくしょ", () => { console.log("syo"); }),
      new こうどう("ボーナス", () => {
        あなた.メンバー.所持金.収支(10000);
        あなた.メンバー.カジノコイン.収支(10000);
        あなた.メンバー._福引券.収支(1000);
        あなた.メンバー._レアポイント.収支(10);
        あなた.メンバー._小さなメダル.収支(100);
      })
    )
  }

  _一般的なこうどう;
}
