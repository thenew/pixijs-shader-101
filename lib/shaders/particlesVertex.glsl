attribute vec4 aPos;
uniform vec2 uViewSize;
uniform float uTime;
uniform float uScroll;
uniform float uGrow;
uniform float uMove;
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float elasticOut(float t) {
    return sin(-13.0 * (t + 1.0) * HALF_PI) * pow(2.0, -13.0 * t) + 1.0;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle));
}

mat4 rotate3D(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(
        oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
        oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
        oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
        0.0,                                0.0,                                0.0,                                1.0
    );
}

float cubicOut(float t) {
    float f = t - 1.0;
    return f * f * f + 1.0;
}

vec4 getPosition(vec3 transformed){
    vec2 nextTransformed = rotate2d(-uTime  * aPos.w) * aPos.yz;
    
    float scale = aPos.z;
    float speed = aPos.w;
    
    // transformed *= ((nextTransformed.y+20.) / 40.) * 0.5;
    
    vec2 pos = aPos.xy * uViewSize.xy;
    
    vec2 scrollPos = pos;
    scrollPos.y += uScroll * speed;
    scrollPos.y = mod(scrollPos.y+ uViewSize.y/2., uViewSize.y) - uViewSize.y/2.;
    
    vec2 screenUV = scrollPos/ uViewSize.xy + 0.5;
    float depthUV = aPos.z / 25.;
    
    float start = 0.5 * (1.-screenUV.y);
    float duration = 0.5;
    float linearProgress = clamp((uGrow - start)/ duration, 0., 1.);
    
    // float growth = smoothstep( start, start + 0.3, uGrow);
    
    float scaleProgress = elasticOut(linearProgress);
    
    float moveProgress = cubicOut(linearProgress);
    
    transformed *= screenUV.y * scaleProgress;
    
    transformed = (rotate3D(normalize(vec3(pos, aPos.z)), uTime * speed + speed * 1000. + moveProgress * 1. ) * vec4(transformed,1.) ).xyz;
    
    // transformed.xy *= scale;
    // pos.y += uScroll * speed;
    // TODO: add a bit of padding.
    // pos.y = mod(pos.y+ uViewSize.y/2., uViewSize.y) - uViewSize.y/2.;
    
    transformed.xy += scrollPos;
    transformed.y += - 2. +  moveProgress  * 2.;
    transformed.z += aPos.z;
    // transformed.yz += nextTransformed; 
    
    // transformed.z += 20.;
    
    return vec4(transformed, screenUV.y);
}

varying float vDot;
varying float vUV;

void main() {
    
    vec3 transformed = position;

    vec4 newPos =  getPosition(transformed);
    transformed = newPos.xyz;
    gl_Position =  projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
    // gl_Position.y = mod(gl_Position.y + 1., 1.);
    
    vec2 pos = aPos.xy * uViewSize.xy;
    float speed = aPos.w;
    vec3 norm = (rotate3D(normalize(vec3(pos, aPos.z)), uTime * speed + speed * 1000. ) * vec4(normal,1.) ).xyz;
    // norm = normalize(norm);
    // norm = (modelViewMatrix * vec4(norm,1.)).xyz;
    float dotted = dot(normalize(norm),  normalize(vec3(1., 0, 1.)));
    vDot = smoothstep(-1., 1., dotted) * 0.2;
    vUV = smoothstep(0.3, 0.7, newPos.a);
}