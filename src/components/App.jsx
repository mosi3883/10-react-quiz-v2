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
const url = `http://localhost:8000/questions`;
const SECS_PER_QUESTION = 20;
const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active' , 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived': {
      return {
        ...state,
        status: 'ready',
        questions: action.payload,
        secondsRemaining: SECS_PER_QUESTION * action.payload.length,
      };
    }
    case 'dataFailed': {
      return { ...state, status: 'error' };
    }
    case 'start': {
      return { ...state, status: 'active' };
    }
    case 'newAnswer': {
      const activeQuestion = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === activeQuestion.correctOption
            ? state.points + activeQuestion.points
            : state.points,
      };
    }
    case 'nextQuestion': {
      return { ...state, answer: null, index: state.index + 1 };
    }
    case 'finish': {
      return {
        ...state,
        status: 'finished',
        answer: null,
        highScore: state.highScore < state.points ? state.points : state.highScore,
      };
    }
    case 'restart': {
      return {
        ...initialState,
        highScore: state.highScore,
        status: 'active',
        questions: state.questions,
      };
    }

    case 'tick': {
      const newSecondsRemaining = state.secondsRemaining - 1;
      if (newSecondsRemaining === 0) {
        // end
        return {
          ...state,
          status: 'finished',
          answer: null,
          highScore: state.highScore < state.points ? state.points : state.highScore,
        };
      }
      return { ...state, secondsRemaining: newSecondsRemaining };
    }
    default: {
      console.log(`error ${action.type} is not type`);
    }
  }
}
export default function App() {
  const [{ questions, status, index, answer, points, highScore, secondsRemaining }, dispatch] =
    useReducer(reducer, initialState);

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
          <StartScreen numOfQuestions={numOfQuestions} dispatch={dispatch} />
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
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
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
