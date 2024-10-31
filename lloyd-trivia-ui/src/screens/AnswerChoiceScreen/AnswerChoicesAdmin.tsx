import AnswerChoicesPlayer from './AnswerChoicesPlayer';
import { UIQuestion } from './AnswerChoiceScreen';
import { Button, CardActions } from '@mui/material';

const AnswerChoicesAdmin = ({ question }: { question: UIQuestion }) => {
  return (
    <>
      <AnswerChoicesPlayer
        question={question}
        selectAnswer={(e) => console.log(e)}
        disabled={true}
      />
      <CardActions>
        <Button>TEST</Button>
      </CardActions>
    </>
  );
};

export default AnswerChoicesAdmin;
