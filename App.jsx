const languages = [
    { name: "HTML", backgroundColor: "#E2680F", color: "#F9F4DA" },
    { name: "CSS", backgroundColor: "#328AF1", color: "#F9F4DA" },
    { name: "JavaScript", backgroundColor: "#F4EB13", color: "#1E1E1E" },
    { name: "React", backgroundColor: "#2ED3E9", color: "#1E1E1E" },
    { name: "TypeScript", backgroundColor: "#298EC6", color: "#F9F4DA" },
    { name: "Node.js", backgroundColor: "#599137", color: "#F9F4DA" },
    { name: "Python", backgroundColor: "#FFD742", color: "#1E1E1E" },
    { name: "Ruby", backgroundColor: "#D02B2B", color: "#F9F4DA" },
    { name: "Assembly", backgroundColor: "#2D519F", color: "#F9F4DA" }
]

const words = [
    "react", "frontend", "developer", "javascript", "program", 
    "coding", "component", "state", "effect", "element", 
    "syntax", "browser", "styles", "variable", "function"
]

function App() {
    const [currentWord, setCurrentWord] = React.useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = React.useState([])

    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * words.length)
        return words[randomIndex]
    }

    const wrongGuessCount = guessedLetters.filter(
        letter => !currentWord.includes(letter)
    ).length

    const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length - 1
    const isGameOver = isGameWon || isGameLost

    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    function addGuessedLetter(letter) {
        setGuessedLetters(oldLetters =>
            oldLetters.includes(letter) ? oldLetters : [...oldLetters, letter]
        )
    }

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
    }

    React.useEffect(() => {
        if (isGameWon) {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            })
        }
    }, [isGameWon])

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        return (
            <span
                key={lang.name}
                style={styles}
                className={`chip ${isLanguageLost ? "lost" : ""}`}
            >
                {lang.name}
            </span>
        )
    })

    const letterElements = currentWord.split("").map((letter, index) => {
        const revealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClass = isGameLost && !guessedLetters.includes(letter) ? "missed-letter" : ""
        return (
            <span key={index} className={`letter-box ${letterClass}`}>
                {revealLetter ? letter.toUpperCase() : ""}
            </span>
        )
    })

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        
        let className = "key-btn"
        if (isCorrect) className += " correct"
        if (isWrong) className += " wrong"

        return (
            <button
                key={letter}
                disabled={isGameOver}
                onClick={() => addGuessedLetter(letter)}
                className={className}
            >
                {letter.toUpperCase()}
            </button>
        )
    })

    function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {
            return (
                <p className="farewell-message">
                    {getFarewellText(languages[wrongGuessCount - 1].name)}
                </p>
            )
        }

        if (isGameWon) {
            return (
                <div className="status-box won">
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </div>
            )
        }

        if (isGameLost) {
            return (
                <div className="status-box lost">
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </div>
            )
        }

        return null
    }

    function getFarewellText(languageName) {
        const options = [
            `Farewell, ${languageName}`,
            `RIP, ${languageName}`,
            `We hardly knew ${languageName}`,
            `${languageName} has left the chat`,
            `Goodbye, sweet ${languageName}`
        ]
        const randomIndex = Math.floor(Math.random() * options.length)
        return options[randomIndex]
    }

    return (
        <main>
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the programming world safe from Assembly!</p>
            </header>

            <section className="status-section">
                {renderGameStatus()}
            </section>

            <section className="languages-container">
                {languageElements}
            </section>

            <section className="word-container">
                {letterElements}
            </section>

            <section className="keyboard-container">
                {keyboardElements}
            </section>

            {isGameOver && (
                <button className="new-game-btn" onClick={startNewGame}>
                    New Game
                </button>
            )}
        </main>
    )
}