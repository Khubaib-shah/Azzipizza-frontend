import {
  X,
  Clock,
  Trash2,
  Save,
  MapPin,
  Phone,
  UserCheck,
  ChevronUp,
  ChevronDown,
  Printer,
  Send,
  ShoppingBag,
  CreditCardIcon,
  Activity,
  Loader2,
} from "lucide-react";
import { Button } from "@shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Card, CardContent } from "@shared/components/ui/card";
import { pdf } from "@react-pdf/renderer";
import ReceiptDocument from "./ReceiptDocument";
import { getPaymentStatusColor } from "@shared/utils/getPaymentStatusColor";
import React from "react";
import { sendOrderUpdate } from "@shared/utils/sendOrderUpdate";
import { motion, AnimatePresence } from "framer-motion";

const statusOptions = [
  "Pending",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const OrderSideBar = React.memo(
  ({
    selectedOrder,
    etaMinutes,
    setEtaMinutes,
    setSelectedOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    handleStatusChange,
    state,
    dispatch,
  }) => {
    if (!selectedOrder) return null;

    const handlePrinterAnOrder = async () => {
      dispatch({ type: "SET_PUNCH_LOADING", payload: true });

      try {
        const blob = await pdf(
          <ReceiptDocument order={selectedOrder} />,
        ).toBlob();
        const blobUrl = URL.createObjectURL(blob);

        const manualWindow = window.open(blobUrl, "_blank");

        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "none";
        iframe.src = blobUrl;

        iframe.onload = () => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch (printError) {
            console.warn("Auto print failed, user can print manually.");
          }
        };

        document.body.appendChild(iframe);

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          document.body.removeChild(iframe);
          dispatch({ type: "SET_PUNCH_LOADING", payload: false });
        }, 3000);
      } catch (error) {
        console.error("Print error:", error);
        dispatch({ type: "SET_PUNCH_LOADING", payload: false });
      }
    };

    const getStatusStyles = (status) => {
      switch (status) {
        case "Delivered":
          return "bg-emerald-50 text-emerald-700 border-emerald-100";
        case "Cancelled":
          return "bg-red-50 text-red-700 border-red-100";
        case "Preparing":
          return "bg-amber-50 text-amber-700 border-amber-100";
        case "Out for Delivery":
          return "bg-blue-50 text-blue-700 border-blue-100";
        default:
          return "bg-slate-50 text-slate-700 border-slate-100";
      }
    };

    return (
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-900 xl:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-full sm:w-[500px] xl:w-96 h-screen bg-white shadow-2xl z-1000 flex flex-col border-l border-slate-100"
            >
              {/* Header */}
              <header className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-white sticky top-0 z-10 transition-opacity">
                <div className="flex flex-col">
                  <h2 className="!text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Order Details
                  </h2>
                  <h3 className="text-xl font-serif font-black text-slate-900">
                    #{selectedOrder._id.slice(-5).toUpperCase()}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => sendOrderUpdate(selectedOrder, "confirmed")}
                    className="h-9 w-9 rounded-lg border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 transition-all text-slate-400"
                    title="Notify Customer"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedOrder(null)}
                    className="h-9 w-9 rounded-lg hover:bg-slate-100 text-slate-400"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </header>

              {/* Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Summary */}
                <section className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                        <CreditCardIcon className="size-3" /> Method
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        {selectedOrder.paymentMethod?.toUpperCase()}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                        <Activity className="size-3" /> Status
                      </p>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}
                      >
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl text-white shadow-xl">
                    {(() => {
                      const subtotal = selectedOrder.items.reduce(
                        (sum, item) =>
                          sum +
                          (item.originalPrice || item.menuItem?.price || 0) *
                            item.quantity,
                        0,
                      );
                      const total = selectedOrder.totalPrice;
                      const discount = subtotal - total;

                      return (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center opacity-60">
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Subtotal
                            </span>
                            <span className="text-sm font-medium">
                              €{subtotal.toFixed(2)}
                            </span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between items-center text-emerald-400">
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                Discount
                              </span>
                              <span className="text-sm font-bold">
                                -€{discount.toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                              Total Amount
                            </span>
                            <span className="text-2xl sm:text-3xl font-serif font-black tracking-tighter">
                              €{total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </section>

                {/* Customer */}
                <section className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 ml-1">
                    Customer Profile
                  </h4>
                  <Card className="border-none bg-slate-50 rounded-2xl overflow-hidden">
                    <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="size-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                          <UserCheck className="size-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-slate-900">
                            {selectedOrder.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Bell: {selectedOrder.doorbellName || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="size-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                          <Phone className="size-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-slate-900">
                            {selectedOrder.phoneNumber || "N/A"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                            Contact
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="size-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                          <MapPin className="size-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-slate-900 leading-relaxed">
                            {selectedOrder.deliveryAddress.street},{" "}
                            {selectedOrder.deliveryAddress.city}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {selectedOrder.deliveryAddress.zipCode}
                          </p>
                        </div>
                      </div>

                      {selectedOrder.deliveryTime && (
                        <div className="flex items-center gap-4 bg-white/60 p-3 rounded-2xl border border-slate-100">
                          <Clock className="size-4 text-red-500" />
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">
                            Requested:{" "}
                            {typeof selectedOrder.deliveryTime === "string" &&
                            !selectedOrder.deliveryTime.includes("T")
                              ? selectedOrder.deliveryTime
                              : new Date(
                                  selectedOrder.deliveryTime,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </section>

                {/* Items */}
                <section className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 ml-1">
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden group"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex items-start gap-3">
                            <span className="size-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">
                              {item.quantity}
                            </span>
                            <div>
                              <p className="text-xs font-black text-slate-900">
                                {item.menuItem?.name}
                              </p>
                              {item.selectedIngredients?.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                  {item.selectedIngredients.map((ing, i) => (
                                    <li
                                      key={i}
                                      className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5"
                                    >
                                      <span className="size-1 bg-slate-200 rounded-full"></span>
                                      {ing.name}{" "}
                                      <span className="text-slate-300 italic">
                                        (+€{ing.price})
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                          <span className="text-xs font-black text-slate-900">
                            €
                            {(item?.price || item.menuItem?.price || 0).toFixed(
                              2,
                            )}
                          </span>
                        </div>
                        {item.customizations && (
                          <div className="mt-4 p-3 bg-red-50/30 rounded-xl border border-red-100/50">
                            <p className="text-[10px] font-medium text-red-700 italic">
                              " {item.customizations} "
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Operations */}
                <section className="space-y-6 pt-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Order Status
                    </label>
                    <Select
                      value={selectedOrder.orderStatus}
                      onValueChange={(v) =>
                        handleStatusChange(selectedOrder._id, v)
                      }
                    >
                      <SelectTrigger
                        className={`rounded-xl border-slate-100 font-bold h-12 px-6 ${getStatusStyles(selectedOrder.orderStatus)}`}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2 z-[1990] bg-slate-100">
                        {statusOptions.map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="font-bold cursor-pointer h-10 px-4"
                          >
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Estimated Arrival (ETA)
                    </label>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                      <Button
                        variant="white"
                        size="icon"
                        onClick={() => setEtaMinutes((p) => Math.max(0, p - 5))}
                        disabled={etaMinutes === 0}
                        className="size-10 rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-105 bg-white"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 text-center font-serif font-black italic">
                        <span className="text-2xl text-slate-900 mr-1">
                          {etaMinutes}
                        </span>
                        <span className="text-[10px] font-sans font-black uppercase tracking-widest text-slate-400">
                          min
                        </span>
                      </div>
                      <Button
                        variant="white"
                        size="icon"
                        onClick={() => setEtaMinutes((p) => p + 5)}
                        className="size-10 rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-105 bg-white"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </section>
              </div>

              {/* Actions */}
              <footer className="p-4 sm:p-5 border-t border-slate-100 space-y-2.5 sm:space-y-3 bg-white sticky bottom-0">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="w-full h-10 sm:h-11 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md border-none cursor-pointer"
                    onClick={handleUpdateOrder}
                    disabled={state.upLoading}
                  >
                    {state.upLoading ? (
                      <Loader2 className="animate-spin size-3.5 mr-1.5" />
                    ) : (
                      <Save className="size-3.5 mr-1.5" />
                    )}
                    Update <span className="hidden sm:inline">Order</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-10 sm:h-11 bg-white border border-solid border-slate-100 rounded-xl font-black text-xs uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                    onClick={handlePrinterAnOrder}
                    disabled={state.punchLoading}
                  >
                    {state.punchLoading ? (
                      <Loader2 className="animate-spin size-3.5 mr-1.5" />
                    ) : (
                      <Printer className="size-3.5 mr-1.5" />
                    )}
                    Print <span className="hidden sm:inline">Order</span>
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  className="w-full h-10 sm:h-11 bg-red-50 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest border border-solid border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-none group cursor-pointer"
                  onClick={() => handleDeleteOrder(selectedOrder._id)}
                  disabled={state.delLoading}
                >
                  <Trash2 className="size-3.5 mr-1.5" />
                  {state.delLoading ? "Deleting..." : "Delete Order"}
                </Button>
              </footer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  },
);

export default OrderSideBar;
