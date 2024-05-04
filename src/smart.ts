import { jvokaha } from "./jvokaha";
import { jvozba } from "./jvozba";
import { search_selrafsi_from_rafsi, search_selrafsi_from_rafsi2 } from "./tools";

export function jvozbaSmart(txt: string) {
  txt = txt.replace(/h/g, "'");
  txt = txt.toLowerCase();
  txt = txt.trim();
  if (!txt) throw new Error("Empty input");

  var arr = txt.split(/\s+/g).map(part => {
    if (part.startsWith("-") || part.endsWith("-"))
      return search_selrafsi_from_rafsi(part.replace(/-/g, "")).selrafsi;
    return part;
  });

  return {
    components: arr,
    results: arr.length > 1 ? jvozba(arr) : [],
  };
}

export function jvokahaSmart(txt: string) {
  txt = txt.replace(/h/g, "'");
  txt = txt.toLowerCase();

  var arr = jvokaha(txt);
  return arr.map(part => ({
    part,
    ...(part.length > 1 && search_selrafsi_from_rafsi2(part) || { selrafsi: null, experimental: false as const }),
  }));
}
