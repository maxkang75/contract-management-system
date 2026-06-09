import { Router, Request, Response } from 'express';

const router = Router();

// 获取仪表板数据
router.get('/summary', (req: Request, res: Response) => {
  // 这是一个示例，实际需要从数据库查询
  const dashboardData = {
    total_contracts: 0,
    active_contracts: 0,
    total_projects: 0,
    in_progress_projects: 0,
    completed_projects: 0,
    total_income: 0,
    total_expense: 0,
    total_profit: 0,
    receivable: 0,
    payable: 0,
  };

  res.json({
    code: 200,
    message: '获取成功',
    data: dashboardData,
    timestamp: new Date().toISOString(),
  });
});

// 获取图表数据
router.get('/charts', (req: Request, res: Response) => {
  res.json({
    code: 200,
    message: '获取成功',
    data: {
      monthly_income: [],
      project_status_distribution: {},
      contract_type_distribution: {},
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
