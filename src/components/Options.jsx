function Options({ question, dispatch, answer }) {
  const hasAnswer = answer !== undefined;
  return (
    <div className='options'>
      {question.options.map((option, i) => (
        <button
          key={option}
          className={`btn btn-option ${i === answer ? 'answer' : ''} ${
            hasAnswer ? (i === question.correctOption ? 'correct' : 'wrong') : ''
          }`}
          onClick={() => dispatch({ type: 'newAnswer', payload: i })}
          disabled={hasAnswer}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
