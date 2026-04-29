import { Types } from "mongoose";
import Bookmark from "../models/bookmark.model";
import AppError from "../utils/appError";
import {
  IBookmark,
  ICombinedScoreResult,
  IScoreWeights,
} from "../@types/interfaces";
import axios from "axios";

class LocationServices {
  async findAllUseBookmarks(userId: Types.ObjectId): Promise<IBookmark[]> {
    return await Bookmark.find({ userId });
  }

  async createBookmark(
    userId: Types.ObjectId,
    coords: { lat: number; lng: number },
    notes: string,
  ): Promise<void> {
    const bookmark = await Bookmark.create({
      userId,
      coords,
      notes,
    });

    if (!bookmark) throw new AppError("Unable to save location", 400);
  }

  async findBookmarkById(bookmarkId: string): Promise<IBookmark> {
    const bookmark = await Bookmark.findById(bookmarkId);
    if (!bookmark) throw new AppError("Bookmark not found", 404);

    return bookmark;
  }

  async updateBookmarkById(
    bookmarkId: string,
    coords: { lat: number; lng: number },
    notes: string,
    userId: Types.ObjectId,
  ): Promise<void> {
    const bookmark = await Bookmark.findOne({ _id: bookmarkId, userId });

    if (!bookmark)
      throw new AppError("Bookmark not found or unauthorized", 404);

    bookmark.coords = coords;
    bookmark.notes = notes;
    await bookmark.save();
  }

  async deleteBookmarkById(
    bookmarkId: string,
    userId: Types.ObjectId,
  ): Promise<void> {
    const deleted = await Bookmark.findOneAndDelete({
      _id: bookmarkId,
      userId,
    });

    if (!deleted) throw new AppError("Bookmark not found or unauthorized", 404);
  }

  async getCombinedLocationScore(
    lat: number,
    lon: number,
    amenityType: string,
    weights: IScoreWeights = {},
  ): Promise<ICombinedScoreResult> {
    const wFlood = weights.flood ?? 0.5;
    const wEnv = weights.environment ?? 0.3;

    // ENVIRONMENT SIMILARITY
    let envRes: any;
    try {
      envRes = await axios.get(
        "https://renewably-pushy-preachy.ngrok-free.dev/generate",
        {
          params: {
            lat,
            lon,
            amenity_type: `"${amenityType}"`,
          },
        },
      );
    } catch (err: any) {
      console.error(
        `[Environment API] Failed for lat: ${lat}, lon: ${lon} —`,
        err?.response?.data || err.message,
      );
      throw new AppError(
        err?.response?.data?.message || "Failed to fetch environment score",
        500,
      );
    }
    const environmentScore: number = envRes.data?.similarity_score ?? 0;

    // FLOOD RISK SCORE
    let floodRes: any;
    try {
      floodRes = await axios.get(
        "https://mrc-flood-score.onrender.com/generate",
        { params: { lat, lon } },
      );
    } catch (err: any) {
      console.error(
        `[Flood API] Failed for lat: ${lat}, lon: ${lon} —`,
        err?.response?.data || err.message,
      );
      throw new AppError(
        err?.response?.data?.message || "Failed to fetch flood risk score",
        500,
      );
    }
    const rawFloodRisk: number = floodRes.data?.flood_risk_score ?? 0;
    const floodScore = 1 - rawFloodRisk;

    // FINAL WEIGHTED SCORE
    const finalScore = wFlood * floodScore + wEnv * environmentScore;

    return {
      finalScore,
      floodScore,
      environmentScore,
      details: {
        environment: envRes.data,
        flood: floodRes.data,
      },
    };
  }
}

export default new LocationServices();
