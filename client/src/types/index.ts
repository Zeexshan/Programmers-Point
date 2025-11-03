export interface Technology {
  name: string;
  mainCategory: string;
  subCategory: string;
  displayOrder: number;
  vacancies: number;
  fresherPackage: string;
  experiencedPackage: string;
  topCompanies: string;
  popularityScore: number;
  description: string;
}

export interface Combination {
  technologies: string[];
  jobRole: string;
  category: string;
  vacancies: number;
  fresherPackage: string;
  experiencedPackage: string;
  topCompanies: string;
  popularityScore: number;
}

export interface Company {
  name: string;
  logoUrl: string;
  totalPlacements: number;
  avgPackage: string;
}

export interface Placement {
  studentName: string;
  company: string;
  package: string;
  phone: string;
  photoUrl: string;
  profile: string;
  course: string;
  review: string;
  joiningDate: string;
}

export interface Inquiry {
  timestamp: string;
  name: string;
  fatherName: string;
  phone: string;
  email: string;
  dob: string;
  courseInterest: string;
  college: string;
  branch: string;
  status: string;
}

export interface InquiryFormData {
  name: string;
  fatherName: string;
  phone: string;
  email: string;
  dob: string;
  courseInterest: string;
  college: string;
  branch: string;
}

export interface AllData {
  technologies: Technology[];
  combinations: Combination[];
  companies: Company[];
  placements: Placement[];
}
