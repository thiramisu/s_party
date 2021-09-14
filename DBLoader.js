// @ts-check
"use strict";

export class 読み込み君 {
  constructor(クラス, コールバック) {
    this.#クラス = クラス;
    this.#コールバック = コールバック;
  }

  _読み込む(データベースイベント) {
    カーソル = データベースイベント.target.result;
    if (カーソル?.value) {
      this._結果リスト.add(this._クラス.オブジェクトから(カーソル.value));
      カーソル.continue();
    }
    else {
      this._コールバック(this._結果リスト);
    }
  }

  get _クラス() { return this.#クラス; }
  get _コールバック() { return this.#コールバック; }
  get _結果リスト() { return this.#結果リスト; }

  #クラス;
  #コールバック;
  #結果リスト = new Set();
}