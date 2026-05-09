insert into public.employees (name, email, role, division, position, status, avatar_url, joined_at) values
('Maya Hartono', 'maya@officeflow.test', 'admin', 'Operations', 'Head of Operations', 'active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop', '2024-02-12'),
('Dimas Pratama', 'dimas@officeflow.test', 'manager', 'Finance', 'Finance Manager', 'active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop', '2023-11-03'),
('Alya Putri', 'alya@officeflow.test', 'staff', 'People', 'HR Specialist', 'probation', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop', '2025-01-18');

insert into public.finance_records (title, type, category, amount, record_date) values
('Enterprise retainer', 'income', 'Sales', 82500, '2026-05-02'),
('Cloud infrastructure', 'expense', 'Software', 12400, '2026-05-04'),
('Implementation fee', 'income', 'Services', 27600, '2026-05-06');
