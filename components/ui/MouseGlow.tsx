'use client';

import { useEffect, useRef } from 'react';
import styles from './MouseGlow.module.css';

// ── Vertex shader: fullscreen quad ──────────────────────────────────────────
const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// ── Fragment shader: organic radial glow with animated color cycling ─────────
const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform vec2  u_mouse;
uniform float u_time;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),               hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p  = p * 2.1 + vec2(1.3, 0.7);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2  uv = gl_FragCoord.xy / u_res;
  float ar = u_res.x / u_res.y;

  // aspect-corrected distance from mouse
  vec2  d  = uv - u_mouse;
  d.x     *= ar;

  float t  = u_time;

  // organic turbulence offset
  float n  = fbm(uv * 3.0 + vec2(t * 0.18, -t * 0.13)) * 0.075;
  float dist = length(d) + n;

  // palette
  vec3 cyan   = vec3(0.0,   0.941, 1.0  );
  vec3 purple = vec3(0.608, 0.365, 0.898);
  vec3 pink   = vec3(0.969, 0.145, 0.522);

  // three-layer glow falloff
  float g0 = smoothstep(0.55, 0.0, dist) * 0.20;
  float g1 = smoothstep(0.22, 0.0, dist) * 0.45;
  float g2 = smoothstep(0.07, 0.0, dist) * 0.80;

  // animated colour mixing
  float c1 = sin(t * 0.35)        * 0.5 + 0.5;
  float c2 = sin(t * 0.27 + 1.57) * 0.5 + 0.5;
  float c3 = sin(t * 0.41 + 3.14) * 0.5 + 0.5;

  vec3 col =  mix(cyan,   purple, c1) * g0
            + mix(purple, pink,   c2) * g1
            + mix(pink,   cyan,   c3) * g2;

  float alpha = g0 + g1 * 0.55 + g2 * 0.35;

  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}
`;

// ── Helpers ──────────────────────────────────────────────────────────────────
function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vert: WebGLShader,
  frag: WebGLShader
): WebGLProgram | null {
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('Program link error:', gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MouseGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // disable on touch/mobile devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return;

    // shaders
    const vertShader = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vertShader || !fragShader) return;

    const program = createProgram(gl, vertShader, fragShader);
    if (!program) return;

    gl.useProgram(program);

    // fullscreen triangle-strip quad: (-1,-1) (1,-1) (-1,1) (1,1)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1,  1, -1,  -1, 1,  1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // uniform locations
    const uRes   = gl.getUniformLocation(program, 'u_res');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uTime  = gl.getUniformLocation(program, 'u_time');

    // alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // ── mouse tracking with smooth lerp ──
    const mouse  = { x: 0.5, y: 0.5 };
    const target = { x: -2.0, y: -2.0 }; // start off-screen

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX / window.innerWidth;
      // flip Y: WebGL origin is bottom-left
      target.y = 1.0 - e.clientY / window.innerHeight;
    };

    const onMouseLeave = () => {
      // slowly drift to off-screen when mouse leaves window
      target.x = -2.0;
      target.y = -2.0;
    };

    window.addEventListener('mousemove', onMouseMove);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    // ── resize handler ── (render at 0.5× for perf; CSS stretches it)
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width  = Math.floor(window.innerWidth  * dpr * 0.5);
      canvas.height = Math.floor(window.innerHeight * dpr * 0.5);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    // ── render loop ──
    let rafId = 0;
    const start = performance.now();

    const render = () => {
      rafId = requestAnimationFrame(render);

      // lerp mouse toward target
      const lerpFactor = 0.075;
      mouse.x += (target.x - mouse.x) * lerpFactor;
      mouse.y += (target.y - mouse.y) * lerpFactor;

      const elapsed = (performance.now() - start) / 1000;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(uRes,   canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime,  elapsed);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    render();

    // ── cleanup ──
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
