import { FC } from "react"
import { useDrop } from "react-dnd"

interface IProps {
  name: string
  index: number
  boxId: string
  type?: string
}
export const EmptyBox: FC<IProps> = ({ name, index, boxId,type }) => {
  const [{ canDrop }, drop] = useDrop(() => ({
    accept: "obj",
    drop: () => ({ name: name, index: index, type: type }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  return (
    <>
      <div
        ref={drop}
        className={`${boxId} h-[50px] w-[50px] ${canDrop ? "bg-lime-300" : "bg-slate-300"} `}
      ></div>
    </>
  )
}
