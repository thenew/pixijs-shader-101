precision lowp float;

uniform vec3 uColor;
varying float vUV;

uniform vec3 uColorBrand;

varying float vDot;

void main() {
    
    vec3 color = mix(uColor, uColorBrand, vUV * 0.2);
    
    color = mix(color,vec3(1.), vDot);
    
    gl_FragColor = vec4(color,1.0);
}