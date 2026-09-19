import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { getFocusIndex, getWordDelayMs, tokenizeText } from './reader'

const previewText =
  'Reading becomes easier when your focus stays still. Short pauses follow commas, and longer pauses follow sentences.'

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wordsPerMinute, setWordsPerMinute] = useState(300)
  const timeoutRef = useRef<number | null>(null)

  const words = useMemo(() => tokenizeText(previewText), [])

  const currentWord = words[currentIndex] ?? ''
  const progress = words.length ? ((currentIndex + 1) / words.length) * 100 : 0

  function showPreviousWord() {
    setIsPlaying(false)
    setCurrentIndex((index) => Math.max(0, index - 1))
  }

  function showNextWord() {
    setIsPlaying(false)
    setCurrentIndex((index) => Math.min(words.length - 1, index + 1))
  }

  function restart() {
    setIsPlaying(false)
    setCurrentIndex(0)
  }

  function togglePlayback() {
    if (words.length === 0) {
      return
    }

    if (currentIndex >= words.length - 1) {
      setCurrentIndex(0)
      setIsPlaying(true)
      return
    }

    setIsPlaying((playing) => !playing)
  }

  async function startWindowDrag(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return
    }

    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().startDragging()
    } catch {
      // no-op outside Tauri
    }
  }

  useEffect(() => {
    if (!isPlaying) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    if (!words.length || currentIndex >= words.length - 1) {
      return
    }

    const delay = getWordDelayMs(currentWord, wordsPerMinute)
    timeoutRef.current = window.setTimeout(() => {
      setCurrentIndex((index) => {
        const nextIndex = Math.min(words.length - 1, index + 1)

        if (nextIndex >= words.length - 1) {
          setIsPlaying(false)
        }

        return nextIndex
      })
    }, delay)

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [currentIndex, currentWord, isPlaying, words.length, wordsPerMinute])

  return (
    <main className="app-shell">
      <section className="reader" aria-label="Speed reader">
        <div className="reading-area" onMouseDown={startWindowDrag}>
          <div className="focus-guide focus-guide-top" aria-hidden="true" />
          <FocusedWord word={currentWord} />
          <div className="focus-guide focus-guide-bottom" aria-hidden="true" />
        </div>

        <div className="progress-section">
          <div className="progress-meta">
            <span>{isPlaying ? 'Reading' : 'Paused'}</span>
            <span>
              {words.length ? currentIndex + 1 : 0} / {words.length}
            </span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Reading progress"
            aria-valuemin={1}
            aria-valuemax={words.length}
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
            onClick={togglePlayback}
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
