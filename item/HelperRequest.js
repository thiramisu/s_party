class 何でも屋の依頼 extends 陳列可能インターフェース {
  constructor(ID, 名前, 期限, 納品名, 納品数, 報酬名, 魔物依頼, ギルド依頼) {
    super(名前);
    // DB保存用
    this._名前 = 名前;

    this._ID = ID;
    this._期限 = 期限;
    this._納品名 = 納品名;
    this._納品数 = 納品数;
    this._報酬名 = 報酬名;
    this._魔物依頼 = 魔物依頼;
    this._ギルド依頼 = ギルド依頼;
  }

  _陳列用出力(ギルドマークを出力してかいけつを出さない = true) {
    const 必要アイテム = document.createDocumentFragment();
    必要アイテム.appendChild(document.createTextNode("【"));
    if (ギルドマークを出力してかいけつを出さない && this._ギルド依頼) {
      const img = document.createElement("img");
      img.src = "resource/icon/etc/mark_guild.gif";
      img.alt = "ギルド専用";
      必要アイテム.appendChild(img);
    }
    必要アイテム.append(this.#必要アイテム文字列取得(), "】");
    return super._陳列用出力(ギルドマークを出力してかいけつを出さない ? undefined : `かいけつ`,
      `『${this.名前}』`,
      必要アイテム,
      `★${this._報酬名}`,
      `〆${更新日時.タイムスタンプ文字列(this._期限)}まで`
    );
  }

  期限切れなら更新() {
    if (this._期限 >= 更新日時.取得()) {
      return undefined;
    }
    何でも屋の依頼.新規登録(this._ID);
    return `『${this.名前}』は誰も解決できそうにないので、新しい依頼がきました！<br>`;
  }

  解決() {
    if (this.#解決チェック())
      return undefined;
    あなた.依頼を完了する(this._報酬名, 100);
    何でも屋の依頼.新規登録(this._ID);
    return `${this.#必要アイテム文字列取得()} たしかに受け取りました。こちらが報酬の ${this._報酬名} になります！${あなた}さんの預り所に送っておきますね！`;
  }

  static 新規登録(ID) {
    const 依頼 = 何でも屋の依頼.#依頼の情報リスト.get((確率(何でも屋のレア依頼の確率)) ? "レア" : "通常").新規依頼作成(ID);
    データベース操作.何でも屋の依頼を更新(依頼, ID);
  }

  static オブジェクトから({ _ID, _名前, _期限, _納品名, _納品数, _報酬名, _魔物依頼, _ギルド依頼 }) {
    return new 何でも屋の依頼(_ID, _名前, _期限, _納品名, _納品数, _報酬名, _魔物依頼, _ギルド依頼);
  }

  static ダミーデータ取得(ID) {
    if (ID > 8) {
      const 依頼 = 何でも屋の依頼.#依頼の情報リスト.get((確率(何でも屋のレア依頼の確率)) ? "レア" : "通常").新規依頼作成(ID);
      依頼._期限 = 整数乱数(1160104560, 1259940495);
      return 依頼;
    }
    // データベース初期化時用
    // デフォルトに忠実
    return new 何でも屋の依頼(ID, [
      "強くなりたくてその752",
      "あこがれの服その650",
      "用途は秘密ですその521",
      "用途は秘密ですその888",
      "病気を治すためにその685",
      "着てみたいその105",
      "あこがれの服その615",
      "流行なのでその114",
      "非常用にその240"
    ][ID],
      [1260078628, 1259940495, 1260104448, 1260104673, 1260104673, 1260104686, 1260094414, 1260104560, 1260104448][ID],
      ["鉄の斧", "忍びの服", "ﾓﾝｽﾀｰ金貨", "ﾓﾝｽﾀｰ銀貨", "魔法の聖水", "水の羽衣", "ｽﾗｲﾑｱｰﾏｰ", "魔法の法衣", "悪魔のしっぽ"][ID],
      [4, 6, 5, 2, 3, 4, 2, 10, 5][ID],
      ["馬のﾌﾝ", "魔除けの聖印", "聖者の灰", "聖者の灰", "金塊", "応用錬金ﾚｼﾋﾟ", "金塊", "馬のﾌﾝ", "聖者の灰"][ID],
      false,
      ID === 1 || ID === 7
    );
  }

  static 初期化() {
    何でも屋の依頼.#依頼の情報リスト = new Map([
      ["通常", new 依頼の候補(
        [
          [...アイテム.名前範囲("ひのきの棒", "ﾋﾞｯｸﾞﾎﾞｳｶﾞﾝ")],
          [...アイテム.名前範囲("布の服", "水の羽衣")],
          [
            ...アイテム.名前範囲("薬草", "水の羽衣"),
            ...アイテム.名前範囲("精霊の守り", "へんげの杖"),
            ...アイテム.名前範囲("ｼﾙﾊﾞｰｵｰﾌﾞ", "ﾊﾟｰﾌﾟﾙｵｰﾌﾞ"),
            ...アイテム.名前範囲("身代わり人形", "復活の草"),
            "ﾁｮｺﾎﾞの羽"
          ],
          [...new 範囲(4, 120), ...new 範囲(198, 260)],
          [...new 範囲(1, 3)]
        ],
        [...new 連続("応用錬金ﾚｼﾋﾟ", 3), ...アイテム.名前範囲("馬のﾌﾝ", "聖者の灰"), ...new 連続("金塊", 2)]
      )],
      ["レア", new 依頼の候補(
        [
          [...アイテム.名前範囲("諸刃の剣", "ﾊｸﾞﾚﾒﾀﾙの剣")],
          [...アイテム.名前範囲("闇の衣", "ﾊｸﾞﾚﾒﾀﾙの鎧")],
          [
            "勇者の証", "邪神像", "ｼﾞｪﾉﾊﾞ細胞", "ｴｯﾁな本", "天馬のたづな",
            ...アイテム.名前範囲("ﾗｰの鏡", "天空の盾と兜"),
            ...アイテム.名前範囲("次元のｶｹﾗ", "宝物庫の鍵"),
            "ｲﾝﾃﾘﾒｶﾞﾈ"
          ],
          [...new 範囲(500, 579)],
          [...new 範囲(160, 165)]
        ],
        [...new 連続("神の錬金ﾚｼﾋﾟ", 3), ...アイテム.名前範囲("ｽﾗｲﾑの冠", "ﾛﾄの印")]
      )]
    ]);
  }

  static _陳列用ヘッダー項目名リスト = ["依頼名", "クリア条件", "報酬", "期限"];

  #解決チェック() {
    try {
      if (this._ギルド依頼 && !あなた.メンバー.ギルド === undefined)
        throw `${this.名前}はギルド専用のクエストよ。ギルドに加入していないと依頼を受けることができないわ`;
      if (this._魔物依頼 ? モンスター倉庫.画像から削除(this._納品名, this._納品数) : アイテム倉庫.削除(this._納品名, this._納品数))
        throw `${this.#必要アイテム文字列取得()} の条件を満たしてないようです`;
    }
    catch (エラー) {
      通知欄.追加(エラー);
      return true;
    }
    return false;
  }

  #必要アイテム文字列取得() {
    if (!this._魔物依頼) {
      return アイテム.一覧(this._納品名).名前と個数出力(this._納品数);
    }
    const img = document.createElement("img");
    img.src = `resource/icon/mon/${("000" + this._納品名).slice(-3)}.gif`;
    return アイテム.名前と個数出力(this._納品数, "匹", img);
  }

  #納品;

  static #依頼の情報リスト;
}

class 依頼の候補 {
  constructor(納品候補リスト, 報酬候補リスト) {
    this.#納品候補リスト = 納品候補リスト;
    this.#報酬候補リスト = 報酬候補リスト;
  }

  新規依頼作成(ID) {
    const
      種類 = 整数乱数(4),
      魔物依頼 = 種類 === 3,
      ギルド依頼 = 確率(何でも屋のギルド依頼の確率),
      依頼名 = 依頼の候補.ランダムな依頼名取得(種類),
      期限日時 = 更新日時.取得() + 60 * 60 * 24 * 何でも屋の解決期限日数,
      必要数 = (魔物依頼 ? 整数乱数(何でも屋の魔物依頼の最大必要数, 何でも屋の魔物依頼の最小必要数, true)
        : 整数乱数(何でも屋のアイテム依頼の最大必要数, 何でも屋のアイテム依頼の最小必要数, true))
        * (ギルド依頼 ? 何でも屋のギルド依頼の必要数倍率 : 1),
      報酬名 = ギルド依頼 ? 何でも屋のギルド依頼の固定報酬 : ランダムな1要素(this.#報酬候補リスト),
      納品名 = ランダムな1要素(this.#納品候補リスト[種類]);
    // TODO if (魔物依頼 && 存在しない画像) { 納品名 = ランダムな1要素( this.#納品名候補リスト[4])}
    // ローカルならimgElement.onerrorとか？

    return new 何でも屋の依頼(ID, 依頼名, 期限日時, 納品名, 必要数, 報酬名, 魔物依頼, ギルド依頼);
  }

  static ランダムな依頼名取得(種類) {
    return ランダムな1要素([
      ["店を始めたいので", "強くなりたくて", "戦い用に", "ライバルに勝ちたくて", "見てみたい", "趣味で", "家宝にしたい", "探しています"],
      ["コンプリートのために", "カッコ良くなりたい", "オシャレになりたくて", "あこがれの服", "プレゼント用に", "着てみたい", "集めたい", "流行なので"],
      ["コレクション用", "病気を治すために", "非常用に", "必要なんです", "大好物なので", "気になるので", "自分用に欲しい", "用途は秘密です"],
      ["かわいいので", "ペットほしい", "仲良くなりたい", "プニプニしたい", "いやされたい", "触ってみたい", "背中に乗ってみたい", "幸せになるために", "王国を作るために"]
    ][種類]) + "その" + 整数乱数(999, 1, true);
  }

  #納品候補リスト;
  #報酬候補リスト;
}
