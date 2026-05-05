import { prisma } from "../../lib/prisma";
import { PharmacyStatus } from "../../../generated/prisma/enums";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../errors/AppError";
import { deleteFromCloudinary, deleteFromCloudinaryByPublicId } from "../../utils/claudinary";

/**
 * Get pharmacy by user ID
 */
export async function getPharmacyByUserId(userId: string) {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { ownerId: userId },
  });
  return pharmacy;
}

/**
 * Create a new pharmacy profile
 */
export async function createPharmacy(userId: string, data: any) {
  const existing = await prisma.pharmacy.findUnique({
    where: { ownerId: userId },
  });

  if (existing) {
    throw new BadRequestError("Pharmacy profile already exists for this user");
  }

  return prisma.pharmacy.create({
    data: {
      ...data,
      ownerId: userId,
      status: PharmacyStatus.PENDING,
    },
  });
}

/**
 * Get all pending pharmacies (Admin only)
 */
export async function getPendingPharmacies() {
  return prisma.pharmacy.findMany({
    where: { status: PharmacyStatus.PENDING },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Approve a pharmacy (Admin only)
 */
export async function approvePharmacy(id: string) {
  const pharmacy = await prisma.pharmacy.findUnique({ where: { id } });

  if (!pharmacy) {
    throw new NotFoundError("Pharmacy not found");
  }

  if (pharmacy.status === PharmacyStatus.APPROVED) {
    throw new BadRequestError("Pharmacy is already approved");
  }

  return prisma.pharmacy.update({
    where: { id },
    data: {
      status: PharmacyStatus.APPROVED,
      rejectionReason: null,
    },
  });
}

/**
 * Reject a pharmacy (Admin only)
 */
export async function rejectPharmacy(id: string, reason: string) {
  const pharmacy = await prisma.pharmacy.findUnique({ where: { id } });

  if (!pharmacy) {
    throw new NotFoundError("Pharmacy not found");
  }

  return prisma.pharmacy.update({
    where: { id },
    data: {
      status: PharmacyStatus.REJECTED,
      rejectionReason: reason,
    },
  });
}

/**
 * Resubmit pharmacy information
 */
export async function resubmitPharmacy(userId: string, data: any) {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { ownerId: userId },
  });

  if (!pharmacy) {
    throw new NotFoundError("Pharmacy profile not found");
  }

  if (pharmacy.status !== PharmacyStatus.REJECTED) {
    throw new BadRequestError("Only rejected pharmacies can resubmit");
  }

  if (data.logo && pharmacy.logo && data.logo !== pharmacy.logo) {
    await deleteFromCloudinaryByPublicId(pharmacy.logoPublicId);
    if (!pharmacy.logoPublicId) {
      await deleteFromCloudinary(pharmacy.logo);
    }
  }

  return prisma.pharmacy.update({
    where: { ownerId: userId },
    data: {
      ...data,
      status: PharmacyStatus.PENDING,
      rejectionReason: null,
    },
  });
}
