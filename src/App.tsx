import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import "./App.css"
import GamePage from "./pages"

const App = () => {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <GamePage />
        <div>Made with anger by 45aken</div>
      </DndProvider>
    </div>
  )
}

export default App
