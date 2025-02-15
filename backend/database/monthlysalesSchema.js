import Mongoose from "mongoose";
import { getDaysInMonth, toDate, format, addDays, getDay } from "date-fns";

const dailySaleSchema = new Mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  sales: {
    type: Number,
    required: true,
  },
  isWorkingDay: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  weekday: {
    type: String,
    required: true,
  },
  holiday: {
    type: String,
  },
});

const monthlySalesSchema = new Mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  plannedSales: {
    type: Number,
    required: true,
  },
  actualSales: {
    type: Number,
    required: true,
  },
  workingDaysCount: {
    type: Number,
    required: true,
    alias: "workingDays",
  },
  dailySales: [dailySaleSchema],
});

const MonthlySales = Mongoose.model("2024", monthlySalesSchema);

function getDailyDataForMonth(year, month) {
  const startDateOfMonth = new Date(year, month - 1, 1);
  const endDateOfMonth = new Date(year, month, 0);
  const dailySales = [];

  let currentDate = startDateOfMonth;
  let workingDaysCount = 0;

  while (currentDate <= endDateOfMonth) {
    const dayOfMonth = currentDate.getDate();
    const dateOnly = toDate(currentDate);
    const weekday = format(currentDate, "EEEE", { locale: de });
    const isWorkingDay = getDay(currentDate) !== 0;

    dailySales.push(
      new dailySaleSchema({
        day: dayOfMonth,
        sales: 0,
        isWorkingDay: isWorkingDay,
        date: dateOnly,
        weekday: weekday,
      })
    );
    if (isWorkingDay) workingDaysCount++;
    currentDate = addDays(currentDate, 1);
  }
  return {
    dailySales: dailySales,
    workingDaysCount: workingDaysCount,
  };
}

export async function createSalesDataInMonth(year, month, plannedSales) {
  try {
    const dailyDataResult = getDailyDataForMonth(year, month);

    if (!dailyDataResult) {
      throw new Error("Failed to generate daily data for the month.");
    }

    const dailySales = dailyDataResult.dailySales;
    const workingDaysCount = dailyDataResult.workingDaysCount;

    return new MonthlySales({
      year,
      month,
      plannedSales,
      actualSales: 0,
      workingDaysCount: workingDaysCount,
      dailySales: dailySales,
    }).save();
  } catch (error) {
    console.error("Error creating monthly sales data:", error);
    throw error;
  }
}

export async function getSales(year, month) {
  try {
    return await MonthlySales.findOne({ year, month });
  } catch (error) {
    console.error("Error fetching sales data from database:", error);
  }
  throw error;
}

export async function fetchAvailableMonths() {
  try {
    const availableMonths = await MonthlySales.aggregate([
      {
        $project: {
          _id: 0,
          yearMonth: {
            $concat: [
              { $toString: "$year" },
              {
                $cond: {
                  if: { $lt: ["$month", 10] },
                  then: { $concat: ["0", { $toString: "$month" }] },
                  else: { $toString: "$month" },
                },
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$yearMonth",
        },
      },
      {
        $project: {
          _id: 0,
          yearMonth: "$_id",
        },
      },
      {
        $sort: { yearMonth: 1 },
      },
    ]);

    // [{yearMonth: '202501'}, ...] -> ['202501', ...]
    const result = availableMonths.map((item) => item.yearMonth);
    return result;
  } catch (error) {
    console.error("Error fetching available months:", error);
    throw error;
  }
}
