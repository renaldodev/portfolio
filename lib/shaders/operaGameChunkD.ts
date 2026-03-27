/** SDF scene, shading, raymarch, camera, main */
export const operaChunkD = `
vec2 sdf(vec3 p) {
  const float INF = 1.0;

  float r = min(INF, p.y + 4.0);
  vec2 res = vec2(r, BOARD_MAT);

  vec2 ip = p.xz / 8.0 + 4.0;
  int ix = int(ip.x) & 7;
  int iy = int(ip.y) & 7;
  int piece = (board_cache[7 - iy] >> (ix * 4)) & 15;
  if (piece == 0) return vec2(min(res.x, INF), res.y);

  vec2 pp2 = mod(p.xz, 8.0) - 4.0;
  vec3 pp3 = vec3(pp2.x, p.y, pp2.y);
  float is_white = piece < 7 ? 1.0 : 0.0;
  piece = (piece - 1) % 6;
  pp3.z *= (is_white * 2.0 - 1.0);

  float d_piece;
  if (piece == 0) d_piece = pawn(pp3);
  else if (piece == 1) d_piece = rook(pp3, base1(pp3));
  else if (piece == 2) d_piece = knight(pp3, base1(pp3));
  else if (piece == 3) d_piece = bishop(pp3, base1(pp3));
  else if (piece == 4) d_piece = king(pp3, base2(pp3));
  else d_piece = queen(pp3, base2(pp3));

  float bound = max(abs(p.x) - 32.0, abs(p.z) - 32.0);
  r = max(bound, d_piece);

  if (r < res.x) res = vec2(r, BLACK_MAT - is_white);

  return res;
}

vec3 norm(vec3 p) {
  vec3 n = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    vec3 e = 0.5773 * (2.0 * vec3(
      float(((i + 3) >> 1) & 1),
      float((i >> 1) & 1),
      float(i & 1)
    ) - 1.0);
    n += e * sdf(p + 0.0005 * e).x;
  }
  return normalize(n);
}

const vec3 SKY = vec3(0.16, 0.20, 0.28) * 0.1;
const vec3 LIGHT = vec3(1.64, 1.27, 0.99);
const vec3 LIGHT_DIR = normalize(vec3(1.2, -1.0, 2.0));
const vec3 INDIRECT = LIGHT * 0.1;
const vec3 INDIRECT_DIR = normalize(-LIGHT_DIR * vec3(-1.0, 0.0, -1.0));

float shadowray(vec3 pos) {
  if (!RENDER_SHADOWS) return 1.0;

  float res = 1.0;
  float t = 0.2;
  for (int i = 0; i < 50; i++) {
    float h = sdf(pos + -LIGHT_DIR * t).x;
    res = min(res, 16.0 * h / t);
    t += clamp(h, 0.05, 0.4);
    if (res < 0.05) break;
  }
  return clamp(res, 0.0, 1.0);
}

vec3 shade(vec3 albedo, vec3 n, vec3 pos, vec3 dir, float ks, bool shadows) {
  float shadow = shadows ? shadowray(pos) : 1.0;
  float light_diffuse = clamp(dot(n, -LIGHT_DIR), 0.0, 1.0);
  vec3 light_half = normalize(-LIGHT_DIR - dir);
  float sky = sqrt(clamp(0.5 + 0.5 * n.y, 0.0, 1.0));
  vec3 ref = reflect(dir, n);
  float frenel = clamp(1.0 + dot(n, dir), 0.0, 1.0);
  float indirect = clamp(dot(n, INDIRECT_DIR), 0.0, 1.0);

  vec3 light = vec3(0.0);
  light += light_diffuse * LIGHT * shadow;
  light += sky * SKY;
  light += indirect * INDIRECT;
  vec3 col = light * albedo;
  col += ks * smoothstep(0.0, 0.5, ref.y) * (0.04 + 0.96 * pow(frenel, 4.0)) * SKY;
  col += shadow * ks * pow(clamp(dot(n, light_half), 0.0, 1.0), 8.0) * light_diffuse *
    (0.04 + 0.96 * pow(clamp(1.0 + dot(light_half, dir), 0.0, 1.0), 3.0)) * LIGHT * 5.0;
  return col;
}

float fogDensity(vec3 p) {
  const vec3 fdir = normalize(vec3(10.0, 0.0, -7.0));
  float f = clamp(1.0 - 0.5 * abs(p.y - -4.0), 0.0, 1.0);
  f *= max(0.0, 1.0 - length(max(vec2(0.0), abs(p.xz) - 28.0)) / 7.0);
  p += 4.0 * fdir * u_time;
  float d = triNoise3D(p * 0.007, 0.2) * f;
  return d * d;
}

float integrateFog(vec3 a, vec3 b) {
  if (!RENDER_MIST) return 0.0;
  vec3 d = normalize(b - a);
  float l = length(b - a);
  vec2 trange = boxIntersect(a - vec3(0.0, -3.0, 0.0), d, vec3(36.0, 1.0, 36.0));
  if (trange.x < 0.0) return 0.0;
  trange = min(trange, vec2(l));
  const float MIN_DIS = 0.2;
  const float MAX_DIS = 2.0;
  const float MIN_SAMPLES = 3.0;
  float tdiff = trange.y - trange.x;
  float samples = max(MIN_SAMPLES, tdiff / MAX_DIS);
  float dis = clamp(tdiff / samples, MIN_DIS, MAX_DIS);
  samples = ceil(tdiff / dis);
  dis = tdiff / (samples + 1.0);
  float visibility = 1.0;
  for (float t = trange.x + 0.5; t < trange.y; t += dis) {
    float density = fogDensity(a + t * d);
    visibility *= pow(3.0, -1.0 * density * dis);
  }
  return 1.0 - visibility;
}

vec3 castray2(vec3 pos, vec3 dir) {
  if (!RENDER_REFLECTIONS) return SKY;
  float tmax = (7.0 - pos.y) / dir.y;
  int i = 0;
  for (float t = 0.1; t < tmax && i < 50; ++i) {
    vec3 p = pos + t * dir;
    vec2 res = sdf(pos + t * dir);
    float dist = res.x;
    if (dist < 0.001) {
      vec3 albedo = res.y == BLACK_MAT ? vec3(0.02, 0.02, 0.01) : vec3(0.3, 0.22, 0.08);
      return shade(albedo, norm(p), p, dir, 1.0, false);
    }
    t += dist;
  }
  return SKY;
}

vec3 floorColor(vec2 p, vec3 ray) {
  float xr = p.x / 16.0;
  float yr = p.y / 16.0;
  int x = fract(xr) < 0.5 ? 0 : 1;
  int y = fract(yr) < 0.5 ? 0 : 1;
  int w = x ^ y;
  vec3 albedo = (w & 1) == 0 ? vec3(0.2) : vec3(0.04);

  const vec3 normal = vec3(0.0, 1.0, 0.0);

  vec3 rpos = vec3(p.x, -4.0, p.y);
  vec3 rdir = reflect(ray, normal);
  vec3 rcolor = castray2(rpos, rdir);

  albedo = mix(albedo, rcolor, 0.2);
  vec3 color = shade(albedo, normal, rpos, ray, 0.1, true);

  return color;
}

vec3 castray(vec3 pos, vec3 dir) {
  vec3 c = vec3(0.0);
  vec2 trange = boxIntersect(pos - vec3(0.0, 1.4, 0.0), dir, vec3(36.0, 5.5, 36.0));
  vec3 p = pos;
  float mat = -1.0;
  if (trange.y > 0.0) {
    int i = 0;
    float t = trange.x;
    for (; t < trange.y && i < 150; ++i) {
      p = pos + t * dir;
      vec2 res = sdf(p);
      float dist = res.x;
      if (dist < 0.05) {
        if (max(abs(p.x), abs(p.z)) > 32.0) break;
        mat = res.y;
        if (mat == BOARD_MAT) {
          c = floorColor(p.xz, dir);
          break;
        }
        vec3 albedo =
          mat == BLACK_MAT ? vec3(0.02, 0.02, 0.01) : vec3(0.3, 0.22, 0.08);
        albedo += vec3(0.1, 0.1, 0.05) * (mat == BLACK_MAT ? 0.5 : 2.2) *
          (0.2 * sin(15.0 * p.x + 25.0 * sin(2.0 * p.z)));
        c = shade(albedo, norm(p), p, dir, 1.0, true);
        break;
      }
      t += dist;
    }
    t = min(t, trange.y);
    p = pos + t * dir;
  }
  if (RENDER_SKY && mat < 0.0) {
    const vec3 C1 = vec3(0.12, 0.08, 0.08);
    const vec3 C2 = vec3(0.04, 0.03, 0.06) * 2.0;
    float y = dir.y + 0.2 * triNoise3D(dir * 2.0, 1.0);
    c = mix(C1, C2, smoothstep(-0.35, 0.0, y));
    float disp = triNoise3D(dir * 0.9, 0.08);
    c += vec3(1.0) * (pow(disp, 5.0) * 3.47);

    float h = dot(dir - 0.08 * triNoise3D(dir * 0.3, 0.0), vec3(0.02, 1.0, -0.01));
    float hstart = -0.2;
    float hend = -0.5;
    c = mix(c, vec3(0.0), smoothstep(hstart, hend, h));
  }

  float fog = integrateFog(pos, p);
  const vec3 FOG_COLOR = vec3(1.5, 1.1, 0.9);
  return mix(c, FOG_COLOR, clamp(fog, 0.0, 1.0));
}

vec2 normScreenSpace(vec2 fragCoord) {
  return (fragCoord / u_resolution.xy - 0.5) * (u_resolution.xy / u_resolution.x);
}

mat3 setCamera(vec3 ro, vec3 ta, float cr) {
  vec3 cw = normalize(ta - ro);
  vec3 cp = vec3(sin(cr), cos(cr), 0.0);
  vec3 cu = normalize(cross(cw, cp));
  vec3 cv = cross(cu, cw);
  return mat3(cu, cv, cw);
}

vec3 look(vec2 fragCoord) {
  vec2 uv = normScreenSpace(fragCoord);
  vec3 rd = normalize(vec3(uv, 1.5));
  float a = loopTime() * 0.3;
  vec3 ro =
    vec3(120.0 * -sin(a * 0.5), 45.0 + 10.0 * sin(a - 0.4), 120.0 * cos(a * 0.5));
  vec3 target = vec3(0.0, 3.0, 0.0);
  mat3 m = setCamera(ro, target, 0.0);
  vec3 c = castray(ro, m * rd);
  return c;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  float t = moveTime() / TIME_PER_POSITION + 0.8 * triNoise3D(vec3(3.0 * normScreenSpace(fragCoord), 0.0), 0.0);
  int move = min(33, int(t));

  for (int i = 0; i < 8; ++i) {
    board_cache[i] = board(move, i);
  }

  vec3 c = look(fragCoord);

  float fade = min(1.0, 3.0 * min(introTime(), outroTime()));

  c *= vec3(0.95, 0.8, 1.1);
  c *= fade;
  c = pow(c, vec3(0.4545));

  fragColor = vec4(c, 1.0);
}
`;
