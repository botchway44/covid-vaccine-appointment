export function formatTime(seconds: number) {
  const negative = (seconds < 0);
  seconds = Math.floor(Math.abs(seconds || 0));
  const s = seconds % 60;
  const m = (seconds - s) / 60;
  const h = (seconds - s - 60 * m) / 3600;
  const sStr = (s > 9) ? `${s}` : `0${s}`;
  const mStr = (m > 9 || !h) ? `${m}:` : `0${m}:`;
  const hStr = h ? `${h}:` : '';
  return (negative ? '-' : '') + hStr + mStr + sStr;
}




export function uuid(
  a: any, b: any               // placeholders
) {
  for (               // loop :)
    b = a = '';        // b - result , a - numeric variable
    a++ < 36;        // 
    b += a * 51 & 52  // if "a" is not 9 or 14 or 19 or 24
      ?  //  return a random number or 4
      (
        a ^ 15      // if "a" is not 15
          ?      // genetate a random number from 0 to 15
          8 ^ Math.random() *
          (a ^ 20 ? 16 : 4)  // unless "a" is 20, in which case a random number from 8 to 11
          :
          4            //  otherwise 4
      ).toString(16)
      :
      '-'            //  in other cases (if "a" is 9,14,19,24) insert "-"
  );
  return b
}