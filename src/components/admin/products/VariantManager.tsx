import React, { useState } from 'react';
import { ProductVariant } from '../../../types/product';
import { Plus, Trash2, Check, AlertCircle } from 'lucide-react';

interface VariantManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export const VariantManager: React.FC<VariantManagerProps> = ({ variants, onChange }) => {
  const [attrName, setAttrName] = useState('');
  const [attrValue, setAttrValue] = useState('');
  const [attributes, setAttributes] = useState<{ name: string; options: string[] }[]>([
    { name: 'Color', options: ['Black', 'White', 'Blue'] },
    { name: 'Size', options: ['Small', 'Medium', 'Large'] },
  ]);

  // Generate All Variant Combinations automatically
  const handleGenerateCombinations = () => {
    if (attributes.length === 0) return;

    let combinations: Record<string, string>[] = [{}];

    attributes.forEach((attr) => {
      const temp: Record<string, string>[] = [];
      combinations.forEach((acc) => {
        attr.options.forEach((opt) => {
          temp.push({ ...acc, [attr.name]: opt });
        });
      });
      combinations = temp;
    });

    const generated: ProductVariant[] = combinations.map((comb, index) => {
      const name = Object.values(comb).join(' / ');
      const sku = `VAR-${index + 101}`;
      return {
        id: `var-${Date.now()}-${index}`,
        sku,
        name,
        attributes: comb,
        regularPrice: 3500,
        salePrice: 2999,
        stock: 10,
      };
    });

    onChange(generated);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleDeleteVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-gray-900">Product Variant Generator</h3>
          <p className="text-xs text-gray-500 font-medium">Define size, color, storage attributes to generate variant matrices.</p>
        </div>

        <button
          type="button"
          onClick={handleGenerateCombinations}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Auto-Generate Combinations ({variants.length})
        </button>
      </div>

      {/* Generated Variants Table */}
      {variants.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 font-extrabold uppercase border-b border-gray-100">
                <th className="pb-3 px-2">Variant Combination</th>
                <th className="pb-3 px-2">SKU</th>
                <th className="pb-3 px-2">Regular Price</th>
                <th className="pb-3 px-2">Sale Price</th>
                <th className="pb-3 px-2">Stock Qty</th>
                <th className="pb-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
              {variants.map((v, i) => (
                <tr key={v.id}>
                  <td className="py-2.5 px-2 font-bold text-gray-900">{v.name}</td>
                  <td className="py-2.5 px-2">
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => handleUpdateVariant(i, 'sku', e.target.value)}
                      className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      value={v.regularPrice}
                      onChange={(e) => handleUpdateVariant(i, 'regularPrice', Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      value={v.salePrice || ''}
                      onChange={(e) => handleUpdateVariant(i, 'salePrice', Number(e.target.value) || undefined)}
                      className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => handleUpdateVariant(i, 'stock', Number(e.target.value))}
                      className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold"
                    />
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteVariant(i)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
