#version 300 es // GLSL ES 3.00
precision highp float; // 浮動小数点の精度を指定
out vec4 fragColor; // 出力変数
uniform vec2 u_resolution; // ビューポートの解像度
uniform float u_time; // 時間
int channel;

float fractSin11(float x) { // 1 in, 1 out
  return fract(1000.0 * sin(x));
}

float fractSin21(vec2 xy) { // 2 in, 1 out
  return fract(sin(dot(xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 pos = gl_FragCoord.xy; // フラグメント座標を正規化
  pos += floor(60.0 * u_time); // フラグメント座標を時間変動
  channel = int(2.0 * gl_FragCoord.x / u_resolution.x); // ビュ−ポートを分割して各チャンネルを表示
  if (channel == 0) {
    fragColor = vec4(fractSin11(pos.x));
  } else {
    fragColor = vec4(fractSin21(pos.xy / u_resolution.xy));
  }
  fragColor.a = 1.0;
}