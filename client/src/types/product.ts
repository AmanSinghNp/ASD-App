export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  priceCents: number;
  stockQty: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  priceCents: number;
  stockQty: number;
  imageUrl: string;
  isActive: boolean;
}

export interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onToggleActive: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
