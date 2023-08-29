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
    const { status } = useQuiz()

    return (
        <div className='app'>
            <Header />
            <Main>
                {status === 'loading' && <Loader />}
                {status === 'error' && <ErrorMsg />}
                {status === 'ready' && <StartScreen />}
                {status === 'active' && (
                    <>
                        <Progress />
                        <Question />
                        <Footer>
                            <Timer />
                            <NextButton />
                        </Footer>
                    </>
                )}
                {status === 'finished' && <FinishScreen />}
            </Main>
        </div>
    )
}

export default App
