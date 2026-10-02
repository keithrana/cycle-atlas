import { embedded } from './embedded';

const A = (url: string) => embedded[url] ?? url;

const FIGMA = 'https://shrug-person-78902957.figma.site/_components/v2';
const ABOUT = `${FIGMA}/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7`;

export const portrait = A(`${FIGMA}/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png`);

export const aboutIcons = {
  moon: A(`${ABOUT}/moon_icon.11395d36.png`),
  object: A(`${ABOUT}/p59_1.4659672e.png`),
  lego: A(`${ABOUT}/lego_icon-1.703bb594.png`),
  group: A(`${ABOUT}/Group_134-1.2e04f3ce.png`),
};

export const aboutText =
  "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";

export const marqueeImages = [
  'hero-space-voyage-preview-eECLH3Yc',
  'hero-codenest-preview-Cgppc2qV',
  'hero-vex-ventures-preview-BczMFIiw',
  'hero-stellar-ai-v2-preview-DjvxjG3C',
  'hero-asme-preview-B_nGDnTP',
  'hero-transform-data-preview-Cx5OU29N',
  'hero-vitara-preview-Cjz2QYyU',
  'hero-terra-preview-BFjrCr7T',
  'hero-skyelite-preview-DHaZIgUv',
  'hero-aethera-preview-DknSlcTa',
  'hero-designpro-preview-D8c5_een',
  'hero-stellar-ai-preview-D3HL6bw1',
  'hero-xportfolio-preview-D4A8maiC',
  'hero-orbit-web3-preview-BXt4OttD',
  'hero-nexora-preview-cx5HmUgo',
  'hero-evr-ventures-preview-DZxeVFEX',
  'hero-planet-orbit-preview-DWAP8Z1P',
  'hero-new-era-preview-CocuDUm9',
  'hero-wealth-preview-B70idl_u',
  'hero-luminex-preview-CxOP7ce6',
  'hero-celestia-preview-0yO3jXO8',
].map((n) => A(`https://motionsites.ai/assets/${n}.gif`));

export const services = [
  { name: '3D Modeling', description: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.' },
  { name: 'Rendering', description: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.' },
  { name: 'Motion Design', description: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.' },
  { name: 'Branding', description: 'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.' },
  { name: 'Web Design', description: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.' },
];

const cf = (file: string) =>
  A(`https://images.higgs.ai/?default=1&output=webp&url=${encodeURIComponent(
    `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/${file}`
  )}&w=1280&q=85`);

export const projects = [
  {
    category: 'Client',
    name: 'Nextlevel Studio',
    col1: [cf('hf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png'), cf('hf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png')],
    col2: cf('hf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png'),
  },
  {
    category: 'Personal',
    name: 'Aura Brand Identity',
    col1: [cf('hf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png'), cf('hf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png')],
    col2: cf('hf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png'),
  },
  {
    category: 'Client',
    name: 'Solaris Digital',
    col1: [cf('hf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png'), cf('hf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png')],
    col2: cf('hf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png'),
  },
];
