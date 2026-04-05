import { supplierRepository } from "./supplier.repository";
import { supplierSchema, SupplierInput } from "./supplier.validator";

export const supplierService = {
  async getAllSuppliers() {
    return supplierRepository.getAll();
  },

  async getSupplierDetails(id: string) {
    const supplier = await supplierRepository.getById(id);
    if (!supplier) throw new Error("Supplier not found");
    return supplier;
  },

  async createSupplier(input: SupplierInput) {
    const validated = supplierSchema.parse(input);
    return supplierRepository.create(validated);
  },

  async updateSupplier(id: string, input: Partial<SupplierInput>) {
    return supplierRepository.update(id, input);
  },

  async toggleSupplierStatus(id: string) {
    const supplier = await supplierRepository.getById(id);
    if (!supplier) throw new Error("Supplier not found");
    return supplierRepository.setStatus(id, !supplier.isActive);
  }
};
