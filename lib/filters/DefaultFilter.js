import { Filter } from '@pixi/core'

// import size from 'size'
const size = {
  width: window.innerWidth,
  height: window.innerHeight
};

export default class DefaultFilter extends Filter {
  constructor() {
    super(
      null,
      require('glslify')('../shaders/default.glsl')
    );
    // super(null, null);
    this.uResolution = [size.width, size.height];
    this.uTime = 0.0;
    this.uRadius = 0.0;
    this.uNoise = 15.0;
    this.uStrength = 0.5;
    this.uCircle = 1.5;
  }

  get uResolution() {
    return this.uniforms.uResolution;
  }

  set uResolution(value) {
    this.uniforms.uResolution = value;
  }

  get uTime() {
    return this.uniforms.uTime;
  }

  set uTime(value) {
    this.uniforms.uTime = value;
  }

  get uNoise() {
    return this.uniforms.uNoise;
  }

  set uNoise(value) {
    this.uniforms.uNoise = value;
  }

  get uRadius() {
    return this.uniforms.uRadius;
  }

  set uRadius(value) {
    this.uniforms.uRadius = value;
  }

  get uStrength() {
    return this.uniforms.uStrength;
  }

  set uStrength(value) {
    this.uniforms.uStrength = value;
  }

  get uCircle() {
    return this.uniforms.uCircle;
  }

  set uCircle(value) {
    this.uniforms.uCircle = value;
  }
}
