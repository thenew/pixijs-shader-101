precision highp float;

uniform vec2 uResolution;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float uTime;
uniform float uNoise;
uniform float uRadius;
uniform float uStrength;
uniform float uCircle;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

float circle(in vec2 st, in float radius, in float blur){
  vec2 dist = st;
  return 1.0 - smoothstep(
    radius - (radius * blur),
    radius + (radius * blur),
    dot(dist, dist) * 4.0
  );
}

void main(void) {
  vec2 st = gl_FragCoord.xy / uResolution.xy - vec2(0.5);
  st.y *= uResolution.y / uResolution.x;
  
  float n = snoise3(vec3(vTextureCoord.x, vTextureCoord.y, uTime) * uNoise) - 1.0;
  float c = circle(st, uRadius, uStrength) * uCircle;
  float a = smoothstep(0.1, 0.3, c + n);

  // gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), 1.0);
  gl_FragColor = texture2D(uSampler, vTextureCoord);
  gl_FragColor *= 1.0 - a;
}