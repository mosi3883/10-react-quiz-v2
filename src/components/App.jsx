import { useEffect, useReducer } from 'react';
// import { useFetch } from '../hooks/useFetch';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishedScreen from './FinishedScreen';
import Footer from './Footer';
import Timer from './Timer';
import PrevButton from './PrevButton';
const url = `http://localhost:8000/questions`;
const SECS_PER_QUESTION = 10;
const initialState = {
  allQuestions: [],
  questions: [],
  // 'loading', 'error', 'ready', 'active' , 'finished'
  status: 'loading',
  index: 0,

  answers: [],
  points: 0,
  highScore: 0,
  maxSecondsRemaining: null,
  difficulty: 'normal',
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived': {
      return {
        ...state,
        status: 'ready',
        allQuestions: action.payload,
      };
    }
    case 'dataFailed': {
      return { ...state, status: 'error' };
    }
    case 'setDifficulty': {
      return { ...state, difficulty: action.payload };
    }
    case 'start': {
      const questions = state.allQuestions.filter((question) => {
        if (state.difficulty === 'normal') {
          return question.points < 30;
        }
        if (state.difficulty === 'hard') return question.points === 30;
        else {
          // easy
          return question.points === 10;
        }
      });
      return {
        ...state,
        status: 'active',
        maxSecondsRemaining: Math.round(SECS_PER_QUESTION * questions.length),
        questions,
      };
    }
    case 'newAnswer': {
      const activeQuestion = state.questions.at(state.index);
      const newAnswers = state.answers.slice();
      newAnswers[state.index] = action.payload;

      return {
        ...state,

        answers: newAnswers,
        points:
          action.payload === activeQuestion.correctOption
            ? state.points + activeQuestion.points
            : state.points,
      };
    }
    case 'nextQuestion': {
      return { ...state, index: state.index + 1 };
    }
    case 'prevQuestion': {
      return { ...state, index: state.index - 1 };
    }
    case 'finish': {
      return {
        ...state,
        status: 'finished',
        answers: [],
        highScore: state.highScore < state.points ? state.points : state.highScore,
      };
    }
    case 'restart': {
      return {
        ...initialState,
        highScore: state.highScore,
        status: 'ready',
        allQuestions: state.allQuestions,
      };
    }

    default: {
      console.error(`error ${action.type} is not type`);
    }
  }
}
export default function App() {
  const [
    {
      questions,
      status,
      index,
      points,
      highScore,
      maxSecondsRemaining,
      allQuestions,
      answers,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const answer = answers.at(index);

  const numOfQuestions = questions.length;
  const totalPoints = questions.reduce((acc, cur) => acc + cur.points, 0);
  useEffect(function () {
    fetch(url)
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numOfQuestions={allQuestions.length} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numOfQuestions={numOfQuestions}
              points={points}
              totalPoints={totalPoints}
              answer={answer}
            />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <Footer>
              <PrevButton dispatch={dispatch} numOfQuestions={numOfQuestions} index={index} />
              <Timer dispatch={dispatch} maxSecondsRemaining={maxSecondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numOfQuestions={numOfQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishedScreen
            points={points}
            totalPoints={totalPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
