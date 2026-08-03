import fs from 'fs';
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// replace window.confirm with setting state
content = content.replace("  const [pinError, setPinError] = useState('');", "  const [pinError, setPinError] = useState('');\n  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, name: string} | null>(null);\n  const [actionMessage, setActionMessage] = useState('');");

const targetDelete = `  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(\`هل أنت تأكد من حذف المنتج "\${name}"؟\`)) {
      onDeleteProduct(id);
    }
  };`;
const replacementDelete = `  const handleDeleteProduct = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };
  
  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteProduct(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };`;
content = content.replace(targetDelete, replacementDelete);

// update alerts
content = content.replace("alert('الرجاء تعبئة جميع الحقول الأساسية');", "setActionMessage('الرجاء تعبئة جميع الحقول الأساسية');");
content = content.replace("alert('الرجاء إضافة صورة للمنتج');", "setActionMessage('الرجاء إضافة صورة للمنتج');");
content = content.replace("alert('يرجى إدخال اسم المنتج أولاً لتوليد الوصف.');", "setActionMessage('يرجى إدخال اسم المنتج أولاً لتوليد الوصف.');");
content = content.replace("alert('فشل في معالجة الصورة، يرجى المحاولة مرة أخرى بصورة أخرى.');", "setActionMessage('فشل في معالجة الصورة، يرجى المحاولة مرة أخرى بصورة أخرى.');");
content = content.replace("alert('فشل في معالجة الصورة، يرجى المحاولة مرة أخرى بصورة أخرى.');", "setActionMessage('فشل في معالجة الصورة، يرجى المحاولة مرة أخرى بصورة أخرى.');");


// Inject modal at the end of the panel (before the last closing divs)
const customModal = `
        {/* Action Message Toast */}
        {actionMessage && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 z-[60]">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage('')}><X className="w-4 h-4" /></button>
          </div>
        )}
        
        {/* Delete Confirm Modal */}
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
`;

content = content.replace(/      <\/div>\n    <\/div>\n  \);\n};\s*$/, customModal);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
