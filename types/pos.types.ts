export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CreateOrderInput {
  items: {
    productId: string;
    quantity: number;
  }[];
}
