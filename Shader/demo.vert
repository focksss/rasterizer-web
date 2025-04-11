#version 300 es
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aTexCoords;

out vec3 position;
out vec3 normal;
out vec2 texCoord;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main() {
    gl_Position = projectionMatrix * viewMatrix * vec4(aPos, 1.0);
    position = vec3(vec4(aPos, 1));
    texCoord = aTexCoords;
    normal = aNormal;
}
