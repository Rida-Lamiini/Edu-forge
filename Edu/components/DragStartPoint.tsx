"use client";

import type { ReactNode } from "react";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useDragDrop, type DraggableAnimal } from "./DragDropContext";
import type { Animated } from "react-native-reanimated";

export const DragStartPoint = ({
  children,
  animal,
}: {
  children: ReactNode;
  animal: DraggableAnimal;
}) => {
  const { pos, onDragStart, onDragEnd } = useDragDrop();

  const dragGesture = Gesture.Pan()
    .onStart(() => {
      onDragStart(animal);
    })
    .onUpdate((evt) => {
      const { absoluteX, absoluteY } = evt;
      pos.x.setValue(absoluteX);
      pos.y.setValue(absoluteY);
    })
    .onEnd(() => {
      const convert = (value: Animated.Value) => Number(JSON.stringify(value));
      onDragEnd({ x: convert(pos.x), y: convert(pos.y) });
    })
    .runOnJS(true);

  return <GestureDetector gesture={dragGesture}>{children}</GestureDetector>;
};
