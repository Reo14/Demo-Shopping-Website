import { Product } from './product.models';

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: Product; // 确保关联到完整的 Product 对象
}