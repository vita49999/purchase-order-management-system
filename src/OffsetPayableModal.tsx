import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface OffsetPayableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OffsetPayableModal({ isOpen, onClose }: OffsetPayableModalProps) {
  const [selectedTargetIds, setSelectedTargetIds] = useState<number[]>([1, 2]);
  const [showSelectedPopover, setShowSelectedPopover] = useState(false);
  const [manualAmounts, setManualAmounts] = useState<Record<number, string>>({
    1: '95.00',
    2: '5.00'
  });

  if (!isOpen) return null;

  const targetFees = [
    { id: 1, name: '尾款', orderNo: 'AO260521-1', type: '应付', original: 180.00, available: 180.00, currency: 'CNY' },
    { id: 2, name: '定金', orderNo: 'AO260521-1', type: '应付', original: 20.00, available: 20.00, currency: 'CNY' }
  ];

  const selectedTotal = targetFees
    .filter(t => selectedTargetIds.includes(t.id))
    .reduce((sum, item) => sum + (parseFloat(manualAmounts[item.id]) || 0), 0)
    .toFixed(2);

  return (
    <div className="fixed inset-0 z-[99999] flex justify-end bg-slate-900/40 backdrop-blur-[1px] transition-opacity">
      <div className="bg-white flex flex-col w-[1000px] h-full shadow-2xl transform transition-transform translate-x-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <h2 className="text-[17px] font-bold text-slate-800">冲减应付</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {/* Top Notice Box */}
          <div className="border border-blue-100 bg-[#F8FAFF] rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] flex items-center justify-center font-bold">供</div>
              <span className="text-[13px] font-bold text-slate-800">KS000021/奥特莱斯贸易有限公司</span>
            </div>
            <div className="border-t border-blue-50 pt-3 flex gap-1 text-[13px]">
              <span className="text-slate-700">说明：</span>
              <span className="text-blue-600">使用当前应收费用冲减应付费用。本操作仅调整账务金额，不产生资金流水。</span>
            </div>
          </div>

          {/* Section 1: Source */}
          <section>
            <div className="flex items-center mb-4 mt-2">
              <div className="w-1 h-3.5 bg-blue-600 rounded-full mr-2"></div>
              <h3 className="font-bold text-slate-800 text-[14px]">来源费用</h3>
            </div>
            
            <div className="overflow-x-auto border-t border-slate-100">
              <table className="w-full text-left whitespace-nowrap text-[13px]">
                <thead className="border-b border-slate-100 text-slate-500 bg-white">
                  <tr>
                    <th className="py-3 px-4 font-normal">订单号</th>
                    <th className="py-3 px-4 font-normal">费用项</th>
                    <th className="py-3 px-4 font-normal">费用方向</th>
                    <th className="py-3 px-4 font-normal">币种</th>
                    <th className="py-3 px-4 text-center font-normal">原费用金额</th>
                    <th className="py-3 px-4 text-center font-normal">已冲减金额<br/><span className="text-[11px] text-slate-400">/被冲减金额</span></th>
                    <th className="py-3 px-4 text-center font-normal">冲减后金额</th>
                    <th className="py-3 px-4 text-center font-normal">未收金额</th>
                    <th className="py-3 px-4 text-center font-normal">可冲减金额</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-slate-50">
                    <td className="py-4 px-4 text-blue-600 hover:underline cursor-pointer">AO260521-1</td>
                    <td className="py-4 px-4 text-slate-700 font-medium">采购返利</td>
                    <td className="py-4 px-4 text-emerald-500">应收</td>
                    <td className="py-4 px-4 text-slate-500">CNY</td>
                    <td className="py-4 px-4 text-center font-mono font-medium text-slate-700">180.00</td>
                    <td className="py-4 px-4 text-center font-mono text-slate-700">0.00/0.00</td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">180.00</td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">180.00</td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-blue-600">180.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Target Selection */}
          <section className="pt-2">
            <div className="flex items-center mb-4">
              <div className="w-1 h-3.5 bg-blue-600 rounded-full mr-2"></div>
              <h3 className="font-bold text-slate-800 text-[14px]">选择应付费用</h3>
            </div>
            
            <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
              {/* Filter Bar */}
              <div className="p-3 border-b border-slate-200 flex items-center justify-between gap-3 text-[13px] bg-[#FAFAFA]">
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center border border-slate-200 rounded bg-white shrink-0 overflow-hidden h-8">
                    <select className="px-2 focus:outline-none bg-transparent">
                      <option>订单类型</option>
                    </select>
                  </div>
                  <div className="flex items-center border border-slate-200 rounded bg-white flex-1 overflow-hidden h-8 max-w-[300px]">
                    <select className="px-2 bg-slate-50 border-r border-slate-200 focus:outline-none shrink-0 h-full">
                      <option>订单号</option>
                    </select>
                    <input type="text" placeholder="请输入查询内容" className="px-3 w-full outline-none focus:bg-slate-50" />
                  </div>
                  <div className="flex items-center border border-slate-200 rounded bg-white shrink-0 overflow-hidden h-8">
                    <select className="px-2 focus:outline-none bg-transparent">
                      <option>费用项</option>
                    </select>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-1.5 rounded flex items-center hover:bg-blue-700 transition-colors font-medium shrink-0 h-8">
                  <Search size={14} className="mr-1.5" />
                  查询
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto min-h-[150px]">
                <table className="w-full text-left whitespace-nowrap text-[13px]">
                  <thead className="bg-[#FAFAFA] border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-3 px-4 w-10 text-center"><input type="checkbox" className="rounded border-slate-300" /></th>
                      <th className="py-3 px-4 font-normal">订单号</th>
                      <th className="py-3 px-4 font-normal">费用项</th>
                      <th className="py-3 px-4 font-normal">费用方向</th>
                      <th className="py-3 px-4 font-normal text-right pr-12">费用金额</th>
                      <th className="py-3 px-4 w-32 bg-slate-50 font-normal">可冲减金额</th>
                      <th className="py-3 px-4 w-48 bg-slate-50 font-normal">本次冲减金额</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {targetFees.map(item => (
                      <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="py-3 px-4 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none checked:bg-pink-500 checked:border-transparent accent-pink-500" 
                            checked={selectedTargetIds.includes(item.id)}
                            readOnly
                          />
                        </td>
                        <td className="py-3 px-4 text-blue-600 cursor-pointer hover:underline">{item.orderNo}</td>
                        <td className="py-3 px-4 text-slate-700">{item.name}</td>
                        <td className="py-3 px-4 text-rose-500">{item.type}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700 pr-12">{item.original.toFixed(2)}</td>
                        <td className="py-3 px-4 bg-slate-50 font-mono text-slate-500 border-l border-white">{item.available.toFixed(2)} {item.currency}</td>
                        <td className="py-2 px-4 bg-slate-50 border-l border-white">
                          <div className="flex items-center border border-slate-200 bg-white rounded overflow-hidden">
                            <input 
                              type="text"
                              className="px-2 py-1 w-20 outline-none font-mono text-slate-700 text-[12px] flex-1 min-w-0"
                              value={manualAmounts[item.id] || ''}
                              readOnly
                            />
                            <span className="px-2 text-[11px] text-slate-400 border-l border-slate-100 bg-slate-50">CNY</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Summary Row */}
              <div className="bg-orange-50/50 px-4 py-2 border-t border-slate-200 flex justify-between items-center text-[13px]">
                <span className="font-medium text-slate-700">已选合计</span>
                <span className="font-mono font-bold text-slate-800">{selectedTotal}CNY</span>
              </div>
            </div>

            {/* Pagination / Footer of table */}
            <div className="flex items-center justify-between mt-3 text-[13px] relative z-20">
              
              {/* Selected List Popover */}
              {showSelectedPopover && (
                <div className="absolute bottom-10 left-0 bg-white border border-slate-200 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.1)] rounded-md w-[800px] overflow-hidden">
                  <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full text-left whitespace-nowrap text-[13px]">
                      <thead className="bg-[#FAFAFA] border-b border-slate-200 text-slate-500 sticky top-0 z-10">
                        <tr>
                          <th className="py-2.5 px-4 font-normal">订单号</th>
                          <th className="py-2.5 px-4 font-normal">费用项</th>
                          <th className="py-2.5 px-4 font-normal">费用方向</th>
                          <th className="py-2.5 px-4 font-normal text-right pr-8">费用金额</th>
                          <th className="py-2.5 px-4 w-32 bg-slate-50 font-normal">可冲减金额</th>
                          <th className="py-2.5 px-4 w-40 bg-slate-50 font-normal">本次冲减金额</th>
                          <th className="py-2.5 px-4 w-16 bg-white font-normal text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {targetFees.filter(t => selectedTargetIds.includes(t.id)).map(item => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-4 text-blue-600">{item.orderNo}</td>
                            <td className="py-2.5 px-4 text-slate-700">{item.name}</td>
                            <td className="py-2.5 px-4 text-rose-500">{item.type}</td>
                            <td className="py-2.5 px-4 text-right font-mono text-slate-700 pr-8">{item.original.toFixed(2)}</td>
                            <td className="py-2.5 px-4 bg-slate-50 font-mono text-slate-500 border-l border-white">{item.available.toFixed(2)} {item.currency}</td>
                            <td className="py-2.5 px-4 bg-slate-50 border-l border-white">
                              <div className="flex items-center border border-slate-200 bg-white rounded overflow-hidden">
                                <input 
                                  type="text"
                                  className="px-2 py-1 w-20 outline-none font-mono text-slate-700 text-[12px] flex-1 min-w-0"
                                  value={manualAmounts[item.id] || ''}
                                  onChange={(e) => setManualAmounts({...manualAmounts, [item.id]: e.target.value})}
                                />
                                <span className="px-2 text-[11px] text-slate-400 border-l border-slate-100 bg-slate-50">CNY</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-4 bg-white border-l border-slate-50 text-center">
                              <button 
                                className="text-slate-500 hover:text-rose-500 text-[12px]"
                                onClick={() => {
                                  setSelectedTargetIds(selectedTargetIds.filter(id => id !== item.id));
                                }}
                              >
                                移除
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-orange-50/50 px-4 py-2 border-t border-orange-100 flex justify-between items-center text-[13px]">
                    <span className="font-medium text-slate-800 text-xs">已选合计</span>
                    <span className="font-mono font-bold text-slate-800">{selectedTotal}CNY</span>
                  </div>
                </div>
              )}

              <div 
                className="bg-slate-50 px-3 py-1.5 rounded border border-slate-100 flex items-center gap-1 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setShowSelectedPopover(!showSelectedPopover)}
              >
                已选中 <span className="text-blue-600 font-bold mx-0.5">{selectedTargetIds.length}</span> 费用
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <span>共 4 条</span>
                <div className="flex items-center gap-1">
                  <span className="cursor-not-allowed text-slate-300">&lt;</span>
                  <span className="w-5 h-5 flex items-center justify-center border border-blue-600 text-blue-600 font-medium rounded-sm bg-blue-50 text-[12px]">1</span>
                  <span className="cursor-not-allowed text-slate-300">&gt;</span>
                </div>
                <select className="border border-slate-200 rounded px-2 py-1 outline-none bg-white focus:border-blue-500">
                  <option>100 条/页</option>
                </select>
              </div>
            </div>
            
          </section>
        </div>

        {/* Outer Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white shrink-0 flex items-center justify-end gap-3 z-10 shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.02)]">
          <button onClick={onClose} className="px-6 py-2 border border-slate-300 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors text-slate-700">
            取消
          </button>
          <button className="px-6 py-2 bg-[#2563EB] text-white rounded text-[13px] font-bold hover:bg-blue-700 transition-colors shadow-sm">
            确认冲减
          </button>
        </div>
      </div>
    </div>
  );
}
