import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const projects: any[] = [];

// 获取所有项目
router.get('/', (req: Request, res: Response) => {
  res.json({
    code: 200,
    message: '获取成功',
    data: projects,
    timestamp: new Date().toISOString(),
  });
});

// 创建项目
router.post('/', (req: Request, res: Response) => {
  try {
    const { contract_id, project_name, description, start_date, end_date, budget } = req.body;

    const project = {
      id: uuidv4(),
      contract_id,
      project_name,
      description,
      status: 'planning',
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      budget,
      actual_cost: 0,
      progress: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    projects.push(project);

    res.status(201).json({
      code: 201,
      message: '创建成功',
      data: project,
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

// 获取项目详情
router.get('/:id', (req: Request, res: Response) => {
  const project = projects.find((p) => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({
      code: 404,
      message: '项目不存在',
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    code: 200,
    message: '获取成功',
    data: project,
    timestamp: new Date().toISOString(),
  });
});

// 更新项目
router.put('/:id', (req: Request, res: Response) => {
  const project = projects.find((p) => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({
      code: 404,
      message: '项目不存在',
      timestamp: new Date().toISOString(),
    });
  }

  Object.assign(project, req.body, { updated_at: new Date() });

  res.json({
    code: 200,
    message: '更新成功',
    data: project,
    timestamp: new Date().toISOString(),
  });
});

export default router;
