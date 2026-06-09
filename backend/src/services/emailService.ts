import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 邮件配置
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

// 创建传输对象
let transporter: nodemailer.Transporter;

try {
  transporter = nodemailer.createTransport(emailConfig);
  console.log('✅ 邮件服务已初始化');
} catch (error) {
  console.error('❌ 邮件服务初始化失败:', error);
}

// 邮件模板类型定义
interface EmailTemplate {
  subject: string;
  html: string;
}

// 邮件模板库
const emailTemplates = {
  // 收款提醒 - 紧急
  paymentUrgent: (data: any): EmailTemplate => ({
    subject: `⚠️ 紧急收款提醒: ${data.contractNumber} - ${data.nodeName}`,
    html: `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; }
            .header { background: #d32f2f; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { background: white; padding: 20px; }
            .alert { background: #ffebee; border-left: 4px solid #d32f2f; padding: 15px; margin: 15px 0; }
            .details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px; }
            .warning-message { color: #d32f2f; font-weight: bold; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🚨 紧急收款通知</h2>
            </div>
            <div class="content">
              <div class="alert">
                <p class="warning-message">${data.warningMessage}</p>
              </div>
              
              <div class="details">
                <h3>收款详情</h3>
                <div class="detail-row">
                  <span class="label">合同编号：</span>
                  <span class="value">${data.contractNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="label">合同名称：</span>
                  <span class="value">${data.contractName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">客户名称：</span>
                  <span class="value">${data.customer}</span>
                </div>
                <div class="detail-row">
                  <span class="label">收款节点：</span>
                  <span class="value">${data.nodeName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">应收金额：</span>
                  <span class="value">¥${(data.amount || 0).toLocaleString('zh-CN')}</span>
                </div>
                <div class="detail-row">
                  <span class="label">应收日期：</span>
                  <span class="value">${data.dueDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">逾期天数：</span>
                  <span class="value" style="color: #d32f2f; font-weight: bold;">${data.daysOverdue} 天</span>
                </div>
              </div>

              <p style="margin-top: 20px; color: #d32f2f; font-weight: bold;">
                📞 请立即联系客户跟进收款！
              </p>
            </div>
            <div class="footer">
              <p>此邮件由合同管理系统自动生成，请勿直接回复</p>
              <p>${new Date().toLocaleString('zh-CN')}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // 收款提醒 - 逾期
  paymentOverdue: (data: any): EmailTemplate => ({
    subject: `⏰ 逾期收款提醒: ${data.contractNumber} - ${data.nodeName}`,
    html: `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; }
            .header { background: #f57c00; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { background: white; padding: 20px; }
            .alert { background: #fff3e0; border-left: 4px solid #f57c00; padding: 15px; margin: 15px 0; }
            .details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px; }
            .warning-message { color: #f57c00; font-weight: bold; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>⏰ 逾期收款通知</h2>
            </div>
            <div class="content">
              <div class="alert">
                <p class="warning-message">${data.warningMessage}</p>
              </div>
              
              <div class="details">
                <h3>收款详情</h3>
                <div class="detail-row">
                  <span class="label">合同编号：</span>
                  <span class="value">${data.contractNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="label">合同名称：</span>
                  <span class="value">${data.contractName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">客户名称：</span>
                  <span class="value">${data.customer}</span>
                </div>
                <div class="detail-row">
                  <span class="label">收款节点：</span>
                  <span class="value">${data.nodeName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">应收金额：</span>
                  <span class="value">¥${(data.amount || 0).toLocaleString('zh-CN')}</span>
                </div>
                <div class="detail-row">
                  <span class="label">应收日期：</span>
                  <span class="value">${data.dueDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">逾期天数：</span>
                  <span class="value" style="color: #f57c00; font-weight: bold;">${data.daysOverdue} 天</span>
                </div>
              </div>

              <p style="margin-top: 20px; color: #f57c00;">
                请及时跟进该笔款项
              </p>
            </div>
            <div class="footer">
              <p>此邮件由合同管理系统自动生成，请勿直接回复</p>
              <p>${new Date().toLocaleString('zh-CN')}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // 收款提醒 - 警告
  paymentWarning: (data: any): EmailTemplate => ({
    subject: `🟡 收款提醒: ${data.contractNumber} - ${data.nodeName}`,
    html: `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; }
            .header { background: #fbc02d; color: #333; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { background: white; padding: 20px; }
            .alert { background: #fffde7; border-left: 4px solid #fbc02d; padding: 15px; margin: 15px 0; }
            .details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px; }
            .warning-message { color: #f57f17; font-weight: bold; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🟡 收款提醒</h2>
            </div>
            <div class="content">
              <div class="alert">
                <p class="warning-message">${data.warningMessage}</p>
              </div>
              
              <div class="details">
                <h3>收款详情</h3>
                <div class="detail-row">
                  <span class="label">合同编号：</span>
                  <span class="value">${data.contractNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="label">合同名称：</span>
                  <span class="value">${data.contractName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">客户名称：</span>
                  <span class="value">${data.customer}</span>
                </div>
                <div class="detail-row">
                  <span class="label">收款节点：</span>
                  <span class="value">${data.nodeName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">应收金额：</span>
                  <span class="value">¥${(data.amount || 0).toLocaleString('zh-CN')}</span>
                </div>
                <div class="detail-row">
                  <span class="label">应收日期：</span>
                  <span class="value">${data.dueDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">距离到期日期：</span>
                  <span class="value" style="color: #f57f17; font-weight: bold;">${data.daysUntilDue} 天</span>
                </div>
              </div>

              <p style="margin-top: 20px;">
                请提前做好收款准备
              </p>
            </div>
            <div class="footer">
              <p>此邮件由合同管理系统自动生成，请勿直接回复</p>
              <p>${new Date().toLocaleString('zh-CN')}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // 收款成功确认
  paymentReceived: (data: any): EmailTemplate => ({
    subject: `✅ 收款确认: ${data.contractNumber} - ${data.nodeName}`,
    html: `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; }
            .header { background: #4caf50; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { background: white; padding: 20px; }
            .success-box { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 15px 0; }
            .details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px; }
            .success-message { color: #4caf50; font-weight: bold; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✅ 收款成功</h2>
            </div>
            <div class="content">
              <div class="success-box">
                <p class="success-message">恭喜！收款已成功办理</p>
              </div>
              
              <div class="details">
                <h3>收款信息</h3>
                <div class="detail-row">
                  <span class="label">合同编号：</span>
                  <span class="value">${data.contractNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="label">合同名称：</span>
                  <span class="value">${data.contractName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">收款节点：</span>
                  <span class="value">${data.nodeName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">应收金额：</span>
                  <span class="value">¥${(data.amount || 0).toLocaleString('zh-CN')}</span>
                </div>
                <div class="detail-row">
                  <span class="label">实收金额：</span>
                  <span class="value" style="color: #4caf50; font-weight: bold;">¥${(data.receivedAmount || 0).toLocaleString('zh-CN')}</span>
                </div>
                <div class="detail-row">
                  <span class="label">应收日期：</span>
                  <span class="value">${data.dueDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">收款日期：</span>
                  <span class="value">${data.receivedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">处理时间：</span>
                  <span class="value">${data.processingDays} 天</span>
                </div>
                <div class="detail-row">
                  <span class="label">备注：</span>
                  <span class="value">${data.notes || '无'}</span>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>此邮件由合同管理系统自动生成，请勿直接回复</p>
              <p>${new Date().toLocaleString('zh-CN')}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // 审批提醒
  approvalPending: (data: any): EmailTemplate => ({
    subject: `📋 审批待办: ${data.paymentRequestId}`,
    html: `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; }
            .header { background: #2196f3; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { background: white; padding: 20px; }
            .info-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 15px 0; }
            .details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📋 待审批通知</h2>
            </div>
            <div class="content">
              <div class="info-box">
                <p>您有一个新的审批待办项</p>
              </div>
              
              <div class="details">
                <h3>审批信息</h3>
                <div class="detail-row">
                  <span class="label">付款申请ID：</span>
                  <span class="value">${data.paymentRequestId}</span>
                </div>
                <div class="detail-row">
                  <span class="label">合同编号：</span>
                  <span class="value">${data.contractNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="label">申请金额：</span>
                  <span class="value">¥${(data.amount || 0).toLocaleString('zh-CN')}</span>
                </div>
                <div class="detail-row">
                  <span class="label">申请人：</span>
                  <span class="value">${data.requester}</span>
                </div>
                <div class="detail-row">
                  <span class="label">审批步骤：</span>
                  <span class="value">${data.approvalStep}</span>
                </div>
                <div class="detail-row">
                  <span class="label">申请时间：</span>
                  <span class="value">${data.requestTime}</span>
                </div>
              </div>

              <p style="margin-top: 20px; color: #2196f3;">
                请登录系统进行审批
              </p>
            </div>
            <div class="footer">
              <p>此邮件由合同管理系统自动生成，请勿直接回复</p>
              <p>${new Date().toLocaleString('zh-CN')}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // 审批完成通知
  approvalCompleted: (data: any): EmailTemplate => ({
    subject: `✅ 审批完成: ${data.paymentRequestId}`,
    html: `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; }
            .header { background: #4caf50; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { background: white; padding: 20px; }
            .success-box { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 15px 0; }
            .details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✅ 审批完成</h2>
            </div>
            <div class="content">
              <div class="success-box">
                <p>您的审批申请已完成处理</p>
              </div>
              
              <div class="details">
                <h3>审批结果</h3>
                <div class="detail-row">
                  <span class="label">付款申请ID：</span>
                  <span class="value">${data.paymentRequestId}</span>
                </div>
                <div class="detail-row">
                  <span class="label">申请金额：</span>
                  <span class="value">¥${(data.amount || 0).toLocaleString('zh-CN')}</span>
                </div>
                <div class="detail-row">
                  <span class="label">审批结果：</span>
                  <span class="value" style="color: ${data.status === 'approved' ? '#4caf50' : '#d32f2f'}; font-weight: bold;">
                    ${data.status === 'approved' ? '✅ 已批准' : '❌ 已拒绝'}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="label">审批人：</span>
                  <span class="value">${data.approver}</span>
                </div>
                <div class="detail-row">
                  <span class="label">审批时间：</span>
                  <span class="value">${data.approvalTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">备注：</span>
                  <span class="value">${data.comments || '无'}</span>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>此邮件由合同管理系统自动生成，请勿直接回复</p>
              <p>${new Date().toLocaleString('zh-CN')}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

// 发送邮件函数
export async function sendEmail(
  to: string | string[],
  templateName: keyof typeof emailTemplates,
  data: any,
  cc?: string | string[],
  bcc?: string | string[]
): Promise<boolean> {
  try {
    if (!transporter) {
      console.error('❌ 邮件服务未初始化');
      return false;
    }

    const template = emailTemplates[templateName](data);

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: Array.isArray(to) ? to.join(',') : to,
      cc: cc ? (Array.isArray(cc) ? cc.join(',') : cc) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc.join(',') : bcc) : undefined,
      subject: template.subject,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ 邮件已发送: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ 邮件发送失败:', error);
    return false;
  }
}

// 测试邮件连接
export async function testEmailConnection(): Promise<boolean> {
  try {
    if (!transporter) {
      console.error('❌ 邮件服务未初始化');
      return false;
    }

    await transporter.verify();
    console.log('✅ 邮件服务连接成功');
    return true;
  } catch (error) {
    console.error('❌ 邮件服务连接失败:', error);
    return false;
  }
}

export default {
  sendEmail,
  testEmailConnection,
  emailTemplates,
};
