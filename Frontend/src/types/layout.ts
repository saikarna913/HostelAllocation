export type LayoutNodeType = 'room' | 'pantry' | 'label';

export interface AbsoluteLayoutNode {
  id: string;
  type: LayoutNodeType;
  x: number;
  y: number;
  width: number;
  height: number;

  /** optional rotation in degrees */
  rotation?: number;

  /** for pantry / label */
  label?: string;
}

export interface AbsoluteFloorLayout {
  frame: {
    width: number;
    height: number;
  };
  nodes: AbsoluteLayoutNode[];
}
