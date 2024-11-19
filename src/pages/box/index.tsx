import { FC } from "react"
import { ConnectableElement, useDrag, useDrop } from "react-dnd"
import { useDispatch } from "react-redux"
import { addData, mergeData, replaceData } from "../slice"
import { list_item } from "../types"

interface BoxProps {
  name: string
  index: number
  type: string
  boxId: string
  condition: "normal" | "locked"
}

interface DragItem {
  name: string
  index: number
  type: string
}
export const Box: FC<BoxProps> = ({ name, index, type, boxId, condition }) => {
  const dispatch = useDispatch()

  // DRAG
  const [, drag] = useDrag(
    () => ({
      type: "obj",
      item: { name, index },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<DragItem>()
        if (item && dropResult) {
          console.log(type, index, dropResult.type, dropResult.index)
          if (index != dropResult.index) {
            if (type === dropResult.type) {
              dispatch(
                mergeData({
                  indexFr: item.index,
                  indexTo: dropResult.index,
                }),
              )
            } else {
              dispatch(
                replaceData({
                  indexFr: item.index,
                  indexTo: dropResult.index,
                }),
              )
            }
          }
        }
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [name],
  )
  // DROP
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "obj",
    drop: () => ({ name: name, index: index, type: type }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: condition === "normal" ? monitor.canDrop() : false,
    }),
  }))

  function attachRef(el: ConnectableElement) {
    drag(el)
    drop(el)
  }
  return (
    <div className={"bg-emerald-600"}>
      <div className={boxId}>
        <div
          className={`h-[50px] w-[50px] ${isOver ? "opacity-20" : "opacity-100"} bg-yellow-300 flex flex-row justify-center items-center`}
        >
          <div
            onClick={() => {
              if (type === list_item[0].code) {
                dispatch(addData({ parentIndex: index }))
              }
            }}
            ref={attachRef}
            className={`h-[45px] w-[45px] ${condition === "normal" ? "bg-white" : "bg-gray-400"} font-extrabold flex flex-row justify-center items-center border border-solid border-slate-950`}
          >
            {/* <ItemImageDisplayer src={calculateImageId(type)} /> */}
            {!type.includes("BAG") ? type[1] : type}
          </div>
        </div>
      </div>
    </div>
  )
}
