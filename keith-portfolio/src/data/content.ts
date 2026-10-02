import portrait from '../assets/portrait.jpg';
import leadership from '../assets/leadership.webp';
import systems from '../assets/systems.webp';
import signalMark from '../assets/signal-mark.webp';

export const images = { portrait, leadership, systems, signalMark };

export const profile = {
  name: 'Keith Rana',
  firstName: 'keith',
  role: 'IT Service Delivery Manager',
  location: 'Melbourne, Australia',
  email: 'keith_rana@yahoo.com',
  phone: '04 1668 7558',
  phoneHref: 'tel:+61416687558',
  tagline: 'an it service delivery manager keeping critical services steady while the work keeps moving',
};

export const aboutText =
  'A results-driven IT professional with over 16 years of experience across telecommunications, education, and managed services, including more than 8 years leading technical teams. I make technology service delivery visible, stable, and continually better. Let\'s make delivery more dependable.';

export const stats = [
  { value: '16+', label: 'Years in IT' },
  { value: '8+', label: 'Years leading' },
];

export const expertise = [
  { name: 'IT Service Delivery', description: 'End-to-end accountability for service delivery against agreed SLAs, with reporting to senior stakeholders.' },
  { name: 'Enterprise Infrastructure', description: 'Enterprise network, server and endpoint environments, including Fortinet, Zscaler and SCCM.' },
  { name: 'ITIL & Change Control', description: 'ITIL process, measured change and service reporting that improve compliance and service quality.' },
  { name: 'Incident & Escalation Leadership', description: 'Major incident management, workload prioritisation and escalations led with a calm, evidence-based approach.' },
  { name: 'Vendor & Stakeholder Management', description: 'Clear ownership of the vendor relationships that sit behind every service the business relies on.' },
  { name: 'Microsoft 365 & Intune', description: 'Hands-on depth in Microsoft 365, Azure and Intune across cloud applications and end-user devices.' },
  { name: 'Cybersecurity & Access', description: 'Security, identity and access practices built into daily operations, backed by Microsoft security certifications.' },
  { name: 'Team Development', description: 'Coaching, performance conversations, training and mentoring that grow capable, confident support teams.' },
];

export const roles = [
  {
    dates: 'Oct 2023 — Present',
    role: 'IT Service Delivery Manager',
    organisation: 'AFL Telecommunications',
    summary: 'Leading the daily delivery of business-critical IT services, balancing prompt resolution, availability, security, and a dependable experience for end users.',
    points: [
      'Own service operations across cloud applications, Windows and Linux environments, desktops, virtual apps, networks, and end-user support.',
      'Lead a support and service-desk team through coaching, performance conversations, workload prioritisation, and escalations.',
      'Use incident patterns, service-performance reporting, change controls, and feedback loops to improve ITIL compliance and service quality.',
    ],
  },
  {
    dates: 'Dec 2021 — Sep 2023',
    role: 'Information Technology Manager',
    organisation: 'Suzanne Cory High School',
    summary: 'Managed technology services, documentation, knowledge systems, infrastructure capacity, and Microsoft 365 operations in a fast-moving education environment.',
    points: [
      'Oversaw Microsoft 365 services, endpoint operations, security, quality, and the administration and maintenance of core IT infrastructure.',
      'Led a skilled IT specialist team with a focus on strategic direction, mentoring, service effectiveness, and superior customer outcomes.',
      'Coordinated systems migrations, upgrades, and deployments to defined scope and schedule constraints.',
    ],
  },
  {
    dates: 'May 2018 — Nov 2021',
    role: 'IT Support Specialist — Team Lead',
    organisation: 'Wesley College Melbourne',
    summary: 'Directed a six-person IT support team and helped translate organisational priorities into reliable, well-documented technical service.',
    points: [
      'Established project scope, supported IT initiatives, and aligned delivery activity with strategic objectives.',
      'Worked across Casper Management, AirWatch MDM, Microsoft Intune, and operational processes informed by ITIL principles.',
      'Identified skills gaps, organised training, coordinated with project managers, and maintained clear project documentation.',
    ],
  },
];

export const foundations = [
  { role: 'IT Support Officer', organisation: 'Mentone Grammar School', dates: 'Apr 2017 — Dec 2017' },
  { role: 'IT Project Manager', organisation: 'Archirayan Infotech', dates: 'Aug 2015 — Jul 2016' },
  { role: 'IT Technical Support', organisation: 'Has Tech Solutions', dates: 'Aug 2014 — Jul 2015' },
  { role: 'IT Technical Engineer', organisation: 'Hindustan Cyber Services', dates: 'Oct 2012 — Aug 2014' },
  { role: 'Assistant Systems Analyst', organisation: 'Prutha Technologies', dates: 'Oct 2009 — Sep 2010' },
];

export const projects = [
  {
    category: 'Network',
    name: 'Network project',
    body: 'Fortinet Firewall upgrade, Fortinet 48P Switches upgrade, Fortinet access point uplift, and network topology upgrade.',
    delivered: ['Fortinet firewall upgrade', 'Fortinet 48P switches upgrade', 'Fortinet access point uplift', 'Network topology upgrade'],
    images: [systems, leadership] as [string, string],
    position: ['center', 'center'] as [string, string],
  },
  {
    category: 'Infrastructure',
    name: 'Server upgrade',
    body: 'Upgraded the server with existing VMs and services, migrated data, and configured updated network settings.',
    delivered: ['Server upgraded with existing VMs and services', 'Data migrated', 'Updated network settings configured'],
    images: [leadership, systems] as [string, string],
    position: ['70% 40%', '20% 60%'] as [string, string],
  },
  {
    category: 'Endpoint',
    name: 'SCCM implementation',
    body: 'Installed and configured SCCM, prepared the required settings, and established the task-sequence process.',
    delivered: ['SCCM installed and configured', 'Required settings prepared', 'Task-sequence process established'],
    images: [systems, leadership] as [string, string],
    position: ['80% 20%', '30% 70%'] as [string, string],
  },
  {
    category: 'Voice',
    name: 'Microsoft Teams calling',
    body: 'Delivered number-porting support, call-flow and dial-plan design, user training, documentation, and adoption monitoring.',
    delivered: ['Number-porting support', 'Call-flow and dial-plan design', 'User training and documentation', 'Adoption monitoring'],
    images: [leadership, systems] as [string, string],
    position: ['50% 80%', '60% 30%'] as [string, string],
  },
];

export const certifications = [
  'Introduction to Cyber Security',
  'Windows Client',
  'Microsoft Teams Voice Engineer',
  'M365 Teams Administrator Associate',
  'Microsoft Azure Administrator Associate',
  'Microsoft Azure Security Engineer Associate',
  'M365 Security Administrator Associate',
  'Microsoft Information Protection Administrator Associate',
  'Project Management Essentials Certified',
  'Cloud Computing',
];

export const education = { degree: 'Bachelor of Information Technology', school: 'Federation University', year: '2009' };
