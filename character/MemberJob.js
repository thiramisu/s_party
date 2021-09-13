"use strict";

export class メンバーの職業 {
  constructor(職業名, SP) {
    this.#職業 = 転職可能な職業.一覧(職業名);
    this._職業名 = 職業名;
    this._SP = SP;
  }

  レベルアップ(ステータス) {
    ステータス.増加(this.#職業.成長結果取得());
    this._SP += 1;
  }

  toString() {
    return `${this._職業名}(${this._SP})`;
  }

  アイコン名を取得(性別) {
    return this.#職業.アイコン名を取得(性別);
  }

  get 名前() { return this._職業名; }
  get SP() { return this._SP }

  static オブジェクトから(オブジェクト) {
    return new メンバーの職業(オブジェクト._職業名, オブジェクト._SP);
  }

  get _職業() { return this.#職業; }

  _職業名;
  _SP;

  #職業;
}

export class ジョブマスターの職業 extends メンバーの職業 {
  constructor(職業名, SP, 性別) {
    super(職業名, SP);
    this._性別 = 性別;
  }

  static 図鑑出力(ジョブマスターの職業リスト) {
    const
      ジョブマスターの職業一覧 = new Map(ジョブマスターの職業リスト.map(ジョブマスターの職業.#一覧へ)),
      断片 = document.createDocumentFragment();
    let 改行する = 0;
    let tr;
    for (const _職業 of 転職可能な職業.全て()) {
      if (改行する++ % ジョブマスターの1行の職業数 === 0) {
        tr = document.createElement("tr");
        断片.appendChild(tr);
      }
      const ジョブマスター状況 = ジョブマスターの職業一覧.get(_職業.名前);
      tr.appendChild(_職業.図鑑用出力(ジョブマスター状況?._性別, ジョブマスター状況?._SP));
    }
    $id("ジョブマスター率").textContent = 転職可能な職業.ジョブマスター率を取得(ジョブマスターの職業一覧.size);
    return 断片;
  }

  static オブジェクトから({ _職業名, _SP, _性別 }) {
    return new ジョブマスターの職業(_職業名, _SP, _性別);
  }

  static #一覧へ(オブジェクト) {
    const _ジョブマスターの職業 = ジョブマスターの職業.オブジェクトから(オブジェクト);
    return [_ジョブマスターの職業.名前, _ジョブマスターの職業];
  }

  _性別;
}