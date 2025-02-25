#version 330

layout (location = 0) in vec3 vert;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 texCoord;

out vec3 vNormal;
out vec3 vPos;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main(void)  {

    vNormal = normal;
    vPos = (model * vec4(vert, 1.0)).xyz;

    gl_Position = projection * view * model * vec4(vert, 1.0);
}
