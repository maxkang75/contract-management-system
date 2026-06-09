import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// 模拟合同数据
const contracts: any[] = [];

// 获取所有合同
router.get('/', (req: Request, res: Response) => {
  res.json({
    code: 200,
    message: '获取成功',
    data: contracts,
    timestamp: new Date().toISOString(),
  });
});

// 创建合同
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, customer, amount, start_date, end_date, contract_type } =
      req.body;

    const contract = {
      id: uuidv4(),
      contract_number: `CT${Date.now()}`,
      name,
      customer,
      amount,
      currency: 'CNY',
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      status: 'active',
      contract_type,
      payment_terms: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    contracts.push(contract);

    res.status(201).json({
      code: 201,
      message: '创建成功',
      data: contract,
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

// 获��合同详情
router.get('/:id', (req: Request, res: Response) => {
  const contract = contracts.find((c) => c.id === req.params.id);

  if (!contract) {
    return res.status(404).json({
      code: 404,
      message: '合同不存在',
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    code: 200,
    message: '获取成功',
    data: contract,
    timestamp: new Date().toISOString(),
  });
});

// 更新合同
router.put('/:id', (req: Request, res: Response) => {
  const contract = contracts.find((c) => c.id === req.params.id);

  if (!contract) {
    return res.status(404).json({
      code: 404,
      message: '合同不存在',
      timestamp: new Date().toISOString(),
    });
  }

  Object.assign(contract, req.body, { updated_at: new Date() });

  res.json({
    code: 200,
    message: '更新成功',
    data: contract,
    timestamp: new Date().toISOString(),
  });
});

export default router;
