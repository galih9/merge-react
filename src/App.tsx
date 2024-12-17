import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import "./App.css"
import GamePage from "./pages"
// import { LogView } from "./pages/logger"
import AUDIO from "./assets/audio/bg.m4a"
import { useEffect, useMemo, useRef, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import {
  ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine"

const App = () => {
  const [init, setInit] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null) // Explicitly typing the ref
  useEffect(() => {
    initParticlesEngine(async engine => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine)
      //await loadBasic(engine);
    }).then(() => {
      setInit(true)
    })

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
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: -1,
      },
      background: {
        color: {
          value: "#0d47a1",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.out,
          },
          random: false,
          speed: 6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [],
  )

  if (init) {
    return (
      <>
        <Particles
          id="tsparticles"
          options={options}
        />
        <div className="App">
          <audio ref={audioRef} src={AUDIO} loop />
          <DndProvider backend={HTML5Backend}>
            <GamePage />
            <div>Powered by Motion Framer, RTK Query, made by kiki</div>
            {/* <LogView /> */}
          </DndProvider>
        </div>
      </>
    )
  }

  // return (
  //   <div className="App">
  //     {/* <audio ref={audioRef} src={AUDIO} loop /> */}
  //     <DndProvider backend={HTML5Backend}>
  //       <GamePage />
  //       <div>Powered by Motion Framer, RTK Query, React, Made by kiki</div>
  //       {/* <LogView /> */}
  //     </DndProvider>
  //   </div>
  // )
}

export default App
