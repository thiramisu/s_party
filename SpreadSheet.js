//@ts-check
"use strict";

import { GoogleSpreadsheet } from "google-spreadsheet"

/**
 * @typedef {import("discord.js").Snowflake} Snowflake
 * @typedef {import("google-spreadsheet").GoogleSpreadsheetWorksheet} GoogleSpreadsheetWorksheet
 * @typedef {import("google-spreadsheet").GoogleSpreadsheetCell} GoogleSpreadsheetCell
 */

/**
 * @typedef {"serverID"
 * | "playerID"
 * | "storedItemName"
 * | "storedMonsterName"
 * | "guildName"
 * | "loggedInPlayerName"
 * | "questName"
 * | "helperRequestName"
 * | "mashedPlayerName"} SearchCategory
 */

/**
 * @enum {string} シート名
 */
const SHEET_NAME = {
  search: "検索"
};

/**
 * 最初の行は1
 * @type {Map<SearchCategory,Row>}
 */
const SEARCH_ROW = new Map([
  ["serverID", 2],
  ["playerID", 3],
  ["storedItemName", 4],
  ["storedMonsterName", 5],
  ["guildName", 6],
  ["loggedInPlayerName", 7],
  ["questName", 8],
  ["helperRequestName", 9],
  ["mashedPlayerName", 10]
]);

/**
 * 最初の列は1
 */
const SEARCH_INPUT_COLUMN = 2;
const SEARCH_OUTPUT_COLUMN = 3;

export class Spreadsheet {
  /**
   * 
   * @param {Snowflake} serverID 
   * @returns {Promise<CellValueResolvable>}
   */
  static searchServer(serverID) {
    return this.#searcher("serverID", { serverID });
  }

  /**
   * 
   * @param {Snowflake} serverID 
   * @param {Snowflake} playerID 
   * @returns {Promise<CellValueResolvable>}
   */
  static searchPlayer(serverID, playerID) {
    return this.#searcher("playerID", { serverID, playerID });
  }

  /**
   * 
   * @param {Snowflake} serverID 
   * @param {Snowflake} playerID 
   * @param {string} storedItemName 
   * @returns {Promise<CellValueResolvable>}
   */
  static searchPlayerStoredItem(serverID, playerID, storedItemName) {
    return this.#searcher("storedItemName", { serverID, playerID, storedItemName });
  }

  /**
   * 
   * @param {Snowflake} serverID 
   * @param {Snowflake} playerID 
   * @param {string} storedMonsterName 
   * @returns {Promise<CellValueResolvable>}
   */
  static searchPlayerStoredMonster(serverID, playerID, storedMonsterName) {
    return this.#searcher("storedItemName", { serverID, playerID, storedMonsterName });
  }

  /**
   * @param {Snowflake} serverID
   * @param {string} guildName
   * @returns {Promise<CellValueResolvable>}
   */
  static searchGuild(serverID, guildName) {
    return this.#searcher("guildName", { serverID, guildName });
  }

  /**
   * 
   * @param {Snowflake} serverID 
   * @param {Snowflake} playerID 
   * @param {string} loggedInPlayerName 
   * @returns {Promise<CellValueResolvable>}
   */
  static searchLoggedInPlayer(serverID, playerID, loggedInPlayerName) {
    return this.#searcher("loggedInPlayerName", { serverID, playerID, loggedInPlayerName });
  }

  /**
   * 
   * @param {Snowflake} serverID 
   * @param {Snowflake} playerID 
   * @param {string} questName 
   * @returns {Promise<CellValueResolvable>}
   */
  static searchQuest(serverID, playerID, questName) {
    return this.#searcher("questName", { serverID, playerID, questName });
  }

  /**
   * 
   * @param {Snowflake} serverID 
   * @param {Snowflake} playerID 
   * @param {string} helperRequestName 
   * @returns {Promise<CellValueResolvable>}
   */
  static searchHelperRequest(serverID, playerID, helperRequestName) {
    return this.#searcher("helperRequestName", { serverID, playerID, helperRequestName });
  }

  /**
   * 
   * @param {Snowflake} serverID 
   * @param {Snowflake} playerID 
   * @param {string} mashedPlayerName 
   * @returns {Promise<CellValueResolvable>}
   */
  static searchMashedPlayer(serverID, playerID, mashedPlayerName) {
    return this.#searcher("mashedPlayerName", { serverID, playerID, mashedPlayerName });
  }

  static async #initIfNeeded() {
    if (this.#spreadsheet !== undefined) {
      return;
    }
    const spreadsheet = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
    this.#spreadsheet = spreadsheet;
    await spreadsheet.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    });
    await spreadsheet.loadInfo();
    this.#searchSheet = spreadsheet.sheetsByTitle[SHEET_NAME.search];
    this.#searchCell = new Map();
    this.#resultCell = new Map();
    await this.#searchSheet.loadCells("B2:D10");
    for (const [name, row] of SEARCH_ROW) {
      this.#searchCell.set(name, this.#searchSheet.getCell(row - 1, SEARCH_INPUT_COLUMN - 1));
      this.#resultCell.set(name, this.#searchSheet.getCell(row - 1, SEARCH_OUTPUT_COLUMN - 1));
    }
    console.log("スプレッドシート初期化完了");
  }

  /**
   * 
   * @param {SearchCategory} resultCategory
   * @param {Object.<SearchCategory, CellValueResolvable>} nameValuePairs 
   * @returns {Promise<CellValueResolvable | import("google-spreadsheet").GoogleSpreadsheetFormulaError>}
   */
  static async #searcher(resultCategory, nameValuePairs) {
    await this.#initIfNeeded();
    for (const [category, value] of Object.entries(nameValuePairs)) {
      this.#searchCell.get(/** @type {SearchCategory} */(category)).value = value;
    }
    await this.#searchSheet.saveUpdatedCells();
    const targetCell = this.#resultCell.get(resultCategory);
    await this.#searchSheet.loadCells(targetCell.a1Address);
    return targetCell.value;
  }

  /**
   * @type {GoogleSpreadsheet}
   */
  static #spreadsheet;
  /**
   * @type {Map<SearchCategory, GoogleSpreadsheetCell>}
   */
  static #searchCell;
  /**
   * @type {Map<SearchCategory, GoogleSpreadsheetCell>}
   */
  static #resultCell;
  /**
   * @type {GoogleSpreadsheetWorksheet}
   */
  static #searchSheet;
}

/**
 * @typedef {number | string | boolean} CellValueResolvable
 */

/**
 * @typedef {number} Row
 */