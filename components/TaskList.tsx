import { gql, useMutation, useQuery } from "@apollo/client";
import { Checkbox, Flex, List, ListItem } from "@chakra-ui/react";
import { TaskDeleteButton } from "./TaskDeleteButton";

export const AllTasksQuery = gql`
  query {
    tasks {
      id
      title
      done
    }
  }
`;

const UpdateTaskMutation = gql`
  mutation UpdateTask($id: Int!, $title: String!, $done: Boolean!) {
    updateTask(id: $id, title: $title, done: $done) {
      id
    }
  }
`;

type Task = {
  id: number;
  title: string;
  done: boolean;
};

const TaskList: React.FC = () => {
  const { data, loading, error } = useQuery(AllTasksQuery);
  const [updateTask, mutation] = useMutation(UpdateTaskMutation, {
    refetchQueries: [AllTasksQuery],
  });

  const handleCheckBoxClick = (task: Task) => {
    updateTask({
      variables: {
        id: task.id,
        title: task.title,
        done: !task.done,
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (mutation.error) return <p>Error: {mutation.error.message}</p>;

  const tasks = [...data.tasks].sort((a: Task, b: Task) => b.id - a.id);

  return (
    <List>
      {tasks.map((task: { id: number; title: string; done: boolean }) => (
        <ListItem key={task.id}>
          <Flex justify="space-between">
            <Checkbox
              colorScheme="teal"
              isChecked={task.done}
              onChange={() => {
                handleCheckBoxClick(task);
              }}
            >
              {task.title}
            </Checkbox>
            <TaskDeleteButton taskId={task.id} />
          </Flex>
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;
