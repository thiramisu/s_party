// @ts-check
"use strict";

export class MessageGetter {
  /**
   * @param {import("./character/Character").メンバー} メンバー
   */
  static newEntry(メンバー) {
    return {
      content: "以下の内容で登録しました",
      embeds: [
        {
          title: "新規登録完了",
          description: メンバー.名前,
          fields: [
            {
              name: "性別",
              value: メンバー.性別,
              inline: true,
            },
            {
              name: "職業",
              value: メンバー.現職.名前,
              inline: true,
            },
            {
              name: "ＨＰ",
              value: メンバー.ステータス.ＨＰ.現在値.toString(),
              inline: true,
            },
            {
              name: "ＭＰ",
              value: メンバー.ステータス.ＨＰ.現在値.toString(),
              inline: true,
            },
            {
              name: "攻撃力",
              value: メンバー.ステータス.攻撃力.現在値.toString(),
              inline: true,
            },
            {
              name: "守備力",
              value: メンバー.ステータス.守備力.現在値.toString(),
              inline: true,
            },
            {
              name: "素早さ",
              value: メンバー.ステータス.素早さ.現在値.toString(),
              inline: true,
            },
          ],
        },
      ],
    }
  }
}