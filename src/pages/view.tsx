import { FC, memo } from "react"
import { Box as Boxes } from "./box"
import { RootState } from "../app/store"
import { useDispatch, useSelector } from "react-redux"
import { completeQuest, getSpecificItemCount } from "./slice"
interface ViewProps {}

const View: FC<ViewProps> = () => {
  const { data, quests } = useSelector((state: RootState) => state.gameSlice)
  const dispatch = useDispatch()
  return (
    <>
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
