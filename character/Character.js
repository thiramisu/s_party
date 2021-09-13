"use strict";

import { ステータス } from "./Status"

export class キャラクター {
  constructor(名前, アイコン, 色 = NPC色, 最終更新日時, 場所別ID) {
    this._名前 = 名前;
    this._アイコン = アイコン;
    this._色 = 色;
    this._最終更新日時 = 最終更新日時;
    this._場所別ID = 場所別ID;
  }

  get 名前() { return this._名前 }
  get 場所別ID() { return this._場所別ID; }
  get 最終更新日時() { return this._最終更新日時; }

  _名前;
  _色;
  _アイコン;
  _最終更新日時;
  _場所別ID;

  チャット(内容, 宛て先) {
    return new チャット(this._名前, this._色, 内容, 更新日時.取得(), 宛て先);
  }

  場所用出力() {
    return キャラクター.場所用出力(this);
  }

  場所から削除する() {
    return this._最終更新日時 + メンバー表示秒数 < 更新日時.取得();
  }

  はあなた() {
    return this._名前 === あなた.名前;
  }

  はNPC色() {
    return this._色 === NPC色;
  }

  色を変更(色コード) {
    if (typeof 色コード !== "string") {
      return undefined;
    }
    const _色コード = 色コード.match(有効なカラーコードか)[0];
    if (_色コード === undefined) {
      return undefined;
    }
    this._色 = _色コード;
    return _色コード;
  }

  static 場所用出力(キャラクター) {
    const
      全体枠 = document.createElement("div"),
      名前 = document.createElement("div"),
      画像 = document.createElement("img");
    全体枠.classList.add("メンバー");
    名前.style.color = キャラクター._色;
    名前.classList.add("メンバー名");
    名前.textContent = キャラクター._名前;
    全体枠.appendChild(名前);
    画像.src = `resource/icon/${キャラクター._アイコン}`;
    画像.alt = キャラクター._名前;
    全体枠.appendChild(画像);
    チャットフォーム.文字列追加イベントを登録(全体枠, `>${キャラクター._名前} `);
    return 全体枠;
  }

  static オブジェクトから({ _名前, _アイコン, _色, _最終更新日時 }, 場所別ID) {
    return new キャラクター(_名前, _アイコン, _色, _最終更新日時, 場所別ID);
  }
}

class ログインメンバー extends キャラクター {
  constructor(情報) {
    super(情報._名前, 情報._色, 情報._アイコン, 情報._最終更新日時);
    this._めっせーじ = 情報._めっせーじ;
    this._ギルド名 = 情報._ギルド名;
  }

  _ギルド名;
  _めっせーじ;

  出力(ギルドを出力する = true, めっせーじを出力する = false, 無色 = false) {
    return `<span${無色 ? 空文字列 : ` style="color: ${this._色}"`}><img src="${this._アイコン}" />${this._名前}${ギルドを出力する && this._ギルド名 ? `＠${this._ギルド名}` : 空文字列}${めっせーじを出力する ? `＠${this._めっせーじ}` : 空文字列}</span>`;
  }
}

class メンバー extends ログインメンバー {
  constructor(情報) {
    super(情報);
    for (const [状態名, 状態] of Object.entries(情報)) {
      switch (状態名) {
        case "_ステータス":
          this[状態名] = ステータス.オブジェクトから(状態);
          break;
        case "_所持金":
        case "_カジノコイン":
        case "_福引券":
        case "_小さなメダル":
        case "_レアポイント":
          this[状態名] = 通貨.オブジェクトから(状態);
          break;
        case "_現職":
        case "_前職":
          this[状態名] = 状態 ? メンバーの職業.オブジェクトから(状態) : undefined;
          break;
        case "_現在地名":
          if (状態 === "家") {
            家.一覧(情報._家のユーザー名, this.#現在地を設定.bind(this), 情報._名前, 情報._ID);
          }
          else {
            this.#現在地を設定(場所.一覧(状態));
          }
          break;
        case "_実績":
          this[状態名] = new 実績(状態);
          break;
        default:
          this[状態名] = 状態;
          break;
      }
    }
    this._実績 ??= new 実績();
  }

  /**
   * 
   * @param {import("./MemberJob.js").メンバーの職業} 次職 
   * @returns 消費アイテム名
   */
  転職(次職) {
    this.ギルド?.ポイント増加(50);
    this.軌跡に書き込み(`${this.現職.名前}から${次職.名前}に転職`);
    // TODO 全体の傾向に追加
    // TODO ジョブマス確認
    const 消費アイテム名 = 次職.転職条件.消費アイテム名を取得(this);
    if (消費アイテム名 !== undefined) {
      this.装備アイテムを売る(消費アイテム名, 0);
    }
    this._転職回数 += 1;
    this._レベル = 1;
    this._経験値 = 0;
    this.ステータス.半減();
    if (次職.名前 === this.現職.名前) {
      this.アイコンをリセット();
      return 消費アイテム名;
    }
    this._前職 = this.現職;
    if (次職.名前 === this.前職.名前) {

    }
    this._現職 = 次職;
    this.アイコンをリセット();
    return 消費アイテム名;
  }

  可能ならレベルアップ() {
    if (this._レベル * this._レベル * 10 > this._経験値)
      return false;
    this.現職.レベルアップ(this.ステータス);
    return true;
  }

  一気にレベルアップ() {
    while (可能ならレベルアップ());
  }

  現職SP増加(増加量) {
    const 増加前現職SP = this._現SP;
    this._現SP += 増加量;
    // TODO: スキル習得ログ
  }

  async アイテムを使う(アイテム名) {
    const _アイテム = アイテム.一覧(アイテム名);
    if (アイテム名 === undefined || _アイテム === undefined || !await this.倉庫に存在する(アイテム名)) {
      return false;
    }
    if (_アイテム.使う()) {
      if (アイテム === this.道具.名前) {
        this.道具 = undefined;
      }
      this.倉庫から取り除く(アイテム);
    }
  }

  軌跡に書き込み(内容) {
    データベース操作.プレイヤー軌跡を追加([内容], this._ID);
  }

  プロフィールを更新(保存データ) {
    console.log(this._ID);
    データベース操作.プロフィールを更新(this._ID, 保存データ);
  }

  睡眠(時間, 上書きする = true) {
    this._起床時刻 = 時間 + ((上書きする || this.睡眠時間取得() === 0) ? 更新日時.取得() : this._起床時刻);
  }

  は睡眠中() {
    return this._起床時刻 !== undefined;
  }

  予定時刻を過ぎているなら起床する() {
    if (this._起床時刻 >= 更新日時.取得()) {
      return false;
    }
    this._起床時刻 = undefined;
    this._疲労 = 0;
    this.ステータス.ＨＰ.基礎値へ();
    this.ステータス.ＭＰ.基礎値へ();
    this._飲食済み = false;
    this.アイコンをリセット();
    return true;
  }

  睡眠時間取得() {
    return Math.max(this._起床時刻 - 更新日時.取得(), 0);
  }

  更新連打確認() {
    // TODO
    const 更新連打回数 = parseInt(ローカルセーブデータ.getItem("更新連打回数"));
    if (!更新連打回数) {
      return;
    }
    for (const [回数, 睡眠秒数] of 更新連打の睡眠秒数) {
      if (回数 > 更新連打回数)
        continue;
      this.睡眠(睡眠秒数, false);
      ローカルセーブデータ.setItem("更新連打回数", 0);
      データベース操作.プレイヤーを保存(this);
      エラー.表示(`<span class="die">前回のプレイ時に更新連打が${回数}回を超えていたので、${Math.round(睡眠秒数 / 60)}分間睡眠状態となります</span>`);
      return true;
    }
    ローカルセーブデータ.setItem("更新連打回数", 0);
    return false;
  }

  更新連打追加() {
    ローカルセーブデータ.setItem("更新連打回数", parseInt(ローカルセーブデータ.getItem("更新連打回数") + 1));
  }

  データベースに保存() {
    データベース操作.プレイヤーを保存(this);
  }

  データベースに錬金レシピを保存(錬金レシピ) {
    データベース操作.習得錬金レシピを保存(錬金レシピ, this._ID);
  }

  コンプリート(種別) {
    // TODO 職業・モンスター・錬金ならフラグ立て
    // TODO コレクションはテクニカルな感じで重複処理回避してるので要検討
    伝説のプレイヤー.登録(new ログインメンバー(this));
    プレイヤーの軌跡.書き込む(クラス付きテキスト("comp", `${種別} Complete!!`));
    ニュース.書き込む(クラス付きテキスト("comp", `${種別} ${あなた}が${種別}をコンプリートする！`));
  }

  バックアップ() {

  }

  家を取得() {
    return new 家(this.名前, this._ID);
  }

  場所移動(行き先) {
    this.#現在地のキャラクターから消去();
    if (行き先 instanceof 家) {
      this._家のユーザー名 = 行き先.所有者;
    }
    this.#現在地を設定(行き先);
  }

  async ログイン(パスワード, めっせーじ) {
    if (this.#パスワード確認(パスワード) || this.更新連打確認()) {
      return;
    }
    this._めっせーじ = めっせーじ;
    this._最終更新日時 = 更新日時.取得();
    //TODO this.トップに登録();
    ギルド.必要なら一覧出力();
    データベース操作.プレイヤーを保存(this);
    await メンバー.#必要ならプレイヤー削除と一覧更新();
  }

  ログアウト() {
    this.#現在地のキャラクターから消去();
    this.データベースに保存();
    throw "ログアウト";
  }

  削除(保存する = true) {
    this._ギルド.メンバー削除(this);
    メンバー.#一覧.remove(this);
    if (保存する)
      メンバー.保存();
  }

  現職名または前職名(職業名) {
    return this.現職.名前 === 職業名 || this.前職?.名前 === 職業名;
  }

  アイコンをリセット() {
    this._アイコン = this.現職.アイコン名を取得(this._性別);
  }

  装備(アイテム, アイテム図鑑に登録する = true) {
    let 交換アイテム名;
    if (アイテム instanceof 武器) {
      交換アイテム名 = this._武器;
      this._武器 = アイテム.名前;
    }
    else if (アイテム instanceof 防具) {
      交換アイテム名 = this._防具;
      this._防具 = アイテム.名前;
    }
    else if (アイテム instanceof 道具) {
      交換アイテム名 = this._道具;
      this._道具 = アイテム.名前;
    }
    else {
      throw new TypeError(`${アイテム名.名前}は装備できないアイテムです`);
    }
    if (アイテム図鑑に登録する) {
      // TODO
    }
    if (交換アイテム名 !== undefined) {
      // デフォルトに忠実
      データベース操作.倉庫内のアイテムを入れ替える(this._武器, 交換アイテム名, this._ID);
      return true;
    }
    return false;
  }

  アイテムに対応する装備スロットが空いている(アイテム) {
    if (アイテム instanceof 武器) {
      return this._武器 === undefined;
    }
    else if (アイテム instanceof 防具) {
      return this._防具 === undefined;
    }
    else if (アイテム instanceof 道具) {
      return this._道具 === undefined;
    }
    else {
      throw new TypeError(`${アイテム名}は装備できないアイテムです`);
    }
  }

  装備または倉庫に送る(アイテム名, アイテム図鑑に登録する = true) {
    this.倉庫にアイテムを送る(アイテム名, this._ID);
    const _アイテム = アイテム.一覧(アイテム名);
    if (!this.アイテムに対応する装備スロットが空いている(_アイテム)) {
      return false;
    }
    this.装備(_アイテム, アイテム図鑑に登録する);
    return true;
  }

  装備アイテムを売る(アイテム名, 価格) {
    if (this._武器 === アイテム名) {
      this._武器 = undefined;
    }
    else if (this._防具 === アイテム名) {
      this._防具 = undefined;
    }
    else if (this._道具 === アイテム名) {
      this._道具 = undefined;
    }
    else {
      throw new Error("装備中ではないアイテムは売れません");
    }
    this.所持金.収支(価格);
    データベース操作.アイテムを破棄(アイテム名, this._ID);
  }

  倉庫にアイテムを送る(アイテム名) {
    データベース操作.アイテムを入手(アイテム名, this._ID);
    // TODO 倉庫一杯かチェック
  }

  倉庫から取り除く(アイテム名) {
    データベース操作.アイテムを破棄(アイテム名, this._ID);
    // TODO 倉庫一杯かチェック
  }

  依頼を完了する(報酬名, ギルドポイント) {
    this.倉庫にアイテムを送る(報酬名);
    if (ギルドポイント) {
      this._ギルド?.ポイント増加(ギルドポイント);
    }
    this._実績.依頼ポイント増加();
  }

  錬金を始める(レシピ) {
    this._錬金中レシピ = レシピ;
  }

  錬金を完成させる() {
    if (this._錬金中レシピ === undefined) {
      return;
    }
    this._錬金完成済み = true;
  }

  錬金を受け取る() {
    if (!this._錬金完成済み) {
      return undefined;
    }
    const レシピ = this._錬金中レシピ;
    this.倉庫にアイテムを送る(レシピ.完成品名);
    this._実績.錬金ポイント増加();
    レシピ.作成済み = true;
    this.錬金レシピを登録(レシピ);
    this._錬金中レシピ = undefined;
    this._錬金完成済み = false;
    return レシピ;
  }

  ヘッダー用出力() {
    // TODO ステータスは武器防具込みのもの、素早さのみ max(0,素早さ)
    const 断片 = 強調テキスト(
      "ゴールド ", this.所持金.所持,
      "G / "
    );
    断片.append(
      this.ステータス.ヘッダー用3ステータス出力(),
      " /",
      this.ヘッダー用装備出力()
    );
    return 断片;
  }

  ヘッダー用装備出力() {
    const 断片 = document.createDocumentFragment();
    if (this._武器) {
      断片.appendChild(document.createTextNode(` E：${this._武器}`));
    }
    if (this._防具) {
      断片.appendChild(document.createTextNode(` E：${this._防具}`));
    }
    if (this._道具) {
      断片.appendChild(document.createTextNode(` E：${this._道具}`));
    }
    return 断片;
  }

  こうどう用装備出力(こうどう名) {
    const 断片 = document.createDocumentFragment();
    if (this._武器) {
      断片.appendChild(アイテム.一覧(this._武器).こうどう用出力(こうどう名));
    }
    if (this._防具) {
      断片.appendChild(アイテム.一覧(this._防具).こうどう用出力(こうどう名));
    }
    if (this._道具) {
      断片.appendChild(アイテム.一覧(this._道具).こうどう用出力(こうどう名));
    }
    return 断片;
  }

  が装備中(アイテム名) {
    return アイテム名 === this._武器 || アイテム名 === this._防具 || アイテム名 === this._道具;
  }

  疲労確認() {
    if (this._疲労 >= 疲労限界) {
      通知欄.追加("疲労がたまっています。「＠ほーむ」で家に帰り「＠ねる」で休んでください", "＠ほーむ");
      return true;
    }
    return false;
  }

  set ID(_ID) { this._ID = _ID; }
  set _現在地(_現在地名) { console.error("代わりに メンバー.prototype.場所移動(場所名) を使え"); }

  get 残り睡眠秒数() { return this._起床時刻 - 更新日時.取得(); }
  get _現在地() { return this.#現在地; }
  get 転職回数() { return this._転職回数; }
  get 現職() { return this._現職; }
  get 前職() { return this._前職; }
  get 所持金() { return this._所持金; }
  get カジノコイン() { return this._カジノコイン; }
  get 実績() { return this._実績; }
  get ステータス() { return this._ステータス; }
  get レベル() { return this._レベル; }

  static 新規登録(_名前, _パスワード, _職業名, _性別) {
    // TODO ブラックリスト
    // throw new Error("あなたのホストからは登録することが禁止されています");
    if (メンバー.#登録チェック(_名前, _パスワード, _職業名, _性別))
      return;
    // TODO 多重登録禁止
    // throw new Error("多重登録は禁止しています");
    const
      _ステータス = new ステータス(
        整数乱数(32, 30, true),
        整数乱数(8, 6, true),
        整数乱数(8, 6, true),
        整数乱数(8, 6, true),
        整数乱数(8, 6, true)
      ),
      _メンバー = new メンバー({
        _名前,
        _パスワード,
        _現職: {
          _職業名,
          _SP: 0
        },
        _所持金: {
          _所持: 200
        },
        _色: "#FFFFFF",
        _性別,
        _現在地名: "交流広場",
        _転職回数: 0,
        _レベル: 1,
        _アイコン: 転職可能な職業.一覧(_職業名).アイコン名を取得(_性別),
        _ステータス
      });
    セーブデータ.登録者数.増減(1);
    ニュース.書き込み(`<span class="強調">${_名前}</span> という冒険者が参加しました`);
    画面.一覧("トップ画面").新規登録完了表示(_名前, _パスワード, _職業名, _性別, _ステータス);
    //TODO 紹介ID付きなら紹介者に小さなメダル送信
    // データベース操作.アイテム入手("小さなメダル", ID, "$m{name}(紹介加入)");
    データベース操作.新規プレイヤー登録(_メンバー, `冒険者 <span class="強調">${_名前}</span> 誕生！`);
    return _メンバー;
  }

  static データベースから読み込む(名前, コールバック) {
    データベース操作.プレイヤーを読み込む(名前, コールバック);
  }

  _ID;
  _ギルド;
  _性別;
  _最終ログイン日時;
  _現在地名;
  _家のユーザー名;
  _壁紙;
  #現在地;
  /**
   * @type {ステータス}
   */
  _ステータス;
  /**
   * @type {number}
   */
  _レベル;
  /**
   * @type {number}
   */
  _経験値;
  /**
   * @type {メンバーの職業}
   */
  _現職;
  _前職;
  _転職回数;
  _所持金;
  _カジノコイン;
  _小さなメダル;
  _福引券;
  _レアポイント;
  _疲労;
  _オーブフラグ;
  _預かり所が空き;
  _宝を取得済み;
  _飲食済み;
  _錬金完成済み;
  _錬金中レシピ;
  _実績;
  _ダンジョンイベント;
  _錬金レシピ;
  _起床時刻;

  #プレイヤー一覧用出力() {
    const
      tr = document.createElement("tr"),
      項目名リスト = new Set("_性別", "_ギルド", "_レベル", "_転職回数", "_現職", "_前職", "_ステータス", "_所持金", "_カジノコイン", "_小さなメダル", "_武器", "_防具", "_道具", "_実績"),
      数値 = new Set("_レベル", "_転職回数", "_ステータス", "_実績");
    const td = document.createElement("td");
    td.innerHTML = `<a href="../player.cgi?id=$dir_name">${this._名前}</a><img src="../$icondir/${this._アイコン}" />`;
    tr.appendChild(td);
    for (const 項目名 of 項目名リスト) {
      if (this[項目名].プレイヤー一覧用出力) {
        const fragment = document.createDocumentFragment();
        for (const 出力 of this[項目名].プレイヤー一覧用出力()) {
          const td = document.createElement("td");
          td.textContent = 出力;
          if (数値.has(項目名))
            td.classList.add("数値");
          fragment.appendChild(td);
        }
        tr.appendChild(fragment);
      }
      else {
        const td = document.createElement("td");
        td.textContent = this[項目名];
        if (数値.has(項目名))
          td.classList.add("数値");
      }
      tr.appendChild(td);
    }
    const td2 = document.createElement("td");
    td2.textContent = this._最終ログイン日時;
    tr.appendChild(td2);
    return tr;
  }

  #現在地を設定(場所) {
    this.#現在地 = 場所 ?? 場所.一覧("交流広場");
    this._現在地名 = this.#現在地.名前;
  }

  #現在地のキャラクターから消去() {
    // 放置で自動消去されたなら何もしない
    if (this._場所別ID === undefined) {
      return;
    }
    データベース操作.場所別キャラクター一覧から削除(this.#現在地.ログ名, [this._場所別ID]);
    this._場所別ID = undefined;
  }

  #自動削除対象なら削除() {
    if (this._最終ログイン日時
      + ((this.転職回数 === 0 && this.レベル < 2) ? 新規プレイヤー自動削除日数 : プレイヤー自動削除日数) * 60 * 60 * 24
      >= 更新日時.取得()) {
      return false;
    }
    this.削除();
    return true;
  }

  static #必要ならプレイヤー削除と一覧更新() {
    const 現在日時 = 更新日時.取得();
    if (セーブデータ.プレイヤー一覧更新日時.取得() + プレイヤー一覧の更新周期日数 * 60 * 60 * 24 > 現在日時)
      return;
    const tBody = document.createElement("tbody");
    実績.ランキング作成開始();
    /* TODO cursor化
    for (const _メンバー of メンバー.#一覧) {
      //_メンバー.データ破損チェック(バックアップがあれば復旧); 破損していなければバックアップへ;
      if (_メンバー.#自動削除対象なら削除()) {
        continue;
      }
      実績.ランキング判定1(_メンバー);
      tBody.appendChild(_メンバー.#プレイヤー一覧用出力());
    }
    実績.ランキング作成開始2();
    for (const _メンバー of メンバー.#一覧) {
      実績.ランキング判定2(_メンバー);
    }
    //*/
    実績.ランキング出力();
    $id("プレイヤー一覧").appendChild(tBody);
    セーブデータ.プレイヤー一覧更新日時.保存(現在日時);
  }

  static #登録チェック(名前, パスワード, 職業名, 性別) {
    try {
      if (!名前)
        throw "プレイヤー名が入力されていません";
      if (パスワード === 空文字列)
        throw "パスワードが入力されていません";
      if (性別 === 空文字列)
        throw "性別が入力されていません";

      if (メンバー.#プレイヤー名に不正な文字が含まれているか.test(名前))
        throw "プレイヤー名に不正な文字( ,;\"'&<>@ )が含まれています";
      if (メンバー.#プレイヤー名にアットマークが含まれているか.test(名前))
        throw "プレイヤー名に不正な文字( ＠ )が含まれています";
      if (メンバー.#プレイヤー名に不正な空白が含まれているか.test(名前))
        throw "プレイヤー名に不正な空白が含まれています";
      if (全角を2とした文字列長(名前) > 8)
        throw "プレイヤー名は全角４(半角８)文字以内です";

      if (メンバー.#パスワードに半角英数字以外の文字が含まれているか.test(パスワード))
        throw "パスワードは半角英数字で入力して下さい";
      const パスワード長 = パスワード.length;
      if (パスワード長 < 4 || パスワード長 > 12)
        throw "パスワードは半角英数字４～12文字です";
      if (名前 === パスワード)
        throw "プレイヤー名とパスワードが同一文字列です";
      if (性別 !== "男" && 性別 !== "女")
        throw "性別が異常です";

      if (!初期職業.has(職業名))
        throw "職業が異常です";


      if (1 === 0) // TODO
        throw "その名前はすでに登録されています";
      if (セーブデータ.登録者数.取得() >= 最大登録人数)
        throw "現在定員のため、新規登録は受け付けておりません";
      const 最終ipアドレス = 1;
      const 現在ipアドレス = 2;
      if (最終ipアドレス === 現在ipアドレス) // TODO
        throw "多重登録は禁止しています";
    }
    catch (エラー内容) {
      エラー.表示(エラー内容);
      return true;
    }
    return false;
  }

  #パスワード確認(パスワード) {
    if (this._パスワード !== パスワード) {
      エラー.表示("パスワードが違います");
      return true;
    }
    return false;
  }

  static #一覧;
  static #プレイヤー名に不正な文字が含まれているか = Object.freeze(new RegExp(/[,;\"\'&<>\@]/));
  static #プレイヤー名にアットマークが含まれているか = Object.freeze(new RegExp(/＠/));
  static #プレイヤー名に不正な空白が含まれているか = Object.freeze(new RegExp(/＠/));
  static #パスワードに半角英数字以外の文字が含まれているか = Object.freeze(new RegExp(/[^0-9a-zA-Z]/));
}