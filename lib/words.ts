/**
 * 単語リスト（アルファベット+数字、最大8文字）
 * リストに存在する単語であれば8文字以内なら何文字でも入力可能
 */
export const WORD_LIST = [
  "metal",
  "yukakina",
  "yunomaru",
  "banban",
  "kaeru",
  "scorpion",
  "aez",
  "nameko",
  "brontal",
  "batoru",
  "alf",
  "kznk",
  "dolisu",
  "mocchi",
  "sasori",
  "vanpyi",
  "mkmldy",
  "hametu",
  "miraik",
  "felix",
  "appai",
  "chickin",
  "kruger",
  "dacho",
  "ze1u",
  "nerisu",
  "yami",
  "takoyaki",
  "maeken",
  "hasha",
  "pipicha",
  "kat",
  "yougg",
  "unpyi",
  "raolie",
  "yuto",
  "520",
  "emmko",
  "maka",
  "nyan",
  "atto",
  "tuna",
  "takakou",
  "lim",
  "monop",
  "rose",
  "ryz",
  "kakaka",
  "kakiri",
  "toki",
  "soar",
  "mone",
  "shinami",
  "pyone",
  "gnk",
  "tarako",
  "yora",
  "silia",
  "burio",
  "latty",
  "4ta5",
  "soba",
  "city",
  "ivory",
  "aka",
  "shota",
  "peter",
  "fuku",
  "alphar",
  "zizi",
  "myme",
  "nach",
  "emu",
  "yomi1",
  "irohasu",
  "kotami",
  "m1take"
].filter((word) => word.length <= 8);

// Set形式で高速検索用
const wordSet = new Set(WORD_LIST.map((w) => w.toLowerCase()));

export function isValidWord(word: string): boolean {
  return word.length <= 8 && wordSet.has(word.toLowerCase());
}

export function getWordList(): string[] {
  return WORD_LIST;
}
