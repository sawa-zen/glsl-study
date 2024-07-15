#version 300 es // GLSL ES 3.00
precision highp float; // 浮動小数点の精度を指定
out vec4 flagColor; // 出力変数
uniform vec2 u_resolution; // ビューポートの解像度

int channel;
void main() {
  vec2 pos = gl_FragCoord.xy / u_resolution.xy; // フラグメント座標を正規化

  float n = 4.0; // 階調数
  pos *= n; // フラグメント座標範囲を [0, n] 区間にスケール
  channel = int(2.0 * gl_FragCoord.x / u_resolution.x); // ビュ−ポートを分割して各チャンネルを表示

  vec3[4] col4 = vec3[](// ベクトルの配列
    vec3(1.0, 0.0, 0.0), // 赤色
    vec3(0.0, 0.0, 1.0), // 青色
    vec3(0.0, 1.0, 0.0), // 緑色
    vec3(1.0, 1.0, 0.0) // 黄色
  );

  if (channel == 0) { // 左: 階段関数を使った補間
    pos = floor(pos) + step(0.5, fract(pos)); // フラグメント座標を階段化
  } else { // 右: 滑らかな階段関数を使った補間

  }
  pos /= n; // フラグメント座標範囲を [0, 1] 区間に正規化
  vec3 col = mix(mix(col4[0], col4[1], pos.x), mix(col4[2], col4[3], pos.x), pos.y); // 色を混合

  flagColor = vec4(col, 1.0); // 色を設定
}