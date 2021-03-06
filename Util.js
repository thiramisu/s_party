// @ts-check
"use strict";

/**
 * @typedef {import("discord.js").ThreadChannel} ThreadChannel
 * @typedef {import("discord.js").ThreadManager} ThreadManager
 */

const メンテナンス予定分数 = 0;

export const
  // "最大"-1が実際の最大なので注意(配列中のランダムな要素の取得に便利なので)
  整数乱数 = (最大, 最小 = 0, 端を含める = false) => Math.floor(Math.random() * (最大 - 最小 + (端を含める ? 1 : 0))) + 最小,
  /**
   * @type {(確率: number) => boolean}
   * @returns {boolean} 成功ならtrue
   */
  確率 = (確率) => Math.random() < 確率,
  ランダムな1要素 = (配列) => 配列[整数乱数(配列.length)],
  半角か = new RegExp(/[ -~]/),
  全角を2とした文字列長 = (文字列) => {
    let 文字列長 = 0;
    for (const 文字 of 文字列) {
      文字列長 += 半角か.test(文字) ? 1 : 2;
    }
    return 文字列長;
  },
  空配列 = Object.freeze([]),
  空文字列 = Object.freeze(""),
  $encode = (/** @type {string} */ 文字列) => 文字列.replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;"),
  テーブル行出力 = (項目名リスト, クリック時文字列, ヘッダー行か) => {
    const tr = document.createElement("tr");
    for (const 項目名 of 項目名リスト) {
      const セル = document.createElement(ヘッダー行か ? "th" : "td");
      if (項目名.nodeType !== undefined) {
        セル.appendChild(項目名);
      }
      else {
        セル.textContent = 項目名;
      }
      tr.appendChild(セル);
    }
    チャットフォーム.文字列追加イベントを登録(tr, クリック時文字列);
    return tr;
  },
  強調テキスト = (...非強調テキストと強調テキストの繰り返し) => {
    const
      断片 = document.createDocumentFragment();
    let 強調する = 0;
    for (const テキスト of 非強調テキストと強調テキストの繰り返し) {
      if (強調する++ % 2 === 0) {
        if (テキスト !== undefined) {
          断片.appendChild(document.createTextNode(テキスト));
        }
        continue;
      }
      断片.appendChild(クラス付きテキスト("強調", テキスト));
    }
    return 断片;
  },
  クラス付きテキスト = (クラス, テキスト) => {
    const span = document.createElement("span");
    span.classList.add(クラス);
    span.textContent = テキスト;
    return span;
  }
  ;

export const
  分秒表記 = (秒数, 秒が無い場合に省略する = true, 秒の0埋め = false) =>
    (秒が無い場合に省略する && (秒数 % 60 === 0))
      ? `${Math.round(秒数 / 60)} 分` // 小数が怪しいのでround
      : `${Math.trunc(秒数 / 60)}分${秒の0埋め && 秒数 < 10 ? "0" : 空文字列}${秒数 - Math.trunc(秒数 / 60) * 60}秒`,
  メンテナンスチェック = () => {
    if (メンテナンス予定分数) {
      エラー.表示(`現在メンテナンス中です。しばらくお待ちください(約 ${メンテナンス予定分数} 分間)`);
      return true;
    }
    return false;
  };

export class 範囲 {
  constructor(から, まで = 0, 刻み = 1) {
    刻み = Math.abs(刻み) * Math.sign(まで - から);
    this.#段階数 = から === まで ? 1 : Math.round((まで - から) / 刻み) + 1;
    if (から + 刻み * (this.#段階数 - 1) !== まで)
      throw new Error(`範囲(${から}と${まで}の差=${から - まで})が刻み(${刻み})の倍数ではありません`);
    this.#から = から;
    this.#刻み = 刻み;
  }

  ランダム取得() {
    return this.#から + this.#刻み * 整数乱数(this.#段階数);
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.#段階数; i += 1) {
      yield this.#から + this.#刻み * i;
    }
  }

  get 候補数() {
    return this.#段階数;
  }

  #から;
  #刻み;
  #段階数;
}

/**
 * @template T
 */
export class 連続 {
  /**
   * @param {T} 値
   * @param {number} 数 integer
   */
  constructor(値, 数) {
    if (!Number.isInteger(数))
      throw new TypeError(`${数}は整数でなければいけません`);
    this.#値 = 値;
    this.#数 = 数;
  }

  /**
   * @returns {IterableIterator<T>}
   */
  *[Symbol.iterator]() {
    for (let i = 0; i < this.#数; i += 1) {
      yield this.#値;
    }
  }

  #値;
  #数;
}