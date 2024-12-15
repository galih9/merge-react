import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  Box,
  ICompleteQuestProps,
  IInitialProps,
  IReplaceProps,
  list_bag,
  list_item,
  // list_item2,
  // list_item3,
} from "./types"
import {
  checkAvailableSlot,
  calculateBagType,
  calculateNextTier,
  getEmptySlots,
  checkIsGameOver,
} from "./functions"

const populateData = (): Box[] => {
  var result: Box[] = Array.from(new Array(45)).map((_, index) => ({
    isFilled: false,
    index,
    name: index.toString(),
    charges: undefined,
    itemTypes: undefined,
    condition: "locked",
    // locked // normal
  }))

  const { outerEdge, innerEdge } = getGridEdges(result, 5, 9) // 5 rows, 9 columns

  for (let i = 0; i < outerEdge.length; i++) {
    const element = outerEdge[i]
    result[element] = {
      ...result[element],
      isFilled: true,
      itemTypes: list_item[7],
      condition: "locked",
    }
  }

  for (let i = 0; i < innerEdge.length; i++) {
    const element = innerEdge[i]
    result[element] = {
      ...result[element],
      isFilled: true,
      itemTypes: list_item[4],
      condition: "locked",
    }
  }

  // // bag level 1
  result[20] = {
    ...result[20],
    isFilled: true,
    charges: 10,
    itemTypes: list_bag[0],
    condition: "normal",
  }

  result[23] = {
    ...result[23],
    isFilled: true,
    itemTypes: list_item[1],
    condition: "locked",
  }

  result[24] = {
    ...result[24],
    isFilled: true,
    itemTypes: list_item[2],
    condition: "locked",
  }

  result[25] = {
    ...result[25],
    isFilled: true,
    itemTypes: list_item[3],
    condition: "locked",
  }

  return result
}
function getGridEdges(grid: Box[], rows: number, cols: number) {
  const outerEdge: number[] = []
  const innerEdge: number[] = []

  for (let i = 0; i < grid.length; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols

    // Outer edge: first/last row OR first/last column
    if (
      row === 0 || // Top row
      row === rows - 1 || // Bottom row
      col === 0 || // First column
      col === cols - 1 // Last column
    ) {
      outerEdge.push(i)
    }
    // Inner edge: second/second-to-last row/column excluding the true outer edge
    else if (
      row === 1 ||
      row === rows - 2 || // Second/second-to-last rows
      col === 1 ||
      col === cols - 2 // Second/second-to-last columns
    ) {
      // Include only valid inner edge cells
      if (
        (row === 1 && col >= 1 && col <= cols - 2) || // Top inner edge
        (row === rows - 2 && col >= 1 && col <= cols - 2) || // Bottom inner edge
        (col === 1 && row > 1 && row < rows - 2) || // Left inner edge
        (col === cols - 2 && row > 1 && row < rows - 2) // Right inner edge
      ) {
        innerEdge.push(i)
      }
    }
  }

  return { outerEdge, innerEdge }
}

const initialState: IInitialProps = {
  data: populateData(),
  quests: [
    {
      title: "3 level 2 items",
      required_item: 3,
      required_type: "A2",
      current_progress: 0,
      reward: list_bag[0],
    },
    {
      title: "1 level 5 items",
      required_item: 1,
      required_type: "A5",
      current_progress: 0,
      reward: list_item[7],
    },
  ],
  playerData: {
    score: 0,
    mergeCount: 0,
    isGameOver: false,
    gameOverText: "",
  },
  log: [],
}

const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    setData: (state, { payload }) => {
      state.data = payload
    },
    addData: (
      state,
      action: PayloadAction<{ parentIndex: number; bagType: string }>,
    ) => {
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
        const newdata: Box = calculateBagType(action.payload.bagType, idx)
        state.data[idx] = newdata
      }
      // log
      state.log.push("added item!")
    },
    mergeData: (state, action: PayloadAction<IReplaceProps>) => {
      let table = state.data
      const fdx = action.payload.indexFr
      const tdx = action.payload.indexTo
      const fr = table[fdx]
      const to = table[tdx]
      const next_tier = calculateNextTier(fr.itemTypes?.code)
      if (fr.itemTypes?.code != to.itemTypes?.code || next_tier === undefined) {
        table[tdx] = fr
        table[fdx] = to
        // log
        state.log.push("item swapped!")
      } else {
        table[tdx] = {
          ...to,
          itemTypes: next_tier,
          charges: next_tier.charges,
          condition: to.condition === "locked" ? "normal" : to.condition,
        }
        table[fdx] = {
          ...fr,
          isFilled: false,
          itemTypes: undefined,
        }
        let point = next_tier.code.replace(/\D/g, "")
        state.playerData.score += parseInt(point)
        state.playerData.mergeCount += 1
        // =========================== to be fixed
        if (
          state.playerData.mergeCount != 0 &&
          state.playerData.mergeCount % 5 === 0
        ) {
          let check = getEmptySlots(state.data)
          state.log.push(`${JSON.stringify(check)}`)
          state.log.push(`index from ${fdx}`)
          state.log.push(`index to ${tdx}`)
        }
        // =============================================

        // log
        state.log.push("item merged!")
      }
      if (checkIsGameOver(state.data)) {
        state.playerData.gameOverText =
          "You can't do any merging or spawning any item,\n maybe try to get as much box next time"
      }
      state.playerData.isGameOver = checkIsGameOver(state.data)
      state.data = table
    },
    replaceData: (state, action: PayloadAction<IReplaceProps>) => {
      const fr = state.data[action.payload.indexFr]
      const to = state.data[action.payload.indexTo]
      state.data[action.payload.indexTo] = fr
      state.data[action.payload.indexFr] = to
      // log
      state.log.push("item replaced!")
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

        // log
        state.log.push("quest completed!")
      }
    },
    retryGame: (state) => {
      state.data = initialState.data;
      state.log = initialState.log;
      state.playerData = initialState.playerData;
    }
  },
})

export const { setData, replaceData, addData, mergeData, completeQuest, retryGame } =
  gameSlice.actions
export default gameSlice
