#version 330

in vec3 vPos;
in vec3 vNormal;

out vec4 fragColor;

uniform mat3 normal_matrix;
uniform mat4 view;

uniform vec3 light;

// Material properties
uniform vec4 matAmbient = vec4(0.2, 0.2, 0.2, 1.0);
uniform vec4 matDiffuse = vec4(0.5, 0.5, 0.5, 1.0);
uniform vec4 matSpecular = vec4(0.5, 0.5, 0.5, 1.0);
uniform float matShininess = 10.0f;

// Light properties
uniform vec4 lightAmbient = vec4(0.6, 0.6, 0.6, 1.0);
uniform vec4 lightDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
uniform vec4 lightSpecular = vec4(0.5, 0.5, 0.5, 1.0);


void main (void) {
    vec3 wLight = vec3(view * vec4(light, 1.0));
    
    vec3 N = normal_matrix * vNormal;
    vec3 L = wLight - vPos;
    vec3 V = -vPos;

    N = normalize(N); 
    V = normalize(V); 
    L = normalize(L);

    //vec3 R = 2*(max(dot(N,L), 0.0))*N - L;
    vec3 R = reflect(-L, N); 

    float NdotL = max(dot(N,L), 0.0);
    float RdotV = max(dot(R,V), 0.0);

    vec4 ambient = matAmbient * lightAmbient;
    vec4 diffuse = matDiffuse * lightDiffuse * NdotL;
    vec4 specular = matSpecular * lightSpecular * pow(RdotV, matShininess);
    
    fragColor = ambient + diffuse + specular;
}
