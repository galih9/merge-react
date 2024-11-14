import { FC, memo, useEffect, useState } from "react"
import { Box as Boxes } from "./box"
import { RootState } from "../app/store"
import { useSelector } from "react-redux"
import { EmptyBox } from "./box/empty"
interface ViewProps {}
export type Box = {
  isFilled: boolean
  name: string
  index: number
  itemTypes?: string | undefined
  charges?: number | null | undefined
}

const View: FC<ViewProps> = () => {
  const { data } = useSelector((state: RootState) => state.gameSlice)
  return (
    <>
      <div className="my-3 flex items-center justify-center">
        <div className="grid grid-cols-9 gap-4">
          {data.map((e, i) =>
            e.isFilled ? (
              <Boxes
                name={`${i + 1}`}
                index={i}
                type={e.itemTypes ?? ""}
                boxId={`box-` + i}
              />
            ) : (
              <EmptyBox name={`${i + 1}`} index={i} boxId={`box-` + i} />
            ),
          )}
        </div>
      </div>
    </>
  )
}

export default memo(View)
