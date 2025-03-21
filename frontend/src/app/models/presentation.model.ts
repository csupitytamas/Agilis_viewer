export interface Presentation {
  id: string;
  title: string;
  content: object;
  thumbnail: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}
