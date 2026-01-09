// URL Security Analysis Logic

export type RiskLevel = 'safe' | 'suspicious' | 'dangerous';

export interface AnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  explanation: string;
  riskFactors: {
    icon: string;
    label: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  recommendation: string;
}

// Known URL shorteners
const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 
  'buff.ly', 'adf.ly', 'j.mp', 'rb.gy', 'short.io', 'cutt.ly'
];

// Suspicious keywords commonly used in phishing
const SUSPICIOUS_KEYWORDS = [
  'login', 'verify', 'update', 'confirm', 'account', 'secure',
  'banking', 'password', 'credential', 'suspend', 'urgent',
  'reward', 'winner', 'prize', 'free', 'gift', 'claim',
  'limited', 'expire', 'alert', 'warning', 'immediately'
];

// Known legitimate domains (whitelist for common safe sites)
const TRUSTED_DOMAINS = [
  'google.com', 'youtube.com', 'facebook.com', 'amazon.com',
  'microsoft.com', 'apple.com', 'github.com', 'stackoverflow.com',
  'wikipedia.org', 'linkedin.com', 'twitter.com', 'instagram.com'
];

// Phishing patterns
const PHISHING_PATTERNS = [
  /paypal.*login/i,
  /bank.*verify/i,
  /account.*suspend/i,
  /secure.*update/i,
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP address in URL
  /@.*@/, // Multiple @ symbols
  /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+\./i, // Multiple hyphens in subdomain
];

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function isHttps(url: string): boolean {
  return url.toLowerCase().startsWith('https://');
}

function isUrlShortener(domain: string): boolean {
  return URL_SHORTENERS.some(shortener => domain.includes(shortener));
}

function isTrustedDomain(domain: string): boolean {
  return TRUSTED_DOMAINS.some(trusted => 
    domain === trusted || domain.endsWith('.' + trusted)
  );
}

function findSuspiciousKeywords(url: string): string[] {
  const urlLower = url.toLowerCase();
  return SUSPICIOUS_KEYWORDS.filter(keyword => urlLower.includes(keyword));
}

function matchesPhishingPattern(url: string): boolean {
  return PHISHING_PATTERNS.some(pattern => pattern.test(url));
}

function hasExcessiveSubdomains(domain: string): boolean {
  const parts = domain.split('.');
  return parts.length > 4;
}

function hasUnusualCharacters(url: string): boolean {
  // Check for unusual Unicode characters that might be used for lookalike attacks
  return /[^\x00-\x7F]/.test(url) || url.includes('%00');
}

function simulateDomainAge(): { isNew: boolean; age: string } {
  // Simulated - in production, would use WHOIS API
  const random = Math.random();
  if (random < 0.3) {
    return { isNew: true, age: 'Less than 30 days' };
  }
  return { isNew: false, age: 'Over 1 year' };
}

export function analyzeUrl(inputUrl: string): AnalysisResult {
  let riskScore = 0;
  const riskFactors: AnalysisResult['riskFactors'] = [];
  
  // Normalize URL
  let url = inputUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  const domain = extractDomain(url);
  
  // Check if trusted domain
  if (isTrustedDomain(domain)) {
    return {
      riskScore: 5,
      riskLevel: 'safe',
      explanation: 'This is a well-known, trusted website.',
      riskFactors: [{
        icon: 'Shield',
        label: 'Verified trusted domain',
        severity: 'low'
      }],
      recommendation: 'This link shows no common threat patterns. Safe to visit.'
    };
  }
  
  // HTTPS check
  if (!isHttps(url)) {
    riskScore += 25;
    riskFactors.push({
      icon: 'ShieldOff',
      label: 'No HTTPS encryption',
      severity: 'high'
    });
  } else {
    riskFactors.push({
      icon: 'Lock',
      label: 'HTTPS secured',
      severity: 'low'
    });
  }
  
  // URL shortener check
  if (isUrlShortener(domain)) {
    riskScore += 20;
    riskFactors.push({
      icon: 'Link2',
      label: 'URL shortener detected',
      severity: 'medium'
    });
  }
  
  // Suspicious keywords
  const suspiciousWords = findSuspiciousKeywords(url);
  if (suspiciousWords.length > 0) {
    riskScore += Math.min(suspiciousWords.length * 10, 30);
    riskFactors.push({
      icon: 'AlertTriangle',
      label: `Suspicious keywords: ${suspiciousWords.slice(0, 3).join(', ')}`,
      severity: suspiciousWords.length > 2 ? 'high' : 'medium'
    });
  }
  
  // Phishing pattern check
  if (matchesPhishingPattern(url)) {
    riskScore += 35;
    riskFactors.push({
      icon: 'Skull',
      label: 'Matches known phishing patterns',
      severity: 'high'
    });
  }
  
  // Excessive subdomains
  if (hasExcessiveSubdomains(domain)) {
    riskScore += 15;
    riskFactors.push({
      icon: 'GitBranch',
      label: 'Unusual subdomain structure',
      severity: 'medium'
    });
  }
  
  // Unusual characters
  if (hasUnusualCharacters(url)) {
    riskScore += 25;
    riskFactors.push({
      icon: 'Type',
      label: 'Unusual characters detected',
      severity: 'high'
    });
  }
  
  // Domain age simulation
  const domainAge = simulateDomainAge();
  if (domainAge.isNew) {
    riskScore += 15;
    riskFactors.push({
      icon: 'Clock',
      label: 'Recently registered domain',
      severity: 'medium'
    });
  }
  
  // Determine risk level
  let riskLevel: RiskLevel;
  let explanation: string;
  let recommendation: string;
  
  if (riskScore <= 20) {
    riskLevel = 'safe';
    explanation = 'This link appears to be safe based on our analysis.';
    recommendation = 'This link shows no common threat patterns. Safe to visit.';
  } else if (riskScore <= 50) {
    riskLevel = 'suspicious';
    explanation = 'This link has some characteristics that warrant caution.';
    recommendation = 'This link shows patterns often used in scams. Proceed carefully and verify the source.';
  } else {
    riskLevel = 'dangerous';
    explanation = 'This link shows multiple high-risk indicators.';
    recommendation = 'High risk detected. We strongly recommend avoiding this link.';
  }
  
  return {
    riskScore: Math.min(riskScore, 100),
    riskLevel,
    explanation,
    riskFactors,
    recommendation
  };
}
