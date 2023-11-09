import React from "react";
import { Button, Card, CardContent, Checkbox, Typography } from "@mui/material";
import { Task } from "./contracts/todolist";
interface ItemProps {
  task: Task;
  idx: number;
  onCompleted: (idx: number) => void;
}

const TaskView: React.FC<ItemProps> = ({ task, idx, onCompleted }) => (
    <Card sx={{ minWidth: 275, m: 1 }}>
      <CardContent>
        <Typography
          variant="h6"
          onClick={() => onCompleted(idx)}
          component="div">
          <Checkbox color="success"></Checkbox>{" "}
          {Buffer.from(task.name, "hex").toString("utf8")}
        </Typography>
      </CardContent>
    </Card>
);

export default TaskView;
