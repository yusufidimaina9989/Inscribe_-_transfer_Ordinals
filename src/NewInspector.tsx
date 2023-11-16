import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface NewTaskProps {
  onAdd: (inspector: { name: string, pubkey : string, address : string }) => void;
}

const NewInspector: React.FC<NewTaskProps> = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [pubkey, setpubkey] = useState("");
  const [address, setaddress] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAdd({ name, pubkey, address });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ m: 8 }}>
      <TextField
        id="name"
        label="Enter Name"
        variant="standard"
        color="success"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        id="pubkey"
        label="PubKey"
        variant="standard"
        color="success"
        value={pubkey}
        onChange={(e) => setpubkey(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        id="address"
        label="Enter Address"
        variant="standard"
        color="success"
        value={address}
        onChange={(e) => setaddress(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={<PersonAddIcon />}
        color="success"
        sx={{ mt: 2 }}>
        Add New Land Inspector
      </Button>
    </Box>
  );
};

export default NewInspector;
