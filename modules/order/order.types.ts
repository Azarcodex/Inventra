export type OrderItemInput = {
  productId: string;
  quantity: number;
};

export type CreateOrderInput = {
  items: OrderItemInput[];
  idempotencyKey?: string;
};
