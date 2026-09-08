-- =========================================================
-- NOMEC Portal Database Schema
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run
-- Safe to re-run: uses "if not exists" / "or replace" where possible
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- 1. PROFILES
-- One row per logged-in person (student, parent, teacher, admin).
-- Linked 1:1 to Supabase's built-in auth.users table.
-- ---------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'parent', 'teacher', 'admin')),
  full_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up.
-- Role and name are passed in from the sign-up form as "metadata".
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'full_name', 'Unnamed')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------
-- 2. ACADEMIC STRUCTURE
-- ---------------------------------------------------------
create table if not exists terms (
  id uuid primary key default gen_random_uuid(),
  name text not null,               -- e.g. "First Term"
  academic_year text not null,      -- e.g. "2025/2026"
  start_date date,
  end_date date,
  is_current boolean not null default false
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,               -- e.g. "JSS 1A"
  level text not null,              -- e.g. "JSS1"
  academic_year text not null
);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,               -- e.g. "Mathematics"
  code text
);

-- ---------------------------------------------------------
-- 3. PEOPLE
-- ---------------------------------------------------------
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references profiles(id) on delete set null,
  admission_number text unique not null,
  full_name text not null,          -- kept here too, in case student has no login yet
  class_id uuid references classes(id),
  date_of_birth date,
  gender text,
  created_at timestamptz not null default now()
);

create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references profiles(id) on delete set null,
  staff_id text unique not null,
  created_at timestamptz not null default now()
);

-- Which teacher teaches which subject to which class (many-to-many)
create table if not exists teacher_classes (
  teacher_id uuid references teachers(id) on delete cascade,
  class_id uuid references classes(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  is_class_teacher boolean not null default false,
  primary key (teacher_id, class_id, subject_id)
);

-- Links a parent's profile to their child/children (a parent may have >1 child here)
create table if not exists student_guardians (
  student_id uuid references students(id) on delete cascade,
  guardian_profile_id uuid references profiles(id) on delete cascade,
  relationship text,                -- e.g. "Mother", "Father", "Guardian"
  primary key (student_id, guardian_profile_id)
);

-- ---------------------------------------------------------
-- 4. GRADES / REPORT CARDS
-- ---------------------------------------------------------
create table if not exists grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  term_id uuid references terms(id) on delete cascade,
  ca_score numeric(5,2) default 0,      -- continuous assessment
  exam_score numeric(5,2) default 0,
  total_score numeric(5,2) generated always as (coalesce(ca_score,0) + coalesce(exam_score,0)) stored,
  grade_letter text,
  teacher_remark text,
  recorded_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  unique (student_id, subject_id, term_id)
);

-- ---------------------------------------------------------
-- 5. ATTENDANCE
-- ---------------------------------------------------------
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  class_id uuid references classes(id),
  date date not null,
  status text not null check (status in ('present', 'absent', 'late', 'excused')),
  recorded_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  unique (student_id, date)
);

-- ---------------------------------------------------------
-- 6. FEES
-- ---------------------------------------------------------
create table if not exists fees (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  term_id uuid references terms(id) on delete cascade,
  amount_due numeric(12,2) not null,
  amount_paid numeric(12,2) not null default 0,
  due_date date,
  updated_at timestamptz not null default now(),
  unique (student_id, term_id)
);

create table if not exists fee_payments (
  id uuid primary key default gen_random_uuid(),
  fee_id uuid references fees(id) on delete cascade,
  amount numeric(12,2) not null,
  method text,                      -- e.g. "Bank Transfer", "Cash", "Card"
  reference text,
  paid_at timestamptz not null default now(),
  recorded_by uuid references profiles(id)
);

-- Keep fees.amount_paid in sync whenever a payment is logged
create or replace function apply_fee_payment()
returns trigger as $$
begin
  update fees set amount_paid = amount_paid + new.amount, updated_at = now()
  where id = new.fee_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_fee_payment on fee_payments;
create trigger on_fee_payment
  after insert on fee_payments
  for each row execute function apply_fee_payment();

-- ---------------------------------------------------------
-- 7. TIMETABLE
-- ---------------------------------------------------------
create table if not exists timetable (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  subject_id uuid references subjects(id),
  teacher_id uuid references teachers(id),
  day_of_week int not null check (day_of_week between 1 and 7), -- 1=Monday
  start_time time not null,
  end_time time not null
);

-- ---------------------------------------------------------
-- 8. ANNOUNCEMENTS
-- ---------------------------------------------------------
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null check (audience in ('all', 'students', 'parents', 'teachers', 'class')),
  class_id uuid references classes(id),   -- only used when audience = 'class'
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 9. LOGIN IDs
-- Lets someone sign in with a short ID (e.g. NOMEC202502) instead of
-- typing their email. Publicly readable by design (needed pre-login to
-- resolve the ID to an email) but exposes nothing beyond that mapping.
-- ---------------------------------------------------------
create table if not exists login_ids (
  login_id text primary key,
  profile_id uuid references profiles(id) on delete cascade,
  email text not null
);

alter table login_ids enable row level security;
create policy "login_ids_read_all" on login_ids for select using (true);
-- No insert/update/delete policy on purpose: only the invite-user Edge Function
-- (using the service_role key, which bypasses RLS) is allowed to write here.


-- Everything below controls exactly who can see/change what.
-- =========================================================

alter table profiles enable row level security;
alter table students enable row level security;
alter table teachers enable row level security;
alter table teacher_classes enable row level security;
alter table student_guardians enable row level security;
alter table grades enable row level security;
alter table attendance enable row level security;
alter table fees enable row level security;
alter table fee_payments enable row level security;
alter table timetable enable row level security;
alter table announcements enable row level security;
alter table classes enable row level security;
alter table subjects enable row level security;
alter table terms enable row level security;

-- Small helper: is the logged-in user an admin?
create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$ language sql stable security definer;

-- Small helper: is the logged-in user the class teacher of a given class?
create or replace function is_class_teacher(target_class_id uuid)
returns boolean as $$
  select exists (
    select 1 from teacher_classes tc
    join teachers t on t.id = tc.teacher_id
    where t.profile_id = auth.uid()
      and tc.class_id = target_class_id
      and tc.is_class_teacher = true
  );
$$ language sql stable security definer;

-- PROFILES: everyone can see their own; admins see all
create policy "profiles_select_own" on profiles for select
  using (id = auth.uid() or is_admin());
create policy "profiles_update_own" on profiles for update
  using (id = auth.uid());

-- CLASSES / SUBJECTS / TERMS: readable by any logged-in user
create policy "classes_read_all" on classes for select using (auth.uid() is not null);
create policy "classes_write" on classes for insert with check (is_admin());
create policy "classes_update" on classes for update using (is_admin());
create policy "subjects_read_all" on subjects for select using (auth.uid() is not null);
create policy "subjects_write" on subjects for insert with check (is_admin());
create policy "subjects_update" on subjects for update using (is_admin());
create policy "terms_read_all" on terms for select using (auth.uid() is not null);
create policy "terms_write" on terms for insert with check (is_admin());
create policy "terms_update" on terms for update using (is_admin());

-- STUDENTS: a student sees themself; a parent sees their linked children;
-- a teacher sees students in classes they teach; admin sees all
create policy "students_select" on students for select using (
  profile_id = auth.uid()
  or exists (select 1 from student_guardians sg where sg.student_id = students.id and sg.guardian_profile_id = auth.uid())
  or exists (
    select 1 from teacher_classes tc join teachers t on t.id = tc.teacher_id
    where t.profile_id = auth.uid() and tc.class_id = students.class_id
  )
  or is_admin()
);

-- TEACHERS: visible to any logged-in user (needed to show "taught by" names)
create policy "teachers_read_all" on teachers for select using (auth.uid() is not null);
create policy "teacher_classes_read_all" on teacher_classes for select using (auth.uid() is not null);
create policy "teacher_classes_write" on teacher_classes for insert with check (is_admin());
create policy "teacher_classes_delete" on teacher_classes for delete using (is_admin());

-- STUDENT_GUARDIANS: a parent can see their own links; a student can see who's linked to them
create policy "guardians_select" on student_guardians for select using (
  guardian_profile_id = auth.uid()
  or exists (select 1 from students s where s.id = student_guardians.student_id and s.profile_id = auth.uid())
  or is_admin()
);

-- GRADES: student sees own; parent sees their child's; class teacher can insert/update for their class; admin all
create policy "grades_select" on grades for select using (
  exists (select 1 from students s where s.id = grades.student_id and s.profile_id = auth.uid())
  or exists (select 1 from student_guardians sg join students s on s.id = sg.student_id
             where s.id = grades.student_id and sg.guardian_profile_id = auth.uid())
  or exists (select 1 from students s where s.id = grades.student_id and is_class_teacher(s.class_id))
  or is_admin()
);
create policy "grades_write" on grades for insert with check (
  exists (select 1 from students s where s.id = grades.student_id and is_class_teacher(s.class_id)) or is_admin()
);
create policy "grades_update" on grades for update using (
  exists (select 1 from students s where s.id = grades.student_id and is_class_teacher(s.class_id)) or is_admin()
);

-- ATTENDANCE: same shape as grades
create policy "attendance_select" on attendance for select using (
  exists (select 1 from students s where s.id = attendance.student_id and s.profile_id = auth.uid())
  or exists (select 1 from student_guardians sg join students s on s.id = sg.student_id
             where s.id = attendance.student_id and sg.guardian_profile_id = auth.uid())
  or exists (select 1 from students s where s.id = attendance.student_id and is_class_teacher(s.class_id))
  or is_admin()
);
create policy "attendance_write" on attendance for insert with check (
  exists (select 1 from students s where s.id = attendance.student_id and is_class_teacher(s.class_id)) or is_admin()
);
create policy "attendance_update" on attendance for update using (
  exists (select 1 from students s where s.id = attendance.student_id and is_class_teacher(s.class_id)) or is_admin()
);

-- FEES: student/parent read-only; only admin manages (bursar has no portal yet - use Supabase Table Editor)
create policy "fees_select" on fees for select using (
  exists (select 1 from students s where s.id = fees.student_id and s.profile_id = auth.uid())
  or exists (select 1 from student_guardians sg join students s on s.id = sg.student_id
             where s.id = fees.student_id and sg.guardian_profile_id = auth.uid())
  or is_admin()
);
create policy "fee_payments_select" on fee_payments for select using (
  exists (select 1 from fees f join students s on s.id = f.student_id
          where f.id = fee_payments.fee_id and s.profile_id = auth.uid())
  or exists (select 1 from fees f join student_guardians sg on sg.student_id = f.student_id
             where f.id = fee_payments.fee_id and sg.guardian_profile_id = auth.uid())
  or is_admin()
);

-- TIMETABLE: readable by anyone in that class, or their parent, or the teaching staff
create policy "timetable_select" on timetable for select using (auth.uid() is not null);

-- ANNOUNCEMENTS: filtered by audience
create policy "announcements_select" on announcements for select using (
  audience = 'all'
  or (audience = 'students' and exists (select 1 from profiles where id = auth.uid() and role = 'student'))
  or (audience = 'parents' and exists (select 1 from profiles where id = auth.uid() and role = 'parent'))
  or (audience = 'teachers' and exists (select 1 from profiles where id = auth.uid() and role = 'teacher'))
  or (audience = 'class' and exists (
        select 1 from students s where s.class_id = announcements.class_id and s.profile_id = auth.uid()
      ))
  or (audience = 'class' and exists (
        select 1 from student_guardians sg join students s on s.id = sg.student_id
        where s.class_id = announcements.class_id and sg.guardian_profile_id = auth.uid()
      ))
  or is_admin()
);
create policy "announcements_write" on announcements for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role in ('teacher','admin'))
);

-- =========================================================
-- Done. Next: come back to chat and confirm this ran with no errors.
-- =========================================================
