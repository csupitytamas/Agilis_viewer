export interface Widget {
  id: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  type: string;
  text?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  textDecoration?: 'underline' | 'line-through';
}
