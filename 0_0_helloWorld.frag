#version 300 es // GLSL ES 3.00
precision highp float; // 浮動小数点の精度を指定
out vec4 flagColor; // 出力変数
uniform vec2 u_resolution; // ビューポートの解像度

void main() {
  vec2 pos = gl_FragCoord.xy / u_resolution.xy; // フラグメント座標を正規化

  vec3[4] col4 = vec3[](// ベクトルの配列
    vec3(1.0, 0.0, 0.0), // 赤色
    vec3(0.0, 0.0, 1.0), // 青色
    vec3(0.0, 1.0, 0.0), // 緑色
    vec3(1.0, 1.0, 0.0) // 黄色
  );
  vec3 col = mix(mix(col4[0], col4[1], pos.x), mix(col4[2], col4[3], pos.x), pos.y); // 色を混合

  flagColor = vec4(col, 1.0); // 色を設定
}