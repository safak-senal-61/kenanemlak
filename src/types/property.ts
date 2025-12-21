export interface PropertyPhoto {
  id: string;
  url: string;
}

export interface Property {
  id: string;
  title: string;
  type: string;
  featured: boolean;
  location: string;
  area: number;
  areaNet?: number;
  rooms: string | number;
  bathrooms: string | number;
  createdAt: string;
  photos: PropertyPhoto[];
  buildingAge: string | number;
  floorNumber: string | number;
  totalFloors: string | number;
  heating: string;
  kitchen: string;
  parking: string;
  usageStatus: string;
  balcony: boolean;
  elevator: boolean;
  furnished: boolean;
  inComplex: boolean;
  description: string;
  price: number;
  currency: string;
  category?: string;
  subCategory?: string;
  credit?: boolean;
  swap?: boolean;
  isActive?: boolean;
  // Land specific fields
  zoningStatus?: string;
  block?: string;
  parcel?: string;
  sheet?: string;
  kaks?: string;
  gabari?: string;
  titleDeedStatus?: string;
}

export interface PropertyFilters {
  locationSearch?: string;
  category?: string;
  type?: string;
  subCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  rooms?: (string | number)[];
  buildingAge?: string | number;
  inComplex?: boolean;
  furnished?: boolean;
  balcony?: boolean;
  elevator?: boolean;
  credit?: boolean;
  swap?: boolean;
  [key: string]: string | number | boolean | (string | number)[] | undefined | null; // Allow for dynamic access if needed
}
