import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Address, Order, MOROCCAN_CITIES, Product, SHOP_CONFIG } from '../types';
import {
  X,
  User,
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
  Calendar,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  ShieldCheck
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
  initialTab = 'addresses',
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

  const [activeTab, setActiveTab] = useState<'addresses' | 'orders' | 'settings'>(initialTab);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Address Form Modal State
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<Address, 'id'>>({
    title: 'المنزل',
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
      title: 'المنزل',
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
      toast.error('يرجى ملء جميع الحقول المطلوبة للعنوان');
      return;
    }

    if (editingAddressId) {
      const ok = await updateAddress({
        ...addressForm,
        id: editingAddressId,
      });
      if (ok) {
        toast.success('تم تحديث العنوان بنجاح');
        setIsAddressFormOpen(false);
      } else {
        toast.error('تعذر تحديث العنوان');
      }
    } else {
      const ok = await addAddress(addressForm);
      if (ok) {
        toast.success('تمت إضافة العنوان الجديد بنجاح');
        setIsAddressFormOpen(false);
      } else {
        toast.error('تعذر إضافة العنوان');
      }
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العنوان؟')) {
      const ok = await deleteAddress(id);
      if (ok) {
        toast.info('تم حذف العنوان');
      } else {
        toast.error('تعذر حذف العنوان');
      }
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    const ok = await setDefaultAddress(id);
    if (ok) {
      toast.success('تم تعيين العنوان كافتراضي للتوصيل');
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
      toast.success('تم تحديث معلومات الحساب بنجاح');
    } else {
      toast.error('حدث خطأ أثناء حفظ التعديلات');
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.info('تم تسجيل الخروج بنجاح');
    onClose();
  };

  const handleReorderClick = (order: Order) => {
    if (onReorder && order.items && order.items.length > 0) {
      onReorder(order.items);
      toast.success('تمت إضافة منتجات الطلب إلى السلة');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header Profile Info */}
        <div className="bg-[#1A1A1A] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="إغلاق"
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
                  (userProfile?.displayName || currentUser.displayName || 'ع').charAt(0).toUpperCase()
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-xl text-white truncate">
                {userProfile?.displayName || currentUser.displayName || 'عميل بيت العرب'}
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

        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'addresses'
                ? 'bg-white text-[#8C7342] border-b-2 border-[#8C7342]'
                : 'text-gray-500 hover:text-[#1A1A1A]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>عناويني المحفوظة ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-[#8C7342] border-b-2 border-[#8C7342]'
                : 'text-gray-500 hover:text-[#1A1A1A]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>سجل الطلبات ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-[#8C7342] border-b-2 border-[#8C7342]'
                : 'text-gray-500 hover:text-[#1A1A1A]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات الحساب</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF9F6] space-y-4">
          {/* TAB 1: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#1A1A1A]">عناوين التوصيل</h3>
                  <p className="text-xs text-gray-500">
                    احفظ عناوينك لتسريع عملية الطلب واستلام العطور
                  </p>
                </div>
                <button
                  onClick={handleOpenNewAddressForm}
                  className="bg-[#1A1A1A] hover:bg-[#8C7342] text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة عنوان جديد</span>
                </button>
              </div>

              {/* Address Form inline/modal */}
              {isAddressFormOpen && (
                <form
                  onSubmit={handleSaveAddress}
                  className="bg-white p-5 rounded-2xl border-2 border-[#8C7342]/40 shadow-md space-y-3 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="font-bold text-xs text-[#8C7342]">
                      {editingAddressId ? 'تعديل عنوان التوصيل' : 'إضافة عنوان توصيل جديد'}
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
                        تسمية العنوان (مثال: المنزل، المكتب) *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.title}
                        onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                        placeholder="المنزل"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        اسم المستلم *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.recipientName}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, recipientName: e.target.value })
                        }
                        placeholder="الاسم الكامل"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        رقم الهاتف *
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
                        المدينة *
                      </label>
                      <select
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                      >
                        {MOROCCAN_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        الحي / المنطقة *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.district}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, district: e.target.value })
                        }
                        placeholder="مثال: حي الحبوس، المعاريف، أكدال"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        الرمز البريدي (اختياري)
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
                      العنوان التفصيلي (الشارع، رقم العمارة/المنزل، الطابق) *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.streetAddress}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, streetAddress: e.target.value })
                      }
                      placeholder="زنقة مولاي إسماعيل، رقم 14، الطابق 2"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#8C7342]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      ملاحظات خاصة بالتوصيل (اختياري)
                    </label>
                    <input
                      type="text"
                      value={addressForm.deliveryNotes}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, deliveryNotes: e.target.value })
                      }
                      placeholder="قرب مسجد سيدي عقبة، الاتصال قبل الوصول"
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
                    <label htmlFor="isDefaultAddr" className="text-xs text-gray-700 font-medium">
                      تعيين كعنوان توصيل افتراضي
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsAddressFormOpen(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="bg-[#1A1A1A] hover:bg-[#8C7342] text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition-colors"
                    >
                      حفظ العنوان
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
                                <Check className="w-3 h-3" /> الافتراضي
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditAddressForm(addr)}
                              className="p-1.5 text-gray-400 hover:text-[#8C7342] rounded-lg hover:bg-gray-50 transition-colors"
                              title="تعديل"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-700 font-semibold">
                          {addr.recipientName} ({addr.phone})
                        </p>

                        <p className="text-xs text-gray-500 leading-relaxed">
                          {addr.streetAddress}، {addr.district}، {addr.city}
                          {addr.postalCode ? ` (${addr.postalCode})` : ''}
                        </p>

                        {addr.deliveryNotes && (
                          <p className="text-[11px] text-gray-400 italic bg-gray-50 p-2 rounded-lg">
                            ملاحظة: {addr.deliveryNotes}
                          </p>
                        )}
                      </div>

                      {!addr.isDefault && (
                        <div className="pt-3 mt-2 border-t border-gray-100">
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[11px] text-[#8C7342] hover:underline font-bold"
                          >
                            تعيين كعنوان افتراضي
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-gray-200 p-6">
                  <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">لم تحفظ أي عناوين توصيل بعد.</p>
                  <button
                    onClick={handleOpenNewAddressForm}
                    className="mt-3 text-xs font-bold text-[#8C7342] hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> أضف عنوانك الأول الآن
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-[#1A1A1A]">سجل الطلبات السابقة</h3>
                <p className="text-xs text-gray-500">
                  تتبع طلباتك، أعد طلب المنتجات المفضلة بنقرة واحدة
                </p>
              </div>

              {userOrders.length > 0 ? (
                <div className="space-y-3">
                  {userOrders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    const formattedDate = new Date(order.createdAt).toLocaleDateString('ar-MA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all"
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
                                  طلب #{order.id.substring(0, 8)}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    order.status === 'delivered'
                                      ? 'bg-green-100 text-green-700'
                                      : order.status === 'shipped'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {order.status === 'delivered'
                                    ? 'تم التوصيل'
                                    : order.status === 'shipped'
                                    ? 'جاري التوصيل'
                                    : 'قيد المعالجة'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5">{formattedDate}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-left">
                              <span className="font-bold text-sm text-[#8C7342]">
                                {order.totalPrice} درهم
                              </span>
                              <p className="text-[10px] text-gray-400">
                                {order.items?.length || 0} منتجات
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
                              <h5 className="text-xs font-bold text-gray-700">المنتجات المطلوبة:</h5>
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
                                          الكمية: {item.quantity} × {item.product.price} درهم
                                        </span>
                                      </div>
                                    </div>
                                    <span className="font-bold text-[#8C7342]">
                                      {item.product.price * item.quantity} درهم
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
                                  عنوان التوصيل:
                                </h5>
                                <p>
                                  {order.address.recipientName} - {order.address.phone}
                                </p>
                                <p>
                                  {order.address.streetAddress}، {order.address.district}،{' '}
                                  {order.address.city}
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
                                <span>إعادة طلب هذه المنتجات</span>
                              </button>

                              <a
                                href={`https://wa.me/${
                                  SHOP_CONFIG.whatsappNumber
                                }?text=${encodeURIComponent(
                                  `مرحباً عطور بيت العرب، استفسار بخصوص الطلب رقم #${order.id.substring(
                                    0,
                                    8
                                  )}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold py-2 px-4 rounded-xl shadow transition-colors flex items-center gap-1.5"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>متابعة الطلب عبر واتساب</span>
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
                  <p className="text-xs text-gray-600 font-bold">لا توجد طلبات سابقة حتى الآن</p>
                  <p className="text-xs text-gray-400">
                    عند إرسال طلبك عبر المتجر، سيتم تسجيله هنا تلقائياً لسهولة المتابعة.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-[#1A1A1A]">معلومات الحساب</h3>
                <p className="text-xs text-gray-500">تحديث بياناتك الشخصية للتواصل والتوصيل</p>
              </div>

              <form
                onSubmit={handleSaveSettings}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل</label>
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
                    البريد الإلكتروني (غير قابل للتغيير)
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
                    رقم الهاتف للتوصيل
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
                  {isSavingSettings ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </form>

              {/* Logout Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-3 rounded-xl font-bold text-xs border border-red-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج من الحساب</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
