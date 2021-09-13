"use strict";

import { キャラクター } from "../character/Character.js"

export class 戦闘メンバー extends キャラクター {
  constructor({
    名前, アイコン, 色, 最終更新日時, 場所別ID, 経験値 = 0, 所持金 = 0,
    ＨＰ = 2, ＭＰ = 0, 攻撃力 = 0, 守備力 = 0, 素早さ = 0,
    現在ＨＰ, 現在ＭＰ, 現在攻撃力, 現在守備力, 現在素早さ,
    現職名, 前職名, 命中率 = 戦闘メンバー.命中率初期値
  }) {
    super(名前, アイコン, 色, 最終更新日時, 場所別ID);
    this._ステータス = new ステータス(ＨＰ, ＭＰ, 攻撃力, 守備力, 素早さ, 現在ＨＰ, 現在ＭＰ, 現在攻撃力, 現在守備力, 現在素早さ);
    this.#現職 = 職業.一覧(現職名);
    this.#前職 = 職業.一覧(前職名);
  }

  チャット書き込み予約(内容, 宛て先) {
    this.現在地.チャット書き込み予約(...arguments);
  }

  スキル実行(スキル名) {
    return (this.現職.スキルを取得(スキル名) ?? this.前職.スキルを取得(スキル名))?.実行();
  }

  * メンバー全員(気にしないかまたは敵か味方か = undefined, 気にしないかまたは死んでいるメンバーだけか以外か = undefined, 自分を除く = false) {
    for (const メンバー of this.現在地.メンバー全員()) {
      if (
        (気にしないかまたは敵か味方か === undefined || !(気にしないかまたは敵か味方か ^ メンバー.は敵()))
        && (気にしないかまたは死んでいるメンバーだけか以外か === undefined || (気にしないかまたは死んでいるメンバーだけか以外か ^ メンバー.は死んでいる()))
        && (!自分を除く || メンバー.名前 !== あなた.名前)
      ) {
        yield メンバー;
      }
    }
  }

  ランダムスキル() {
    // TODO ＭＰとSP
    ランダムな1要素([...this.現職.スキル, ...this.前職.スキル]).実行();
  }

  ステータスを表示() {
    return `<br />${this.名前} ${this.ステータス.出力()}`;
  }

  リセット(テンションをリセットする = true) {
    this._状態異常 = undefined;
    this._一時的状態 = undefined;
    if (テンションをリセットする) {
      this._テンション = undefined;
    }
    this.命中率を初期値に(null);
    this.ステータス.再計算(this._武器, this._防具, this._道具);
  }

  モシャス(戦闘メンバー) {
    this._ステータス = ステータス.オブジェクトから(戦闘メンバー.ステータス);
    this.#現職 = 戦闘メンバー.#現職;
    this.#前職 = 戦闘メンバー.#前職;
    this.アイコン = 戦闘メンバー._アイコン;
  }

  はメタル耐性を持っている(テキストを表示する = true) {
    const 耐性がある = this.ステータス.守備力.基礎値 > 999;
    if (耐性がある && テキストを表示する) {
      this.耐性();
    }
    return 耐性がある;
  }

  は即死耐性を持っている(テキストを表示する = true) {
    const 耐性がある = this.ステータス.ＨＰ.現在値 > 999 || this.はメタル耐性を持っている(false);
    if (耐性がある && テキストを表示する) {
      this.耐性();
    }
    return 耐性がある;
  }

  はスーパーハイテンションになれる() {
    return (this._レベル >= 25) && (this._レベル > 19 + Math.random() * 50);
  }

  は死んでいる() {
    return this.ステータス.ＨＰ.現在値 <= 0;
  }

  は敵(あなた) {
    return あなた._色 !== this._色;
  }

  はメンバー一覧に表示する(あなた) {
    return !this.は死んでいる() || (this.は敵(あなた) && !this.はNPC());
  }

  はNPC() {
    return 戦闘メンバー.#NPCかどうか.test(this.名前);
  }

  宝箱の中身を取得() {
    if (!戦闘メンバー.#宝箱かどうか.test(this.名前)) {
      return undefined;
    }
    if (this._経験値 === 0) {
      return null;
    }
    return アイテム.経験値とゴールドからアイテム名を取得(this._経験値, this._ゴールド);
  }

  においを取得() {
    const 中身 = this.宝箱の中身を取得();
    if (中身 === undefined) {
      this.チャット書き込み予約(`${this.名前}は ${ランダムな1要素(this.におい候補)} においがする`);
    }
    else {
      this.チャット書き込み予約(`宝箱の中身は ${中身 ?? 戦闘メンバー.#空の宝箱の中身} のようだ…`);
    }
  }

  何もしない() {
    this.チャット書き込み予約("しかし、何も起こらなかった…");
  }

  /**
   * 
   * @param {戦闘メンバー} 相手
   * @returns {boolean} 成功ならtrue
   */
  素早さ対抗判定(相手) {
    return 確率(1 / 3)
      && (Math.random() * this.ステータス.素早さ.現在値 >= Math.random() * 相手.ステータス.素早さ.現在値 * 3);
  }

  /**
   * 回避判定をして、テキストを出力する
   * @param {number} 確率 回避成功率
   * @returns {boolean} 回避成功ならtrue
   */
  回避(確率) {
    if (確率(確率)) {
      使用者.チャット書き込み予約(`${this.名前}はかわした！`);
      return true;
    }
    return false;
  }

  /**
   * 
   * @param {boolean} [末尾三点リーダ] メッセージの最後に『…』を入れるか
   */
  耐性(末尾三点リーダ = true) {
    this.チャット書き込み予約(`${this.名前}にはきかなかった${末尾三点リーダ ? "…" : "！"}`);
  }

  ＨＰ回復(回復量, 蘇生 = false) {
    if (!蘇生 && this.は死んでいる()) {
      return;
    }
    回復量 = Math.trunc(回復量);
    this.ステータス.ＨＰ.現在値 += 回復量;
    this.チャット書き込み予約(`<b>${名前}</b>のＨＰが <span class="heal">${回復量}</span> 回復した！`);
  }

  必要なら生き返ってからＨＰ全回復() {
    this.チャット書き込み予約(this.は死んでいる() ? `${名前}のＨＰが<span class="heal">全回復</span>した！` : `<span class="revive">${名前}が生き返った！</span>`);
    this.ステータス.ＨＰ.基礎値へ();
  }

  蘇生(ＨＰ割合, _確率, 全体技か) {
    if (!確率(_確率)) {
      const 表示文 = 全体技か ? 強調テキスト("しかし、", this.名前, "は生き返らなかった…")
        : `しかし、${this.名前}は生き返らなかった…`;
      this.チャット書き込み予約(表示文);
      return;
    }
    const 表示文 = 全体技か ? 強調テキスト("なんと、", this.名前, `が ${クラス付きテキスト("heal", "生き返り")} ました！`)
      : _確率 !== 1 ? `なんと、${クラス付きテキスト("revive", `${this.名前}が生き返りました！`)}`
        : クラス付きテキスト("revive", `${this.名前}が生き返った！`);
    this.チャット書き込み予約(表示文);
    this.ステータス.ＨＰ.基礎値へ(ＨＰ割合);
  }


  死亡(耐性を無視する = false, 経験値を配る = true) {
    if (!耐性を無視する && (this.は即死耐性を持っている())) {
      return;
    }
    // TODO
  }

  即死(命中率) {
    if (this.は死んでいる() || this.は即死耐性を持っている() || this.回避(1 - 命中率)) {
      return;
    }
    this.チャット書き込み予約(`${this.名前}は死んでしまった！`);
    this.死亡();
  }

  ダメージ(ダメージ量, 表示文章取得関数, 死亡時表示文 = "をたおした！") {
    ダメージ量 = Math.trunc(ダメージ量);
    if (ダメージ量 <= 0) {
      ダメージ量 = 整数乱数(2, 1, true);
    }
    this.ステータス.ＨＰ.現在値 -= ダメージ量;
    if (表示文章取得関数 !== null) {
      this.チャット書き込み予約(表示文章取得関数?.() ?? `<b>${this.名前}</b>に <span class="damage">${ダメージ量}</span> のダメージ！`);
    }
    if (this.は死んでいる()) {
      this.ステータス初期化();
      if (死亡時表示文 !== null) {
        this.チャット書き込み予約(クラス付きテキスト("die", `${this.名前}${死亡時表示文}`));
      }
    }
  }

  ＨＰを1にする() {
    this.チャット書き込み予約(`${this.名前}は${クラス付きテキスト("st_down", "生命力を失った")}！`);
    this.ステータス.ＨＰ.現在値 = 1;
  }

  ＭＰ回復(回復量) {
    回復量 = Math.trunc(回復量);
    this.チャット書き込み予約(強調テキスト(空文字列, this.名前, `のＭＰが ${クラス付きテキスト("heal", 回復量)} 回復した！`));
    this.ステータス.ＭＰ.現在値 += 回復量;
  }

  ステータスを上げる() {

  }

  ステータスを下げる(現在ステータス名, 効果係数, 追加効果か = false) {
    if (this.はメタル耐性を持っている(!追加効果か) || ((現在ステータス名 === "ＨＰ" || 現在ステータス名 === "攻撃力") && this.は即死耐性を持っている(!追加効果か))) {
      return;
    }
    const ステータス = this.ステータス[ステータス名];
    if (0) { // TODO
      if (!追加効果か) {
        this.チャット書き込み予約(`${this.名前}にはこれ以上効果がないようだ…`);
      }
      return;
    }
    let 効果値 = ステータス.現在値 * 効果係数;
    if (現在ステータス名 === "ＭＰ" && 効果値 > 150 * あなた.テンション) {
      効果値 = int(rand(50) + 100 * あなた.テンション);
    }
    this.ステータス[ステータス名].現在値 -= 効果値;
    this.チャット書き込み予約(`${this.名前}の<span class="st_down">${ステータス名}が ${効果値} さがった！</span>`);
    return 効果値;
  }

  命中率を下げる(効果係数, 追加効果か = false) {
    if (this.はメタル耐性を持っている(!追加効果か)) {
      return;
    }
    if (this.命中率 < 50) {
      this.チャット書き込み予約(`${this.名前}にはこれ以上効果はないようだ…`);
      return;
    }
    const 効果値 = this._命中率 * 効果係数;
    this._命中率 = max(this._命中率 - 効果値, 50);
    this.チャット書き込み予約(`${this.名前}の<span class="st_down">命中率が ${効果値} さがった！</span>`);
    return 効果値;
  }

  命中率を初期値に(文章表示用関数) {
    this._命中率 = 戦闘メンバー.命中率初期値;
    if (文章表示用関数 === null) {
      return;
    }
    this.チャット書き込み予約(クラス付きテキスト("st_up", 文章表示用関数?.(this.名前) ?? `${this.名前}は心を落ちつかせ命中率が回復した`));
  }

  一時的状態にする(一時的状態名, 表示文) {
    this.一時的状態 = 一時的状態.一覧(一時的状態名);
    if (表示文 !== null) {
      const 文章 = 表示文 !== undefined ? クラス付きテキスト("tmp", `${this.戦闘メンバー.名前}${表示文}`)
        : this.一時的状態.文章を表示(this);
      this.チャット書き込み予約(文章);
    }
  }

  状態異常にする(状態異常名, テンションを解除する = true, テキストを表示する = true) {
    this.状態異常 = 状態異常.一覧(一時的状態名);
    if (テンションを解除する) {
      this.テンションを消費();
    }
    if (テキストを表示する) {
      this.チャット書き込み予約(クラス付きテキスト("state", `${this.名前}の状態が${this.状態異常名}になりました！`));
    }
  }

  状態異常を解除(状態異常名) {
    if (状態異常名 !== undefined && this.状態異常.名前 !== 状態異常名) {
      this.チャット書き込み予約(`<span class="heal">${this.名前}には効果がないようだ…</span>`);
      return;
    }
    this.チャット書き込み予約(クラス付きテキスト("heal", `${this.名前}の${this.状態異常.名前}が治りました！`));
    this.状態異常 = undefined;
  }

  テンションを上げる(スーパーハイテンションになれる = this.はスーパーハイテンションになれる()) {
    const 次 = this._テンション.次を取得(スーパーハイテンションになれる);
    if (次 === undefined || (次.名前 === "Sﾊｲﾃﾝｼｮﾝ" && !スーパーハイテンションになれる)) {
      this.チャット書き込み予約(`${this.名前}のテンションはこれ以上あがらないようだ`);
      return;
    }
    this._テンション = 次;
    this._テンション.上昇時用出力();
  }

  テンションを消費() {
    if (this.テンション === undefined) {
      return 1;
    }
    const 倍率 = this.テンション.倍率;
    this.テンション = undefined;
    return 倍率;
  }

  ヘッダー用出力() {
    const 断片 = this.ステータス.ヘッダー用出力();
    断片.appendChild(document.createTextNode(
      ` ${this.現職.toString()}${this.前職 ?
        ` ${this.前職.toString()}` : 空文字列}${this._道具 ?
          ` E：${this._道具.名前}` : 空文字列}`
    ));
    return 断片;
  }

  場所用出力() {
    const
      全体枠 = document.createElement("div"),
      名前枠 = document.createElement("div"),
      ＨＰ表示 = document.createElement("div"),
      ＨＰゲージ枠 = document.createElement("div"),
      ＨＰゲージ内容 = document.createElement("div"),
      アイコン = document.createElement("img");
    全体枠.classList.add("メンバー");
    if (this.一時的状態 || this.状態異常) {
      if (this.一時的状態) {
        名前枠.appendChild(クラス付きテキスト("state", this.一時的状態.名前));
      }
      if (this.状態異常) {
        名前枠.appendChild(クラス付きテキスト("tmp", this.状態異常.名前));
      }
    }
    else if (this.テンション) {
      名前枠.appendChild(this.テンション.メンバー用出力());
    }
    const ＨＰ = this.ステータス.ＨＰ;
    ＨＰ表示.append(
      ＨＰ.現在値 > 999 ? 戦闘メンバー.#即死耐性所持時の現在ＨＰ表示 : ＨＰ.現在値,
      クラス付きテキスト("仕切り線", " / "),
      ＨＰ.基礎値 > 999 ? 戦闘メンバー.#即死耐性所持時の現在ＨＰ表示 : ＨＰ.基礎値,
    );
    アイコン.src = `resource/icon/${this.死んでいる() ? "chr/099.gif" : this.アイコン名}`;
    アイコン.alt = this.名前;
    ＨＰゲージ枠.classList.add("gage_back2");
    ＨＰゲージ内容.style.width = `${Math.trunc(this.ステータス.ＨＰ.現在値 / this.ステータス.ＨＰ.基礎値 * 100)}%`;
    ＨＰゲージ枠.appendChild(ＨＰゲージ内容);
    チャットフォーム.文字列登録イベントを追加(全体枠, `>${this.名前} `);
    全体枠.append(ＨＰ表示, ＨＰゲージ枠, ` ${this.名前} `, アイコン);
    return 全体枠;
  }

  #ステータス減少チェック(下限) {
    if (this.はメタル耐性を持っている(!追加効果か) || ((ステータス名 === "ＨＰ" || ステータス名 === '攻撃力') && this.は即死耐性を持っている(!追加効果か))) {
      return true;
    }
    if (this.ステータス[ステータス名] < 下限) {
      this.チャット書き込み予約(`${this.名前}にはこれ以上効果はないようだ…`);
    }
    return false;
  }

  get 名前() { return this.名前; }
  get ステータス() { return this._ステータス; }

  _ステータス;
  _命中率;

  #現職;
  #前職;

  static #NPCかどうか = new RegExp(/^@/);
  static #宝箱かどうか = new RegExp(/^@.+宝箱.$/);
  static #即死耐性所持時の現在ＨＰ表示 = "???";
  static #命中率初期値 = 95;
  static #におい候補 = ["いい", "おいしそうな", "バラの", "あまい", "変な", "やばい", "さわやかな", "ワイルドな"];
  static #空の宝箱の中身 = "からっぽ";
}