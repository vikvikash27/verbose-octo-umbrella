import {
  CityBangaloreIcon,
  CityChandigarhIcon,
  CityChennaiIcon,
  CityDelhiNCRIcon,
  CityHyderabadIcon,
  CityJaipurIcon,
  CityMumbaiIcon,
  CityPuneIcon,
} from './components/icons';
import { CityInfo } from './types';

export const popularCities: CityInfo[] = [
  { name: 'Bangalore', icon: CityBangaloreIcon },
  { name: 'Chandigarh', icon: CityChandigarhIcon },
  { name: 'Chennai', icon: CityChennaiIcon },
  { name: 'Delhi NCR', icon: CityDelhiNCRIcon },
  { name: 'Hyderabad', icon: CityHyderabadIcon },
  { name: 'Jaipur', icon: CityJaipurIcon },
  { name: 'Mumbai', icon: CityMumbaiIcon },
  { name: 'Pune', icon: CityPuneIcon },
];

export const otherCities: string[] = [
  'Coimbatore',
  'Guntur',
  'Kolkata',
  'Lucknow',
  'Mysore',
  'Nashik',
  'Surat',
  'Vijayawada',
  'Warangal',
];
