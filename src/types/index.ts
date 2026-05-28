// ─────────────────────────────────────────────────────────────────
//  Shared TypeScript Types
//  Jesus The Healer Orthopaedic Home
// ─────────────────────────────────────────────────────────────────

export type Gender        = 'MALE' | 'FEMALE' | 'OTHER';
export type BloodGroup    = 'A_POS'|'A_NEG'|'B_POS'|'B_NEG'|'AB_POS'|'AB_NEG'|'O_POS'|'O_NEG'|'UNKNOWN';
export type AppointmentStatus = 'PENDING'|'CONFIRMED'|'IN_PROGRESS'|'COMPLETED'|'CANCELLED'|'NO_SHOW';
export type RecordStatus  = 'ACTIVE'|'FOLLOW_UP'|'DISCHARGED'|'REFERRED';
export type StaffRole     = 'DOCTOR'|'PHYSIOTHERAPIST'|'PHARMACIST'|'NURSE'|'ADMIN'|'RECEPTIONIST';
export type UserRole      = 'PATIENT'|'STAFF'|'ADMIN';
export type PrescriptionStatus = 'ACTIVE'|'COMPLETED'|'CANCELLED';

export interface Patient {
  id:              string;
  patientNumber:   string;
  firstName:       string;
  lastName:        string;
  dateOfBirth?:    string;
  gender?:         Gender;
  phone:           string;
  email?:          string;
  address?:        string;
  bloodGroup:      BloodGroup;
  allergies?:      string;
  emergencyContact?: string;
  emergencyPhone?: string;
  createdAt:       string;
}

export interface Staff {
  id:             string;
  firstName:      string;
  lastName:       string;
  phone?:         string;
  role:           StaffRole;
  specialty?:     string;
  qualifications?: string;
  experience?:    number;
  bio?:           string;
  imageUrl?:      string;
  availableDays:  string[];
  isActive:       boolean;
}

export interface Appointment {
  id:              string;
  appointmentRef:  string;
  patientId:       string;
  patient?:        Patient;
  staffId?:        string;
  staff?:          Staff;
  service:         string;
  scheduledDate:   string;
  scheduledTime:   string;
  status:          AppointmentStatus;
  notes?:          string;
  isEmergency:     boolean;
  createdAt:       string;
}

export interface PatientRecord {
  id:            string;
  patientId:     string;
  patient?:      Patient;
  staffId?:      string;
  staff?:        Staff;
  condition:     string;
  diagnosis?:    string;
  treatment?:    string;
  clinicalNotes?: string;
  status:        RecordStatus;
  admissionDate: string;
  dischargeDate?: string;
}

export interface Prescription {
  id:           string;
  patientId:    string;
  staffId?:     string;
  staff?:       Staff;
  recordId?:    string;
  medication:   string;
  dosage:       string;
  frequency:    string;
  duration:     string;
  instructions?: string;
  status:       PrescriptionStatus;
  issuedDate:   string;
}

export interface Vital {
  id:            string;
  patientId:     string;
  bloodPressure?: string;
  pulse?:         number;
  temperature?:   number;
  weight?:        number;
  height?:        number;
  oxygenSat?:     number;
  notes?:         string;
  recordedAt:     string;
}

export interface Testimonial {
  id:          string;
  patientName: string;
  condition:   string;
  review:      string;
  rating:      number;
  outcome?:    string;
  location?:   string;
  isPublished: boolean;
  createdAt:   string;
}

export interface ContactMessage {
  id:        string;
  name:      string;
  phone:     string;
  email?:    string;
  service?:  string;
  message:   string;
  isRead:    boolean;
  createdAt: string;
}

// ── API response wrapper ──────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?:   T;
  error?:  string;
  message?: string;
}

// ── Booking form state ────────────────────────────────────────────
export interface BookingFormData {
  department:  string;
  doctorId:    string;
  date:        string;
  time:        string;
  firstName:   string;
  lastName:    string;
  phone:       string;
  email:       string;
  dob:         string;
  gender:      string;
  notes:       string;
  isEmergency: boolean;
}
