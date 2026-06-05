import React, { useState } from 'react';
import { Search, ChevronDown, List, LayoutGrid, ChevronLeft, ChevronRight, Settings, RefreshCw, ArrowUpDown, Maximize } from 'lucide-react';
import OffsetPayableModal from './OffsetPayableModal';

export default function ReceivableFeesView() {
  const [showOffsetModal, setShowOffsetModal] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-hidden">
      <OffsetPayableModal isOpen={showOffsetModal} onClose={() => setShowOffsetModal(false)} />
      {/* Workspace Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 flex space-x-8 h-12 shrink-0">
        {["全部", "外贸", "代采", "头程", "海外仓"].map((tab) => (
          <div
            key={tab}
            className={`flex items-center h-full border-b-2 px-1 cursor-pointer whitespace-nowrap text-sm ${
              tab === "全部"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 font-medium"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col min-w-0 p-4 overflow-hidden relative">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col min-h-0 absolute inset-4">
          
          {/* Action Bar */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 flex-wrap gap-y-2">
            <div className="flex items-center gap-2">
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center text-[13px] font-medium hover:bg-blue-700 transition">
                <span className="mr-1">+</span> 新增费用
              </button>
              <button className="border border-slate-200 bg-white text-slate-700 px-3 py-1.5 rounded flex items-center text-[13px] font-medium hover:bg-slate-50 transition">
                生成账单 <ChevronDown size={14} className="ml-1" />
              </button>
              <button className="border border-slate-200 bg-white text-slate-700 px-3 py-1.5 rounded flex items-center text-[13px] font-medium hover:bg-slate-50 transition">
                重新计算 <ChevronDown size={14} className="ml-1" />
              </button>
              <button className="border border-slate-200 bg-white text-slate-700 px-3 py-1.5 rounded flex items-center text-[13px] font-medium hover:bg-slate-50 transition">
                核销
              </button>
              <button className="border border-slate-200 bg-white text-slate-700 px-3 py-1.5 rounded flex items-center text-[13px] font-medium hover:bg-slate-50 transition">
                导入新增
              </button>
              <button className="border border-slate-200 bg-white text-slate-700 px-3 py-1.5 rounded flex items-center text-[13px] font-medium hover:bg-slate-50 transition">
                导出 <ChevronDown size={14} className="ml-1" />
              </button>
              <button className="border border-slate-200 bg-white text-slate-700 px-3 py-1.5 rounded flex items-center text-[13px] font-medium hover:bg-slate-50 transition">
                作废
              </button>
              <button 
                className="border border-slate-200 bg-white text-slate-700 px-3 py-1.5 rounded flex items-center text-[13px] font-medium hover:bg-slate-50 transition"
                onClick={() => setShowOffsetModal(true)}
              >
                冲减应付
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded shrink-0 divide-x divide-slate-200 bg-white h-[32px]">
                <div className="px-3 text-slate-600 text-[13px] font-medium">装载日期</div>
                <div className="flex items-center bg-slate-50">
                  <input type="text" placeholder="开始日期" className="w-24 bg-transparent outline-none text-center text-[13px]" />
                  <span className="text-slate-400 px-1">-</span>
                  <input type="text" placeholder="结束日期" className="w-24 bg-transparent outline-none text-center text-[13px]" />
                  <span className="px-2 border-l border-slate-200 cursor-pointer">📅</span>
                </div>
              </div>
              
              <button className="bg-blue-600 text-white p-1.5 px-4 rounded text-[13px] font-medium hover:bg-blue-700 transition">查询</button>
              <button className="border border-slate-200 bg-white p-1.5 px-4 rounded text-slate-700 text-[13px] font-medium hover:bg-slate-50 transition">重置</button>
              <button className="text-blue-600 font-medium text-[13px] hover:underline">订单展示</button>
              <button className="text-blue-600 font-medium text-[13px] hover:underline">费用明细展示</button>
              
              <div className="flex rounded border border-blue-600 ml-2 overflow-hidden bg-white text-blue-600 h-[32px]">
                <button className="px-3 py-1 flex items-center justify-center bg-blue-50 text-[12px] font-bold h-full">明细展示</button>
              </div>
              <div className="flex items-center border border-slate-200 rounded text-slate-500 bg-white h-[32px] overflow-hidden divide-x divide-slate-200 ml-2">
                <div className="w-[32px] h-full flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <RefreshCw size={14} className="text-slate-600" />
                </div>
                <div className="w-[32px] h-full flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <ArrowUpDown size={14} className="text-slate-600" />
                </div>
                <div className="w-[32px] h-full flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <Settings size={14} className="text-slate-600" />
                </div>
                <div className="w-[32px] h-full flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <Maximize size={14} className="text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-white border-b border-yellow-200 relative pb-10">
            <table className="w-full text-left whitespace-nowrap text-xs table-fixed min-w-[max-content]">
              <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600 sticky top-0 z-10 font-bold">
                <tr>
                  <th className="p-3 w-10 text-center border-r border-slate-100"><input type="checkbox" className="rounded border-slate-300" /></th>
                  <th className="p-3 w-14 border-r border-slate-100">序号</th>
                  <th className="p-3 w-32 border-r border-slate-100 relative pr-6">订单号 <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" /></th>
                  <th className="p-3 w-28 border-r border-slate-100 relative pr-6">订单类型 <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" /></th>
                  <th className="p-3 w-40 border-r border-slate-100 relative pr-6">付方 <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" /></th>
                  <th className="p-3 w-28 border-r border-slate-100">付方类型</th>
                  <th className="p-3 w-44 border-r border-slate-100 relative pr-6">费用明细号 <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" /></th>
                  <th className="p-3 w-32 border-r border-slate-100 relative pr-6">费用项 <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" /></th>
                  <th className="p-3 w-32 border-r border-slate-100">金额</th>
                  <th className="p-3 w-24 border-r border-slate-100 relative pr-6">出账状态 <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" /></th>
                  <th className="p-3 w-24 border-r border-slate-100 relative pr-6">结算状态 <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" /></th>
                  <th className="p-3 w-32 border-r border-slate-100">已收金额</th>
                  <th className="p-3 w-32 border-r border-slate-100">未收金额</th>
                  <th className="p-3 w-40 border-r border-slate-100">费用备注</th>
                  <th className="p-3 w-28 text-center sticky right-0 bg-[#F8FAFC] z-20 shadow-[-2px_0_4px_rgba(0,0,0,0.03)] border-l border-slate-100">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { id: 1, orderNo: "AO260602-1", orderType: "代采单", payParty: "MDUMIDUM(KH0469)", payPartyType: "客户", feeNo: "EXPD260602014242001", feeName: "尾款", amount: "3000 CNY", outStatus: "待出账", settleStatus: "已结清", rcvd: "3000.00CNY", unrcvd: "0.00CNY", remark: "--" },
                  { id: 2, orderNo: "AO260602-1", orderType: "代采单", payParty: "MDUMIDUM(KH0469)", payPartyType: "客户", feeNo: "EXPD260602014242002", feeName: "定金", amount: "1750 CNY", outStatus: "待出账", settleStatus: "已结清", rcvd: "1750.00CNY", unrcvd: "0.00CNY", remark: "--" },
                  { id: 3, orderNo: "AO260602-1", orderType: "代采单", payParty: "MDUMIDUM(KH0469)", payPartyType: "客户", feeNo: "EXPD260602014242003", feeName: "佣金", amount: "475 CNY", outStatus: "待出账", settleStatus: "已结清", rcvd: "475.00CNY", unrcvd: "0.00CNY", remark: "--" },
                  { id: 4, orderNo: "AO260602-1", orderType: "代采单", payParty: "MDUMIDUM(KH0469)", payPartyType: "客户", feeNo: "EXPD260602014242004", feeName: "贴标费", amount: "475 CNY", outStatus: "待出账", settleStatus: "待结清", rcvd: "0.00CNY", unrcvd: "475.00CNY", remark: "--", actions: ["调整", "作废", "详情"] },
                  { id: 5, orderNo: "PO260528-2", orderType: "采购单", payParty: "MMM22(KS000059)", payPartyType: "客户", feeNo: "EXPD260602014218001", feeName: "采购返利", amount: "12 CNY", outStatus: "待出账", settleStatus: "待结清", rcvd: "0.00CNY", unrcvd: "12.00CNY", remark: "--", actions: ["调整", "作废", "详情"] },
                  { id: 6, orderNo: "PO260528-2", orderType: "采购单", payParty: "MMM33(KS000060)", payPartyType: "客户", feeNo: "EXPD260602014217001", feeName: "采购返利", amount: "12 CNY", outStatus: "待出账", settleStatus: "待结清", rcvd: "0.00CNY", unrcvd: "12.00CNY", remark: "--", actions: ["调整", "作废", "详情"] },
                ].map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-3 text-center border-r border-slate-100"><input type="checkbox" className="rounded border-slate-300" /></td>
                    <td className="p-3 text-slate-500 border-r border-slate-100">{item.id}</td>
                    <td className="p-3 text-blue-600 font-medium cursor-pointer hover:underline border-r border-slate-100">{item.orderNo}</td>
                    <td className="p-3 border-r border-slate-100">{item.orderType}</td>
                    <td className="p-3 border-r border-slate-100">{item.payParty}</td>
                    <td className="p-3 border-r border-slate-100">{item.payPartyType}</td>
                    <td className="p-3 border-r border-slate-100 font-mono text-[11px] text-slate-500">{item.feeNo}</td>
                    <td className="p-3 border-r border-slate-100">{item.feeName}</td>
                    <td className="p-3 border-r border-slate-100 font-mono font-medium">{item.amount}</td>
                    <td className="p-3 border-r border-slate-100">{item.outStatus}</td>
                    <td className={`p-3 border-r border-slate-100 font-semibold ${item.settleStatus === '已结清' ? 'text-emerald-500' : 'text-slate-600'}`}>{item.settleStatus}</td>
                    <td className="p-3 border-r border-slate-100 font-mono text-slate-600">{item.rcvd}</td>
                    <td className="p-3 border-r border-slate-100 font-mono text-slate-600">{item.unrcvd}</td>
                    <td className="p-3 border-r border-slate-100 text-slate-400">{item.remark}</td>
                    <td className="p-3 text-center sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.03)] border-l border-slate-100 text-blue-600">
                      <div className="flex items-center justify-center gap-2">
                        {item.actions ? item.actions.map(action => (
                          <span 
                            key={action} 
                            className="cursor-pointer hover:underline"
                          >
                            {action}
                          </span>
                        )) : <span className="cursor-pointer hover:underline">详情</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-yellow-50/80 border-t border-yellow-200 flex items-center px-6 justify-between text-[13px] z-10">
            <span className="font-bold text-slate-700 flex items-center gap-2">总数: 300条 <span className="text-yellow-600 text-lg">⚠️</span></span>
            <div className="flex items-center gap-6">
              <span className="text-slate-500">共 300 条</span>
              <div className="flex text-slate-600 hover:text-slate-800 cursor-pointer font-bold items-center gap-1">
                 <span className="text-orange-500 rounded-full border border-orange-200 bg-orange-50 w-4 h-4 flex items-center justify-center text-[10px]">?</span> 合计详情 <ChevronDown size={14} />
              </div>
              <div className="flex items-center gap-1">
                <ChevronLeft size={16} className="text-slate-400 cursor-not-allowed" />
                <span className="w-6 h-6 rounded flex items-center justify-center border border-blue-600 text-blue-600 font-bold bg-blue-50">1</span>
                <span className="w-6 h-6 hover:bg-slate-100 rounded flex items-center justify-center cursor-pointer">2</span>
                <span className="w-6 h-6 hover:bg-slate-100 rounded flex items-center justify-center cursor-pointer">3</span>
                <ChevronRight size={16} className="text-slate-500 cursor-pointer hover:text-slate-800" />
              </div>
              <div className="flex items-center gap-2">
                <select className="border border-slate-200 rounded px-2 py-0.5 outline-none bg-white">
                  <option>100 条/页</option>
                </select>
                <span>跳至</span>
                <input type="text" className="w-10 border border-slate-200 rounded outline-none px-1 py-0.5 text-center" />
                <span>页</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
