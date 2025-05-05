"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Animated } from "react-native";

export type DraggableAnimal = {
  id: number;
  name: string;
  image: any;
  respirationMode: string;
  respirationOrgan: string;
};

interface DragDropContextType {
  animal?: DraggableAnimal;
  pos: {
    x: Animated.Value;
    y: Animated.Value;
  };
  dropPos?: {
    x: number;
    y: number;
  };
  dragging: boolean;
  onDragStart: (animal: DraggableAnimal) => void;
  onDragEnd: (pos: { x: number; y: number }) => void;
}

export const DragDropContext = createContext<DragDropContextType>(
  {} as DragDropContextType
);

export const useDragDrop = () => useContext(DragDropContext);

export const DragDropProvider = ({ children }: { children: ReactNode }) => {
  const [animal, setAnimal] = useState<DraggableAnimal>();
  const [dragging, setDragging] = useState(false);
  const [dropPos, setDropPos] = useState<DragDropContextType["dropPos"]>();
  const pos = useRef({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
  }).current;

  const onDragStart = useCallback<DragDropContextType["onDragStart"]>(
    (animal) => {
      setAnimal(animal);
      setDragging(true);
    },
    []
  );

  const onDragEnd = useCallback<DragDropContextType["onDragEnd"]>((pos) => {
    setDropPos(pos);
    setDragging(false);
  }, []);

  const value = {
    animal,
    pos,
    dropPos,
    dragging,
    onDragStart,
    onDragEnd,
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
};
