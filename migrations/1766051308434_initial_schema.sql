CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL,
  department text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

CREATE TABLE IF NOT EXISTS access_management (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  employee_name text NOT NULL,
  employee_id text NOT NULL UNIQUE,
  department text NOT NULL,
  access_level text NOT NULL,
  system_access text NOT NULL,
  granted_by text NOT NULL,
  date_granted date NOT NULL,
  expiry_date date NOT NULL,
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_access_management_employee_id ON access_management (employee_id);
CREATE INDEX IF NOT EXISTS idx_access_management_status ON access_management (status);
CREATE INDEX IF NOT EXISTS idx_access_management_expiry_date ON access_management (expiry_date);

CREATE TABLE IF NOT EXISTS employee_onboarding (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  task text NOT NULL,
  type text NOT NULL,
  document_name text,
  assigned_to text NOT NULL,
  name_of_employee text NOT NULL,
  due_date date NOT NULL,
  status text NOT NULL,
  completed_date date,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_employee_onboarding_status ON employee_onboarding (status);
CREATE INDEX IF NOT EXISTS idx_employee_onboarding_due_date ON employee_onboarding (due_date);
CREATE INDEX IF NOT EXISTS idx_employee_onboarding_employee ON employee_onboarding (name_of_employee);

CREATE TABLE IF NOT EXISTS employee_staffing (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  recruiting_source_budget decimal(12,2) NOT NULL,
  hire_goal integer NOT NULL,
  funded boolean DEFAULT false NOT NULL,
  status text NOT NULL,
  assigned_to text NOT NULL,
  comments text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_employee_staffing_status ON employee_staffing (status);
CREATE INDEX IF NOT EXISTS idx_employee_staffing_funded ON employee_staffing (funded);

CREATE TABLE IF NOT EXISTS workflow_audit (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  workflow_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL,
  user_id uuid NOT NULL,
  timestamp timestamp with time zone DEFAULT now() NOT NULL,
  changes jsonb
);
CREATE INDEX IF NOT EXISTS idx_workflow_audit_workflow ON workflow_audit (workflow_name);
CREATE INDEX IF NOT EXISTS idx_workflow_audit_record ON workflow_audit (record_id);
CREATE INDEX IF NOT EXISTS idx_workflow_audit_timestamp ON workflow_audit (timestamp);