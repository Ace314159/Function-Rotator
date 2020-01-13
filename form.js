import { Parser } from 'expr-eval';

const parser = new Parser();
const fInput = document.getElementById('f');
const axisNumInput = document.getElementById('axisNum');

const speed = 0.1;
let keysPressed = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
};
let centerX = 0;
let centerY = 0;

export function getF() {
  let returnVal;

  const eq = $.trim(fInput.value);
  if (eq === '') {
    fInput.classList.remove('is-invalid');
    fInput.classList.remove('is-valid');
    return null;
  }

  try {
    const f = parser.parse(eq);
    const vars = f.variables();
    if (vars.length > 1 || vars[0] !== 'x') {
      returnVal = null;
    } else {
      returnVal = f.toJSFunction(['x']);
    }
  } catch (e) {
    returnVal = null;
  }

  if (returnVal === null) {
    fInput.classList.remove('is-valid');
    fInput.classList.add('is-invalid');
  } else {
    fInput.classList.remove('is-invalid');
    fInput.classList.add('is-valid');
  }

  return returnVal;
}

export function getAxis() {
  return document.querySelector('input[name="axis"]:checked').value;
}

export function getAxisNum() {
  const val = axisNumInput.value;
  if (val === '') {
    axisNumInput.classList.remove('is-invalid');
    axisNumInput.classList.remove('is-valid');
    return null;
  }

  if ($.isNumeric(val)) {
    axisNumInput.classList.remove('is-invalid');
    axisNumInput.classList.add('is-valid');
    return parseFloat(val);
  }
  axisNumInput.classList.remove('is-valid');
  axisNumInput.classList.add('is-invalid');
  return null;
}

function moveCenter() {
  if (keysPressed.KeyW) {
    centerY += speed;
  }
  if (keysPressed.KeyA) {
    centerX -= speed;
  }
  if (keysPressed.KeyS) {
    centerY -= speed;
  }
  if (keysPressed.KeyD) {
    centerX += speed;
  }
}

document.addEventListener('keydown', (e) => {
  keysPressed[e.code] = true;
  moveCenter();
});

document.addEventListener('keyup', (e) => {
  keysPressed[e.code] = false;
  moveCenter();
});

export function getCenter() {
  return [centerX, centerY, 0];
}
