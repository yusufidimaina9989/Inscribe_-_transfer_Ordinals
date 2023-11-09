import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import ListIcon from "@mui/icons-material/List";

interface NewTaskProps {
  onAdd: (task: { name: string }) => void;
}

const NewTask: React.FC<NewTaskProps> = ({ onAdd }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAdd({ name });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ m: 8 }}>
      <TextField
        id="name"
        label="Enter Task"
        variant="standard"
        color="success"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={<ListIcon />}
        color="success"
        sx={{ mt: 2 }}>
        Add New Task
      </Button>
    </Box>
  );
};

export default NewTask;
