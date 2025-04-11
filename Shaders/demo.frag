#version 300 es
precision highp float;
in vec2 texCoord;
in vec3 normal;
uniform sampler2D uTexture;
out vec4 fragColor;

void main() {
  fragColor = vec4((texture(uTexture, texCoord).rgb + (normal*0.5+0.5) + vec3(texCoord,0))/3.0, 1);
}
