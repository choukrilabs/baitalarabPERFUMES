import React, { useState } from 'react';
import { Product, CategoryType } from '../types';
import { getAdminPassword } from '../services/storage';
import { generateProductDescription } from '../services/aiHelper';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  KeyRound,
  Wand2,
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
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onResetProducts,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, name: string} | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Form for New Product
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('perfumes');
  const [newPrice, setNewPrice] = useState<string>('');
  const [newOriginalPrice, setNewOriginalPrice] = useState<string>('');
  const [newVolume, setNewVolume] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Remove PIN change logic

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = getAdminPassword();
    if (!correctPassword) {
      setPinError('لم يتم إعداد كلمة المرور للمسؤول. يرجى إضافتها في الإعدادات.');
      return;
    }
    
    if (pinInput === correctPassword) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('كلمة المرور غير صحيحة.');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) {
      setActionMessage('الرجاء تعبئة جميع الحقول الأساسية');
      return;
    }
    if (!newImage) {
      setActionMessage('الرجاء إضافة صورة للمنتج');
      return;
    }

    const priceNum = parseFloat(newPrice);
    const origPriceNum = newOriginalPrice ? parseFloat(newOriginalPrice) : undefined;
    const notesArray = newNotes
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);

    const newProd: Product = {
      id: 'prod_' + Date.now(),
      name: newName.trim(),
      category: newCategory,
      price: priceNum,
      description:
        newDescription.trim() ||
        'منتج عالي الجودة من عطور بيت العرب، حي الحبوس، الدار البيضاء.',
      image: newImage.trim(),
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
    setNewNotes('');
  };

  const handleToggleActive = (id: string) => {
    const productToUpdate = products.find((p) => p.id === id);
    if (productToUpdate) {
      onEditProduct({ ...productToUpdate, active: !productToUpdate.active });
    }
  };

  const handleUpdateField = (id: string, field: keyof Product, value: any) => {
    const productToUpdate = products.find(p => p.id === id);
    if (productToUpdate) {
      onEditProduct({ ...productToUpdate, [field]: value });
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
      setActionMessage('يرجى إدخال اسم المنتج أولاً لتوليد الوصف.');
      return;
    }
    setIsGeneratingAI(true);
    const catName =
      newCategory === 'perfumes'
        ? 'عطر/عود'
        : newCategory === 'incense'
        ? 'بخور'
        : newCategory === 'clothes'
        ? 'ملابس'
        : newCategory === 'oils'
        ? 'زيوت طبيعية'
        : 'أخرى';

    const generated = await generateProductDescription(
      newName,
      catName,
      newNotes
    );
    setNewDescription(generated);
    setIsGeneratingAI(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 600, 600, 0.7);
        setNewImage(compressedBase64);
      } catch (err) {
        console.error('Failed to compress image', err);
        setActionMessage('فشل في معالجة الصورة، يرجى المحاولة مرة أخرى بصورة أخرى.');
      }
    }
  };

  const handleEditImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 600, 600, 0.7);
        handleUpdateField(id, 'image', compressedBase64);
      } catch (err) {
        console.error('Failed to compress image', err);
        setActionMessage('فشل في معالجة الصورة، يرجى المحاولة مرة أخرى بصورة أخرى.');
      }
    }
  };



  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-[#E5D7BF] my-6">
        
        {/* Modal Top Banner */}
        <div className="bg-[#1A1A1A] text-[#FAF9F6] p-5 flex items-center justify-between border-b border-[#8C7342]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gold-gradient p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#1A1A1A] rounded-full flex items-center justify-center text-[#8C7342]">
                <Lock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">
                لوحة تحكم المتجر (إدارة المنتجات والأسعار)
              </h2>
              <p className="text-xs text-[#8C7342]">
                عطور بيت العرب • حي الحبوس، الدار البيضاء
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#2A2A2A] text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* PIN Auth Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 bg-gray-100 text-[#8C7342] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-[#1A1A1A]">
                أدخل كلمة المرور
              </h3>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full text-center text-xl font-bold tracking-widest bg-[#F5F5F5] border-2 border-gray-200 focus:border-[#8C7342] rounded-2xl py-3 text-[#1A1A1A] focus:outline-none"
                  autoFocus
                />
              </div>

              {pinError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl">
                  {pinError}
                </p>
              )}

              <button
                type="submit"
                className="w-full gold-gradient text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:scale-[1.02] transition-transform"
              >
                دخول إلى لوحة التحكم
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Panel */
          <div className="p-6 sm:p-8 space-y-8 bg-[#FAF9F6] max-h-[80vh] overflow-y-auto">
            
            {/* Action Bar Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5D7BF]">
              <div className="text-xs font-bold text-[#8F5D0F]">
                إجمالي المنتجات: {products.length} (ظاهر: {products.filter((p) => p.active).length})
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setResetConfirm(true)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl font-bold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة الضبط الافتراضي</span>
                </button>
              </div>
            </div>

            {/* Add New Product Box */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5D7BF] shadow-sm space-y-4">
              <h3 className="font-display font-bold text-lg text-[#24160F] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#C1841A]" />
                <span>إضافة منتج جديد للمتجر</span>
              </h3>

              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                    اسم المنتج *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="مثال: دهن عود سيوفي أصيل"
                    className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                    القسم *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                    className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                  >
                    <option value="perfumes">العطور والروائح</option>
                    <option value="incense">البخور</option>
                    <option value="clothes">الملابس</option>
                    <option value="oils">الزيوت الطبيعية</option>
                    <option value="other">منتجات أخرى</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                    السعر (بالدرهم المغربي) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="مثال: 350"
                    className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                    السعر السابق قبل التخفيض (اختياري)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    placeholder="مثال: 420"
                    className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                  />
                </div>

                {/* Volume / Size */}
                <div>
                  <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                    الحجم أو الوزن (اختياري)
                  </label>
                  <input
                    type="text"
                    value={newVolume}
                    onChange={(e) => setNewVolume(e.target.value)}
                    placeholder="مثال: 100 مل، 1 كجم، أو مقاس L"
                    className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                  />
                </div>

                {/* Image Upload/URL */}
                <div>
                  <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                    صورة المنتج (رابط أو رفع)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                    />
                    <label className="cursor-pointer shrink-0 bg-[#F4EAD9] hover:bg-[#E5D7BF] border border-[#E5D7BF] rounded-xl px-4 py-2.5 text-xs font-bold text-[#8F5D0F] flex items-center justify-center transition-colors">
                      رفع صورة
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#8F5D0F] mb-1">
                    المكونات والنوتات العطرية (مفصولة بفاصلة)
                  </label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="مثال: عود كمبودي, مسك أبيض, عنبر"
                    className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-3 py-2.5 text-xs text-[#24160F]"
                  />
                </div>

                {/* Description + AI Generator */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#8F5D0F]">
                      وصف المنتج
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateAIDesc}
                      disabled={isGeneratingAI}
                      className="text-xs text-[#C1841A] font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>{isGeneratingAI ? 'جارٍ توليد الوصف...' : 'توليد وصف بالذكاء الاصطناعي'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="وصف مختصر ومغري عن ميزات ورائحة هذا المنتج..."
                    className="w-full bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl p-3 text-xs text-[#24160F]"
                  />
                </div>

                {/* Submit button */}
                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full gold-gradient text-white py-3 rounded-xl font-bold text-sm shadow-md hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة المنتج إلى قائمة المتجر</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Products Management List */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-[#24160F] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C1841A]" />
                <span>إدارة وتعديل المنتجات الحالية ({products.length})</span>
              </h3>

              <div className="space-y-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className={`bg-white rounded-2xl p-4 border transition-all ${
                      p.active
                        ? 'border-[#E5D7BF] shadow-sm'
                        : 'border-gray-200 bg-gray-50/70 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      
                      {/* Product Thumbnail & Basic Info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <label className="relative cursor-pointer group">
                          <div className="w-14 h-14 shrink-0 overflow-hidden rounded-xl bg-[#F4EAD9]">
                            <ProductImage
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">تغيير</span>
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
                            onChange={(e) =>
                              handleUpdateField(p.id, 'name', e.target.value)
                            }
                            className="font-bold text-sm text-[#24160F] bg-transparent border-b border-transparent hover:border-[#C1841A] focus:border-[#C1841A] focus:bg-[#FAF5EC] px-1 rounded transition-colors w-full"
                          />

                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            {/* Category Selector */}
                            <select
                              value={p.category}
                              onChange={(e) =>
                                handleUpdateField(p.id, 'category', e.target.value)
                              }
                              className="bg-[#FAF5EC] border border-[#E5D7BF] rounded-lg px-2 py-0.5 text-xs text-[#8F5D0F]"
                            >
                              <option value="perfumes">العطور والروائح</option>
                              <option value="incense">البخور</option>
                              <option value="clothes">الملابس</option>
                              <option value="oils">الزيوت الطبيعية</option>
                              <option value="other">منتجات أخرى</option>
                            </select>

                            {p.volume && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                                {p.volume}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Inline Price Editor & Visibility Toggle */}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        
                        {/* Price Input */}
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-[#8F5D0F] font-bold">السعر:</label>
                          <input
                            type="number"
                            min="0"
                            value={p.price}
                            onChange={(e) =>
                              handleUpdateField(
                                p.id,
                                'price',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-20 bg-[#FAF5EC] border border-[#E5D7BF] focus:border-[#C1841A] rounded-xl px-2.5 py-1 text-xs font-bold text-[#24160F] text-center"
                          />
                          <span className="text-xs text-gray-500">درهم</span>
                        </div>

                        {/* Visibility Toggle Button */}
                        <button
                          onClick={() => handleToggleActive(p.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                            p.active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          title={p.active ? 'المنتج ظاهر للزوار' : 'المنتج مخفي عن الزوار'}
                        >
                          {p.active ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>ظاهر</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>مخفي</span>
                            </>
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="حذف المنتج النهائي"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}


        {/* Action Message Toast */}
        {actionMessage && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 z-[60]">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage('')}><X className="w-4 h-4" /></button>
          </div>
        )}
        
        
        {/* Reset Confirm Modal */}
        {resetConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center space-y-6">
              <h3 className="text-xl font-bold text-gray-900">تأكيد الاستعادة</h3>
              <p className="text-gray-600">هل أنت متأكد من استعادة البيانات الافتراضية؟ سيتم مسح جميع المنتجات الحالية واستبدالها بالمنتجات الأساسية.</p>
              <div className="flex gap-4">
                <button onClick={() => setResetConfirm(false)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">
                  إلغاء
                </button>
                <button onClick={() => { onResetProducts(); setResetConfirm(false); }} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors">
                  نعم، استعادة
                </button>
              </div>
            </div>
          </div>
        )}
\n        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center space-y-6">
              <h3 className="text-xl font-bold text-gray-900">تأكيد الحذف</h3>
              <p className="text-gray-600">هل أنت متأكد من حذف المنتج "{deleteConfirm.name}"؟ لا يمكن التراجع عن هذه الخطوة.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">
                  إلغاء
                </button>
                <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors">
                  نعم، احذف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
