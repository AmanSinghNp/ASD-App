import React from 'react';
import { Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import type { ProductTableProps, Product } from '../../types/product';

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onToggleActive,
  onRemove
}) => {
  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              SKU
            </th>
            <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Stock
            </th>
            <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-blue-50 transition-colors">
              <td className="px-8 py-6 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
              </td>
              <td className="px-8 py-6 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-mono">{product.sku}</div>
              </td>
              <td className="px-8 py-6 whitespace-nowrap">
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {product.category}
                </span>
              </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{formatPrice(product.priceCents)}</div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.stockQty}</div>
                </td>
              <td className="px-8 py-6 whitespace-nowrap">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  product.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.isActive ? 'Active' : 'Hidden'}
                </span>
              </td>
              <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                    aria-label="Edit product"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onToggleActive(product.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      product.isActive 
                        ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-100' 
                        : 'text-green-600 hover:text-green-900 hover:bg-green-100'
                    }`}
                    aria-label={product.isActive ? 'Hide product' : 'Show product'}
                  >
                    {product.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => onRemove(product.id)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-100 transition-colors"
                    aria-label="Remove product"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
