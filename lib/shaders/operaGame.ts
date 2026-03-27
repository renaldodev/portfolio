// The Opera Game fragment shader (Paul Morphy) — port for WebGL2.
// Original by Peter Alexander; CC BY-NC-SA 3.0. See chunk sources.

import { operaChunkA } from './operaGameChunkA';
import { operaChunkB } from './operaGameChunkB';
import { operaChunkC } from './operaGameChunkC';
import { operaChunkD } from './operaGameChunkD';

export const OPERA_GAME_VERTEX = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const OPERA_GAME_FRAGMENT = [operaChunkA, operaChunkB, operaChunkC, operaChunkD].join('\n');
