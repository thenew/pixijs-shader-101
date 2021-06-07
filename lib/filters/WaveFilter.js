import { Filter } from '@pixi/core';
const glsl = require('glslify');

// import size from 'size'
const size = {
  width: window.innerWidth,
  height: window.innerHeight
};


const uniforms = {
}


const vertexShader = null
const fragmentShader = glsl(`
#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')

uniform sampler2D u_map;
uniform sampler2D u_hovermap;

uniform float u_alpha;
uniform float u_time;
uniform float u_progressHover;
uniform float u_progressClick;

uniform vec2 u_res;
uniform vec2 u_mouse;
uniform vec2 u_ratio;
uniform vec2 u_hoverratio;

varying vec2 v_uv;

float circle(in vec2 _st, in float _radius, in float blurriness){
    vec2 dist = _st - vec2(0.5);
	  return 1. - smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);
}


void main() {
  vec2 resolution = u_res * PR;
  float time = u_time * 0.05;
  float progress = u_progressClick;
  float progressHover = u_progressHover;
  vec2 uv = v_uv;
  vec2 uv_h = v_uv;


  vec2 st = gl_FragCoord.xy / resolution.xy - vec2(.5);
  st.y *= resolution.y / resolution.x;

  vec2 mouse = vec2((u_mouse.x / u_res.x) * 2. - 1.,-(u_mouse.y / u_res.y) * 2. + 1.) * -.5;
  mouse.y *= resolution.y / resolution.x;


  float offX = uv.x * .3 - time * 0.3;
  float offY = uv.y + sin(uv.x * 5.) * .1 - sin(time * 0.5) + snoise3(vec3(uv.x, uv.y, time) * 0.5);
  offX += snoise3(vec3(offX, offY, time) * 5.) * .3;
  offY += snoise3(vec3(offX, offX, time * 0.3)) * .1;
  float nc = (snoise3(vec3(offX, offY, time * .5) * 8.)) * progressHover;
  float nh = (snoise3(vec3(offX, offY, time * .5 ) * 2.)) * .03;

  nh *= smoothstep(nh, 0.5, 0.6);

  uv_h -= vec2(0.5);
  uv_h *= u_hoverratio;
  uv_h += vec2(0.5);

  uv -= vec2(0.5);
  uv *= u_ratio;
  uv += vec2(0.5);

  vec4 image = texture2D(u_map, uv_h + vec2(nc + nh) * progressHover);
  vec4 hover = texture2D(u_hovermap, uv + vec2(nc + nh) * progressHover * (1. - progress));

  vec4 finalImage = mix(image, hover, clamp(nh * (1. - progress) + progressHover, 0., 1.));

  gl_FragColor = vec4(finalImage.rgb, u_alpha);
}
`)

const getRatio = ({ x: w, y: h }, { width, height }, r = 0) => {
    const m = multiplyMatrixAndPoint(rotateMatrix(THREE.Math.degToRad(r)), [w, h])
    const originalRatio = {
        w: m[0] / width,
        h: m[1] / height,
    }

    const coverRatio = 1 / Math.max(originalRatio.w, originalRatio.h)

    return new THREE.Vector2(
        originalRatio.w * coverRatio,
        originalRatio.h * coverRatio,
    )
}

export default class WaveFilter extends Filter {
  constructor() {
    super(
      vertexShader,
      fragmentShader,
      uniforms
    );

    this.images = []
    this.mouse = new THREE.Vector2(0, 0)


    const texture = this.images[0]
    const hoverTexture = this.images[1]

    this.u_alpha = { value: 1 }
    this.u_map = { type: 't', value: texture }
    this.u_ratio = { value: getRatio(this.sizes, texture.image) }
    this.u_hovermap = { type: 't', value: hoverTexture }
    this.u_hoverratio = { value: getRatio(this.sizes, hoverTexture.image) }
    this.u_shape = { value: this.images[2] }
    this.u_mouse = { value: this.mouse }
    this.u_progressHover = { value: 0 }
    this.u_progressClick = { value: 0 }
    this.u_time = { value: 0.0 }
    this.u_res = { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }

  }

  get uTime() {
    return this.uniforms.u_time
  }
  
  set uTime(value) {
    this.uniforms.u_time = value
  }

}
