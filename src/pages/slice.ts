import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Box } from "./view"
import { ItemTypes } from "./types"

const SOURCE_DATA: Box[] = Array.from(new Array(45)).map((_, index) => ({
  isFilled: index === 20 || index === 30,
  index,
  name: index.toString(),
  itemTypes: index === 20 ? ItemTypes.BOX1 : index === 30 ? ItemTypes.A1  : undefined,
}))
interface IProps {
  data: Box[]
}
interface IReplaceProps {
  indexFr: number
  indexTo: number
}
const initialState = {
  data: SOURCE_DATA,
}

const checkAvailableSlot = (state: Box[]): number | null => {
  for (let i = 0; i < state.length; i++) {
    const element = state[i];
    
  }
  return null;
}

const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    setData: (state, { payload }) => {
      state.data = payload
    },
    addData: (state) => {

    },
    replaceData: (state, action: PayloadAction<IReplaceProps>) => {
      console.log("called action", action.payload)
      const fr = state.data[action.payload.indexFr]
      const to = state.data[action.payload.indexTo]
      state.data[action.payload.indexTo] = fr
      state.data[action.payload.indexFr] = to
    },
  },
})

export const { setData, replaceData } = gameSlice.actions
export default gameSlice
