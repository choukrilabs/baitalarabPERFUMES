import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { Address, Order, MOROCCAN_CITIES, Product, SHOP_CONFIG } from '../types';
import {
  X,
  MapPin,
  Package,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  Phone,
  Mail,
  LogOut,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { ProductImage } from './ProductImage';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReorder?: (items: { product: Product; quantity: number }[]) => void;
  initialTab?: 'addresses' | 'orders' | 'settings';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onReorder,
  initialTab = 'orders', // Default to Orders tab as requested by user
}) => {
  const {
    currentUser,
    userProfile,
    userOrders,
    logout,
    updateDisplayName,
    updateUserPhone,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAuth();
  const { toast } = useToast();
  const { isFrench, formatPrice, translateCity } = useLanguage();

  const [activeTab, setActiveTab] = useState<'addresses' | 'orders' | 'settings'>(initialTab);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Sync tab whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Address Form Modal State
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<Address, 'id'>>({
    title: isFrench ? 'Domicile' : 'المنزل',
    recipientName: currentUser?.displayName || '',
    phone: userProfile?.phone || '',
    city: 'الدار البيضاء',
    district: '',
    streetAddress: '',
    postalCode: '',
    deliveryNotes: '',
    isDefault: false,
  });

  // Settings State
  const [editName, setEditName] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [editPhone, setEditPhone] = useState(userProfile?.phone || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  if (!isOpen || !currentUser) return null;

  const addresses = userProfile?.addresses || [];

  const handleOpenNewAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm({
      title: isFrench ? 'Domicile' : 'المنزل',
      recipientName: userProfile?.displayName || currentUser.displayName || '',
      phone: userProfile?.phone || '',
      city: 'الدار البيضاء',
      district: '',
      streetAddress: '',
      postalCode: '',
      deliveryNotes: '',
      isDefault: addresses.length === 0,
    });
    setIsAddressFormOpen(true);
  };

  const handleOpenEditAddressForm = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      title: addr.title,
      recipientName: addr.recipientName,
      phone: addr.phone,
      city: addr.city,
      district: addr.district,
      streetAddress: addr.streetAddress,
      postalCode: addr.postalCode || '',
      deliveryNotes: addr.deliveryNotes || '',
      isDefault: addr.isDefault,
    });
    setIsAddressFormOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.recipientName || !addressForm.phone || !addressForm.streetAddress) {
      toast.error(
        isFrench
          ? 'Veuillez remplir tous les champs obligatoires'
          : 'يرجى ملء جميع الحقول المطلوبة للعنوان'
      );
      return;
    }

    if (editingAddressId) {
      const ok = await updateAddress({
        ...addressForm,
        id: editingAddressId,
      });
      if (ok) {
        toast.success(isFrench ? 'Adresse mise à jour avec succès' : 'تم تحديث العنوان بنجاح');
        setIsAddressFormOpen(false);
      } else {
        toast.error(isFrench ? "Erreur lors de la modification" : 'تعذر تحديث العنوان');
      }
    } else {
      const ok = await addAddress(addressForm);
      if (ok) {
        toast.success(isFrench ? 'Nouvelle adresse ajoutée' : 'تمت إضافة العنوان الجديد بنجاح');
        setIsAddressFormOpen(false);
      } else {
        toast.error(isFrench ? "Erreur lors de l'enregistrement" : 'تعذر إضافة العنوان');
      }
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (
      window.confirm(
        isFrench
          ? 'Êtes-vous sûr de vouloir supprimer cette adresse ?'
          : 'هل أنت متأكد من حذف هذا العنوان؟'
      )
    ) {
      const ok = await deleteAddress(id);
      if (ok) {
        toast.info(isFrench ? 'Adresse supprimée' : 'تم حذف العنوان');
      } else {
        toast.error(isFrench ? 'Erreur de suppression' : 'تعذر حذف العنوان');
      }
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    const ok = await setDefaultAddress(id);
    if (ok) {
      toast.success(
        isFrench
          ? 'Adresse définie comme adresse par défaut'
          : 'تم تعيين العنوان كافتراضي للتوصيل'
      );
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    let success = true;

    if (editName.trim() && editName !== userProfile?.displayName) {
      const ok = await updateDisplayName(editName.trim());
      if (!ok) success = false;
    }

    if (editPhone.trim() !== userProfile?.phone) {
      const ok = await updateUserPhone(editPhone.trim());
      if (!ok) success = false;
    }

    setIsSavingSettings(false);
    if (success) {
      toast.success(
        isFrench
          ? 'Informations mises à jour avec succès'
          : 'تم تحديث معلومات الحساب بنجاح'
      );
    } else {
      toast.error(
        isFrench ? "Erreur lors de l'enregistrement" : 'حدث خطأ أثناء حفظ التعديلات'
      );
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.info(isFrench ? 'Déconnexion réussie' : 'تم تسجيل الخروج بنجاح');
    onClose();
  };

  const handleReorderClick = (order: Order) => {
    if (onReorder && order.items && order.items.length > 0) {
      onReorder(order.items);
      toast.success(
        isFrench ? 'Articles ajoutés à votre panier' : 'تمت إضافة منتجات الطلب إلى السلة'
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        dir={isFrench ? 'ltr' : 'rtl'}
      >
        {/* Header Profile Info */}
        <div className="bg-[#1A1A1A] p-6 text-white relative">
          <button
            onClick={onClose}
            className={`absolute top-4 ${isFrench ? 'right-4' : 'left-4'} text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors`}
            aria-label={isFrench ? 'Fermer' : 'إغلاق'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full gold-gradient p-0.5 shadow-xl shrink-0">
              <div className="w-full h-full rounded-full bg-[#2A2A2A] flex items-center justify-center text-lg font-bold text-[#8C7342]">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={userProfile?.displayName || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  (userProfile?.displayName || currentUser.displayName || (isFrench ? 'C' : 'ع'))
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-xl text-white truncate">
                {userProfile?.displayName ||
                  currentUser.displayName ||
                  (isFrench ? 'Client Bait Al Arab' : 'عميل بيت العرب')}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#8C7342]" />
                  {currentUser.email}
                </span>
                {userProfile?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#8C7342]" />
                    {userProfile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Headers - Button 1: Addresses, Button 2: Orders (سجل الطلبات / Mes Commandes), Button 3: Settings */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold shrink-0">
          <button
            id="profile-tab-addresses"
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'addresses'
                ? 'bg-white text-[#8C7342] border-b-2 border-[#8C7342] font-extrabold shadow-sm'
                : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-100/60'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#8C7342]" />
            <span>{isFrench ? 'Mes Adresses' : 'عناويني المحفوظة'}</span>
            {addresses.length > 0 && (
              <span className="bg-[#8C7342]/15 text-[#8C7342] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {addresses.length}
              </span>
            )}
          </button>

          <button
            id="profile-tab-orders"
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-[#8C7342] border-b-2 border-[#8C7342] font-extrabold shadow-sm'
                : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-100/60'
            }`}
          >
            <Package className="w-4 h-4 text-[#8C7342]" />
            <span>{isFrench ? 'Mes Commandes' : 'سجل الطلبات'}</span>
            {userOrders.length > 0 && (
              <span className="bg-[#8C7342]/15 text-[#8C7342] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {userOrders.length}
              </span>
            )}
          </button>

          <button
            id="profile-tab-settings"
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-[#8C7342] border-b-2 border-[#8C7342] font-extrabold shadow-sm'
                : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-100/60'
            }`}
          >
            <Settings className="w-4 h-4 text-[#8C7342]" />
            <span>{isFrench ? 'Paramètres du compte' : 'إعدادات الحساب'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF9F6] space-y-4">
          {/* TAB: ORDER HISTORY (Default) */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-[#1A1A1A]">
                  {isFrench ? 'Historique des commandes' : 'سجل الطلبات السابقة'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isFrench
                    ? 'Suivez vos commandes et recommandez vos parfums favoris en un clic'
                    : 'تتبع طلباتك، أعد طلب المنتجات المفضلة بنقرة واحدة'}
                </p>
              </div>

              {userOrders.length > 0 ? (
                <div className="space-y-3">
                  {userOrders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    const formattedDate = new Date(order.createdAt).toLocaleDateString(
                      isFrench ? 'fr-FR' : 'ar-MA',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    );

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:border-[#8C7342]/40"
                      >
                        {/* Order Summary Bar */}
                        <div
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#8C7342]">
                              <Package className="w-5 h-5" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[#1A1A1A]">
                                  {isFrench
                                    ? `Commande #${order.id.substring(0, 8)}`
                                    : `طلب #${order.id.substring(0, 8)}`}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                    order.status === 'delivered'
                                      ? 'bg-green-100 text-green-700'
                                      : order.status === 'shipped'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {order.status === 'delivered' ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3" />
                                      {isFrench ? 'Livré' : 'تم التوصيل'}
                                    </>
                                  ) : order.status === 'shipped' ? (
                                    <>
                                      <Truck className="w-3 h-3" />
                                      {isFrench ? 'En cours de livraison' : 'جاري التوصيل'}
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="w-3 h-3" />
                                      {isFrench ? 'En préparation' : 'قيد المعالجة'}
                                    </>
                                  )}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5">{formattedDate}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className={isFrench ? 'text-right' : 'text-left'}>
                              <span className="font-bold text-sm text-[#8C7342]">
                                {formatPrice(order.totalPrice)}
                              </span>
                              <p className="text-[10px] text-gray-400">
                                {order.items?.length || 0}{' '}
                                {isFrench ? 'article(s)' : 'منتجات'}
                              </p>
                            </div>

                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="p-4 bg-[#FAF9F6] border-t border-gray-100 space-y-4 animate-fadeIn">
                            {/* Products List */}
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-gray-700">
                                {isFrench ? 'Articles commandés :' : 'المنتجات المطلوبة:'}
                              </h5>
                              <div className="space-y-2">
                                {order.items?.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200 text-xs"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                        <ProductImage
                                          src={item.product.image}
                                          alt={item.product.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div>
                                        <span className="font-bold text-gray-800 block">
                                          {item.product.name}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                          {isFrench ? 'Quantité' : 'الكمية'}: {item.quantity} ×{' '}
                                          {formatPrice(item.product.price)}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="font-bold text-[#8C7342]">
                                      {formatPrice(item.product.price * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Delivery Address if present */}
                            {order.address && (
                              <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs text-gray-600">
                                <h5 className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-[#8C7342]" />
                                  {isFrench ? 'Adresse de livraison :' : 'عنوان التوصيل:'}
                                </h5>
                                <p>
                                  {order.address.recipientName} - {order.address.phone}
                                </p>
                                <p>
                                  {order.address.streetAddress}، {order.address.district}،{' '}
                                  {translateCity(order.address.city)}
                                </p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              <button
                                onClick={() => handleReorderClick(order)}
                                className="bg-[#1A1A1A] hover:bg-[#8C7342] text-white text-xs font-bold py-2 px-4 rounded-xl shadow transition-colors flex items-center gap-1.5"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>
                                  {isFrench
                                    ? 'Recommander ces articles'
                                    : 'إعادة طلب هذه المنتجات'}
                                </span>
                              </button>

                              <a
                                href={`https://wa.me/${
                                  SHOP_CONFIG.whatsappNumber
                                }?text=${encodeURIComponent(
                                  isFrench
                                    ? `Bonjour Parfums Bait Al Arab, j'aimerais avoir un suivi pour ma commande #${order.id.substring(0, 8)}.`
                                    : `مرحباً عطور بيت العرب، استفسار بخصوص الطلب رقم #${order.id.substring(
                                        0,
                                        8
                                      )}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold py-2 px-4 rounded-xl shadow transition-colors flex items-center gap-1.5"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>
                                  {isFrench ? 'Suivi sur WhatsApp' : 'متابعة الطلب عبر واتساب'}
                                </span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 p-6 space-y-2">
                  <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 font-bold">
                    {isFrench
                      ? 'Aucune commande enregistrée pour le moment'
                      : 'لا توجد طلبات سابقة حتى الآن'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isFrench
                      ? 'Toutes vos commandes passées sur la boutique apparaîtront ici pour un suivi simple.'
                      : 'عند إرسال طلبك عبر المتجر، سيتم تسجيله هنا تلقائياً لسهولة المتابعة.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-sm text-[#1A1A1A]">
                    {isFrench ? 'Adresses de livraison' : 'عناوين التوصيل'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isFrench
                      ? 'Enregistrez vos adresses pour accélérer vos commandes'
                      : 'احفظ عناوينك لتسريع عملية الطلب واستلام العطور'}
                  </p>
                </div>
                <button
                  onClick={handleOpenNewAddressForm}
                  className="bg-[#1A1A1A] hover:bg-[#8C7342] text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isFrench ? 'Ajouter une adresse' : 'إضافة عنوان جديد'}</span>
                </button>
              </div>

              {/* Address Form inline */}
              {isAddressFormOpen && (
                <form
                  onSubmit={handleSaveAddress}
                  className="bg-white p-5 rounded-2xl border-2 border-[#8C7342]/40 shadow-md space-y-3 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="font-bold text-xs text-[#8C7342]">
                      {isFrench
                        ? editingAddressId
                          ? "Modifier l'adresse de livraison"
                          : 'Ajouter une nouvelle adresse'
                        : editingAddressId
                        ? 'تعديل عنوان التوصيل'
                        : 'إضافة عنوان توصيل جديد'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddressFormOpen(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        {isFrench
                          ? "Libellé de l'adresse (ex: Domicile, Bureau) *"
                          : 'تسمية العنوان (مثال: المنزل، المكتب) *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.title}
                        onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                        placeholder={isFrench ? 'Domicile' : 'المنزل'}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        {isFrench ? 'Nom du destinataire *' : 'اسم المستلم *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.recipientName}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, recipientName: e.target.value })
                        }
                        placeholder={isFrench ? 'Nom complet' : 'الاسم الكامل'}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        {isFrench ? 'Numéro de téléphone *' : 'رقم الهاتف *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        placeholder="06 XX XX XX XX"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        {isFrench ? 'Ville *' : 'المدينة *'}
                      </label>
                      <select
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                      >
                        {MOROCCAN_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {translateCity(c)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        {isFrench ? 'Quartier / Secteur *' : 'الحي / المنطقة *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.district}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, district: e.target.value })
                        }
                        placeholder={
                          isFrench
                            ? 'ex: Habous, Maarif, Agdal...'
                            : 'مثال: حي الحبوس، المعاريف، أكدال'
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        {isFrench ? 'Code postal (optionnel)' : 'الرمز البريدي (اختياري)'}
                      </label>
                      <input
                        type="text"
                        value={addressForm.postalCode}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, postalCode: e.target.value })
                        }
                        placeholder="20000"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {isFrench
                        ? "Adresse exacte (Rue, N° d'immeuble, étage) *"
                        : 'العنوان التفصيلي (الشارع، رقم العمارة/المنزل، الطابق) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.streetAddress}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, streetAddress: e.target.value })
                      }
                      placeholder={
                        isFrench
                          ? 'Rue Moulay Ismaïl, N° 14, Étage 2'
                          : 'زنقة مولاي إسماعيل، رقم 14، الطابق 2'
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {isFrench
                        ? 'Instructions de livraison (optionnel)'
                        : 'ملاحظات خاصة بالتوصيل (اختياري)'}
                    </label>
                    <input
                      type="text"
                      value={addressForm.deliveryNotes}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, deliveryNotes: e.target.value })
                      }
                      placeholder={
                        isFrench
                          ? 'Près de la mosquée, appeler avant arrivée'
                          : 'قرب مسجد سيدي عقبة، الاتصال قبل الوصول'
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isDefaultAddr"
                      checked={addressForm.isDefault}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, isDefault: e.target.checked })
                      }
                      className="w-4 h-4 text-[#8C7342] rounded focus:ring-[#8C7342]"
                    />
                    <label htmlFor="isDefaultAddr" className="text-xs text-gray-700 font-medium cursor-pointer">
                      {isFrench
                        ? 'Définir comme adresse de livraison par défaut'
                        : 'تعيين كعنوان توصيل افتراضي'}
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsAddressFormOpen(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                    >
                      {isFrench ? 'Annuler' : 'إلغاء'}
                    </button>
                    <button
                      type="submit"
                      className="bg-[#1A1A1A] hover:bg-[#8C7342] text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition-colors"
                    >
                      {isFrench ? "Enregistrer l'adresse" : 'حفظ العنوان'}
                    </button>
                  </div>
                </form>
              )}

              {/* List of saved addresses */}
              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                        addr.isDefault
                          ? 'border-[#8C7342] shadow-md bg-gradient-to-br from-white to-[#FAF8F5]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#1A1A1A]">{addr.title}</span>
                            {addr.isDefault && (
                              <span className="bg-[#8C7342] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" />{' '}
                                {isFrench ? 'Par défaut' : 'الافتراضي'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditAddressForm(addr)}
                              className="p-1.5 text-gray-400 hover:text-[#8C7342] rounded-lg hover:bg-gray-50 transition-colors"
                              title={isFrench ? 'Modifier' : 'تعديل'}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors"
                              title={isFrench ? 'Supprimer' : 'حذف'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-700 font-semibold">
                          {addr.recipientName} ({addr.phone})
                        </p>

                        <p className="text-xs text-gray-500 leading-relaxed">
                          {addr.streetAddress}، {addr.district}، {translateCity(addr.city)}
                          {addr.postalCode ? ` (${addr.postalCode})` : ''}
                        </p>

                        {addr.deliveryNotes && (
                          <p className="text-[11px] text-gray-400 italic bg-gray-50 p-2 rounded-lg">
                            {isFrench ? 'Note :' : 'ملاحظة:'} {addr.deliveryNotes}
                          </p>
                        )}
                      </div>

                      {!addr.isDefault && (
                        <div className="pt-3 mt-2 border-t border-gray-100">
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[11px] text-[#8C7342] hover:underline font-bold"
                          >
                            {isFrench ? 'Définir comme adresse par défaut' : 'تعيين كعنوان افتراضي'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-gray-200 p-6">
                  <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">
                    {isFrench
                      ? 'Aucune adresse de livraison enregistrée.'
                      : 'لم تحفظ أي عناوين توصيل بعد.'}
                  </p>
                  <button
                    onClick={handleOpenNewAddressForm}
                    className="mt-3 text-xs font-bold text-[#8C7342] hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />{' '}
                    {isFrench ? 'Ajouter ma première adresse' : 'أضف عنوانك الأول الآن'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-[#1A1A1A]">
                  {isFrench ? 'Informations du compte' : 'معلومات الحساب'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isFrench
                    ? 'Mettez à jour vos coordonnées personnelles pour la livraison'
                    : 'تحديث بياناتك الشخصية للتواصل والتوصيل'}
                </p>
              </div>

              <form
                onSubmit={handleSaveSettings}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isFrench ? 'Nom complet' : 'الاسم الكامل'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:ring-1 focus:ring-[#8C7342]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isFrench
                      ? 'Adresse e-mail (non modifiable)'
                      : 'البريد الإلكتروني (غير قابل للتغيير)'}
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email || ''}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isFrench ? 'Numéro de téléphone' : 'رقم الهاتف للتوصيل'}
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="06 XX XX XX XX"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:ring-1 focus:ring-[#8C7342]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="bg-[#1A1A1A] hover:bg-[#8C7342] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow transition-colors disabled:opacity-50"
                >
                  {isSavingSettings
                    ? isFrench
                      ? 'Enregistrement en cours...'
                      : 'جاري الحفظ...'
                    : isFrench
                    ? 'Enregistrer les modifications'
                    : 'حفظ التغييرات'}
                </button>
              </form>

              {/* Logout Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-3 rounded-xl font-bold text-xs border border-red-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>
                    {isFrench ? 'Se déconnecter du compte' : 'تسجيل الخروج من الحساب'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
