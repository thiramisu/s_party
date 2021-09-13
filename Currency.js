"use strict";

export class 通貨 {
  constructor(所持, 単位) {
    this.#単位 = 単位;
    this._所持 = 所持;
  }

  収支(_金額, 強制 = false) {
    const 金額 = parseInt(_金額);
    if (Number.isNaN(金額)) {
      throw new TypeError(`${_金額}が数値に変換できませんでした`);
    }
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