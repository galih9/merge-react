interface IProps {
  x: number
  y: number
}

export const calculateCoordinate = (elementId: string): IProps | undefined => {
  const element = document.getElementById(elementId)
  if (element != null) {
    const rect = element.getBoundingClientRect()

    const x = rect.x - 516
    const y = rect.y - 146

    return { x, y }
  }
}

export const calculateRandomNumber = (maxV?: number, minV?: number): number => {
  const max = maxV ?? 100
  const min = minV ?? 30
  return Math.random() * (max - min) + min
}
