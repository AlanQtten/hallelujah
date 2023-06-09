import { cloneDeep } from 'lodash'

export default function shuffle(arr) {
  return cloneDeep(arr)
    .sort(() => Math.random() - 0.5)
}
