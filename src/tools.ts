import { cmavo_rafsi_list, cmavo_rafsi_list_exp, gismu_rafsi_list, gismu_rafsi_list_exp } from "./rafsi_list";

/* 
  create_every_possibility([[1,11], [2], [3,33,333]]) ==> [ [1,2,3],[11,2,3],  [1,2,33],[11,2,33],  [1,2,333],[11,2,333] ]
  create_every_possibility([[1,11]]) ==> [ [1],[11] ]
*/
export function create_every_possibility<T>(aa: T[][]): T[][] {
  var arr_arr: T[][] = JSON.parse(JSON.stringify(aa));
  if (arr_arr.length === 0) {
    return [[]];
  }
  var arr = arr_arr.pop()!;

  var result: T[][] = [];
  for (var i = 0; i < arr.length; i++) {
    var e = arr[i];

    result = result.concat(create_every_possibility(arr_arr).map(function (f: T[]) {
      return f.concat([e]);
    }));
  }
  return result;
}

export function get_candid(selrafsi: string, isLast: boolean) {
  const candid: { selrafsi: string, part: string, experimental: boolean }[] = []
  if (cmavo_rafsi_list[selrafsi])
    candid.push(...cmavo_rafsi_list[selrafsi].map(rafsi => ({ selrafsi, part: rafsi, experimental: false })));
  if (cmavo_rafsi_list_exp[selrafsi])
    candid.push(...cmavo_rafsi_list_exp[selrafsi].map(rafsi => ({ selrafsi, part: rafsi, experimental: true })));
  if (candid.length) return candid

  if (gismu_rafsi_list[selrafsi])
    candid.push(...gismu_rafsi_list[selrafsi].map(rafsi => ({ selrafsi, part: rafsi, experimental: false })));
  if (gismu_rafsi_list_exp[selrafsi])
    candid.push(...gismu_rafsi_list_exp[selrafsi].map(rafsi => ({ selrafsi, part: rafsi, experimental: true })));
  if (gismu_rafsi_list[selrafsi] || gismu_rafsi_list_exp[selrafsi]) {
    const experimental = !gismu_rafsi_list[selrafsi];
    let chopped = selrafsi.slice(0, -1);
    if (chopped !== "brod") candid.push({ selrafsi, part: chopped, experimental });
    if (isLast) candid.push({ selrafsi, part: selrafsi, experimental });
    return candid;
  }

  throw new Error("no rafsi for word " + selrafsi);
}

export function search_selrafsi_from_rafsi2(rafsi: string) {
  // 5-letter rafsi
  if (gismu_rafsi_list[rafsi]) return { selrafsi: rafsi, experimental: false };
  if (gismu_rafsi_list_exp[rafsi]) return { selrafsi: rafsi, experimental: true };

  if (rafsi !== "brod" && rafsi.length === 4 && rafsi.indexOf("'") === -1) { //4-letter rafsi
    for (var u = 0; u < 5; u++) {
      var gismu_candid = rafsi + "aeiou".charAt(u);
      if (gismu_rafsi_list[gismu_candid]) return { selrafsi: gismu_candid, experimental: false };
      if (gismu_rafsi_list_exp[gismu_candid]) return { selrafsi: gismu_candid, experimental: true };
    }
  }
  for (var i in gismu_rafsi_list) {
    if (gismu_rafsi_list[i].indexOf(rafsi) !== -1) return { selrafsi: i, experimental: false };
  }
  for (var j in cmavo_rafsi_list) {
    if (cmavo_rafsi_list[j].indexOf(rafsi) !== -1) return { selrafsi: j, experimental: false };
  }
  for (var i in gismu_rafsi_list_exp) {
    if (gismu_rafsi_list_exp[i].indexOf(rafsi) !== -1) return { selrafsi: i, experimental: true };
  }
  for (var j in cmavo_rafsi_list_exp) {
    if (cmavo_rafsi_list_exp[j].indexOf(rafsi) !== -1) return { selrafsi: j, experimental: true };
  }
  return null;
}

export function search_selrafsi_from_rafsi(rafsi: string) {
  var selrafsi = search_selrafsi_from_rafsi2(rafsi)
  if (selrafsi != null) {
    return selrafsi;
  } else {
    throw new Error("no word for rafsi " + rafsi);
  }
}
