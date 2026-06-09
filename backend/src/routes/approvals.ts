import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const approvals: any[] = [];

// 获取所有审批
router.get('/', (req: Request, res: Response) => {
  res.json({
    code: 200,
    message: '获取成功',
    data: approvals,
    timestamp: new Date().toISOString(),
  });
});

// 创建审批流
router.post('/', (req: Request, res: Response) => {
  try {
    const { payment_request_id, approvers } = req.body;

    const approval = {
      id: uuidv4(),
      payment_request_id,
      steps: approvers.map((approver: any, index: number) => ({
        id: uuidv4(),
        approval_order: index + 1,
        approver_id: approver.id,
        approver_name: approver.name,
        status: 'pending',
      })),
      created_at: new Date(),
      updated_at: new Date(),
    };

    approvals.push(approval);

    res.status(201).json({
      code: 201,
      message: '创建成功',
      data: approval,
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

// 审批
router.post('/:id/approve', (req: Request, res: Response) => {
  try {
    const { step_id, status, comments } = req.body;

    const approval = approvals.find((a) => a.id === req.params.id);

    if (!approval) {
      return res.status(404).json({
        code: 404,
        message: '审批流不存在',
        timestamp: new Date().toISOString(),
      });
    }

    const step = approval.steps.find((s: any) => s.id === step_id);

    if (step) {
      step.status = status;
      step.comments = comments;
      step.action_date = new Date();
    }

    approval.updated_at = new Date();

    res.json({
      code: 200,
      message: '审批成功',
      data: approval,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '审批失败',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
