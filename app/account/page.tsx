'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCustomer } from '@/lib/shopify'

export default function AccountPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('bgc_customer_token')
    if (!token) {
      router.push('/account/login')
      return
    }

    async function fetchCustomer() {
      try {
        const data = await getCustomer(token!)
        if (!data) {
           // Token invalid
           localStorage.removeItem('bgc_customer_token')
           router.push('/account/login')
        } else {
           setCustomer(data)
        }
      } catch (error) {
        console.error('Error fetching customer', error)
        localStorage.removeItem('bgc_customer_token')
        router.push('/account/login')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [router])

  if (loading) return (
    <div className="min-h-screen pt-32 text-center">
      <div className="animate-pulse">LOADING ACCOUNT DATA...</div>
    </div>
  )

  if (!customer) return null

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black mb-8 border-b-2 border-bgc-red inline-block">ACCOUNT</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
            <div className="bg-bgc-gray p-6 border border-bgc-gray-light">
                <h2 className="text-xl font-bold mb-4 text-bgc-red">PROFILE</h2>
                <div className="space-y-2 text-gray-300">
                    <p className="font-bold text-white text-lg">{customer.firstName} {customer.lastName}</p>
                    <p>{customer.email}</p>
                    {customer.phone && <p>{customer.phone}</p>}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                    {customer.defaultAddress ? (
                        <div className="text-sm text-gray-400">
                            <p className="text-xs uppercase tracking-wider mb-2 font-bold text-gray-500">Default Address</p>
                            <p>{customer.defaultAddress.address1}</p>
                            {customer.defaultAddress.address2 && <p>{customer.defaultAddress.address2}</p>}
                            <p>{customer.defaultAddress.city}, {customer.defaultAddress.province} {customer.defaultAddress.zip}</p>
                            <p>{customer.defaultAddress.country}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No default address set</p>
                    )}
                </div>
            </div>

            <button
                onClick={() => {
                    localStorage.removeItem('bgc_customer_token')
                    router.push('/account/login')
                }}
                className="w-full px-6 py-3 bg-bgc-gray-light hover:bg-bgc-red text-white font-bold transition-colors border border-gray-700"
            >
                LOGOUT
            </button>
        </div>

        <div className="md:col-span-2">
            <div className="bg-bgc-gray p-6 border border-bgc-gray-light min-h-[400px]">
                <h2 className="text-xl font-bold mb-6 text-bgc-red">ORDER HISTORY</h2>

                {customer.orders.edges.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="mb-4">No orders placed yet.</p>
                        <a href="/shop" className="text-white underline hover:text-bgc-red">Start Shopping</a>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {customer.orders.edges.map(({ node }: any) => (
                            <li key={node.id} className="bg-black/30 p-4 border border-gray-800 hover:border-bgc-red transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="font-bold text-lg text-white group-hover:text-bgc-red transition-colors">#{node.orderNumber}</span>
                                        <div className="text-xs text-gray-500">{new Date(node.processedAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg">{node.totalPrice.amount} {node.totalPrice.currencyCode}</div>
                                        <div className="flex gap-2 text-xs mt-1">
                                            <span className={`px-2 py-0.5 rounded ${node.financialStatus === 'PAID' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                                                {node.financialStatus}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded ${node.fulfillmentStatus === 'FULFILLED' ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                                                {node.fulfillmentStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-2 border-t border-gray-800">
                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Items</p>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        {node.lineItems.edges.map(({ node: item }: any) => (
                                            <li key={item.title} className="flex justify-between">
                                                <span>{item.title}</span>
                                                <span className="text-gray-500">x{item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}
