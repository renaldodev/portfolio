/** SDF chess pieces */
export const operaChunkB = `
float pawn(vec3 p) {
  vec2 p2 = vec2(length(p.xz), p.y);
  float dt = sphere2(vec2(0, 1) - p2, 1.0);
  float dn = ellipse2(vec2(0, -0.15) - p2, vec2(1.0, 0.3));
  float dw0 = ellipse2(vec2(0, 0) - p2, vec2(0.5, 0.8));
  float dw1 = ellipse2(vec2(0, -2.3) - p2, vec2(0.9, 0.3));
  float dw2 = ellipse2(vec2(0, -2.1) - p2, vec2(1.4, 0.3));
  float db0 = ellipse2(vec2(0, -2.3) - p2, vec2(1.2, 0.6));
  float db1 = ellipse2(vec2(0, -3.3) - p2, vec2(2.0, 0.6));
  float db2 = ellipse2(vec2(0, -3.8) - p2, vec2(2.1, 0.5));
  float r = blend(dt, dn, 0.3);
  r = min(r, blend(dw0, dw1, 3.0));
  r = min(r, dw2);
  r = min(r, blend(blend(db0, db1, 1.2), db2, 0.3));
  return r;
}

float base(vec3 p, float rad) {
  vec2 p2 = vec2(length(p.xz), p.y);
  float dn = ellipse2(vec2(0, -1.0) - p2, vec2(1.3 * rad, 1.0));
  float db0 = ellipse2(vec2(0, -2.3) - p2, vec2(1.6 * rad, 0.6));
  float db1 = ellipse2(vec2(0, -3.3) - p2, vec2(2.5 * rad, 0.6));
  float db2 = ellipse2(vec2(0, -3.8) - p2, vec2(2.6 * rad, 0.5));
  float dw = ellipse2(vec2(0, -2.1) - p2, vec2(1.8 * rad, 0.3));
  float r = blend(blend(db0, db1, 1.0), db2, 0.3);
  r = min(r, dw);
  return r;
}

float base1(vec3 p) { return base(p, 1.0); }

float base2(vec3 p) {
  float r = base(p, 1.2);
  vec2 p2 = vec2(length(p.xz), p.y);
  float dn = ellipse2(vec2(0, -1.4) - p2, vec2(1.15, 2.7));
  float dc = ellipse2(vec2(0, 2.0) - p2, vec2(1.6, 0.3));
  float dc1 = ellipse2(vec2(0, 2.2) - p2, vec2(1.5, 0.2));
  float dc2 = ellipse2(vec2(0, 2.8) - p2, vec2(1.2, 0.2));
  float ds = ellipse2(vec2(0, 5.9) - p2, vec2(1.9, 2.8));
  float dcut = box2(vec2(0, 7.2) - p2, vec2(3.0, 2.5));
  r = blend(r, dn, 1.8);
  r = blend(r, dc, 1.8);
  r = min(r, dc1);
  r = blend(r, dc2, 0.55);
  r = blend(r, ds, 1.1);
  return max(r, -dcut);
}

float rook(vec3 p, float baseAmt) {
  vec2 p2 = vec2(length(p.xz), p.y);
  float dn = ellipse2(vec2(0, -1.0) - p2, vec2(1.2, 1.3));
  float dc = ellipse2(vec2(0, 0.5) - p2, vec2(1.7, 0.2));
  float r = blend(baseAmt, dn, 1.0);
  r = blend(r, dc, 1.4);
  r = min(r, box2(vec2(1.4, 1.1) - p2, vec2(0.2, 0.6)));
  vec3 b3 = p;
  const float ang = 3.141593 * 2.0 / 3.0;
  const mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  for (int i = 0; i < 3; ++i) {
    r = max(r, -box3(vec3(0, 1.4, 0) - b3, vec3(2.0, 0.6, 0.2)));
    b3.xz = rot * b3.xz;
  }
  return r;
}

float knight(vec3 p, float baseAmt) {
  p.x = abs(p.x);
  float ds1 = sphere(vec3(0.0, 2.0, 0.0) - p, 4.0);
  float ds2 = ellipse(vec3(0.0, 2.0, 0.0) - p, vec3(2.0, 5.0, 1.8));
  float dn = roundCone(vec3(-0.3, 1.0, 0.5) - p, 0.8, 2.2, 2.2);
  float dncut = ellipse(vec3(2.2, 0.0, 0.0) - p, vec3(1.5, 2.5, 5.0));
  const float a = 1.3;
  const mat3 rot = mat3(1, 0, 0, 0, cos(a), -sin(a), 0, sin(a), cos(a));
  float dh = roundCone(rot * (vec3(0.0, 2.5, 0.5) - p), 1.2, 0.6, 1.9);
  float de = ellipse(vec3(0.5, 3.5, 0.5) - p, vec3(0.4, 0.5, 0.35));
  float dhcut1 = 0.5 - p.x;
  float dhcut2 = sphere(vec3(2.1, 2.8, -1.9) - p, 2.0);
  float dhs = ellipse(vec3(0.0, 2.2, 0.0) - p, vec3(2.0, 1.3, 2.3));
  float r2 = max(dn, -dncut);
  float h = dh;
  h = max(h, -dhcut1);
  h = max(h, -dhcut2);
  h = max(h, dhs);
  h = min(h, max(de, -dhcut1));
  r2 = blend(r2, h, 0.7);
  return min(baseAmt, max(max(r2, ds1), ds2));
}

float bishop(vec3 p, float baseAmt) {
  vec2 p2 = vec2(length(p.xz), p.y);
  float dn = ellipse2(vec2(0, -1.4) - p2, vec2(1.0, 1.6));
  float dc = ellipse2(vec2(0, 0.7) - p2, vec2(1.6, 0.3));
  float dc1 = ellipse2(vec2(0, 0.9) - p2, vec2(1.5, 0.2));
  float dc2 = ellipse2(vec2(0, 1.5) - p2, vec2(1.2, 0.2));
  float dh = ellipse2(vec2(0, 2.6) - p2, vec2(1.3, 1.5));
  float dt = ellipse2(vec2(0, 4.2) - p2, vec2(0.4, 0.4));
  const float ang = -0.4;
  const mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  vec3 c3 = vec3(0.8, 3.7, 0.0) - p;
  c3.xy = rot * c3.xy;
  float cut = box3(c3, vec3(0.2, 1.0, 2.0));
  float r = blend(baseAmt, dn, 0.9);
  r = blend(r, dc, 1.5);
  r = min(r, dc1);
  r = blend(r, dc2, 0.55);
  r = min(r, dh);
  r = min(r, dt);
  return max(r, -cut);
}

float king(vec3 p, float baseAmt) {
  vec2 p2 = vec2(length(p.xz), p.y);
  float dh = ellipse2(vec2(0, 4.6) - p2, vec2(1.8, 0.4));
  float dt1 = box3(vec3(0, 5.2, 0) - p, vec3(0.3, 1.5, 0.25));
  float dt2 = box3(vec3(0, 5.8, 0) - p, vec3(1.0, 0.3, 0.25));
  float r = min(baseAmt, dh);
  r = min(r, dt1);
  return min(r, dt2);
}

float queen(vec3 p, float baseAmt) {
  vec2 p2 = vec2(length(p.xz), p.y);
  float dh = ellipse2(vec2(0, 4.0) - p2, vec2(1.3, 1.5));
  float dhcut = box2(vec2(0, 2.0) - p2, vec2(3.0, 2.0));
  float dt = ellipse2(vec2(0, 5.6) - p2, vec2(0.5, 0.5));
  vec3 pc = vec3(abs(p.x), p.y, abs(p.z));
  if (pc.x > pc.z) pc = pc.zyx;
  float dccut = sphere(vec3(1.0, 4.7, 2.2) - pc, 1.1);
  float r = min(baseAmt, max(dh, -dhcut));
  return max(min(r, dt), -dccut);
}
`;
