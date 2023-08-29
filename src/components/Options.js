import { useQuiz } from '../context/QuizContext'

function Options() {
    const { answer, dispatch, questions, index } = useQuiz()

    return (
        <div className='options'>
            {questions[index].options.map((option, i) => (
                <button
                    className={`btn btn-option ${i === answer ? 'answer' : ''} ${
                        answer !== null
                            ? i === questions[index].correctOption
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
