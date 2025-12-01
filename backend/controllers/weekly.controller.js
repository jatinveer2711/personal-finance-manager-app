import mongoose from "mongoose";
import Transaction from "../Models/Transaction.js";

export const getWeeklyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 6);

    // 🧩 Step 1: Aggregate income/expense for last 7 days
    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: lastWeek, $lte: today },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          totalExpense: {
            $sum: {
              $cond: [
                { $eq: [{ $toLower: "$type" }, "expense"] },
                "$amount",
                0,
              ],
            },
          },
          totalIncome: {
            $sum: {
              $cond: [
                { $eq: [{ $toLower: "$type" }, "income"] },
                "$amount",
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 🧠 Step 2: Create day labels (Mongo $dayOfWeek: Sunday=1 → Saturday=7)
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // 🧩 Step 3: Map all 7 days, fill missing ones with 0
    const weekHistory = daysOfWeek.map((day, i) => {
      const dayData = summary.find((s) => s._id === i + 1); // 👈 +1 because MongoDB returns 1–7
      return {
        day,
        totalIncome: dayData ? dayData.totalIncome : 0,
        totalExpense: dayData ? dayData.totalExpense : 0,
      };
    });

    return res.status(200).json(weekHistory);
  } catch (error) {
    console.error("Error in getWeeklyTransactions:", error);
    return res.status(500).json({ message: error.message });
  }
};
