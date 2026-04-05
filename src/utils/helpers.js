import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

export const formatNumber = (n) => {
  if (!n && n !== 0) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
};

export const formatFullNumber = (n) => (n || 0).toLocaleString('en-NG');

export const calcPercentage = (part, total) =>
  total > 0 ? ((part / total) * 100).toFixed(1) : '0.0';

export const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

export const truncate = (str = '', len = 30) =>
  str.length > len ? str.slice(0, len) + '…' : str;

export const getPartyColor = (party) => {
  const map = { APC:'#1a3c6e', PDP:'#cc0000', LP:'#228B22', NNPP:'#FF8C00', ADC:'#8B008B', SDP:'#4169E1', ZLP:'#708090' };
  return map[party] || '#6b7280';
};

export const debounce = (fn, ms = 300) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};