function StartScreen({ numOfQuestions, dispatch }) {
  return (
    <div className='start'>
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numOfQuestions} questions to test your React mastery</h3>
      <form className='form'>
        <div className='form-group'>
          <label htmlFor='difficulty' className='form-label'>
            Difficulty
          </label>
          <select
            id='difficulty'
            className='form-select'
            onChange={(e) => dispatch({ type: 'setDifficulty', payload: e.target.value })}
          >
            <option value='easy'>Easy</option>
            <option value='normal'>Normal</option>
            <option value='hard'>Hard</option>
          </select>
        </div>
        {/* <div className='form-group'>
          <label className='form-label' htmlFor='num-questions'>
            Number of Questions
          </label>
          <input type='number' className='form-input' min='5' max={30} />
        </div> */}
      </form>
      <button className='btn btn-ui' onClick={() => dispatch({ type: 'start' })}>
        Let's start!
      </button>
    </div>
  );
}

export default StartScreen;
