import { prisma } from "../../lib/prisma";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.validation";
import { NotFoundError, ConflictError } from "../../errors/AppError";

export const createCategory = async (data: CreateCategoryInput) => {
  const existing = await prisma.category.findUnique({
    where: { slug: data.slug },
  });

  if (existing) {
    if (existing.isDeleted) {
      // Restore soft deleted category if needed, or just throw conflict
      // For now, let's throw conflict as slug must be unique
      throw new ConflictError("A category with this slug already exists (even if deleted)");
    }
    throw new ConflictError("Category already exists with this slug");
  }

  return await prisma.category.create({
    data,
  });
};

export const getAllCategories = async (query: {
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
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.category.count({ where }),
  ]);

  return {
    categories,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: { id, isDeleted: false },
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  return category;
};

export const updateCategory = async (id: string, data: UpdateCategoryInput) => {
  const category = await getCategoryById(id);

  if (data.slug && data.slug !== category.slug) {
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });
    if (existing) throw new ConflictError("Slug already in use");
  }

  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  await getCategoryById(id);

  return await prisma.category.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
