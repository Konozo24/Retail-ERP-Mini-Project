import API from './axios';

// Get a single note
export const getNote = async (noteId) => {
  try {
    const res = await API.get(`/api/notes/${noteId}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response?.data || error);
  }
};

// Create a note in a notebook
export const createNote = async (notebookId, noteData) => {
  try {
    const res = await API.post(`/api/notes/create/${notebookId}`, noteData);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response?.data || error);
  }
};

// Edit a note
export const editNote = async (noteId, noteData) => {
  try {
    const res = await API.put(`/api/notes/edit/${noteId}`, noteData);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response?.data || error);
  }
};

// Delete a note
export const deleteNote = async (noteId) => {
  try {
    const res = await API.delete(`/api/notes/delete/${noteId}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response?.data || error);
  }
};

// Reorder a note
export const reorderNote = async (noteId, sortOrder) => {
  try {
    const res = await API.put(`/api/notes/reorder/${noteId}`, { sortOrder });
    return res.data;
  } catch (error) {
    return Promise.reject(error.response?.data || error);
  }
};
