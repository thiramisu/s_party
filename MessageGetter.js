// @ts-check
"use strict";

export class MessageGetter  {
  static newEntry(name, sex, job, hp, mp, at, df, ag) {
    return {
      content: '以下の内容で登録しました\n**※見た目だけ**',
      embeds: [
        {
          title: '新規登録完了',
          description: name,
          fields: [
            {
              name: '性別',
              value: sex,
              inline: true,
            },
            {
              name: '職業',
              value: job,
              inline: true,
            },
            {
              name: 'ＨＰ',
              value: hp.toString(),
              inline: true,
            },
            {
              name: 'ＭＰ',
              value: mp.toString(),
              inline: true,
            },
            {
              name: '攻撃力',
              value: at.toString(),
              inline: true,
            },
            {
              name: '守備力',
              value: df.toString(),
              inline: true,
            },
            {
              name: '素早さ',
              value: ag.toString(),
              inline: true,
            },
          ],
        },
      ],
    }
  }
}