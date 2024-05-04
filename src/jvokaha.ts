import { normalize } from "./jvozba";
import { get_CV_info } from "./scoring";

/*
jvokaha("fu'ivla") --> ["fu'i", "vla"]
jvokaha("fu'irvla") --> error // because r-hyphen is unnecessary
jvokaha("pasymabru") --> ["pas", "y", "mabru"]
jvokaha("pasmabru") --> error // because {pasmabru} is actually {pa smabru}
*/
export function jvokaha(lujvo: string): string[] {
  var arr = jvokaha2(lujvo);
  var rafsi_list = arr.filter(function (a) {
    return a.length !== 1; // remove ynr
  });

  var correct_lujvo = normalize(rafsi_list);  // recreate the lujvo from the rafsi list

  if (lujvo === correct_lujvo.join("")) {
    return arr;
  } else {
    throw new Error("malformed lujvo {" + arr.join("-") + "}; it should be {" + correct_lujvo.join("-") + "}");
  }
}


/*
jvokaha2("fu'ivla") --> ["fu'i", "vla"]
jvokaha2("fu'irvla") --> ["fu'i", "r", "vla"]
jvokaha2("pasymabru") --> ["pas", "y", "mabru"]
jvokaha2("pasmabru") --> ["pas", "mabru"]
*/
export function jvokaha2(lujvo: string): string[] {
  var res = [];
  while (true) {
    if (lujvo === "") return res;

    //remove hyphen
    if (res.length > 0 && res[res.length - 1].length !== 1) { // hyphen cannot begin a word; nor can two hyphens
      if (lujvo.charAt(0) === "y" // y-hyphen
        || lujvo.slice(0, 2) === "nr" // n-hyphen is only allowed before r
        || lujvo.charAt(0) === "r" && get_CV_info(lujvo.charAt(1)) === "C" // r followed by a consonant
      ) {
        res.push(lujvo.charAt(0));
        lujvo = lujvo.slice(1);
        continue;
      }
    }



    //drop rafsi from front

    //CVV can always be dropped
    if (get_CV_info(lujvo.slice(0, 3)) === "CVV"
      && ["ai", "ei", "oi", "au"].indexOf(lujvo.slice(1, 3)) !== -1
    ) {
      res.push(lujvo.slice(0, 3));
      lujvo = lujvo.slice(3);
      continue;
    }

    //CV'V can always be dropped
    if (get_CV_info(lujvo.slice(0, 4)) === "CV'V") {
      res.push(lujvo.slice(0, 4));
      lujvo = lujvo.slice(4);
      continue;
    }

    //CVCCY and CCVCY can always be dropped
    //how about checking if CC is persimmisble? *FIXME*
    if (get_CV_info(lujvo.slice(0, 5)) === "CVCCY"
      || get_CV_info(lujvo.slice(0, 5)) === "CCVCY"
    ) {
      res.push(lujvo.slice(0, 4));
      res.push("y");
      lujvo = lujvo.slice(5);
      continue;
    }

    //the final rafsi can be 5-letter
    if (get_CV_info(lujvo) === "CVCCV"
      || get_CV_info(lujvo) === "CCVCV"
      // DGCK81LNN modification: 4-letter should be ok too, for cmevla
      || get_CV_info(lujvo) === "CVCC"
      || get_CV_info(lujvo) === "CCVC"
    ) {
      res.push(lujvo);
      return res;
    }

    if (get_CV_info(lujvo.slice(0, 3)) === "CVC"
      || get_CV_info(lujvo.slice(0, 3)) === "CCV"
    ) {
      res.push(lujvo.slice(0, 3));
      lujvo = lujvo.slice(3);
      continue;
    }

    // if all fails...
    throw new Error("Failed to decompose {" + [...res, lujvo.replace(/./g, "$&\u0332")].filter(Boolean).join("-") + "}; it is likely not a lujvo");
  }
  return res;
}
