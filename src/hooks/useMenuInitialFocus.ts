import React from 'react'
import {iterateFocusableElements} from '@primer/behaviors/utils'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'

type Gesture = 'anchor-click' | 'anchor-key-press'
type Callback = (gesture: Gesture, event?: React.KeyboardEvent<HTMLElement>) => unknown

export const useMenuInitialFocus = (
  open: boolean,
  onOpen?: Callback,
  providedContainerRef?: React.RefObject<HTMLElement>,
  providedAnchorRef?: React.RefObject<HTMLElement>
) => {
  const containerRef = useProvidedRefOrCreate(providedContainerRef)
  const anchorRef = useProvidedRefOrCreate(providedAnchorRef)
  const [openingKey, setOpeningKey] = React.useState<string | undefined>(undefined)

  const openWithFocus: Callback = (gesture, event) => {
    if (gesture === 'anchor-click') setOpeningKey('mouse-click')
    if (gesture === 'anchor-key-press' && event) setOpeningKey((event as React.KeyboardEvent<HTMLElement>).code)
    if (typeof onOpen === 'function') onOpen(gesture, event)
  }

  /**
   * Pick the first element to focus based on the key used to open the Menu
   * Click: anchor
   * ArrowDown | Space | Enter: first element
   * ArrowUp: last element
   */
  React.useEffect(() => {
    if (!open) return
    if (!openingKey || !containerRef.current) return

    const iterable = iterateFocusableElements(containerRef.current)

    if (openingKey === 'mouse-click') {
      if (anchorRef.current) anchorRef.current.focus()
      else throw new Error('For focus management, please attach anchorRef') // TODO: improve error
    } else if (['ArrowDown', 'Space', 'Enter'].includes(openingKey)) {
      const firstElement = iterable.next().value
      /** We push imperative focus to the next tick to prevent React's batching */
      setTimeout(() => firstElement?.focus())
    } else if (['ArrowUp'].includes(openingKey)) {
      const elements = [...iterable]
      const lastElement = elements[elements.length - 1]
      setTimeout(() => lastElement.focus())
    }
  }, [open, openingKey, containerRef, anchorRef])

  return {containerRef, anchorRef, openWithFocus}
}
