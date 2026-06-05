import React, { useState, useEffect, useRef } from "react";
import ReceivableFeesView from "./ReceivableFeesView";
import {
  Home,
  Building2,
  Briefcase,
  Truck,
  Box,
  Wallet,
  Settings,
  Search,
  Bell,
  User,
  LayoutGrid,
  List,
  Plus,
  Download,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  AlertCircle,
  ShoppingBag,
  Layers,
  CircleDollarSign,
  PieChart,
  Info,
  HelpCircle,
  GripVertical,
  Calendar,
  Paperclip,
  Expand,
  Trash2,
  MapPin,
  RotateCw,
  Maximize2,
  PenLine,
  Link as LinkIcon,
} from "lucide-react";

const renderParty = (name: string | undefined) => {
  if (!name || name === "--") return <span className="text-slate-600">{name || "--"}</span>;
  
  return (
    <div className="flex items-center space-x-1.5 min-w-0">
      {name === "订单客户" || name === "默认客户" || name === "默认客户1" ? (
        <span className="inline-flex items-center justify-center bg-[#f97316] text-white text-[11px] font-bold w-4 h-4 leading-none rounded-full shrink-0 p-0 transform scale-90">客</span>
      ) : (
        <span className="inline-flex items-center justify-center bg-[#3b82f6] text-white text-[11px] font-bold w-4 h-4 leading-none rounded-full shrink-0 p-0 transform scale-90">供</span>
      )}
      <span className="text-slate-700 truncate" title={name}>{name}</span>
    </div>
  );
};

const PurchaseOrderDetail = () => {
  const [activeTab, setActiveTab] = useState("订货信息");
  const [attachmentDrawerOpen, setAttachmentDrawerOpen] = useState(false);
  const [showConfirmVoidModal, setShowConfirmVoidModal] = useState(false);
  const [isOffsetCancelled, setIsOffsetCancelled] = useState(false);
  const [hoveredRebateInfo, setHoveredRebateInfo] = useState<{
    x: number;
    y: number;
    type: "receivable" | "payable" | "receivable_deduction";
    item?: any;
  } | null>(null);
  const rebateCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleRebateMouseEnter = (
    e: React.MouseEvent<HTMLElement>,
    type: "receivable" | "payable" | "receivable_deduction",
    item?: any
  ) => {
    if (rebateCloseTimeoutRef.current) {
      clearTimeout(rebateCloseTimeoutRef.current);
      rebateCloseTimeoutRef.current = null;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredRebateInfo({
      x: rect.left + rect.width / 2,
      y: rect.top,
      type,
      item,
    });
  };

  const handleRebateMouseLeave = () => {
    rebateCloseTimeoutRef.current = setTimeout(() => {
      setHoveredRebateInfo(null);
    }, 120);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative mb-4">
            {/* Header Ribbon */}
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden z-10 pointer-events-none">
              <div className="absolute top-4 -right-8 w-32 bg-orange-500 text-white text-[10px] font-bold py-1 text-center rotate-45 shadow-sm">
                转运中
              </div>
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start relative z-0">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-slate-800">AO260511-1代采单详情</h2>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 font-bold text-[10px] rounded border border-slate-200">验</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded cursor-pointer hover:bg-blue-100 transition-colors">
                    <User size={12} />
                    <span>阿比/KS000015</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded cursor-pointer hover:bg-blue-100 transition-colors">
                    <MapPin size={12} />
                    <span>轨迹:已交货</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center w-[600px] mt-1 mr-4">
                {[
                  { label: "1.创建", status: "completed" },
                  { label: "2.下单确认", status: "completed" },
                  { label: "3.采购", status: "completed" },
                  { label: "4.收货", status: "completed" },
                  { label: "5.排货计划", status: "completed" },
                  { label: "6.交付", status: "completed" },
                  { label: "7.收款", status: "pending" },
                  { label: "8.完成", status: "active" },
                ].map((step, idx, arr) => (
                  <div key={idx} className="flex-1 relative">
                    <div className="flex items-center">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 z-10 ${
                          step.status === "completed"
                            ? "bg-blue-600"
                            : step.status === "active"
                            ? "bg-orange-500"
                            : "bg-slate-300"
                        }`}
                      />
                      {idx < arr.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 mx-1 ${
                            arr[idx + 1].status === "pending" || step.status === "active"
                              ? "bg-slate-300 border-t border-dashed border-slate-300 bg-transparent"
                              : "bg-blue-600"
                          }`}
                        />
                      )}
                    </div>
                    <div className={`absolute top-4 -left-6 w-20 text-center text-[10px] font-bold ${
                      step.status === "pending" ? "text-slate-400" : "text-slate-700"
                    }`}>
                      {step.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Sections */}
            <div className="p-6 grid grid-cols-4 gap-6 divide-x divide-slate-100 text-sm">
              <div className="pr-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-slate-800">
                  <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
                  基础信息
                </h3>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-xs text-slate-600">
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">代采公司：</span> <span className="font-semibold text-slate-800 break-words">产品同学的个体户</span></div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">交易币种：</span> <span className="font-semibold text-slate-800 break-words">CNY-人民币</span></div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">是否含税：</span> <span className="font-semibold text-slate-800 break-words">否</span></div>
                  
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">下单日期：</span> <span className="font-semibold text-slate-800">2026-05-11</span></div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">期望交货日期：</span> <span className="font-semibold text-slate-800">2026-05-11</span></div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">整单验货：</span> <span className="font-semibold text-slate-800">不验货</span></div>
                  
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">业务员：</span> <span className="font-semibold text-slate-800">黄颖妍</span></div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">相关人员：</span> <span className="font-semibold text-slate-800">黄颖妍</span></div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">交付条款：</span> <span className="font-semibold text-slate-800">--</span></div>
                  
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">外部单号：</span> <span className="font-semibold text-slate-800">--</span></div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">订单备注：</span> <span className="font-semibold text-slate-800">--</span></div>
                  <div />

                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">创建人：</span> <span className="font-semibold text-slate-800">黄颖妍</span></div>
                  <div className="flex col-span-2"><span className="w-20 shrink-0 text-slate-400">创建时间：</span> <span className="font-semibold text-slate-800">2026-05-11 10:32:49</span></div>
                </div>
              </div>

              <div className="px-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-slate-800">
                  <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
                  供货商结算条款
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">供货商：</span> <span className="font-semibold text-slate-800">VITA工厂/KS000171</span></div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">佣金：</span> <span className="font-semibold text-slate-800">92.89CNY</span></div>
                  <div className="flex items-center"><span className="w-20 shrink-0 text-slate-400">定金：</span> 
                    <span className="font-semibold text-slate-800">700CNY</span>
                    <span className="ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded">代付</span>
                  </div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">尾款：</span> <span className="font-semibold text-slate-800">--</span></div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">结算方式：</span> <span className="font-semibold text-slate-800">现结</span></div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">付款期限：</span> <span className="font-semibold text-slate-800">0天</span></div>
                </div>
              </div>

              <div className="px-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-slate-800">
                  <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
                  客户结算条款
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">佣金：</span> <span className="font-semibold text-slate-800">5 CNY</span></div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">结算方式：</span> <span className="font-semibold text-slate-800">现结</span></div>
                  <div className="flex"><span className="w-20 shrink-0 text-slate-400">付款期限：</span> <span className="font-semibold text-slate-800">0天</span></div>
                </div>
              </div>

              <div className="pl-6 space-y-4 relative">
                <div className="absolute top-0 right-0 text-blue-600 text-xs font-semibold cursor-pointer flex items-center hover:text-blue-700">
                  收起 <ChevronDown size={14} className="ml-1 rotate-180" />
                </div>
                <h3 className="font-bold flex items-center gap-2 text-slate-800">
                  <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
                  相关服务 <Settings size={14} className="text-slate-400 ml-1 cursor-pointer hover:text-blue-500" />
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex"><span className="w-24 shrink-0 text-slate-400">服务：</span> <span className="font-semibold text-slate-800">干线运输</span></div>
                  <div className="flex"><span className="w-24 shrink-0 text-slate-400">供货商地址：</span> <span className="font-semibold text-slate-800">--</span></div>
                  <div className="flex"><span className="w-24 shrink-0 text-slate-400">国内交货地址：</span> <div className="flex items-center gap-2 font-semibold text-slate-800">-- <span className="text-blue-600 cursor-pointer text-[11px]">查看</span></div></div>
                </div>
              </div>
            </div>

            {/* Highlight Cards */}
            <div className="px-6 pb-6 grid grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-orange-50/50 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <Box className="text-orange-500" size={24} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-0.5">件/毛(KG)/体(m³)</div>
                  <div className="text-lg font-black text-slate-900 font-mono tracking-tight">--/3.6/0.0012</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-purple-50/50 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <Briefcase className="text-purple-500" size={24} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-0.5 flex items-center gap-1">总应收 <span className="font-black text-slate-900 text-lg font-mono ml-1">¥827<span className="text-[13px]">.00</span></span></div>
                  <div className="text-[10px] text-slate-500 font-semibold tracking-wider">代付: <span className="font-mono text-slate-800 font-bold">¥700.00</span> / 费用: <span className="font-mono text-slate-800 font-bold">¥127.00</span></div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-rose-50/50 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <Wallet className="text-rose-500" size={24} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-0.5 flex items-center gap-1">总货款 <span className="font-black text-slate-900 text-lg font-mono ml-1">¥792<span className="text-[13px]">.89</span></span></div>
                  <div className="text-[10px] text-slate-500 font-semibold tracking-wider">代付: <span className="font-mono text-slate-800 font-bold">¥700.00</span> / 客户自付: <span className="font-mono text-slate-800 font-bold">¥92.89</span></div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-emerald-50/50 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <CircleDollarSign className="text-emerald-500" size={24} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-0.5 flex items-center gap-1">总利润(折合) <span className="font-black text-slate-900 text-lg font-mono ml-1">¥127<span className="text-[13px]">.00</span></span></div>
                  <div className="text-[10px] text-slate-500 font-semibold tracking-wider">货款利润: <span className="font-mono text-slate-800 font-bold">¥0.00</span> / 其他利润: <span className="font-mono text-slate-800 font-bold">¥127.00</span></div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-slate-100 flex items-center px-6 gap-6 bg-white relative">
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <button className="border border-slate-200 rounded p-1.5 hover:bg-slate-50 text-slate-600 bg-white">
                  <Settings size={14} />
                </button>
              </div>
              {["订货信息", "费用管理", "关联单据", "箱单明细", "附件信息", "操作日志"].map((tab, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 text-sm font-bold cursor-pointer transition-colors relative ${
                    activeTab === tab ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Table Area - 订货信息 */}
            {activeTab === "订货信息" && (
              <div className="p-4 bg-slate-50">
                <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-3 font-semibold text-slate-700">序号</th>
                        <th className="p-3 font-semibold text-slate-700">图片</th>
                        <th className="p-3 font-semibold text-slate-700">供货商货号</th>
                        <th className="p-3 font-semibold text-slate-700">品名/SKU</th>
                        <th className="p-3 font-semibold text-slate-700">规格型号</th>
                        <th className="p-3 font-semibold text-slate-700">计量单位</th>
                        <th className="p-3 font-semibold text-slate-700">已收数量</th>
                        <th className="p-3 font-semibold text-slate-700">转采数量</th>
                        <th className="p-3 font-semibold text-slate-700">直采待收</th>
                        <th className="p-3 font-semibold text-slate-700">转采待收</th>
                        <th className="p-3 font-semibold text-slate-700">待排货量</th>
                        <th className="p-3 font-semibold text-slate-700">订货量</th>
                        <th className="p-3 font-semibold text-slate-700 bg-blue-50/50 border-b-2 border-blue-500">订货单价</th>
                        <th className="p-3 font-semibold text-slate-700 bg-emerald-50/50 border-b-2 border-emerald-500">供货单价</th>
                        <th className="p-3 font-semibold text-slate-700 bg-blue-50/50 border-b-2 border-blue-500">订货金额</th>
                        <th className="p-3 font-semibold text-slate-700 bg-emerald-50/50 border-b-2 border-emerald-500">供货金额</th>
                        <th className="p-3 font-semibold text-slate-700 bg-orange-50/50 border-b-2 border-orange-400">商品利润</th>
                        <th className="p-3 font-semibold text-slate-700">单箱数量</th>
                        <th className="p-3 font-semibold text-slate-700">箱数</th>
                        <th className="p-3 font-semibold text-slate-700">单品体积</th>
                        <th className="p-3 font-semibold text-slate-700">单箱体积</th>
                        <th className="p-3 font-semibold text-slate-700">总体积</th>
                        <th className="p-3 font-semibold text-slate-700">单品重量</th>
                        <th className="p-3 font-semibold text-slate-700">单箱重量</th>
                        <th className="p-3 font-semibold text-slate-700">总重量</th>
                        <th className="p-3 font-semibold text-slate-700">客户货号</th>
                        <th className="p-3 font-semibold text-slate-700">备注</th>
                        <th className="p-3 font-semibold text-slate-700">验货要求</th>
                        <th className="p-3 font-semibold text-slate-700">验货状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-slate-600">1</td>
                        <td className="p-3">
                          <div className="w-8 h-8 rounded border border-slate-200 p-0.5 bg-white shadow-sm flex items-center justify-center relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1596443686812-2f45229eebc3?auto=format&fit=crop&q=80&w=150" alt="" className="object-cover w-full h-full" crossOrigin="anonymous"/>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-slate-700">001</td>
                        <td className="p-3 text-slate-800 font-semibold">金桂蜜柚红茶</td>
                        <td className="p-3 text-slate-600">4克x9袋</td>
                        <td className="p-3 text-slate-600">个/PC</td>
                        <td className="p-3 font-mono text-slate-700">100</td>
                        <td className="p-3 font-mono text-slate-700">0</td>
                        <td className="p-3 font-mono text-slate-700">0</td>
                        <td className="p-3 font-mono text-slate-700">0</td>
                        <td className="p-3 font-mono text-slate-700">0</td>
                        <td className="p-3 font-mono text-slate-700 font-bold">100</td>
                        <td className="p-3 font-mono text-slate-700">10 CNY</td>
                        <td className="p-3 font-mono text-slate-700">10 CNY</td>
                        <td className="p-3 font-mono text-slate-700 font-bold">1,000 CNY</td>
                        <td className="p-3 font-mono text-slate-700 font-bold bg-emerald-50/20">1,000 CNY</td>
                        <td className="p-3 font-mono text-slate-700 bg-orange-50/20">0 CNY</td>
                        <td className="p-3 text-slate-400">--</td>
                        <td className="p-3 text-slate-400">--</td>
                        <td className="p-3 font-mono text-slate-700">0.000012m³</td>
                        <td className="p-3 font-mono text-slate-700">0.1m³</td>
                        <td className="p-3 font-mono text-slate-700 font-semibold">0.0012m³</td>
                        <td className="p-3 font-mono text-slate-700">0.036KG</td>
                        <td className="p-3 font-mono text-slate-700">3.6KG</td>
                        <td className="p-3 font-mono text-slate-700 font-semibold">3.6KG</td>
                        <td className="p-3 text-slate-400">--</td>
                        <td className="p-3 text-slate-600">干燥存储</td>
                        <td className="p-3 text-slate-600">包装无损坏</td>
                        <td className="p-3 text-slate-400">--</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Table Area - 费用管理 */}
            {activeTab === "费用管理" && (
              <div className="p-4 bg-slate-50 space-y-4">
                {/* Stats Header */}
                <div className="flex items-center gap-8 py-3 px-1">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">统一币种</div>
                    <div className="font-bold text-slate-800">CNY</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">利润率 <Settings size={12} className="text-slate-400 cursor-pointer hover:text-blue-500" /></div>
                    <div className="font-bold text-slate-800">15.35%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">利润额</div>
                    <div className="font-bold text-slate-800">127.00</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">应收</div>
                    <div className="font-bold text-slate-800">827.00</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">应付 (成本)</div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800">700.00</span>
                      <span className="text-blue-600 text-xs font-semibold cursor-pointer hover:underline">利润明细 &gt;</span>
                    </div>
                  </div>
                </div>

                {/* 应收费用 */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible mt-4">
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                    <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
                    <h3 className="font-bold text-slate-800 text-sm">应收费用</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 transition-colors">新增</button>
                        <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-semibold cursor-not-allowed">复制</button>
                        <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-semibold cursor-not-allowed">调整</button>
                        <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-semibold cursor-not-allowed">删除</button>
                        <div className="w-px h-6 bg-slate-200 self-center mx-1" />
                        <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-semibold cursor-not-allowed">同步添加应付</button>
                        <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-50">批量更新汇率</button>
                        <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-semibold cursor-not-allowed">生成账单</button>
                        <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-semibold cursor-not-allowed">客户自付</button>
                        <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-semibold cursor-not-allowed">收款</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 border border-slate-200"><Box size={14} /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 border border-slate-200 bg-white shadow-sm"><RotateCw size={14} /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 border border-slate-200 bg-white shadow-sm"><Settings size={14} /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 border border-slate-200 bg-white shadow-sm"><Maximize2 size={14} /></button>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded flex items-center gap-6 text-xs font-bold text-slate-700">
                      <span>
                        <span className="text-slate-500 font-normal">合计金额:</span> 
                        <span className="font-mono ml-1">827.00 CNY</span>
                      </span>
                      <div className="flex items-center gap-4">
                        <span><span className="text-slate-500 font-normal">已收:</span> <span className="font-mono ml-1">30.00 CNY</span></span>
                        <span><span className="text-slate-500 font-normal">未收:</span> <span className="font-mono ml-1">797.00 CNY</span></span>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded overflow-visible">
                      <table className="w-full text-left whitespace-nowrap text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                          <tr>
                            <th className="p-2 w-8"><input type="checkbox" className="rounded border-slate-300" /></th>
                            <th className="p-2">移动</th>
                            <th className="p-2 font-semibold text-slate-700">付款方</th>
                            <th className="p-2 font-semibold text-slate-700">费用项</th>
                            <th className="p-2">
                              <div className="relative group/status inline-flex items-center gap-1 cursor-help">
                                状态 <HelpCircle size={12} className="text-slate-400" />
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[180px] bg-white border border-slate-200 shadow-xl rounded py-3 px-3 hidden group-hover/status:block z-[99999] font-normal text-left normal-case tracking-normal">
                                  <div className="text-slate-700 font-bold mb-2 flex items-center gap-1.5 text-[13px]"><div className="w-0.5 h-3 bg-blue-500 rounded" />主状态</div>
                                  <div className="flex gap-1.5 mb-3 text-slate-600 text-[11px] whitespace-nowrap">
                                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-slate-500 rounded-sm" />未完结</div>
                                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-orange-500 rounded-sm" />部分完结</div>
                                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-green-500 rounded-sm" />已完结</div>
                                  </div>
                                  <div className="space-y-1.5 text-slate-600 text-xs mb-3">
                                      <div className="flex items-center gap-2"><span className="w-4 h-4 bg-slate-100 text-slate-400 text-[10px] rounded leading-none flex items-center justify-center">结</span>收付款结清</div>
                                      <div className="flex items-center gap-2"><span className="w-4 h-4 bg-slate-100 text-slate-400 text-[10px] rounded leading-none flex items-center justify-center">账</span>制作账单</div>
                                      <div className="flex items-center gap-2"><span className="w-4 h-4 bg-slate-100 text-slate-400 text-[10px] rounded leading-none flex items-center justify-center">申</span>收付款申请</div>
                                  </div>
                                  <div className="text-slate-700 font-bold mb-2 flex items-center gap-1.5 text-[13px]"><div className="w-0.5 h-3 bg-blue-500 rounded" />辅助状态</div>
                                  <div className="flex items-center gap-2 text-slate-600 text-xs">
                                      <span className="w-4 h-4 bg-green-50 text-green-500 border border-green-200 text-[10px] rounded leading-none flex items-center justify-center">调</span>费用调整审核中
                                  </div>
                                </div>
                              </div>
                            </th>
                            <th className="p-2 font-semibold text-slate-700 border-b-2 border-emerald-500 bg-emerald-50/50">费项金额</th>
                            <th className="p-2 font-semibold text-slate-700 bg-yellow-50/50">折算汇率</th>
                            <th className="p-2 font-semibold text-slate-700 border-b-2 border-yellow-400 bg-yellow-50/50">折算金额</th>
                            <th className="p-2 font-semibold text-slate-700">单价</th>
                            <th className="p-2 font-semibold text-slate-700">数量</th>
                            <th className="p-2 font-semibold text-slate-700">计量单位</th>
                            <th className="p-2 font-semibold text-slate-700">代付收款方</th>
                            <th className="p-2 font-semibold text-slate-700">费项备注</th>
                            <th className="p-2 font-semibold text-slate-700">业务发生日期</th>
                            <th className="p-2 font-semibold text-slate-700">更新日期/创建日期</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            { payer: "订单客户", name: "定金", badge: "客户自付", status: ["结"], amount: "92.89 CNY", converted: "92.89 CNY", payee: "--", date: "2026-05-11", rawDate: "2026-05-11" },
                            { payer: "订单客户", name: "尾款", badge: "代付货款", status: ["账", "结", "申"], amount: "700.00 CNY", converted: "700.00 CNY", payee: "VITA工厂", remark: "备注一下先", links: 3, date: "2026-05-25", rawDate: "2026-05-11" },
                            { payer: "订单客户", name: "佣金", badge: "", status: ["账", "结", "申"], amount: "5.00 CNY", converted: "5.00 CNY", payee: "--", remark: "备注", links: 6, date: "2026-05-25", rawDate: "2026-05-11" },
                            { payer: "订单客户", name: "采购返利", badge: "返利", status: ["账", "结", "申"], amount: "0.00 CNY", converted: "0.00 CNY", payee: "--", date: "2026-05-25", rawDate: "2026-05-25", remark: "--", links: 6, hasOffset: "receivable_deduction" as const, originalVal: 2620, offsetVal: 2620 },
                          ].map((item: any, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="p-2"><input type="checkbox" className="rounded border-slate-300" /></td>
                              <td className="p-2 text-slate-300 cursor-move"><GripVertical size={14} /></td>
                              <td className="p-2 text-slate-600">{renderParty(item.payer)}</td>
                              <td className="p-2">
                                <span className="text-blue-600 font-semibold cursor-pointer hover:underline">{item.name}</span>
                                {item.badge && <span className="ml-2 px-1 py-0.5 bg-slate-100 text-slate-400 text-[10px] rounded">{item.badge}</span>}
                              </td>
                              <td className="p-2">
                                <div className="flex gap-1">
                                  {(item.status || ["账", "结", "申"]).map(s => (
                                    <span key={s} className={`px-1 py-0.5 rounded text-[10px] ${
                                      s === "结" && item.status.length === 1 ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                                    }`}>{s}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-2">
                                {item.hasOffset ? (
                                  <div className="flex items-center gap-1.5 select-none">
                                    {isOffsetCancelled && item.badge === "返利" ? (
                                      <div className="flex items-center gap-1.5 translate-y-[2px]">
                                        <span className="font-bold font-mono text-slate-700">{item.originalVal?.toLocaleString("en-US", {minimumFractionDigits: 2})} CNY</span>
                                        <button className="px-2 py-[2px] rounded border border-blue-500 text-blue-600 bg-blue-50 text-[10px] font-medium leading-none hover:bg-blue-100 transition-colors cursor-pointer select-none -translate-y-[2px]">
                                          立即冲减
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="font-extrabold font-mono text-rose-600">{item.amount}</span>
                                    )}
                                    {!isOffsetCancelled && (
                                      <span
                                        onMouseEnter={(e) => handleRebateMouseEnter(e, item.hasOffset, item)}
                                        onMouseLeave={handleRebateMouseLeave}
                                        className="group/offsetBadge inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-100/70 text-rose-600 text-[10px] font-black shrink-0 cursor-help select-none hover:bg-rose-100 hover:border-rose-200 transition-all scale-95 relative overflow-hidden"
                                      >
                                        <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse group-hover/offsetBadge:hidden" />
                                        已冲减
                                        <span
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setShowConfirmVoidModal(true);
                                          }}
                                          className="text-rose-400 hover:text-rose-800 font-black text-[11px] px-0.5 hidden group-hover/offsetBadge:flex select-none cursor-pointer rounded-full transition-colors items-center justify-center leading-none"
                                          title="作废冲减"
                                        >
                                          ✕
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="font-mono text-slate-700">{item.amount}</span>
                                )}
                              </td>
                              <td className="p-2 font-mono text-slate-700 bg-yellow-50/20">× 1 <div className="inline-block px-1 py-0.5 bg-blue-50 text-blue-500 rounded text-[10px] ml-1 cursor-pointer"><PenLine size={10} /></div></td>
                              <td className="p-2 font-mono text-slate-700 bg-yellow-50/20">{item.converted}</td>
                              <td className="p-2 text-slate-600">{item.price || "--"}</td>
                              <td className="p-2 font-mono text-slate-700">{item.qty || "--"}</td>
                              <td className="p-2 text-slate-600">{item.unit || "--"}</td>
                              <td className="p-2 text-slate-600">{renderParty(item.payee)}</td>
                              <td className="p-2 text-slate-600 group relative">
                                <div className="flex items-center gap-1.5 w-max">
                                  <span>{item.remark || "--"}</span>
                                  {item.links && (
                                    <button onClick={() => setAttachmentDrawerOpen(true)} className="text-blue-500 flex items-center gap-0.5 whitespace-nowrap cursor-pointer hover:underline">
                                      <LinkIcon size={12} /> {item.links}
                                    </button>
                                  )}
                                  <button className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-0.5 hover:bg-blue-50 rounded">
                                    <PenLine size={12} />
                                  </button>
                                </div>
                              </td>
                              <td className="p-2 text-slate-600">{item.date}</td>
                              <td className="p-2 text-slate-400">{item.date} <span className="text-slate-300 line-through">{item.rawDate}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 应付费用 */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible mt-4">
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                    <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
                    <h3 className="font-bold text-slate-800 text-sm">应付费用</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap items-center gap-2">
                        <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 transition-colors">新增</button>
                        <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-semibold cursor-not-allowed">复制</button>
                        <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-semibold cursor-not-allowed">调整</button>
                        <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-semibold cursor-not-allowed">删除</button>
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer ml-1 mr-1">
                          <input type="checkbox" className="rounded border-slate-300" />
                          隐藏成本
                        </label>
                        <div className="w-px h-6 bg-slate-200 self-center mx-1" />
                        <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-semibold cursor-not-allowed">同步添加应收</button>
                        <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-50">批量更新汇率</button>
                        <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-semibold cursor-not-allowed">请款</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 border border-slate-200"><Box size={14} /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 border border-slate-200 bg-white shadow-sm"><RotateCw size={14} /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 border border-slate-200 bg-white shadow-sm"><Settings size={14} /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 border border-slate-200 bg-white shadow-sm"><Maximize2 size={14} /></button>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded flex items-center gap-6 text-xs font-bold text-slate-700">
                      <span>
                        <span className="text-slate-500 font-normal">合计金额:</span> 
                        <span className="font-mono ml-1">700.00 CNY</span>
                      </span>
                      <div className="flex items-center gap-4">
                        <span><span className="text-slate-500 font-normal">已付:</span> <span className="font-mono ml-1">0.00 CNY</span></span>
                        <span><span className="text-slate-500 font-normal">未付:</span> <span className="font-mono ml-1">700.00 CNY</span></span>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded overflow-visible">
                      <table className="w-full text-left whitespace-nowrap text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                          <tr>
                            <th className="p-2 w-8"><input type="checkbox" className="rounded border-slate-300" /></th>
                            <th className="p-2">移动</th>
                            <th className="p-2 font-semibold text-slate-700">收款方</th>
                            <th className="p-2 font-semibold text-slate-700">费用项</th>
                            <th className="p-2">
                              <div className="relative group/status inline-flex items-center gap-1 cursor-help">
                                状态 <HelpCircle size={12} className="text-slate-400" />
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[180px] bg-white border border-slate-200 shadow-xl rounded py-3 px-3 hidden group-hover/status:block z-[99999] font-normal text-left normal-case tracking-normal">
                                  <div className="text-slate-700 font-bold mb-2 flex items-center gap-1.5 text-[13px]"><div className="w-0.5 h-3 bg-blue-500 rounded" />主状态</div>
                                  <div className="flex gap-1.5 mb-3 text-slate-600 text-[11px] whitespace-nowrap">
                                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-slate-500 rounded-sm" />未完结</div>
                                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-orange-500 rounded-sm" />部分完结</div>
                                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-green-500 rounded-sm" />已完结</div>
                                  </div>
                                  <div className="space-y-1.5 text-slate-600 text-xs mb-3">
                                      <div className="flex items-center gap-2"><span className="w-4 h-4 bg-slate-100 text-slate-400 text-[10px] rounded leading-none flex items-center justify-center">结</span>收付款结清</div>
                                      <div className="flex items-center gap-2"><span className="w-4 h-4 bg-slate-100 text-slate-400 text-[10px] rounded leading-none flex items-center justify-center">账</span>制作账单</div>
                                      <div className="flex items-center gap-2"><span className="w-4 h-4 bg-slate-100 text-slate-400 text-[10px] rounded leading-none flex items-center justify-center">申</span>收付款申请</div>
                                  </div>
                                  <div className="text-slate-700 font-bold mb-2 flex items-center gap-1.5 text-[13px]"><div className="w-0.5 h-3 bg-blue-500 rounded" />辅助状态</div>
                                  <div className="flex items-center gap-2 text-slate-600 text-xs">
                                      <span className="w-4 h-4 bg-green-50 text-green-500 border border-green-200 text-[10px] rounded leading-none flex items-center justify-center">调</span>费用调整审核中
                                  </div>
                                </div>
                              </div>
                            </th>
                            <th className="p-2 font-semibold text-slate-700 border-b-2 border-emerald-500 bg-emerald-50/50">费项金额</th>
                            <th className="p-2 font-semibold text-slate-700 bg-yellow-50/50">折算汇率</th>
                            <th className="p-2 font-semibold text-slate-700 border-b-2 border-yellow-400 bg-yellow-50/50">折算金额</th>
                            <th className="p-2 font-semibold text-slate-700">单价</th>
                            <th className="p-2 font-semibold text-slate-700">数量</th>
                            <th className="p-2 font-semibold text-slate-700">计量单位</th>
                            <th className="p-2 font-semibold text-slate-700">代付委托方</th>
                            <th className="p-2 font-semibold text-slate-700">费项备注</th>
                            <th className="p-2 font-semibold text-slate-700">业务发生日期</th>
                            <th className="p-2 font-semibold text-slate-700">更新日期/创建日期</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            { payee: "VITA工厂", name: "尾款", badge: "", status: ["账", "结", "申"], amount: "2,360.00 CNY", rate: "× 1", converted: "2,360.00 CNY", price: "--", qty: "--", unit: "--", sender: "--", date: "2026-05-13", rawDate: "2026-05-11", hasOffset: "payable" as const, originalVal: 5000, offsetVal: 2640 },
                          ].map((item: any, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="p-2"><input type="checkbox" className="rounded border-slate-300" /></td>
                              <td className="p-2 text-slate-300 cursor-move"><GripVertical size={14} /></td>
                              <td className="p-2 text-slate-600">{renderParty(item.payee)}</td>
                              <td className="p-2">
                                <span className="text-blue-600 font-semibold cursor-pointer hover:underline">{item.name}</span>
                                {item.badge && <span className="ml-2 px-1 py-0.5 bg-slate-100 text-slate-400 text-[10px] rounded">{item.badge}</span>}
                              </td>
                              <td className="p-2">
                                <div className="flex gap-1">
                                  {(item.status || ["账", "结", "申"]).map(s => (
                                    <span key={s} className="px-1 py-0.5 bg-slate-100 text-slate-400 rounded text-[10px]">{s}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-2">
                                {item.hasOffset ? (
                                  <div className="flex items-center gap-1.5 select-none text-[13px]">
                                    <span className={`font-mono ${isOffsetCancelled ? "text-slate-700 font-bold" : "text-rose-600 font-extrabold"}`}>
                                      {isOffsetCancelled ? (item.originalVal?.toLocaleString("en-US", {minimumFractionDigits: 2}) + " CNY") : item.amount}
                                    </span>
                                    {!isOffsetCancelled && (
                                      <span
                                        onMouseEnter={(e) => handleRebateMouseEnter(e, item.hasOffset, item)}
                                        onMouseLeave={handleRebateMouseLeave}
                                        className="group/offsetBadge inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-100/70 text-rose-600 text-[10px] font-black shrink-0 cursor-help select-none hover:bg-rose-100 hover:border-rose-200 transition-all scale-95 relative overflow-hidden"
                                      >
                                        <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse group-hover/offsetBadge:hidden" />
                                        已冲减
                                        <span
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setShowConfirmVoidModal(true);
                                          }}
                                          className="text-rose-400 hover:text-rose-800 font-black text-[11px] px-0.5 hidden group-hover/offsetBadge:flex select-none cursor-pointer rounded-full transition-colors items-center justify-center leading-none"
                                          title="作废冲减"
                                        >
                                          ✕
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="font-mono text-slate-700">{item.amount}</span>
                                )}
                              </td>
                              <td className="p-2 font-mono text-slate-700 bg-yellow-50/20">{item.rate} <div className="inline-block px-1 py-0.5 bg-blue-50 text-blue-500 rounded text-[10px] ml-1 cursor-pointer"><PenLine size={10} /></div></td>
                              <td className="p-2 font-mono text-slate-700 bg-yellow-50/20">{item.converted}</td>
                              <td className="p-2 text-slate-600">{item.price || "--"}</td>
                              <td className="p-2 font-mono text-slate-700">{item.qty || "--"}</td>
                              <td className="p-2 text-slate-600">{item.unit || "--"}</td>
                              <td className="p-2 text-slate-600">{renderParty(item.sender)}</td>
                              <td className="p-2 text-slate-600 group relative">
                                <div className="flex items-center gap-1.5 w-max">
                                  <span>{item.remark || "--"}</span>
                                  {item.links && (
                                    <button onClick={() => setAttachmentDrawerOpen(true)} className="text-blue-500 flex items-center gap-0.5 whitespace-nowrap cursor-pointer hover:underline">
                                      <LinkIcon size={12} /> {item.links}
                                    </button>
                                  )}
                                  <button className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-0.5 hover:bg-blue-50 rounded">
                                    <PenLine size={12} />
                                  </button>
                                </div>
                              </td>
                              <td className="p-2 text-slate-600">{item.date}</td>
                              <td className="p-2 text-slate-400">{item.date} <span className="text-slate-300 line-through">{item.rawDate}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attachment Drawer */}
      {attachmentDrawerOpen && (
        <>
          <div className="absolute inset-0 bg-slate-900/20 z-40" onClick={() => setAttachmentDrawerOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-72 bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
            <div className="flex items-center gap-3 p-4 border-b border-slate-100 font-semibold text-slate-800 text-sm">
              <button onClick={() => setAttachmentDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
              附件(3)
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
              {[
                { name: "Snipaste_2026-03-02_14-35-38....", uploader: "黄雅妍", time: "2026-05-27 10:57:58", img: "https://api.dicebear.com/7.x/shapes/svg?seed=1" },
                { name: "Snipaste_2026-03-02_14-34-54....", uploader: "黄雅妍", time: "2026-05-27 10:57:58", img: "https://api.dicebear.com/7.x/shapes/svg?seed=2" },
                { name: "JPGg.png", uploader: "黄雅妍", time: "2026-05-27 10:57:58", img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=200&auto=format&fit=crop" },
              ].map((file, i) => (
                <div key={i} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-3 border-b border-slate-100 font-medium text-slate-800 truncate text-[11px]">{file.name}</div>
                  <div className="h-32 bg-slate-50 flex items-center justify-center overflow-hidden">
                    <img src={file.img} alt={file.name} className="w-24 h-24 object-cover" />
                  </div>
                  <div className="p-3 text-[10px] text-slate-500 space-y-0.5">
                    <div>上传人:{file.uploader}</div>
                    <div>上传时间:{file.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
              <button className="w-full flex items-center justify-center gap-1.5 py-2 text-blue-600 font-medium text-sm hover:bg-blue-50 transition-colors">
                <Paperclip size={14} /> 上传附件
              </button>
            </div>
          </div>
        </>
      )}

      {/* Local Hover Tooltip for Detail Page */}
      {hoveredRebateInfo && hoveredRebateInfo.type === "receivable_deduction" && (
        <div
          style={{
            position: "fixed",
            left: `${hoveredRebateInfo.x}px`,
            top: `${hoveredRebateInfo.y - 8}px`,
            transform: "translate(-50%, -100%)",
          }}
          className="w-[325px] bg-white border border-slate-200 shadow-2xl rounded-xl p-4 z-[9999] text-left pointer-events-auto cursor-default text-slate-700 font-normal select-none normal-case tracking-normal leading-normal animate-in fade-in zoom-in-95 duration-150"
          onMouseEnter={(e) => handleRebateMouseEnter(e, "receivable_deduction", hoveredRebateInfo.item)}
          onMouseLeave={handleRebateMouseLeave}
        >
          <div className="space-y-3.5 text-xs font-sans">
            {/* 原费用 label */}
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">原费用:</div>
              <div className="flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 p-2 rounded-lg border border-slate-100/50 transition-colors">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="inline-flex items-center justify-center bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded border border-red-200 text-[10px] leading-none shrink-0">收</span>
                  <span className="truncate max-w-[150px]">采购返利</span>
                </span>
                <span className="font-mono text-slate-600 font-semibold text-xs">
                  {hoveredRebateInfo.item?.originalVal?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "2,620.00"} CNY
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 my-2"></div>

            {/* 已冲减 Section */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-bold flex items-center gap-1 text-[12px]">
                  <span className="text-[9px] text-slate-400 select-none">▼</span>
                  已冲减
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-slate-300 bg-slate-50 text-slate-500 text-[10px] font-bold cursor-help hover:bg-slate-100 transition-colors select-none">
                    ?
                  </span>
                  :
                </span>
                <span className="font-bold font-mono text-xs text-rose-600">
                  -{hoveredRebateInfo.item?.offsetVal?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "2,620.00"} CNY
                </span>
              </div>

              {/* Indented Payables */}
              <div className="pl-3.5 border-l border-slate-100 ml-1.5 space-y-2">
                <div className="flex justify-between items-center text-[11px] text-slate-600 font-medium select-none">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold px-1 py-0.5 rounded border border-emerald-200 text-[9px] leading-none shrink-0">付</span>
                    尾款 (AO260521-1)
                  </span>
                  <span className="font-mono text-slate-600 font-semibold">
                    {hoveredRebateInfo.item?.offsetVal?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "2,620.00"} CNY
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 my-2"></div>

            {/* 冲减后金额 */}
            <div className="flex justify-between items-center bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-100/80 text-slate-700 font-bold mt-1.5">
              <span className="font-bold text-slate-700">冲减后金额:</span>
              <span className="font-mono text-xs font-black text-rose-600">0.00 CNY</span>
            </div>
          </div>
        </div>
      )}

      {hoveredRebateInfo && hoveredRebateInfo.type === "payable" && (
        <div
          style={{
            position: "fixed",
            left: `${hoveredRebateInfo.x}px`,
            top: `${hoveredRebateInfo.y - 8}px`,
            transform: "translate(-50%, -100%)",
          }}
          className="w-[325px] bg-white border border-slate-200 shadow-2xl rounded-xl p-4 z-[9999] text-left pointer-events-auto cursor-default text-slate-700 font-normal select-none normal-case tracking-normal leading-normal animate-in fade-in zoom-in-95 duration-150"
          onMouseEnter={(e) => handleRebateMouseEnter(e, "payable", hoveredRebateInfo.item)}
          onMouseLeave={handleRebateMouseLeave}
        >
          <div className="space-y-3.5 text-xs font-sans">
            {/* 原费用 label */}
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">原费用:</div>
              <div className="flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 p-2 rounded-lg border border-slate-100/50 transition-colors">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded border border-emerald-200 text-[10px] leading-none shrink-0">付</span>
                  <span className="truncate max-w-[150px]">{hoveredRebateInfo.item?.name || "尾款"}</span>
                </span>
                <span className="font-mono text-slate-600 font-semibold text-xs">
                  {hoveredRebateInfo.item?.originalVal?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "5,000.00"} CNY
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 my-2"></div>

            {/* 被冲减 Section */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-bold flex items-center gap-1 text-[12px]">
                  <span className="text-[9px] text-slate-400 select-none">▼</span>
                  被冲减
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-slate-300 bg-slate-50 text-slate-500 text-[10px] font-bold cursor-help hover:bg-slate-100 transition-colors select-none">
                    ?
                  </span>
                  :
                </span>
                <span className="font-bold font-mono text-xs text-rose-600">
                  -{hoveredRebateInfo.item?.offsetVal?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "2,640.00"} CNY
                </span>
              </div>

              {/* Indented Receivables */}
              <div className="pl-3.5 border-l border-slate-100 ml-1.5 space-y-2">
                <div className="flex justify-between items-center text-[11px] text-slate-600 font-medium select-none text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center bg-rose-50 text-rose-600 font-bold px-1 py-0.5 rounded border border-rose-200 text-[9px] leading-none shrink-0">收</span>
                    采购返利 (AO260521-1)
                  </span>
                  <span className="font-mono text-slate-700 font-semibold">
                    {hoveredRebateInfo.item?.offsetVal ? "2,620.00" : "2,620.00"} CNY
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-[11px] text-slate-600 font-medium select-none text-slate-700 mt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center bg-rose-50 text-rose-600 font-bold px-1 py-0.5 rounded border border-rose-200 text-[9px] leading-none shrink-0">收</span>
                    其它垫付 (AO260521-1)
                  </span>
                  <span className="font-mono text-slate-700 font-semibold">
                    20.00 CNY
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 my-2"></div>

            {/* 冲减后金额 */}
            <div className="flex justify-between items-center bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-100/80 text-slate-700 font-bold mt-1.5">
              <span className="font-bold text-slate-700">冲减后金额:</span>
              <span className="font-mono text-xs font-black text-rose-600">
                {hoveredRebateInfo.item?.originalVal ? (hoveredRebateInfo.item.originalVal - hoveredRebateInfo.item.offsetVal).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "2,360.00"} CNY
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Void Modal */}
      {showConfirmVoidModal && (
        <div className="fixed inset-0 z-[10000] isolate">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-200 pointer-events-auto">
            <div className="w-[420px] bg-white rounded-xl shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
              <div className="flex items-center space-x-3 mb-4 text-red-600 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <Trash2 size={20} className="text-red-500" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">作废冲减确认</h3>
              </div>
              
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                确认要作废已冲减吗？作废后，冲减的费用将恢复到冲减前的原金额
              </p>
              
              <div className="flex justify-end space-x-3 font-semibold">
                <button
                  onClick={() => setShowConfirmVoidModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-650 font-bold rounded-lg hover:bg-slate-55 transition-colors text-xs cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setIsOffsetCancelled(true);
                    setShowConfirmVoidModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-200 text-xs cursor-pointer"
                >
                  确认作废
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("代采订单");
  const [activeNav, setActiveNav] = useState("贸易");
  
  const handleNavClick = (nav: string) => {
    setActiveNav(nav);
    if (nav === "贸易") {
      setActiveTab("代采订单");
    } else if (nav === "结算") {
      setActiveTab("应收费用");
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "代采订单") setActiveNav("贸易");
    if (tab === "应收费用") setActiveNav("结算");
  };

  const [viewMode, setViewMode] = useState<"create" | "detail">("create");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [rebates, setRebates] = useState([
    { id: 1, type: "返点", amountType: "按比例", amount: "2" },
    { id: 2, type: "现金折扣", amountType: "按金额", amount: "2422" },
  ]);
  const [showRebateModal, setShowRebateModal] = useState(false);
  const [manualRebateOverride, setManualRebateOverride] = useState<string>("");
  const [orderCurrency, setOrderCurrency] = useState("CNY");
  const [isOffsetCancelled, setIsOffsetCancelled] = useState(false);
  const [showConfirmVoidModal, setShowConfirmVoidModal] = useState(false);

  const [hoveredRebateInfo, setHoveredRebateInfo] = useState<{
    x: number;
    y: number;
    type: "receivable" | "payable" | "receivable_deduction";
    item?: any;
  } | null>(null);

  const rebateCloseTimeoutRef = useRef<any>(null);

  const [highlightedPayableId, setHighlightedPayableId] = useState<number | null>(null);
  const [highlightedReceivableId, setHighlightedReceivableId] = useState<number | null>(null);

  const handleViewPayableOffset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const targetId = 1;
    setHighlightedPayableId(targetId);
    setTimeout(() => {
      const el = document.getElementById(`payable-row-${targetId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
    setTimeout(() => {
      setHighlightedPayableId(null);
    }, 2000);
  };

  const handleViewReceivableRebate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const targetId = 3;
    setHighlightedReceivableId(targetId);
    setTimeout(() => {
      const el = document.getElementById(`receivable-row-${targetId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
    setTimeout(() => {
      setHighlightedReceivableId(null);
    }, 2000);
  };

  const handleRebateMouseEnter = (e: React.MouseEvent<HTMLElement>, type: "receivable" | "payable" | "receivable_deduction", item?: any) => {
    if (rebateCloseTimeoutRef.current) {
      clearTimeout(rebateCloseTimeoutRef.current);
      rebateCloseTimeoutRef.current = null;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredRebateInfo({
      x: rect.left + rect.width / 2,
      y: rect.top,
      type,
      item,
    });
  };

  const handleRebateMouseLeave = () => {
    rebateCloseTimeoutRef.current = setTimeout(() => {
      setHoveredRebateInfo(null);
    }, 120);
  };

  const getCurrencySymbolByCode = (code: string) => {
    switch (code) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "HKD":
        return "HK$";
      case "CNY":
      default:
        return "¥";
    }
  };

  const handleOrderCurrencyChange = (newCurrency: string) => {
    const oldCurrency = orderCurrency;
    setOrderCurrency(newCurrency);
    setReceivableFees((prev) =>
      prev.map((item) => {
        const currentConvCurr = item.convertedCurrency || oldCurrency;
        return {
          ...item,
          convertedCurrency:
            currentConvCurr === oldCurrency ? newCurrency : currentConvCurr,
        };
      })
    );
    setPayableFees((prev) =>
      prev.map((item) => {
        const currentConvCurr = item.convertedCurrency || oldCurrency;
        return {
          ...item,
          convertedCurrency:
            currentConvCurr === oldCurrency ? newCurrency : currentConvCurr,
        };
      })
    );
  };

  const [orderItems, setOrderItems] = useState([
    {
      id: 1,
      name: "皮鞋",
      size: "37码, 白色",
      quantity: "100",
      price: "10",
      supplyPrice: "9",
    },
    {
      id: 2,
      name: "运动鞋",
      size: "37码, 白色",
      quantity: "100",
      price: "10",
      supplyPrice: "10",
    },
    {
      id: 3,
      name: "休闲鞋",
      size: "37码, 白色",
      quantity: "100",
      price: "10",
      supplyPrice: "10",
    },
    {
      id: 4,
      name: "洞洞鞋",
      size: "37码, 白色",
      quantity: "100",
      price: "10",
      supplyPrice: "10",
    },
    {
      id: 5,
      name: "高跟鞋",
      size: "37码, 白色",
      quantity: "100",
      price: "10",
      supplyPrice: "10",
    },
  ]);

  const [receivableFees, setReceivableFees] = useState([
    {
      id: 1,
      payer: "订单客户",
      name: "尾款",
      badge: "代付货款",
      unit: "请选择",
      price: "",
      qty: "",
      amount: "3000.00",
      currency: "CNY",
      rate: "1",
      convertedAmount: "3000.00",
      convertedCurrency: "CNY",
      date: "请选择",
      remark: "",
      files: "2",
    },
    {
      id: 2,
      payer: "订单客户",
      name: "佣金",
      badge: "",
      unit: "请选择",
      price: "",
      qty: "",
      amount: "300.00",
      currency: "CNY",
      rate: "1",
      convertedAmount: "300.00",
      convertedCurrency: "CNY",
      date: "请选择",
      remark: "",
      files: "上传附件",
    },
    {
      id: 3,
      payer: "奥特莱斯贸易有限公司",
      name: "采购返利",
      badge: "返利",
      unit: "请选择",
      price: "",
      qty: "",
      amount: "220.00",
      currency: "CNY",
      rate: "1",
      convertedAmount: "220.00",
      convertedCurrency: "CNY",
      date: "请选择",
      remark: "",
      files: "上传附件",
    },
    {
      id: 4,
      payer: "奥特莱斯贸易有限公司",
      name: "其它垫付",
      badge: "",
      unit: "请选择",
      price: "",
      qty: "",
      amount: "20.00",
      currency: "CNY",
      rate: "1",
      convertedAmount: "20.00",
      convertedCurrency: "CNY",
      date: "请选择",
      remark: "",
      files: "上传附件",
    },
  ]);

  const [payableFees, setPayableFees] = useState([
    {
      id: 1,
      payee: "奥特莱斯贸易有限公司",
      name: "尾款",
      badge: "代付货款",
      unit: "双",
      price: "10",
      qty: "500",
      amount: "5000.00",
      currency: "CNY",
      rate: "1",
      convertedAmount: "5000.00",
      convertedCurrency: "CNY",
      date: "请选择",
      remark: "",
      files: "上传附件",
    },
  ]);

  const updateReceivableFee = (id: number, key: string, value: string) => {
    setReceivableFees((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [key]: value };
          if (key === "price" || key === "qty") {
            const p = parseFloat(key === "price" ? value : item.price);
            const q = parseFloat(key === "qty" ? value : item.qty);
            if (!isNaN(p) && !isNaN(q)) {
              updated.amount = (p * q).toFixed(2);
            }
          }
          if (
            key === "price" ||
            key === "qty" ||
            key === "amount" ||
            key === "rate"
          ) {
            const amt = parseFloat(updated.amount) || 0;
            const r = parseFloat(updated.rate) || 0;
            updated.convertedAmount = (amt * r).toFixed(2);
          }
          return updated;
        }
        return item;
      }),
    );
  };

  const updatePayableFee = (id: number, key: string, value: string) => {
    setPayableFees((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [key]: value };
          if (key === "price" || key === "qty") {
            const p = parseFloat(key === "price" ? value : item.price);
            const q = parseFloat(key === "qty" ? value : item.qty);
            if (!isNaN(p) && !isNaN(q)) {
              updated.amount = (p * q).toFixed(2);
            }
          }
          if (
            key === "price" ||
            key === "qty" ||
            key === "amount" ||
            key === "rate"
          ) {
            const amt = parseFloat(updated.amount) || 0;
            const r = parseFloat(updated.rate) || 0;
            updated.convertedAmount = (amt * r).toFixed(2);
          }
          return updated;
        }
        return item;
      }),
    );
  };

  const getReceivableRowAmount = (item: (typeof receivableFees)[0]) => {
    const p = parseFloat(item.price);
    const q = parseFloat(item.qty);
    let baseAmt = 0;
    if (!isNaN(p) && !isNaN(q)) {
      baseAmt = p * q;
    } else {
      baseAmt = parseFloat(item.amount) || 0;
    }

    if (
      !isOffsetCancelled &&
      item.payer === "奥特莱斯贸易有限公司" &&
      item.badge === "返利"
    ) {
      const originalFeePayable = getPayableTailOriginalAmount();
      const offsetVal = Math.min(originalFeePayable, baseAmt);
      return baseAmt - offsetVal;
    }

    return baseAmt;
  };

  const getReceivableRowConverted = (item: (typeof receivableFees)[0]) => {
    if (item.convertedAmount !== undefined && item.convertedAmount !== "") {
      if (
        item.payer === "奥特莱斯贸易有限公司" &&
        item.badge === "返利"
      ) {
        const amt = getReceivableRowAmount(item);
        const r = parseFloat(item.rate) || 1;
        return amt * r;
      }
      return parseFloat(item.convertedAmount) || 0;
    }
    const amt = getReceivableRowAmount(item);
    const r = parseFloat(item.rate) || 0;
    return amt * r;
  };

  const calculateTotalReceivableAmount = () => {
    return receivableFees.reduce(
      (sum, item) => sum + getReceivableRowAmount(item),
      0,
    );
  };

  const calculateTotalReceivableConverted = () => {
    return receivableFees.reduce(
      (sum, item) => sum + getReceivableRowConverted(item),
      0,
    );
  };

  const getReceivableConvertedCurrencyLabel = () => {
    const currencies = receivableFees.map(
      (item) => item.convertedCurrency || orderCurrency
    );
    const uniqueCurrencies = Array.from(new Set(currencies));
    return uniqueCurrencies.length === 1 ? uniqueCurrencies[0] : orderCurrency;
  };

  const getPayableTailOriginalAmount = () => {
    return orderItems.reduce(
      (sum, oItem) => sum + (parseFloat(oItem.quantity) || 0) * (parseFloat(oItem.price) || 0),
      0
    );
  };

  const getPayableRowAmount = (item: (typeof payableFees)[0]) => {
    const p = parseFloat(item.price);
    const q = parseFloat(item.qty);
    let baseAmt = 0;
    if (!isNaN(p) && !isNaN(q)) {
      baseAmt = p * q;
    } else {
      if (
        item.payee === "奥特莱斯贸易有限公司" &&
        item.name === "尾款" &&
        item.badge === "代付货款"
      ) {
        baseAmt = getPayableTailOriginalAmount();
      } else {
        baseAmt = parseFloat(item.amount) || 0;
      }
    }

    if (
      !isOffsetCancelled &&
      item.payee === "奥特莱斯贸易有限公司" &&
      item.name === "尾款" &&
      item.badge === "代付货款"
    ) {
      const rebate = getFinalRebateAmount();
      const otherOffset = receivableFees
        .filter((rf) => rf.payer === "奥特莱斯贸易有限公司" && rf.badge !== "返利")
        .reduce((sum, rf) => sum + (parseFloat(rf.amount) || 0), 0);
      return Math.max(0, baseAmt - (rebate + otherOffset));
    }

    return baseAmt;
  };

  const getPayableRowConverted = (item: (typeof payableFees)[0]) => {
    if (item.convertedAmount !== undefined && item.convertedAmount !== "") {
      if (
        item.payee === "奥特莱斯贸易有限公司" &&
        item.name === "尾款" &&
        item.badge === "代付货款"
      ) {
        const amt = getPayableRowAmount(item);
        const r = parseFloat(item.rate) || 0;
        return amt * r;
      }
      return parseFloat(item.convertedAmount) || 0;
    }
    const amt = getPayableRowAmount(item);
    const r = parseFloat(item.rate) || 0;
    return amt * r;
  };

  const calculateTotalPayableAmount = () => {
    return payableFees.reduce(
      (sum, item) => sum + getPayableRowAmount(item),
      0,
    );
  };

  const calculateTotalPayableConverted = () => {
    return payableFees.reduce(
      (sum, item) => sum + getPayableRowConverted(item),
      0,
    );
  };

  const getPayableConvertedCurrencyLabel = () => {
    const currencies = payableFees.map(
      (item) => item.convertedCurrency || orderCurrency
    );
    const uniqueCurrencies = Array.from(new Set(currencies));
    return uniqueCurrencies.length === 1 ? uniqueCurrencies[0] : orderCurrency;
  };

  const getProductRebate = () => {
    return orderItems.reduce((sum, item) => {
      const q = parseFloat(item.quantity) || 0;
      const p = parseFloat(item.price) || 0;
      const sp = parseFloat(item.supplyPrice) || 0;
      return sum + (q * p - q * sp);
    }, 0);
  };

  const calculateTotalRebate = () => {
    const productRebate = getProductRebate();
    const baseAmount =
      orderItems.reduce((sum, item) => {
        const q = parseFloat(item.quantity) || 0;
        const sp = parseFloat(item.supplyPrice) || 0;
        return sum + q * sp;
      }, 0) || 4733.3333;
    let total = productRebate;
    rebates.forEach((r) => {
      if (r.amountType === "按金额") {
        total += Number(r.amount) || 0;
      } else if (r.amountType === "按比例") {
        total += ((Number(r.amount) || 0) / 100) * baseAmount;
      }
    });
    return total;
  };

  const getFinalRebateAmount = () => {
    if (manualRebateOverride && manualRebateOverride.trim() !== "") {
      const val = parseFloat(manualRebateOverride);
      if (!isNaN(val) && val >= 0) {
        return val;
      }
    }
    return calculateTotalRebate();
  };

  const getActiveRebatesCount = () => {
    let count = 0;
    if (getProductRebate() !== 0) {
      count += 1;
    }
    rebates.forEach((r) => {
      const val = parseFloat(r.amount);
      if (!isNaN(val) && val !== 0) {
        count += 1;
      }
    });
    return count;
  };

  // Synchronize "采购返利" amount with getFinalRebateAmount()
  useEffect(() => {
    const totalRebate = getFinalRebateAmount();
    setReceivableFees((prev) => {
      const exists = prev.some((item) => item.name === "采购返利");
      if (exists) {
        return prev.map((item) => {
          if (item.name === "采购返利") {
            const amt = totalRebate.toFixed(2);
            const rate = parseFloat(item.rate) || 1;
            return {
              ...item,
              amount: amt,
              convertedAmount: (totalRebate * rate).toFixed(2),
            };
          }
          return item;
        });
      } else {
        return [
          ...prev,
          {
            id: 3,
            payer: "奥特莱斯贸易有限公司",
            name: "采购返利",
            badge: "返利",
            unit: "请选择",
            price: "",
            qty: "",
            amount: totalRebate.toFixed(2),
            currency: "CNY",
            rate: "1",
            convertedAmount: totalRebate.toFixed(2),
            convertedCurrency: "CNY",
            date: "请选择",
            remark: "",
            files: "上传附件",
          },
        ];
      }
    });
  }, [orderItems, rebates, manualRebateOverride]);

  const updateOrderItem = (
    id: number,
    key: "quantity" | "price" | "supplyPrice",
    value: string,
  ) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    );
  };

  const updateRebateAmount = (id: number, newAmount: string) => {
    setRebates(
      rebates.map((r) => (r.id === id ? { ...r, amount: newAmount } : r)),
    );
  };

  const updateRebateAmountType = (id: number, newType: string) => {
    setRebates(
      rebates.map((r) => (r.id === id ? { ...r, amountType: newType } : r)),
    );
  };

  return (
    <div className="flex h-screen w-full bg-white text-[13px] text-slate-700 font-sans overflow-hidden antialiased">
      {/* Sidebar Navigation */}
      <div className="w-14 bg-slate-900 flex flex-col items-center py-4 space-y-6 text-slate-400 shrink-0 z-20">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white mb-2">
          <Layers size={20} />
        </div>
        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer mb-2">
          <Home size={18} />
        </div>
        <div 
          onClick={() => handleNavClick("贸易")}
          className={`flex flex-col items-center space-y-1 cursor-pointer ${activeNav === "贸易" ? "text-blue-400" : "hover:text-white text-slate-400"}`}
        >
          <Briefcase size={18} />
          <span className="text-[10px] transform scale-90">贸易</span>
        </div>
        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer text-slate-400">
          <Truck size={18} />
          <span className="text-[10px] transform scale-90">运输</span>
        </div>
        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer text-slate-400">
          <Box size={18} />
          <span className="text-[10px] transform scale-90">仓库</span>
        </div>
        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer text-slate-400">
          <Building2 size={18} />
          <span className="text-[10px] transform scale-90">关务</span>
        </div>
        <div 
          onClick={() => handleNavClick("结算")}
          className={`flex flex-col items-center space-y-1 cursor-pointer ${activeNav === "结算" ? "text-blue-400" : "hover:text-white text-slate-400"}`}
        >
          <Wallet size={18} />
          <span className="text-[10px] transform scale-90">结算</span>
        </div>
        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer">
          <User size={18} />
          <span className="text-[10px] transform scale-90">客商</span>
        </div>
        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer">
          <PieChart size={18} />
          <span className="text-[10px] transform scale-90">资源</span>
        </div>
        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer mt-auto pt-4">
          <Settings size={18} />
          <span className="text-[10px] transform scale-90">设置</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 leading-tight">
        {/* Top App Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-2">
            <div 
              onClick={() => handleTabClick("首页")}
              className={`flex items-center space-x-1 ${activeTab === '首页' ? 'bg-blue-50 text-blue-600 rounded-md' : 'border-r border-slate-200 text-slate-500 hover:text-blue-600'} pr-2 py-1 ml-2 cursor-pointer`}
            >
              <span className={`px-3 uppercase tracking-wider text-xs ${activeTab === '首页' ? 'font-semibold' : 'font-medium'}`}>
                首页
              </span>
              <X size={14} className={activeTab === '首页' ? 'text-blue-400 hover:text-blue-600' : 'text-transparent'} />
            </div>
            
            <div 
              onClick={() => handleTabClick("应收费用")}
              className={`flex items-center space-x-1 ${activeTab === '应收费用' ? 'bg-blue-50 text-blue-600 rounded-md' : 'border-r border-slate-200 text-slate-500 hover:text-blue-600'} pr-2 py-1 ml-2 cursor-pointer`}
            >
              <span className={`px-3 uppercase tracking-wider text-xs ${activeTab === '应收费用' ? 'font-semibold' : 'font-medium'}`}>
                应收费用
              </span>
              <X size={14} className={activeTab === '应收费用' ? 'text-blue-400 hover:text-blue-600' : 'text-slate-400 hover:text-slate-600'} />
            </div>
            
            <div 
              onClick={() => handleTabClick("代采订单")}
              className={`flex items-center space-x-1 ${activeTab === '代采订单' ? 'bg-blue-50 text-blue-600 rounded-md' : 'border-r border-slate-200 text-slate-500 hover:text-blue-600'} pr-2 py-1 ml-2 cursor-pointer`}
            >
              <span className={`px-3 uppercase tracking-wider text-xs ${activeTab === '代采订单' ? 'font-semibold' : 'font-medium'}`}>
                代采订单
              </span>
              <X size={14} className={activeTab === '代采订单' ? 'text-blue-400 hover:text-blue-600' : 'text-slate-400 hover:text-slate-600'} />
            </div>
          </div>

          <div className="flex items-center space-x-6 text-slate-500">
            <Search size={18} className="cursor-pointer hover:text-slate-800" />
            <LayoutGrid
              size={18}
              className="cursor-pointer hover:text-slate-800"
            />
            <Download
              size={18}
              className="cursor-pointer hover:text-slate-800"
            />
            <div className="relative cursor-pointer hover:text-slate-800">
              <Bell size={18} />
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5 border-2 border-white">
                99
              </span>
            </div>
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6 cursor-pointer">
              <span className="text-sm font-medium">简体中文</span>
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
                <User size={16} className="text-slate-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace Area */}
        {activeTab === '代采订单' && (
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Workspace Workspace Navigation */}
        <div className="bg-white border-b border-slate-200 px-6 flex space-x-8 h-12 shrink-0">
          {[
            "全部",
            "待下单 (9)",
            "备货中 (11)",
            "收货中 (2)",
            "已收货 (9)",
            "转运中 (16)",
            "改单中 (0)",
            "结算中 (29)",
            "已完成",
            "已取消",
          ].map((tab) => (
            <div
              key={tab}
              className={`flex items-center h-full border-b-2 px-1 cursor-pointer whitespace-nowrap text-sm ${tab === "全部" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500 hover:text-slate-900 font-medium"}`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center space-x-3 shrink-0 flex-wrap gap-y-3">
          <select className="border border-slate-200 rounded-md px-3 py-1.5 min-w-[120px] bg-white outline-none focus:border-blue-500 text-slate-700 shadow-sm">
            <option>客户</option>
          </select>
          <select className="border border-slate-200 rounded-md px-3 py-1.5 min-w-[120px] bg-white outline-none focus:border-blue-500 text-slate-400 shadow-sm">
            <option>客户抬头</option>
          </select>
          <select className="border border-slate-200 rounded-md px-3 py-1.5 min-w-[120px] bg-white outline-none focus:border-blue-500 text-slate-400 shadow-sm">
            <option>供货商</option>
          </select>
          <select className="border border-slate-200 rounded-md px-3 py-1.5 min-w-[120px] bg-white outline-none focus:border-blue-500 text-slate-400 shadow-sm">
            <option>验货状态</option>
          </select>

          <div className="flex border border-slate-200 rounded-md ml-2 shadow-sm overflow-hidden">
            <select className="px-3 py-1.5 outline-none bg-slate-50 border-r border-slate-200 text-slate-700">
              <option>下单日期</option>
            </select>
            <input
              type="text"
              placeholder="开始日期"
              className="w-24 px-3 py-1.5 outline-none text-center bg-white"
            />
            <span className="flex items-center text-slate-400 bg-white px-2">
              -
            </span>
            <input
              type="text"
              placeholder="结束日期"
              className="w-24 px-3 py-1.5 outline-none text-center bg-white"
            />
          </div>

          <div className="flex border border-slate-200 rounded-md items-center ml-2 flex-grow max-w-sm shadow-sm overflow-hidden bg-white">
            <select className="px-3 py-1.5 outline-none bg-slate-50 border-r border-slate-200 text-slate-700">
              <option>代采单号</option>
            </select>
            <input
              type="text"
              placeholder="请输入"
              className="flex-1 px-3 py-1.5 outline-none"
            />
          </div>

          <button className="border border-slate-200 rounded-md p-1.5 text-slate-500 hover:bg-slate-50 shadow-sm">
            <Search size={18} />
          </button>

          <button className="bg-blue-600 text-white px-5 py-1.5 rounded-md hover:bg-blue-700 ml-4 font-medium shadow-sm transition-colors">
            查询
          </button>
          <button className="border border-slate-200 px-5 py-1.5 rounded-md text-slate-700 hover:bg-slate-50 font-medium shadow-sm transition-colors">
            重置
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-white px-6 py-3 flex items-center space-x-3 border-b border-slate-200 shrink-0">
          <div className="flex rounded-md border border-slate-200 bg-slate-50 mr-4 shadow-sm overflow-hidden">
            <button className="flex items-center px-3 py-1.5 border-r border-slate-200 hover:bg-white text-slate-600 font-medium transition-colors">
              <List size={14} className="mr-1.5" /> 列表
            </button>
            <button className="flex items-center px-3 py-1.5 bg-white text-blue-600 font-bold border-b-2 border-blue-600">
              <LayoutGrid size={14} className="mr-1.5" /> 卡片
            </button>
          </div>

          <button className="bg-blue-600 text-white px-5 py-1.5 rounded-md hover:bg-blue-700 font-medium mr-2 shadow-sm transition-colors">
            新增
          </button>

          <div className="flex items-center space-x-2">
            {[
              "提交",
              "验货",
              "收货",
              "核单",
              "导入装箱单",
              "客户签收",
              "交付运输",
              "配舱装柜",
              "新增费用",
              "请款",
              "收款",
              "生成账单",
              "编辑",
              "复制",
              "导入代采单",
              "导出",
              "打印",
              "更多",
            ].map((action, i) => (
              <button
                key={i}
                className={`px-3 py-1.5 border rounded-md text-xs font-medium transition-colors ${["导入代采单", "导出", "打印", "更多"].includes(action) ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm" : "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200"}`}
              >
                {action}{" "}
                {action === "更多" && (
                  <ChevronDown size={12} className="inline ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Split Pane */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Panel - Order List Wrapper */}
          <div 
            className={`transition-all duration-300 ease-in-out flex-shrink-0 relative bg-white border-slate-200 z-10 ${isSidebarCollapsed ? "w-0 border-r-0" : "w-[320px] border-r"}`}
          >
            {/* Toggle Button */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer z-[100] transition-colors rounded-r-md shadow-sm border border-slate-200 border-l-0 bg-white hover:bg-slate-50 text-slate-400 hover:text-blue-500"
              style={{
                right: "-14px",
                width: "14px",
                height: "64px"
              }}
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "展开" : "折叠"}
            >
              {isSidebarCollapsed ? <ChevronRight size={14} className="-ml-1" /> : <ChevronLeft size={14} className="-ml-1" />}
            </div>

            <div className={`w-[320px] bg-white flex flex-col h-full absolute top-0 left-0 overflow-hidden transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "-translate-x-full opacity-0 pointer-events-none delay-0" : "translate-x-0 opacity-100 delay-100"}`}>
              <div className="p-4 border-b border-slate-200 flex justify-between items-center text-slate-700 font-bold uppercase tracking-wider text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                代采订单
              </div>
              <div className="flex items-center text-slate-500 font-normal normal-case tracking-normal">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-slate-300"
                />{" "}
                全选
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-50 p-3 space-y-3">
              {/* Card - Create Mode */}
              <div
                onClick={() => setViewMode("create")}
                className={`bg-white rounded-xl p-3.5 relative cursor-pointer transition-all ${
                  viewMode === "create"
                    ? "border-2 border-blue-500 shadow-sm"
                    : "border border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-0.5 mr-2.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    defaultChecked={viewMode === "create"}
                  />
                  <div className="flex-1 space-y-2.5 min-w-0">
                    <div className="flex items-center text-sm font-bold text-slate-900">
                      <span className="inline-flex items-center justify-center bg-[#f97316] text-white text-[11px] font-bold w-5 h-5 rounded-full shrink-0 mr-2">客</span>
                      <span className="truncate">--</span>
                      <span className="text-slate-500 font-normal ml-2 text-xs shrink-0">抬头: --</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                      <div className="flex items-center min-w-0">
                        <span className="inline-flex items-center justify-center bg-[#3b82f6] text-white text-[11px] font-bold w-5 h-5 rounded-full shrink-0 mr-2">供</span>
                        <span className="truncate">--</span>
                      </div>
                      <span className="text-blue-500 text-xs font-normal shrink-0 ml-2">点击进入新增卡片</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 text-xs pl-7">
                      <div>代采单号: <span className="text-slate-400">--</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card - Detail Mode */}
              {[
                { no: "AO260511-1", customer: "TIANQU", title: "TIANQU", supplier: "田趣", tag: "转", extraTag: "验", highlightDetail: true },
                { no: "AO260514-1", customer: "黄黄", title: "黄黄", supplier: "VITA工厂", tag: "", extraTag: "验" },
                { no: "AO260515-6", customer: "黄黄", title: "黄黄", supplier: "VITA工厂", tag: "转", extraTag: "验" },
                { no: "AO260515-11", customer: "TIANQU", title: "TIANQU", supplier: "田趣", tag: "", extraTag: "验" },
                { no: "AO260515-14", customer: "TIANQU", title: "TIANQU", supplier: "田趣", tag: "转", extraTag: "验" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setViewMode("detail")}
                  className={`bg-white rounded-xl p-3.5 relative cursor-pointer transition-all ${
                    viewMode === "detail" && idx === 0
                      ? "border-2 border-blue-500 shadow-sm"
                      : "border border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-0.5 mr-2.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 space-y-2.5 min-w-0">
                      <div className="flex items-center text-sm font-bold text-slate-900">
                        <span className="inline-flex items-center justify-center bg-[#f97316] text-white text-[11px] font-bold w-5 h-5 rounded-full shrink-0 mr-2">客</span>
                        <span className="truncate">{item.customer}</span>
                        <span className="text-slate-500 font-normal ml-2 text-xs shrink-0">抬头: {item.title}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                        <div className="flex items-center min-w-0">
                          <span className="inline-flex items-center justify-center bg-[#3b82f6] text-white text-[11px] font-bold w-5 h-5 rounded-full shrink-0 mr-2">供</span>
                          <span className="truncate">{item.supplier}</span>
                          {item.tag && (
                            <span className="ml-1.5 px-1 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded shrink-0">{item.tag}</span>
                          )}
                        </div>
                        {item.highlightDetail && (
                          <span className="text-blue-500 text-xs font-normal shrink-0 ml-2">点击进入详情</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-slate-500 text-xs pl-7">
                        <div>代采单号: <span className="text-blue-600 cursor-pointer hover:underline">{item.no}</span></div>
                        {item.extraTag && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded shrink-0">{item.extraTag}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-200 flex justify-between items-center bg-white text-xs text-slate-500 font-medium">
              <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
                <ChevronDown className="rotate-90" size={16} />
              </button>
              <div className="flex items-center space-x-3">
                <span className="bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded border border-blue-200">
                  1
                </span>
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                  100 条/页 <ChevronDown size={14} />
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Right Panel - Form Workspace */}
          {viewMode === "detail" ? (
            <PurchaseOrderDetail />
          ) : (
            <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
              {/* Form Header area */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex flex-col space-y-6 shrink-0 relative shadow-sm z-10">
              <div className="flex items-center justify-between z-10 w-full relative">
                <div className="flex items-center space-x-3 absolute top-0 left-0 bg-white pr-6 z-20">
                  <span className="font-bold text-2xl text-slate-900 tracking-tight">
                    新增代采单
                  </span>
                </div>

                {/* Stepper absolute positioning for full centering */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 hidden lg:flex">
                  <div className="flex items-center w-full max-w-4xl px-12 pt-8">
                    {[
                      "创建",
                      "下单确认",
                      "采购",
                      "收货",
                      "排货计划",
                      "交付",
                      "收款",
                      "完成",
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className="flex-1 flex items-center relative"
                      >
                        <div className="flex flex-col items-center flex-1 justify-center relative translate-y-4">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap mt-2 ${idx === 0 ? "text-blue-600" : "text-slate-400"}`}
                          >
                            0{idx + 1} {step}
                          </span>
                        </div>
                        <div className="absolute inset-x-0 -top-1 flex items-center pointer-events-none w-full">
                          <div
                            className={`w-3 h-3 rounded-full z-10 border-2 ${idx === 0 ? "bg-blue-600 border-blue-200 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]" : "bg-slate-200 border-white"}`}
                          ></div>
                          {idx < 7 && (
                            <div className="h-0.5 w-full bg-slate-100 ml-1 mr-1"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center text-slate-500 text-sm pt-8 font-medium">
                <User size={16} className="text-blue-600 mr-2" />
                <span>MDUMIDUM/KH0469</span>
                <span className="mx-2 text-slate-300">|</span>
                <span>抬头: MDUMIDUM</span>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
              {/* Section 1: 基础信息 */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    基础信息
                  </h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8">
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        <span className="text-blue-600 mr-1">*</span>代采公司
                      </label>
                      <select className="border border-slate-200 rounded-md px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none w-full text-slate-900 font-medium transition-colors">
                        <option>产品老师的企业</option>
                      </select>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        <span className="text-blue-600 mr-1">*</span>交易币种
                      </label>
                      <select className="border border-slate-200 rounded-md px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none w-full text-slate-900 font-medium transition-colors">
                        <option>CNY-人民币</option>
                      </select>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        <span className="text-blue-600 mr-1">*</span>下单日期
                      </label>
                      <input
                        type="text"
                        value="2026-05-25 周一"
                        className="border border-slate-200 rounded-md px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none w-full text-slate-900 font-medium transition-colors"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        期望交货日期
                      </label>
                      <input
                        type="text"
                        value="2026-05-16 周六"
                        className="border border-slate-200 rounded-md px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none w-full text-slate-900 font-medium transition-colors"
                        readOnly
                      />
                    </div>

                    <div className="flex flex-col space-y-2 col-span-1 md:col-span-2 lg:col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        整单验货
                      </label>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center justify-center w-5 h-5 rounded border border-blue-500 bg-blue-600 text-white">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="w-3 h-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="font-bold text-slate-900">验货</span>
                        <div className="flex-1 border border-slate-200 rounded-md px-3 py-2 flex items-center bg-slate-50 justify-between ml-4">
                          <span className="text-slate-700 font-medium">
                            无严重色差、无变形
                          </span>
                          <X
                            size={16}
                            className="text-slate-400 cursor-pointer hover:text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        业务员
                      </label>
                      <select className="border border-slate-200 rounded-md px-3 py-2 bg-slate-100 focus:border-blue-500 outline-none w-full text-slate-500 transition-colors">
                        <option>郭婵玲</option>
                      </select>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        相关人员
                      </label>
                      <div className="flex items-center space-x-3">
                        <span className="bg-slate-100 border border-slate-200 text-slate-700 font-medium px-3 py-2 rounded-md flex-1">
                          管理员
                        </span>
                        <button className="text-blue-600 font-bold hover:text-blue-700 text-sm whitespace-nowrap">
                          选择
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        交付条款
                      </label>
                      <select className="border border-slate-200 rounded-md px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none w-full text-slate-900 font-medium transition-colors">
                        <option>DDU</option>
                      </select>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        外部单号
                      </label>
                      <input
                        type="text"
                        placeholder="请输入"
                        className="border border-slate-200 rounded-md px-3 py-2 bg-white focus:border-blue-500 outline-none w-full text-slate-900 transition-colors placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex flex-col space-y-2 col-span-1 md:col-span-2 lg:col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        订单备注
                      </label>
                      <input
                        type="text"
                        placeholder="请输入"
                        className="border border-slate-200 rounded-md px-3 py-2 bg-white focus:border-blue-500 outline-none w-full text-slate-900 transition-colors placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: 客户信息 */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    客户信息
                  </h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-10 cursor-default">
                  <div className="flex flex-col space-y-2 lg:col-span-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      <span className="text-blue-600 mr-1">*</span>客户名称
                    </label>
                    <div className="flex items-center space-x-3 min-w-0">
                      <select className="flex-1 border border-slate-200 rounded-md px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-slate-900 font-medium transition-colors truncate">
                        <option>MDUMIDUM/KH0469</option>
                      </select>
                      <button className="text-blue-600 font-bold hover:text-blue-700 text-sm whitespace-nowrap">
                        查看
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 lg:col-span-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      抬头/子抬头
                    </label>
                    <div className="flex items-center space-x-2 min-w-0">
                      <select className="flex-1 border border-slate-200 rounded-md px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-slate-900 font-medium transition-colors truncate min-w-0">
                        <option>MDUMI...</option>
                      </select>
                      <span className="text-slate-300 font-light text-xl">
                        /
                      </span>
                      <select className="flex-1 border border-slate-200 rounded-md px-3 py-2 bg-slate-100 outline-none min-w-0"></select>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 lg:col-span-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      结算方式
                    </label>
                    <select className="border border-slate-200 rounded-md px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none w-full text-slate-900 font-medium transition-colors">
                      <option>现结</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-2 lg:col-span-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      付款期限
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="请输入"
                        className="flex-1 border border-slate-200 rounded-md px-3 py-2 bg-white focus:border-blue-500 outline-none text-slate-900 transition-colors placeholder:text-slate-400"
                      />
                      <span className="text-slate-500 font-medium">天</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: 供货商信息 */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    供货商信息
                  </h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-10">
                  <div className="flex flex-col space-y-2 lg:col-span-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      <span className="text-blue-600 mr-1">*</span>供货商
                    </label>
                    <div className="flex items-center space-x-3 min-w-0">
                      <select className="flex-1 border border-slate-200 rounded-md px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-slate-900 font-medium transition-colors truncate">
                        <option>奥特莱斯贸易有限公司/KS0...</option>
                      </select>
                      <button className="text-blue-600 font-bold hover:text-blue-700 text-sm whitespace-nowrap">
                        查看
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 lg:col-span-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      结算方式
                    </label>
                    <select className="border border-slate-200 rounded-md px-3 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none w-full text-slate-900 font-medium transition-colors">
                      <option>现结</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-2 lg:col-span-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      付款期限
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="请输入"
                        className="flex-1 border border-slate-200 rounded-md px-3 py-2 bg-slate-100 outline-none text-slate-400 transition-colors placeholder:text-slate-400"
                        disabled
                      />
                      <span className="text-slate-500 font-medium">天</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: 订货信息 */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    订货信息
                  </h3>
                </div>

                <div className="p-8 space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                          <ShoppingBag size={16} />
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                          商品种类/订货量
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 tracking-tight">
                        105/1590
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded flex items-center justify-center">
                          <Box size={16} />
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                          件/毛(KG)/体(m³)
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 tracking-tight">
                        60/60{" "}
                        <span className="text-slate-400 font-normal">/6</span>
                      </p>
                    </div>
                    <div className="bg-blue-900 text-white rounded-xl p-5 border border-blue-950 flex flex-col justify-center shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-800 text-blue-300 rounded flex items-center justify-center border border-blue-700">
                          <Wallet size={16} />
                        </div>
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">
                          应收总额/总利润
                        </p>
                      </div>
                      <p className="font-bold leading-tight flex items-baseline gap-2">
                        <span className="text-2xl tracking-tight text-white">
                          {getCurrencySymbolByCode(getReceivableConvertedCurrencyLabel())}
                          {Math.floor(
                            calculateTotalReceivableConverted(),
                          ).toLocaleString("en-US")}
                        </span>
                        <span className="text-sm text-blue-300">
                          .
                          {(calculateTotalReceivableConverted() % 1)
                            .toFixed(2)
                            .split(".")[1] || "00"}
                        </span>
                        <span className="text-blue-500 font-normal">/</span>
                        <span className="text-xl text-green-400">
                          ¥
                          {Math.floor(getFinalRebateAmount()).toLocaleString(
                            "en-US",
                          )}
                        </span>
                        <span className="text-xs text-green-700">
                          .
                          {(getFinalRebateAmount() % 1)
                            .toFixed(2)
                            .split(".")[1] || "00"}
                        </span>
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-5 border border-orange-200 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded flex items-center justify-center border border-orange-200">
                          <CircleDollarSign size={16} />
                        </div>
                        <p className="text-orange-800 text-xs font-bold uppercase tracking-wider">
                          代付供货商/货款
                        </p>
                      </div>
                      <p className="font-bold leading-tight flex items-baseline gap-1 text-slate-900">
                        <span className="text-2xl tracking-tight">
                          ¥
                          {Math.floor(
                            (parseFloat(
                              receivableFees.find((r) => r.name === "尾款")
                                ?.amount || "16890",
                            ) || 0) * 0.92895,
                          ).toLocaleString("en-US")}
                        </span>
                        <span className="text-sm text-slate-500">.00</span>
                        <span className="text-slate-300 font-normal mx-1">
                          /
                        </span>
                        <span className="text-lg">
                          ¥
                          {Math.floor(
                            parseFloat(
                              receivableFees.find((r) => r.name === "尾款")
                                ?.amount || "16890",
                            ) || 0,
                          ).toLocaleString("en-US")}
                        </span>
                        <span className="text-xs text-slate-500">.00</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions for Order Info */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-3">
                      <button className="bg-blue-600 text-white px-5 py-2.5 rounded-md font-bold shadow-sm hover:bg-blue-700 transition-colors">
                        选择商品
                      </button>
                      <button className="border border-slate-200 text-slate-700 px-5 py-2.5 rounded-md bg-white hover:bg-slate-50 font-bold shadow-sm transition-colors">
                        导入商品
                      </button>
                      <button className="border border-slate-200 text-slate-400 px-5 py-2.5 rounded-md bg-slate-50 cursor-not-allowed font-medium">
                        复制
                      </button>
                      <button className="border border-slate-200 text-slate-400 px-5 py-2.5 rounded-md bg-slate-50 cursor-not-allowed font-medium">
                        删除
                      </button>
                    </div>
                    <div className="flex space-x-3">
                      <button className="border border-slate-200 rounded-md p-2.5 text-slate-500 hover:bg-slate-50 bg-white shadow-sm transition-colors">
                        <Settings size={18} />
                      </button>
                      <button className="border border-slate-200 rounded-md p-2.5 text-slate-500 hover:bg-slate-50 bg-white shadow-sm transition-colors">
                        <AlertCircle size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm bg-white">
                    <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                      <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                        <tr>
                          <th className="p-4 w-12 text-center border-r border-slate-100">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 cursor-pointer accent-blue-600"
                            />
                          </th>
                          <th className="p-4 border-r border-slate-100">
                            序号
                          </th>
                          <th className="p-4 border-r border-slate-100 text-center">
                            图片
                          </th>
                          <th className="p-4 border-r border-slate-100">
                            供货商货号
                          </th>
                          <th className="p-4 border-r border-slate-100">
                            <span className="text-blue-600 font-black mr-1">
                              *
                            </span>
                            品名/SKU
                          </th>
                          <th className="p-4 border-r border-slate-100">
                            规格型号
                          </th>
                          <th className="p-4 border-r border-slate-100">
                            计量单位{" "}
                            <span className="bg-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded ml-1 font-bold">
                              批量
                            </span>
                          </th>
                          <th className="p-4 border-r border-slate-100">
                            <span className="text-blue-600 font-black mr-1">
                              *
                            </span>
                            订货量
                          </th>
                          <th className="p-4 border-r border-slate-100">
                            <span className="text-blue-600 font-black mr-1">
                              *
                            </span>
                            订货单价{" "}
                            <span className="bg-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded ml-1 font-bold">
                              批量
                            </span>
                          </th>
                          <th className="p-4 border-r border-slate-100">
                            供货单价
                          </th>
                          <th className="p-4 border-r border-slate-100">
                            订货金额
                          </th>
                          <th className="p-4 border-r border-slate-100">
                            供货金额
                          </th>
                          <th className="p-4 border-r border-slate-100">
                            商品利润
                          </th>
                          <th className="p-4">
                            单箱数量{" "}
                            <span className="bg-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded ml-1 font-bold">
                              批量
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                        {orderItems.map((item, idx) => {
                          const orderAmount =
                            (parseFloat(item.quantity) || 0) *
                            (parseFloat(item.price) || 0);
                          const supplyAmount =
                            (parseFloat(item.supplyPrice) || 0) *
                            (parseFloat(item.quantity) || 0);
                          const profit = orderAmount - supplyAmount;

                          return (
                            <tr
                              key={item.id}
                              className="hover:bg-blue-50/30 transition-colors group"
                            >
                              <td className="p-3 text-center border-r border-slate-100">
                                <input
                                  type="checkbox"
                                  className="rounded border-slate-300 cursor-pointer accent-blue-600"
                                />
                              </td>
                              <td className="p-3 border-r border-slate-100 text-slate-400 text-center">
                                {idx + 1}
                              </td>
                              <td className="p-3 border-r border-slate-100">
                                <div className="flex items-center justify-center space-x-2">
                                  <button className="w-6 h-6 flex items-center justify-center border border-slate-200 text-slate-400 bg-slate-50 hover:bg-slate-200 hover:text-slate-700 rounded transition-colors">
                                    +
                                  </button>
                                  <div className="w-7 h-7 border border-slate-200 bg-white rounded overflow-hidden flex items-center justify-center shadow-sm">
                                    <svg
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      className="text-slate-300 w-4 h-4"
                                    >
                                      <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        ry="2"
                                      ></rect>
                                      <circle
                                        cx="8.5"
                                        cy="8.5"
                                        r="1.5"
                                      ></circle>
                                      <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100 text-center font-mono text-slate-500">
                                {idx + 1}
                              </td>
                              <td className="p-3 border-r border-slate-100">
                                <div className="flex items-center justify-between text-slate-900 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer transition-colors w-28">
                                  <span>{item.name}</span>
                                  <ChevronDown
                                    size={14}
                                    className="text-slate-300 group-hover:text-slate-400"
                                  />
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100 text-slate-500">
                                {item.size}
                              </td>
                              <td className="p-3 border-r border-slate-100">
                                <div className="flex items-center justify-between text-slate-700 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer transition-colors w-24">
                                  <span>个/PC</span>
                                  <ChevronDown
                                    size={14}
                                    className="text-slate-300 group-hover:text-slate-400"
                                  />
                                </div>
                              </td>
                              <td className="p-1 px-3 border-r border-slate-100 text-right">
                                <input
                                  type="text"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateOrderItem(
                                      item.id,
                                      "quantity",
                                      e.target.value,
                                    )
                                  }
                                  className="w-16 px-1.5 py-1 text-right border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white rounded outline-none font-mono text-slate-800"
                                />
                              </td>
                              <td className="p-1 px-3 border-r border-slate-100 text-right">
                                <input
                                  type="text"
                                  value={item.price}
                                  onChange={(e) =>
                                    updateOrderItem(
                                      item.id,
                                      "price",
                                      e.target.value,
                                    )
                                  }
                                  className="w-16 px-1.5 py-1 text-right border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white rounded outline-none font-mono text-slate-800"
                                />
                              </td>
                              <td className="p-1 px-3 border-r border-slate-100 text-right">
                                <input
                                  type="text"
                                  value={item.supplyPrice}
                                  onChange={(e) =>
                                    updateOrderItem(
                                      item.id,
                                      "supplyPrice",
                                      e.target.value,
                                    )
                                  }
                                  className="w-16 px-1.5 py-1 text-right border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white rounded outline-none font-mono text-slate-800"
                                />
                              </td>
                              <td className="p-3 border-r border-slate-100 text-right font-mono text-slate-900 bg-slate-50/50">
                                {orderAmount.toLocaleString("en-US", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="p-3 border-r border-slate-100 text-right font-mono text-slate-900 bg-slate-50/50">
                                {supplyAmount.toLocaleString("en-US", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td
                                className={`p-3 border-r border-slate-100 text-right font-mono font-bold bg-green-50/20 ${profit >= 0 ? "text-green-600" : "text-red-500"}`}
                              >
                                {profit.toLocaleString("en-US", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="p-3 text-right font-mono text-slate-500">
                                10
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Table Footer Controls */}
                    <div className="p-5 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-y-4 gap-x-6 text-xs xl:flex-nowrap">
                      {/* Left Block */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-700 font-bold uppercase tracking-wider">
                            佣金:
                          </span>
                          <div className="flex border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm">
                            <select className="px-3 py-2 border-r border-slate-200 focus:bg-slate-50 outline-none text-slate-700 font-medium">
                              <option>按比例</option>
                            </select>
                            <input
                              type="text"
                              defaultValue="10.00"
                              className="w-20 px-3 py-2 text-slate-900 font-mono text-center outline-none focus:bg-slate-50"
                              readOnly
                            />
                            <span className="px-3 py-2 bg-slate-50 border-l border-slate-200 text-slate-500 font-bold">
                              %
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-700 font-bold uppercase tracking-wider">
                            定金:
                          </span>
                          <div className="flex border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm">
                            <input
                              type="text"
                              defaultValue="0.00"
                              className="w-24 px-3 py-2 text-slate-900 font-mono text-center outline-none focus:bg-slate-50"
                              readOnly
                            />
                            <span className="px-3 py-2 bg-slate-50 border-l border-slate-200 text-slate-500 font-bold text-[10px] tracking-widest">
                              CNY
                            </span>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                            />
                            <span className="text-slate-600 font-bold group-hover:text-slate-900 transition-colors">
                              代付
                            </span>
                          </label>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-700 font-bold uppercase tracking-wider">
                            尾款:
                          </span>
                          <div className="flex border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm">
                            <input
                              type="text"
                              defaultValue="3000"
                              className="w-24 px-3 py-2 text-slate-900 font-mono font-bold text-center outline-none focus:bg-slate-50"
                            />
                            <span className="px-3 py-2 bg-slate-50 border-l border-slate-200 text-slate-500 font-bold text-[10px] tracking-widest">
                              CNY
                            </span>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                            />
                            <span className="text-slate-600 font-bold group-hover:text-slate-900 transition-colors">
                              代付
                            </span>
                          </label>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-700 font-bold uppercase tracking-wider">
                            是否含税:
                          </span>
                          <select className="border border-slate-200 rounded-md px-3 py-2 focus:border-blue-500 outline-none text-slate-900 font-bold bg-white shadow-sm w-20 cursor-pointer">
                            <option>否</option>
                            <option>是</option>
                          </select>
                        </div>
                      </div>

                      {/* Right Block: Rebates */}
                      <div className="flex items-center justify-end whitespace-nowrap">
                        {rebates.length <= 1 ? (
                          <div className="flex items-center">
                            <span className="text-slate-700 font-bold uppercase tracking-wider mr-3">
                              采购返利:
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="border border-slate-200 bg-white rounded flex shadow-sm hover:border-slate-300 overflow-hidden w-24">
                                <select
                                  className="w-full px-2 py-1.5 focus:bg-slate-50 outline-none text-slate-700 font-medium cursor-pointer"
                                  defaultValue="按比例"
                                >
                                  <option>按比例</option>
                                  <option>按金额</option>
                                </select>
                              </div>
                              <div className="flex border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm w-28 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
                                <input
                                  type="text"
                                  defaultValue={rebates[0]?.amount || "10.00"}
                                  className="w-full px-2 py-1.5 text-slate-900 font-mono text-center outline-none focus:bg-slate-50"
                                />
                                <span className="px-2 py-1.5 bg-slate-50 border-l border-slate-200 text-slate-500 font-bold text-[10px] tracking-widest flex items-center">
                                  %
                                </span>
                              </div>
                              <button
                                onClick={() => setShowRebateModal(true)}
                                className="text-blue-600 hover:text-blue-800 font-medium transition cursor-pointer ml-1"
                              >
                                添加多项
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-md shadow-sm">
                              <span className="text-slate-500 font-medium mr-1.5">
                                采购返利
                                {getActiveRebatesCount() >= 2
                                  ? ` (${getActiveRebatesCount()})`
                                  : ""}
                                :
                              </span>
                              <span className="font-mono font-bold text-slate-800 mr-4">
                                {getFinalRebateAmount().toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  },
                                )}{" "}
                                CNY
                              </span>
                              <div className="w-[1px] h-3.5 bg-slate-300 mx-1"></div>
                              <div
                                onClick={() => setShowRebateModal(true)}
                                className="flex items-center ml-3 text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition-colors"
                              >
                                编辑{" "}
                                <ChevronRight size={14} className="ml-0.5" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs for Related Services / Fee Management / Attachment Management */}
              <div className="flex border-b border-slate-200 mb-6 px-2">
                {["相关服务", "费用管理", "附件管理"].map((tab) => (
                  <div
                    key={tab}
                    className={`px-6 py-3 cursor-pointer text-sm font-bold tracking-wider relative ${tab === "费用管理" ? "text-blue-600" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {tab}
                    {tab === "费用管理" && (
                      <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-blue-600"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Fee Management Content */}
              <div className="space-y-6 mb-24">
                {/* Profit Summary */}
                <div className="bg-[#fff9e6] border border-[#ffeb99] rounded-md px-4 py-3 flex items-center shadow-sm">
                  <span className="font-bold text-slate-800 mr-2 text-sm">
                    预估利润: {(calculateTotalReceivableConverted() - calculateTotalPayableConverted()).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} CNY
                  </span>
                  <span className="text-xs text-slate-500">
                    (应收应付未录全利润仅供参考)
                  </span>
                </div>

                {/* Accounts Receivable */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm relative z-10 hover:z-20 transition-all">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-3.5 bg-blue-600 rounded"></div>
                      <span className="font-bold text-slate-800 text-sm">
                        应收费用
                      </span>
                      <ChevronDown size={16} className="text-slate-400" />
                    </div>
                  </div>

                  <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-y-3 bg-white">
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium text-xs shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition">
                        新增
                      </button>
                      <button className="border border-slate-200 bg-white text-slate-700 px-4 py-1.5 rounded-md font-medium text-xs shadow-sm hover:bg-slate-50 flex items-center transition">
                        新增代付款{" "}
                        <HelpCircle
                          size={14}
                          className="text-slate-400 ml-1.5"
                        />
                      </button>
                      {[
                        "重置",
                        "复制",
                        "删除",
                        "同步添加应付",
                        "批量更新汇率",
                      ].map((btn) => (
                        <button
                          key={btn}
                          className="border border-slate-200 bg-slate-50 text-slate-400 px-4 py-1.5 rounded-md font-medium text-xs cursor-not-allowed hidden lg:block"
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1.5 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50 shadow-sm transition">
                        <LayoutGrid size={16} />
                      </button>
                      <button className="p-1.5 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50 shadow-sm transition">
                        <Settings size={16} />
                      </button>
                      <button className="p-1.5 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50 shadow-sm transition">
                        <Expand size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Receivable Table */}
                  <div className="overflow-visible rounded-b-xl relative z-10">
                    <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                      <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 text-center border-r border-slate-100 w-10">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 accent-blue-600 cursor-pointer"
                            />
                          </th>
                          <th className="p-3 border-r border-slate-100 w-20 text-center">
                            移动{" "}
                            <HelpCircle
                              size={12}
                              className="inline text-slate-400 ml-1"
                            />
                          </th>
                          <th className="p-3 border-r border-slate-100 w-36">
                            <span className="text-blue-600 mr-1">*</span>付款方
                          </th>
                          <th className="p-3 border-r border-slate-100 w-32">
                            <span className="text-blue-600 mr-1">*</span>费用项
                          </th>
                          <th className="p-3 border-r border-slate-100 w-28">
                            计量单位
                          </th>
                          <th className="p-3 border-r border-slate-100 w-28">
                            单价
                          </th>
                          <th className="p-3 border-r border-slate-100 w-28">
                            数量
                          </th>
                          <th className="p-3 border-r border-slate-100 w-48">
                            <span className="text-blue-600 mr-1">*</span>
                            费项金额
                          </th>
                          <th className="p-3 border-r border-slate-100 w-32">
                            折算汇率{" "}
                            <HelpCircle
                              size={12}
                              className="inline text-slate-400 ml-1"
                            />
                          </th>
                          <th className="p-3 border-r border-slate-100 w-52 border-b-2 border-b-yellow-400 font-black text-slate-700 bg-yellow-50/30">
                            折算金额
                          </th>
                          <th className="p-3 border-r border-slate-100 w-32">
                            代付收款方
                          </th>
                          <th className="p-3 border-r border-slate-100 w-40">
                            业务发生日期
                          </th>
                          <th className="p-3 border-r border-slate-100 w-32">
                            费项备注
                          </th>
                          <th className="p-3 sticky right-0 bg-[#F8FAFC] border-l border-slate-200 shadow-[-2px_0_4px_rgba(0,0,0,0.03)] z-10 w-[72px] text-center">费项附件</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                        {receivableFees.map((item) => {
                          const rowConvertedValue = getReceivableRowConverted(item);
                          const isHighlighted = highlightedReceivableId === item.id;
                          return (
                            <tr
                              key={item.id}
                              id={`receivable-row-${item.id}`}
                              className={`transition-all duration-500 group ${
                                isHighlighted 
                                  ? "bg-yellow-50/80 ring-2 ring-yellow-400 font-semibold scale-[1.002] shadow-sm relative z-20" 
                                  : "hover:bg-blue-50/30 bg-white"
                              }`}
                            >
                              <td className="p-3 text-center border-r border-slate-100">
                                <input
                                  type="checkbox"
                                  className="rounded border-slate-300 accent-blue-600 cursor-pointer"
                                />
                              </td>
                              <td className="p-3 text-center text-slate-300 border-r border-slate-100">
                                <GripVertical
                                  size={16}
                                  className="mx-auto cursor-grab hover:text-slate-500"
                                />
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[120px]">
                                <div className="flex items-center justify-between border border-slate-200 rounded px-2 py-1.5 cursor-pointer bg-white">
                                  {renderParty(item.payer)}
                                  <ChevronDown size={14} className="text-slate-400" />
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100 hover:relative hover:z-50 min-w-[120px]">
                                {item.name === "尾款" ? (
                                  <div className="flex items-center justify-between border border-slate-200 bg-slate-50/50 rounded px-2 py-1.5 cursor-pointer">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-semibold text-slate-900">
                                        {item.name}
                                      </span>
                                      {item.badge && (
                                        <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    <ChevronDown
                                      size={14}
                                      className="text-slate-400"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between border border-slate-200 bg-white rounded px-2 py-1.5 cursor-pointer">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-semibold text-slate-900">
                                        {item.name}
                                      </span>
                                      {item.badge && (
                                        item.badge === "返利" ? (
                                          <span
                                            onMouseEnter={(e) => handleRebateMouseEnter(e, "receivable")}
                                            onMouseLeave={handleRebateMouseLeave}
                                            className="bg-rose-50 border border-rose-200 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-extrabold shrink-0 cursor-help select-none hover:bg-rose-100 hover:border-rose-300 transition-colors"
                                          >
                                            {item.badge}
                                          </span>
                                        ) : (
                                          <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-black shrink-0">
                                            {item.badge}
                                          </span>
                                        )
                                      )}
                                    </div>
                                    <ChevronDown
                                      size={14}
                                      className="text-slate-400"
                                    />
                                  </div>
                                )}
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[100px]">
                                <div className="flex items-center justify-between text-slate-700 bg-white border border-slate-200 rounded px-2 py-1.5 cursor-pointer">
                                  <input
                                    type="text"
                                    value={item.unit}
                                    onChange={(e) =>
                                      updateReceivableFee(
                                        item.id,
                                        "unit",
                                        e.target.value
                                      )
                                    }
                                    placeholder="请选择"
                                    className="w-full bg-transparent text-slate-700 font-semibold outline-none border-0 p-0 ring-0 focus:ring-0 placeholder:font-normal"
                                  />
                                  <ChevronDown
                                    size={14}
                                    className="text-slate-400 ml-1 shrink-0"
                                  />
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100">
                                <input
                                  type="text"
                                  value={item.price}
                                  onChange={(e) =>
                                    updateReceivableFee(
                                      item.id,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  placeholder="请输入"
                                  className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded outline-none font-mono text-slate-800 placeholder:font-sans placeholder:font-normal"
                                />
                              </td>
                              <td className="p-3 border-r border-slate-100">
                                <input
                                  type="text"
                                  value={item.qty}
                                  onChange={(e) =>
                                    updateReceivableFee(
                                      item.id,
                                      "qty",
                                      e.target.value
                                    )
                                  }
                                  placeholder="请输入"
                                  className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded outline-none font-mono text-slate-800 placeholder:font-sans placeholder:font-normal"
                                />
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[140px] hover:relative hover:z-50 text-right">
                                {item.badge === "返利" ? (
                                  <div className="flex items-center justify-end gap-1.5 pb-1 select-none">
                                    <span className={`text-xs font-mono tracking-wide ${isOffsetCancelled ? "text-slate-800 font-bold" : "text-rose-600 font-extrabold"}`}>
                                      {getReceivableRowAmount(item).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <div className="flex items-center text-slate-400 hover:text-slate-600 relative pr-3 shrink-0 scale-90">
                                      <select
                                        value={item.currency}
                                        onChange={(e) =>
                                          updateReceivableFee(
                                            item.id,
                                            "currency",
                                            e.target.value
                                          )
                                        }
                                        className="outline-none text-[11px] font-bold font-mono bg-transparent cursor-pointer appearance-none pr-1 border-0 focus:ring-0 p-0 m-0"
                                      >
                                        <option value="CNY">CNY</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="HKD">HKD</option>
                                      </select>
                                      <ChevronDown
                                        size={10}
                                        className="absolute right-0 pointer-events-none"
                                      />
                                    </div>
                                    {isOffsetCancelled ? (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setIsOffsetCancelled(false);
                                        }}
                                        className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 font-extrabold text-[10px] transition-all cursor-pointer border border-blue-200"
                                      >
                                        立即冲减
                                      </button>
                                    ) : (
                                      <span
                                        onMouseEnter={(e) => handleRebateMouseEnter(e, "receivable_deduction", item)}
                                        onMouseLeave={handleRebateMouseLeave}
                                        className="group/offsetBadge inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-100/70 text-rose-600 text-[10px] font-black shrink-0 cursor-help select-none hover:bg-rose-100 hover:border-rose-200 transition-all scale-95 relative overflow-hidden"
                                      >
                                        <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse group-hover/offsetBadge:hidden" />
                                        已冲减
                                        <span
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setShowConfirmVoidModal(true);
                                          }}
                                          className="text-rose-400 hover:text-rose-800 font-black text-[11px] px-0.5 hidden group-hover/offsetBadge:flex select-none cursor-pointer rounded-full transition-colors items-center justify-center leading-none"
                                          title="作废冲减"
                                        >
                                          ✕
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center bg-white border border-slate-200 rounded group focus-within:border-blue-500 transition-colors h-[34px]">
                                    <input
                                      type="text"
                                      value={item.amount}
                                      onChange={(e) => {
                                        updateReceivableFee(
                                          item.id,
                                          "amount",
                                          e.target.value
                                        )
                                      }}
                                      className="w-full font-mono font-medium outline-none px-2 bg-transparent border-0 text-left focus:ring-0 text-slate-900 h-full"
                                    />
                                    <div className="flex items-center h-full bg-slate-50 text-slate-500 border-l border-slate-200 px-2 cursor-pointer hover:bg-slate-100 relative shrink-0">
                                      <select
                                        value={item.currency}
                                        onChange={(e) =>
                                          updateReceivableFee(
                                            item.id,
                                            "currency",
                                            e.target.value
                                          )
                                        }
                                        className="outline-none text-xs font-semibold text-slate-600 bg-transparent cursor-pointer appearance-none pr-3 border-0 focus:ring-0 h-full w-full absolute inset-0 opacity-0"
                                      >
                                        <option value="CNY">CNY</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="HKD">HKD</option>
                                      </select>
                                      <span className="text-xs font-semibold text-slate-600 mr-1 select-none pointer-events-none">{item.currency}</span>
                                      <ChevronDown
                                        size={12}
                                        className="text-slate-400 pointer-events-none"
                                      />
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[90px]">
                                <div className="flex items-center bg-white border border-slate-200 focus-within:border-blue-400 rounded h-[34px]">
                                  <div className="px-2 text-green-500 font-bold border-r border-slate-100 flex items-center justify-center shrink-0">
                                    <X size={10} />
                                  </div>
                                  <input
                                    type="text"
                                    value={item.rate}
                                    onChange={(e) =>
                                      updateReceivableFee(
                                        item.id,
                                        "rate",
                                        e.target.value
                                      )
                                    }
                                    className="w-full bg-transparent px-2 text-slate-900 font-mono outline-none text-left border-none focus:ring-0 font-medium h-full"
                                  />
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[160px]">
                                {item.badge === "返利" ? (
                                  <div className="flex items-center justify-between pl-2 transition-colors w-full select-none h-full relative border border-transparent hover:border-slate-200 rounded">
                                    <span className="font-mono font-bold text-slate-800">
                                      {getReceivableRowConverted(item).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <div className="flex items-center h-[34px] hover:bg-slate-100 rounded cursor-pointer relative px-2 shrink-0">
                                      <select
                                        value={item.convertedCurrency || "CNY"}
                                        onChange={(e) =>
                                          updateReceivableFee(
                                            item.id,
                                            "convertedCurrency",
                                            e.target.value
                                          )
                                        }
                                        className="outline-none text-[10px] font-black text-slate-900 bg-transparent cursor-pointer appearance-none border-0 focus:ring-0 py-0.5 uppercase h-full w-full absolute inset-0 opacity-0"
                                      >
                                        <option value="CNY">CNY</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="HKD">HKD</option>
                                      </select>
                                      <span className="text-[10px] font-black text-slate-950 uppercase pr-1 pointer-events-none">
                                        {item.convertedCurrency || "CNY"}
                                      </span>
                                      <ChevronDown size={10} className="text-slate-400 pointer-events-none" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center bg-white border border-slate-200 focus-within:border-blue-400 rounded transition-colors w-full h-[34px]">
                                    <input
                                      type="text"
                                      value={item.convertedAmount}
                                      onChange={(e) =>
                                        updateReceivableFee(
                                          item.id,
                                          "convertedAmount",
                                          e.target.value
                                        )
                                      }
                                      className="w-full font-mono px-2 font-medium text-slate-900 outline-none bg-transparent border-none text-left focus:ring-0 h-full"
                                    />
                                    <div className="flex items-center h-full bg-slate-50 text-slate-500 border-l border-slate-200 px-2 cursor-pointer hover:bg-slate-100 relative shrink-0 font-bold">
                                      <select
                                        value={item.convertedCurrency}
                                        onChange={(e) =>
                                          updateReceivableFee(
                                            item.id,
                                            "convertedCurrency",
                                            e.target.value
                                          )
                                        }
                                        className="outline-none text-[10px] font-black text-slate-900 bg-transparent cursor-pointer appearance-none pr-3 border-0 focus:ring-0 py-0.5 uppercase h-full w-full absolute inset-0 opacity-0"
                                      >
                                        <option value="CNY">CNY</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="HKD">HKD</option>
                                      </select>
                                      <span className="uppercase text-xs font-semibold text-slate-900 mr-1 select-none pointer-events-none">{item.convertedCurrency || "USD"}</span>
                                      <ChevronDown
                                        size={12}
                                        className="text-slate-400 pointer-events-none"
                                      />
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[130px]">
                                <div className="flex items-center justify-between text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus-within:border-blue-400">
                                  {item.badge === "代付货款" ? (
                                    <>
                                      <input type="text" placeholder="请输入" className="w-full bg-transparent text-slate-600 outline-none border-none p-0 text-xs focus:ring-0 placeholder:font-normal" />
                                      <span className="text-blue-500 hover:text-blue-600 cursor-pointer font-bold ml-1 shrink-0">选择</span>
                                    </>
                                  ) : (
                                    <span className="text-slate-400 font-normal">--</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[130px]">
                                <div className="flex items-center justify-between bg-white border border-slate-200 text-slate-700 rounded px-2 py-1.5 cursor-pointer">
                                  <input
                                    type="text"
                                    value={item.date}
                                    readOnly
                                    className="w-full bg-transparent text-slate-600 outline-none border-none p-0 text-xs focus:ring-0 cursor-pointer text-left"
                                  />
                                  <Calendar size={14} className="text-slate-400 ml-1 shrink-0" />
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[120px]">
                                <input
                                  type="text"
                                  value={item.remark}
                                  onChange={(e) =>
                                    updateReceivableFee(
                                      item.id,
                                      "remark",
                                      e.target.value
                                    )
                                  }
                                  placeholder="请输入"
                                  className="w-full px-2 py-1.5 border border-slate-200 bg-white focus:border-blue-400 rounded outline-none text-slate-700 placeholder:font-normal placeholder-slate-300 text-left"
                                />
                              </td>
                              <td className={`p-3 text-center sticky right-0 border-l border-slate-100 shadow-[-2px_0_4px_rgba(0,0,0,0.03)] z-10 ${isHighlighted ? "bg-[#FFFCEB]" : "bg-white group-hover:bg-[#FAFCFF]"} transition-colors duration-200`}>
                                <span className="text-blue-500 hover:text-blue-600 text-xs cursor-pointer select-none">上传</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-[#fff9e6] text-slate-800 font-bold">
                        <tr>
                          <td
                            colSpan="7"
                            className="p-4 text-left border-t border-[#ffeb99]"
                          >
                            合计
                          </td>
                          <td className="p-4 font-mono border-t border-[#ffeb99] text-[13px] text-right">
                            {calculateTotalReceivableAmount().toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}{" "}
                            CNY
                          </td>
                          <td className="p-4 border-t border-[#ffeb99]"></td>
                          <td
                            className="p-4 font-mono border-t border-[#ffeb99] text-[14px]"
                            colSpan="4"
                          >
                            <div className="flex items-center space-x-2">
                              <span>
                                {calculateTotalReceivableConverted().toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </span>
                              <span className="text-blue-700 text-xs font-black uppercase">
                                {getReceivableConvertedCurrencyLabel()}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 border-t border-[#ffeb99] sticky right-0 bg-[#fff9e6] shadow-[-2px_0_4px_rgba(0,0,0,0.03)] z-10 border-l border-[#ffe47a]"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Accounts Payable */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm relative z-10 hover:z-20 transition-all">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-3.5 bg-blue-600 rounded"></div>
                      <span className="font-bold text-slate-800 text-sm">
                        应付费用
                      </span>
                      <ChevronDown size={16} className="text-slate-400" />
                    </div>
                  </div>

                  <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-y-3 bg-white">
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium text-xs shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition">
                        新增
                      </button>
                      <button className="border border-slate-200 bg-white text-slate-700 px-4 py-1.5 rounded-md font-medium text-xs shadow-sm hover:bg-slate-50 flex items-center transition">
                        新增代付款{" "}
                        <HelpCircle
                          size={14}
                          className="text-slate-400 ml-1.5"
                        />
                      </button>
                      {[
                        "重置",
                        "复制",
                        "删除",
                        "同步添加应收",
                        "批量更新汇率",
                      ].map((btn) => (
                        <button
                          key={btn}
                          className="border border-slate-200 bg-slate-50 text-slate-400 px-4 py-1.5 rounded-md font-medium text-xs cursor-not-allowed hidden lg:block"
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1.5 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50 shadow-sm transition">
                        <LayoutGrid size={16} />
                      </button>
                      <button className="p-1.5 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50 shadow-sm transition">
                        <Settings size={16} />
                      </button>
                      <button className="p-1.5 border border-slate-200 rounded bg-white text-slate-500 hover:bg-slate-50 shadow-sm transition">
                        <Expand size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Payable Table */}
                  <div className="overflow-visible rounded-b-xl relative z-10">
                    <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                      <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 text-center border-r border-slate-100 w-10">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 accent-blue-600 cursor-pointer"
                            />
                          </th>
                          <th className="p-3 border-r border-slate-100 w-20 text-center">
                            移动{" "}
                            <HelpCircle
                              size={12}
                              className="inline text-slate-400 ml-1"
                            />
                          </th>
                          <th className="p-3 border-r border-slate-100 w-36">
                            <span className="text-blue-600 mr-1">*</span>收款方
                          </th>
                          <th className="p-3 border-r border-slate-100 w-32">
                            <span className="text-blue-600 mr-1">*</span>费用项
                          </th>
                          <th className="p-3 border-r border-slate-100 w-28">
                            计量单位
                          </th>
                          <th className="p-3 border-r border-slate-100 w-28">
                            单价
                          </th>
                          <th className="p-3 border-r border-slate-100 w-28">
                            数量
                          </th>
                          <th className="p-3 border-r border-slate-100 w-48">
                            <span className="text-blue-600 mr-1">*</span>
                            费项金额
                          </th>
                          <th className="p-3 border-r border-slate-100 w-32">
                            折算汇率{" "}
                            <HelpCircle
                              size={12}
                              className="inline text-slate-400 ml-1"
                            />
                          </th>
                          <th className="p-3 border-r border-slate-100 w-52 border-b-2 border-b-yellow-400 font-black text-slate-700 bg-yellow-50/30">
                            折算金额
                          </th>
                          <th className="p-3 border-r border-slate-100 w-32">
                            代付委托方
                          </th>
                          <th className="p-3 border-r border-slate-100 w-40">
                            业务发生日期
                          </th>
                          <th className="p-3 border-r border-slate-100 w-32">
                            费项备注
                          </th>
                          <th className="p-3 sticky right-0 bg-[#F8FAFC] border-l border-slate-200 shadow-[-2px_0_4px_rgba(0,0,0,0.03)] z-10 w-[72px] text-center">费项附件</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                        {payableFees.map((item) => {
                          const rowValue = getPayableRowAmount(item);
                          const rowConvertedValue = getPayableRowConverted(item);
                          const isTargetRebateOffsetEligible =
                            item.payee === "奥特莱斯贸易有限公司" &&
                            item.name === "尾款" &&
                            item.badge === "代付货款" &&
                            (getFinalRebateAmount() > 0 || receivableFees.some(rf => rf.payer === "奥特莱斯贸易有限公司" && rf.badge !== "返利" && (parseFloat(rf.amount) || 0) > 0));

                          const p = parseFloat(item.price);
                          const q = parseFloat(item.qty);
                          let baseAmt = 0;
                          if (!isNaN(p) && !isNaN(q)) {
                            baseAmt = p * q;
                          } else {
                            baseAmt = parseFloat(item.amount) || 0;
                          }

                          const isHighlighted = highlightedPayableId === item.id;

                          return (
                            <tr
                              key={item.id}
                              id={`payable-row-${item.id}`}
                              className={`transition-all duration-500 group ${
                                isHighlighted 
                                  ? "bg-yellow-50/80 ring-2 ring-yellow-400 font-semibold scale-[1.002] shadow-sm relative z-20" 
                                  : "hover:bg-blue-50/30 bg-white"
                              }`}
                            >
                              <td className="p-3 text-center border-r border-slate-100">
                                <input
                                  type="checkbox"
                                  className="rounded border-slate-300 accent-blue-600 cursor-pointer"
                                />
                              </td>
                              <td className="p-3 text-center text-slate-300 border-r border-slate-100">
                                <GripVertical
                                  size={16}
                                  className="mx-auto cursor-grab hover:text-slate-500"
                                />
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[120px]">
                                <div className="flex items-center justify-between border border-slate-200 rounded px-2 py-1.5 cursor-pointer bg-white">
                                  {renderParty(item.payee)}
                                  <ChevronDown size={14} className="text-slate-400" />
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100 hover:relative hover:z-50 min-w-[120px]">
                                <div className="flex items-center justify-between border border-slate-200 rounded px-2 py-1.5 cursor-pointer hover:bg-slate-50 transition bg-white">
                                  <span className="font-semibold text-slate-900">
                                    {item.name}
                                  </span>
                                  {item.badge && (
                                    <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[100px]">
                                <div className="flex items-center justify-between text-slate-700 bg-white border border-slate-200 rounded px-2 py-1.5 cursor-pointer">
                                  <input
                                    type="text"
                                    value={item.unit}
                                    onChange={(e) =>
                                      updatePayableFee(
                                        item.id,
                                        "unit",
                                        e.target.value
                                      )
                                    }
                                    placeholder="请选择"
                                    className="w-full bg-transparent text-slate-700 font-semibold outline-none border-0 p-0 ring-0 focus:ring-0 placeholder:font-normal"
                                  />
                                  <ChevronDown
                                    size={14}
                                    className="text-slate-400 ml-1 shrink-0"
                                  />
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100">
                                <input
                                  type="text"
                                  value={item.price}
                                  onChange={(e) =>
                                    updatePayableFee(
                                      item.id,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  placeholder="请输入"
                                  className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded outline-none font-mono text-slate-800 placeholder:font-sans placeholder:font-normal"
                                />
                              </td>
                              <td className="p-3 border-r border-slate-100">
                                <input
                                  type="text"
                                  value={item.qty}
                                  onChange={(e) =>
                                    updatePayableFee(
                                      item.id,
                                      "qty",
                                      e.target.value
                                    )
                                  }
                                  placeholder="请输入"
                                  className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded outline-none font-mono text-slate-800 placeholder:font-sans placeholder:font-normal"
                                />
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[140px] hover:relative hover:z-50 text-right">
                                {isTargetRebateOffsetEligible ? (
                                  <div className="flex items-center justify-end gap-1.5 pb-1 select-none">
                                    <span className={`text-xs font-mono tracking-wide ${isOffsetCancelled ? "text-slate-800 font-bold" : "text-rose-600 font-extrabold"}`}>
                                      {item.amount}
                                    </span>
                                    <span className="text-xs font-bold text-slate-800 tracking-wide uppercase mr-1">
                                      {item.currency}
                                    </span>
                                    {!isOffsetCancelled && (
                                      <div
                                        onMouseEnter={(e) => handleRebateMouseEnter(e, "payable", item)}
                                        onMouseLeave={handleRebateMouseLeave}
                                        className="group/offsetBadge inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-100/70 text-rose-600 text-[10px] font-black shrink-0 cursor-help select-none hover:bg-rose-100 hover:border-rose-200 transition-all scale-95 relative overflow-hidden"
                                      >
                                        <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse group-hover/offsetBadge:hidden" />
                                        已冲减
                                        <span
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setShowConfirmVoidModal(true);
                                          }}
                                          className="hidden group-hover/offsetBadge:inline-flex items-center justify-center w-3 h-3 -mr-0.5 bg-rose-200/50 hover:bg-rose-200 text-rose-600 rounded-full transition-colors font-sans leading-none text-[8px]"
                                          title="作废冲减"
                                        >
                                          ×
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center bg-white border border-slate-200 rounded group focus-within:border-blue-500 transition-colors h-[34px]">
                                    <input
                                      type="text"
                                      value={rowValue.toFixed(2)}
                                      onChange={(e) => {
                                        updatePayableFee(
                                          item.id,
                                          "amount",
                                          e.target.value
                                        )
                                      }}
                                      className="w-full font-mono font-medium outline-none px-2 bg-transparent border-0 text-left focus:ring-0 text-slate-900 h-full"
                                    />
                                    <div className="flex items-center h-full bg-slate-50 text-slate-500 border-l border-slate-200 px-2 cursor-pointer hover:bg-slate-100 relative shrink-0">
                                      <select
                                        value={item.currency}
                                        onChange={(e) =>
                                          updatePayableFee(
                                            item.id,
                                            "currency",
                                            e.target.value
                                          )
                                        }
                                        className="outline-none text-xs font-semibold text-slate-600 bg-transparent cursor-pointer appearance-none pr-3 border-0 focus:ring-0 h-full w-full absolute inset-0 opacity-0"
                                      >
                                        <option value="CNY">CNY</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="HKD">HKD</option>
                                      </select>
                                      <span className="text-xs font-semibold text-slate-600 mr-1 select-none pointer-events-none">{item.currency}</span>
                                      <ChevronDown
                                        size={12}
                                        className="text-slate-400 pointer-events-none"
                                      />
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[90px]">
                                <div className="flex items-center bg-white border border-slate-200 focus-within:border-blue-400 rounded h-[34px]">
                                  <div className="px-2 text-rose-500 font-bold border-r border-slate-100 flex items-center justify-center shrink-0">
                                    <span className="text-sm">÷</span>
                                  </div>
                                  <input
                                    type="text"
                                    value={item.rate}
                                    onChange={(e) =>
                                      updatePayableFee(
                                        item.id,
                                        "rate",
                                        e.target.value
                                      )
                                    }
                                    className="w-full bg-transparent px-2 text-slate-900 font-mono outline-none text-left border-none focus:ring-0 font-medium h-full"
                                  />
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[160px] bg-yellow-50/20">
                                <div className="flex items-center bg-white border border-slate-200 focus-within:border-blue-400 rounded transition-colors w-full h-[34px]">
                                  <input
                                    type="text"
                                    value={rowConvertedValue.toFixed(2)}
                                    readOnly
                                    className="w-full font-mono px-2 font-medium text-slate-900 outline-none bg-transparent border-none text-left focus:ring-0 h-full"
                                  />
                                  <div className="flex items-center h-full bg-slate-50 text-slate-500 border-l border-slate-200 px-2 cursor-pointer hover:bg-slate-100 relative shrink-0 font-bold">
                                    <select
                                      value={item.convertedCurrency || "CNY"}
                                      onChange={(e) =>
                                        updatePayableFee(
                                          item.id,
                                          "convertedCurrency",
                                          e.target.value
                                        )
                                      }
                                      className="outline-none text-[10px] font-black text-slate-900 bg-transparent cursor-pointer appearance-none border-0 focus:ring-0 py-0.5 uppercase h-full w-full absolute inset-0 opacity-0"
                                    >
                                      <option value="CNY">CNY</option>
                                      <option value="USD">USD</option>
                                      <option value="EUR">EUR</option>
                                      <option value="HKD">HKD</option>
                                    </select>
                                    <span className="uppercase text-xs font-semibold text-slate-900 select-none pointer-events-none pr-1">{item.convertedCurrency || "CNY"}</span>
                                    <ChevronDown
                                      size={12}
                                      className="text-slate-400 pointer-events-none"
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[130px]">
                                <div className="flex items-center justify-between text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus-within:border-blue-400">
                                  {item.badge === "代付其他" ? (
                                    <>
                                      <input type="text" placeholder="请输入" className="w-full bg-transparent text-slate-600 outline-none border-none p-0 text-xs focus:ring-0 placeholder:font-normal" />
                                      <span className="text-blue-500 hover:text-blue-600 cursor-pointer font-bold ml-1 shrink-0">选择</span>
                                    </>
                                  ) : (
                                    <span className="text-slate-400 font-normal">--</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[130px]">
                                <div className="flex items-center justify-between bg-white border border-slate-200 text-slate-700 rounded px-2 py-1.5 cursor-pointer">
                                  <input
                                    type="text"
                                    value={item.date}
                                    readOnly
                                    className="w-full bg-transparent text-slate-600 outline-none border-none p-0 text-xs focus:ring-0 cursor-pointer text-left"
                                  />
                                  <Calendar size={14} className="text-slate-400 ml-1 shrink-0" />
                                </div>
                              </td>
                              <td className="p-3 border-r border-slate-100 min-w-[120px]">
                                <input
                                  type="text"
                                  placeholder="请输入"
                                  className="w-full px-2 py-1.5 border border-slate-200 bg-white focus:border-blue-400 rounded outline-none text-slate-700 placeholder:font-normal placeholder-slate-300 text-left"
                                />
                              </td>
                              <td className={`p-3 text-center sticky right-0 border-l border-slate-100 shadow-[-2px_0_4px_rgba(0,0,0,0.03)] z-10 ${isHighlighted ? "bg-[#FFFCEB]" : "bg-white group-hover:bg-[#FAFCFF]"} transition-colors duration-200`}>
                                <span className="text-blue-500 hover:text-blue-600 text-xs cursor-pointer select-none">上传</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-[#fff9e6] text-slate-800 font-bold">
                        <tr>
                          <td
                            colSpan="7"
                            className="p-4 text-left border-t border-[#ffeb99]"
                          >
                            合计
                          </td>
                          <td className="p-4 font-mono border-t border-[#ffeb99] text-[13px] text-right">
                            {calculateTotalPayableAmount().toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}{" "}
                            CNY
                          </td>
                          <td className="p-4 border-t border-[#ffeb99]"></td>
                          <td
                            className="p-4 font-mono border-t border-[#ffeb99] text-[13px]"
                            colSpan="3"
                          >
                            <div className="flex items-center space-x-2">
                              <span>
                                {calculateTotalPayableConverted().toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </span>
                              <span className="text-blue-700 text-xs font-black uppercase">
                                {getPayableConvertedCurrencyLabel()}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 border-t border-[#ffeb99] sticky right-0 bg-[#fff9e6] shadow-[-2px_0_4px_rgba(0,0,0,0.03)] z-10 border-l border-[#ffe47a]"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Fixed Footer */}
            <div className="bg-white border-t border-slate-200 px-8 py-5 flex justify-between items-center shrink-0 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.05)] absolute bottom-0 right-0 w-full lg:w-[calc(100%-376px)] z-30">
              <div className="ml-auto flex space-x-4">
                <button className="border border-slate-200 text-slate-700 px-8 py-2.5 rounded-md font-bold hover:bg-slate-50 transition-colors shadow-sm">
                  取消
                </button>
                <button className="bg-blue-50 text-blue-700 border border-blue-200 px-8 py-2.5 rounded-md font-bold hover:bg-blue-100 transition-colors shadow-sm">
                  保存草稿
                </button>
                <button className="bg-blue-600 flex items-center justify-center text-white px-10 py-2.5 rounded-md font-bold hover:bg-blue-700 shadow-sm transition-colors relative">
                  提交
                </button>
              </div>
            </div>

            {/* Confirm Void Offset Modal */}
            {showConfirmVoidModal && (
              <div id="confirm-void-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[10000] animate-in fade-in duration-200 pointer-events-auto">
                <div className="w-[420px] bg-white rounded-xl shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center space-x-3 mb-4 text-red-600 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                      <Trash2 size={20} className="text-red-500" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">作废冲减确认</h3>
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                    确认要作废已冲减吗？作废后，冲减的费用将恢复到冲减前的原金额
                  </p>
                  
                  <div className="flex justify-end space-x-3 font-semibold">
                    <button
                      onClick={() => setShowConfirmVoidModal(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-650 font-bold rounded-lg hover:bg-slate-55 transition-colors text-xs cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => {
                        setIsOffsetCancelled(true);
                        setShowConfirmVoidModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-xs shadow-sm hover:shadow cursor-pointer"
                    >
                      确认作废
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Rebates Modal */}
            {showRebateModal && (
              <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center pointer-events-auto">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col mx-4 select-none">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-[15px]">
                      编辑采购返利
                    </h3>
                    <button
                      onClick={() => setShowRebateModal(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="p-6 bg-white space-y-4 max-h-[70vh] overflow-y-auto w-full">
                    
                    {/* Row 1: 商品返利 */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1 w-24 shrink-0">
                        <span className="text-slate-500 font-medium text-sm whitespace-nowrap">商品返利</span>
                        <div className="relative flex items-center group">
                          <HelpCircle
                            size={14}
                            className="text-slate-300 shrink-0 cursor-help"
                          />
                          {/* Beautiful floating hover popup */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 bg-slate-800 text-white text-[11px] rounded-lg py-2 px-3 shadow-xl z-[99999] pointer-events-none transition-all duration-150 leading-relaxed font-normal">
                            <div className="relative">
                              来源商品明细，商品返利=订货金额-供货金额
                              <span className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 transform -mt-1"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex border border-slate-200 rounded-md overflow-hidden bg-[#FAFAFA] flex-1 h-10 items-center justify-between px-3">
                        <span className="text-slate-400 italic font-mono font-bold text-sm tracking-wide ml-auto mr-1.5">
                          {getProductRebate().toFixed(2)}
                        </span>
                        <span className="text-slate-400 font-bold text-xs uppercase">CNY</span>
                      </div>
                    </div>

                    {/* Dynamic rows: 返点 and 现金折扣 */}
                    {rebates.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <span className="text-slate-500 font-medium text-sm whitespace-nowrap w-24 shrink-0">
                          {item.type}
                        </span>
                        
                        <div className="flex items-center gap-2 flex-1">
                          {/* Dropdown list for selecting calculation type */}
                          <div className="border border-slate-200 bg-white rounded-md flex items-center justify-between shadow-sm w-32 h-10 overflow-hidden px-3 relative shrink-0">
                            <select
                              className="w-full h-full outline-none text-slate-700 font-medium cursor-pointer appearance-none bg-transparent pr-4 text-sm"
                              value={item.amountType}
                              onChange={(e) =>
                                updateRebateAmountType(item.id, e.target.value)
                              }
                            >
                              <option value="按比例">按比例</option>
                              <option value="按金额">按金额</option>
                            </select>
                            <ChevronDown
                              size={14}
                              className="text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                            />
                          </div>

                          {/* Code input box */}
                          <div className="flex border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm flex-1 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all h-10 items-center">
                            <input
                              type="text"
                              value={item.amount}
                              onChange={(e) =>
                                updateRebateAmount(item.id, e.target.value)
                              }
                              className="w-full h-full px-3 text-slate-900 font-mono text-right outline-none text-sm"
                            />
                            <span className="px-3 bg-slate-50 border-l border-slate-200 text-slate-500 font-bold text-xs flex items-center h-full shrink-0 uppercase select-none">
                              {item.amountType === "按金额" ? "CNY" : "%"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* System Calculation preview card */}
                    <div className="bg-[#F8FAFF] border border-blue-50/50 rounded-lg p-4 flex flex-col items-center justify-center space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold select-none tracking-wider">系统计算预览</span>
                      <div className="flex items-baseline justify-center">
                        <span className="font-mono text-2xl font-extrabold text-slate-800">
                          {calculateTotalRebate().toFixed(2)}
                        </span>
                        <span className="text-xs text-blue-500 font-bold tracking-wider uppercase ml-1">
                          CNY
                        </span>
                      </div>
                    </div>

                    {/* Dashed divider */}
                    <div className="border-t border-dashed border-slate-200 my-4" />

                    {/* Manual Override Form */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-700">手动修正最终金额</h4>
                      
                      <div className="flex border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all h-11 items-center">
                        {/* Left ¥ block */}
                        <div className="px-4 bg-slate-50 border-r border-slate-155 h-full flex items-center justify-center shrink-0">
                          <span className="text-slate-400 font-mono font-medium text-base select-none">¥</span>
                        </div>
                        {/* Numerical input */}
                        <input
                          type="text"
                          placeholder="输入手动调整后的最终金额"
                          value={manualRebateOverride}
                          onChange={(e) => {
                            setManualRebateOverride(e.target.value);
                          }}
                          className="w-full h-full px-4 text-slate-800 font-mono text-left outline-none text-xs placeholder-slate-300 font-medium"
                        />
                        {/* Right CNY prefix */}
                        <span className="px-4 text-slate-300 font-bold text-[10px] uppercase select-none shrink-0">
                          CNY
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        * 手动输入的值将直接作为最终采购返利结果，且不能为负数。
                      </p>
                    </div>

                  </div>
                  
                  <div className="px-6 py-4 border-t border-slate-100 flex justify-end space-x-3 bg-white">
                    <button
                      onClick={() => setShowRebateModal(false)}
                      className="px-5 py-2 border border-slate-200 text-slate-600 font-bold rounded-md hover:bg-slate-50 transition-colors text-xs cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => setShowRebateModal(false)}
                      className="px-5 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors text-xs cursor-pointer shadow-sm hover:shadow"
                    >
                      确认并保存
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Global floating rebate info popover */}
            {hoveredRebateInfo && (
              <div
                style={{
                  position: "fixed",
                  left: `${hoveredRebateInfo.x}px`,
                  top: `${hoveredRebateInfo.y - 8}px`,
                  transform: "translate(-50%, -100%)",
                }}
                className="w-[325px] bg-white border border-slate-200 shadow-2xl rounded-xl p-4 z-[9999] text-left pointer-events-auto cursor-default text-slate-700 font-normal select-none normal-case tracking-normal leading-normal animate-in fade-in zoom-in-95 duration-150"
                onMouseEnter={() => {
                  if (rebateCloseTimeoutRef.current) {
                    clearTimeout(rebateCloseTimeoutRef.current);
                    rebateCloseTimeoutRef.current = null;
                  }
                }}
                onMouseLeave={handleRebateMouseLeave}
              >
                {/* Header (Only for 'receivable' type, since others have customized embedded headers matching mockup exactly) */}
                {hoveredRebateInfo.type === "receivable" && (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <span className="font-bold text-slate-800 text-sm">
                      返利明细
                    </span>
                  </div>
                )}
                
                {hoveredRebateInfo.type === "receivable_deduction" ? (
                  /* RECEIVABLE_DEDUCTION (冲减对象 hover - 展示 被冲减对象) POPUP CONTENT */
                  <div className="space-y-3.5 text-xs font-sans">
                    {/* 原费用 label */}
                    <div className="space-y-2">
                      <div className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">原费用:</div>
                      
                      {/* Original Expense Item with 收 badge */}
                      <div className="flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 p-2 rounded-lg border border-slate-100/50 transition-colors">
                        <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <span className="inline-flex items-center justify-center bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded border border-red-200 text-[10px] leading-none shrink-0">收</span>
                          <span className="truncate max-w-[150px]">采购返利</span>
                        </span>
                        <span className="font-mono text-slate-600 font-semibold text-xs">
                          {(() => {
                            const item = hoveredRebateInfo.item;
                            let originalVal = 0;
                            if (item) {
                              if (item.badge === "返利") {
                                originalVal = getFinalRebateAmount();
                              } else {
                                originalVal = parseFloat(item.amount) || 0;
                              }
                            }
                            return originalVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                          })()} CNY
                        </span>
                      </div>
                    </div>

                    {/* Divider row */}
                    <div className="border-t border-slate-100 my-2"></div>

                    {/* 已冲减 Section with ❓ */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700 font-bold flex items-center gap-1 text-[12px]">
                          <span className="text-[9px] text-slate-400 select-none">▼</span>
                          已冲减
                          <span 
                            title="当前费用，用于冲减其它费用的金额"
                            className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-slate-300 bg-slate-50 text-slate-500 text-[10px] font-bold cursor-help hover:bg-slate-100 transition-colors select-none"
                          >
                            ?
                          </span>
                          :
                        </span>
                        <span className={`font-bold font-mono text-xs ${isOffsetCancelled ? "text-slate-400 line-through" : "text-rose-600"}`}>
                          -{(() => {
                            const originalFeePayable = getPayableTailOriginalAmount();
                            const totalRebate = getFinalRebateAmount();
                            const item = hoveredRebateInfo.item;
                            let offsetVal = 0;
                            if (item) {
                              if (item.badge === "返利") {
                                offsetVal = Math.min(originalFeePayable, totalRebate);
                              } else {
                                offsetVal = Math.min(parseFloat(item.amount) || 0, Math.max(0, originalFeePayable - totalRebate));
                              }
                            }
                            return (isOffsetCancelled ? 0 : offsetVal).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                          })()} CNY
                        </span>
                      </div>

                      {/* Indented Payables */}
                      <div className="pl-3.5 border-l border-slate-100 ml-1.5 space-y-2">
                        {(() => {
                          const originalFeePayable = getPayableTailOriginalAmount();
                          const totalRebate = getFinalRebateAmount();
                          const item = hoveredRebateInfo.item;
                          let offsetVal = 0;
                          if (item) {
                            if (item.badge === "返利") {
                              offsetVal = Math.min(originalFeePayable, totalRebate);
                            } else {
                              offsetVal = Math.min(parseFloat(item.amount) || 0, Math.max(0, originalFeePayable - totalRebate));
                            }
                          }

                          if (offsetVal <= 0) return (
                            <div className="text-[11px] text-slate-400 font-sans italic pl-1">暂无冲减对象</div>
                          );

                          return (
                            <div className="flex justify-between items-center text-[11px] text-slate-600 font-medium select-none">
                              <span className={`flex items-center gap-1.5 ${isOffsetCancelled ? "line-through opacity-50" : ""}`}>
                                <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold px-1 py-0.5 rounded border border-emerald-200 text-[9px] leading-none shrink-0">付</span>
                                尾款 (AO260521-1)
                              </span>
                              <span className={`font-mono text-slate-600 font-semibold ${isOffsetCancelled ? "line-through opacity-50 text-slate-400" : ""}`}>
                                {offsetVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CNY
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Divider row */}
                    <div className="border-t border-slate-100 my-2"></div>

                    {/* 冲减后金额 */}
                    <div className="flex justify-between items-center bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-100/80 text-slate-700 font-bold mt-1.5">
                      <span className="font-bold text-slate-700">冲减后金额:</span>
                      <span className="font-mono text-xs font-black text-rose-600">
                        {(() => {
                          const payableTailItem = payableFees.find(pf => pf.payee === "奥特莱斯贸易有限公司" && pf.name === "尾款" && pf.badge === "代付货款");
                          const originalFeePayable = payableTailItem ? (parseFloat(payableTailItem.price) * parseFloat(payableTailItem.qty) || parseFloat(payableTailItem.amount) || 0) : 0;
                          const totalRebate = getFinalRebateAmount();
                          const item = hoveredRebateInfo.item;
                          let remaining = 0;
                          if (item) {
                            if (item.badge === "返利") {
                              remaining = isOffsetCancelled ? totalRebate : Math.max(0, totalRebate - originalFeePayable);
                            } else {
                              const otherAmt = parseFloat(item.amount) || 0;
                              remaining = isOffsetCancelled ? otherAmt : Math.max(0, otherAmt - Math.max(0, originalFeePayable - totalRebate));
                            }
                          }
                          return remaining.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        })()} CNY
                      </span>
                    </div>
                  </div>
                ) : hoveredRebateInfo.type === "receivable" ? (
                  /* RECEIVABLE (返利明细) POPUP CONTENT */
                  <div className="space-y-3.5 text-xs">
                    {/* Items Details (Weakened) */}
                    <div className="space-y-2 border border-slate-100 bg-slate-50/30 rounded-lg p-2.5">
                      <div className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mb-1 flex items-center gap-1.5 select-none">
                        <span>明细结算项</span>
                        <div className="h-[1px] bg-slate-100 flex-1"></div>
                      </div>

                      {/* 商品返利 */}
                      <div className="flex items-center justify-between text-[11px] select-none">
                        <span className="text-slate-400">商品返利</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-slate-400 bg-slate-100/60 px-1 py-0.5 rounded font-mono">
                            按明细
                          </span>
                          <span className="font-mono text-slate-500 font-medium text-right min-w-[65px]">
                            {getProductRebate().toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-slate-400 font-bold text-[9px] w-6 text-right">CNY</span>
                        </div>
                      </div>

                      {/* Dynamic rebates */}
                      {rebates.map((subItem) => {
                        const isRatio = subItem.amountType === "按比例";
                        const computedBase = orderItems.reduce((sum, item) => {
                          const q = parseFloat(item.quantity) || 0;
                          const sp = parseFloat(item.supplyPrice) || 0;
                          return sum + q * sp;
                        }, 0) || 4733.3333;
                        const cnyVal = isRatio 
                          ? ((parseFloat(subItem.amount) || 0) / 100) * computedBase 
                          : (parseFloat(subItem.amount) || 0);

                        return (
                          <div key={subItem.id} className="flex items-center justify-between text-[11px] select-none">
                            <span className="text-slate-400 truncate max-w-[80px]">{subItem.type}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] text-slate-400 bg-slate-100/60 px-1 py-0.5 rounded font-mono">
                                {isRatio ? `比例 ${subItem.amount}%` : subItem.amountType}
                              </span>
                              <span className="font-mono text-slate-500 font-medium text-right min-w-[65px]">
                                {cnyVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <span className="text-slate-400 font-bold text-[9px] w-6 text-right">CNY</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Manual override / adjustment block */}
                    {manualRebateOverride && manualRebateOverride.trim() !== "" && (
                      <div className="space-y-1.5 text-[11px] px-1 select-none">
                        <div className="flex justify-between items-center text-slate-400 font-medium pb-1 border-b border-dashed border-slate-100">
                          <span>计算中间量</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400">系统计算 (小计)</span>
                          <span className="font-mono text-slate-400 font-medium">
                            {calculateTotalRebate().toLocaleString("en-US", { minimumFractionDigits: 2 })} CNY
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">手工修正值</span>
                          <span className="font-mono text-slate-600 font-semibold bg-slate-100/80 px-1.5 py-0.5 rounded text-[10px]">
                            {(parseFloat(manualRebateOverride) || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} CNY
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 累计返利 highlighting (最终修改值) */}
                    {manualRebateOverride && manualRebateOverride.trim() !== "" ? (
                      <div className="mt-1 bg-slate-900 text-white rounded-lg p-2.5 flex justify-between items-center shadow-sm text-xs border border-slate-950">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          <span className="font-bold">累计返利:</span>
                        </div>
                        <span className="font-mono font-black text-sm tracking-wide text-amber-300">
                          {getFinalRebateAmount().toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          CNY
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 bg-slate-50/80 rounded-lg p-2.5 flex justify-between items-center text-slate-700 font-bold border border-slate-200/60 text-[11px]">
                        <span>累计返利:</span>
                        <span className="font-mono text-slate-900 font-extrabold text-xs">
                          {getFinalRebateAmount().toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          CNY
                        </span>
                      </div>
                    )}

                    <div className="border-t border-dashed border-slate-200 pt-2.5 mt-2.5 space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">已冲减:</span>
                        <span className="text-rose-600 font-bold font-mono">
                          {(() => {
                            const payableTailItem = payableFees.find(pf => pf.payee === "奥特莱斯贸易有限公司" && pf.name === "尾款" && pf.badge === "代付货款");
                            const originalFeePayable = payableTailItem ? (parseFloat(payableTailItem.price) * parseFloat(payableTailItem.qty) || parseFloat(payableTailItem.amount) || 0) : 0;
                            const totalRebate = getFinalRebateAmount();
                            return Math.min(originalFeePayable, totalRebate).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                          })()} CNY
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">剩余未冲减:</span>
                        <span className="text-slate-700 font-bold font-mono">
                          {(() => {
                            const payableTailItem = payableFees.find(pf => pf.payee === "奥特莱斯贸易有限公司" && pf.name === "尾款" && pf.badge === "代付货款");
                            const originalFeePayable = payableTailItem ? (parseFloat(payableTailItem.price) * parseFloat(payableTailItem.qty) || parseFloat(payableTailItem.amount) || 0) : 0;
                            const totalRebate = getFinalRebateAmount();
                            return Math.max(0, totalRebate - originalFeePayable).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                          })()} CNY
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* PAYABLE (被冲减对象 hover - 展示 用于冲减的应收明细) POPUP CONTENT */
                  <div className="space-y-3.5 text-xs font-sans">
                    {/* 原费用 label */}
                    <div className="space-y-2">
                      <div className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">原费用:</div>
                      
                      {/* Original Expense Item with 付 badge */}
                      <div className="flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 p-2 rounded-lg border border-slate-100/50 transition-colors">
                        <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded border border-emerald-200 text-[10px] leading-none shrink-0">付</span>
                          <span className="truncate max-w-[150px]">
                            {hoveredRebateInfo.item?.name || "尾款"}
                          </span>
                        </span>
                        <span className="font-mono text-slate-600 font-semibold text-xs">
                          {(() => {
                            const item = hoveredRebateInfo.item;
                            const p = parseFloat(item?.price || "0");
                            const q = parseFloat(item?.qty || "0");
                            let bFee = 0;
                            if (!isNaN(p) && !isNaN(q)) {
                              bFee = p * q;
                            } else {
                              bFee = parseFloat(item?.amount || "0") || 0;
                            }
                            return bFee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                          })()} CNY
                        </span>
                      </div>
                    </div>

                    {/* Divider row */}
                    <div className="border-t border-slate-100 my-2"></div>

                    {/* 被冲减 Section with ❓ */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700 font-bold flex items-center gap-1 text-[12px]">
                          <span className="text-[9px] text-slate-400 select-none">▼</span>
                          被冲减
                          <span 
                            title="当前费用，被其它费用冲减的金额"
                            className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-slate-300 bg-slate-50 text-slate-500 text-[10px] font-bold cursor-help hover:bg-slate-100 transition-colors select-none"
                          >
                            ?
                          </span>
                          :
                        </span>
                        <span className={`font-bold font-mono text-xs ${isOffsetCancelled ? "text-slate-400 line-through" : "text-rose-600"}`}>
                          -{(() => {
                            const item = hoveredRebateInfo.item;
                            const p = parseFloat(item?.price || "0");
                            const q = parseFloat(item?.qty || "0");
                            let bFee = 0;
                            if (!isNaN(p) && !isNaN(q)) {
                              bFee = p * q;
                            } else {
                              bFee = parseFloat(item?.amount || "0") || 0;
                            }
                            
                            const totalRebate = getFinalRebateAmount();
                            const otherOffset = receivableFees
                              .filter(rf => rf.payer === "奥特莱斯贸易有限公司" && rf.badge !== "返利")
                              .reduce((sum, rf) => sum + (parseFloat(rf.amount) || 0), 0);
                            
                            return (isOffsetCancelled ? 0 : Math.min(bFee, totalRebate + otherOffset)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                          })()} CNY
                        </span>
                      </div>

                      {/* Indented breakdown of what was used to offset this payable item */}
                      <div className="pl-3.5 border-l border-slate-100 ml-1.5 space-y-2.5 py-0.5">
                        
                        {/* 采购返利 (if it is verified and > 0) */}
                        {getFinalRebateAmount() > 0 && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600 select-none">
                              <span className={`flex items-center gap-1.5 ${isOffsetCancelled ? "line-through opacity-50" : ""}`}>
                                <span className="inline-flex items-center justify-center bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded border border-red-200 text-[9px] leading-none shrink-0">收</span>
                                采购返利 (AO260521-1)
                              </span>
                              <span className={`font-mono text-slate-600 font-semibold text-[11px] ${isOffsetCancelled ? "line-through opacity-50 text-slate-400" : ""}`}>
                                {getFinalRebateAmount().toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CNY
                              </span>
                            </div>
                          </div>
                        )}

                        {/* 其他垫付 (if there are other offset receivable fees) */}
                        {receivableFees
                          .filter(rf => rf.payer === "奥特莱斯贸易有限公司" && rf.badge !== "返利" && (parseFloat(rf.amount) || 0) > 0)
                          .map((rf) => (
                            <div key={rf.id} className={`flex justify-between items-center text-[11px] font-semibold text-slate-600 ${isOffsetCancelled ? "line-through opacity-50" : ""}`}>
                              <span className="flex items-center gap-1.5">
                                <span className="inline-flex items-center justify-center bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded border border-red-200 text-[9px] leading-none shrink-0">收</span>
                                {rf.name} (AO260521-1)
                              </span>
                              <span className="font-mono text-slate-600 font-semibold text-[11px]">
                                {(parseFloat(rf.amount) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CNY
                              </span>
                            </div>
                          ))}

                      </div>
                    </div>

                    {/* Divider row */}
                    <div className="border-t border-slate-100 my-2"></div>

                    {/* 冲减后金额 */}
                    <div className="flex justify-between items-center bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-100/80 text-slate-700 font-bold mt-1.5">
                      <span className="font-bold text-slate-700">冲减后金额:</span>
                      <span className="font-mono text-xs font-black text-rose-600">
                        {(() => {
                          const item = hoveredRebateInfo.item;
                          const p = parseFloat(item?.price || "0");
                          const q = parseFloat(item?.qty || "0");
                          let bFee = 0;
                          if (!isNaN(p) && !isNaN(q)) {
                            bFee = p * q;
                          } else {
                            bFee = parseFloat(item?.amount || "0") || 0;
                          }
                          
                          const totalRebate = getFinalRebateAmount();
                          const otherOffset = receivableFees
                            .filter(rf => rf.payer === "奥特莱斯贸易有限公司" && rf.badge !== "返利")
                            .reduce((sum, rf) => sum + (parseFloat(rf.amount) || 0), 0);
                          
                          const actualOffset = isOffsetCancelled ? 0 : (totalRebate + otherOffset);
                          return Math.max(0, bFee - actualOffset).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        })()} CNY
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Arrow */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-slate-200 rotate-45 transform -mt-[5px] shadow-sm"></span>
              </div>
            )}
            </div>
          )}
        </div>
        </div>
        )}
        
        {activeTab === '应收费用' && <ReceivableFeesView />}
      </div>
    </div>
  );
}
