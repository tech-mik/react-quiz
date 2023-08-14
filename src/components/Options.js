function Options({ question, answer, dispatch }) {
    return (
        <div className='options'>
            {question.options.map((option, i) => (
                <button
                    className={`btn btn-option ${
                        i === answer ? 'answer' : ''
                    } ${
                        answer !== null
                            ? i === question.correctOption
                                ? 'correct'
                                : 'wrong'
                            : ''
                    }`}
                    key={option}
                    onClick={() => dispatch({ type: 'newAnswer', payload: i })}
                    disabled={answer !== null}>
                    {option}
                </button>
            ))}
        </div>
    )
}
export default Options
