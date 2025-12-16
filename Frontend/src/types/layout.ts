export type LayoutNodeType = 'room' | 'pantry' | 'label';

export interface LayoutNode {
  id: string;                 // roomId like "H0-121" OR "pantry-1"
  type: LayoutNodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

export interface AbsoluteFloorLayout {
  frame: {
    width: number;
    height: number;
  };
  nodes: LayoutNode[];
}
