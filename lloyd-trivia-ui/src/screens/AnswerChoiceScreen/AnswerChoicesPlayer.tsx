import { CardContent, Stack, Button, TextField } from '@mui/material';
import { UIQuestion } from './AnswerChoiceScreen';
import { useState } from 'react';

const AnswerChoicesPlayer = ({
  question,
  selectAnswer,
  disabled,
}: {
  question: UIQuestion;
  selectAnswer: (e: string) => void;
  disabled: boolean;
}) => {
  const [textInputValue, setTextInputValue] = useState('');

  return (
    <CardContent>
      {question.type === 'TRUE_FALSE' && (
        <Stack spacing={2}>
          <Button
            fullWidth
            variant="contained"
            disabled={disabled}
            onClick={selectAnswer ? () => selectAnswer('TRUE') : undefined}
          >
            True
          </Button>
          <Button
            fullWidth
            variant="contained"
            disabled={disabled}
            onClick={selectAnswer ? () => selectAnswer('FALSE') : undefined}
          >
            False
          </Button>
        </Stack>
      )}
      {question.type === 'FILL_IN_THE_BLANK' && (
        <Stack spacing={2}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            label="What should be in the _?"
            disabled={disabled}
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            disabled={disabled || !textInputValue}
            onClick={
              selectAnswer ? () => selectAnswer(textInputValue) : undefined
            }
          >
            Submit
          </Button>
        </Stack>
      )}
      {question.type === 'MULTIPLE_CHOICE' && (
        <Stack spacing={2}>
          {question.options?.map((O, I) => {
            return (
              <Button
                key={I}
                variant="contained"
                fullWidth
                disabled={disabled}
                onClick={selectAnswer ? () => selectAnswer(O) : undefined}
              >
                {O}
              </Button>
            );
          })}
        </Stack>
      )}
    </CardContent>
  );
};

export default AnswerChoicesPlayer;
