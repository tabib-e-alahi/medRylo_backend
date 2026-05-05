import { prisma } from "../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../errors/AppError";
import {
  MedicineRequestStatus,
  MedicineStatus,
} from "../../../generated/prisma/enums";
import { getApprovedPharmacyForUser } from "../inventory/inventory.service";
import {
  ApproveMedicineRequestInput,
  CreateMedicineRequestInput,
  MedicineRequestQueryInput,
  RejectMedicineRequestInput,
} from "./medicine-request.validation";

const medicineRequestInclude = {
  pharmacy: {
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
  medicine: true,
};

export async function createMedicineRequest(userId: string, data: CreateMedicineRequestInput) {
  const pharmacy = await getApprovedPharmacyForUser(userId);

  return prisma.medicineRequest.create({
    data: {
      pharmacyId: pharmacy.id,
      requestedName: data.requestedName,
      genericName: data.genericName || null,
      categorySuggestion: data.categorySuggestion || null,
      typeSuggestion: data.typeSuggestion || null,
      unitSuggestion: data.unitSuggestion || null,
      strength: data.strength || null,
      companyName: data.companyName || null,
      note: data.note || null,
    },
    include: medicineRequestInclude,
  });
}

export async function getMyMedicineRequests(userId: string, query: MedicineRequestQueryInput) {
  const pharmacy = await getApprovedPharmacyForUser(userId);
  return getMedicineRequests({ ...query, pharmacyId: pharmacy.id });
}

export async function getAdminMedicineRequests(query: MedicineRequestQueryInput) {
  return getMedicineRequests(query);
}

async function getMedicineRequests(query: MedicineRequestQueryInput & { pharmacyId?: string }) {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
    pharmacyId,
  } = query;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (pharmacyId) where.pharmacyId = pharmacyId;
  if (status) where.status = status;

  if (searchTerm) {
    where.OR = [
      { requestedName: { contains: searchTerm, mode: "insensitive" } },
      { genericName: { contains: searchTerm, mode: "insensitive" } },
      { companyName: { contains: searchTerm, mode: "insensitive" } },
      { note: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const [requests, total] = await Promise.all([
    prisma.medicineRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: medicineRequestInclude,
    }),
    prisma.medicineRequest.count({ where }),
  ]);

  return {
    requests,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function approveMedicineRequest(id: string, input: ApproveMedicineRequestInput) {
  const request = await prisma.medicineRequest.findUnique({
    where: { id },
  });

  if (!request) {
    throw new NotFoundError("Medicine request not found.");
  }

  if (request.status !== MedicineRequestStatus.PENDING) {
    throw new BadRequestError("Only pending medicine requests can be approved.");
  }

  const medicinePayload = input.medicine ?? {};

  return prisma.$transaction(async (tx) => {
    const medicineData: any = {
      name: medicinePayload.name || request.requestedName,
      genericName: medicinePayload.genericName || request.genericName,
      strength: medicinePayload.strength || request.strength,
      price: medicinePayload.price ?? 0,
      supplierPrice: medicinePayload.supplierPrice ?? null,
      description:
        medicinePayload.description ||
        [request.companyName ? `Company: ${request.companyName}` : null, request.note]
          .filter(Boolean)
          .join("\n") ||
        null,
      status: MedicineStatus.ACTIVE,
    };

    if (medicinePayload.categoryId) medicineData.categoryId = medicinePayload.categoryId;
    if (medicinePayload.typeId) medicineData.typeId = medicinePayload.typeId;
    if (medicinePayload.unitId) medicineData.unitId = medicinePayload.unitId;
    if (medicinePayload.supplierId) medicineData.supplierId = medicinePayload.supplierId;

    const medicine = await tx.medicine.create({
      data: medicineData,
    });

    return tx.medicineRequest.update({
      where: { id },
      data: {
        status: MedicineRequestStatus.APPROVED,
        adminNote: input.adminNote || null,
        medicineId: medicine.id,
      },
      include: medicineRequestInclude,
    });
  });
}

export async function rejectMedicineRequest(id: string, input: RejectMedicineRequestInput) {
  const request = await prisma.medicineRequest.findUnique({
    where: { id },
  });

  if (!request) {
    throw new NotFoundError("Medicine request not found.");
  }

  if (request.status !== MedicineRequestStatus.PENDING) {
    throw new BadRequestError("Only pending medicine requests can be rejected.");
  }

  return prisma.medicineRequest.update({
    where: { id },
    data: {
      status: MedicineRequestStatus.REJECTED,
      adminNote: input.adminNote,
    },
    include: medicineRequestInclude,
  });
}
