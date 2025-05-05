"use client";

import {
  type ReactNode,
  useState,
  useEffect,
  Children,
  cloneElement,
} from "react";
import { useDragDrop, type DraggableAnimal } from "./DragDropContext";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const DragEndPoint = ({
  children,
  categoryId,
  onDrop,
}: {
  children: ReactNode;
  categoryId: string;
  onDrop?: (animal: DraggableAnimal, categoryId: string) => void;
}) => {
  const { dropPos, animal } = useDragDrop();
  const [rect, setRect] = useState<Rect>();

  useEffect(() => {
    if (!dropPos || !rect || !onDrop || !animal) return;

    const x2 = rect.x + rect.width;
    const y2 = rect.y + rect.height;

    if (
      dropPos.x >= rect.x &&
      dropPos.x <= x2 &&
      dropPos.y >= rect.y &&
      dropPos.y <= y2
    ) {
      onDrop(animal, categoryId);
    }
  }, [dropPos, rect, onDrop, animal, categoryId]);

  const newChildren = Children.map(children, (child: any) =>
    cloneElement(child, {
      onLayout: (evt: any) => {
        evt.target.measure(
          (
            _x: number,
            _y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number
          ) => {
            setRect({ x: pageX, y: pageY, width, height });
          }
        );
      },
    })
  );

  return newChildren;
};
