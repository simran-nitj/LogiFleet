import prisma from "../lib/prisma.js";

// =========================
// CREATE DRIVER
// =========================
export const createDriver = async (data) => {
  const {
    name,
    licenseNumber,
    licenseCategory,
    licenseExpiry,
    contactNumber,
  } = data;

  // Required field validation
  const requiredFields = [
    "name",
    "licenseNumber",
    "licenseCategory",
    "licenseExpiry",
    "contactNumber",
  ];

  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      const error = new Error(`${field} is required`);
      error.code = "VALIDATION_ERROR";
      throw error;
    }
  }

  // Duplicate license number
  const existingDriver = await prisma.driver.findUnique({
    where: {
      licenseNumber,
    },
  });

  if (existingDriver) {
    const error = new Error("License number already exists");
    error.code = "CONFLICT";
    throw error;
  }

  const driver = await prisma.driver.create({
    data: {
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiry: new Date(licenseExpiry),
      contactNumber,
    },
  });

  return driver;
};

// =========================
// GET ALL DRIVERS
// =========================
export const getDrivers = async (query) => {
  const { status, licenseCategory, search } = query;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (licenseCategory) {
    where.licenseCategory = licenseCategory;
  }

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        licenseNumber: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        contactNumber: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const drivers = await prisma.driver.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return drivers;
};

// =========================
// GET AVAILABLE DRIVERS
// =========================
export const getAvailableDrivers = async () => {
  const drivers = await prisma.driver.findMany({
    where: {
      status: "AVAILABLE",
      licenseExpiry: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return drivers;
};

// =========================
// GET DRIVER BY ID
// =========================
export const getDriverById = async (id) => {
  const driver = await prisma.driver.findUnique({
    where: {
      id,
    },
  });

  if (!driver) {
    const error = new Error("Driver not found");
    error.code = "NOT_FOUND";
    throw error;
  }

  return driver;
};

// =========================
// UPDATE DRIVER
// =========================
export const updateDriver = async (id, data, userRole) => {
  const driver = await prisma.driver.findUnique({
    where: {
      id,
    },
  });

  if (!driver) {
    const error = new Error("Driver not found");
    error.code = "NOT_FOUND";
    throw error;
  }

  // Prevent duplicate license number
  if (
    data.licenseNumber &&
    data.licenseNumber !== driver.licenseNumber
  ) {
    const existing = await prisma.driver.findUnique({
      where: {
        licenseNumber: data.licenseNumber,
      },
    });

    if (existing) {
      const error = new Error("License number already exists");
      error.code = "CONFLICT";
      throw error;
    }
  }

  // Only Safety Officer can suspend drivers
  if (
    data.status === "SUSPENDED" &&
    userRole !== "SAFETY_OFFICER"
  ) {
    const error = new Error(
      "Only Safety Officer can suspend drivers"
    );
    error.code = "FORBIDDEN";
    throw error;
  }

  const updatedDriver = await prisma.driver.update({
    where: {
      id,
    },
    data: {
      ...data,
      ...(data.licenseExpiry && {
        licenseExpiry: new Date(data.licenseExpiry),
      }),
    },
  });

  return updatedDriver;
};