"use strict";

import { 範囲, 連続 } from "../Util.js"

export class アイテム範囲 extends 範囲 {
  ランダム取得() {
    return アイテム.IDから(super.ランダム取得());
  }

  *[Symbol.iterator]() {
    for (const ID of super[Symbol.iterator]()) {
      yield アイテム.IDから(ID);
    }
  }
}

export class アイテム名前範囲 extends 範囲 {
  ランダム取得() {
    return アイテム.IDから(super.ランダム取得());
  }

  *[Symbol.iterator]() {
    for (const ID of super[Symbol.iterator]()) {
      yield アイテム.IDから(ID).名前;
    }
  }
}

export class アイテム連続 extends 連続 {
  *[Symbol.iterator]() {
    for (const ID of super[Symbol.iterator]()) {
      yield アイテム.IDから(ID);
    }
  }
}