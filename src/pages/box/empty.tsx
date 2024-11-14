import { FC } from "react"
import { useDrop } from "react-dnd"

interface IProps {
  name: string
  index: number
  boxId: string
}
export const EmptyBox: FC<IProps> = ({ name, index, boxId }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "obj",
    drop: () => ({ name: name, index: index }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  return (
    <>
      <div
        ref={drop}
        className={`${boxId} h-[100px] w-[100px] ${canDrop ? "bg-lime-300" : "bg-slate-300"} `}
      ></div>
    </>
  )
}
