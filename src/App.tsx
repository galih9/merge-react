import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import "./App.css"
import GamePage from "./pages"
// import { LogView } from "./pages/logger"
import AUDIO from "./assets/audio/bg.m4a"
import { useEffect, useRef } from "react"

const App = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null) // Explicitly typing the ref
  useEffect(() => {
    const handleInteraction = () => {
      const audio = audioRef.current
      if (audio) {
        audio.play().catch(error => {
          console.error("Audio playback failed:", error)
        })
      }
      // Remove the event listener after interaction
      document.removeEventListener("click", handleInteraction)
    }

    // Listen for the first user interaction
    document.addEventListener("click", handleInteraction)

    return () => {
      document.removeEventListener("click", handleInteraction)
    }
  }, [])

  return (
    <div className="App">
      <audio ref={audioRef} src={AUDIO} loop />
      <DndProvider backend={HTML5Backend}>
        <GamePage />
        <div>Powered by Motion Framer, RTK Query, React, Made by kiki</div>
        {/* <LogView /> */}
      </DndProvider>
    </div>
  )
}

export default App
