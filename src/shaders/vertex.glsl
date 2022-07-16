#version 300 es
in vec2 in_position;
in vec3 in_color;

out vec3 o_color;

void main() {
    gl_Position = vec4(in_position.x, in_position.y, 0, 1);
    o_color = in_color;
}
