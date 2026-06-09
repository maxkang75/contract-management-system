-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100),
    department VARCHAR(100),
    role VARCHAR(50) DEFAULT 'staff',
    status VARCHAR(20) DEFAULT 'active',
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建 contracts 表
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    customer VARCHAR(200),
    amount DECIMAL(15, 2),
    currency VARCHAR(10) DEFAULT 'CNY',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    contract_type VARCHAR(50),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建 payment_nodes 表
CREATE TABLE IF NOT EXISTS payment_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id),
    node_name VARCHAR(200),
    percentage DECIMAL(5, 2),
    amount DECIMAL(15, 2),
    due_date TIMESTAMP,
    received_amount DECIMAL(15, 2) DEFAULT 0,
    received_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建 projects 表
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id),
    project_name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    budget DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2) DEFAULT 0,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建 task_assignments 表
CREATE TABLE IF NOT EXISTS task_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    task_name VARCHAR(200),
    assigned_to UUID REFERENCES users(id),
    assigned_date TIMESTAMP,
    due_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'assigned',
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建 payment_requests 表
CREATE TABLE IF NOT EXISTS payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    contract_id UUID REFERENCES contracts(id),
    request_number VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(15, 2),
    reason TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建 approval_steps 表
CREATE TABLE IF NOT EXISTS approval_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_request_id UUID REFERENCES payment_requests(id),
    approval_order INTEGER,
    approver_id UUID REFERENCES users(id),
    approver_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    comments TEXT,
    action_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建 financial_records 表
CREATE TABLE IF NOT EXISTS financial_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50),
    amount DECIMAL(15, 2),
    description TEXT,
    related_contract_id UUID REFERENCES contracts(id),
    record_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建 attachments 表
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    payment_request_id UUID REFERENCES payment_requests(id),
    file_path VARCHAR(500),
    file_name VARCHAR(200),
    file_size INTEGER,
    file_type VARCHAR(50),
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_customer ON contracts(customer);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_contract_id ON projects(contract_id);
CREATE INDEX idx_payment_requests_status ON payment_requests(status);
CREATE INDEX idx_approval_steps_payment_request_id ON approval_steps(payment_request_id);
CREATE INDEX idx_financial_records_type ON financial_records(type);
