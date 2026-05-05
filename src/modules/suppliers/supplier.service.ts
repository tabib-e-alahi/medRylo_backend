import { prisma } from "../../lib/prisma";
import { CreateSupplierInput, UpdateSupplierInput } from "./supplier.validation";
import { NotFoundError, ConflictError } from "../../errors/AppError";

export const createSupplier = async (data: CreateSupplierInput) => {
  if (data.email) {
    const existing = await prisma.supplier.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new ConflictError("Supplier with this email already exists");
  }

  return await prisma.supplier.create({
    data: {
      ...data,
      email: data.email || null,
    },
  });
};

export const getAllSuppliers = async (query: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
}) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive,
  } = query;

  const skip = (page - 1) * limit;

  const where: any = {
    isDeleted: false,
  };

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { contactPerson: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
      { phone: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.supplier.count({ where }),
  ]);

  return {
    suppliers,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getSupplierById = async (id: string) => {
  const supplier = await prisma.supplier.findFirst({
    where: { id, isDeleted: false },
  });

  if (!supplier) {
    throw new NotFoundError("Supplier not found");
  }

  return supplier;
};

export const updateSupplier = async (id: string, data: UpdateSupplierInput) => {
  await getSupplierById(id);

  if (data.email) {
    const existing = await prisma.supplier.findFirst({
      where: { email: data.email, id: { not: id } },
    });
    if (existing) throw new ConflictError("Email already in use");
  }

  return await prisma.supplier.update({
    where: { id },
    data: {
      ...data,
      email: data.email || null,
    },
  });
};

export const deleteSupplier = async (id: string) => {
  await getSupplierById(id);

  return await prisma.supplier.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
