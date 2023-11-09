import React from "react";
import { Box } from "@mui/material";
import TaskView from "./TaskView";
import { Task } from "./contracts/todolist";

interface ItemListProps {
  tasks: Task[];
  onCompleted: (idx: number) => void;
}

const ItemList: React.FC<ItemListProps> = ({ tasks, onCompleted }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap",  m : 6.8 }}>
    {tasks.map(
      (task, idx) =>
        !task.isCompleted && (
          <TaskView key={idx} task={task} idx={idx} onCompleted={onCompleted} />
        )
    )}
  </Box>
);

export default ItemList;
