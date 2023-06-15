import { AudioInterface } from 'interfaces/audio';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface RatingInterface {
  id?: string;
  rating: number;
  audio_id: string;
  user_id: string;
  created_at?: any;
  updated_at?: any;

  audio?: AudioInterface;
  user?: UserInterface;
  _count?: {};
}

export interface RatingGetQueryInterface extends GetQueryInterface {
  id?: string;
  audio_id?: string;
  user_id?: string;
}
