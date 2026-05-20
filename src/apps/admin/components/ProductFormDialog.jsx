import React from "react";
import { Textarea } from "@shared/components/ui/textarea";
import { X, Upload, Pencil, Trash2, Plus, Save } from "lucide-react";
import { Button } from "@shared/components/ui/button";
import Modal from "@shared/components/ui/Modal";
import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";

const ProductFormDialog = ({
  editDialogOpen,
  setEditDialogOpen,
  itemToEdit,
  handleEditChange,
  handleEditSubmit,
  categories,
  newIngredient,
  setNewIngredient,
  newIngredientPrice,
  setNewIngredientPrice,
  handleAddIngredient,
  handleRemoveIngredient,
  handleFileChange,
  imagePreview,
  setImagePreview,
  loading,
  mode = "edit",
}) => {
  return (
    <Modal
      isOpen={editDialogOpen}
      onClose={() => setEditDialogOpen(false)}
      className="max-w-2xl overflow-hidden rounded-3xl"
    >
      <div className="flex flex-col max-h-[85vh] bg-white">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white px-6 py-5 border-b border-slate-100 z-10 flex items-center justify-between">
          <div className="pr-12">
            <h2 className="text-xl md:text-2xl font-serif font-black text-slate-900 leading-tight">
              {mode === "create" ? "Add Menu Item" : "Edit Menu Item"}
            </h2>
            <p className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">
              {mode === "create"
                ? "Add a new dish to your culinary selection"
                : "Update the details of your culinary masterpiece"}
            </p>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleEditSubmit}
          className="flex-1 overflow-y-auto px-6 md:px-8 py-1 space-y-6 scrollbar-thin"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Basic Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                  Item Name
                </label>
                <Input
                  placeholder="Item Name"
                  value={itemToEdit.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:ring-red-600/10 text-slate-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                  Description
                </label>
                <Textarea
                  placeholder="Description of the pizza..."
                  value={itemToEdit.description}
                  onChange={(e) =>
                    handleEditChange("description", e.target.value)
                  }
                  className="min-h-[100px] rounded-xl border-slate-100 bg-slate-50/50 focus-visible:ring-red-600/10 font-medium resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                    Price (€)
                  </label>
                  <Input
                    type="number"
                    placeholder="Price"
                    value={itemToEdit.price}
                    onChange={(e) => handleEditChange("price", e.target.value)}
                    min="0"
                    step="0.01"
                    className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:ring-red-600/10 text-slate-800"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                    Discount (%)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={itemToEdit.discount || ""}
                    onChange={(e) =>
                      handleEditChange("discount", e.target.value)
                    }
                    min="0"
                    max="100"
                    step="0.01"
                    className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:ring-red-600/10 text-slate-800"
                  />
                </div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3 text-sm font-medium text-emerald-600 flex items-center justify-between">
                <span>Discounted Price:</span>
                <span>
                  €
                  {itemToEdit.price && itemToEdit.discount
                    ? (
                        itemToEdit.price -
                        (itemToEdit.price * itemToEdit.discount) / 100
                      ).toFixed(2)
                    : itemToEdit.price}
                </span>
              </div>
            </div>

            {/* Right Column: Recipe & Image */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                  Extra Ingredients
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Ingredient"
                    className="h-11 rounded-xl border-slate-100 bg-slate-50/50 font-medium flex-1"
                  />
                  <Input
                    type="number"
                    value={newIngredientPrice}
                    onChange={(e) => setNewIngredientPrice(e.target.value)}
                    placeholder="Price"
                    min="0"
                    step="0.01"
                    className="h-11 rounded-xl border-slate-100 bg-slate-50/50 w-20"
                  />
                  <Button
                    type="button"
                    onClick={handleAddIngredient}
                    className="h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 font-medium shadow-md transition-all flex items-center justify-center gap-1"
                    disabled={!newIngredient || !newIngredientPrice}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </Button>
                </div>

                {itemToEdit.ingredients?.length > 0 && (
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto pr-1 border border-slate-100 p-2 rounded-xl bg-slate-50/20">
                    {itemToEdit.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white border border-slate-100 p-2 px-3 rounded-lg shadow-sm"
                      >
                        <span className="text-xs font-bold text-slate-700">
                          {ingredient.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif italic text-red-600 font-bold">
                            €{ingredient.price.toFixed(2)}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-slate-300 hover:text-red-500 h-6 w-6 rounded-lg cursor-pointer border-none shadow-none bg-transparent hover:bg-transparent"
                            onClick={() => handleRemoveIngredient(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                  Category
                </label>
                <Select
                  value={itemToEdit.category}
                  onValueChange={(value) => handleEditChange("category", value)}
                >
                  <SelectTrigger className="w-full h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-red-600/10 text-slate-700 capitalize">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-2xl border-slate-100 shadow-2xl p-2 capitalize bg-white !z-[100000]"
                    style={{ zIndex: 100000 }}
                  >
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="cursor-pointer font-medium h-10 px-4"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                  Photo Appearance
                </label>
                <div className="aspect-[16/9] border border-slate-100 rounded-3xl overflow-hidden bg-slate-50/20">
                  {imagePreview || itemToEdit.image ? (
                    <div className="relative overflow-hidden aspect-[16/9] w-full bg-slate-100/50">
                      <img
                        src={
                          imagePreview ||
                          (typeof itemToEdit.image === "string"
                            ? itemToEdit.image
                            : URL.createObjectURL(itemToEdit.image))
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black/80 via-black/45 to-transparent flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          className="h-9 bg-white/95 hover:bg-white text-slate-800 border-none rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold px-4 shadow-lg scale-95 hover:scale-100 transition-all cursor-pointer"
                          onClick={() =>
                            document.getElementById("editImageInput").click()
                          }
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Change</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="h-9 bg-red-600/90 hover:bg-red-600 text-white border-none rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold px-4 shadow-lg scale-95 hover:scale-100 transition-all cursor-pointer"
                          onClick={() => {
                            setImagePreview(null);
                            handleEditChange("image", null);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </Button>
                      </div>
                      <Input
                        id="editImageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        document.getElementById("editImageInput").click()
                      }
                      className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-slate-100/30 transition-all duration-300 group"
                    >
                      <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-red-50 flex items-center justify-center mb-3 transition-all duration-300 shadow-sm border border-slate-100/50">
                        <Upload className="h-5 w-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                      </div>
                      <p className="text-sm font-bold text-slate-700 group-hover:text-red-600 transition-colors">
                        Upload item photo
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-widest mt-1">
                        Click anywhere to select
                      </p>
                      <Input
                        id="editImageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Specials Toggles */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Specials Promotion
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:bg-slate-50/50 md:p-4 md:rounded-2xl md:border md:border-slate-100/50">
              {/* Special Offers */}
              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                <span className="text-xs font-black text-slate-700">
                  Special Offers
                </span>
                <input
                  type="checkbox"
                  checked={itemToEdit.showInSpecialOffers || false}
                  onChange={(e) =>
                    handleEditChange("showInSpecialOffers", e.target.checked)
                  }
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>

              {/* Chef's Specials */}
              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                <span className="text-xs font-black text-slate-700">
                  Chef's Specials
                </span>
                <input
                  type="checkbox"
                  checked={itemToEdit.showInChefsSpecials || false}
                  onChange={(e) =>
                    handleEditChange("showInChefsSpecials", e.target.checked)
                  }
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>

              {/* Weekly Specials */}
              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                <span className="text-xs font-black text-slate-700">
                  Weekly Specials
                </span>
                <input
                  type="checkbox"
                  checked={itemToEdit.showInWeeklySpecials || false}
                  onChange={(e) =>
                    handleEditChange("showInWeeklySpecials", e.target.checked)
                  }
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Sticky Footer Trigger Spacer */}
          <div className="h-2"></div>
        </form>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-100 z-10 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setEditDialogOpen(false);
              setImagePreview(null);
            }}
            className="h-11 rounded-xl flex items-center gap-1 px-4 font-bold border-slate-200"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </Button>
          <Button
            type="submit"
            onClick={handleEditSubmit}
            className="h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center gap-1.5 px-6 font-bold shadow-lg shadow-red-500/10 transition-transform active:scale-95 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
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
            ) : mode === "create" ? (
              <Plus className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>
              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Add to Menu"
                  : "Save Changes"}
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductFormDialog;
