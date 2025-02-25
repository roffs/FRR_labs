#version 330

out vec4 frag_color;

in vec2 tex_coords;

uniform sampler2D current_texture;

void main (void) {
    frag_color = texture(current_texture, tex_coords);
}