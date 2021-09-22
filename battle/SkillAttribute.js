// @ts-check
"use strict";

 export class 属性 {
    /**
    * @param {string} 正式名
    * @param {string} 短縮名
    * @param {string} [使用可能の文章]
    * @param {string} [反撃時の文章]
    */
    constructor(正式名, 短縮名, 使用可能の文章, 反撃時の文章) {
      this.#正式名 = 正式名;
      this.#短縮名 = 短縮名;
      this.#使用可能の文章 = 使用可能の文章;
      this.#反撃時の文章 = 反撃時の文章;
      属性.#一覧.add(this);
    }

    toString() { return this.#正式名; }

    get 短縮名() { return this.#短縮名; }
    get 使用可能の文章() { return this.#使用可能の文章; }
    get 反撃時の文章() { return this.#反撃時の文章; }

    static get 道具() { return undefined; }
    static get 無() { return undefined; }
    static get 攻() { return 属性.#物理; }
    static get 魔() { return 属性.#魔法; }
    static get 踊() { return 属性.#踊り; }
    static get 息() { return 属性.#息; }

    #正式名;
    #短縮名;
    #使用可能の文章;
    #反撃時の文章;

    * 全て() {
      for (const _属性 of 属性.#一覧) {
        yield _属性;
      }
    }

    static #一覧 = new Set();
    static #物理 = new 属性("物理攻撃", "攻", "物理攻撃ができる");
    static #魔法 = new 属性("魔法", "魔", "魔法が使える");
    static #踊り = new 属性("踊り", "踊", "踊れる", "踊り返した");
    static #息 = new 属性("ブレス", "息");
  }