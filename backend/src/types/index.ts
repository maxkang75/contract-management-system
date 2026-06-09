// 用户类型
export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  department?: string;
  role: 'admin' | 'manager' | 'staff' | 'finance';
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

// 合同类型
export interface Contract {
  id: string;
  contract_number: string;
  name: string;
  customer: string;
  amount: number;
  currency: string;
  start_date: Date;
  end_date: Date;
  status: 'draft' | 'active' | 'completed' | 'terminated';
  contract_type: 'service' | 'supply' | 'construction' | 'other';
  payment_terms: PaymentNode[];
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

// 收款节点
export interface PaymentNode {
  id: string;
  contract_id: string;
  node_name: string;
  percentage: number;
  amount: number;
  due_date: Date;
  received_amount: number;
  received_date?: Date;
  status: 'pending' | 'received' | 'overdue';
}

// 项目类型
export interface Project {
  id: string;
  contract_id: string;
  project_name: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'suspended';
  start_date: Date;
  end_date: Date;
  budget: number;
  actual_cost: number;
  progress: number; // 0-100
  created_at: Date;
  updated_at: Date;
}

// 任务派工
export interface TaskAssignment {
  id: string;
  project_id: string;
  task_name: string;
  assigned_to: string;
  assigned_date: Date;
  due_date: Date;
  status: 'assigned' | 'in_progress' | 'completed';
  progress: number;
}

// 请款单
export interface PaymentRequest {
  id: string;
  project_id: string;
  contract_id: string;
  request_number: string;
  amount: number;
  reason: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  approval_flow: ApprovalStep[];
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

// 审批步骤
export interface ApprovalStep {
  id: string;
  payment_request_id?: string;
  approval_order: number;
  approver_id: string;
  approver_name: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  action_date?: Date;
}

// JWT Token Payload
export interface TokenPayload {
  userId: string;
  phone: string;
  role: string;
  iat?: number;
  exp?: number;
}

// API 响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  timestamp: string;
}
