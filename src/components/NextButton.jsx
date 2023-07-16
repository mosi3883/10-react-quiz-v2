function NextButton({ dispatch, answer, index, numOfQuestions }) {
  // if (answer === null) return <>&nbsp;</>;
  if (index < numOfQuestions - 1) {
    return (
      <button
        disabled={answer === undefined}
        className='btn btn-ui pag-btn'
        onClick={() => dispatch({ type: 'nextQuestion' })}
      >
        Next
      </button>
    );
  }
  return (
    <button className='btn btn-ui ' onClick={() => dispatch({ type: 'finish' })}>
      Finish
    </button>
  );
}

export default NextButton;
