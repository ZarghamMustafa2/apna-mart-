import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../../types/product';
import { Check, AlertCircle } from 'lucide-react';

interface VariantSelectorProps {
  product: Product;
  onVariantChange: (variant: ProductVariant | undefined, selectedAttributes: Record<string, string>) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({ product, onVariantChange }) => {
  if (!product.hasVariants || !product.variantAttributes || product.variantAttributes.length === 0) {
    return null;
  }

  // Initialize selected attributes with first options
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.variantAttributes?.forEach((attr) => {
      initial[attr.name] = attr.options[0];
    });
    return initial;
  });

  // Find matching variant from combinations
  const currentVariant = product.variants?.find((variant) => {
    return Object.entries(selectedAttributes).every(
      ([key, val]) => variant.attributes[key] === val
    );
  });

  useEffect(() => {
    onVariantChange(currentVariant, selectedAttributes);
  }, [selectedAttributes, currentVariant]);

  const handleSelectAttribute = (attrName: string, optionValue: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attrName]: optionValue,
    }));
  };

  return (
    <div className="space-y-4 py-4 border-y border-gray-100">
      {product.variantAttributes.map((attr) => {
        const isColor = attr.name.toLowerCase() === 'color';
        return (
          <div key={attr.name} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900 uppercase tracking-wider">
                Select {attr.name}:
              </span>
              <span className="font-semibold text-brand-600">
                {selectedAttributes[attr.name]}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {attr.options.map((option) => {
                const isSelected = selectedAttributes[attr.name] === option;
                
                if (isColor) {
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelectAttribute(attr.name, option)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                      <span>{option}</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelectAttribute(attr.name, option)}
                    className={`min-w-[48px] px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-600 text-white shadow-md'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-brand-300'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Stock Availability Indicator for Selected Variant */}
      {currentVariant && (
        <div className="text-xs pt-1 flex items-center gap-2">
          {currentVariant.stock > 0 ? (
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
              <Check className="w-4 h-4" />
              In Stock ({currentVariant.stock} available)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-bold text-red-500">
              <AlertCircle className="w-4 h-4" />
              Selected Variant Out of Stock
            </span>
          )}
        </div>
      )}
    </div>
  );
};
