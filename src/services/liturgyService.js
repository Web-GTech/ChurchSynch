import React from 'react';

const LITURGY_STORAGE_KEY = 'churchFacilitiesLiturgy';
const SELECTED_SONG_STORAGE_KEY = 'churchFacilitiesSelectedSong';

export const getLiturgyFromStorage = () => {
  const storedLiturgy = localStorage.getItem(LITURGY_STORAGE_KEY);
  return storedLiturgy ? JSON.parse(storedLiturgy) : [];
};

export const saveLiturgyToStorage = (liturgy) => {
  localStorage.setItem(LITURGY_STORAGE_KEY, JSON.stringify(liturgy));
};

export const getSelectedSongFromStorage = () => {
  const storedSong = localStorage.getItem(SELECTED_SONG_STORAGE_KEY);
  return storedSong ? JSON.parse(storedSong) : null;
};

export const saveSelectedSongToStorage = (song) => {
  if (song) {
    localStorage.setItem(SELECTED_SONG_STORAGE_KEY, JSON.stringify(song));
  } else {
    localStorage.removeItem(SELECTED_SONG_STORAGE_KEY);
  }
};