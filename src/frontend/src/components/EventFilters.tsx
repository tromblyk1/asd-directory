import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, X, Filter } from 'lucide-react';

interface EventFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedEventType: string;
  setSelectedEventType: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  costFilter: string;
  setCostFilter: (value: string) => void;
  showCEUOnly: boolean;
  setShowCEUOnly: (value: boolean) => void;
  showSensoryFriendly: boolean;
  setShowSensoryFriendly: (value: boolean) => void;
  cities: string[];
  regions: string[];
  onClearFilters: () => void;
  activeFilterCount: number;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  timeFilter,
  setTimeFilter,
  selectedCategory,
  setSelectedCategory,
  selectedEventType,
  setSelectedEventType,
  selectedCity,
  setSelectedCity,
  selectedRegion,
  setSelectedRegion,
  costFilter,
  setCostFilter,
  showCEUOnly,
  setShowCEUOnly,
  showSensoryFriendly,
  setShowSensoryFriendly,
  cities,
  regions,
  onClearFilters,
  activeFilterCount,
}) => {
  return (
    <Card className="border-none shadow-lg sticky top-6">
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-bold text-gray-900">Filters</h3>
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-sm"
            >
              <X className="w-4 h-4 mr-1" />
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Search */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Time Filter */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">When</Label>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming Events</SelectItem>
                <SelectItem value="past">Past Events</SelectItem>
                <SelectItem value="all">All Events</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Region Filter */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Region</Label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City Filter */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">City</Label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sensory_friendly">Sensory-Friendly</SelectItem>
                <SelectItem value="support_group">Support Groups</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="fundraiser">Fundraisers</SelectItem>
                <SelectItem value="professional_development">Professional Development</SelectItem>
                <SelectItem value="recreational">Recreational</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Event Type Filter */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Event Type</Label>
            <Select value={selectedEventType} onValueChange={setSelectedEventType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Sensory-Friendly Experience">Sensory-Friendly</SelectItem>
                <SelectItem value="Recreational Program">Recreational</SelectItem>
                <SelectItem value="Fundraising Event">Fundraising</SelectItem>
                <SelectItem value="Family Celebration">Celebration</SelectItem>
                <SelectItem value="Athletic Event">Athletic/Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cost Filter */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Cost</Label>
            <Select value={costFilter} onValueChange={setCostFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Any Cost" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Cost</SelectItem>
                <SelectItem value="free">Free Only</SelectItem>
                <SelectItem value="paid">Paid Events</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Special Features Checkboxes */}
          <div className="pt-4 border-t space-y-3">
            <Label className="text-sm font-semibold block">Special Features</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ceu-filter"
                checked={showCEUOnly}
                onCheckedChange={(checked) => setShowCEUOnly(checked as boolean)}
              />
              <Label
                htmlFor="ceu-filter"
                className="text-sm font-normal cursor-pointer leading-tight"
              >
                CEU Credits Available
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sensory-filter"
                checked={showSensoryFriendly}
                onCheckedChange={(checked) => setShowSensoryFriendly(checked as boolean)}
              />
              <Label
                htmlFor="sensory-filter"
                className="text-sm font-normal cursor-pointer leading-tight"
              >
                Sensory Accommodations
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};