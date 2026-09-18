import { useState } from 'react'
import './App.css'
import { getFocusIndex } from './reader'

const previewWords = [
  'Reading',
  'becomes',
  'easier',
  'when',
  'your',
  'focus',
  'stays',
  'still.',
]

function FocusedWord({ word }: { word: string }) {
  const focusIndex = getFocusIndex(word)
  const before = word.slice(0, focusIndex)
  const focus = word.at(focusIndex) ?? ''
  const after = word.slice(focusIndex + 1)

  return (
    <div className="word-stage" aria-live="polite" aria-atomic="true">
      <span className="word-before">{before}</span>
      <span className="word-focus">{focus}</span>
      <span className="word-after">{after}</span>
    </div>
  )
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(2)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wordsPerMinute, setWordsPerMinute] = useState(300)

  const currentWord = previewWords[currentIndex]
  const progress = ((currentIndex + 1) / previewWords.length) * 100

  function showPreviousWord() {
    setIsPlaying(false)
    setCurrentIndex((index) => Math.max(0, index - 1))
  }

  function showNextWord() {
    setIsPlaying(false)
    setCurrentIndex((index) => Math.min(previewWords.length - 1, index + 1))
  }

  function restart() {
    setIsPlaying(false)
    setCurrentIndex(0)
  }

  return (
    <main className="app-shell">
      <section className="reader" aria-label="Speed reader">
        <header className="reader-header">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              S
            </span>
            <span>SpeedReader</span>
          </div>
          <button
            className="icon-button close-button"
            type="button"
            aria-label="Close reader"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="reading-area">
          <div className="focus-guide focus-guide-top" aria-hidden="true" />
          <FocusedWord word={currentWord} />
          <div className="focus-guide focus-guide-bottom" aria-hidden="true" />
        </div>

        <div className="progress-section">
          <div className="progress-meta">
            <span>{isPlaying ? 'Reading' : 'Paused'}</span>
            <span>
              {currentIndex + 1} / {previewWords.length}
            </span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Reading progress"
            aria-valuemin={1}
            aria-valuemax={previewWords.length}
            aria-valuenow={currentIndex + 1}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="controls" aria-label="Reader controls">
          <button
            className="icon-button"
            type="button"
            onClick={restart}
            aria-label="Restart"
          >
            <span aria-hidden="true">↺</span>
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={showPreviousWord}
            aria-label="Previous word"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            className="play-button"
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-label={isPlaying ? 'Pause' : 'Resume'}
          >
            <span aria-hidden="true">{isPlaying ? 'Ⅱ' : '▶'}</span>
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={showNextWord}
            aria-label="Next word"
          >
            <span aria-hidden="true">›</span>
          </button>
          <label className="speed-control">
            <span className="sr-only">Reading speed</span>
            <input
              type="number"
              min="100"
              max="1000"
              step="25"
              value={wordsPerMinute}
              onChange={(event) =>
                setWordsPerMinute(Number(event.target.value))
              }
            />
            <span>WPM</span>
          </label>
        </div>

        <footer className="shortcut-hints" aria-label="Keyboard shortcuts">
          <span>
            <kbd>Space</kbd> play / pause
          </span>
          <span>
            <kbd>←</kbd>
            <kbd>→</kbd> move
          </span>
          <span>
            <kbd>R</kbd> restart
          </span>
          <span>
            <kbd>Esc</kbd> close
          </span>
        </footer>
      </section>
    </main>
  )
}

export default App
