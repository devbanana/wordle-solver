import { Injectable } from '@nestjs/common';
import { States } from './states';

@Injectable()
export class WordleEvaluatorService {
  evaluate(guess: string, answer: string): States[] {
    if (guess.length !== answer.length) {
      throw new Error('The guess must be the same length as the answer');
    }

    const state = Array<States>(answer.length).fill(States.Absent);
    const processedCorrect = Array<boolean>(answer.length).fill(false);
    const processedPresent = Array<boolean>(answer.length).fill(false);

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i] && !processedCorrect[i]) {
        state[i] = States.Correct;
        processedCorrect[i] = true;
        processedPresent[i] = true;
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (processedCorrect[i]) {
        continue;
      }

      for (let j = 0; j < answer.length; j++) {
        if (!processedPresent[j] && guess[i] === answer[j]) {
          state[i] = States.Present;
          processedPresent[j] = true;
          break;
        }
      }
    }

    return state;
  }
}
