// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js";
import { キャラクター } from "../character/Character.js";

export class フォトコン会場 extends 一般的な場所 {
  get 背景画像() { return "none.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@ﾜｺｰﾙ", "chr/018.gif")}
}