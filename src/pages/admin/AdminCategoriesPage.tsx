import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { Category, Subcategory } from '../../types/product';
import { ConfirmModal } from '../../components/admin/common/ConfirmModal';
import { ImageUploader } from '../../components/common/ImageUploader';
import { Plus, Edit3, Trash2, FolderTree, ChevronRight } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80');

  const handleOpenAdd = () => {
    setName('');
    setSlug('');
    setDesc('');
    setEditingCategory(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDesc(cat.description);
    setImage(cat.image);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name,
        slug: catSlug,
        description: desc,
        image,
      });
    } else {
      addCategory({
        name,
        slug: catSlug,
        description: desc,
        image,
        itemCount: 0,
        subcategories: [],
      });
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Taxonomy</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Category Management ({categories.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <img src={cat.image} alt={cat.name} className="w-20 h-20 rounded-2xl object-cover bg-gray-50 flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-gray-900 truncate">{cat.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-50 text-brand-600">
                    {cat.itemCount} Items
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{cat.description}</p>
                <div className="text-[11px] font-mono text-gray-400">Slug: /{cat.slug}</div>
              </div>
            </div>

            {/* Subcategories preview */}
            <div className="pt-3 border-t border-gray-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Subcategories ({cat.subcategories.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.subcategories.map((sub) => (
                  <span key={sub.id} className="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-semibold text-gray-700">
                    {sub.name} ({sub.itemCount})
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Category
              </button>
              <button
                onClick={() => setDeleteTargetId(cat.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Watches"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="smart-watches"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-semibold"
                />
              </div>

              <ImageUploader
                value={image}
                onChange={setImage}
                label="Category Cover Image"
                aspectRatio="video"
                placeholderText="Upload category thumbnail or banner"
              />

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md">
                  Save Category
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-3 px-5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTargetId && (
        <ConfirmModal
          isOpen={!!deleteTargetId}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={() => deleteCategory(deleteTargetId)}
          title="Delete Category"
          message="Are you sure you want to delete this category? Products inside will remain in catalog."
        />
      )}
    </div>
  );
};
