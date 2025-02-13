import * as salesRepository from "../database/monthlysalesSchema.js";

export async function getSales(req, res) {
  try {
    const yearMonthParam = req.params.yearMonth;

    if (!yearMonthParam || yearMonthParam.length !== 6) {
      return res
        .status(400)
        .json({ error: "Invalid yearMonth format. Please use YYYYMM." });
    }

    const yearString = yearMonthParam.substring(0, 4);
    const monthString = yearMonthParam.substring(4, 6);

    const year = parseInt(yearString, 10);
    const month = parseInt(monthString, 10);

    if (isNaN(year) || isNaN(month)) {
      return res.status(400).json({
        error: "Invalid yearMonth format. Year and month must be numbers.",
      });
    }

    if (month < 1 || month > 12) {
      return res.status(400).json({
        error: "Invalid month value. Month must be between 1 and 12.",
      });
    }

    const sales = await salesRepository.getSales(year, month);

    if (!sales) {
      return res.status(404).json({
        error: `Sales data not found for year ${year} and month ${month}`,
      });
    }

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error in getSales controller:", error);
    res.status(500).json({ error: "Failed to get sales data" });
  }
}

export async function createSales(req, res) {
  try {
    const { year, month, plannedSales } = req.body;

    if (!year || !month || !plannedSales) {
      return res
        .status(400)
        .json({ error: "Year, month, and plannedSales are required fields." });
    }

    if (isNaN(year) || isNaN(month) || isNaN(plannedSales)) {
      return res
        .status(400)
        .json({ error: "Year, month, and plannedSales must be numbers." });
    }

    if (month < 1 || month > 12) {
      return res.status(400).json({ error: "Month must be between 1 and 12." });
    }

    if (plannedSales < 0) {
      return res
        .status(400)
        .json({ error: "plannedSales cannot be negative." });
    }

    const sales = await salesRepository.createSalesDataInMonth(
      year,
      month,
      plannedSales
    );

    res.status(201).json(sales);
    // res.status(201).json({ message: "Sales data created successfully", sales: sales });
  } catch (error) {
    console.error("Error in createSales controller:", error);

    // **TODO:**  더 상세한 에러 처리 및 응답 (선택 사항 - 상황에 따라 구현)
    // 예: 특정 에러 타입에 따라 다른 상태 코드 및 에러 메시지 응답
    // if (error instanceof CustomValidationError) {
    //   return res.status(400).json({ error: error.message, details: error.details }); // 400 Bad Request - 유효성 검사 실패
    // } else if (error instanceof DatabaseError) {
    //   return res.status(503).json({ error: "Database error occurred. Please try again later." }); // 503 Service Unavailable - 데이터베이스 에러
    // }

    res.status(500).json({ error: "Failed to create sales data" });
  }
}
