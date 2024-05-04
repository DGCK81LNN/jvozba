import { get_CV_info, get_lujvo_score, is_C } from "./scoring";
import { create_every_possibility, get_candid } from "./tools";
import { Consonant, LujvoAndScore } from "./types";

export function jvozba(arr: string[]): LujvoAndScore[] {
  var candid_arr = arr.map((component, i) => get_candid(component, /*isLast:*/ i === arr.length - 1));

  return create_every_possibility(candid_arr).map((rafsi_list) => {
    var result = normalize(rafsi_list);
    var word = result.map(p => p.part).join("");
    var cmevla = is_cmevla(word);
    return {
      parts: result,
      lujvo: word,
      score: get_lujvo_score(result.map(p => p.part)),
      cmevla,
      usesExperimentalRafsi: rafsi_list.some(i => i.experimental),
      forbiddenLaLaiDoiCmevla: cmevla
        && !!(word.match(/^(lai|doi)/)
          || word.match(/[aeiouy](lai|doi)/)
          || word.match(/^la[^u]/)  // the fact that CLL explicitly forbids two sequences `la` and `lai` signifies that `lau` is not forbidden
          || word.match(/[aeiouy]la[^u]/)
        )
    };
  }).sort(function (a, b) {
    return a.score - b.score;
  });
}

function is_cmevla(valsi: string): boolean {
  return valsi.length >= 1 && "aeiouy'".indexOf(valsi.charAt(valsi.length - 1)) === -1
}

export function normalize(rafsi_list: string[]): string[]
export function normalize(rafsi_list: { selrafsi: string, part: string, experimental: boolean }[]): ({ selrafsi: string, part: string, experimental: boolean } | { selrafsi: null, part: string, experimental: false })[]
export function normalize(rafsi_list: string[] | { part: string }[]) {
  if (rafsi_list.length < 2) {
    throw new Error("You need at least two valsi to make a lujvo");
  }

  var input: any[] = Array.from(rafsi_list as any[]); //copy
  var part = typeof rafsi_list[0] === "string" ? ((p: string) => p) : ((p: { part: string }) => p.part)
  var $hyphen = typeof rafsi_list[0] === "string" ? ((p: string) => p) : ((part: string) => ({ selrafsi: null, part, experimental: false as const }))
  var result: any[] = [input.pop()!]; // add the final rafsi

  while (input.length) {
    var rafsip = input.pop()!;
    var rafsi = part(rafsip)
    var end = rafsi.charAt(rafsi.length - 1);
    var result0 = part(result[0])
    var init = result0.charAt(0);

    if (is_4letter(rafsi)) {
      result.unshift($hyphen("y"));
    } else if (is_C(end) && is_C(init) && is_permissible(end, init) === 0) {
      result.unshift($hyphen("y"));
    } else if (end === "n" && ["ts", "tc", "dz", "dj"].indexOf(result0.slice(0, 2)) !== -1) {
      result.unshift($hyphen("y"));
    } else if (input.length === 0 && is_CVV(rafsi)) { //adapting first rafsi, which is CVV; gotta think about r-hyphen
      var hyphen = "r";
      if (result0.startsWith("r")) {
        hyphen = "n";
      }

      if (rafsi_list.length > 2 || !is_CCV(result0)) {
        result.unshift($hyphen(hyphen));
      }
    } else if (input.length === 0 && is_CVC(rafsi) && is_tosmabru(rafsi, result.map(part))) {
      result.unshift($hyphen("y"));
    }

    result.unshift(rafsip);
  }

  return result;
}

export function is_tosmabru(rafsi: string, rest: string[]): boolean {
  //skip if cmevla
  if (is_cmevla(rest[rest.length - 1])) { // ends with a consonant
    return false;
  }

  var index;
  for (var i = 0; i < rest.length; i++) {
    if (is_CVC(rest[i])) continue;

    index = i;
    if (rest[i] === "y" ||
      (
        () => {

          if (get_CV_info(rest[i]) !== "CVCCV") {
            return false;
          }
          let charAt2 = rest[i].charAt(2);

          if (!is_C(charAt2)) {
            throw new Error("Cannot happen");
          }

          let charAt3 = rest[i].charAt(3);
          if (!is_C(charAt3)) {
            throw new Error("Cannot happen");
          }

          return 2 === is_permissible(charAt2, charAt3);
        }
      )()
    ) {
      break;
      // further testing
    } else {
      return false;
    }
  }

  if (typeof index === "undefined") {
    /* This can only occur if everything is CVC, but the that is a cmevla */
    throw new Error("Cannot happen");
  }

  //further testing

  var tmp1: string = rafsi;
  var tmp2 = rest[0];
  var j = 0;
  do {
    if (tmp2 === "y") return true;

    let a = tmp1.charAt(tmp1.length - 1);
    if (!is_C(a)) {
      throw new Error("Cannot happen");
    }

    let b = tmp2.charAt(0);
    if (!is_C(b)) {
      throw new Error("Cannot happen");
    }

    if (2 !== is_permissible(a, b)) {
      return false;
    }
    tmp1 = tmp2;
    tmp2 = rest[++j];
  } while (j <= index);
  return true;
}


export function is_CVV(rafsi: string) {
  return (get_CV_info(rafsi) === "CVV"
    || get_CV_info(rafsi) === "CV'V");
}

export function is_CCV(rafsi: string) {
  return get_CV_info(rafsi) === "CCV";
}

export function is_CVC(rafsi: string) {
  return get_CV_info(rafsi) === "CVC";
}

export function is_4letter(rafsi: string) {
  return (get_CV_info(rafsi) === "CVCC"
    || get_CV_info(rafsi) === "CCVC");
}

export function is_permissible(c1: Consonant, c2: Consonant): 0 | 1 | 2 //2: initial ok; 1: ok; 0: none ok
{
  return ({
    r: { r: 0, l: 1, n: 1, m: 1, b: 1, v: 1, d: 1, g: 1, j: 1, z: 1, s: 1, c: 1, x: 1, k: 1, t: 1, f: 1, p: 1 },
    l: { r: 1, l: 0, n: 1, m: 1, b: 1, v: 1, d: 1, g: 1, j: 1, z: 1, s: 1, c: 1, x: 1, k: 1, t: 1, f: 1, p: 1 },
    n: { r: 1, l: 1, n: 0, m: 1, b: 1, v: 1, d: 1, g: 1, j: 1, z: 1, s: 1, c: 1, x: 1, k: 1, t: 1, f: 1, p: 1 },
    m: { r: 2, l: 2, n: 1, m: 0, b: 1, v: 1, d: 1, g: 1, j: 1, z: 0, s: 1, c: 1, x: 1, k: 1, t: 1, f: 1, p: 1 },
    b: { r: 2, l: 2, n: 1, m: 1, b: 0, v: 1, d: 1, g: 1, j: 1, z: 1, s: 0, c: 0, x: 0, k: 0, t: 0, f: 0, p: 0 },
    v: { r: 2, l: 2, n: 1, m: 1, b: 1, v: 0, d: 1, g: 1, j: 1, z: 1, s: 0, c: 0, x: 0, k: 0, t: 0, f: 0, p: 0 },
    d: { r: 2, l: 1, n: 1, m: 1, b: 1, v: 1, d: 0, g: 1, j: 2, z: 2, s: 0, c: 0, x: 0, k: 0, t: 0, f: 0, p: 0 },
    g: { r: 2, l: 2, n: 1, m: 1, b: 1, v: 1, d: 1, g: 0, j: 1, z: 1, s: 0, c: 0, x: 0, k: 0, t: 0, f: 0, p: 0 },
    j: { r: 1, l: 1, n: 1, m: 2, b: 2, v: 2, d: 2, g: 2, j: 0, z: 0, s: 0, c: 0, x: 0, k: 0, t: 0, f: 0, p: 0 },
    z: { r: 1, l: 1, n: 1, m: 2, b: 2, v: 2, d: 2, g: 2, j: 0, z: 0, s: 0, c: 0, x: 0, k: 0, t: 0, f: 0, p: 0 },
    s: { r: 2, l: 2, n: 2, m: 2, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 0, c: 0, x: 1, k: 2, t: 2, f: 2, p: 2 },
    c: { r: 2, l: 2, n: 2, m: 2, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 0, c: 0, x: 0, k: 2, t: 2, f: 2, p: 2 },
    x: { r: 2, l: 2, n: 1, m: 1, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 1, c: 0, x: 0, k: 0, t: 1, f: 1, p: 1 },
    k: { r: 2, l: 2, n: 1, m: 1, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 1, c: 1, x: 0, k: 0, t: 1, f: 1, p: 1 },
    t: { r: 2, l: 1, n: 1, m: 1, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 2, c: 2, x: 1, k: 1, t: 0, f: 1, p: 1 },
    f: { r: 2, l: 2, n: 1, m: 1, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 1, c: 1, x: 1, k: 1, t: 1, f: 0, p: 1 },
    p: { r: 2, l: 2, n: 1, m: 1, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 1, c: 1, x: 1, k: 1, t: 1, f: 1, p: 0 }
  }[c1][c2] as (0 | 1 | 2));
}
