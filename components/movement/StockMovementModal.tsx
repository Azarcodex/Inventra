import { Modal } from "../ui/Modal";
import { MovementForm } from "./MovementForm";
import { type MovementType } from "@/modules/stock/stock.types";
import { Product } from "@/modules/product/product.types";

interface StockMovementModalProps {
  product: Product | null;
  type: MovementType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StockMovementModal = ({ product, type, isOpen, onClose }: StockMovementModalProps) => {
  if (!product || !type) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <MovementForm 
        product={product} 
        type={type} 
        onSuccess={onClose} 
        onCancel={onClose} 
      />
    </Modal>
  );
};
