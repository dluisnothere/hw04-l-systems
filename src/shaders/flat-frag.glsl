#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;

in vec2 fs_Pos;
out vec4 out_Col;

void main() {
  vec3 deepblue = vec3(80.0, 140.0, 131.0) / 255.0;
  vec3 vex = vec3(30.0, 96.0, 97.0) / 255.0;
  out_Col = vec4(deepblue, 1.0);
}
