import { Box, Button, Divider, List, ListItem } from '@mui/material';
import { useContext } from 'react';
import { GameContext } from '../../App';

const WaitingScreen = () => {
  const { gameState } = useContext(GameContext);

  const isAdmin = gameState?.isAdmin;
  const teamList = gameState?.teams;

  return (
    <Box>
      <h1>WAITING</h1>
      <List>
        {teamList?.map((T) => {
          return <ListItem key={T.name}>{T.name}</ListItem>;
        })}
      </List>
      {isAdmin && (
        <>
          <Divider />
          <Button onClick={() => console.log(gameState)}>Continue</Button>
        </>
      )}
    </Box>
  );
};

export default WaitingScreen;
