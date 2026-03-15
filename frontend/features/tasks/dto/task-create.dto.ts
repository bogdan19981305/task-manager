export interface TaskCreateDto {
  title: string;
  content: string | null;
  assigneeId: number | null;
}
