import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './App.css'
import { supabase } from './lib/supabase'

const CartContext = createContext(null)
const ProductContext = createContext(null)

// Share cart data with every page without prop drilling.
function useCart() { return useContext(CartContext) }

// Share the database-backed catalog with every product page.
function useProducts() { return useContext(ProductContext) }

// Load products from Supabase and expose loading and error states to the UI.
function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      if (!supabase) {
        setError('Supabase is not configured. Add the variables from .env.example to load the catalog.')
        setLoading(false)
        return
      }

      const { data, error: queryError } = await supabase.from('products').select('*').order('id')
      if (queryError) setError(queryError.message)
      else setProducts(data)
      setLoading(false)
    }

    loadProducts()
  }, [])

  return <ProductContext.Provider value={{ products, loading, error }}>{children}</ProductContext.Provider>
}

// Keep the cart state alive while the user moves between client-side routes.
function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // Add one product while preserving a single line item per product.
  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...current, { ...product, quantity: 1 }]
    })
  }

  // Change the quantity and remove an item when its quantity reaches zero.
  function updateQuantity(id, change) {
    setCart((current) => current.flatMap((item) => item.id === id && item.quantity + change > 0 ? [{ ...item, quantity: item.quantity + change }] : item.id === id ? [] : [item]))
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const value = useMemo(() => ({ cart, addToCart, updateQuantity, totalItems, totalPrice }), [cart, totalItems, totalPrice])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Render the shared brand navigation and live cart count.
function Header() {
  const { totalItems } = useCart()
  return <header className="site-header"><Link className="brand" to="/"><span className="brand-mark">S</span><span>Soft Signal <small>digital goods</small></span></Link><nav aria-label="Main navigation"><NavLink to="/shop">Shop</NavLink><NavLink to="/about">Our approach</NavLink><NavLink to="/contact">Contact</NavLink><NavLink className="cart-link" to="/cart">Bag <span>{totalItems}</span></NavLink></nav></header>
}

// Present one product consistently on the home and shop pages.
function ProductCard({ product }) {
  const { addToCart } = useCart()
  return <article className="product-card"><Link to={`/products/${product.id}`} className={`product-art ${product.tone}`} aria-label={`View ${product.name}`}><span>{product.type}</span><strong>{product.name}</strong><i>SS / {String(product.id).padStart(2, '0')}</i></Link><div className="product-info"><div><p className="eyebrow">{product.type}</p><h3>{product.name}</h3><p>{product.description}</p></div><div className="product-buy"><strong>${product.price}</strong><button type="button" onClick={() => addToCart(product)}>Add to bag</button></div></div></article>
}

// Give the user a clear explanation when the database is loading or unavailable.
function ProductStatus({ loading, error }) {
  if (loading) return <main className="empty-state"><p className="eyebrow">Catalog</p><h1>Loading the<br /><em>collection.</em></h1></main>
  if (error) return <main className="empty-state"><p className="eyebrow">Catalog unavailable</p><h1>Connection<br /><em>required.</em></h1><p>{error}</p></main>
  return null
}

// Compose the storefront landing page from reusable content sections.
function Home() {
  const { products, loading, error } = useProducts()
  if (loading || error) return <ProductStatus loading={loading} error={error} />
  return <main><section className="hero-section"><div className="hero-copy"><p className="eyebrow">A small shop for thoughtful work</p><h1>Make space for<br /><em>better ideas.</em></h1><p className="hero-text">Digital templates, guides, and tools for people who want to make meaningful work without making life noisier.</p><Link className="primary-button" to="/shop">Explore the collection <span>-&gt;</span></Link></div><div className="hero-art"><div className="sun"></div><div className="hero-card"><span>FIELD NOTE / 001</span><strong>Start<br />somewhere.</strong><small>Tools for the work in progress.</small></div><div className="scribble">take<br />your<br />time</div></div></section><section className="featured-section"><div className="section-heading"><div><p className="eyebrow">The edit</p><h2>Good tools, less noise.</h2></div><Link to="/shop">View all products -&gt;</Link></div><div className="product-grid">{products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}</div></section><section className="statement"><p className="eyebrow">Our point of view</p><h2>Useful can be beautiful.<br />Simple can be powerful.</h2></section></main>
}

// Filter the product catalog without leaving the current route.
function Shop() {
  const { products, loading, error } = useProducts()
  const [filter, setFilter] = useState('All')
  if (loading || error) return <ProductStatus loading={loading} error={error} />
  const categories = ['All', ...new Set(products.map((product) => product.type))]
  const visibleProducts = filter === 'All' ? products : products.filter((product) => product.type === filter)
  return <main className="page"><div className="page-heading"><p className="eyebrow">Browse the collection</p><h1>Tools for the<br /><em>work in progress.</em></h1></div><div className="filter-row" aria-label="Filter products">{categories.map((category) => <button className={filter === category ? 'filter active' : 'filter'} type="button" key={category} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></main>
}

// Show one catalog item and its available download features.
function ProductDetails() {
  const { id } = useParams()
  const { products, loading, error } = useProducts()
  const product = products.find((item) => item.id === Number(id))
  const { addToCart } = useCart()
  if (loading || error) return <ProductStatus loading={loading} error={error} />
  if (!product) return <main className="empty-state"><h1>Product not found.</h1><Link to="/shop">Return to shop</Link></main>
  return <main className="detail-page"><Link className="back-link" to="/shop">&lt;- Back to shop</Link><div className="detail-layout"><div className={`detail-art product-art ${product.tone}`}><span>{product.type}</span><strong>{product.name}</strong><i>SS / {String(product.id).padStart(2, '0')}</i></div><div className="detail-copy"><p className="eyebrow">{product.type}</p><h1>{product.name}</h1><p className="detail-description">{product.description}</p><div className="detail-price">${product.price}</div><button className="primary-button" type="button" onClick={() => addToCart(product)}>Add to bag <span>-&gt;</span></button><h3>Inside the download</h3><ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div></div></main>
}

// Explain the purpose and design values behind the storefront.
function About() {
  return <main className="page narrow-page"><p className="eyebrow">Our approach</p><h1>Small tools for<br /><em>meaningful work.</em></h1><p className="lead">Soft Signal started with a simple belief: the tools around your work should help you think more clearly, not ask for more of your attention.</p><div className="about-columns"><div><h3>Designed with intention</h3><p>Every product begins as a question: what would make this particular moment easier? We remove the extra until only the useful remains.</p></div><div><h3>Made for real life</h3><p>Our downloads are flexible enough for a changing week and structured enough to help you take the next step.</p></div></div></main>
}

// Validate a contact request and provide immediate submission feedback.
function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Validate and persist the contact form before showing success feedback.
  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(false)
    setError('')
    const form = event.currentTarget
    const formData = new FormData(form)
    const message = Object.fromEntries(formData.entries())

    if (!supabase) {
      setError('Supabase is not configured. Add the environment variables before submitting.')
      return
    }

    const { error: insertError } = await supabase.from('contact_messages').insert(message)
    if (insertError) setError(insertError.message)
    else {
      setSubmitted(true)
      form.reset()
    }
  }

  return <main className="page contact-page"><div className="contact-intro"><p className="eyebrow">Say hello</p><h1>Have a question<br /><em>or an idea?</em></h1><p>We would love to hear what you are working on.</p></div><form className="contact-form" onSubmit={handleSubmit}><label>Name<input required name="name" placeholder="Your name" /></label><label>Email<input required type="email" name="email" placeholder="you@example.com" /></label><label>Message<textarea required name="message" rows="5" placeholder="Tell us a little more..."></textarea></label><button className="primary-button" type="submit">{submitted ? 'Message sent' : 'Send message'} <span>-&gt;</span></button>{submitted && <p className="success-message">Thanks. We will be in touch soon.</p>}{error && <p className="error-message">{error}</p>}</form></main>
}

// Display cart contents and calculate the current order summary.
function Cart() {
  const { cart, updateQuantity, totalPrice } = useCart()
  const navigate = useNavigate()
  if (cart.length === 0) return <main className="empty-state"><p className="eyebrow">Your bag</p><h1>Nothing here<br /><em>yet.</em></h1><p>Find a useful tool for your next idea.</p><Link className="primary-button" to="/shop">Browse products <span>-&gt;</span></Link></main>
  return <main className="page cart-page"><p className="eyebrow">Your bag</p><h1>Ready when<br /><em>you are.</em></h1><div className="cart-layout"><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><div className={`mini-art ${item.tone}`}>{item.name.slice(0, 1)}</div><div className="cart-item-name"><h3>{item.name}</h3><p>{item.type}</p></div><div className="quantity"><button type="button" aria-label={`Remove one ${item.name}`} onClick={() => updateQuantity(item.id, -1)}>-</button><span>{item.quantity}</span><button type="button" aria-label={`Add one ${item.name}`} onClick={() => updateQuantity(item.id, 1)}>+</button></div><strong>${item.price * item.quantity}</strong></div>)}</div><aside className="summary"><p className="eyebrow">Summary</p><div><span>Subtotal</span><strong>${totalPrice}</strong></div><div><span>Delivery</span><strong>Free</strong></div><hr /><div className="summary-total"><span>Total</span><strong>${totalPrice}</strong></div><button className="primary-button" type="button" onClick={() => navigate('/contact')}>Continue to checkout <span>-&gt;</span></button></aside></div></main>
}

// Define the complete client-side route map for the application.
function App() {
  return <BrowserRouter><ProductProvider><CartProvider><Header /><Routes><Route path="/" element={<Home />} /><Route path="/shop" element={<Shop />} /><Route path="/products/:id" element={<ProductDetails />} /><Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} /><Route path="/cart" element={<Cart />} /></Routes><footer><span>Soft Signal / 2026</span><span>Digital goods for thoughtful work</span></footer></CartProvider></ProductProvider></BrowserRouter>
}

export default App
