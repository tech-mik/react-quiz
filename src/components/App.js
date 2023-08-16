import { useEffect, useReducer } from 'react'
import ErrorMsg from './ErrorMsg'
import FinishScreen from './FinishScreen'
import Footer from './Footer'
import Header from './Header'
import Loader from './Loader'
import Main from './Main'
import NextButton from './NextButton'
import Progress from './Progress'
import Question from './Question'
import StartScreen from './StartScreen'
import Timer from './Timer'

const SEC_PER_QUESTION = 5

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
            console.log(question)
            console.log(action.payload)

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
                highscore:
                    state.points > state.highscore
                        ? state.points
                        : state.highscore,
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
                status:
                    state.secondsRemaining - 1 <= 0 ? 'finished' : state.status,
            }
        default:
            throw new Error(`Invalid action "${action.type}"`)
    }
}

function App() {
    const [
        {
            questions,
            status,
            index,
            answer,
            points,
            highscore,
            secondsRemaining,
        },
        dispatch,
    ] = useReducer(reducer, initialState)
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
            .catch((err) => dispatch({ type: 'dataFailed' }))
    }, [])

    return (
        <div className='app'>
            <Header />
            <Main>
                {status === 'loading' && <Loader />}
                {status === 'error' && <ErrorMsg />}
                {status === 'ready' && (
                    <StartScreen
                        numQuestions={numQuestions}
                        dispatch={dispatch}
                    />
                )}
                {status === 'active' && (
                    <>
                        <Progress
                            index={index}
                            numQuestions={numQuestions}
                            points={points}
                            totalPoints={totalPoints}
                            answer={answer}
                        />
                        <Question
                            question={questions[index]}
                            dispatch={dispatch}
                            answer={answer}
                        />
                        <Footer>
                            <Timer
                                secondsRemaining={secondsRemaining}
                                dispatch={dispatch}
                            />
                            <NextButton
                                dispatch={dispatch}
                                answer={answer}
                                index={index}
                                numQuestions={numQuestions}
                            />
                        </Footer>
                    </>
                )}
                {status === 'finished' && (
                    <FinishScreen
                        points={points}
                        totalPoints={totalPoints}
                        highscore={highscore}
                        dispatch={dispatch}
                    />
                )}
            </Main>
        </div>
    )
}

export default App
