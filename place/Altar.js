// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js";
import { キャラクター } from "../character/Character.js";

export class 復活の祭壇 extends 一般的な場所 {
  get 背景画像() { return "reborn.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@巫女", "chr/050.gif"); }
}