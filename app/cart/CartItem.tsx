'use client'

import Image from 'next/image'
import { LineItem } from '@/lib/types'

interface CartItemProps {
  item: LineItem
  onRemove: (id: string) => void
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 items-start border-b border-gray-700 pb-6 last:border-0 last:pb-0">
      <div className="relative w-24 h-24 bg-gray-800 flex-shrink-0">
        {item.variant?.image ? (
          <Image
            src={item.variant.image.url}
            alt={item.variant.image.altText || item.title}
            fill
            className="object-cover"
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-gray-500">
             No Image
           </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-1">{item.variant?.product?.title || item.title}</h3>
        <p className="text-gray-400 text-sm mb-2">{item.variant?.title}</p>
        <div className="flex justify-between items-center">
            <p className="font-mono text-bgc-red font-bold">
                Quantity: {item.quantity}
            </p>
            <div className="flex items-center gap-4">
                <p className="text-lg font-bold">
                    ${(parseFloat(item.variant?.price.amount || '0') * item.quantity).toFixed(2)}
                </p>
                <button
                    onClick={() => onRemove(item.id)}
                    className="text-gray-500 hover:text-red-500 text-sm font-bold underline decoration-dotted underline-offset-4"
                    aria-label={`Remove ${item.variant?.product?.title || item.title} from cart`}
                >
                    REMOVE
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}
