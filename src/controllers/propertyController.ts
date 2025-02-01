import { Request, Response, NextFunction } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";
import propertyModel from "../models/propertyModel";

export const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice,
    } = req.query;

    const query: any = {};
    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice as string);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice as string);
      }
    }

    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort: { createdAt: -1 },
      populate: [
        { path: "ratings", select: "-__v" },
        { path: "comments", select: "-__v" },
      ],
    };

    const properties = await propertyModel.paginate(query, options);

    if (properties.docs.length === 0) {
      sendErrorResponse(res, 404, "No properties found");
      return;
    }
    sendSuccessResponse(res, "Properties retrieved successfully", properties);
  } catch (error) {
    next(error);
  }
};

export const postProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      description,
      price,
      location,
      status,
      priceDuration,
      category,
      bedrooms,
      facilities,
      images,
    } = req.body;

    const requiredFields = [
      "title",
      "description",
      "price",
      "priceDuration",
      "location",
      "category",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      sendErrorResponse(res, 400, `Missing required fields: ${missingFields}`);
      return;
    }

    const property = await propertyModel.create({
      title,
      description,
      price,
      priceDuration,
      location,
      status,
      category,
      bedrooms,
      facilities,
      images,
    });

    sendSuccessResponse(res, "Property created successfully", property);
  } catch (error) {
    next(error);
  }
};

export const getSingleProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const property = await propertyModel
      .findById(id)
      .populate({ path: "ratings", select: "-__v" })
      .populate({ path: "comments", select: "-__v" });

    if (!property) {
      sendErrorResponse(res, 404, "Property not found");
      return;
    }

    const propertyData = {
      ...property.toObject(),
      ratings: (property as any).ratings || [],
      comments: (property as any).comments || [],
    };

    sendSuccessResponse(res, "Property retrieved successfully", propertyData);
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      description,
      price,
      priceDuration,
      location,
      status,
      category,
      bedrooms,
      facilities,
      images,
    } = req.body;

    const property = await propertyModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price,
        priceDuration,
        location,
        status,
        category,
        bedrooms,
        facilities,
        images,
      },
      { new: true }
    );

    if (!property) {
      sendErrorResponse(res, 404, "Property not found");
      return;
    }

    sendSuccessResponse(res, "Property updated successfully", property);
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await propertyModel.findByIdAndDelete(req.params.id);

    if (!property) {
      sendErrorResponse(res, 404, "Property not found");
      return;
    }

    sendSuccessResponse(res, "Property deleted successfully");
  } catch (error) {
    next(error);
  }
};
