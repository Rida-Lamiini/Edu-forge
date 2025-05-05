"use client";

import { type ReactNode, useState } from "react";
import { Animated, View, type LayoutRectangle } from "react-native";
import { useDragDrop } from "./DragDropContext";

export const DragContent = ({ children }: { children: ReactNode }) => {
  const { pos, dragging } = useDragDrop();
  const [contentLayout, setContentLayout] = useState<LayoutRectangle>();

  if (!dragging) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        zIndex: 1000,
      }}
    >
      <View
        onLayout={(layout) => setContentLayout(layout.nativeEvent.layout)}
        style={{
          transform: [
            {
              translateX: -((contentLayout?.width ?? 0) / 2),
            },
            {
              translateY: -((contentLayout?.height ?? 0) / 2),
            },
          ],
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
};
