import React, { useState, useEffect } from 'react';
import { Product, CategoryType, PromoBannerConfig, PromoBannerTheme, DEFAULT_PROMO_BANNER } from '../types';
import { getAdminPassword } from '../services/storage';
import { generateProductDescription } from '../services/aiHelper';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw,
  Wand2,
  ImagePlus,
  Layers,
  CheckCircle2,
  XCircle,
  Camera,
  ChevronDown,
  ChevronUp,
  Megaphone,
  Tag,
  Flame,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Save,
  Sliders,
  Palette,
  Clock,
  Languages,
} from 'lucide-react';

import { compressImage } from '../utils/imageUtils';
import { ProductImage } from './ProductImage';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetProducts: () => void;
  promoBanner: PromoBannerConfig;
  onUpdatePromoBanner: (config: PromoBannerConfig) => Promise<boolean> | void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onResetProducts,
  promoBanner,
  onUpdatePromoBanner,
}) => {
  const { isFrench, language, toggleLanguage } = useLanguage();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Admin Navigation Tabs
  const [adminTab, setAdminTab] = useState<'products' | 'banner'>('products');

  // Promo Banner Configuration State
  const [bannerEnabled, setBannerEnabled] = useState<boolean>(promoBanner?.enabled ?? true);
  const [bannerBadgeText, setBannerBadgeText] = useState<string>(
    promoBanner?.badgeText || (isFrench ? '✨ Offre exclusive limitée' : '✨ عرض حصري لفترة محدودة')
  );
  const [bannerHeadline, setBannerHeadline] = useState<string>(
    promoBanner?.headline ||
      (isFrench
        ? 'Jusqu’à 30% de réduction sur les collections royales de parfums et Dehn Al Oud !'
        : 'تخفيضات خاصة تصل إلى 30% على أرقى تشكيلات العطور الشرقية ودهن العود الملكي!')
  );
  const [bannerSubtext, setBannerSubtext] = useState<string>(
    promoBanner?.subtext ||
      (isFrench
        ? 'Livraison rapide partout au Maroc avec paiement sécurisé à la livraison.'
        : 'استفد من تخفيض فوري وتوصيل سريع مع إمكانية الدفع عند الاستلام لجميع مدن المغرب.')
  );
  const [bannerCtaText, setBannerCtaText] = useState<string>(
    promoBanner?.ctaText || (isFrench ? 'Découvrir les offres' : 'تسوق العروض الآن')
  );
  const [bannerCtaCategory, setBannerCtaCategory] = useState<CategoryType | 'all'>(
    promoBanner?.ctaCategory || 'perfumes'
  );
  const [bannerTheme, setBannerTheme] = useState<PromoBannerTheme>(promoBanner?.theme || 'gold_dark');
  const [bannerCountdownText, setBannerCountdownText] = useState<string>(
    promoBanner?.countdownText || (isFrench ? 'Offre bientôt terminée' : 'ينتهي العرض قريباً')
  );
  const [bannerClosable, setBannerClosable] = useState<boolean>(promoBanner?.closable ?? true);
  const [isSavingBanner, setIsSavingBanner] = useState<boolean>(false);

  // Sync state if promoBanner prop updates
  useEffect(() => {
    if (promoBanner) {
      setBannerEnabled(promoBanner.enabled);
      setBannerBadgeText(promoBanner.badgeText || '');
      setBannerHeadline(promoBanner.headline || '');
      setBannerSubtext(promoBanner.subtext || '');
      setBannerCtaText(promoBanner.ctaText || (isFrench ? 'Acheter maintenant' : 'تسوق الآن'));
      setBannerCtaCategory(promoBanner.ctaCategory || 'perfumes');
      setBannerTheme(promoBanner.theme || 'gold_dark');
      setBannerCountdownText(promoBanner.countdownText || '');
      setBannerClosable(promoBanner.closable ?? true);
    }
  }, [promoBanner, isFrench]);

  // Form for New Product
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('perfumes');
  const [newPrice, setNewPrice] = useState<string>('');
  const [newOriginalPrice, setNewOriginalPrice] = useState<string>('');
  const [newVolume, setNewVolume] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newAdditionalImages, setNewAdditionalImages] = useState<string[]>([]);
  const [newAdditionalUrlInput, setNewAdditionalUrlInput] = useState('');
  const [newGender, setNewGender] = useState<'unisex' | 'men' | 'women'>('unisex');
  const [newProductType, setNewProductType] = useState('Eau de Parfum');
  const [newInStock, setNewInStock] = useState<boolean>(true);
  const [newNotes, setNewNotes] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Expanded editor for product angles
  const [expandedAnglesProductId, setExpandedAnglesProductId] = useState<string | null>(null);
  const [editAdditionalUrlInput, setEditAdditionalUrlInput] = useState<{ [id: string]: string }>({});

  const handleSaveBanner = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingBanner(true);
    const updatedConfig: PromoBannerConfig = {
      enabled: bannerEnabled,
      badgeText: bannerBadgeText.trim() || (isFrench ? '✨ Offre spéciale' : '✨ عرض خاص'),
      headline:
        bannerHeadline.trim() ||
        (isFrench
          ? 'Remises exclusives sur nos collections de parfums précieux'
          : 'تخفيضات مميزة على تشكيلات العطور الفاخرة'),
      subtext: bannerSubtext.trim() || undefined,
      ctaText: bannerCtaText.trim() || (isFrench ? 'Acheter maintenant' : 'تسوق الآن'),
      ctaCategory: bannerCtaCategory,
      theme: bannerTheme,
      countdownText: bannerCountdownText.trim() || undefined,
      closable: bannerClosable,
    };

    try {
      await onUpdatePromoBanner(updatedConfig);
      setActionMessage(
        isFrench
          ? 'Bannière promotionnelle enregistrée et publiée avec succès !'
          : 'تم حفظ وتحديث الشريط الترويجي بنجاح!'
      );
    } catch (err) {
      console.error('Error saving promo banner:', err);
      setActionMessage(
        isFrench
          ? "Une erreur est survenue lors de l'enregistrement de la bannière"
          : 'حدث خطأ أثناء حفظ الشريط الترويجي'
      );
    } finally {
      setIsSavingBanner(false);
      setTimeout(() => setActionMessage(''), 3500);
    }
  };

  const applyBannerPreset = (preset: {
    badgeText: string;
    headline: string;
    subtext: string;
    ctaText: string;
    ctaCategory: CategoryType | 'all';
    theme: PromoBannerTheme;
    countdownText: string;
  }) => {
    setBannerBadgeText(preset.badgeText);
    setBannerHeadline(preset.headline);
    setBannerSubtext(preset.subtext);
    setBannerCtaText(preset.ctaText);
    setBannerCtaCategory(preset.ctaCategory);
    setBannerTheme(preset.theme);
    setBannerCountdownText(preset.countdownText);
    setActionMessage(
      isFrench
        ? 'Modèle chargé ! Cliquez sur "Enregistrer et publier les modifications" pour l\'appliquer.'
        : 'تم تحميل النموذج! اضغط "حفظ ونشر التعديلات" لتطبيقه على المتجر.'
    );
    setTimeout(() => setActionMessage(''), 3500);
  };

  const handleResetBannerToDefault = () => {
    setBannerEnabled(DEFAULT_PROMO_BANNER.enabled);
    setBannerBadgeText(DEFAULT_PROMO_BANNER.badgeText);
    setBannerHeadline(DEFAULT_PROMO_BANNER.headline);
    setBannerSubtext(DEFAULT_PROMO_BANNER.subtext || '');
    setBannerCtaText(DEFAULT_PROMO_BANNER.ctaText);
    setBannerCtaCategory(DEFAULT_PROMO_BANNER.ctaCategory || 'perfumes');
    setBannerTheme(DEFAULT_PROMO_BANNER.theme || 'gold_dark');
    setBannerCountdownText(DEFAULT_PROMO_BANNER.countdownText || '');
    setBannerClosable(DEFAULT_PROMO_BANNER.closable ?? true);
    setActionMessage(
      isFrench
        ? 'Paramètres par défaut de la bannière rétablis'
        : 'تمت استعادة الإعدادات الافتراضية للشريط الترويجي'
    );
    setTimeout(() => setActionMessage(''), 3000);
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = getAdminPassword();
    if (!correctPassword) {
      setPinError(
        isFrench
          ? "Le mot de passe administrateur n'est pas configuré. Veuillez l'ajouter dans les paramètres."
          : 'لم يتم إعداد كلمة المرور للمسؤول. يرجى إضافتها في الإعدادات.'
      );
      return;
    }

    if (pinInput === correctPassword) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError(isFrench ? 'Mot de passe incorrect.' : 'كلمة المرور غير صحيحة.');
    }
  };

  const handleAddAdditionalImage = () => {
    if (!newAdditionalUrlInput.trim()) return;
    setNewAdditionalImages([...newAdditionalImages, newAdditionalUrlInput.trim()]);
    setNewAdditionalUrlInput('');
  };

  const handleRemoveAdditionalImage = (indexToRemove: number) => {
    setNewAdditionalImages(newAdditionalImages.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 800, 800, 0.75);
        setNewAdditionalImages((prev) => [...prev, compressedBase64]);
      } catch (err) {
        console.error('Failed to compress image', err);
        setActionMessage(
          isFrench
            ? "Échec du traitement de l'image, veuillez essayer avec une autre image."
            : 'فشل في معالجة الصورة، يرجى المحاولة بصورة أخرى.'
        );
      }
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) {
      setActionMessage(
        isFrench
          ? 'Veuillez remplir tous les champs obligatoires'
          : 'الرجاء تعبئة جميع الحقول الأساسية'
      );
      return;
    }
    if (!newImage) {
      setActionMessage(
        isFrench
          ? 'Veuillez ajouter une image principale pour le produit'
          : 'الرجاء إضافة صورة رئيسية للمنتج'
      );
      return;
    }

    const priceNum = parseFloat(newPrice);
    const origPriceNum = newOriginalPrice ? parseFloat(newOriginalPrice) : undefined;
    const notesArray = newNotes
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);

    // Combine primary and additional images
    const allImages = Array.from(new Set([newImage.trim(), ...newAdditionalImages])).filter(Boolean);

    const newProd: Product = {
      id: 'prod_' + Date.now(),
      name: newName.trim(),
      category: newCategory,
      price: priceNum,
      description:
        newDescription.trim() ||
        (isFrench
          ? 'Création parfumée haut de gamme par Parfumerie Bait Al Arab, Quartier Habous, Casablanca.'
          : 'منتج عالي الجودة من عطور بيت العرب، حي الحبوس، الدار البيضاء.'),
      image: newImage.trim(),
      images: allImages,
      inStock: newInStock,
      gender: newGender,
      productType: newProductType.trim() || undefined,
      active: true,
    };

    if (origPriceNum !== undefined) newProd.originalPrice = origPriceNum;
    if (newVolume.trim()) newProd.volume = newVolume.trim();
    if (notesArray.length > 0) newProd.notes = notesArray;

    onAddProduct(newProd);

    // Reset Form
    setNewName('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewVolume('');
    setNewDescription('');
    setNewImage('');
    setNewAdditionalImages([]);
    setNewAdditionalUrlInput('');
    setNewGender('unisex');
    setNewProductType(isFrench ? 'Eau de Parfum' : 'ماء عطر فاخر (Eau de Parfum)');
    setNewInStock(true);
    setNewNotes('');
    setActionMessage(
      isFrench
        ? 'Produit ajouté avec succès avec photos multiples !'
        : 'تمت إضافة المنتج بنجاح مع الصور المتعددة!'
    );
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleToggleActive = (id: string) => {
    const productToUpdate = products.find((p) => p.id === id);
    if (productToUpdate) {
      onEditProduct({ ...productToUpdate, active: !productToUpdate.active });
    }
  };

  const handleToggleStock = (id: string) => {
    const productToUpdate = products.find((p) => p.id === id);
    if (productToUpdate) {
      const currentStatus = productToUpdate.inStock !== false; // default true
      onEditProduct({ ...productToUpdate, inStock: !currentStatus });
    }
  };

  const handleUpdateField = (id: string, field: keyof Product, value: any) => {
    const productToUpdate = products.find((p) => p.id === id);
    if (productToUpdate) {
      onEditProduct({ ...productToUpdate, [field]: value });
    }
  };

  // Multiple angle images management for existing product
  const handleAddAngleToProduct = (productId: string) => {
    const inputUrl = editAdditionalUrlInput[productId];
    if (!inputUrl || !inputUrl.trim()) return;

    const productToUpdate = products.find((p) => p.id === productId);
    if (productToUpdate) {
      const existing = productToUpdate.images || (productToUpdate.image ? [productToUpdate.image] : []);
      const updated = Array.from(new Set([...existing, inputUrl.trim()]));
      onEditProduct({ ...productToUpdate, images: updated });
      setEditAdditionalUrlInput({ ...editAdditionalUrlInput, [productId]: '' });
    }
  };

  const handleUploadAngleToProduct = async (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 800, 800, 0.75);
        const productToUpdate = products.find((p) => p.id === productId);
        if (productToUpdate) {
          const existing = productToUpdate.images || (productToUpdate.image ? [productToUpdate.image] : []);
          const updated = Array.from(new Set([...existing, compressedBase64]));
          onEditProduct({ ...productToUpdate, images: updated });
        }
      } catch (err) {
        console.error('Failed to compress angle image', err);
        setActionMessage(
          isFrench
            ? "Échec du traitement de l'image, veuillez essayer avec une autre photo."
            : 'فشل في معالجة الصورة، يرجى المحاولة بصورة أخرى.'
        );
      }
    }
  };

  const handleRemoveAngleFromProduct = (productId: string, imageToRemove: string) => {
    const productToUpdate = products.find((p) => p.id === productId);
    if (productToUpdate) {
      const existing = productToUpdate.images || [productToUpdate.image];
      const updated = existing.filter((img) => img !== imageToRemove);
      // Ensure at least one image remains
      const newPrimary =
        imageToRemove === productToUpdate.image ? updated[0] || productToUpdate.image : productToUpdate.image;
      onEditProduct({ ...productToUpdate, image: newPrimary, images: updated });
    }
  };

  const handleSetAngleAsPrimary = (productId: string, newPrimaryImage: string) => {
    const productToUpdate = products.find((p) => p.id === productId);
    if (productToUpdate) {
      const existing = productToUpdate.images || [productToUpdate.image];
      const reordered = [newPrimaryImage, ...existing.filter((img) => img !== newPrimaryImage)];
      onEditProduct({ ...productToUpdate, image: newPrimaryImage, images: reordered });
    }
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteProduct(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleGenerateAIDesc = async () => {
    if (!newName.trim()) {
      setActionMessage(
        isFrench
          ? "Veuillez d'abord saisir le nom du produit pour générer la description."
          : 'يرجى إدخال اسم المنتج أولاً لتوليد الوصف.'
      );
      return;
    }
    setIsGeneratingAI(true);
    const catName = isFrench
      ? newCategory === 'perfumes'
        ? 'Parfums & Oud'
        : newCategory === 'incense'
        ? 'Encens & Bakhoor'
        : newCategory === 'clothes'
        ? 'Vêtements traditionnels'
        : newCategory === 'oils'
        ? 'Huiles pures & Dehn Al Oud'
        : 'Autre'
      : newCategory === 'perfumes'
      ? 'عطر/عود'
      : newCategory === 'incense'
      ? 'بخور'
      : newCategory === 'clothes'
      ? 'ملابس'
      : newCategory === 'oils'
      ? 'زيوت طبيعية'
      : 'أخرى';

    const generated = await generateProductDescription(newName, catName, newNotes, isFrench);
    setNewDescription(generated);
    setIsGeneratingAI(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 800, 800, 0.75);
        setNewImage(compressedBase64);
      } catch (err) {
        console.error('Failed to compress image', err);
        setActionMessage(
          isFrench
            ? "Échec du traitement de l'image, veuillez essayer avec une autre image."
            : 'فشل في معالجة الصورة، يرجى المحاولة مرة أخرى بصورة أخرى.'
        );
      }
    }
  };

  const handleEditImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 800, 800, 0.75);
        const productToUpdate = products.find((p) => p.id === id);
        if (productToUpdate) {
          const existingImages = productToUpdate.images || [productToUpdate.image];
          const updatedImages = [
            compressedBase64,
            ...existingImages.filter((img) => img !== productToUpdate.image),
          ];
          onEditProduct({ ...productToUpdate, image: compressedBase64, images: updatedImages });
        } else {
          handleUpdateField(id, 'image', compressedBase64);
        }
      } catch (err) {
        console.error('Failed to compress image', err);
        setActionMessage(
          isFrench
            ? "Échec du traitement de l'image, veuillez essayer avec une autre image."
            : 'فشل في معالجة الصورة، يرجى المحاولة مرة أخرى بصورة أخرى.'
        );
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 animate-fadeIn"
      dir={isFrench ? 'ltr' : 'rtl'}
    >
      <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl border border-[#E5D7BF] my-6">
        {/* Modal Top Banner */}
        <div className="bg-[#1A1A1A] text-[#FAF9F6] p-5 flex items-center justify-between border-b border-[#8C7342]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gold-gradient p-0.5 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#1A1A1A] rounded-full flex items-center justify-center text-[#8C7342]">
                <Lock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white">
                {isFrench
                  ? "Panneau d'administration (Produits, Stock & Multi-angles)"
                  : 'لوحة تحكم المتجر (المنتجات، المخزون، والزوايا المتعددة)'}
              </h2>
              <p className="text-xs text-[#8C7342]">
                {isFrench
                  ? 'Parfumerie Bait Al Arab • Quartier Habous, Casablanca'
                  : 'عطور بيت العرب • حي الحبوس، الدار البيضاء'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Admin Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-amber-200 font-bold border border-white/10 transition-colors"
              title={isFrench ? 'Passer en arabe' : 'Changer en français'}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isFrench ? 'العربية' : 'FR'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#2A2A2A] text-gray-300 hover:text-white transition-colors"
              aria-label={isFrench ? 'Fermer' : 'إغلاق'}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PIN Auth Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 bg-gray-100 text-[#8C7342] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-[#1A1A1A]">
                {isFrench ? 'Entrez le mot de passe administrateur' : 'أدخل كلمة المرور'}
              </h3>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder={isFrench ? 'Mot de passe' : 'كلمة المرور'}
                  className="w-full text-center text-xl font-bold tracking-widest bg-[#F5F5F5] border-2 border-gray-200 focus:border-[#8C7342] rounded-2xl py-3 text-[#1A1A1A] focus:outline-none"
                  autoFocus
                />
              </div>

              {pinError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  {pinError}
                </p>
              )}

              <button
                type="submit"
                className="w-full gold-gradient text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:scale-[1.02] transition-transform"
              >
                {isFrench ? "Connexion au panneau d'administration" : 'دخول إلى لوحة التحكم'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Panel */
          <div className="p-6 sm:p-8 space-y-6 bg-[#FAF9F6] max-h-[82vh] overflow-y-auto">
            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5D7BF] pb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdminTab('products')}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                    adminTab === 'products'
                      ? 'bg-[#1A1A1A] text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#E5D7BF]'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#C1841A]" />
                  <span>
                    {isFrench
                      ? `Gestion des Produits & Stock (${products.length})`
                      : `إدارة المنتجات والمخزون (${products.length})`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab('banner')}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                    adminTab === 'banner'
                      ? 'bg-[#1A1A1A] text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#E5D7BF]'
                  }`}
                >
                  <Megaphone className="w-4 h-4 text-[#C1841A]" />
                  <span>{isFrench ? 'Bannière Promo & Offres' : 'الشريط الترويجي والعروض'}</span>
                  {bannerEnabled ? (
                    <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      {isFrench ? 'Actif' : 'مفعل'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-bold">
                      {isFrench ? 'Inactif' : 'معطل'}
                    </span>
                  )}
                </button>
              </div>

              {adminTab === 'products' && (
                <button
                  onClick={() => setResetConfirm(true)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl font-bold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isFrench ? 'Réinitialiser aux valeurs par défaut' : 'استعادة الضبط الافتراضي'}</span>
                </button>
              )}
            </div>

            {/* TAB 1: PRODUCTS & INVENTORY */}
            {adminTab === 'products' && (
              <div className="space-y-8">
                {/* Action Bar Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5D7BF]">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#8F5D0F]">
                    <span>
                      {isFrench ? 'Total des produits : ' : 'إجمالي المنتجات: '} {products.length}
                    </span>
                    <span className="text-emerald-700">
                      {isFrench ? 'En stock : ' : 'متوفر بالمخزن: '}{' '}
                      {products.filter((p) => p.inStock !== false).length}
                    </span>
                    <span className="text-rose-600">
                      {isFrench ? 'Rupture de stock : ' : 'نافد من المخزن: '}{' '}
                      {products.filter((p) => p.inStock === false).length}
                    </span>
                  </div>
                </div>

                {/* Add New Product Box */}
                <div className="bg-white p-6 rounded-3xl border border-[#E5D7BF] shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-lg text-[#24160F] flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#C1841A]" />
                    <span>
                      {isFrench
                        ? 'Ajouter un nouveau produit (Photos & Angles multiples)'
                        : 'إضافة منتج جديد مع زوايا وصور متعددة'}
                    </span>
                  </h3>

                  <form
                    onSubmit={handleAddProduct}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {/* Product Name */}
                    <div className="lg:col-span-2">
                      <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                        {isFrench ? 'Nom du produit *' : 'اسم المنتج *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder={
                          isFrench
                            ? 'Ex: Eau de Parfum Royale - Flacon Cristal'
                            : 'مثال: عطر عود ملوكي فاخر - زجاجة كريستال'
                        }
                        className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                        {isFrench ? 'Catégorie *' : 'القسم *'}
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                        className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                      >
                        <option value="perfumes">
                          {isFrench ? 'Parfums & Fragrances' : 'العطور والروائح'}
                        </option>
                        <option value="incense">
                          {isFrench ? 'Encens & Oud' : 'البخور والعود'}
                        </option>
                        <option value="clothes">
                          {isFrench ? 'Vêtements & Prêt-à-Porter' : 'الملابس والأزياء'}
                        </option>
                        <option value="oils">
                          {isFrench ? 'Huiles Naturelles & Dehn Al Oud' : 'الزيوت الطبيعية'}
                        </option>
                        <option value="wholesale">
                          {isFrench ? 'Vente en gros' : 'البيع بالجملة'}
                        </option>
                        <option value="other">
                          {isFrench ? 'Autres produits' : 'منتجات أخرى'}
                        </option>
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                        {isFrench ? 'Prix actuel (DH) *' : 'السعر الحالي (درهم) *'}
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="1"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder={isFrench ? 'Ex: 350' : 'مثال: 350'}
                        className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                      />
                    </div>

                    {/* Original Price */}
                    <div>
                      <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                        {isFrench ? "Prix d'origine (Optionnel)" : 'السعر قبل التخفيض (اختياري)'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={newOriginalPrice}
                        onChange={(e) => setNewOriginalPrice(e.target.value)}
                        placeholder={isFrench ? 'Ex: 450' : 'مثال: 450'}
                        className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                      />
                    </div>

                    {/* Volume / Size */}
                    <div>
                      <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                        {isFrench ? 'Volume / Contenance' : 'الحجم أو السعة'}
                      </label>
                      <input
                        type="text"
                        value={newVolume}
                        onChange={(e) => setNewVolume(e.target.value)}
                        placeholder={
                          isFrench
                            ? 'Ex: 100 ml / 2 Tolats / Taille XL'
                            : 'مثال: 100 مل / تولتين / مقاس XL'
                        }
                        className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                        {isFrench ? 'Public cible / Genre' : 'الفئة والجنس المستهدف'}
                      </label>
                      <select
                        value={newGender}
                        onChange={(e) => setNewGender(e.target.value as any)}
                        className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                      >
                        <option value="unisex">{isFrench ? 'Mixte (Unisex)' : 'للجنسين (Unisex)'}</option>
                        <option value="men">{isFrench ? 'Homme (Men)' : 'رجالي (Men)'}</option>
                        <option value="women">{isFrench ? 'Femme (Women)' : 'نسائي (Women)'}</option>
                      </select>
                    </div>

                    {/* Product Type */}
                    <div>
                      <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                        {isFrench ? 'Type de produit' : 'نوع وشكل المنتج'}
                      </label>
                      <input
                        type="text"
                        value={newProductType}
                        onChange={(e) => setNewProductType(e.target.value)}
                        placeholder={
                          isFrench
                            ? 'Ex: Eau de Parfum de Luxe'
                            : 'مثال: ماء عطر فاخر (Eau de Parfum)'
                        }
                        className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                      />
                    </div>

                    {/* In Stock / Out of Stock Toggle */}
                    <div>
                      <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                        {isFrench ? 'Disponibilité du stock' : 'حالة توفر المخزون'}
                      </label>
                      <button
                        type="button"
                        onClick={() => setNewInStock(!newInStock)}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                          newInStock
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {newInStock ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{isFrench ? 'En stock (In Stock)' : 'متوفر بالمخزن (In Stock)'}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>
                              {isFrench
                                ? 'Rupture de stock (Out of Stock)'
                                : 'نفد من المخزن (Out of Stock)'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Primary Image Upload/URL */}
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                        {isFrench
                          ? 'Image principale de face (Flacon avant) *'
                          : 'الصورة الرئيسية للواجهة (الزجاجة الأمامية) *'}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          placeholder={
                            isFrench
                              ? "URL de l'image principale https://..."
                              : 'رابط الصورة الرئيسية https://...'
                          }
                          className="flex-1 bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                        />
                        <label className="cursor-pointer shrink-0 bg-[#F4EAD9] hover:bg-[#E5D7BF] border border-[#E5D7BF] rounded-xl px-4 py-2.5 text-xs font-bold text-[#8F5D0F] flex items-center justify-center transition-colors">
                          {isFrench ? 'Télécharger une photo' : 'رفع صورة'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Additional Images (Multiple angles) */}
                    <div className="md:col-span-2 lg:col-span-3 bg-[#FAF5EC] p-3.5 rounded-2xl border border-[#E5D7BF]/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#8F5D0F] flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-[#C1841A]" />
                          <span>
                            {isFrench
                              ? 'Angles et photos additionnelles (Flacon, Coffret, Détails)'
                              : 'زوايا وصور إضافية للزجاجة والعلبة (تفاصيل العطر)'}
                          </span>
                        </label>
                        <span className="text-[11px] text-gray-500">
                          {isFrench
                            ? `${newAdditionalImages.length} photos ajoutées`
                            : `${newAdditionalImages.length} صور مضافة`}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newAdditionalUrlInput}
                          onChange={(e) => setNewAdditionalUrlInput(e.target.value)}
                          placeholder={
                            isFrench
                              ? "Entrez l'URL d'un angle supplémentaire (bouchon, coffret...)"
                              : 'أدخل رابط زاوية إضافية (الغطاء، العلبة، الجانب...)'
                          }
                          className="flex-1 bg-white border border-[#E5D7BF] rounded-xl px-3 py-2 text-xs text-[#24160F]"
                        />
                        <button
                          type="button"
                          onClick={handleAddAdditionalImage}
                          className="bg-[#1A1A1A] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#8C7342]"
                        >
                          {isFrench ? 'Ajouter URL' : 'إضافة رابط'}
                        </button>
                        <label className="cursor-pointer shrink-0 bg-white hover:bg-gray-50 border border-[#E5D7BF] rounded-xl px-3 py-2 text-xs font-bold text-[#8F5D0F] flex items-center justify-center transition-colors">
                          <ImagePlus className={`w-3.5 h-3.5 ${isFrench ? 'mr-1' : 'ml-1'}`} />
                          <span>{isFrench ? 'Télécharger angle' : 'رفع زاوية'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAdditionalImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Previews of additional angles */}
                      {newAdditionalImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {newAdditionalImages.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative w-14 h-14 rounded-xl border border-gray-300 overflow-hidden group bg-white"
                            >
                              <ProductImage src={img} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveAdditionalImage(idx)}
                                className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                title={isFrench ? 'Supprimer cette photo' : 'حذف هذه الزاوية'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                        {isFrench
                          ? 'Notes et ingrédients olfactifs (séparés par des virgules)'
                          : 'المكونات والنوتات العطرية (مفصولة بفاصلة)'}
                      </label>
                      <input
                        type="text"
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        placeholder={
                          isFrench
                            ? 'Ex: Oud Sioufi, Ambre naturel, Musc blanc, Rose de Taëf'
                            : 'مثال: دهن عود سيوفي، عنبر طبيعي، مسك أبيض، زهور الطائف'
                        }
                        className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                      />
                    </div>

                    {/* Description + AI Generator */}
                    <div className="md:col-span-2 lg:col-span-3">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-[#8F5D0F]">
                          {isFrench
                            ? 'Description & caractéristiques du produit'
                            : 'وصف وميزات المنتج'}
                        </label>
                        <button
                          type="button"
                          onClick={handleGenerateAIDesc}
                          disabled={isGeneratingAI}
                          className="text-xs text-[#C1841A] font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>
                            {isGeneratingAI
                              ? isFrench
                                ? 'Génération en cours...'
                                : 'جارٍ توليد الوصف...'
                              : isFrench
                              ? "Générer la description avec l'IA"
                              : 'توليد وصف بالذكاء الاصطناعي'}
                          </span>
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder={
                          isFrench
                            ? 'Description raffinée des caractéristiques et arômes de ce produit...'
                            : 'وصف فاخر عن مميزات ورائحة هذا المنتج...'
                        }
                        className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl p-3 text-xs text-[#24160F]"
                      />
                    </div>

                    {/* Submit button */}
                    <div className="md:col-span-2 lg:col-span-3 pt-2">
                      <button
                        type="submit"
                        className="w-full gold-gradient text-white py-3 rounded-xl font-bold text-sm shadow-md hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          {isFrench
                            ? 'Ajouter le produit au catalogue'
                            : 'إضافة المنتج إلى كتالوج المتجر'}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing Products Management List */}
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-[#24160F] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#C1841A]" />
                      <span>
                        {isFrench
                          ? `Gérer et modifier les produits existants (${products.length})`
                          : `إدارة وتعديل المنتجات الحالية (${products.length})`}
                      </span>
                    </div>
                  </h3>

                  <div className="space-y-3">
                    {products.map((p) => {
                      const isStock = p.inStock !== false;
                      const isAnglesOpen = expandedAnglesProductId === p.id;
                      const productImages =
                        p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [];

                      return (
                        <div
                          key={p.id}
                          className={`bg-white rounded-2xl p-4 border transition-all ${
                            p.active
                              ? 'border-[#E5D7BF] shadow-sm'
                              : 'border-gray-200 bg-gray-50/70 opacity-80'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            {/* Product Thumbnail & Basic Info */}
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <label className="relative cursor-pointer group shrink-0">
                                <div className="w-14 h-14 shrink-0 overflow-hidden rounded-xl bg-[#F4EAD9]">
                                  <ProductImage
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                                  />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                    {isFrench ? 'Changer' : 'تغيير'}
                                  </span>
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleEditImageUpload(p.id, e)}
                                  className="hidden"
                                />
                              </label>

                              <div className="space-y-1 min-w-0 flex-1">
                                {/* Name Input */}
                                <input
                                  type="text"
                                  value={p.name}
                                  onChange={(e) => handleUpdateField(p.id, 'name', e.target.value)}
                                  className="font-bold text-sm text-[#24160F] bg-transparent border-b border-transparent hover:border-[#C1841A] focus:border-[#C1841A] focus:bg-[#FAF5EC] px-1 rounded transition-colors w-full"
                                />

                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                  {/* Category Selector */}
                                  <select
                                    value={p.category}
                                    onChange={(e) => handleUpdateField(p.id, 'category', e.target.value)}
                                    className="bg-[#FAF5EC] border border-[#E5D7BF] rounded-lg px-2 py-0.5 text-xs text-[#8F5D0F]"
                                  >
                                    <option value="perfumes">
                                      {isFrench ? 'Parfums' : 'العطور والروائح'}
                                    </option>
                                    <option value="incense">
                                      {isFrench ? 'Encens' : 'البخور والعود'}
                                    </option>
                                    <option value="clothes">
                                      {isFrench ? 'Vêtements' : 'الملابس'}
                                    </option>
                                    <option value="oils">
                                      {isFrench ? 'Huiles' : 'الزيوت الطبيعية'}
                                    </option>
                                    <option value="wholesale">
                                      {isFrench ? 'Vente en gros' : 'البيع بالجملة'}
                                    </option>
                                    <option value="other">
                                      {isFrench ? 'Autres' : 'منتجات أخرى'}
                                    </option>
                                  </select>

                                  {/* Gender Selector */}
                                  <select
                                    value={p.gender || 'unisex'}
                                    onChange={(e) => handleUpdateField(p.id, 'gender', e.target.value)}
                                    className="bg-[#FAF5EC] border border-[#E5D7BF] rounded-lg px-2 py-0.5 text-xs text-[#8F5D0F]"
                                  >
                                    <option value="unisex">{isFrench ? 'Mixte' : 'للجنسين'}</option>
                                    <option value="men">{isFrench ? 'Homme' : 'رجالي'}</option>
                                    <option value="women">{isFrench ? 'Femme' : 'نسائي'}</option>
                                  </select>

                                  {p.volume && (
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                                      {p.volume}
                                    </span>
                                  )}

                                  {/* Angle images counter button */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedAnglesProductId(isAnglesOpen ? null : p.id)
                                    }
                                    className="bg-[#8C7342]/10 hover:bg-[#8C7342]/20 text-[#8C7342] px-2 py-0.5 rounded-md font-bold flex items-center gap-1"
                                  >
                                    <Camera className="w-3 h-3" />
                                    <span>
                                      {isFrench
                                        ? `${productImages.length} angles`
                                        : `${productImages.length} زوايا`}
                                    </span>
                                    {isAnglesOpen ? (
                                      <ChevronUp className="w-3 h-3" />
                                    ) : (
                                      <ChevronDown className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Price, Stock Toggle & Controls */}
                            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
                              {/* Price Input */}
                              <div className="flex items-center gap-1">
                                <label className="text-xs text-[#8F5D0F] font-bold">
                                  {isFrench ? 'Prix :' : 'السعر:'}
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={p.price}
                                  onChange={(e) =>
                                    handleUpdateField(p.id, 'price', parseFloat(e.target.value) || 0)
                                  }
                                  className="w-20 bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-2 py-1 text-xs font-bold text-[#24160F] text-center"
                                />
                                <span className="text-xs text-gray-500">
                                  {isFrench ? 'DH' : 'درهم'}
                                </span>
                              </div>

                              {/* In Stock / Out of Stock Button */}
                              <button
                                type="button"
                                onClick={() => handleToggleStock(p.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                  isStock
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
                                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-200'
                                }`}
                                title={
                                  isStock
                                    ? isFrench
                                      ? 'Marquer comme rupture de stock'
                                      : 'انقر لتغيير الحالة إلى نفد من المخزن'
                                    : isFrench
                                    ? 'Marquer comme en stock'
                                    : 'انقر لتغيير الحالة إلى متوفر بالمخزن'
                                }
                              >
                                {isStock ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>{isFrench ? 'En stock' : 'متوفر بالمخزن'}</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 text-rose-700" />
                                    <span>{isFrench ? 'Rupture' : 'نفد من المخزن'}</span>
                                  </>
                                )}
                              </button>

                              {/* Visibility Toggle Button */}
                              <button
                                onClick={() => handleToggleActive(p.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                                  p.active
                                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                }`}
                                title={
                                  p.active
                                    ? isFrench
                                      ? 'Produit visible'
                                      : 'المنتج ظاهر للزوار'
                                    : isFrench
                                    ? 'Produit masqué'
                                    : 'المنتج مخفي عن الزوار'
                                }
                              >
                                {p.active ? (
                                  <>
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{isFrench ? 'Visible' : 'ظاهر'}</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5" />
                                    <span>{isFrench ? 'Masqué' : 'مخفي'}</span>
                                  </>
                                )}
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                title={isFrench ? 'Supprimer le produit' : 'حذف المنتج النهائي'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Angles Editor for Existing Product */}
                          {isAnglesOpen && (
                            <div className="mt-3 pt-3 border-t border-gray-100 bg-[#FAF5EC]/60 p-3 rounded-xl space-y-3 animate-fadeIn">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#8F5D0F] flex items-center gap-1">
                                  <Layers className="w-3.5 h-3.5" />
                                  <span>
                                    {isFrench
                                      ? 'Photos et angles disponibles pour ce produit :'
                                      : 'صور وزوايا العطر المتوفرة لهذا المنتج:'}
                                  </span>
                                </span>
                                <span className="text-[11px] text-gray-500">
                                  {isFrench
                                    ? '(Cliquez sur une photo pour la définir comme principale)'
                                    : '(اضغط على الزاوية لتعيينها كصورة رئيسية)'}
                                </span>
                              </div>

                              {/* Image Angle Thumbnails */}
                              <div className="flex flex-wrap gap-2">
                                {productImages.map((imgUrl, i) => (
                                  <div
                                    key={i}
                                    className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden bg-white group ${
                                      imgUrl === p.image
                                        ? 'border-[#C1841A] ring-2 ring-[#C1841A]/30'
                                        : 'border-gray-200'
                                    }`}
                                  >
                                    <ProductImage
                                      src={imgUrl}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                    {imgUrl === p.image && (
                                      <span className="absolute bottom-0 inset-x-0 bg-[#C1841A] text-white text-[8px] text-center font-bold">
                                        {isFrench ? 'Principale' : 'الرئيسية'}
                                      </span>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                                      {imgUrl !== p.image && (
                                        <button
                                          type="button"
                                          onClick={() => handleSetAngleAsPrimary(p.id, imgUrl)}
                                          className="p-1 bg-white text-gray-900 rounded text-[9px] font-bold"
                                          title={isFrench ? 'Définir comme principale' : 'تعيين كرئيسية'}
                                        >
                                          {isFrench ? 'Principale' : 'رئيسية'}
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveAngleFromProduct(p.id, imgUrl)}
                                        className="p-1 bg-red-600 text-white rounded"
                                        title={isFrench ? "Supprimer l'angle" : 'حذف الزاوية'}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Add New Angle to Product Form */}
                              <div className="flex gap-2 pt-1">
                                <input
                                  type="url"
                                  value={editAdditionalUrlInput[p.id] || ''}
                                  onChange={(e) =>
                                    setEditAdditionalUrlInput({
                                      ...editAdditionalUrlInput,
                                      [p.id]: e.target.value,
                                    })
                                  }
                                  placeholder={
                                    isFrench
                                      ? "Entrez l'URL d'une nouvelle photo d'angle..."
                                      : 'أدخل رابط صورة زاوية جديدة...'
                                  }
                                  className="flex-1 bg-white border border-[#E5D7BF] rounded-xl px-3 py-1.5 text-xs text-[#24160F]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddAngleToProduct(p.id)}
                                  className="bg-[#1A1A1A] hover:bg-[#8C7342] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                                >
                                  {isFrench ? 'Ajouter URL' : 'إضافة رابط'}
                                </button>
                                <label className="cursor-pointer shrink-0 bg-white hover:bg-gray-50 border border-[#E5D7BF] rounded-xl px-3 py-1.5 text-xs font-bold text-[#8F5D0F] flex items-center justify-center transition-colors">
                                  <Camera className={`w-3 h-3 ${isFrench ? 'mr-1' : 'ml-1'}`} />
                                  <span>{isFrench ? 'Télécharger angle' : 'رفع زاوية'}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleUploadAngleToProduct(p.id, e)}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROMOTIONAL BANNER & OFFERS MANAGEMENT */}
            {adminTab === 'banner' && (
              <div className="space-y-6">
                {/* Header & Status Card */}
                <div className="bg-white p-6 rounded-3xl border border-[#E5D7BF] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C1841A] to-[#8C7342] text-white flex items-center justify-center shadow-md shrink-0">
                      <Megaphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#24160F] flex items-center gap-2">
                        <span>
                          {isFrench
                            ? 'Gestion de la bannière promotionnelle & Offres spéciales'
                            : 'إدارة الشريط الترويجي والعروض الخاصة'}
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {isFrench
                          ? 'Activez ou désactivez la bannière en haut de la boutique et personnalisez les textes, remises et couleurs.'
                          : 'تحكم في تفعيل أو تعطيل الشريط العائم أعلى الصفحة الرئيسية وتخصيص نصوص العروض، أكواد الخصم، والألوان.'}
                      </p>
                    </div>
                  </div>

                  {/* Enable / Disable Master Toggle */}
                  <div className="flex items-center gap-3 bg-[#FAF9F6] p-2 rounded-2xl border border-[#E5D7BF] self-stretch sm:self-auto justify-between">
                    <div className={isFrench ? 'text-left' : 'text-right'}>
                      <span className="block text-xs font-bold text-[#24160F]">
                        {isFrench ? 'Statut sur la boutique :' : 'حالة الشريط في المتجر:'}
                      </span>
                      <span
                        className={`text-[11px] font-bold ${
                          bannerEnabled ? 'text-emerald-600' : 'text-gray-400'
                        }`}
                      >
                        {bannerEnabled
                          ? isFrench
                            ? '🟢 Active et visible par les visiteurs'
                            : '🟢 مفعل وظاهر للزوار'
                          : isFrench
                          ? '⚪ Désactivée et masquée'
                          : '⚪ معطل ومخفي'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBannerEnabled(!bannerEnabled)}
                      className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        bannerEnabled ? 'bg-[#25D366]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          bannerEnabled
                            ? isFrench
                              ? 'translate-x-7'
                              : '-translate-x-7'
                            : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="bg-white p-6 rounded-3xl border border-[#E5D7BF] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F5D0F] flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" />
                      <span>
                        {isFrench
                          ? 'Aperçu en direct de la bannière (Vue visiteur)'
                          : 'معاينة حية ومباشرة للشريط (كما يراه زوار متجرك)'}
                      </span>
                    </h4>
                    {!bannerEnabled && (
                      <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                        {isFrench
                          ? "⚠️ Remarque : La bannière est désactivée et n'apparaîtra pas jusqu'à son activation et enregistrement"
                          : '⚠️ ملاحظة: الشريط معطل حالياً ولن يظهر في الصفحة الرئيسية حتى تقوم بتفعيله وحفظ التعديلات'}
                      </span>
                    )}
                  </div>

                  {/* Render simulated banner */}
                  <div className="p-3 bg-gray-950/5 rounded-2xl border border-gray-200">
                    <div
                      className={`relative overflow-hidden rounded-2xl border p-3.5 transition-all duration-300 ${
                        bannerTheme === 'gold_dark'
                          ? 'bg-gradient-to-r from-[#120F0A] via-[#241B0E] to-[#120F0A] border-[#C1841A]/50 text-white'
                          : bannerTheme === 'emerald_gold'
                          ? 'bg-gradient-to-r from-[#071D13] via-[#0E3524] to-[#071D13] border-[#25D366]/40 text-white'
                          : bannerTheme === 'ruby_gold'
                          ? 'bg-gradient-to-r from-[#21090F] via-[#3B111B] to-[#21090F] border-[#E14D66]/40 text-white'
                          : 'bg-gradient-to-r from-[#071424] via-[#0D2442] to-[#071424] border-[#4A90E2]/40 text-white'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                            <Flame className="w-5 h-5 text-[#E5B558] animate-pulse" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              {bannerBadgeText && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/15 text-[#E5B558] border border-white/10">
                                  {bannerBadgeText}
                                </span>
                              )}
                              {bannerCountdownText && (
                                <span className="text-[10px] text-gray-300 flex items-center gap-1 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                  {bannerCountdownText}
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-sm text-white leading-tight">
                              {bannerHeadline ||
                                (isFrench
                                  ? "Titre de l'offre promotionnelle"
                                  : 'عنوان العرض الترويجي')}
                            </h4>
                            {bannerSubtext && (
                              <p className="text-xs text-gray-300/85 line-clamp-1">
                                {bannerSubtext}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          {bannerCtaText && (
                            <div className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#C1841A] to-[#E5B558] text-[#1A1105] flex items-center gap-1">
                              <span>{bannerCtaText}</span>
                              {isFrench ? (
                                <ArrowRight className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowLeft className="w-3.5 h-3.5" />
                              )}
                            </div>
                          )}
                          {bannerClosable && (
                            <div className="p-1 text-gray-400">
                              <X className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Preset Templates */}
                <div className="bg-white p-6 rounded-3xl border border-[#E5D7BF] shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F5D0F] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isFrench
                        ? "Modèles d'offres prêts en 1 clic (Préréglages)"
                        : 'نماذج وقوالب عروض جاهزة بنقرة واحدة (Presets)'}
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        applyBannerPreset({
                          badgeText: isFrench ? '✨ Offre Exclusive -30%' : '✨ عرض حصري 30%',
                          headline: isFrench
                            ? 'Jusqu’à 30% de réduction sur les plus prestigieuses collections de parfums royaux !'
                            : 'تخفيضات تصل إلى 30% على أرقى تشكيلات العطور الشرقية الملكية!',
                          subtext: isFrench
                            ? 'Livraison rapide partout au Maroc avec paiement sécurisé à la livraison.'
                            : 'شحن سريع لجميع مدن المغرب مع إمكانية الدفع عند الاستلام.',
                          ctaText: isFrench ? 'Découvrir les offres' : 'تسوق العروض الآن',
                          ctaCategory: 'perfumes',
                          theme: 'gold_dark',
                          countdownText: isFrench ? 'Offre bientôt terminée' : 'ينتهي العرض قريباً',
                        })
                      }
                      className={`p-3 rounded-2xl border border-[#E5D7BF] hover:border-[#C1841A] hover:bg-[#FAF9F6] ${
                        isFrench ? 'text-left' : 'text-right'
                      } transition-all group`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#C1841A]">
                          {isFrench ? 'Offre Parfums -30%' : 'تخفيضات العطور 30%'}
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                          {isFrench ? 'Or Royal' : 'ذهبي ملكي'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2">
                        {isFrench
                          ? 'Réduction immédiate sur les parfums les plus demandés.'
                          : 'تخفيض فوري مباشر على العطور الأكثر طلباً.'}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        applyBannerPreset({
                          badgeText: isFrench ? '👑 Dehn Al Oud & Musc' : '👑 دهن العود والمسك',
                          headline: isFrench
                            ? 'Offre spéciale sur les meilleurs Dehn Al Oud cambodgiens et musc pur !'
                            : 'عرض خاص على أرقى أدهان العود الكمبودي والمسك الصافي الفاخر!',
                          subtext: isFrench
                            ? 'Qualité garantie et haute tenue avec échantillons offerts pour chaque commande.'
                            : 'ضمان الجودة والثبات العالي مع عينات مجانية مع كل طلبية.',
                          ctaText: isFrench ? 'Explorer Oud & Huiles' : 'استكشف تشكيلة العود والزيوت',
                          ctaCategory: 'oils',
                          theme: 'emerald_gold',
                          countdownText: isFrench ? 'Quantités très limitées' : 'الكمية محدودة جداً',
                        })
                      }
                      className={`p-3 rounded-2xl border border-[#E5D7BF] hover:border-emerald-600 hover:bg-[#FAF9F6] ${
                        isFrench ? 'text-left' : 'text-right'
                      } transition-all group`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#1A1A1A] group-hover:text-emerald-700">
                          {isFrench ? 'Offres Dehn Oud VIP' : 'عروض دهن العود VIP'}
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          {isFrench ? 'Émeraude' : 'زمردي فاخر'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2">
                        {isFrench
                          ? 'Offre dédiée aux amateurs de Dehn Al Oud vieilli et musc.'
                          : 'عرض مخصص لمحبي دهن العود المعتق والمسك والزيوت.'}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        applyBannerPreset({
                          badgeText: isFrench ? '🔥 Offre Week-end' : '🔥 عرض نهاية الأسبوع',
                          headline: isFrench
                            ? 'Remise spéciale supplémentaire de 20% sur les coffrets de parfums exclusifs !'
                            : 'خصم خاص 20% إضافي على مجموعات العطور والمخلطات المميزة!',
                          subtext: isFrench
                            ? 'Emballage cadeau luxueux et carte personnalisée offerts.'
                            : 'تغليف هدايا فاخر وبطاقة إهداء مخصصة مجاناً.',
                          ctaText: isFrench ? 'Voir les coffrets' : 'شاهد مجموعات العطور',
                          ctaCategory: 'perfumes',
                          theme: 'ruby_gold',
                          countdownText: isFrench ? "Jusqu'à dimanche" : 'ساري حتى مساء الأحد',
                        })
                      }
                      className={`p-3 rounded-2xl border border-[#E5D7BF] hover:border-rose-600 hover:bg-[#FAF9F6] ${
                        isFrench ? 'text-left' : 'text-right'
                      } transition-all group`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#1A1A1A] group-hover:text-rose-700">
                          {isFrench ? 'Offre Week-end' : 'عرض نهاية الأسبوع'}
                        </span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">
                          {isFrench ? 'Rubis Royal' : 'ياقوتي ملكي'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2">
                        {isFrench
                          ? 'Promotions du week-end pour coffrets cadeaux et occasions.'
                          : 'تخفيضات نهاية الأسبوع لمجموعات العطور والمناسبات.'}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        applyBannerPreset({
                          badgeText: isFrench ? '🚚 Livraison Gratuite' : '🚚 شحن مجاني',
                          headline: isFrench
                            ? 'Livraison gratuite partout au Maroc + échantillon de musc dès 300 DH !'
                            : 'توصيل مجاني لجميع مدن المغرب + هدية عينة مسك مع كل طلبية تفوق 300 درهم!',
                          subtext: isFrench
                            ? 'Paiement à la livraison après inspection de votre colis.'
                            : 'الدفع عند الاستلام بعد فحص الطلبية.',
                          ctaText: isFrench ? 'Voir tout le catalogue' : 'تسوق جميع التشكيلات',
                          ctaCategory: 'all',
                          theme: 'midnight_blue',
                          countdownText: isFrench ? 'Offre de la semaine' : 'عرض هذا الأسبوع',
                        })
                      }
                      className={`p-3 rounded-2xl border border-[#E5D7BF] hover:border-blue-600 hover:bg-[#FAF9F6] ${
                        isFrench ? 'text-left' : 'text-right'
                      } transition-all group`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#1A1A1A] group-hover:text-blue-700">
                          {isFrench ? 'Livraison & Cadeau' : 'شحن مجاني وهدية'}
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                          {isFrench ? 'Bleu Nuit' : 'أزرق ملكي'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2">
                        {isFrench
                          ? 'Livraison express offerte avec échantillon de musc.'
                          : 'خدمة التوصيل السريع المجاني مع هدية مسك.'}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Edit Form */}
                <form
                  onSubmit={handleSaveBanner}
                  className="bg-white p-6 rounded-3xl border border-[#E5D7BF] shadow-sm space-y-5"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F5D0F] flex items-center gap-1.5">
                    <Palette className="w-4 h-4" />
                    <span>
                      {isFrench
                        ? 'Modifier le contenu et le design de la bannière'
                        : 'تعديل محتوى وتصميم الشريط الترويجي'}
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Badge Text */}
                    <div>
                      <label className="block text-xs font-bold text-[#24160F] mb-1.5">
                        {isFrench
                          ? 'Texte du badge supérieur (Badge) :'
                          : 'نص الشارة العلوية (Badge):'}
                      </label>
                      <input
                        type="text"
                        value={bannerBadgeText}
                        onChange={(e) => setBannerBadgeText(e.target.value)}
                        placeholder={
                          isFrench
                            ? 'Ex: ✨ Offre exclusive limitée'
                            : 'مثال: ✨ عرض حصري لفترة محدودة'
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5D7BF] rounded-2xl px-4 py-2.5 text-xs text-[#24160F] focus:outline-none focus:border-[#C1841A]"
                      />
                    </div>

                    {/* Countdown / Urgency Text */}
                    <div>
                      <label className="block text-xs font-bold text-[#24160F] mb-1.5">
                        {isFrench
                          ? "Texte d'urgence ou compte à rebours (Urgency) :"
                          : 'نص التنبيه أو العداد (Urgency):'}
                      </label>
                      <input
                        type="text"
                        value={bannerCountdownText}
                        onChange={(e) => setBannerCountdownText(e.target.value)}
                        placeholder={
                          isFrench
                            ? 'Ex: Offre bientôt terminée / Stock limité'
                            : 'مثال: ينتهي العرض قريباً / الكمية محدودة'
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5D7BF] rounded-2xl px-4 py-2.5 text-xs text-[#24160F] focus:outline-none focus:border-[#C1841A]"
                      />
                    </div>

                    {/* Headline */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#24160F] mb-1.5">
                        {isFrench
                          ? "Titre principal de l'annonce (Headline) * :"
                          : 'العنوان الرئيسي للإعلان (Headline) * :'}
                      </label>
                      <input
                        type="text"
                        required
                        value={bannerHeadline}
                        onChange={(e) => setBannerHeadline(e.target.value)}
                        placeholder={
                          isFrench
                            ? "Entrez un titre d'offre captivant..."
                            : 'أدخل عنوان العرض الترويجي الجذاب...'
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5D7BF] rounded-2xl px-4 py-2.5 text-xs font-bold text-[#24160F] focus:outline-none focus:border-[#C1841A]"
                      />
                    </div>

                    {/* CTA Button Text */}
                    <div>
                      <label className="block text-xs font-bold text-[#24160F] mb-1.5">
                        {isFrench
                          ? "Texte du bouton d'action (Bouton CTA) :"
                          : 'نص زر التفاعل (CTA Button):'}
                      </label>
                      <input
                        type="text"
                        value={bannerCtaText}
                        onChange={(e) => setBannerCtaText(e.target.value)}
                        placeholder={
                          isFrench ? 'Ex: Découvrir les offres' : 'مثال: تسوق العروض الآن'
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5D7BF] rounded-2xl px-4 py-2.5 text-xs text-[#24160F] focus:outline-none focus:border-[#C1841A]"
                      />
                    </div>

                    {/* Subtext Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#24160F] mb-1.5">
                        {isFrench
                          ? 'Texte explicatif supplémentaire (Sous-texte) :'
                          : 'النص التوضيحي الإضافي (Subtext):'}
                      </label>
                      <textarea
                        rows={2}
                        value={bannerSubtext}
                        onChange={(e) => setBannerSubtext(e.target.value)}
                        placeholder={
                          isFrench
                            ? 'Détails de l’offre (ex: livraison rapide, paiement à la livraison...)'
                            : 'تفاصيل العرض، مثل الشحن السريع أو الدفع عند الاستلام...'
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5D7BF] rounded-2xl px-4 py-2.5 text-xs text-[#24160F] focus:outline-none focus:border-[#C1841A]"
                      />
                    </div>

                    {/* CTA Target Category */}
                    <div>
                      <label className="block text-xs font-bold text-[#24160F] mb-1.5">
                        {isFrench
                          ? 'Catégorie ciblée lors du clic :'
                          : 'القسم المستهدف عند الضغط:'}
                      </label>
                      <select
                        value={bannerCtaCategory}
                        onChange={(e) =>
                          setBannerCtaCategory(e.target.value as CategoryType | 'all')
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5D7BF] rounded-2xl px-4 py-2.5 text-xs text-[#24160F] focus:outline-none focus:border-[#C1841A]"
                      >
                        <option value="all">
                          {isFrench ? 'Toutes les collections (All)' : 'جميع التشكيلات (All)'}
                        </option>
                        <option value="perfumes">
                          {isFrench
                            ? 'Parfums orientaux de luxe (Perfumes)'
                            : 'العطور الشرقية الفاخرة (Perfumes)'}
                        </option>
                        <option value="oils">
                          {isFrench
                            ? 'Huiles précieuses & Dehn Al Oud (Oils)'
                            : 'الزيوت الطبيعية وأدهان العود (Oils)'}
                        </option>
                        <option value="incense">
                          {isFrench
                            ? 'Encens, Mabkhara & Bakhoor (Incense)'
                            : 'البخور والمعمول والمباخر (Incense)'}
                        </option>
                        <option value="clothes">
                          {isFrench
                            ? 'Vêtements & Prêt-à-Porter (Clothes)'
                            : 'الملابس والأزياء التقليدية (Clothes)'}
                        </option>
                        <option value="wholesale">
                          {isFrench ? 'Vente en gros (Wholesale)' : 'البيع بالجملة (Wholesale)'}
                        </option>
                        <option value="other">
                          {isFrench ? 'Autres produits (Other)' : 'منتجات أخرى (Other)'}
                        </option>
                      </select>
                    </div>

                    {/* Color Theme Selector */}
                    <div>
                      <label className="block text-xs font-bold text-[#24160F] mb-1.5">
                        {isFrench
                          ? 'Thème de couleurs et style (Theme) :'
                          : 'نمط الألوان والتصميم (Theme):'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setBannerTheme('gold_dark')}
                          className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                            isFrench ? 'text-left' : 'text-right'
                          } ${
                            bannerTheme === 'gold_dark'
                              ? 'bg-[#1A1A1A] text-amber-300 border-[#C1841A] shadow-sm'
                              : 'bg-[#FAF9F6] text-gray-700 border-[#E5D7BF]'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full bg-[#C1841A] inline-block shrink-0" />
                          <span>{isFrench ? 'Noir & Or Royal' : 'أسود وذهبي ملكي'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setBannerTheme('emerald_gold')}
                          className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                            isFrench ? 'text-left' : 'text-right'
                          } ${
                            bannerTheme === 'emerald_gold'
                              ? 'bg-[#0E3524] text-emerald-300 border-[#25D366] shadow-sm'
                              : 'bg-[#FAF9F6] text-gray-700 border-[#E5D7BF]'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full bg-[#25D366] inline-block shrink-0" />
                          <span>{isFrench ? 'Émeraude' : 'زمردي فاخر'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setBannerTheme('ruby_gold')}
                          className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                            isFrench ? 'text-left' : 'text-right'
                          } ${
                            bannerTheme === 'ruby_gold'
                              ? 'bg-[#3B111B] text-rose-300 border-[#E14D66] shadow-sm'
                              : 'bg-[#FAF9F6] text-gray-700 border-[#E5D7BF]'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full bg-[#E14D66] inline-block shrink-0" />
                          <span>{isFrench ? 'Rubis Royal' : 'ياقوتي ملكي'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setBannerTheme('midnight_blue')}
                          className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                            isFrench ? 'text-left' : 'text-right'
                          } ${
                            bannerTheme === 'midnight_blue'
                              ? 'bg-[#0D2442] text-blue-300 border-[#4A90E2] shadow-sm'
                              : 'bg-[#FAF9F6] text-gray-700 border-[#E5D7BF]'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full bg-[#4A90E2] inline-block shrink-0" />
                          <span>{isFrench ? 'Bleu Nuit' : 'أزرق داكن'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Closable Toggle */}
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="bannerClosable"
                        checked={bannerClosable}
                        onChange={(e) => setBannerClosable(e.target.checked)}
                        className="rounded text-[#C1841A] focus:ring-[#C1841A] w-4 h-4 cursor-pointer"
                      />
                      <label
                        htmlFor="bannerClosable"
                        className="text-xs font-bold text-[#24160F] cursor-pointer"
                      >
                        {isFrench
                          ? 'Permettre aux visiteurs de fermer la bannière (X)'
                          : 'إتاحة زر الإغلاق (X) للزوار بعد مشاهدة الإعلان'}
                      </label>
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5D7BF]">
                    <button
                      type="button"
                      onClick={handleResetBannerToDefault}
                      className="px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <span>
                        {isFrench
                          ? 'Rétablir les paramètres par défaut'
                          : 'استعادة الإعدادات الافتراضية للشريط'}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={isSavingBanner}
                        className="bg-gradient-to-r from-[#1A1A1A] to-[#8C7342] hover:from-black hover:to-[#735E35] text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>
                          {isSavingBanner
                            ? isFrench
                              ? 'Enregistrement en cours...'
                              : 'جاري الحفظ والنشر...'
                            : isFrench
                            ? 'Enregistrer et publier les modifications'
                            : 'حفظ ونشر التعديلات على المتجر'}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Action Message Toast */}
        {actionMessage && (
          <div
            className={`fixed bottom-4 ${
              isFrench ? 'left-4' : 'right-4'
            } bg-[#1A1A1A] text-white border border-[#8C7342] px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 z-[60] text-xs font-bold`}
          >
            <span>{actionMessage}</span>
            <button
              onClick={() => setActionMessage('')}
              className="p-1 hover:bg-white/10 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Reset Confirm Modal */}
        {resetConfirm && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            dir={isFrench ? 'ltr' : 'rtl'}
          >
            <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center space-y-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isFrench ? 'Confirmer la réinitialisation' : 'تأكيد الاستعادة'}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isFrench
                  ? 'Êtes-vous sûr de vouloir restaurer les données par défaut ? Tous les produits actuels seront effacés et remplacés par les produits initiaux.'
                  : 'هل أنت متأكد من استعادة البيانات الافتراضية؟ سيتم مسح جميع المنتجات الحالية واستبدالها بالمنتجات الأساسية.'}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setResetConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors"
                >
                  {isFrench ? 'Annuler' : 'إلغاء'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetProducts();
                    setResetConfirm(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-colors"
                >
                  {isFrench ? 'Oui, réinitialiser' : 'نعم، استعادة'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            dir={isFrench ? 'ltr' : 'rtl'}
          >
            <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center space-y-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isFrench ? 'Confirmer la suppression' : 'تأكيد الحذف'}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isFrench
                  ? `Êtes-vous sûr de vouloir supprimer le produit "${deleteConfirm.name}" ? Cette action est irréversible.`
                  : `هل أنت متأكد من حذف المنتج "${deleteConfirm.name}"؟ لا يمكن التراجع عن هذه الخطوة.`}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors"
                >
                  {isFrench ? 'Annuler' : 'إلغاء'}
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-colors"
                >
                  {isFrench ? 'Oui, supprimer' : 'نعم، احذف'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
