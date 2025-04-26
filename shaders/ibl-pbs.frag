#version 330

in vec3 worldPos;
in vec3 worldNormal;
in vec2 vTexCoord;

uniform mat4 view;
uniform vec3 fresnel;

uniform sampler2D color_map;
uniform sampler2D roughness_map;
uniform sampler2D metalness_map;

uniform samplerCube diffuse_map;
uniform samplerCube specular_map;

out vec4 frag_color;

const float PI = 3.141592;


vec3 schlick_f(vec3 f0, float NdotV) {
    vec3 result = f0 + (1.0 - f0)*pow(clamp(1.0 - NdotV, 0.0, 1.0), 5);
    return result;
}

void main(void) {    
    vec3 viewPos = inverse(view)[3].xyz;
    
    vec3 N = normalize(worldNormal);
    vec3 V = normalize(viewPos - worldPos);
    vec3 R = reflect(-V, N);
    
    float NdotV = max(dot(N,V), 0.0);

    vec3 albedo = texture(color_map, vTexCoord).rgb;
    float roughness = texture(roughness_map, vTexCoord).x;
    float metalness = texture(metalness_map, vTexCoord).x;

    float gamma = 2.2;


    // COMPUTE FRESNEL REFLECTANCE
    vec3 F0 = mix(fresnel, albedo, metalness);
    vec3 F = schlick_f(F0, NdotV);


    // COMPUTE KD & KS FACTORS
    vec3 ks = F;
    vec3 kd = 1 - ks;
    kd = kd * (1 - metalness);


    // COMPUTE DIFUSE COMPONENT
    vec3 irradiance = texture(diffuse_map, N).rgb; 
    vec3 diffuse = kd * albedo * irradiance;


    // COMPUTE SPECULAR COMPONENT
    vec3 spec_irradiance = textureLod(specular_map, R, roughness * 6).rgb;

    vec3 fCookTorrance = F * spec_irradiance / 4;
    vec3 specular = ks * fCookTorrance;


    // COMPUTE PBR RESULT
    vec3 result = diffuse + specular;

    
    // APPLY GAMMA CORRECTION
    vec3 final_color = pow(result, vec3(1.0/gamma));

    frag_color = vec4(final_color, 1.0);
    
}
