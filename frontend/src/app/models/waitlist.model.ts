import {Presentation} from './presentation.model';
import {Participant} from './participant.model';
import {User} from './user.model';

export interface Waitlist {
  id: number
  title: string
  description: string
  presentation: Presentation
  maxParticipants: number
  currentSlide: number
  currentParticipants: Participant[]
  startedAt?: Date
  createdAt: Date
  closedAt?: Date
  createdBy: User
  status: "active" | "inactive" | "ended" | "closed"
}
