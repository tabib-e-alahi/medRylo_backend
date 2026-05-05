import { Prisma } from "../../../generated/prisma/client";
import {
  MedicineStatus,
  PharmacyInventoryStatus,
  PharmacyStatus,
} from "../../../generated/prisma/enums";
import { NotFoundError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type {
  PublicMedicineQuery,
  PublicPharmacyQuery,
} from "./public-discovery.validation";

const toNumber = (value: Prisma.Decimal | number | null | undefined) =>
  value === null || value === undefined ? null : Number(value);

const publicInventoryWhere = {
  status: PharmacyInventoryStatus.ACTIVE,
  stockQuantity: { gt: 0 },
  pharmacy: {
    status: PharmacyStatus.APPROVED,
  },
} satisfies Prisma.PharmacyInventoryWhereInput;

const medicineCardSelect = {
  id: true,
  name: true,
  genericName: true,
  strength: true,
  image: true,
  description: true,
  createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  type: { select: { id: true, name: true } },
  unit: { select: { id: true, name: true, symbol: true } },
  inventory: {
    where: publicInventoryWhere,
    select: {
      pharmacyId: true,
      stockQuantity: true,
      sellingPrice: true,
      pharmacy: {
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          logo: true,
        },
      },
    },
  },
} satisfies Prisma.MedicineSelect;

const pharmacyPublicSelect = {
  id: true,
  name: true,
  pharmacyType: true,
  establishedYear: true,
  openingHours: true,
  website: true,
  phone: true,
  address: true,
  logo: true,
  createdAt: true,
} satisfies Prisma.PharmacySelect;

function summarizeMedicine(medicine: any) {
  const prices = medicine.inventory.map((item: any) => Number(item.sellingPrice));
  const pharmacyIds = new Set(medicine.inventory.map((item: any) => item.pharmacyId));
  const totalStock = medicine.inventory.reduce(
    (sum: number, item: any) => sum + item.stockQuantity,
    0
  );

  return {
    id: medicine.id,
    name: medicine.name,
    genericName: medicine.genericName,
    strength: medicine.strength,
    image: medicine.image,
    description: medicine.description,
    createdAt: medicine.createdAt,
    category: medicine.category,
    type: medicine.type,
    unit: medicine.unit,
    availablePharmacyCount: pharmacyIds.size,
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
    totalStock,
    availabilityStatus: totalStock > 0 ? "In Stock" : "Out of Stock",
  };
}

function buildMedicineWhere(query: PublicMedicineQuery): Prisma.MedicineWhereInput {
  const inventoryWhere: Prisma.PharmacyInventoryWhereInput = {
    ...publicInventoryWhere,
  };

  if (query.pharmacyId) inventoryWhere.pharmacyId = query.pharmacyId;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    inventoryWhere.sellingPrice = {
      ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
      ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
    };
  }
  if (query.availability === "lowStock") {
    inventoryWhere.stockQuantity = {
      gt: 0,
      lte: prisma.pharmacyInventory.fields.lowStockAlertQuantity,
    };
  }

  const where: Prisma.MedicineWhereInput = {
    isDeleted: false,
    status: MedicineStatus.ACTIVE,
    inventory: { some: inventoryWhere },
  };

  if (query.searchTerm) {
    where.OR = [
      { name: { contains: query.searchTerm, mode: "insensitive" } },
      { genericName: { contains: query.searchTerm, mode: "insensitive" } },
      { strength: { contains: query.searchTerm, mode: "insensitive" } },
      { description: { contains: query.searchTerm, mode: "insensitive" } },
    ];
  }
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.typeId) where.typeId = query.typeId;

  return where;
}

function medicineOrderBy(query: PublicMedicineQuery): Prisma.MedicineOrderByWithRelationInput {
  if (query.sortBy === "name") return { name: query.sortOrder ?? "asc" };
  if (query.sortBy === "recent") return { createdAt: query.sortOrder ?? "desc" };
  return { createdAt: "desc" };
}

export async function getPublicMedicineFilters() {
  const [categories, types, pharmacies] = await Promise.all([
    prisma.category.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        medicines: { some: { inventory: { some: publicInventoryWhere } } },
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.medicineType.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        medicines: { some: { inventory: { some: publicInventoryWhere } } },
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.pharmacy.findMany({
      where: {
        status: PharmacyStatus.APPROVED,
        inventory: { some: publicInventoryWhere },
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, address: true },
    }),
  ]);

  return { categories, types, pharmacies };
}

export async function getPublicMedicines(query: PublicMedicineQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;
  const skip = (page - 1) * limit;
  const where = buildMedicineWhere(query);

  const shouldSortByPrice = query.sortBy === "price";

  const medicineFindArgs: Prisma.MedicineFindManyArgs = {
      where,
      skip: shouldSortByPrice ? 0 : skip,
      orderBy: medicineOrderBy(query),
      select: medicineCardSelect,
    };
  if (!shouldSortByPrice) medicineFindArgs.take = limit;

  const [total, records] = await Promise.all([
    prisma.medicine.count({ where }),
    prisma.medicine.findMany(medicineFindArgs),
  ]);

  let medicines = records.map(summarizeMedicine);
  if (shouldSortByPrice) {
    const direction = query.sortOrder === "desc" ? -1 : 1;
    medicines = medicines
      .sort((a, b) => ((a.minPrice ?? 0) - (b.minPrice ?? 0)) * direction)
      .slice(skip, skip + limit);
  }

  return {
    medicines,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPublicMedicineDetails(id: string) {
  const medicine = await prisma.medicine.findFirst({
    where: {
      id,
      isDeleted: false,
      status: MedicineStatus.ACTIVE,
      inventory: { some: publicInventoryWhere },
    },
    select: {
      ...medicineCardSelect,
      boxSize: true,
      vat: true,
      leafSetting: {
        select: {
          id: true,
          name: true,
          leavesPerStrip: true,
          stripsPerBox: true,
        },
      },
      inventory: {
        where: publicInventoryWhere,
        orderBy: [{ sellingPrice: "asc" }, { updatedAt: "desc" }],
        select: {
          id: true,
          pharmacyId: true,
          stockQuantity: true,
          sellingPrice: true,
          expiryDate: true,
          shelf: true,
          pharmacy: { select: pharmacyPublicSelect },
        },
      },
    },
  });

  if (!medicine) throw new NotFoundError("Medicine not found");

  const pharmacyMap = new Map<string, any>();
  for (const item of medicine.inventory) {
    const existing = pharmacyMap.get(item.pharmacyId);
    if (existing) {
      existing.stockQuantity += item.stockQuantity;
      existing.minPrice = Math.min(existing.minPrice, Number(item.sellingPrice));
      existing.maxPrice = Math.max(existing.maxPrice, Number(item.sellingPrice));
      continue;
    }
    pharmacyMap.set(item.pharmacyId, {
      pharmacy: item.pharmacy,
      stockQuantity: item.stockQuantity,
      minPrice: Number(item.sellingPrice),
      maxPrice: Number(item.sellingPrice),
      expiryDate: item.expiryDate,
      shelf: item.shelf,
    });
  }

  const relatedWhere: Prisma.MedicineWhereInput = {
    id: { not: medicine.id },
    isDeleted: false,
    status: MedicineStatus.ACTIVE,
    inventory: { some: publicInventoryWhere },
  };
  const relatedOr: Prisma.MedicineWhereInput[] = [
    ...(medicine.category?.id ? [{ categoryId: medicine.category.id }] : []),
    ...(medicine.type?.id ? [{ typeId: medicine.type.id }] : []),
  ];
  if (relatedOr.length) relatedWhere.OR = relatedOr;

  const related = await prisma.medicine.findMany({
    where: relatedWhere,
    take: 4,
    orderBy: { createdAt: "desc" },
    select: medicineCardSelect,
  });

  return {
    ...summarizeMedicine(medicine),
    boxSize: medicine.boxSize,
    vat: toNumber(medicine.vat),
    leafSetting: medicine.leafSetting,
    availablePharmacies: Array.from(pharmacyMap.values()),
    relatedMedicines: related.map(summarizeMedicine),
  };
}

export async function getPublicPharmacies(query: PublicPharmacyQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;
  const skip = (page - 1) * limit;

  const where: Prisma.PharmacyWhereInput = {
    status: PharmacyStatus.APPROVED,
    inventory: { some: publicInventoryWhere },
  };

  if (query.searchTerm) {
    where.OR = [
      { name: { contains: query.searchTerm, mode: "insensitive" } },
      { address: { contains: query.searchTerm, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.PharmacyOrderByWithRelationInput =
    query.sortBy === "recent"
      ? { createdAt: query.sortOrder ?? "desc" }
      : { name: query.sortOrder ?? "asc" };

  const [pharmacies, total] = await Promise.all([
    prisma.pharmacy.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        ...pharmacyPublicSelect,
        _count: {
          select: {
            inventory: {
              where: publicInventoryWhere,
            },
          },
        },
      },
    }),
    prisma.pharmacy.count({ where }),
  ]);

  return {
    pharmacies: pharmacies.map((pharmacy) => ({
      ...pharmacy,
      availableMedicineCount: pharmacy._count.inventory,
      _count: undefined,
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPublicPharmacyDetails(id: string) {
  const pharmacy = await prisma.pharmacy.findFirst({
    where: {
      id,
      status: PharmacyStatus.APPROVED,
      inventory: { some: publicInventoryWhere },
    },
    select: {
      ...pharmacyPublicSelect,
      inventory: {
        where: {
          status: PharmacyInventoryStatus.ACTIVE,
          stockQuantity: { gt: 0 },
          medicine: {
            isDeleted: false,
            status: MedicineStatus.ACTIVE,
          },
        },
        orderBy: [{ medicine: { name: "asc" } }],
        select: {
          stockQuantity: true,
          sellingPrice: true,
          medicine: {
            select: {
              id: true,
              name: true,
              genericName: true,
              strength: true,
              image: true,
              category: { select: { id: true, name: true, slug: true } },
              type: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!pharmacy) throw new NotFoundError("Pharmacy not found");

  const medicineMap = new Map<string, any>();
  for (const item of pharmacy.inventory) {
    const existing = medicineMap.get(item.medicine.id);
    if (existing) {
      existing.stockQuantity += item.stockQuantity;
      existing.minPrice = Math.min(existing.minPrice, Number(item.sellingPrice));
      existing.maxPrice = Math.max(existing.maxPrice, Number(item.sellingPrice));
      continue;
    }
    medicineMap.set(item.medicine.id, {
      ...item.medicine,
      stockQuantity: item.stockQuantity,
      minPrice: Number(item.sellingPrice),
      maxPrice: Number(item.sellingPrice),
    });
  }

  return {
    ...pharmacy,
    inventory: undefined,
    availableMedicineCount: medicineMap.size,
    medicines: Array.from(medicineMap.values()),
  };
}
