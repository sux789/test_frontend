// src/api.js
import axios from 'axios';
axios.defaults.baseURL = 'http://test.kono.top';
export const listPost = async (params ) => {
  console.log(params );
  const response = await axios.get('/v1/posts/', {params});
  return response.data;
};

export const getCategoryOptions = async () => {
  const response = await axios.get('/v1/misc/getCategoryOptions');
  return response.data;
};

export const getMediumOptions = async () => {
  const response = await axios.get('/v1/misc/getMediumOptions');
  return response.data;
};

export const getSystemOptions = async () => {
  const response = await axios.get('/v1/misc/getAttrOptions');
  return response.data;
};

export const commentPost = async (post_id, comment) => {
  const response = await axios.post(`/v1/post/comment`, { post_id,comment });
  return response.data;
};

export const likePost = async (post_id) => {
  const response = await axios.post(`/v1/post/like`, { post_id });
  return response.data;
};

export const getPostOptions = async () => {
  const response = await axios.get('/api/images');
  return response.data;
};
