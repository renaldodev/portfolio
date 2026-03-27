/** Encoded Opera Game positions */
export const operaChunkC = `
int board(int m, int r) {
  if (r == 0) {
    if (m < 3) return 591750194;
    if (m < 9) return 541418546;
    if (m < 11) return 541393970;
    if (m < 15) return 537199666;
    if (m < 17) return 537199618;
    if (m < 23) return 537198594;
    if (m < 25) return 536880384;
    if (m < 27) return 536872192;
    if (m < 33) return 9472;
    return 1280;
  }
  if (r == 1) {
    if (m < 1) return 286331153;
    if (m < 5) return 286265617;
    return 286261521;
  }
  if (r == 2) {
    if (m < 3) return 0;
    if (m < 8) return 3145728;
    if (m < 9) return 10485760;
    if (m < 13) return 6291456;
    if (m < 15) return 96;
    if (m < 19) return 864;
    if (m < 31) return 96;
    return 0;
  }
  if (r == 3) {
    if (m < 1) return 0;
    if (m < 5) return 65536;
    if (m < 6) return 69632;
    if (m < 7) return 167841792;
    if (m < 8) return 167837696;
    if (m < 11) return 65536;
    if (m < 21) return 66560;
    return 65536;
  }
  if (r == 4) {
    if (m < 2) return 0;
    if (m < 7) return 458752;
    if (m < 10) return 65536;
    if (m < 17) return 458752;
    if (m < 18) return 67567616;
    if (m < 19) return 67567728;
    if (m < 20) return 67567664;
    if (m < 21) return 67567728;
    if (m < 29) return 67567680;
    return 67567616;
  }
  if (r == 5) {
    if (m < 4) return 0;
    if (m < 10) return 28672;
    if (m < 12) return 0;
    if (m < 16) return 9437184;
    if (m < 20) return 9438976;
    if (m < 28) return 9437184;
    if (m < 30) return 10223616;
    return 786432;
  }
  if (r == 6) {
    if (m < 2) return 2004318071;
    if (m < 4) return 2003859319;
    if (m < 14) return 2003830647;
    if (m < 16) return 2004617079;
    if (m < 18) return 2004615287;
    if (m < 22) return 2004615175;
    if (m < 25) return 2004652039;
    if (m < 26) return 2004623367;
    if (m < 28) return 2004647943;
    if (m < 29) return 2003861511;
    if (m < 30) return 2003845127;
    if (m < 32) return 2003865607;
    return 2003828743;
  }
  if (m < 6) return -1985230184;
  if (m < 12) return -1985232744;
  if (m < 14) return -2136227688;
  if (m < 22) return -2136276840;
  if (m < 24) return -2136276984;
  if (m < 26) return -2136244224;
  if (m < 31) return -2136276992;
  if (m < 32) return -2136276896;
  if (m < 33) return -2136276848;
  return -2136268656;
}

const float BOARD_MAT = 0.0;
const float WHITE_MAT = 1.0;
const float BLACK_MAT = 2.0;
`;
