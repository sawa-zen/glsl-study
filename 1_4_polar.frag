#version 300 es // GLSL ES 3.00
precision highp float; // 浮動小数点の精度を指定
out vec4 flagColor; // 出力変数
uniform vec2 u_resolution; // ビューポートの解像度

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

vec3 tex(vec2 st) { // s: 偏角, t: 動径
  vec3[3] col3 = vec3[](
    vec3(0.0, 0.0, 1.0), // 青色
    vec3(1.0, 0.0, 0.0), // 赤色
    vec3(1.0) // 白
  );
  st.s = st.s / PI + 1.0; // 偏角の範囲を (0, 2] 区間に変換
  int ind = int(st.s);
  vec3 col = mix(col3[ind % 2], col3[(ind + 1) % 2], fract(st.s)); // 偏角に沿って赤、青、白を混合

  return mix(col3[2], col, st.t); // 動径にそって col と白を混合
}

void main() {
  vec2 pos = gl_FragCoord.xy / u_resolution.xy; // フラグメント座標を正規化
  pos = 2.0 * pos.xy - vec2(1.0); // フラグメント座標範囲を [-1, 1] 区間に変換
  pos = xy2pol(pos); // 極座標に変換
  flagColor = vec4(tex(pos), 1.0); // テクスチャマッピング
}