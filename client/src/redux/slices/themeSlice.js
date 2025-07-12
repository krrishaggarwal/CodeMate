import { createSlice } from '@reduxjs/toolkit';

const initialTheme = localStorage.getItem('theme') || 'light';
document.body.classList.toggle('dark', initialTheme === 'dark'); // sync on load

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: initialTheme },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.mode);
      document.body.classList.toggle('dark', state.mode === 'dark');
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('theme', state.mode);
      document.body.classList.toggle('dark', state.mode === 'dark');
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
