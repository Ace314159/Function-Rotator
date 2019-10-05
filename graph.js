// Canvas
const canvas = document.getElementById('canvas');

// OpenGL
export const regl = require('regl')(canvas);
const glslify = require('glslify');
export const camera = require('regl-camera')(regl, {
  center: [0, 0, 0],
  zoomSpeed: 0.5,
  rotationSpeed: 0.5,
  theta: Math.PI / 2,
  far: 2000,
});

// Graphing
const Y_FREQ = 100;
const RAD_FREQ = 360;
const minX = -10, maxX = 10, minY = -10, maxY = 10, minZ = -10, maxZ = 10;


const createDisc = {
  x: (x, point) => {
    const disc = [];
    const radius = point[0] - x;
    for (let i = 0; i < RAD_FREQ; i += 1) {
      const angle = (i / (RAD_FREQ - 1)) * 2 * Math.PI;
      disc.push([x + radius * Math.cos(angle), point[1], radius * Math.sin(angle)]);
    }
    return disc;
  },
  y: (y, point) => {
    const disc = [];
    const radius = point[1] - y;
    for (let i = 0; i < RAD_FREQ; i += 1) {
      const angle = (i / (RAD_FREQ - 1)) * 2 * Math.PI;
      disc.push([point[0], y + radius * Math.cos(angle), radius * Math.sin(angle)]);
    }
    return disc;
  },
};

const drawAxis = regl({
  frag: glslify('./shaders/solidColor.frag'),
  vert: glslify('./shaders/default.vert'),
  attributes: {
    position: regl.prop('position'),
  },
  uniforms: {
    color: regl.prop('color'),
  },
  count: 2,
  primitive: 'lines',
});

const drawPartFunc = regl({
  frag: glslify('./shaders/solidColor.frag'),
  vert: glslify('./shaders/default.vert'),
  attributes: {
    position: regl.prop('vertices'),
  },
  elements: regl.prop('indices'),
  uniforms: {
    color: [0, 0, 0, 0.5],
  },
  primitive: 'triangles',
  blend: {
    enable: true,
    func: {
      srcRGB: 'src alpha',
      srcAlpha: 'src alpha',
      dstRGB: 'one minus src alpha',
      dstAlpha: 'one minus src alpha',
    },
  },
  cull: {
    enable: true,
    face: regl.prop('face'),
  },
});

export const drawFunc = (f, axis, num) => {
  if (canvas.width !== canvas.clientWidth) {
    canvas.width = canvas.clientWidth;
  }
  if (canvas.height !== canvas.clientHeight) {
    canvas.height = canvas.clientHeight;
  }

  drawAxis({ position: [[-1000, 0, 0], [1000, 0, 0]], color: [1, 0, 0, 1] });
  drawAxis({ position: [[0, -1000, 0], [0, 1000, 0]], color: [0, 1, 0, 1] });
  drawAxis({ position: [[0, 0, -1000], [0, 0, 1000]], color: [0, 0, 1, 1] });

  if (f == null || num == null) return;

  const vertices = createDisc[axis](num, [minX, f(minX)]);
  const indices = [];
  for (let i = 1; i < Y_FREQ; i += 1) {
    const x = (i / (Y_FREQ - 1)) * (maxX - minX) + minX;
    vertices.push(...createDisc[axis](num, [x, f(x)]));
    for (let j = 1; j < RAD_FREQ; j += 1) {
      indices.push([i * RAD_FREQ + j, i * RAD_FREQ + j - 1, (i - 1) * RAD_FREQ + j - 1]);
      indices.push([i * RAD_FREQ + j, (i - 1) * RAD_FREQ + j - 1, (i - 1) * RAD_FREQ + j]);
    }
  }

  drawPartFunc({
    vertices,
    indices,
    face: 'front',
  });
  drawPartFunc({
    vertices,
    indices,
    face: 'back',
  });
};
