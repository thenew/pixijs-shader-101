varying vec2 vTextureCoord;
uniform sampler2D uSampler;
void main(void)
{
  // gl_FragColor = texture2D(uSampler, vTextureCoord);
  gl_FragColor = vec4(gl_FragCoord.x/1000.0,0.0,0.0,1.0);
}