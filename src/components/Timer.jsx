import { useEffect } from 'react';

function Timer({ dispatch, secondsRemaining }) {
  const min = Math.floor(secondsRemaining / 60);
  const sec = secondsRemaining - min * 60;
  console.log(secondsRemaining, min, sec);
  useEffect(
    function () {
      const timer = setInterval(function () {
        dispatch({ type: 'tick' });
      }, 1000);
      return function () {
        clearInterval(timer);
      };
    },
    [dispatch]
  );
  return (
    <div className='timer'>
      {String(min).padStart(2, 0)}:{String(sec).padStart(2, 0)}
    </div>
  );
}

export default Timer;
