import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Star } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  rating: number
  image: string
  inCart: boolean
}

const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 199.99,
    rating: 4.8,
    image: "🎧",
    inCart: false,
  },
  {
    id: "2",
    name: "Smartwatch Pro",
    price: 299.99,
    rating: 4.6,
    image: "⌚",
    inCart: false,
  },
  {
    id: "3",
    name: "USB-C Cable",
    price: 19.99,
    rating: 4.9,
    image: "🔌",
    inCart: false,
  },
  {
    id: "4",
    name: "Phone Stand",
    price: 29.99,
    rating: 4.7,
    image: "📱",
    inCart: false,
  },
  {
    id: "5",
    name: "Portable Charger",
    price: 49.99,
    rating: 4.5,
    image: "🔋",
    inCart: false,
  },
  {
    id: "6",
    name: "Screen Protector",
    price: 14.99,
    rating: 4.8,
    image: "🛡️",
    inCart: false,
  },
]

export default function EcommerceDemo() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const cartItems = products.filter(p => p.inCart)
  const total = cartItems.reduce((sum, p) => sum + p.price, 0)

  const toggleCart = (id: string) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, inCart: !p.inCart } : p
    ))
  }

  return (
    <div className="space-y-6">
      {/* Search & Cart Summary */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-secondary/50 focus:outline-none focus:border-primary"
            data-testid="input-search-products"
          />
        </div>
        <div className="bg-card border border-border rounded-lg p-4 min-w-[250px]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold">Shopping Cart</span>
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
              {cartItems.length}
            </span>
          </div>
          <div className="border-t border-border pt-3 mb-3">
            {cartItems.length > 0 ? (
              <div className="space-y-2 mb-3">
                {cartItems.map(item => (
                  <div key={item.id} className="text-sm flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-bold">${item.price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No items in cart</p>
            )}
          </div>
          <div className="border-t border-border pt-3 flex justify-between font-bold mb-4">
            <span>Total:</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
          <Button className="w-full" disabled={cartItems.length === 0} data-testid="button-checkout">
            Proceed to Checkout
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            data-testid={`product-${product.id}`}
          >
            <div className="text-6xl text-center mb-4">{product.image}</div>
            <h3 className="font-bold text-lg mb-2">{product.name}</h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating})</span>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-primary mb-4">${product.price}</div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                className="flex-1 gap-2"
                onClick={() => toggleCart(product.id)}
                variant={product.inCart ? "default" : "outline"}
                data-testid={`button-add-to-cart-${product.id}`}
              >
                <ShoppingCart className="w-4 h-4" />
                {product.inCart ? "In Cart" : "Add"}
              </Button>
              <Button variant="outline" size="icon" data-testid={`button-wishlist-${product.id}`}>
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No products found matching "{searchTerm}"
        </div>
      )}
    </div>
  )
}
