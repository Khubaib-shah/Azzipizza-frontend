import React from "react";
import { Search } from "lucide-react";
import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  specialsFilter,
  setSpecialsFilter,
  categories,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center bg-white p-2 rounded-xl border border-slate-100/50 w-full mb-6 sm:mb-8 shadow-sm">
      <div className="relative group flex-1 min-w-[200px] lg:min-w-[280px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
        <Input
          type="search"
          placeholder="Find an item..."
          className="pl-10 w-full bg-slate-50 border-none rounded-lg focus-visible:ring-red-600/10 font-bold h-9 text-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-2 flex-1 lg:flex-initial">
        {/* Category Filter */}
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value)}
        >
          <SelectTrigger className="flex-1 lg:flex-initial lg:w-40 bg-slate-50 border-none rounded-lg focus:ring-red-600/10 font-bold text-slate-700 h-9 px-3 capitalize text-xs">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-2 capitalize z-50 bg-white">
            <SelectItem
              value="all"
              className="cursor-pointer font-medium h-9 px-3 text-xs"
            >
              All Categories
            </SelectItem>
            {categories.map((category) => (
              <SelectItem
                key={category}
                value={category}
                className="cursor-pointer font-medium h-9 px-3 text-xs"
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Specials Filter */}
        <Select
          value={specialsFilter}
          onValueChange={(value) => setSpecialsFilter(value)}
        >
          <SelectTrigger className="flex-1 lg:flex-initial lg:w-40 bg-slate-50 border-none rounded-lg focus:ring-red-600/10 font-bold text-slate-700 h-9 px-3 text-xs">
            <SelectValue placeholder="All Specials" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-2 z-50 bg-white font-medium">
            <SelectItem value="all" className="cursor-pointer h-9 px-3 text-xs">
              All Specials
            </SelectItem>
            <SelectItem
              value="specialOffers"
              className="cursor-pointer h-9 px-3 text-xs"
            >
              Special Offers
            </SelectItem>
            <SelectItem
              value="chefsSpecials"
              className="cursor-pointer h-9 px-3 text-xs"
            >
              Chef's Specials
            </SelectItem>
            <SelectItem
              value="weeklySpecials"
              className="cursor-pointer h-9 px-3 text-xs"
            >
              Weekly Specials
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
