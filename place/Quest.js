// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js"

export class 冒険に出る extends 一般的な場所 {
  ヘッダー出力() {
    const 出力 = super.ヘッダー出力("冒険中のパーティー");
    return 出力;
  }

  get 背景画像() { return "quest.gif"; }
}
