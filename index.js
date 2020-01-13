import { regl, camera, drawFunc } from './graph';
import { getF, getAxis, getAxisNum, getCenter } from './form';


regl.frame(() => {
  camera({
    center: getCenter(),
  }, () => {
    regl.clear({
      color: [1, 1, 1, 1],
      depth: 1,
    });


    drawFunc(getF(), getAxis(), getAxisNum());
  });
});
