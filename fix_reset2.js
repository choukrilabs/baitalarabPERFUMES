import fs from 'fs';
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const target = `                <button
                  onClick={() => {
                    if (window.confirm('هل تريد استعادة البيانات الافتراضية للمنتجات؟')) {
                      onResetProducts();
                    }
                  }}`;
                  
const replacement = `                <button
                  onClick={() => setResetConfirm(true)}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
