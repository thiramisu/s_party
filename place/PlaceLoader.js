// @ts-check
"use strict";

export class 場所別キャラクター読み込み君 {
  constructor(場所) {
    this.#場所 = 場所;
    // TODO ＠ほーむのメンバーが存在するかチェック
    データベース操作.場所別キャラクターを更新する(場所.ログ名, this.#キャラクターの削除とあなたの更新または追加.bind(this));
  }

  #キャラクターの削除とあなたの更新または追加(データベースイベント) {
    // keyを使いたいので逐次読み込み
    const カーソル = データベースイベント.target.result;
    if (カーソル?.value) {
      const _キャラクター = キャラクター.オブジェクトから(カーソル.value, カーソル.key);
      if (_キャラクター.場所から削除する()) {
        カーソル.delete();
      }
      else {
        this.#キャラクターリスト.add(_キャラクター);
        if (_キャラクター.はあなた()) {
          this.#あなたの場所別ID = カーソル.key;
          カーソル.update(あなた.キャラクターへ(this.#あなたの場所別ID));
        }
      }
      カーソル.continue();
    }
    else {
      if (this.#あなたの場所別ID === undefined) {
        const あなたのキャラクター = あなた.キャラクターへ(this.#あなたの場所別ID);
        データベースイベント.target.source.add(あなたのキャラクター);
        // 場所移動をした更新時にハリボテを表示する
        this.#キャラクターリスト.add(あなたのキャラクター);
      }
      this.#場所.メイン(this.#キャラクターリスト, this.#あなたの場所別ID);
    }
  }

  #場所;
  #あなたの場所別ID;
  #キャラクターリスト = new Set();
}
