const key = 'studentfolio.demo.v1';
const seed = [
  { id: 1, first_name: 'Amara', last_name: 'Okafor', email: 'amara@example.com', student_number: 'STU-2026-001', course: 'Digital Media', year_of_study: '2', bio: 'Curious about the space where design meets technology. I enjoy building thoughtful digital experiences, photography, and collaborating on creative projects.', created_at: '2026-10-01T10:00:00Z' },
  { id: 2, first_name: 'Daniel', last_name: 'Chen', email: 'daniel@example.com', student_number: 'STU-2026-002', course: 'Computer Science', year_of_study: '3', bio: 'Exploring web development and creative coding. Usually working on a small side project or discovering new music.', created_at: '2026-10-02T10:00:00Z' },
  { id: 3, first_name: 'Sofia', last_name: 'Martinez', email: 'sofia@example.com', student_number: 'STU-2026-003', course: 'Business Management', year_of_study: '1', bio: 'Interested in sustainable businesses and the people behind them. I love meeting new people and sharing ideas.', created_at: '2026-10-03T10:00:00Z' },
];
function read() { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) : seed; }
// Temporary browser adapter. Replace these functions with Express requests next phase.
export const students = {
  async list() { return read(); },
  async save(input) {
    const rows = read();
    const duplicate = rows.find(row => row.id !== input.id && (row.email.toLowerCase() === input.email.toLowerCase() || (input.student_number && row.student_number === input.student_number)));
    if (duplicate) throw new Error('That email or student number already belongs to a profile.');
    const now = new Date().toISOString();
    const saved = { ...input, id: input.id || Date.now(), created_at: input.created_at || now, updated_at: now };
    localStorage.setItem(key, JSON.stringify(input.id ? rows.map(row => row.id === input.id ? saved : row) : [...rows, saved]));
    return saved;
  },
  async remove(id) { localStorage.setItem(key, JSON.stringify(read().filter(row => row.id !== id))); },
};
