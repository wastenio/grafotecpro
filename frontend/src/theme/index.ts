import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: { mode: 'light' },
  components: {
    MuiButton: { defaultProps: { variant: 'contained' } },
    MuiTextField: { defaultProps: { fullWidth: true, margin: 'normal' } },
  },
});
