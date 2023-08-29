import { useQuiz } from '../context/QuizContext'

function NextButton() {
    const { numQuestions, index, answer, dispatch } = useQuiz()

    if (answer === null) return null

    if (index < numQuestions - 1)
        return (
            <button onClick={() => dispatch({ type: 'nextQuestion' })} className='btn btn-ui'>
                Next
            </button>
        )
    else
        return (
            <button onClick={() => dispatch({ type: 'finish' })} className='btn btn-ui'>
                Finish
            </button>
        )
}
export default NextButton
