#version 300 es // GLSL ES 3.00
precision highp float; // 浮動小数点の精度を指定
out vec4 fragColor; // 出力変数
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

vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0, 4.0, 2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 tex(vec2 st) { // s: 偏角, t: 動径
  float time = 0.2 * u_time; // 時間の速度調整
  vec3 circ = vec3(pol2yx(vec2(time, 0.5)) + 0.5, 1.0); // (0.5, 0.5, 1.0) を中心とした, z=1 平面上の半径 0.5 の円上を動くベクトル
  vec3[3] col3 = vec3[]( // スウィズル演算子を使って circ
    circ.rgb, circ.gbr, circ.brg
  );
  st.s = st.s / PI + 1.0; // 偏角の範囲を (0, 2] 区間に変換
  st.s += time; // 偏角を時間とともに動かす
  int ind = int(st.s);
  vec3 col = mix(col3[ind % 2], col3[(ind + 1) % 2], fract(st.s)); // 偏角に沿って赤、青、白を混合

  return mix(col3[2], col, st.t); // 動径にそって col と白を混合
}

void main() {
  vec2 pos = gl_FragCoord.xy / u_resolution.xy;
  pos = 2.0 * pos.xy - vec2(1.0);
  pos = xy2pol(pos);
  pos.x = mod(0.5 * pos.x / PI, 1.0);
  fragColor.rgb = hsv2rgb(vec3(pos, 1.0));
  fragColor.a = 1.0;
}