#version 300 es
precision mediump float;

in vec3 o_color;

out vec4 color;

void main() {
    color = vec4(o_color.x, o_color.y, o_color.z, 1);
}
