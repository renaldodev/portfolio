/** Part A — timing, noise, SDF primitives (Opera Game port, WebGL2) */
export const operaChunkA = `#version 300 es
precision highp float;
precision highp int;

uniform float u_time;
uniform vec2 u_resolution;
out vec4 fragColor;

int board_cache[8];

const bool RENDER_SKY = true;
const bool RENDER_MIST = true;
const bool RENDER_REFLECTIONS = true;
const bool RENDER_SHADOWS = true;
const bool MSAAx4 = false;

const float INTRO_TIME = 5.0;
const float TIME_PER_POSITION = 2.0;
const float OUTRO_TIME = 7.0;
const float INTERMISSION = 1.5;
const int TOTAL_POSITIONS = 34;
const float TOTAL_TIME =
  INTRO_TIME + TIME_PER_POSITION * float(TOTAL_POSITIONS) + OUTRO_TIME + INTERMISSION;

float loopTime() { return mod(u_time, TOTAL_TIME); }

float introTime() { return min(1.0, loopTime() / INTRO_TIME); }

float moveTime() { return max(0.0, loopTime() - INTRO_TIME); }

float outroTime() {
  return clamp(
    1.0 - (loopTime() - (TOTAL_TIME - INTERMISSION - OUTRO_TIME)) / OUTRO_TIME,
    0.0,
    1.0
  );
}

float timeOfMove(float m) { return INTRO_TIME + m * TIME_PER_POSITION; }

float tri(float x) { return abs(fract(x) - 0.5); }

vec3 tri3(vec3 p) {
  return abs(fract(p.zzy + abs(fract(p.yxx) - 0.5)) - 0.5);
}

float triNoise3D(in vec3 p, float spd) {
  float z = 1.4;
  float rz = 0.0;
  vec3 bp = p;
  for (float i = 0.0; i <= 3.0; i++) {
    vec3 dg = tri3(bp * 2.0);
    p += (dg + u_time * 0.3 * spd);
    bp *= 1.8;
    z *= 1.5;
    p *= 1.2;
    rz += tri(p.z + tri(p.x + tri(p.y))) / z;
    bp += 0.14;
  }
  return rz;
}

float sphere(vec3 p, float r) { return length(p) - r; }

float sphere2(vec2 p, float r) { return length(p) - r; }

float ellipse(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}

float ellipse2(vec2 p, vec2 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}

float box3(vec3 p, vec3 r) {
  vec3 d = abs(p) - r;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float box2(vec2 p, vec2 r) {
  vec2 d = abs(p) - r;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float roundCone(vec3 p, float r1, float r2, float h) {
  vec2 q = vec2(length(p.xz), p.y);
  float b = (r1 - r2) / h;
  float a = sqrt(1.0 - b * b);
  float k = dot(q, vec2(-b, a));
  if (k < 0.0) return length(q) - r1;
  if (k > a * h) return length(q - vec2(0.0, h)) - r2;
  return dot(q, vec2(a, b)) - r1;
}

vec2 boxIntersect(vec3 ro, vec3 rd, vec3 rad) {
  vec3 m = 1.0 / rd;
  vec3 n = m * ro;
  vec3 k = abs(m) * rad;
  vec3 t1 = -n - k;
  vec3 t2 = -n + k;

  float tN = max(max(t1.x, t1.y), t1.z);
  float tF = min(min(t2.x, t2.y), t2.z);

  if (tN > tF || tF < 0.0) return vec2(-1.0);
  return vec2(tN, tF);
}

float blend(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}
`;
