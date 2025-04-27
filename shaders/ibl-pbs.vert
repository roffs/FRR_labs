#version 330

layout (location = 0) in vec3 vert;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 texCoord;


out vec3 worldPos;
out vec3 worldNormal;
out vec2 vTexCoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main(void)  {
    worldPos = (model * vec4(vert, 1.0)).xyz;

    mat3 normalMatrix = mat3(transpose(inverse(model)));
    worldNormal = normalize(normalMatrix * normal);

    vTexCoord = texCoord;

    gl_Position = projection * view * model * vec4(vert, 1.0);
}
