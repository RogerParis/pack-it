import React from 'react';
import { View } from 'react-native';
import { ClipPath, Defs, G, Line, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { COLORS } from '@/theme/colors';

type Props = {
  fill?: number; // 0..1
  size?: number;
};

export default function BigSuitcase({ fill = 0, size = 74 }: Props) {
  const w = 60,
    h = 54;
  const viewW = w + 4,
    viewH = h + 4;
  const fy = 48 - fill * 36;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${viewW} ${viewH}`}>
        <Defs>
          <ClipPath id="bigsc">
            <Rect x="5" y="12" width={w - 10} height={h - 14} rx="6" />
          </ClipPath>
          <LinearGradient id="fillg" x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor={COLORS.teal} />
            <Stop offset="1" stopColor={COLORS.ink} />
          </LinearGradient>
        </Defs>

        {/* handle */}
        <Rect
          x="22"
          y="4"
          width="18"
          height="8"
          rx="2.5"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="2"
        />
        {/* body */}
        <Rect
          x="5"
          y="12"
          width={w - 10}
          height={h - 14}
          rx="6"
          fill="white"
          stroke={COLORS.ink}
          strokeWidth="2"
        />
        {/* fill layer */}
        {fill > 0 && (
          <G clipPath="url(#bigsc)">
            <Rect x="5" y={fy} width={w - 10} height={h} fill="url(#fillg)" />
          </G>
        )}
        {/* center seam */}
        <Line
          x1={viewW / 2}
          y1="12"
          x2={viewW / 2}
          y2={h - 2}
          stroke={COLORS.ink}
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />
        {/* latches */}
        <Rect
          x="18"
          y="10"
          width="5"
          height="4"
          rx="1"
          fill={COLORS.sun}
          stroke={COLORS.ink}
          strokeWidth="1.2"
        />
        <Rect
          x="41"
          y="10"
          width="5"
          height="4"
          rx="1"
          fill={COLORS.sun}
          stroke={COLORS.ink}
          strokeWidth="1.2"
        />
      </Svg>
    </View>
  );
}
