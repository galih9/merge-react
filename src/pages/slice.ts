import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  Box,
  ICompleteQuestProps,
  IInitialProps,
  IItemTypes,
  IReplaceProps,
  list_item,
} from "./types"

const SOURCE_DATA: Box[] = Array.from(new Array(45)).map((_, index) => ({
  isFilled: index === 20 || index === 30,
  index,
  name: index.toString(),
  charges: index === 20 ? 10 : undefined,
  itemTypes:
    index === 20 ? list_item[0] : index === 30 ? list_item[4] : undefined,
  condition: index === 30 ? "locked" : "normal",
}))

const initialState: IInitialProps = {
  data: SOURCE_DATA,
  quests: [
    {
      title: "3 level 2 items",
      required_item: 3,
      required_type: "A2",
      current_progress: 0,
      reward: list_item[0],
    },
    {
      title: "1 level 5 items",
      required_item: 1,
      required_type: "A5",
      current_progress: 0,
      reward: list_item[0],
    },
  ],
}

export const checkAvailableSlot = (state: Box[]): number | null => {
  for (let i = 0; i < state.length; i++) {
    const element = state[i]
    if (!element.isFilled) {
      return i
    }
  }
  return null
}

const calculateNextTier = (val: string | undefined): IItemTypes | undefined => {
  for (let i = 0; i < list_item.length; i++) {
    const element = list_item[i]
    if (val === element.code && i != list_item.length) {
      return list_item[i + 1]
    }
  }
  return undefined
}

export const getSpecificItemCount = (data: Box[], code: string): number => {
  let count = 0
  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    if (element.itemTypes?.code === code && element.condition === "normal") {
      count += 1
    }
  }
  return count
}

const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    setData: (state, { payload }) => {
      state.data = payload
    },
    addData: (state, action: PayloadAction<{ parentIndex: number }>) => {
      const idx = checkAvailableSlot(state.data)
      const pdx = action.payload.parentIndex
      const charges = state.data[pdx].charges
      if (idx != null) {
        if (charges != null && charges != undefined) {
          if (charges < 2) {
            state.data[pdx].isFilled = false
            state.data[pdx].itemTypes = undefined
          }
          state.data[pdx].charges! -= 1
        }
        const newdata: Box = {
          isFilled: true,
          name: `${idx + 1}`,
          index: idx,
          itemTypes: list_item[3],
          condition: "normal",
        }
        state.data[idx] = newdata
      }
    },
    mergeData: (state, action: PayloadAction<IReplaceProps>) => {
      let table = state.data
      const fdx = action.payload.indexFr
      const tdx = action.payload.indexTo
      const fr = table[fdx]
      const to = table[tdx]
      console.log(fr.itemTypes?.code, "=", to.itemTypes?.code)
      const next_tier = calculateNextTier(fr.itemTypes?.code)
      if (fr.itemTypes?.code != to.itemTypes?.code || next_tier === undefined) {
        table[tdx] = fr
        table[fdx] = to
      } else {
        table[tdx] = {
          ...to,
          itemTypes: next_tier,
          condition: to.condition === "locked" ? "normal" : to.condition,
        }
        table[fdx] = {
          ...fr,
          isFilled: false,
          itemTypes: undefined,
        }
      }

      state.data = table
    },
    replaceData: (state, action: PayloadAction<IReplaceProps>) => {
      const fr = state.data[action.payload.indexFr]
      const to = state.data[action.payload.indexTo]
      state.data[action.payload.indexTo] = fr
      state.data[action.payload.indexFr] = to
    },
    completeQuest: (state, action: PayloadAction<ICompleteQuestProps>) => {
      const targetIdx = checkAvailableSlot(state.data)
      if (targetIdx != null) {
        const id = action.payload.questIdx
        const quest_code = state.quests[id].required_type
        const reward = state.quests[id].reward

        // remove required item
        var temp = state.data
        for (let i = 0; i < state.data.length; i++) {
          const element = state.data[i]
          if (
            element.itemTypes?.code === quest_code &&
            element.condition === "normal"
          ) {
            temp[i] = { ...temp[i], isFilled: false, itemTypes: undefined }
          }
        }

        // place reward
        const newdata: Box = {
          isFilled: true,
          name: `${targetIdx + 1}`,
          index: targetIdx,
          itemTypes: reward,
          charges: reward.charges,
          condition: "normal",
        }
        state.data[targetIdx] = newdata
      }
    },
  },
})

export const { setData, replaceData, addData, mergeData, completeQuest } =
  gameSlice.actions
export default gameSlice
