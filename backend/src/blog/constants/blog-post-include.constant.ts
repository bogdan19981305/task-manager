import { USER_SELECT_CONSTANT } from 'src/users/constants/user-select.constant';

export const BLOG_POST_AUTHOR_INCLUDE = {
  author: {
    select: USER_SELECT_CONSTANT,
  },
} as const;
