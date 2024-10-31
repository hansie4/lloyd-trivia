import {
  Container,
  Paper,
  Box,
  Stack,
  TextField,
  ButtonGroup,
  Button,
} from '@mui/material';

const CreateAndJoinScreen = () => {
  return (
    <Container>
      <Paper square={false} variant="outlined" elevation={24}>
        <Box padding={2}>
          <Stack spacing={2}>
            <TextField
              variant="outlined"
              label="Game ID"
              size="small"
              fullWidth
            />
            <ButtonGroup variant="contained" fullWidth>
              <Button>Join</Button>
              <Button color="secondary">Create</Button>
            </ButtonGroup>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateAndJoinScreen;
