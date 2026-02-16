import { LineItem } from './types'

export function isValidLineItem(item: any): item is LineItem {
  if (typeof item !== 'object' || item === null) return false
  if (typeof item.id !== 'string') return false
  if (typeof item.title !== 'string') return false
  if (typeof item.quantity !== 'number') return false

  // Optional variant check
  if ('variant' in item) {
    // If variant is present, it must be either undefined (not possible in JSON loop but just in case), null (if serialized), or an object
    if (item.variant === undefined || item.variant === null) {
        return true // valid if null/undefined
    }

    if (typeof item.variant !== 'object') return false

    // Validate Variant properties
    if (typeof item.variant.id !== 'string') return false
    if (typeof item.variant.title !== 'string') return false

    // Price is mandatory in Variant
    if (typeof item.variant.price !== 'object' || item.variant.price === null) return false
    if (typeof item.variant.price.amount !== 'string') return false

    // Image is optional in Variant
    if ('image' in item.variant && item.variant.image) {
        if (typeof item.variant.image !== 'object') return false
        if (typeof item.variant.image.url !== 'string') return false
    }
  }

  return true
}
