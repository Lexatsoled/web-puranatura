import crypto from 'crypto';

// Mask IPv4 addresses by zeroing the last octet (x.x.x.0/24)
// For IPv6 keep a short prefix and append ::/64 to avoid storing full address
export const maskIp = (ip?: string | null) => {
  if (!ip) return 'unknown';

  // Normalize IPv4-mapped IPv6 like ::ffff:127.0.0.1
  const ipv4Match = ip.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (ipv4Match) {
    const parts = ipv4Match[1].split('.');
    parts[3] = '0/24';
    return parts.join('.');
  }

  // For IPv6, keep first 4 groups
  const ipv6Parts = ip.split(':').filter(Boolean);
  if (ipv6Parts.length >= 4) {
    return ipv6Parts.slice(0, 4).join(':') + '::/64';
  }

  return 'unknown';
};

export const hashString = (s?: string | null) => {
  if (!s) return 'unknown';
  return crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
};

export default { maskIp, hashString };
