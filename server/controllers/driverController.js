import * as driverService from "../services/driverService.js";

// =============================
// CREATE DRIVER
// =============================
export const createDriver = async (req, res) => {
  try {
    const driver = await driverService.createDriver(req.body);

    return res.status(201).json({
      success: true,
      data: {
        driver,
      },
    });
  } catch (error) {
    const statusMap = {
      VALIDATION_ERROR: 400,
      CONFLICT: 409,
    };

    return res.status(statusMap[error.code] || 500).json({
      success: false,
      error: {
        code: error.code || "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
  }
};

// =============================
// GET ALL DRIVERS
// =============================
export const getDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getDrivers(req.query);

    return res.status(200).json({
      success: true,
      data: {
        drivers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
  }
};

// =============================
// GET AVAILABLE DRIVERS
// =============================
export const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getAvailableDrivers();

    return res.status(200).json({
      success: true,
      data: {
        drivers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
  }
};

// =============================
// GET DRIVER BY ID
// =============================
export const getDriverById = async (req, res) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);

    return res.status(200).json({
      success: true,
      data: {
        driver,
      },
    });
  } catch (error) {
    const statusMap = {
      NOT_FOUND: 404,
    };

    return res.status(statusMap[error.code] || 500).json({
      success: false,
      error: {
        code: error.code || "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
  }
};

// =============================
// UPDATE DRIVER
// =============================
export const updateDriver = async (req, res) => {
  try {
    const driver = await driverService.updateDriver(
      req.params.id,
      req.body,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      data: {
        driver,
      },
    });
  } catch (error) {
    const statusMap = {
      NOT_FOUND: 404,
      CONFLICT: 409,
      VALIDATION_ERROR: 400,
      FORBIDDEN: 403,
    };

    return res.status(statusMap[error.code] || 500).json({
      success: false,
      error: {
        code: error.code || "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
  }
};