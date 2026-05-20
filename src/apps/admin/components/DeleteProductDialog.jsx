import React from "react";
import Modal from "@shared/components/ui/Modal";
import { Button } from "@shared/components/ui/button";

const DeleteProductDialog = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  itemToDelete,
  handleDelete,
  loading,
}) => {
  return (
    <Modal isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} className="max-w-md">
      <div className="p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Confirm Deletion</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Are you sure you want to delete <b>{itemToDelete?.name}</b>? This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100/50">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors shadow-xs"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="cursor-pointer px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2 border-none"
            onClick={() => handleDelete(itemToDelete?._id)}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              "Delete Item"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteProductDialog;
