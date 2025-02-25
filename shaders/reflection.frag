#version 330

in vec3 vPos;
in vec3 vNormal;

out vec4 fragColor;

uniform mat4 view;

uniform samplerCube specular_map; 

void main (void) {
    
    vec3 N = vNormal;
    vec3 V = (inverse(view)*(vec4(-vPos, 1.0))).xyz;

    N = normalize(N); 
    V = normalize(V); 

    vec3 reflection = reflect(-V, N); 

    fragColor = texture(specular_map, reflection);
}
