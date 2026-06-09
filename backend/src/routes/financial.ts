import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const financialRecords: any[] = [];

// 获取财务记录
router.get('/records', (req: Request, res: Response) => {
  res.json({
    code: 200,
    message: '获取成功',
    data: financialRecords,
    timestamp: new Date().toISOString(),
  });
});

// 创建财务记录
router.post('/records', (req: Request, res: Response) => {
  try {
    const { type, amount, description, related_contract_id } = req.body;

    const record = {
      id: uuidv4(),
      type, // 'income' | 'expense'
      amount,
      description,
      related_contract_id,
      record_date: new Date(),
      created_at: new Date(),
    };

    financialRecords.push(record);

    res.status(201).json({
      code: 201,
      message: '创建成功',
      data: record,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '创建失败',
      timestamp: new Date().toISOString(),
    });
  }
});

// 获取财务统计
router.get('/summary', (req: Request, res: Response) => {
  const income = financialRecords
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const expense = financialRecords
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  res.json({
    code: 200,
    message: '获取成功',
    data: {
      total_income: income,
      total_expense: expense,
      profit: income - expense,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
