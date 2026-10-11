import { useGetTasksQuery } from "@/app/store/api";
import { Task as TaskType } from "@/app/store/api";
import Header from "@/app/components/Header";
import TaskCard from "@/app/components/TaskCard";
import { useAppDispatch } from "@/app/hooks/reduxHooks";
import { openNewTaskModal } from "@/app/features/auth/globalSlice";

type Props = {
  id: string;
};

const ListView = ({ id }: Props) => {
  const dispatch = useAppDispatch();
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="List"
          buttonName="Add Task"
          event={() => dispatch(openNewTaskModal())}
          isSmallText
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tasks?.map((task: TaskType) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default ListView;
