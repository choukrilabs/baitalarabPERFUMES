import { useState, useEffect, useCallback } from 'react';
import { Product, CartItem, CategoryType } from './types';
import { useProducts } from './hooks/useProducts';
import { usePromoBanner } from './hooks/usePromoBanner';
import { Header } from './components/Header';
import { PromoBanner } from './components/PromoBanner';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ProductPage } from './components/ProductPage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminPanel } from './components/AdminPanel';
import { AboutSection } from './components/AboutSection';
import { LocationContact } from './components/LocationContact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { categorySEO, updateMetaTags, defaultSEO } from './utils/seo';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function StoreApp() {
  const { products, addProduct, editProduct, deleteProduct, resetToDefault } = useProducts();
  const { promoBanner, updatePromoBanner } = usePromoBanner();
  const { toast } = useToast();
  const { dir, language, t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  
  // Modals and Drawers
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Helper to extract product ID from current URL
  const getProductIdFromURL = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const queryId = params.get('product');
    if (queryId) return queryId;

    // Check pathname like /product/xyz
    const pathMatch = window.location.pathname.match(/\/product\/([^/?#]+)/);
    if (pathMatch && pathMatch[1]) return pathMatch[1];

    // Check hash like #product=xyz
    const hashMatch = window.location.hash.match(/#product=([^/?#&]+)/);
    if (hashMatch && hashMatch[1]) return hashMatch[1];

    return null;
  }, []);

  // Sync URL on initial load and when products are loaded/updated
  useEffect(() => {
    if (products.length === 0) return;
    
    const productId = getProductIdFromURL();
    if (productId) {
      const p = products.find((prod) => prod.id === productId);
      if (p) {
        setActiveProduct(p);
      }
    } else {
      setActiveProduct(null);
    }
  }, [products, getProductIdFromURL]);

  // Listen to browser Back and Forward history buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const productId = getProductIdFromURL();
      if (productId && products.length > 0) {
        const p = products.find((prod) => prod.id === productId);
        setActiveProduct(p || null);
      } else {
        setActiveProduct(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products, getProductIdFromURL]);

  // Dynamically update SEO metadata and page title based on current view
  useEffect(() => {
    if (activeProduct) {
      updateMetaTags(
        `${activeProduct.name} - عطور بيت العرب الدار البيضاء`,
        activeProduct.description || activeProduct.name,
        activeProduct
      );
    } else {
      const seoInfo = categorySEO[selectedCategory] || defaultSEO;
      updateMetaTags(seoInfo.title, seoInfo.description);
    }
  }, [selectedCategory, activeProduct]);

  const handleResetProducts = () => {
    resetToDefault();
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prev, { product, quantity }];
      }
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

  const handleReorder = (items: { product: Product; quantity: number }[]) => {
    setCartItems((prev) => {
      const newItems = [...prev];
      items.forEach((reorderItem) => {
        const idx = newItems.findIndex((i) => i.product.id === reorderItem.product.id);
        if (idx > -1) {
          newItems[idx].quantity += reorderItem.quantity;
        } else {
          newItems.push({ product: reorderItem.product, quantity: reorderItem.quantity });
        }
      });
      return newItems;
    });
    setIsCartOpen(true);
  };

  const scrollToCatalog = () => {
    if (activeProduct) {
      setActiveProduct(null);
      window.history.pushState({}, '', '/');
    }
    setTimeout(() => {
      const el = document.getElementById('catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Navigate to dedicated product page
  const handleNavigateToProduct = (product: Product) => {
    setActiveProduct(product);
    window.history.pushState({ productId: product.id }, '', `/?product=${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to home page catalog
  const handleBackToHome = () => {
    setActiveProduct(null);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromProduct = (category: CategoryType | 'all') => {
    setSelectedCategory(category);
    setActiveProduct(null);
    window.history.pushState({}, '', '/');
    setTimeout(() => {
      const el = document.getElementById('catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div
      dir={dir}
      className={`min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1A1A] ${
        language === 'ar' ? "font-['Tajawal',sans-serif]" : "font-sans"
      }`}
    >
      {/* Navigation Bar */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (activeProduct) {
            handleBackToHome();
          }
        }}
        onNavigateHome={handleBackToHome}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Floating Promotional Banner for Perfume Collection Offers */}
      {!activeProduct && (
        <PromoBanner
          config={promoBanner}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            scrollToCatalog();
          }}
          onExplore={scrollToCatalog}
        />
      )}

      {/* Main Content Sections: Product Page OR Home Catalog */}
      <main className="flex-1">
        {activeProduct ? (
          /* Dedicated Product Page for Each Product */
          <ProductPage
            product={activeProduct}
            allProducts={products}
            onNavigateToProduct={handleNavigateToProduct}
            onBackToHome={handleBackToHome}
            onAddToCart={handleAddToCart}
            onSelectCategory={handleSelectCategoryFromProduct}
            cartItems={cartItems}
          />
        ) : (
          /* Store Homepage Sections */
          <>
            {/* Hero Section */}
            <Hero onExploreClick={scrollToCatalog} products={products} />

            {/* Product Catalog Grid */}
            <ProductGrid
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onQuickView={handleNavigateToProduct}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              cartItems={cartItems}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* About Section */}
            <AboutSection products={products} />

            {/* Map & Location / Contact Section */}
            <LocationContact />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (activeProduct) {
            handleBackToHome();
          }
        }}
        onNavigateHome={handleBackToHome}
      />

      {/* Floating Action Button */}
      <FloatingWhatsApp />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={products}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onQuickView={(p) => {
          setIsWishlistOpen(false);
          handleNavigateToProduct(p);
        }}
        cartItems={cartItems}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onNavigateToProduct={handleNavigateToProduct}
        onOpenAuth={() => {
          setIsCartOpen(false);
          setIsAuthOpen(true);
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => setIsProfileOpen(true)}
      />

      {/* User Profile & Saved Addresses Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onReorder={handleReorder}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={addProduct}
        onEditProduct={editProduct}
        onDeleteProduct={deleteProduct}
        onResetProducts={handleResetProducts}
        promoBanner={promoBanner}
        onUpdatePromoBanner={updatePromoBanner}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <StoreApp />
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
