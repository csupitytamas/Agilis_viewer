import {Widget} from './widget.model';

export interface Slide {
  id: string;
  backgroundPath?: string;
  pageNumber: number;
  widgets: Widget[];
  animation?: string;
}
