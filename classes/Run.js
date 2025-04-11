import { Shader } from 'https://github.com/focksss/rasterizer-web/new/main/classes/Shader.js';
import { Matrix4, Vector3 } from 'https://github.com/focksss/rasterizer-web/new/main/classes/mathUtils.js';
import { Controller } from 'https://github.com/focksss/rasterizer-web/new/main/classes/Controller.js';
import { Triangle } from 'https://github.com/focksss/rasterizer-web/new/main/classes/Triangle.js';
import { GLTF } from 'https://github.com/focksss/rasterizer-web/new/main/classes/gLTF.js';

let shader = null;
const canvas = document.getElementById('glCanvas');
let aspect = canvas.width / canvas.height;

let cameraPosition = new Vector3(0, 0, 2);
let cameraRotation = new Vector3(0, 0, 0);
let animationFrameId = null;

let VAO = 0; let VBO = 0;

let lastTime = performance.now();
let frames = 0;
let fps = 0;

function render(gl, texture) {
  Controller.run(cameraPosition, cameraRotation);

  const viewMatrix = Matrix4.view(cameraRotation, cameraPosition);
  const projectionMatrix = Matrix4.projection(Controller.FOV * Math.PI / 180, aspect, 0.01, 10000.0)
  shader.setUniform('viewMatrix', viewMatrix.toArray());
  shader.setUniform('projectionMatrix', projectionMatrix.toArray());

  shader.setUniformTexture('uTexture', texture, 0)

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.bindVertexArray(VAO);
  gl.enableVertexAttribArray(0);
  gl.drawArrays(gl.TRIANGLES, 0, 3 * 12);

  // Continue animation loop
  frames++;
  const now = performance.now();
  const delta = now - lastTime;

  if (delta >= 1000) {
    fps = frames;
    frames = 0;
    lastTime = now;

    const fpsDisplay = document.getElementById('fps');
    if (fpsDisplay) {
      fpsDisplay.textContent = fps.toString();
    }
  }
  animationFrameId = requestAnimationFrame(() => render(gl, texture));
}

async function main() {
  const canvas = document.getElementById('glCanvas');
  window.addEventListener('keydown', (e) => {
    const keysToBlock = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ']; // also spacebar if you need
    if (keysToBlock.includes(e.key)) {
      e.preventDefault();
    }
  }, { passive: false });
  const gl = canvas.getContext('webgl2', { antialias: true });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  aspect = canvas.width / canvas.height;

  if (!gl) {
    console.error('WebGL not available');
    return;
  }

  shader = new Shader(gl, 'https://github.com/focksss/rasterizer-web/new/main/Shaders/demo.vert', 'https://github.com/focksss/rasterizer-web/new/main/Shaders/demo.frag');
  await new Promise(resolve => {
    const checkShader = () => {
      if (shader.program) {
        resolve();
      } else {
        setTimeout(checkShader, 50);
      }
    };
    checkShader();
  });

  const vertices = new Float32Array([
    // back face
    -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // bottom_left
    1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 1.0, // top_right
    1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 0.0, // bottom_right
    1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 1.0, // top_right
    -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // bottom_left
    -1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0, // top_left
    // front face
    -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // bottom_left
    1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, // bottom_right
    1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, // top_right
    1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, // top_right
    -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, // top_left
    -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // bottom_left
    // left face
    -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, // top_right
    -1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0, // top_left
    -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, // bottom_left
    -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, // bottom_left
    -1.0, -1.0, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0, // bottom_right
    -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, // top_right
    // right face
    1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, // top_left
    1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 1.0, // bottom_right
    1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, // top_right
    1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 1.0, // bottom_right
    1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, // top_left
    1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, // bottom_left
    // bottom face
    -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 1.0, // top_right
    1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 1.0, 1.0, // top_left
    1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 0.0, // bottom_left
    1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 0.0, // bottom_left
    -1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.0, 0.0, // bottom_right
    -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 1.0, // top_right
    // top face
    -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, // top_left
    1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, // bottom_right
    1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0, // top_right
    1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, // bottom_right
    -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, // top_left
    -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0  // bottom_left
  ]);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 255, 255]));

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
  };
  image.src = 'assets/null.png';

  VAO = gl.createVertexArray();
  gl.bindVertexArray(VAO);
  VBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
  gl.enableVertexAttribArray(2);

  Controller.initialize(0.03, 0.02);

  const test = new GLTF('grassblockGLTF');

  render(gl, texture);
}

window.onload = main;
