import { FC, memo, useEffect, useRef, useState } from "react"
import { Box as Boxes } from "./box"
import { RootState } from "../app/store"
import { useDispatch, useSelector } from "react-redux"
import { completeQuest, getSpecificItemCount } from "./slice"
interface ViewProps {}

const View: FC<ViewProps> = () => {
  const { data, quests } = useSelector((state: RootState) => state.gameSlice)
  const dispatch = useDispatch()
  const [showTutorial, setShowTutorial] = useState(false)
  const [highlightStyle, setHighlightStyle] = useState({})
  const targetRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    console.log(targetRef.current, "test")
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect()
      console.log("check =>", rect)
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
          onClick={() => setShowTutorial(false)}
        >
          {/* Empty div for the hole */}
          <div
            className="absolute pointer-events-auto"
            style={highlightStyle}
          ></div>
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
            <button
              ref={targetRef}
              onClick={() => setShowTutorial(!showTutorial)}
              className={`rounded-lg text-sm w-32 h-8 bg-[#0464ff] text-[#ffffff] justify-center`}
            >
              TEST
            </button>
          </div>
          <div className="col-span-9 grid grid-cols-9 gap-4">
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
        </div>
      </div>
    </>
  )
}

export default memo(View)
