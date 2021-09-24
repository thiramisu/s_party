// @ts-check
"use strict";

export class 通貨 {
  constructor(所持, 単位) {
    this.#単位 = 単位;
    this._所持 = 所持;
  }

  /**
   * 
   * @param {number} 金額 
   * @param {boolean} 強制 trueなら足りない場合0になる
   * @returns {boolean} 足りないならfalse
   */
  収支(金額, 強制 = false) {
    if (金額 < 0 && this._所持 + 金額 < 0) {
      if (強制) {
        this._所持 = 0;
      }
      return false;
    }
    this._所持 += 金額;
    return true;
  }

  ヘッダー用出力() {
    return 強調テキスト(undefined, this._所持, this.#単位);
  }

  get 所持() {
    return this._所持;
  }

  _所持;
  #単位;

  static オブジェクトから(オブジェクト, 単位) {
    return new 通貨(オブジェクト?._所持 ?? 0, 単位);
  }
}