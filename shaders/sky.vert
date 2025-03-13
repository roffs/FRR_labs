#version 330

layout (location = 0) in vec3 vert;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 texCoord;

out vec3 TexCoords;

uniform mat4 view;
uniform mat4 projection;

void main(void)  {
    TexCoords = vert; 

    // Remove the translation factor from the view matrix
    mat4 view_no_translation = view;
    view_no_translation[3][0] = 0.0;
    view_no_translation[3][1] = 0.0;
    view_no_translation[3][2] = 0.0;

    gl_Position = (projection * view_no_translation * vec4(vert, 1.0)).xyww;
}
