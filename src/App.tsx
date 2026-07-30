import { useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import { useProducts } from './hooks/useProducts';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';
import { AboutSection } from './components/AboutSection';
import { LocationContact } from './components/LocationContact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export default function App() {
  const { products, updateProducts, resetToDefault } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dynamically update SEO metadata based on current category "page"
  useEffect(() => {
    let title = 'عطور بيت العرب - عطور شرقية وعود أصلي الدار البيضاء';
    let desc = 'تأسس بيت العرب عام 1984 في حي الحبوس بالدار البيضاء. نقدم عطور شرقية، عود، وبخور أصلية 100%. اكتشف دفء الأصالة المغربية للبيع بالتجزئة والجملة.';

    if (selectedCategory === 'perfumes' || selectedCategory === 'oils') {
      title = 'زيوت عود أصلية 100% - شراء العود الأصلي في المغرب';
      desc = 'اكتشف مجموعتنا الفاخرة من زيوت العود الأصلية. نضمن لك ثبات الرائحة والجودة العالية من عطور بيت العرب، وجهتك الموثوقة في الدار البيضاء منذ 1984.';
    } else if (selectedCategory === 'wholesale') {
      title = 'موردي زيوت العطور والعود بالجملة المغرب - بيت العرب';
      desc = 'كن شريكاً لعلامة تجارية عريقة بخبرة 40 عاماً. نوفر العطور الشرقية، البخور، والزيوت الطبيعية بالجملة للشركات مع ضمان الجودة العالية والأصالة.';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
  }, [selectedCategory]);

  // Save changes to storage whenever products update
  const handleSaveProducts = (updatedProducts: Product[]) => {
    updateProducts(updatedProducts);
  };

  const handleResetProducts = () => {
    resetToDefault();
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        // Remove if already in cart or toggle
        return prev.filter((item) => item.product.id !== product.id);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1A1A] font-['Tajawal',sans-serif]">
      {/* Navigation Bar */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onExploreClick={scrollToCatalog} />

        {/* Product Catalog Grid */}
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
          cartItems={cartItems}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* About Section */}
        <AboutSection />

        {/* Map & Location / Contact Section */}
        <LocationContact />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Floating Action Button */}
      <FloatingWhatsApp />

      {/* Quick View Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isInCart={quickViewProduct ? cartItems.some((i) => i.product.id === quickViewProduct.id) : false}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onSaveProducts={handleSaveProducts}
        onResetProducts={handleResetProducts}
      />
    </div>
  );
}
