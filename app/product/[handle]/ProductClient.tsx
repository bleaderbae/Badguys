'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { getProduct } from '@/lib/shopify'
import { ProductDetail, Variant } from '@/lib/types'
import { useCart } from '@/components/CartContext'

export default function ProductClient() {
  const params = useParams()
  const handle = params.handle as string
  const { addToCart } = useCart()

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProduct(handle)
        setProduct(productData)
        if (productData && productData.variants && productData.variants.edges.length > 0) {
          setSelectedVariant(productData.variants.edges[0].node)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (handle) {
      fetchProduct()
    }
  }, [handle])

  // Update selected image when variant changes
  useEffect(() => {
    if (selectedVariant?.image && product) {
      const imageIndex = product.images.edges.findIndex(
        (img) => img.node.url === selectedVariant.image!.url
      )
      if (imageIndex !== -1) {
        setSelectedImage(imageIndex)
      }
    }
  }, [selectedVariant, product])

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
                    className={`aspect-square bg-bgc-gray-light relative overflow-hidden ${
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
                        (opt: any) => opt.name === option.name && opt.value === value
                      )

                      return (
                        <button
                          key={value}
                          onClick={() => variant && setSelectedVariant(variant.node)}
                          disabled={!variant?.node.availableForSale}
                          className={`px-4 py-2 font-bold border-2 transition-colors ${
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
                    className="w-10 h-10 bg-bgc-gray-light hover:bg-bgc-red transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-bgc-gray-light hover:bg-bgc-red transition-colors font-bold"
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
                className={`w-full py-4 font-bold text-lg transition-colors ${
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
