import axios from "axios";
import {
  REQUEST_LIST_REQUEST,
  REQUEST_LIST_SUCCESS,
  REQUEST_LIST_FAIL,
  REQUEST_DETAILS_REQUEST,
  REQUEST_DETAILS_SUCCESS,
  REQUEST_DETAILS_FAIL,
  REQUEST_MAKE_REQUEST,
  REQUEST_MAKE_SUCCESS,
  REQUEST_MAKE_FAIL,
} from "../constants/requestConstants";

export const listRequests = (accessToken) => async (dispatch) => {
  try {
    dispatch({ type: REQUEST_LIST_REQUEST });
    const { data } = await axios.get(`/search/requests/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    dispatch({
      type: REQUEST_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REQUEST_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listRequestDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: REQUEST_DETAILS_REQUEST });
    const { data } = await axios.get(`/search/request/${id}`);

    dispatch({
      type: REQUEST_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REQUEST_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const make =
  (accessToken, name, text, skills) => async (dispatch) => {
    try {
      dispatch({ type: REQUEST_MAKE_REQUEST });

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const { data } = await axios.post(
        `/profile/create/request/`,
        {
          name: name,
          text: text
        },
        config
      );

      dispatch({
        type: REQUEST_MAKE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: REQUEST_MAKE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
