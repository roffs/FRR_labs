#version 330

layout (location = 0) in vec3 vert;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 texCoord;

out vec3 TexCoords;

uniform mat4 view;
uniform mat4 projection;

void main(void)  {
    TexCoords = vert; 
    gl_Position = projection * view * vec4(vert * 2, 1.0);
}
