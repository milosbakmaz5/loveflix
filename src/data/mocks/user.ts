import type { UserProfile } from '@/domain';

import { images } from './media';

export const currentUser: UserProfile = {
  id: 'user-1',
  displayName: 'Sarah Connor',
  avatar: images.profile.avatar,
};
