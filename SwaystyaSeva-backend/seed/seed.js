require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Vitals = require('../models/Vitals');
const Ward = require('../models/Ward');
const Report = require('../models/Report');
const MedicalHistory = require('../models/MedicalHistory');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swastyaseva_hms';

const ODISHA_HOSPITALS = [
  {
    name: 'AIIMS Bhubaneswar',
    slug: 'aiims-bhubaneswar',
    state: 'Odisha', city: 'Bhubaneswar',
    address: 'Sijua, Patrapada, Bhubaneswar - 751019',
    phone: '0674-2476789', emergency: '0674-2476700',
    email: 'contact@aiimsbhubaneswar.edu.in',
    type: 'Government', rating: 4.8, totalBeds: 960, availableBeds: 240,
    departmentCount: 32, established: 2012,
    lat: 20.2380, lng: 85.8129,
    mapUrl: 'https://maps.google.com/?q=AIIMS+Bhubaneswar',
    specialties: ['Cardiology','Neurology','Oncology','Trauma','Transplant','Pediatrics'],
    accreditation: ['NABH','NABL','MCI'],
    facilities: ['ICU','Blood Bank','24/7 Emergency','OT','Dialysis','NICU','Burn Unit'],
    departments: [
      { name:'Cardiology', floor:'2nd', wing:'A', rooms:'201-215', avgWaitMins:20, icon:'❤️', doctorCount:8 },
      { name:'Neurology', floor:'3rd', wing:'B', rooms:'301-310', avgWaitMins:25, icon:'🧠', doctorCount:6 },
      { name:'Orthopedics', floor:'1st', wing:'C', rooms:'101-115', avgWaitMins:15, icon:'🦴', doctorCount:7 },
      { name:'Oncology', floor:'4th', wing:'D', rooms:'401-420', avgWaitMins:30, icon:'🎗️', doctorCount:5 },
      { name:'Pediatrics', floor:'5th', wing:'A', rooms:'501-520', avgWaitMins:15, icon:'👶', doctorCount:9 },
      { name:'General Medicine', floor:'1st', wing:'A', rooms:'110-130', avgWaitMins:10, icon:'🏥', doctorCount:12 },
      { name:'Emergency', floor:'Ground', wing:'E', rooms:'E1-E20', avgWaitMins:5, icon:'🚨', doctorCount:15 },
      { name:'Gynecology', floor:'6th', wing:'B', rooms:'601-615', avgWaitMins:20, icon:'👩‍⚕️', doctorCount:6 },
    ],
  },
  {
    name: 'SUM Ultimate Medicare',
    slug: 'sum-hospital-bhubaneswar',
    state: 'Odisha', city: 'Bhubaneswar',
    address: 'K8, Kalinga Nagar, Bhubaneswar - 751003',
    phone: '0674-2350000', emergency: '0674-2350100',
    email: 'info@sumhospital.in',
    type: 'Teaching Hospital', rating: 4.6, totalBeds: 750, availableBeds: 180,
    departmentCount: 22, established: 2003,
    lat: 20.2961, lng: 85.8245,
    mapUrl: 'https://maps.google.com/?q=SUM+Hospital+Bhubaneswar',
    specialties: ['Cardiology','Neurology','Orthopedics','Oncology','Nephrology'],
    accreditation: ['NABH','NABL'],
    facilities: ['ICU','Blood Bank','24/7 Emergency','OT','Dialysis','Cath Lab'],
    departments: [
      { name:'Cardiology', floor:'2nd', wing:'A', rooms:'201-215', avgWaitMins:15, icon:'❤️', doctorCount:6 },
      { name:'Neurology', floor:'3rd', wing:'A', rooms:'301-310', avgWaitMins:20, icon:'🧠', doctorCount:5 },
      { name:'Nephrology', floor:'4th', wing:'B', rooms:'401-410', avgWaitMins:25, icon:'🫘', doctorCount:4 },
      { name:'Orthopedics', floor:'1st', wing:'B', rooms:'101-115', avgWaitMins:15, icon:'🦴', doctorCount:5 },
      { name:'General Medicine', floor:'1st', wing:'A', rooms:'120-140', avgWaitMins:10, icon:'🏥', doctorCount:10 },
      { name:'Pediatrics', floor:'5th', wing:'A', rooms:'501-515', avgWaitMins:12, icon:'👶', doctorCount:6 },
    ],
  },
  {
    name: 'Apollo Hospitals Bhubaneswar',
    slug: 'apollo-bhubaneswar',
    state: 'Odisha', city: 'Bhubaneswar',
    address: 'Plot 251, Sainik School Road, Bhubaneswar - 751005',
    phone: '0674-6669999', emergency: '1860-500-1066',
    email: 'bhubaneswar@apollohospitals.com',
    type: 'Multi-Specialty', rating: 4.7, totalBeds: 350, availableBeds: 80,
    departmentCount: 24, established: 2013,
    lat: 20.2794, lng: 85.8368,
    mapUrl: 'https://maps.google.com/?q=Apollo+Hospitals+Bhubaneswar',
    specialties: ['Cardiology','Oncology','Transplant','Neurology','Robotic Surgery'],
    accreditation: ['JCI','NABH','NABL'],
    facilities: ['ICU','NICU','Blood Bank','24/7 Emergency','Robotic OT','Cath Lab','PET CT'],
    departments: [
      { name:'Cardiology', floor:'2nd', wing:'A', rooms:'201-215', avgWaitMins:15, icon:'❤️', doctorCount:7 },
      { name:'Oncology', floor:'3rd', wing:'B', rooms:'301-320', avgWaitMins:30, icon:'🎗️', doctorCount:5 },
      { name:'Transplant', floor:'4th', wing:'C', rooms:'401-410', avgWaitMins:60, icon:'🫀', doctorCount:4 },
      { name:'Neurosurgery', floor:'3rd', wing:'A', rooms:'310-320', avgWaitMins:45, icon:'🧠', doctorCount:4 },
      { name:'Orthopedics', floor:'1st', wing:'A', rooms:'101-115', avgWaitMins:15, icon:'🦴', doctorCount:5 },
      { name:'General Medicine', floor:'1st', wing:'B', rooms:'120-135', avgWaitMins:10, icon:'🏥', doctorCount:8 },
    ],
  },
  {
    name: 'Capital Hospital Bhubaneswar',
    slug: 'capital-hospital-bhubaneswar',
    state: 'Odisha', city: 'Bhubaneswar',
    address: 'Unit 6, Bhubaneswar - 751001',
    phone: '0674-2392700', emergency: '0674-2392600',
    email: 'capital@odisha.gov.in',
    type: 'Government', rating: 4.3, totalBeds: 500, availableBeds: 120,
    departmentCount: 18, established: 1958,
    lat: 20.2667, lng: 85.8408,
    mapUrl: 'https://maps.google.com/?q=Capital+Hospital+Bhubaneswar',
    specialties: ['General Medicine','Emergency','Pediatrics','Surgery','Gynecology'],
    accreditation: ['NABH'],
    facilities: ['ICU','Blood Bank','24/7 Emergency','OT','Dialysis'],
    departments: [
      { name:'General Medicine', floor:'1st', wing:'A', rooms:'101-130', avgWaitMins:10, icon:'🏥', doctorCount:15 },
      { name:'Emergency', floor:'Ground', wing:'E', rooms:'E1-E15', avgWaitMins:5, icon:'🚨', doctorCount:12 },
      { name:'Pediatrics', floor:'2nd', wing:'B', rooms:'201-220', avgWaitMins:12, icon:'👶', doctorCount:8 },
      { name:'General Surgery', floor:'3rd', wing:'A', rooms:'301-315', avgWaitMins:20, icon:'🔪', doctorCount:7 },
      { name:'Gynecology', floor:'4th', wing:'B', rooms:'401-415', avgWaitMins:18, icon:'👩‍⚕️', doctorCount:6 },
    ],
  },
  {
    name: 'KIMS Hospital Bhubaneswar',
    slug: 'kims-bhubaneswar',
    state: 'Odisha', city: 'Bhubaneswar',
    address: 'KIIT Road, Patia, Bhubaneswar - 751024',
    phone: '0674-6660000', emergency: '0674-6660100',
    email: 'info@kimsbhubaneswar.com',
    type: 'Multi-Specialty', rating: 4.5, totalBeds: 600, availableBeds: 150,
    departmentCount: 20, established: 2006,
    lat: 20.3534, lng: 85.8191,
    mapUrl: 'https://maps.google.com/?q=KIMS+Hospital+Bhubaneswar',
    specialties: ['Neurology','Cardiology','Nephrology','Urology','Oncology'],
    accreditation: ['NABH','NABL'],
    facilities: ['ICU','Blood Bank','24/7 Emergency','OT','Dialysis','Cath Lab'],
    departments: [
      { name:'Neurology', floor:'3rd', wing:'A', rooms:'301-315', avgWaitMins:25, icon:'🧠', doctorCount:6 },
      { name:'Cardiology', floor:'2nd', wing:'A', rooms:'201-215', avgWaitMins:20, icon:'❤️', doctorCount:5 },
      { name:'Nephrology', floor:'4th', wing:'B', rooms:'401-410', avgWaitMins:25, icon:'🫘', doctorCount:4 },
      { name:'Urology', floor:'4th', wing:'A', rooms:'415-425', avgWaitMins:20, icon:'🫀', doctorCount:3 },
      { name:'General Medicine', floor:'1st', wing:'A', rooms:'101-120', avgWaitMins:10, icon:'🏥', doctorCount:10 },
    ],
  },
  {
    name: 'Hi-Tech Medical College Bhubaneswar',
    slug: 'hitech-bhubaneswar',
    state: 'Odisha', city: 'Bhubaneswar',
    address: 'Pandara, Bhubaneswar - 751025',
    phone: '0674-6646464', emergency: '0674-6646400',
    email: 'info@hitechmedical.in',
    type: 'Teaching Hospital', rating: 4.2, totalBeds: 400, availableBeds: 100,
    departmentCount: 20, established: 2005,
    lat: 20.3147, lng: 85.8189,
    mapUrl: 'https://maps.google.com/?q=Hitech+Medical+College+Bhubaneswar',
    specialties: ['General Surgery','Internal Medicine','Gynecology','Psychiatry','ENT'],
    accreditation: ['NABH','MCI'],
    facilities: ['ICU','Blood Bank','24/7 Emergency','OT','Pharmacy'],
    departments: [
      { name:'General Surgery', floor:'2nd', wing:'A', rooms:'201-215', avgWaitMins:20, icon:'🔪', doctorCount:6 },
      { name:'Internal Medicine', floor:'1st', wing:'A', rooms:'101-120', avgWaitMins:10, icon:'🏥', doctorCount:10 },
      { name:'Gynecology', floor:'3rd', wing:'B', rooms:'301-315', avgWaitMins:20, icon:'👩‍⚕️', doctorCount:5 },
      { name:'Psychiatry', floor:'5th', wing:'A', rooms:'501-510', avgWaitMins:30, icon:'🧘', doctorCount:3 },
      { name:'ENT', floor:'2nd', wing:'B', rooms:'220-230', avgWaitMins:15, icon:'👂', doctorCount:4 },
    ],
  },
  {
    name: 'Care Hospitals Bhubaneswar',
    slug: 'care-hospitals-bhubaneswar',
    state: 'Odisha', city: 'Bhubaneswar',
    address: 'Chandrasekharpur, Bhubaneswar - 751016',
    phone: '0674-6665000', emergency: '0674-6665100',
    email: 'bhubaneswar@carehospitals.com',
    type: 'Multi-Specialty', rating: 4.6, totalBeds: 300, availableBeds: 75,
    departmentCount: 16, established: 2007,
    lat: 20.3208, lng: 85.8167,
    mapUrl: 'https://maps.google.com/?q=Care+Hospitals+Bhubaneswar',
    specialties: ['Cardiology','Neurology','Oncology','Transplant','Critical Care'],
    accreditation: ['NABH','NABL'],
    facilities: ['ICU','Blood Bank','24/7 Emergency','OT','Cath Lab','Dialysis'],
    departments: [
      { name:'Cardiology', floor:'2nd', wing:'A', rooms:'201-210', avgWaitMins:15, icon:'❤️', doctorCount:5 },
      { name:'Critical Care', floor:'Ground', wing:'C', rooms:'C1-C20', avgWaitMins:5, icon:'⚡', doctorCount:8 },
      { name:'Neurology', floor:'3rd', wing:'A', rooms:'301-310', avgWaitMins:20, icon:'🧠', doctorCount:4 },
      { name:'General Medicine', floor:'1st', wing:'A', rooms:'101-115', avgWaitMins:10, icon:'🏥', doctorCount:8 },
    ],
  },
];

const DOCTORS_DATA = [
  // AIIMS Bhubaneswar
  { name:'Dr. Ananya Sharma', initials:'AS', specialization:'Cardiology', subSpecialization:'Interventional Cardiology', qualification:['MBBS','MD','DM Cardiology'], experience:15, consultationFee:800, rating:4.9, totalPatients:2840, available:true, availability:[{day:'Mon',startTime:'9AM',endTime:'1PM'},{day:'Wed',startTime:'2PM',endTime:'6PM'},{day:'Fri',startTime:'9AM',endTime:'12PM'}], availableSlots:['9:00 AM','10:00 AM','11:00 AM','2:00 PM'], hospitalSlug:'aiims-bhubaneswar', departmentName:'Cardiology', bio:'15 years of experience in interventional cardiology. Trained at AIIMS Delhi.' },
  { name:'Dr. Rajesh Kumar', initials:'RK', specialization:'Cardiology', subSpecialization:'Cardiac Surgery', qualification:['MBBS','MS','MCh Cardiac Surgery'], experience:20, consultationFee:1000, rating:4.8, totalPatients:3200, available:true, availability:[{day:'Tue',startTime:'10AM',endTime:'2PM'},{day:'Thu',startTime:'9AM',endTime:'1PM'},{day:'Sat',startTime:'10AM',endTime:'12PM'}], availableSlots:['10:00 AM','11:00 AM','3:00 PM'], hospitalSlug:'aiims-bhubaneswar', departmentName:'Cardiology', bio:'Senior cardiac surgeon with 20 years experience.' },
  { name:'Dr. Priya Patel', initials:'PP', specialization:'Neurology', subSpecialization:'Stroke Medicine', qualification:['MBBS','MD','DM Neurology'], experience:12, consultationFee:700, rating:4.7, totalPatients:1950, available:true, availability:[{day:'Mon',startTime:'10AM',endTime:'2PM'},{day:'Wed',startTime:'9AM',endTime:'1PM'},{day:'Fri',startTime:'2PM',endTime:'5PM'}], availableSlots:['10:00 AM','11:30 AM','2:00 PM'], hospitalSlug:'aiims-bhubaneswar', departmentName:'Neurology', bio:'Expert in stroke management and neuro-rehabilitation.' },
  { name:'Dr. Suresh Mohanty', initials:'SM', specialization:'Orthopedics', subSpecialization:'Joint Replacement', qualification:['MBBS','MS Ortho','Fellowship Joint Replacement'], experience:18, consultationFee:600, rating:4.8, totalPatients:2100, available:false, availability:[{day:'Tue',startTime:'9AM',endTime:'1PM'},{day:'Thu',startTime:'2PM',endTime:'6PM'}], availableSlots:['9:00 AM','11:00 AM'], hospitalSlug:'aiims-bhubaneswar', departmentName:'Orthopedics', bio:'Specialist in knee and hip replacement surgeries.' },
  { name:'Dr. Meena Rath', initials:'MR', specialization:'Pediatrics', subSpecialization:'Neonatology', qualification:['MBBS','MD Pediatrics','Fellowship Neonatology'], experience:10, consultationFee:500, rating:4.9, totalPatients:3500, available:true, availability:[{day:'Mon',startTime:'9AM',endTime:'12PM'},{day:'Tue',startTime:'2PM',endTime:'5PM'},{day:'Thu',startTime:'9AM',endTime:'12PM'},{day:'Sat',startTime:'9AM',endTime:'11AM'}], availableSlots:['9:00 AM','10:00 AM','11:00 AM','2:00 PM'], hospitalSlug:'aiims-bhubaneswar', departmentName:'Pediatrics', bio:'Pediatrician specializing in neonatal care and child development.' },
  // SUM Hospital
  { name:'Dr. Arun Mishra', initials:'AM', specialization:'Cardiology', subSpecialization:'Echocardiography', qualification:['MBBS','MD','DM Cardiology'], experience:14, consultationFee:700, rating:4.7, totalPatients:2200, available:true, availability:[{day:'Mon',startTime:'9AM',endTime:'1PM'},{day:'Wed',startTime:'9AM',endTime:'1PM'},{day:'Fri',startTime:'9AM',endTime:'12PM'}], availableSlots:['9:00 AM','10:30 AM','12:00 PM'], hospitalSlug:'sum-hospital-bhubaneswar', departmentName:'Cardiology', bio:'Expert in echo and non-invasive cardiology.' },
  { name:'Dr. Sujata Dash', initials:'SD', specialization:'Neurology', subSpecialization:'Epilepsy', qualification:['MBBS','MD','DM Neurology'], experience:11, consultationFee:650, rating:4.6, totalPatients:1600, available:true, availability:[{day:'Tue',startTime:'10AM',endTime:'2PM'},{day:'Thu',startTime:'10AM',endTime:'2PM'},{day:'Sat',startTime:'9AM',endTime:'12PM'}], availableSlots:['10:00 AM','11:30 AM','1:00 PM'], hospitalSlug:'sum-hospital-bhubaneswar', departmentName:'Neurology', bio:'Specializes in epilepsy management and headache disorders.' },
  { name:'Dr. Bikash Nanda', initials:'BN', specialization:'Nephrology', subSpecialization:'Kidney Transplant', qualification:['MBBS','MD','DM Nephrology'], experience:16, consultationFee:800, rating:4.8, totalPatients:1400, available:false, availability:[{day:'Mon',startTime:'2PM',endTime:'5PM'},{day:'Wed',startTime:'2PM',endTime:'5PM'}], availableSlots:['2:00 PM','3:30 PM'], hospitalSlug:'sum-hospital-bhubaneswar', departmentName:'Nephrology', bio:'Senior nephrologist with expertise in kidney transplant and dialysis.' },
  // Apollo
  { name:'Dr. Kavita Singh', initials:'KS', specialization:'Oncology', subSpecialization:'Medical Oncology', qualification:['MBBS','MD','DM Medical Oncology'], experience:13, consultationFee:900, rating:4.8, totalPatients:1800, available:true, availability:[{day:'Mon',startTime:'10AM',endTime:'1PM'},{day:'Wed',startTime:'10AM',endTime:'1PM'},{day:'Fri',startTime:'10AM',endTime:'12PM'}], availableSlots:['10:00 AM','11:00 AM','12:00 PM'], hospitalSlug:'apollo-bhubaneswar', departmentName:'Oncology', bio:'Medical oncologist with expertise in breast and lung cancer.' },
  { name:'Dr. Abhijit Roy', initials:'AR', specialization:'Cardiology', subSpecialization:'Interventional Cardiology', qualification:['MBBS','MD','DM Cardiology','Fellowship Interventional'], experience:17, consultationFee:1000, rating:4.9, totalPatients:2600, available:true, availability:[{day:'Tue',startTime:'9AM',endTime:'1PM'},{day:'Thu',startTime:'9AM',endTime:'1PM'},{day:'Sat',startTime:'9AM',endTime:'11AM'}], availableSlots:['9:00 AM','10:00 AM','11:00 AM'], hospitalSlug:'apollo-bhubaneswar', departmentName:'Cardiology', bio:'Leading interventional cardiologist trained at Cleveland Clinic.' },
  // Capital Hospital
  { name:'Dr. Sangita Behera', initials:'SB', specialization:'General Medicine', subSpecialization:'Internal Medicine', qualification:['MBBS','MD Internal Medicine'], experience:8, consultationFee:300, rating:4.4, totalPatients:4200, available:true, availability:[{day:'Mon',startTime:'9AM',endTime:'1PM'},{day:'Tue',startTime:'9AM',endTime:'1PM'},{day:'Wed',startTime:'9AM',endTime:'1PM'},{day:'Thu',startTime:'9AM',endTime:'1PM'},{day:'Fri',startTime:'9AM',endTime:'1PM'}], availableSlots:['9:00 AM','10:00 AM','11:00 AM','12:00 PM'], hospitalSlug:'capital-hospital-bhubaneswar', departmentName:'General Medicine', bio:'General physician with 8 years of experience in govt healthcare.' },
  { name:'Dr. Ratan Das', initials:'RD', specialization:'Pediatrics', subSpecialization:'Child Development', qualification:['MBBS','MD Pediatrics'], experience:9, consultationFee:250, rating:4.5, totalPatients:5100, available:true, availability:[{day:'Mon',startTime:'10AM',endTime:'1PM'},{day:'Wed',startTime:'10AM',endTime:'1PM'},{day:'Fri',startTime:'10AM',endTime:'12PM'},{day:'Sat',startTime:'9AM',endTime:'11AM'}], availableSlots:['10:00 AM','11:00 AM','12:00 PM'], hospitalSlug:'capital-hospital-bhubaneswar', departmentName:'Pediatrics', bio:'Pediatrician dedicated to child health in public healthcare system.' },
  // KIMS
  { name:'Dr. Nilufar Khan', initials:'NK', specialization:'Neurology', subSpecialization:'Neuro Critical Care', qualification:['MBBS','MD','DM Neurology'], experience:14, consultationFee:700, rating:4.7, totalPatients:1900, available:true, availability:[{day:'Mon',startTime:'9AM',endTime:'1PM'},{day:'Thu',startTime:'9AM',endTime:'1PM'},{day:'Sat',startTime:'9AM',endTime:'11AM'}], availableSlots:['9:00 AM','10:30 AM','12:00 PM'], hospitalSlug:'kims-bhubaneswar', departmentName:'Neurology', bio:'Neuro-critical care specialist.' },
  { name:'Dr. Tapas Sahoo', initials:'TS', specialization:'Urology', subSpecialization:'Uro-oncology', qualification:['MBBS','MS','MCh Urology'], experience:12, consultationFee:700, rating:4.6, totalPatients:1500, available:false, availability:[{day:'Tue',startTime:'10AM',endTime:'2PM'},{day:'Thu',startTime:'10AM',endTime:'2PM'}], availableSlots:['10:00 AM','12:00 PM'], hospitalSlug:'kims-bhubaneswar', departmentName:'Urology', bio:'Urological surgeon specializing in uro-oncology.' },
  // HiTech
  { name:'Dr. Basanta Sahu', initials:'BS', specialization:'General Surgery', subSpecialization:'Laparoscopic Surgery', qualification:['MBBS','MS General Surgery'], experience:10, consultationFee:400, rating:4.3, totalPatients:1800, available:true, availability:[{day:'Mon',startTime:'9AM',endTime:'12PM'},{day:'Wed',startTime:'9AM',endTime:'12PM'},{day:'Fri',startTime:'9AM',endTime:'12PM'}], availableSlots:['9:00 AM','10:00 AM','11:00 AM'], hospitalSlug:'hitech-bhubaneswar', departmentName:'General Surgery', bio:'Laparoscopic surgeon with expertise in minimal invasive procedures.' },
  // Care Hospitals
  { name:'Dr. Smita Jena', initials:'SJ', specialization:'Cardiology', subSpecialization:'Heart Failure', qualification:['MBBS','MD','DM Cardiology'], experience:13, consultationFee:800, rating:4.7, totalPatients:2000, available:true, availability:[{day:'Tue',startTime:'9AM',endTime:'1PM'},{day:'Thu',startTime:'9AM',endTime:'1PM'},{day:'Sat',startTime:'9AM',endTime:'11AM'}], availableSlots:['9:00 AM','10:30 AM','12:00 PM'], hospitalSlug:'care-hospitals-bhubaneswar', departmentName:'Cardiology', bio:'Heart failure specialist with 13 years of clinical experience.' },
];

const WARDS_DATA = [
  { name:'ICU', type:'icu', totalBeds:20, occupiedBeds:14, cleanliness:'Good', color:'#ef4444' },
  { name:'General Ward A', type:'general', totalBeds:40, occupiedBeds:28, cleanliness:'Good', color:'#2563eb' },
  { name:'General Ward B', type:'general', totalBeds:40, occupiedBeds:36, cleanliness:'Moderate', color:'#2563eb' },
  { name:'Emergency', type:'emergency', totalBeds:15, occupiedBeds:9, cleanliness:'Good', color:'#f59e0b' },
  { name:'Pediatrics Ward', type:'pediatrics', totalBeds:25, occupiedBeds:18, cleanliness:'Good', color:'#10b981' },
  { name:'Maternity Ward', type:'maternity', totalBeds:20, occupiedBeds:12, cleanliness:'Moderate', color:'#8b5cf6' },
];

const randBetween = (a, b) => +(a + Math.random() * (b - a)).toFixed(1);
const randInt = (a, b) => Math.floor(a + Math.random() * (b - a + 1));

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all
    await Promise.all([
      User.deleteMany({}), Hospital.deleteMany({}), Doctor.deleteMany({}),
      Patient.deleteMany({}), Appointment.deleteMany({}), Vitals.deleteMany({}),
      Ward.deleteMany({}), Report.deleteMany({}), MedicalHistory.deleteMany({}),
    ]);
    console.log('🗑️  Cleared all collections');

    // ── 1. Create Hospitals ────────────────────────────────────────
    const hospitals = await Hospital.insertMany(ODISHA_HOSPITALS);
    const hospMap = {};
    hospitals.forEach(h => { hospMap[h.slug] = h; });
    console.log(`✅ Created ${hospitals.length} hospitals`);

    // ── 2. Create Admin User ───────────────────────────────────────
    const adminUser = await User.create({
      name: 'SwastyaSeva Admin', email: 'admin@swastyaseva.health',
      password: 'admin123', role: 'admin',
    });

    // ── 3. Create Hospital Admins (one per hospital) ───────────────
    const hospitalAdminData = [
      { name:'Dr. Admin AIIMS', email:'admin@aiims-bbsr.in', hospitalSlug:'aiims-bhubaneswar' },
      { name:'Admin SUM Hospital', email:'admin@sumhospital.in', hospitalSlug:'sum-hospital-bhubaneswar' },
      { name:'Admin Apollo BBSR', email:'admin@apollo-bbsr.in', hospitalSlug:'apollo-bhubaneswar' },
      { name:'Admin Capital Hosp', email:'admin@capitalhospital.in', hospitalSlug:'capital-hospital-bhubaneswar' },
      { name:'Admin KIMS BBSR', email:'admin@kims-bbsr.in', hospitalSlug:'kims-bhubaneswar' },
      { name:'Admin HiTech', email:'admin@hitech-bbsr.in', hospitalSlug:'hitech-bhubaneswar' },
      { name:'Admin Care Hosp', email:'admin@care-bbsr.in', hospitalSlug:'care-hospitals-bhubaneswar' },
    ];
    for (const ha of hospitalAdminData) {
      const hosp = hospMap[ha.hospitalSlug];
      if (!hosp) continue;
      const u = await User.create({ name: ha.name, email: ha.email, password: 'admin123', role: 'hospital_admin', hospitalId: hosp._id, state: 'Odisha' });
      await Hospital.findByIdAndUpdate(hosp._id, { $push: { adminUsers: u._id } });
    }
    console.log(`✅ Created ${hospitalAdminData.length} hospital admins`);

    // ── 4. Create Doctors ──────────────────────────────────────────
    let drCounter = 4820;
    for (const dd of DOCTORS_DATA) {
      const hosp = hospMap[dd.hospitalSlug];
      if (!hosp) continue;
      drCounter++;
      const doctorId = `DR-${drCounter}`;
      const u = await User.create({
        name: dd.name, email: dd.name.toLowerCase().replace(/\s+/g, '.').replace('dr.', '') + '@swastyaseva.health',
        password: 'doctor123', role: 'doctor', doctorId, hospitalId: hosp._id, state: 'Odisha',
      });
      await Doctor.create({
        userId: u._id, doctorId, name: dd.name, initials: dd.initials,
        email: u.email, phone: `+91 98${randInt(100,999)} ${randInt(10000,99999)}`,
        specialization: dd.specialization, subSpecialization: dd.subSpecialization,
        qualification: dd.qualification, experience: dd.experience,
        consultationFee: dd.consultationFee, rating: dd.rating, totalPatients: dd.totalPatients,
        available: dd.available, availableSlots: dd.availableSlots, availability: dd.availability,
        hospitalId: hosp._id, departmentName: dd.departmentName, state: 'Odisha',
        bio: dd.bio, isActive: true,
      });
    }
    console.log(`✅ Created ${DOCTORS_DATA.length} doctors`);

    // ── 5. Create Patients ─────────────────────────────────────────
    const patientData = [
      { name:'John Patient', email:'patient@medicore.com', patientId:'SW-4821', bloodGroup:'B+', phone:'+91 98765 43210' },
      { name:'Priya Mishra', email:'priya@demo.in', patientId:'SW-4822', bloodGroup:'A+', phone:'+91 98765 43211' },
      { name:'Arjun Das', email:'arjun@demo.in', patientId:'SW-4823', bloodGroup:'O+', phone:'+91 98765 43212' },
      { name:'Sunita Rath', email:'sunita@demo.in', patientId:'SW-4824', bloodGroup:'AB+', phone:'+91 98765 43213' },
      { name:'Ramesh Nayak', email:'ramesh@demo.in', patientId:'SW-4825', bloodGroup:'B-', phone:'+91 98765 43214' },
      { name:'Lalita Panda', email:'lalita@demo.in', patientId:'SW-4826', bloodGroup:'A-', phone:'+91 98765 43215' },
    ];
    const patientUsers = [];
    for (const pd of patientData) {
      const u = await User.create({ name: pd.name, email: pd.email, password: 'patient123', role: 'patient', patientId: pd.patientId, phone: pd.phone, state: 'Odisha' });
      await Patient.create({ userId: u._id, patientId: pd.patientId, name: pd.name, email: pd.email, phone: pd.phone, bloodGroup: pd.bloodGroup, state: 'Odisha', address: 'Bhubaneswar, Odisha', admissionStatus: 'outpatient' });
      patientUsers.push({ user: u, patientId: pd.patientId });
    }
    console.log(`✅ Created ${patientData.length} patients`);

    // ── 6. Create Wards for first hospital ────────────────────────
    const mainHosp = hospitals[0];
    for (const wd of WARDS_DATA) {
      await Ward.create({ ...wd, hospitalId: mainHosp._id });
    }
    console.log(`✅ Created ${WARDS_DATA.length} wards`);

    // ── 7. Create Vitals (50 readings for each patient) ────────────
    for (const { patientId } of patientUsers) {
      const readings = [];
      for (let i = 49; i >= 0; i--) {
        const ts = new Date(Date.now() - i * 5 * 60 * 1000);
        readings.push({
          patientId, timestamp: ts, source: 'simulation', finger: true,
          hr: randInt(62, 98), sysBP: randInt(110, 135), diaBP: randInt(70, 88),
          spo2: randBetween(96, 99.5), temp: randBetween(36.2, 37.2), fatigue: randInt(10, 60),
        });
      }
      await Vitals.insertMany(readings);
    }
    console.log('✅ Created vitals readings');

    // ── 8. Create Appointments ────────────────────────────────────
    const allDoctors = await Doctor.find({}).limit(8);
    const apptData = [
      { patientId:'SW-4821', patientName:'John Patient', idx:0, status:'confirmed', visitType:'new_consultation', timeSlot:'9:00 AM', daysOffset: 2 },
      { patientId:'SW-4822', patientName:'Priya Mishra', idx:1, status:'pending', visitType:'ongoing_treatment', timeSlot:'10:00 AM', daysOffset: 3 },
      { patientId:'SW-4823', patientName:'Arjun Das', idx:2, status:'confirmed', visitType:'new_consultation', timeSlot:'11:00 AM', daysOffset: 1 },
      { patientId:'SW-4824', patientName:'Sunita Rath', idx:3, status:'cancelled', visitType:'new_consultation', timeSlot:'2:00 PM', daysOffset: -1 },
      { patientId:'SW-4825', patientName:'Ramesh Nayak', idx:4, status:'completed', visitType:'ongoing_treatment', timeSlot:'9:00 AM', daysOffset: -2 },
      { patientId:'SW-4826', patientName:'Lalita Panda', idx:5, status:'pending', visitType:'new_consultation', timeSlot:'3:00 PM', daysOffset: 4 },
    ];
    for (const ad of apptData) {
      const doc = allDoctors[ad.idx % allDoctors.length];
      if (!doc) continue;
      const date = new Date();
      date.setDate(date.getDate() + ad.daysOffset);
      await Appointment.create({
        patientId: ad.patientId, patientName: ad.patientName,
        doctorId: doc._id, doctorName: doc.name,
        hospitalId: doc.hospitalId, hospitalName: mainHosp.name,
        departmentName: doc.departmentName,
        date, timeSlot: ad.timeSlot, visitType: ad.visitType,
        status: ad.status, consultationFee: doc.consultationFee,
      });
    }
    console.log('✅ Created appointments');

    // ── 9. Medical History ────────────────────────────────────────
    const histData = [
      { patientId:'SW-4821', diagnosis:'Hypertension Follow-up', prescription:'Amlodipine 5mg OD, Tab Telma 40mg OD', notes:'BP controlled. Continue medication.', daysAgo:14, severity:'mild' },
      { patientId:'SW-4821', diagnosis:'Seasonal Influenza', prescription:'Tab Oseltamivir 75mg BD x 5 days, Tab Paracetamol 500mg TDS', notes:'Fever subsided. Rest advised.', daysAgo:60, severity:'moderate' },
      { patientId:'SW-4821', diagnosis:'Lower Back Pain', prescription:'Tab Ibuprofen 400mg TDS, Physiotherapy 3x/week', notes:'MRI normal. Muscle spasm.', daysAgo:120, severity:'mild' },
      { patientId:'SW-4822', diagnosis:'Type 2 Diabetes Review', prescription:'Tab Metformin 500mg BD, Diet control', notes:'HbA1c: 7.2%. Controlled.', daysAgo:30, severity:'moderate' },
    ];
    const firstDoctor = allDoctors[0];
    for (const hd of histData) {
      const date = new Date();
      date.setDate(date.getDate() - hd.daysAgo);
      await MedicalHistory.create({
        patientId: hd.patientId, date, diagnosis: hd.diagnosis,
        doctorId: firstDoctor?._id, doctorName: firstDoctor?.name,
        hospitalId: mainHosp._id, hospitalName: mainHosp.name,
        prescription: hd.prescription, notes: hd.notes, severity: hd.severity,
      });
    }
    console.log('✅ Created medical history');

    // ── 10. Reports ───────────────────────────────────────────────
    await Report.insertMany([
      { patientId:'SW-4821', name:'Complete Blood Count', type:'Lab Report', doctorName: firstDoctor?.name || 'Dr. Admin', status:'ready' },
      { patientId:'SW-4821', name:'ECG Report', type:'Cardiac', doctorName: firstDoctor?.name || 'Dr. Admin', status:'ready' },
      { patientId:'SW-4821', name:'Chest X-Ray', type:'Radiology', doctorName: firstDoctor?.name || 'Dr. Admin', status:'ready' },
      { patientId:'SW-4821', name:'Blood Sugar Fasting', type:'Lab Report', doctorName: firstDoctor?.name || 'Dr. Admin', status:'ready' },
    ]);
    console.log('✅ Created reports');

    console.log('');
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║         SwastyaSeva HMS — Seed Complete ✅           ║');
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log('║  Admin:          admin@swastyaseva.health / admin123 ║');
    console.log('║  Hospital Admin: admin@aiims-bbsr.in / admin123      ║');
    console.log('║  Doctor:         (any doctor email) / doctor123      ║');
    console.log('║  Patient:        patient@medicore.com / patient123   ║');
    console.log('║  Patient ID:     SW-4821                             ║');
    console.log('╚══════════════════════════════════════════════════════╝');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
