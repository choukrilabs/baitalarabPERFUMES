import fs from 'fs';
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// Replace the reset confirm
content = content.replace(
  "if (window.confirm('هل تريد استعادة البيانات الافتراضية للمنتجات؟')) {\\n                      onResetProducts();\\n                    }",
  "onResetProducts();"
);

// I will make a resetConfirm state
content = content.replace(
  "const [deleteConfirm, setDeleteConfirm] = useState<{id: string, name: string} | null>(null);",
  "const [deleteConfirm, setDeleteConfirm] = useState<{id: string, name: string} | null>(null);\n  const [resetConfirm, setResetConfirm] = useState(false);"
);

content = content.replace(
  "onClick={() => {\\n                    if (window.confirm('هل تريد استعادة البيانات الافتراضية للمنتجات؟')) {\\n                      onResetProducts();\\n                    }\\n                  }}",
  "onClick={() => setResetConfirm(true)}"
);

const resetModal = `
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
`;

content = content.replace("{/* Delete Confirm Modal */}", resetModal + "\\n        {/* Delete Confirm Modal */}");

fs.writeFileSync('src/components/AdminPanel.tsx', content);
