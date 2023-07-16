import { useEffect, useState } from 'react';

function Timer({ dispatch, maxSecondsRemaining }) {
  const [secondsRemaining, setSecondsRemaining] = useState(maxSecondsRemaining);

  const min = Math.floor(secondsRemaining / 60);
  const sec = secondsRemaining - min * 60;
  // console.log(secondsRemaining, min, sec);
  useEffect(function () {
    const timer = setInterval(function () {
      setSecondsRemaining((cur) => cur - 1);
    }, 1000);
    return function () {
      clearInterval(timer);
    };
  }, []);
  useEffect(
    function () {
      if (secondsRemaining === 0) {
        dispatch({ type: 'finish' });
      }
    },
    [secondsRemaining, dispatch]
  );
  return (
    <div className='timer'>
      {String(min).padStart(2, 0)}:{String(sec).padStart(2, 0)}
    </div>
  );
}

export default Timer;
