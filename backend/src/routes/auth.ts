import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// 模拟用户数据库
const users: any[] = [
  {
    id: uuidv4(),
    phone: '13800138000',
    name: '管理员',
    role: 'admin',
    password: bcrypt.hashSync('123456', 10),
    status: 'active',
  },
];

// 手机号登录
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        code: 400,
        message: '手机号和密码不能为空',
        timestamp: new Date().toISOString(),
      });
    }

    // 查找用户
    const user = users.find((u) => u.phone === phone);

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在',
        timestamp: new Date().toISOString(),
      });
    }

    // 验证密码
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '密码错误',
        timestamp: new Date().toISOString(),
      });
    }

    // 生成 JWT Token
    const token = jwt.sign(
      {
        userId: user.id,
        phone: user.phone,
        role: user.role,
      },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '登录失败',
      timestamp: new Date().toISOString(),
    });
  }
});

// 注册
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { phone, name, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        code: 400,
        message: '参数不完整',
        timestamp: new Date().toISOString(),
      });
    }

    // 检查用户是否已存在
    if (users.find((u) => u.phone === phone)) {
      return res.status(400).json({
        code: 400,
        message: '用户已存在',
        timestamp: new Date().toISOString(),
      });
    }

    // 创建新用户
    const newUser = {
      id: uuidv4(),
      phone,
      name: name || '新用户',
      password: bcrypt.hashSync(password, 10),
      role: 'staff',
      status: 'active',
    };

    users.push(newUser);

    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: {
        id: newUser.id,
        phone: newUser.phone,
        name: newUser.name,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '注册失败',
      timestamp: new Date().toISOString(),
    });
  }
});

// 获取当前用户信息
router.get('/me', (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未授权',
        timestamp: new Date().toISOString(),
      });
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    );

    const user = users.find((u) => u.id === decoded.userId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: 'Token 无效',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
