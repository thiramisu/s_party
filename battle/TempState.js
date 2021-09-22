// @ts-check
"use strict";

import { 属性 } from "./SkillAttribute.js";
import { 確率 } from "../Util.js";

export class テンション {
  constructor(名前, 倍率, パーセント, 表示正式名) {
    this.#名前 = 名前;
    this.#倍率 = 倍率;
    this.#パーセント = パーセント;
    this.#表示正式名 = 表示正式名;
    this.#ID = テンション.#自動ID++;
  }

  次を取得() {
    return テンション.#一覧[this.#ID + 1];
  }

  上昇時用出力(メンバー名) {
    const 断片 = document.createDocumentFragment();
    断片.append(`${メンバー名}のテンションが `, クラス付きテキスト("tenshon", `${this.#パーセント}％`), " になった！");
    if (this.#表示正式名 !== undefined) {
      断片.append(`${メンバー名}は`, クラス付きテキスト("tenshon", this.#表示正式名), "になった！")
    }
    return 断片;
  }

  メンバー用出力() {
    return クラス付きテキスト(`テンション${this.#パーセント}`, this.名前);
  }

  get 名前() { return this.#名前; }
  get 倍率() { return this.#倍率; }

  static パーセントから(パーセント) {
    return テンション.#パーセントから.get(パーセント);
  }

  static 初期化() {
    テンション.#一覧 = [
      new テンション("ﾃﾝｼｮﾝ", 1.7, 5),
      new テンション("ﾃﾝｼｮﾝ", 3, 20),
      new テンション("ﾊｲﾃﾝｼｮﾝ", 5, 50, "ハイテンション"),
      new テンション("Sﾊｲﾃﾝｼｮﾝ", 8, 100, "スーパーハイテンション")
    ];
    テンション.#パーセントから = new Map(this.#一覧.map((テンション) => [テンション.#パーセント, テンション]));
  }

  #名前;
  #ID;
  #倍率;
  #パーセント;
  #表示正式名;

  static #一覧;
  static #パーセントから;
  static #自動ID = 0;
}

export class 状態異常 {
  constructor(名前) {
    this.#名前 = 名前;
  }

  get 名前() { return this.#名前; }

  ターン開始時チェック(戦闘メンバー) { return false; }
  技発動時チェック(技) { return false; }

  static 初期化() {
    this.#一覧 = new Map([
      new 猛毒(),
      new 動封("動封", 1,
        (メンバー名) => `しかし、${メンバー名}は動くことができない！`),
      new 動封("麻痺", 1 / 3,
        (メンバー名) => `${メンバー名}はしびれて動くことができない！`,
        (メンバー名) => `${メンバー名}${メンバー名}のしびれがなくなりました！`),
      new 動封("睡眠", 1 / 3,
        (メンバー名) => `${メンバー名}は眠っている！`,
        (メンバー名) => `${メンバー名}は眠りからさめました！`),
      [...属性.全て()].map((属性) => new 属性封印(属性))
    ].map((状態異常) => [状態異常.名前, 状態異常]));
  }

  #名前;

  static #一覧;
}

class 猛毒 extends 状態異常 {
  constructor() {
    super("猛毒");
  }

  技発動後チェック(戦闘メンバー) {
    const 効果値 = 戦闘メンバー.ステータス.ＨＰ.現在値 > 9999 ? Math.random(100) + 950 : 戦闘メンバー.ステータス.ＨＰ.現在値 * 0.1;
    戦闘メンバー.チャット書き込み予約(`${戦闘メンバー.名前}は猛毒により <span class="damage">${効果値}</span> のダメージをうけた！`);
    // TODO 整数 復活しない
    戦闘メンバー.ＨＰダメージ(効果値, null, `<span class="die">${戦闘メンバー.名前}は倒れた！</span>`, true);
  }
}

class 混乱 extends 状態異常 {
  constructor() {
    super("混乱");
  }

  ターン開始時チェック(戦闘メンバー) {
    if (確率(1 / 5)) {
      戦闘メンバー.チャット書き込み予約(`${戦闘メンバー.名前}は混乱がなおりました！`);
      戦闘メンバー.状態異常を解除(undefined, null);
    }
    else {
      戦闘メンバー.チャット書き込み予約(`${戦闘メンバー.名前}は混乱している！`);
    }
  }

  技発動時チェック(技) {
    if (!技.混乱無効) {
      技.対象者 = 技.対象者.ランダムなメンバーを取得();
    }
  }
}

class 動封 extends 状態異常 {
  constructor(名前, 解除確率, 非解除時の文章取得関数, 解除時の文章取得関数) {
    super(名前);
    this.#解除確率 = 解除確率;
    this.#非解除時の文章取得関数 = 非解除時の文章取得関数;
    this.#解除時の文章取得関数 = 解除時の文章取得関数;
  }

  ターン開始時チェック(戦闘メンバー) {
    if (確率(this.#解除確率)) {
      戦闘メンバー.チャット書き込み予約(this.#解除時の文章取得関数);
      戦闘メンバー.状態異常を解除(undefined, null);
    }
    else {
      戦闘メンバー.チャット書き込み予約(this.#非解除時の文章取得関数);
    }
    throw this.名前;
  }

  #解除確率;
  #非解除時の文章取得関数;
  #解除時の文章取得関数;
}

class 属性封印 extends 状態異常 {
  constructor(属性, 解除時の文章取得関数) {
    super(`${属性.短縮名}封`);
    this.#属性 = 属性;
  }

  技発動時チェック(技) {
    if (技.属性 !== this.#属性) {
      return;
    }
    if (確率(1 / 4)) {
      あなた.チャット書き込み予約(クラス付きテキスト("heal", `${技.使用者}は${技.属性.使用可能の文章}ようになりました！`));
      技.使用者.状態異常を解除();
      return;
    }
    あなた.チャット書き込み予約(`しかし、${技.使用者}は${技.属性}が封じられていた`);
    throw this.名前;
  }

  #属性;
}

export class 一時的状態 {
  /**
   * @param {string} 名前
   * @param {number} 解除確率
   * @param {string} 付与時の表示文章
   */
  constructor(名前, 解除確率, 付与時の表示文章) {
    this._名前 = 名前;
    this.#解除確率 = 解除確率;
    this.#付与時の表示文章 = 付与時の表示文章;
  }

  付与時の文章を表示(戦闘メンバー) {
    return this.#付与時の表示文章 === undefined ? undefined
      : クラス付きテキスト("tmp", `${戦闘メンバー.名前}${this.#付与時の表示文章}`);
  }

  解除チェック() {
    return 確率(this.#解除確率);
  }

  static 初期化() {
    this.#一覧 = new Map([
      new 自動回復("は優しい光に包まれた！"),
      new 復活("は天使の加護がついた！"),
      new 防御("防御", 0.5, "は身を固めている"),
      new 防御("大防御", 0.1, "は守りのかまえをとった！"),
      new 防御("２倍", 2),
      new かばう(),
      new 一時的状態("かばい中", 1 / 3, "は仲間の前に立ちはだかった！"),
      new 受流し("は攻撃を受流すかまえをとった"),
      new 魔吸収("は不思議な光に包まれた！"),
      new 属性軽減(属性.攻, "はゴーレムに守られている！"),
      new 属性軽減(属性.魔, "は魔法の光で守られた！"),
      new 属性軽減(属性.息, "は不思議な風に包まれた！"),
      new 属性無効(属性.攻, "は守りのかまえをとった！"),
      new 属性無効(属性.魔, "は魔法をうけつけない体になった！"),
      new 属性反撃(属性.攻, "は反撃のかまえをとった！"),
      new 属性反撃(属性.魔, "は魔法の壁で守られた！"),
      new 属性反撃(属性.息, "の周りに追い風が吹いている！")
    ].map((一時的状態) => [一時的状態.名前, 一時的状態]));
  }

  _名前;
  #付与時の表示文章;
  #解除確率;

  static #一覧;
}

class 自動回復 extends 一時的状態 {
  constructor(付与時の表示文章) {
    super("回復", 1 / 3, 付与時の表示文章);
  }

  ターン終了時チェック(戦闘メンバー) {
    const
      最大ＨＰ = 戦闘メンバー.ステータス.ＨＰ.基礎値,
      効果値 = 最大ＨＰ > 999 ? Math.trunc(Math.random() * 100) : Math.trunc(最大ＨＰ * (0.1 + Math.random() * 0.1));
    戦闘メンバー.ＨＰ回復(効果値);
  }
}

class 復活 extends 一時的状態 {
  constructor(付与時の表示文章) {
    super("復活", 1 / 3, 付与時の表示文章);
  }

  死亡時チェック(技) {
    技.対象者.ステータス.ＨＰ.基礎値へ(0.1 + Math.random() * 0.1);
    技.対象者.リセット();
    技.使用者.チャット書き込み予約(`<span class="revive">${技.対象者}は瀕死でよみがえった！</span>`);
    return true;
  }
}

class 防御 extends 一時的状態 {
  constructor(名前, 係数, 付与時の表示文章) {
    super(名前, 1, 付与時の表示文章);
    this.#係数 = 係数;
  }

  技命中時チェック(技) {
    技.威力 *= this.#係数;
  }

  #係数;
}

class かばう extends 一時的状態 {
  constructor() {
    super("かばう", 1 / 3);
  }

  付与時の文章を表示(対象者, 使用者) {
    return クラス付きテキスト("tmp", `${this.使用者.名前}は${this.対象者.名前}をかばっている`);
  }

  技命中時チェック(技) {
    for (const メンバー of 技.対象者.メンバー全員(false)) {
      if (メンバー.一時的状態.名前 === "かばい中" && メンバー.色 === 技.対象者.色) {
        技.使用者.チャット書き込み予約(`${メンバー.名前}が${技.対象者}をかばった！`);
        技.対象者 = メンバー;
        break;
      }
    }
  }
}

class 受流し extends 一時的状態 {
  /**
   * @param {string} 付与時の表示文章
   */
  constructor(付与時の表示文章) {
    // TODO デフォルトに忠実: 半角スペース入れるか入れないか
    super("受流し", 1 / 3, 付与時の表示文章);
  }

  技命中時チェック(技) {
    if (技.属性 !== 属性.攻) {
      return;
    }
    // TODO
    if (技.対象者.名前 === 技.使用者.名前) {
      技.使用者.チャット書き込み予約(`しかし、${技.使用者}は受流すのに失敗した！`);
    }
  }
}

class 魔吸収 extends 一時的状態 {
  /**
   * @param {string} 付与時の表示文章
   */
  constructor(付与時の表示文章) {
    super("魔吸収", 1 / 3, 付与時の表示文章);
  }

  技命中時チェック(技) {
    if (技.属性 !== 属性.魔) {
      return;
    }
    // TODO 威力が 文字 or undefined の時
    const ＭＰ回復量 = 技.威力 < 50 ? 整数乱数(49, 30, true) : 整数乱数(技.威力 * 0.5, 技.威力 * 0.2);
    技.使用者.ＭＰ回復(ＭＰ回復量, this.#表示文章を取得);
  }

  static #表示文章を取得(名前, 回復量) {
    return `${名前}はＭＰを <span class="heal">${ＭＰ回復量}</span> 吸収した！`;
  }
}

class 属性反撃 extends 一時的状態 {
  /**
   * @param {属性} 属性
   * @param {string} 付与時の表示文章
   */
  constructor(属性, 付与時の表示文章) {
    super(`${属性.短縮名}反撃`, 1, 付与時の表示文章);
    this.#属性 = 属性;
  }

  技命中時チェック(技) {
    if (技.属性 === this.#属性) {
      技.使用者.チャット書き込み予約(`${技.対象者}は<span class="tmp">${技.属性.反撃時の文章 ?? `${技.属性}をはね返した！`}</span>`); // TODO
      技.対象者 = 技.使用者;
    }
    return false;
  }

  #属性;
}

class 属性無効 extends 一時的状態 {
  /**
   * @param {属性} 属性
   * @param {string} 文章表示関数
   */
  constructor(属性, 文章表示関数) {
    super(`${属性.短縮名}無効`, 1 / 3, 文章表示関数);
    this.#属性 = 属性;
  }

  技命中時チェック(技) {
    if (技.属性 === this.#属性) {
      技.使用者.チャット書き込み予約(`${技.対象者}は<span class="tmp">${技.属性}をうけつけない！</span>`);
      return true;
    }
    return false;
  }

  #属性;
}

class 属性軽減 extends 一時的状態 {
  /**
   * @param {属性} 属性
   * @param {string} 文章表示関数 TODO
   */
  constructor(属性, 文章表示関数) {
    super(`${属性.短縮名}軽減`, 1 / 3, 文章表示関数);
    this.#属性 = 属性;
  }

  技命中時チェック(技) {
    if (技.属性 === this.#属性) {
      技.威力 *= 0.25;
    }
    return false;
  }

  #属性;
}
