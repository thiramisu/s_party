"use strict";

export class エラー {
  static 表示(内容) {
    // TODO
  }

  static ページが見つかりませんでした() {
    エラー.表示("ページが見つかりませんでした");
  }

  static プレイヤーが存在しません(名前) {
    エラー.表示(`そのような名前${名前}のプレイヤーが存在しません`);
  }
}
