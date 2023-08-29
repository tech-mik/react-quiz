import { createContext, useContext, useEffect, useReducer } from 'react'

const QuizContext = createContext()

const SEC_PER_QUESTION = 20

const initialState = {
    questions: [],

    // 'Loading', 'error', 'ready', 'active', 'finished'
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondsRemaining: null,
}
function reducer(state, action) {
    switch (action.type) {
        case 'dataReceived':
            return {
                ...state,
                questions: action.payload,
                status: 'ready',
            }
        case 'dataFailed':
            return {
                ...state,
                status: 'error',
            }
        case 'start':
            return {
                ...state,
                status: 'active',
                secondsRemaining: state.questions.length * SEC_PER_QUESTION,
            }
        case 'newAnswer':
            const question = state.questions[state.index]

            return {
                ...state,
                answer: action.payload,
                points:
                    question.correctOption === action.payload
                        ? state.points + question.points
                        : state.points,
            }
        case 'nextQuestion':
            return {
                ...state,
                index: state.index + 1,
                answer: null,
            }
        case 'finish':
            return {
                ...state,
                status: 'finished',
                highscore: state.points > state.highscore ? state.points : state.highscore,
            }
        case 'restart':
            return {
                ...initialState,
                status: 'ready',
                questions: state.questions,
                highscore: state.highscore,
            }
        case 'tick':
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status: state.secondsRemaining - 1 <= 0 ? 'finished' : state.status,
            }
        default:
            throw new Error(`Invalid action "${action.type}"`)
    }
}

function QuizProvider({ children }) {
    const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] =
        useReducer(reducer, initialState)

    const numQuestions = questions.length
    const totalPoints = questions.reduce((prev, { points }) => prev + points, 0)

    useEffect(() => {
        fetch('http://localhost:8000/questions')
            .then((res) => res.json())
            .then((data) =>
                dispatch({
                    type: 'dataReceived',
                    payload: data,
                }),
            )
            .catch(() => dispatch({ type: 'dataFailed' }))
    }, [dispatch])

    return (
        <QuizContext.Provider
            value={{
                questions,
                status,
                index,
                answer,
                points,
                highscore,
                secondsRemaining,
                dispatch,
                numQuestions,
                totalPoints,
            }}>
            {children}
        </QuizContext.Provider>
    )
}

function useQuiz() {
    const context = useContext(QuizContext)

    if (!context) throw new Error('QuizContext used outside of QuizProvider')
    return context
}

export { QuizProvider, useQuiz }
