import { FC, memo, useEffect, useRef, useState } from "react"
import { Box as Boxes } from "./box"
import { RootState } from "../app/store"
import { useDispatch, useSelector } from "react-redux"
import { completeQuest, retryGame } from "./slice"
import { getSpecificItemCount } from "./functions"
interface ViewProps {}

const View: FC<ViewProps> = () => {
  const { data, quests, playerData } = useSelector(
    (state: RootState) => state.gameSlice,
  )
  const dispatch = useDispatch()
  const [showTutorial, setShowTutorial] = useState(false)
  const [highlightStyle, setHighlightStyle] = useState({})
  const targetRef = useRef<HTMLButtonElement | null>(null)

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (playerData.isGameOver) {
      setShowModal(true)
    }
  }, [playerData.isGameOver])

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect()
      setHighlightStyle({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }
  }, [showTutorial])

  return (
    <>
      {showTutorial && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50"
          onClick={() => {
            // setShowTutorial(false)
          }}
        >
          {/* Empty div for the hole */}
          <div className="absolute pointer-events-auto" style={highlightStyle}>
            <button
              ref={targetRef}
              onClick={() => setShowTutorial(!showTutorial)}
              className={`rounded-lg text-sm w-32 h-8 bg-[#0464ff] text-[#ffffff] justify-center`}
            >
              TEST
            </button>
            <div className="ml-[200px]">
              <p className="text-white">{"TESSSSSS"}</p>
            </div>
          </div>
        </div>
      )}

      <div className="my-3 flex items-center justify-center">
        <div className="flex gap-4">
          <div className="border border-red-600 h-full w-60">
            <p>Quests</p>
            {quests.map((e, i) => (
              <div key={i} className="border border-slate-800 py-4">
                <div>
                  <p>{e.title}</p>
                  <p>
                    {getSpecificItemCount(data, e.required_type)} /{" "}
                    {e.required_item}
                  </p>
                </div>
                <div>
                  <button
                    disabled={
                      getSpecificItemCount(data, e.required_type) <
                      e.required_item
                    }
                    onClick={() => {
                      dispatch(completeQuest({ questIdx: i }))
                    }}
                    className={`rounded-lg text-sm w-32 h-8 ${getSpecificItemCount(data, e.required_type) < e.required_item ? "bg-[#6b727d]" : "bg-[#0464ff]"} text-[#ffffff] justify-center`}
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
            {/* <button
              ref={targetRef}
              onClick={() => setShowTutorial(!showTutorial)}
              className={`rounded-lg text-sm w-32 h-8 bg-[#0464ff] text-[#ffffff] justify-center`}
            >
              TEST
            </button>
            <button
              className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setShowModal(true)}
            >
              Open regular modal
            </button> */}
            {showModal ? (
              <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                        <h3 className="text-3xl font-semibold">Game over</h3>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setShowModal(false)}
                        >
                          <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            ×
                          </span>
                        </button>
                      </div>
                      {/*body*/}
                      <div className="relative p-6 flex-auto">
                        <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                          {playerData.gameOverText}
                        </p>
                      </div>
                      {/*footer*/}
                      <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Close
                        </button>
                        <button
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
              </>
            ) : null}
          </div>
          <div
            className={`col-span-9 grid grid-cols-9 gap-4 ${playerData.isGameOver && "pointer-events-none"}`}
          >
            {data.map((e, i) => (
              <Boxes
                isFilled={e.isFilled}
                key={i}
                name={`${i + 1}`}
                index={i}
                type={e.itemTypes?.code ?? ""}
                boxId={`box-` + i}
              />
            ))}
          </div>
          <div className="border border-red-600 h-full w-60">
            <p>Your Score</p>
            {playerData.score}
            <p>Merge Count</p>
            {playerData.mergeCount}
            {playerData.isGameOver && (
              <div className="mb-3">
                <button
                  ref={targetRef}
                  onClick={() => dispatch(retryGame())}
                  className={`rounded-lg text-sm w-32 h-8 bg-[#36a018] text-[#ffffff] justify-center`}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(View)
