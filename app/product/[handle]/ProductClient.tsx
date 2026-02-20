'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { getProduct } from '@/lib/shopify'
import { ProductDetail, Variant } from '@/lib/types'
import { useCart } from '@/components/CartContext'

function getVariantImageIndex(product: ProductDetail, variant: Variant): number {
  if (!variant.image) return 0
  const index = product.images.edges.findIndex((img) => img.node.url === variant.image!.url)
  return index !== -1 ? index : 0
}

export default function ProductClient({ product: initialProduct }: { product?: ProductDetail | null }) {
  const params = useParams()
  const handle = params.handle as string
  const { addToCart } = useCart()

  const [product, setProduct] = useState<ProductDetail | null>(initialProduct || null)
  const [loading, setLoading] = useState(!initialProduct)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    initialProduct?.variants?.edges[0]?.node || null
  )
  // Initialize selectedImage based on the initial variant, if available.
  const [selectedImage, setSelectedImage] = useState(() => {
    if (initialProduct && initialProduct.variants?.edges[0]?.node) {
      return getVariantImageIndex(initialProduct, initialProduct.variants.edges[0].node)
    }
    return 0
  })
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      if (product) return

      try {
        const productData = await getProduct(handle)
        setProduct(productData)
        if (productData && productData.variants && productData.variants.edges.length > 0) {
          const firstVariant = productData.variants.edges[0].node
          setSelectedVariant(firstVariant)
          setSelectedImage(getVariantImageIndex(productData, firstVariant))
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (handle && !product) {
      fetchProduct()
    }
  }, [handle, product])

  const handleAddToCart = async () => {
    if (!selectedVariant) return

    setAddingToCart(true)
    try {
      await addToCart(selectedVariant.id, quantity)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-bgc-gray-light animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-12 bg-bgc-gray-light animate-pulse w-3/4"></div>
              <div className="h-8 bg-bgc-gray-light animate-pulse w-1/4"></div>
              <div className="h-32 bg-bgc-gray-light animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 pb-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">PRODUCT NOT FOUND</h1>
          <p className="text-gray-400">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  const images = product.images.edges
  const currentImage = images[selectedImage]?.node

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-bgc-gray-light mb-4 relative overflow-hidden"
            >
              {currentImage ? (
                <Image
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bgc-gray-light to-bgc-black">
                  <span className="text-8xl font-black text-gray-800">BGC</span>
                </div>
              )}
            </motion.div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1} of ${images.length}`}
                    className={`aspect-square bg-bgc-gray-light relative overflow-hidden focus-visible:ring-2 focus-visible:ring-bgc-red focus:outline-none ${
                      selectedImage === index ? 'ring-2 ring-bgc-red' : ''
                    }`}
                  >
                    <Image
                      src={image.node.url}
                      alt={image.node.altText || product.title}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl sm:text-5xl font-black mb-4">{product.title}</h1>

              <p className="text-3xl font-bold text-bgc-red mb-8">
                ${parseFloat(selectedVariant?.price.amount || '0').toFixed(2)}
              </p>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-gray-400">{product.description}</p>
              </div>

              {/* Variants */}
              {product.options?.map((option) => (
                <div key={option.id} className="mb-6">
                  <label className="block font-bold mb-2">{option.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const variant = product.variants?.edges.find((v) =>
                        v.node.selectedOptions?.some(
                          (opt) => opt.name === option.name && opt.value === value
                        )
                      )

                      const isSelected = selectedVariant?.selectedOptions?.some(
                        (opt) => opt.name === option.name && opt.value === value
                      )

                      return (
                        <button
                          key={value}
                          onClick={() => {
                            if (variant && product) {
                              setSelectedVariant(variant.node)
                              setSelectedImage(getVariantImageIndex(product, variant.node))
                            }
                          }}
                          disabled={!variant?.node.availableForSale}
                          aria-pressed={isSelected}
                          className={`px-4 py-2 font-bold border-2 transition-colors focus-visible:ring-2 focus-visible:ring-bgc-red focus:outline-none ${
                            isSelected
                              ? 'bg-bgc-red border-bgc-red text-white'
                              : variant?.node.availableForSale
                              ? 'border-bgc-gray-light hover:border-bgc-red'
                              : 'border-bgc-gray-light opacity-50 cursor-not-allowed line-through'
                          }`}
                        >
                          {value}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-8">
                <label className="block font-bold mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="w-10 h-10 bg-bgc-gray-light hover:bg-bgc-red transition-colors font-bold focus-visible:ring-2 focus-visible:ring-bgc-red focus:outline-none"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="w-10 h-10 bg-bgc-gray-light hover:bg-bgc-red transition-colors font-bold focus-visible:ring-2 focus-visible:ring-bgc-red focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale || addingToCart}
                aria-busy={addingToCart}
                className={`w-full py-4 font-bold text-lg transition-colors focus-visible:ring-2 focus-visible:ring-bgc-red focus:outline-none ${
                    justAdded
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-bgc-red hover:bg-bgc-red-dark text-white'
                } disabled:bg-bgc-gray-light disabled:cursor-not-allowed`}
              >
                {addingToCart
                  ? 'ADDING...'
                  : justAdded
                  ? 'ADDED TO CART!'
                  : selectedVariant?.availableForSale
                  ? 'ADD TO CART'
                  : 'OUT OF STOCK'}
              </motion.button>

              <p className="text-sm text-gray-500 mt-4 text-center">
                Free shipping on orders over $100
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
