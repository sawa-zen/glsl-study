#version 300 es // GLSL ES 3.00
precision highp float; // 浮動小数点の精度を指定
out vec4 fragColor; // 出力変数
uniform vec2 u_resolution; // ビューポートの解像度
uniform float u_time; // 時間

void main() {
  vec2 pos = gl_FragCoord.xy / u_resolution.xy; // フラグメント座標を正規化
  pos *= vec2(32.0, 9.0); // 座標のスケール
  uint[9] a = uint[]( // 2進数表示する符号なし整数の配列
    uint(u_time), // a[0]: 経過時間
    0xbu, // a[1]: 符号なし整数としての16進数のB
    9u, // a[2]: 符号なし整数としての9
    0xbu ^ 9u, // a[3]: XOR演算
    0xFFFFFFFFu, // a[4]: 符号なし整数の最大値
    0xffffffffu + uint(u_time), // a[5]: オーバーフロー
    floatBitsToUint(floor(u_time)), // a[6]: 浮動小数点数のビット列を符号なし整数に変換
    floatBitsToUint(-floor(u_time)), // a[7]
    floatBitsToUint(11.5625) // a[8]
  );
  if (fract(pos.x) < 0.1) {
    if (floor(pos.x) == 1.0) { // 1桁目と2桁目の区切り線
      fragColor = vec4(1, 0, 0, 1);
    } else if (floor(pos.x) == 9.0) { // 9桁目と10桁目の区切り線
      fragColor = vec4(0, 1, 0, 1);
    } else { // その他の区切り線
      fragColor = vec4(0.5);
    }
  } else if (fract(pos.y) < 0.1) { // 横方向の区切り線
    fragColor = vec4(0.2353, 0.0, 1.0, 1.0);
  } else {
    uint b = a[int(pos.y)]; // y座標に応じてaの要素を表示
    b = (b << uint(pos.x)) >> 31;
    fragColor = vec4(vec3(b), 1.0);
  }
}