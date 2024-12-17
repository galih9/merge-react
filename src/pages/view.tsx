import { FC, memo, useEffect, useRef, useState } from "react"
import { Box as Boxes } from "./box"
import { RootState } from "../app/store"
import { useDispatch, useSelector } from "react-redux"
import { completeQuest, retryGame } from "./slice"
import { getSpecificItemCount } from "./functions"
import { NpcView } from "./npc"
import { DashModal } from "./npc/dashModal"
import { TutorialModal } from "./npc/tutorialModal"
interface ViewProps {}

const View: FC<ViewProps> = () => {
  const { data, quests, playerData } = useSelector(
    (state: RootState) => state.gameSlice,
  )
  const dispatch = useDispatch()
  const [showTutorial, setShowTutorial] = useState(false)
  const targetRef = useRef<HTMLButtonElement | null>(null)

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (playerData.isGameOver) {
      setShowModal(true)
    }
  }, [playerData.isGameOver])

  return (
    <>
      {showTutorial && (
        <TutorialModal onCloseModal={() => setShowTutorial(false)} />
      )}

      <div className="my-3 flex items-center justify-center">
        <div className="flex gap-4">
          <div className="border h-full w-60 bg-white rounded-md">
            <p>Quests</p>
            {quests.map((e, i) => (
              <div key={i} className="py-4">
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
            {showModal && (
              <>
                <DashModal
                  onCloseModal={val => {
                    setShowModal(val)
                  }}
                  onRetry={() => {
                    dispatch(retryGame())
                  }}
                />
              </>
            )}
          </div>
          <div
            className={`bg-white p-5 rounded-md col-span-9 grid grid-cols-9 gap-4 ${playerData.isGameOver && "pointer-events-none"}`}
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
          <div className="border rounded-md p-3 bg-white h-full w-60">
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
            <div>
              {!playerData.isGameOver && <NpcView />}
              <button
                onClick={() => setShowTutorial(!showTutorial)}
                className={`rounded-lg text-sm w-32 h-8 bg-[#0464ff] text-[#ffffff] justify-center`}
              >
                How to Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(View)
