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
    const wDemo = weights.demographic ?? 0.2; // reserved for future

    try {
      // ENVIRONMENT SIMILARITY
      const envRes = await axios.get(
        "https://renewably-pushy-preachy.ngrok-free.dev/generate",
        {
          params: {
            lat,
            lon,
            amenity_type: `"${amenityType}"`,
          },
        },
      );

      const environmentScore = envRes.data?.similarity_score ?? 0;

      // FLOOD RISK SCORE
      const floodRes = await axios.get(
        "https://mrc-flood-score.onrender.com/generate",
        {
          params: { lat, lon },
        },
      );

      const rawFloodRisk = floodRes.data?.flood_risk_score ?? 0;

      // invert risk → higher is better
      const floodScore = 1 - rawFloodRisk;

      // DEMOGRAPHIC SCORE
      const demographicScore = 0; // placeholder

      // 4. FINAL WEIGHTED SCORE
      const finalScore =
        wFlood * floodScore +
        wEnv * environmentScore +
        wDemo * demographicScore;

      return {
        finalScore,
        floodScore,
        environmentScore,
        demographicScore,
        details: {
          environment: envRes.data,
          flood: floodRes.data,
          demographic: demographicScore,
        },
      };
    } catch (err: any) {
      throw new AppError(
        err?.response?.data?.message || "Failed to compute location score",
        500,
      );
    }
  }
}

export default new LocationServices();
