import { Filter } from '@pixi/core';

// import size from 'size'
const size = {
  width: window.innerWidth,
  height: window.innerHeight
};

const vert = null;

const frag = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
void main(void)
{
  gl_FragColor = texture2D(uSampler, vTextureCoord);
  // gl_FragColor = vec4(gl_FragCoord.x/1000.0,0.0,0.0,1.0);
}
`;

export default class ParticlesFilter extends Filter {
  constructor() {
    super(vert, frag);
    this.uResolution = [size.width, size.height];
    this.uTime = 0.0;
    this.uRadius = 0.0;
    this.uNoise = 15.0;
    this.uStrength = 0.5;
    this.uCircle = 1.5;

    // uViewSize: o.core.uViewSize,
    // uTime: o.core.uTime,
    // uColor: o.core.uColorAccent,
    // uGrow: new j.yb(0),
    // uMove: new j.yb(0),
    // uColorBrand: o.core.uColorBrand,
    // uScroll: new j.yb(0)

    //   {
    //   key: 'updateScroll',
    //   value: function (t) {
    //     this.targetScroll = t
    //   }
    // },
    // {
    //   key: 'update',
    //   value: function (t) {
    //     this.particleMovement.update(t);
    //     var e = 1 - Math.exp( - 4 * t),
    //     n = Object(E.b) (this.scroll, this.targetScroll, e, 0.00001);
    //     0 !== n && (this.scroll += n, this.material.uniforms.uScroll.value = this.scroll)
    //   }
    // }
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
