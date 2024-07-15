#version 300 es // GLSL ES 3.00
precision highp float; // 浮動小数点の精度を指定
out vec4 flagColor; // 出力変数
uniform vec2 u_resolution; // ビューポートの解像度
uniform float u_time; // 時間

  const float PI = 3.14159265359; // 円周率

float atan2(float y, float x) { // 値の範囲は（-PI, PI]
  if (x == 0.0) {
    return sign(y) * PI / 2.0;
  } else {
    return atan(y, x);
  }
}

vec2 xy2pol(vec2 xy) {
  return vec2(atan2(xy.y, xy.x), length(xy));
}

vec2 pol2yx(vec2 pol) { // 引数（偏角, 動径）の組み合わせながらベクトル
  return pol.y * vec2(cos(pol.x), sin(pol.x));
}

int channel;
void main() {
  vec2 pos = gl_FragCoord.xy / u_resolution.xy; // フラグメント座標を正規化

  float n = 4.0; // 階調数
  pos *= n; // フラグメント座標範囲を [0, n] 区間にスケール
  channel = int(2.0 * gl_FragCoord.x / u_resolution.x); // ビュ−ポートを分割して各チャンネルを表示
  float thr = 0.25 * sin(u_time); // 範囲の始点と終点を動かすパラメータ

  vec3[4] col4 = vec3[](// ベクトルの配列
    vec3(1.0, 0.0, 0.0), // 赤色
    vec3(0.0, 0.0, 1.0), // 青色
    vec3(0.0, 1.0, 0.0), // 緑色
    vec3(1.0, 1.0, 0.0) // 黄色
  );

  if (channel == 0) { // 左: 階段関数を使った補間
    pos = floor(pos) + step(0.5, fract(pos)); // フラグメント座標を階段化
  } else { // 右: 滑らかな階段関数を使った補間
    pos = floor(pos) + smoothstep(0.25 + thr, 0.75 - thr, fract(pos)); // フラグメント座標を階段化
  }
  pos /= n; // フラグメント座標範囲を [0, 1] 区間に正規化
  vec3 col = mix(mix(col4[0], col4[1], pos.x), mix(col4[2], col4[3], pos.x), pos.y); // 色を混合

  flagColor = vec4(col, 1.0); // 色を設定
}