import { useEffect, useState, type CSSProperties, type FC } from "react"
import { ConnectableElement, useDrag, useDrop } from "react-dnd"

import { ItemTypes } from "../types"
import { useDispatch } from "react-redux"
import { replaceData } from "../slice"
import {
  calculateImageId,
  ItemImageDisplayer,
} from "../../utils/image-calculator"
import anime from "animejs"

const style: CSSProperties = {
  border: "1px dashed gray",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  marginRight: "1.5rem",
  marginBottom: "1.5rem",
  cursor: "move",
  float: "left",
}

interface BoxProps {
  name: string
  index: number
  type: string
  boxId: string
}

interface DragItem {
  name: string
  index: number
}
export const Box: FC<BoxProps> = ({ name, index, type, boxId }) => {
  const dispatch = useDispatch()
  const el = document.querySelector(".box-1")?.getBoundingClientRect()

  // DRAG
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "obj",
      item: { name, index },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<DragItem>()
        console.log(dropResult)
        if (item && dropResult) {
          // alert(`You dropped ${item.name} into ${dropResult.name}!`)
          console.log(dropResult)
          dispatch(
            replaceData({
              indexFr: item.index,
              indexTo: dropResult.index,
            }),
          )
        }
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [name],
  )
  const opacity = isDragging ? 0.4 : 1
  // DROP
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "obj",
    drop: () => ({ name: name, index: index }),
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
      <div className="h-[100px] w-[100px] bg-yellow-300 flex flex-row justify-center items-center">
        <div
          onClick={() => {
            // console.log(document.querySelector(".box-1")?.getBoundingClientRect())
            // console.log(boxId, el)
            // anime({
            //   targets: boxId,
            //   easing: "easeInOutExpo",
            //   loop: true,
            //   top: el?.top,
            //   left: el?.left,
            // })
            if (type === ItemTypes.BOX1) {
              
            }
          }}
          ref={attachRef}
          className={`h-[50px] w-[50px] bg-white font-extrabold flex flex-row justify-center items-center border border-solid border-slate-950`}
        >
          {/* <ItemImageDisplayer src={calculateImageId(type)} /> */}
          {!type.includes("BAG") ? type[1] : type}
        </div>
      </div>
    </div>
  )
}
