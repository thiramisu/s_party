"use strict";

class 倉庫 {

}

export class アイテム倉庫 extends 倉庫 {
  最大() {
    return Math.max(最大アイテム預かり個数, あなた.転職回数 * 5 + 5);
  }
}

export class モンスター倉庫 extends 倉庫 {
  最大() {
    return 最大モンスター預かり体数;
  }
}
