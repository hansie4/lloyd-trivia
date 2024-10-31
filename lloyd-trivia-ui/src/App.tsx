import { Box } from '@mui/material';
import './App.css';
import AnswerChoiceScreen from './screens/AnswerChoiceScreen/AnswerChoiceScreen';

function App() {
  return (
    <Box
      width={'100vw'}
      height={'100vh'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <AnswerChoiceScreen
        isAdmin={false}
        question={{
          value: 600,
          type: 'TRUE_FALSE',
          question: 'Is Beryl Jin Kinsey cute?',
          photoPath: '/testImage1.jpg',
          dailyDouble: false,
        }}
      />
      <AnswerChoiceScreen
        isAdmin={false}
        question={{
          value: 800,
          type: 'FILL_IN_THE_BLANK',
          question: 'The _ in the ocean.',
          photoPath: '/testImage1.jpg',
          dailyDouble: true,
        }}
      />
      <AnswerChoiceScreen
        isAdmin={true}
        question={{
          value: 200,
          type: 'MULTIPLE_CHOICE',
          question: 'What is the name of our cat?',
          options: ['Nelson', 'Simba', 'Theo', 'Mittens'],
          photoPath: '/testImage1.jpg',
          dailyDouble: false,
        }}
      />
    </Box>
  );
}

export default App;
