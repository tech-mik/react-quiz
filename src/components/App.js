import { useEffect } from 'react'
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
import { useQuiz } from '../context/QuizContext'

function App() {
    const { questions, status, index, answer, points, highscore, secondsRemaining, dispatch } =
        useQuiz()

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
    }, [dispatch])

    return (
        <div className='app'>
            <Header />
            <Main>
                {status === 'loading' && <Loader />}
                {status === 'error' && <ErrorMsg />}
                {status === 'ready' && (
                    <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
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
                        <Question question={questions[index]} dispatch={dispatch} answer={answer} />
                        <Footer>
                            <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
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
