export interface IItemTypes {
  code: string
  title: string
  charges?: number
}

export const list_item: IItemTypes[] = [
  {
    code: "BAG1",
    title: "Bag 1",
    charges: 5,
  },
  {
    code: "BAG2",
    title: "Bag 2",
    charges: 10,
  },
  {
    code: "BAG3",
    title: "Bag 3",
    charges: 20,
  },
  {
    code: "A1",
    title: "A1",
  },
  {
    code: "A2",
    title: "A2",
  },
  {
    code: "A3",
    title: "A3",
  },
  {
    code: "A4",
    title: "A4",
  },
  {
    code: "A5",
    title: "A5",
  },
  {
    code: "A6",
    title: "A6",
  },
  {
    code: "A7",
    title: "A7",
  },
  {
    code: "A8",
    title: "A8",
  },
  {
    code: "A9",
    title: "A9",
  },
  {
    code: "A110",
    title: "A10",
  },
  {
    code: "A11",
    title: "A11",
  },
]

export const COL_CHOCOLATE = "#de6800"
export const COL_BRIGHT_CHOCOLATE = "#f5ae70"
export const COL_LESS_BRIGHT_CHOCOLATE = "#b38052"

export type Box = {
  isFilled: boolean
  name: string
  index: number
  itemTypes?: IItemTypes
  charges?: number | null | undefined
  condition: "locked" | "normal"
}

export interface ICompleteQuestProps {
  questIdx: number
}

export interface IQuest {
  title: string
  required_item: number
  current_progress: number
  reward: IItemTypes
  required_type: string
}

export interface IInitialProps {
  data: Box[]
  quests: IQuest[]
}

export interface IReplaceProps {
  indexFr: number
  indexTo: number
}
