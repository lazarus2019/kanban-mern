import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBoards } from "../redux/features/boardSlice";
import boardApi from "../api/boardApi";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const createBoardHandler = async () => {
    setLoading(true);
    try {
      const res = await boardApi.create();
      dispatch(setBoards([res]));
      navigate(`/boards/${res.id}`);
    } catch (err) {
      alert(err);
      setLoading(false);
    }
  };
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingButton
        variant="outlined"
        color="success"
        onClick={createBoardHandler}
        loading={loading}
      >
        Click here to create your first board
      </LoadingButton>
    </Box>
  );
}

export default Home;
