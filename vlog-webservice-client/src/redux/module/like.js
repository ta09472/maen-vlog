import axios from "axios";
// actiontype
const REQUEST_LIKE = "REQUEST_LIKE";
const REQUEST_LIKE_CANCEL = "REQUEST_LIKE_CANCEL";
const FETCH_LIKE = "FETCH_LIKE";
//action

export const requestLike = (postsId, userId) => (dispatch) => {
  let data = {
    postsId: postsId,
    userId: userId,
  };
  const response = axios.post("/api/v1/post-like", data);

  dispatch({ type: REQUEST_LIKE });
};

export const requestLikeCancel = (postsId, userId, accessToken) => (
  dispatch
) => {
  axios.delete(`http://localhost:8080/api/v1/post-like/${postsId}/${userId}`);
  dispatch({ type: REQUEST_LIKE_CANCEL });
};
// initialState
export const fetchLike = (userId, postsId) => async (dispatch) => {
  const response = await axios.get(`/api/v1/user/${userId}/like`);
  const isLiked = await response.data.userLikePostIds.includes(postsId);
  dispatch({
    type: FETCH_LIKE,
    payload: response.data.postLikeList,
    isLiked: isLiked,
  });
};
const initialState = {
  isLiked: false,
  userLikePostIds: [],
  commentLikeList: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_LIKE:
      return {
        ...state,
        isLiked: true,
      };
    case REQUEST_LIKE_CANCEL:
      return {
        ...state,
        isLiked: false,
      };
    case FETCH_LIKE:
      return {
        ...state,
        postLikeList: action.paylaod,
        isLiked: action.isLiked,
      };
    default:
      return state;
  }
}
