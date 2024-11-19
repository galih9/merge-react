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
}

interface DragItem {
  name: string
  index: number
  type: string
}
export const Box: FC<BoxProps> = ({ name, index, type, boxId }) => {
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
          // alert(`You dropped ${item.name} into ${dropResult.name}!`)
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
  const [, drop] = useDrop(() => ({
    accept: "obj",
    drop: () => ({ name: name, index: index, type: type }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  function attachRef(el: ConnectableElement) {
    drag(el)
    drop(el)
  }
  return (
    <div className={boxId}>
      <div className="h-[50px] w-[50px] bg-yellow-300 flex flex-row justify-center items-center">
        <div
          onClick={() => {
            if (type === list_item[0].code) {
              dispatch(addData({ parentIndex: index }))
            }
          }}
          ref={attachRef}
          className={`h-[45px] w-[45px] bg-white font-extrabold flex flex-row justify-center items-center border border-solid border-slate-950`}
        >
          {/* <ItemImageDisplayer src={calculateImageId(type)} /> */}
          {!type.includes("BAG") ? type[1] : type}
        </div>
      </div>
    </div>
  )
}
