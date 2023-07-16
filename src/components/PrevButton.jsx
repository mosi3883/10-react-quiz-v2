function PrevButton({ index, dispatch }) {
  return (
    <button
      disabled={index === 0}
      className='btn btn-ui pag-btn'
      onClick={() => dispatch({ type: 'prevQuestion' })}
    >
      Previous
    </button>
  );
}

export default PrevButton;
