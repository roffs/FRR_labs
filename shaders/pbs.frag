#version 330

in vec3 vNormal;
in vec3 vPos;
in vec2 vTexCoord;

uniform mat4 view;
uniform vec3 light;
uniform vec3 fresnel;

uniform sampler2D color_map;
uniform sampler2D roughness_map;
uniform sampler2D metalness_map;

uniform float metalness;
uniform float roughness;

out vec4 frag_color;

const float PI = 3.141592;

float tr_ggx_ndf(float roughness, float NdotH) {
    float a = pow(roughness, 2);
    float a2 = pow(a, 2);

    float result = a2 / (PI * pow(pow(NdotH,2) * (a2 - 1) + 1, 2));
    return result;
}

float schlick_ggx_g(float Ndot, float k) {
    float result = Ndot / (Ndot*(1-k) + k);
    return result;
}

float smith_g(float NdotV, float NdotL, float k) {
    float masking = schlick_ggx_g(NdotV, k);
    float shadowing = schlick_ggx_g(NdotL, k);

    return masking * shadowing;
}

vec3 schlick_f(vec3 f0, float LdotH) {
    vec3 result = f0 + (1.0 - f0)*pow(clamp(1.0 - LdotH, 0.0, 1.0), 5);
    return result;
}

void main(void) {
    vec3 wLight = vec3(view * vec4(light, 1.0));
    
    vec3 N = normalize(vNormal);
    vec3 L = normalize(wLight - vPos);
    vec3 V = normalize(-vPos);
    vec3 H = normalize(L + V);
    
    float NdotL = max(dot(N,L), 0.0);
    float NdotV = max(dot(N,V), 0.0);
    float NdotH = max(dot(N,H), 0.0);
    float LdotH = max(dot(L,H), 0.0);

    vec3 albedo = texture(color_map, vTexCoord).rgb;
    //albedo = vec3(0.8, 0.8, 0.0);
    float roughness = texture(roughness_map, vTexCoord).x;
    float metalness = texture(metalness_map, vTexCoord).x;


    // COMPUTE MICROGEOMETRY NDF
    float NDF = tr_ggx_ndf(roughness, NdotH);


    // COMPUTE GEOMETRY FUNCTION
    float k_direct = pow((roughness + 1.0), 2) / 8.0;
    float G = smith_g(NdotV, NdotL, k_direct);


    // COMPUTE FRESNEL REFLECTANCE
    vec3 F0 = mix(fresnel, albedo, metalness);
    vec3 F = schlick_f(F0, LdotH);


    // COMPUTE KD & KS FACTORS
    vec3 ks = F;
    vec3 kd = 1 - ks;
    kd = kd * (1 - metalness);


    // COMPUTE DIFUSE COMPONENT
    vec3 fLambert = albedo / PI; 
    vec3 diffuse = kd * fLambert;

    // COMPUTE SPECULAR COMPONENT
    vec3 fCookTorrance = F * G * NDF / (4 * NdotL * NdotV);
    vec3 specular = ks * fCookTorrance;


    // COMPUTE PBR RESULT
    vec3 result = vec3(diffuse + specular) * NdotL;

    
    // APPLY GAMMA CORRECTION
    float gamma = 2.2;
    vec3 final_color = pow(result, vec3(1.0/gamma));

    frag_color = vec4(final_color, 1.0);
    
}
