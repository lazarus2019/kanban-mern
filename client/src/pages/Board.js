import {
  Box,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useDispatch, useSelector } from "react-redux";

import EmojiPicker from "../components/common/EmojiPicker";
import Kanban from "../components/common/Kanban";
import boardApi from "../api/boardApi";
import { setBoards } from "../redux/features/boardSlice";
import { setFavoritesList } from "../redux/features/favoriteSlice";

let timer;
const timeout = 500;

function Board() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [icon, setIcon] = useState("");

  const boards = useSelector((state) => state.board.value);
  const favoriteList = useSelector((state) => state.favorites.value);

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId);
        setTitle(res.title);
        setDescription(res.description);
        setSections(res.sections);
        setIsFavorite(res.favorite);
        setIcon(res.icon);

        // console.log(res);
      } catch (err) {
        alert(err);
      }
    };
    getBoard();
  }, [boardId]);

  const iconChangeHandler = async (newIcon) => {
    let temp = [...boards];
    const index = temp.findIndex((e) => e.id === boardId);
    temp[index] = { ...temp[index], icon: newIcon };
    setIcon(newIcon);

    if (isFavorite) {
      let tempFavorite = [...favoriteList];
      const favoriteIndex = tempFavorite.findIndex((e) => e.id === boardId);
      tempFavorite[favoriteIndex] = {
        ...tempFavorite[favoriteIndex],
        icon: newIcon,
      };
      dispatch(setFavoritesList(tempFavorite));
    }

    dispatch(setBoards(temp));
    try {
      await boardApi.update(boardId, { icon: newIcon });
    } catch (err) {
      alert(err);
    }
  };

  const addFavorite = async () => {
    try {
      const board = await boardApi.update(boardId, { favorite: !isFavorite });
      let newFavoriteList = [...favoriteList];
      if (isFavorite) {
        newFavoriteList = newFavoriteList.filter((e) => e.id !== boardId);
      } else {
        newFavoriteList.unshift(board);
      }
      dispatch(setFavoritesList(newFavoriteList));
      setIsFavorite(!isFavorite);
    } catch (err) {
      alert(err);
    }
  };

  const updateTitleHandler = async (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    setTitle(newTitle);

    let temp = [...boards];
    const index = temp.findIndex((e) => e.id === boardId);
    temp[index] = { ...temp[index], title: newTitle };

    if (isFavorite) {
      let tempFavorite = [...favoriteList];
      const favoriteIndex = tempFavorite.findIndex((e) => e.id === boardId);
      tempFavorite[favoriteIndex] = {
        ...tempFavorite[favoriteIndex],
        title: newTitle,
      };
      dispatch(setFavoritesList(tempFavorite));
    }

    dispatch(setBoards(temp));

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const updateDescriptionHandler = async (e) => {
    clearTimeout(timer);
    const newDescription = e.target.value;
    setDescription(newDescription);
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const deleteBoardHandler = async () => {
    try {
      await boardApi.delete(boardId);
      if (isFavorite) {
        const newFavoriteList = favoriteList.filter((e) => e.id !== boardId);
        dispatch(setFavoritesList(newFavoriteList));
      }

      const newList = boards.filter((e) => e.id !== boardId);
      if (newList.length === 0) {
        navigate("/boards");
      } else {
        navigate(`/boards/${newList[0].id}`);
      }
      dispatch(setBoards(newList));
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <IconButton variant="outlined" onClick={addFavorite}>
          {isFavorite ? (
            <StarOutlinedIcon color="warning" />
          ) : (
            <StarBorderOutlinedIcon />
          )}
        </IconButton>
        <IconButton
          variant="outlined"
          color="error"
          onClick={deleteBoardHandler}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: "10px 50px" }}>
        <Box>
          {/* emoji picker */}
          <EmojiPicker icon={icon} onChange={iconChangeHandler} />

          <TextField
            value={title}
            onChange={updateTitleHandler}
            placeholder="Untitled"
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-input": { padding: 0 },
              "& .MuiOutlinedInput-notchedOutline": { border: "unset" },
              "& .MuiOutlinedInput-root": {
                fontSize: "2rem",
                fontWeight: "700",
              },
            }}
          />
          <TextField
            value={description}
            onChange={updateDescriptionHandler}
            placeholder="Add a description"
            variant="outlined"
            multiline
            fullWidth
            sx={{
              maxHeight: '150px',
              overflowY: 'auto',
              "& .MuiOutlinedInput-input": { padding: 0 },
              "& .MuiOutlinedInput-notchedOutline": { border: "unset" },
              "& .MuiOutlinedInput-root": { fontSize: "0.8rem" },
            }}
          />
        </Box>

        <Box>
          {/* Kanban board */}
          <Kanban data={sections} boardId={boardId} />
        </Box>
      </Box>
    </>
  );
}

export default Board;
