import { FC, memo } from "react"
import { Box as Boxes } from "./box"
import { RootState } from "../app/store"
import { useSelector } from "react-redux"
import { EmptyBox } from "./box/empty"
import { IItemTypes } from "./types"
interface ViewProps {}
export type Box = {
  isFilled: boolean
  name: string
  index: number
  itemTypes?: IItemTypes
  charges?: number | null | undefined
}

const View: FC<ViewProps> = () => {
  const { data } = useSelector((state: RootState) => state.gameSlice)
  return (
    <>
      <div className="my-3 flex items-center justify-center">
        <div className="border border-red-600 h-full">

        <div className="border border-slate-800">
          <p>Quests</p>
        </div>
        </div>
        <div className="grid grid-cols-9 gap-4">
          {data.map((e, i) =>
            e.isFilled ? (
              <Boxes
                name={`${i + 1}`}
                index={i}
                type={e.itemTypes?.code ?? ""}
                boxId={`box-` + i}
              />
            ) : (
              <EmptyBox
                name={`${i + 1}`}
                index={i}
                boxId={`box-` + i}
                type={e.itemTypes?.code}
              />
            ),
          )}
        </div>
      </div>
    </>
  )
}

export default memo(View)
