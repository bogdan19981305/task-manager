import { USER_SELECT_CONSTANT } from 'src/users/constants/user-select.constant';
export const TASK_INCLUDE_CONSTANT = {
  creator: {
    select: USER_SELECT_CONSTANT,
  },
  assignee: {
    select: USER_SELECT_CONSTANT,
  },
};
