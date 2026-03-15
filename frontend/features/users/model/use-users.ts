import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/api/api";

import { UserDto } from "../dto/user.dto";

const useUsers = () => {
  return useQuery<UserDto[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get<UserDto[]>("/users");
      return res.data;
    },
  });
};

export default useUsers;
