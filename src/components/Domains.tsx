import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Sparkles, BarChart3, ShieldAlert, Cloud, Cpu, 
  Globe, Smartphone, Boxes, CreditCard, Activity, 
  GraduationCap, Leaf, Sprout, Heart, Flame, Eye, GitBranch,
  ChevronRight, Zap, X, Lightbulb, Code2, Target, Award, ArrowRight, CheckCircle2
} from 'lucide-react';

/* ─────────── Domain types & data ─────────── */
type DomainSize = 'hero' | 'wide' | 'tall' | 'normal';

interface DomainDetails {
  overview: string;
  problemStatements: string[];
  suggestedStack: string[];
  deliverables: string[];
  impactScore: string;
  mentorSupport: string;
}

interface DomainItem {
  id: string;
  name: string;
  category: string;
  icon: typeof Brain;
  desc: string;
  accent: string;
  accentDark: string;
  bgImage: string;
  size: DomainSize;
  isSpecial?: boolean;
  details: DomainDetails;
}

const DOMAINS: DomainItem[] = [
  { 
    id: 'ai-ml',
    name: 'Artificial Intelligence & Machine Learning', 
    category: 'Core Tech',
    icon: Brain, 
    desc: 'Harness machine learning algorithms and neural networks to create intelligent, predictive solutions.', 
    size: 'hero',
    accent: '#F97316', 
    accentDark: '#EA580C',
    bgImage: '/ai_bg.png',
    details: {
      overview: 'Develop cutting-edge predictive systems, computer vision models, or autonomous decision engines that solve real-world industrial or societal bottlenecks.',
      problemStatements: [
        'Real-time edge AI for low-latency anomaly detection in industrial automation.',
        'Predictive healthcare analytics using multi-modal patient telemetry data.',
        'Autonomous vision-based navigation systems for unstructured environments.'
      ],
      suggestedStack: ['PyTorch', 'TensorFlow', 'OpenCV', 'Scikit-Learn', 'FastAPI', 'ONNX Runtime'],
      deliverables: ['Trained ML Model / Pipeline', 'Functional API & Interactive UI', 'Accuracy & Performance Benchmark Report'],
      impactScore: 'High Industrial Relevance',
      mentorSupport: 'Dedicated AI/ML Researchers & Industry Engineers'
    }
  },
  { 
    id: 'gen-ai',
    name: 'Generative AI & LLMs', 
    category: 'Core Tech',
    icon: Sparkles, 
    desc: 'Explore the frontiers of transformers, retrieval-augmented generation, and creative artificial agents.', 
    size: 'normal',
    accent: '#3B82F6', 
    accentDark: '#1D4ED8',
    bgImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Build custom RAG pipelines, multi-agent frameworks, fine-tuned domain LLMs, or generative audio/video synthesis engines.',
      problemStatements: [
        'Enterprise RAG system with zero hallucination guarantee and automated verification.',
        'Autonomous multi-agent workflow system for code generation and refactoring.',
        'Localized multilingual voice-to-voice AI assistant for rural accessibility.'
      ],
      suggestedStack: ['LangChain', 'LlamaIndex', 'Hugging Face', 'Ollama', 'Pinecone', 'Next.js'],
      deliverables: ['Working Agentic / RAG Application', 'Custom Prompt & Evaluation Benchmark', 'User Demo Interface'],
      impactScore: 'Transformative Frontier Tech',
      mentorSupport: 'LLM Architects & Prompt Engineering Experts'
    }
  },
  { 
    id: 'data-science',
    name: 'Data Science & Analytics', 
    category: 'Core Tech',
    icon: BarChart3, 
    desc: 'Transform raw datasets into actionable insights and data-driven intelligence.', 
    size: 'normal',
    accent: '#06B6D4', 
    accentDark: '#0E7490',
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Process massive streams of unstructured data to generate real-time business, financial, or urban intelligence dashboards.',
      problemStatements: [
        'Urban traffic congestion forecasting & dynamic signal timing optimization.',
        'E-commerce customer lifetime value & churn prediction engine.',
        'Automated financial fraud pattern identification in micro-transaction streams.'
      ],
      suggestedStack: ['Apache Spark', 'Pandas', 'DuckDB', 'Streamlit', 'Plotly', 'PostgreSQL'],
      deliverables: ['Data Pipeline & ETL Workflow', 'Interactive BI Dashboard', 'Statistical Model Insights'],
      impactScore: 'Direct Business Value',
      mentorSupport: 'Senior Data Scientists & Analytics Leads'
    }
  },
  { 
    id: 'cyber-security',
    name: 'Cyber Security & Digital Forensics', 
    category: 'Core Tech',
    icon: ShieldAlert, 
    desc: 'Fortify digital infrastructure, conduct forensic investigations, and detect threat vectors.', 
    size: 'wide',
    accent: '#EF4444', 
    accentDark: '#B91C1C',
    bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Protect software ecosystems against modern attack vectors, build zero-trust security tools, or automate threat hunting.',
      problemStatements: [
        'AI-powered Security Information and Event Management (SIEM) log analyzer.',
        'Zero-trust API gateway with behavioral rate-limiting & anomaly blocking.',
        'Automated smart contract vulnerability scanner for Web3 protocols.'
      ],
      suggestedStack: ['Python', 'Rust', 'Wireshark API', 'Suricata', 'Docker', 'Kubernetes'],
      deliverables: ['Security Tool / Defense Engine', 'Vulnerability Assessment Report', 'Live Attack-Defense Demo'],
      impactScore: 'Critical Infrastructure Security',
      mentorSupport: 'Certified Ethical Hackers & Red Team Specialists'
    }
  },
  { 
    id: 'cloud-devops',
    name: 'Cloud Computing & DevOps', 
    category: 'Core Tech',
    icon: Cloud, 
    desc: 'Deploy resilient scale infrastructures with continuous integration and cloud native tools.', 
    size: 'normal',
    accent: '#3B82F6', 
    accentDark: '#1D4ED8',
    bgImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Engineer self-healing multi-cloud deployments, automated Infrastructure-as-Code pipelines, and microservice orchestrators.',
      problemStatements: [
        'GitOps-driven multi-region Kubernetes failover manager.',
        'Serverless cost optimization and dynamic resource autoscaling platform.',
        'Chaos engineering automation suite for microservices resilience.'
      ],
      suggestedStack: ['Terraform', 'Kubernetes', 'AWS/GCP', 'GitHub Actions', 'Prometheus', 'Grafana'],
      deliverables: ['Infrastructure as Code Scripts', 'CI/CD Pipeline Architecture', 'Monitoring & Autoscaling Demo'],
      impactScore: 'High Operational Efficiency',
      mentorSupport: 'DevOps Leads & Cloud Architects'
    }
  },
  { 
    id: 'iot-smart',
    name: 'IoT & Smart Systems', 
    category: 'Core Tech',
    icon: Cpu, 
    desc: 'Connect physical devices and build smart sensor arrays for edge computing pipelines.', 
    size: 'normal',
    accent: '#F59E0B', 
    accentDark: '#D97706',
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Merge hardware microcontrollers with cloud analytics to build intelligent smart home, industrial, or environmental sensors.',
      problemStatements: [
        'Smart energy grid meter with real-time power theft detection.',
        'Industrial predictive maintenance sensor node using edge TinyML.',
        'Air quality monitoring network with automated pollution hotspot mapping.'
      ],
      suggestedStack: ['ESP32/Raspberry Pi', 'MQTT', 'Node-RED', 'InfluxDB', 'C++', 'Python'],
      deliverables: ['Hardware Prototype / Simulation', 'Telemetry Cloud Dashboard', 'Edge Code & Schematic'],
      impactScore: 'Hardware & IoT Innovation',
      mentorSupport: 'Embedded Systems & IoT Engineers'
    }
  },
  { 
    id: 'full-stack',
    name: 'Full Stack & Web Dev', 
    category: 'Dev & Web3',
    icon: Globe, 
    desc: 'Create highly responsive, performant, and premium interactive web applications.', 
    size: 'tall',
    accent: '#06B6D4', 
    accentDark: '#0E7490',
    bgImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Build consumer or enterprise web platforms featuring fluid animations, high performance, real-time collaboration, and flawless UX.',
      problemStatements: [
        'Real-time collaborative canvas for engineering design & code reviews.',
        'High-concurrency event ticketing platform with zero scalping guarantees.',
        'Accessible, offline-first Web App for remote community management.'
      ],
      suggestedStack: ['React / Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'WebSockets', 'Prisma'],
      deliverables: ['Deployed Web Application', 'Responsive UI & API Suite', 'Source Code & Documentation'],
      impactScore: 'High User Adoption Potential',
      mentorSupport: 'Senior Full Stack Engineers & UX Designers'
    }
  },
  { 
    id: 'mobile-dev',
    name: 'Mobile App Development', 
    category: 'Dev & Web3',
    icon: Smartphone, 
    desc: 'Craft native or cross-platform mobile experiences that delight end-users.', 
    size: 'normal',
    accent: '#10B981', 
    accentDark: '#047857',
    bgImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Develop intuitive mobile applications leveraging native device APIs like camera, GPS, bluetooth, and haptics for seamless mobility.',
      problemStatements: [
        'Hyper-local emergency contact & offline mesh messaging mobile app.',
        'AI-driven personal fitness scanner and posture correction assistant.',
        'Smart public transit route planner with live crowdsourced tracking.'
      ],
      suggestedStack: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'SQLite'],
      deliverables: ['Installable APK / TestFlight Build', 'App Demo Video', 'Clean UI Architecture'],
      impactScore: 'Mobile-First Global Reach',
      mentorSupport: 'Mobile App Architects & Product Designers'
    }
  },
  { 
    id: 'blockchain-web3',
    name: 'Blockchain & Web3', 
    category: 'Dev & Web3',
    icon: Boxes, 
    desc: 'Implement trustless protocols, smart contracts, and decentralized finance (DeFi).', 
    size: 'wide',
    accent: '#8B5CF6', 
    accentDark: '#6D28D9',
    bgImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Revolutionize trust and ownership using decentralized ledgers, zero-knowledge proofs, automated market makers, or decentralized identity.',
      problemStatements: [
        'Decentralized credential & degree verification protocol on Ethereum/Polygon.',
        'Zero-Knowledge proof (zk-SNARKs) based private voting system.',
        'Cross-chain automated liquidity aggregator for decentralized finance.'
      ],
      suggestedStack: ['Solidity', 'Ethers.js / Viem', 'Hardhat / Foundry', 'IPFS', 'Polygon / Ethereum'],
      deliverables: ['Deployed Smart Contracts', 'Decentralized Frontend (dApp)', 'Contract Test Suite & Audit Notes'],
      impactScore: 'Decentralized Future Tech',
      mentorSupport: 'Web3 Core Developers & Smart Contract Auditors'
    }
  },
  { 
    id: 'fintech',
    name: 'FinTech', 
    category: 'Dev & Web3',
    icon: CreditCard, 
    desc: 'Revolutionize digital payments, micro-lending systems, and financial accessibility.', 
    size: 'normal',
    accent: '#EC4899', 
    accentDark: '#BE185D',
    bgImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Design financial solutions that democratize credit, automate budgeting, provide fraud detection, or streamline micro-payments.',
      problemStatements: [
        'AI credit scoring system for unbanked gig economy workers.',
        'Automated micro-investment app with spare change rounding & goal tracking.',
        'Cross-border instant low-fee peer-to-peer remittance gateway.'
      ],
      suggestedStack: ['Node.js', 'Plaid API', 'Stripe', 'PostgreSQL', 'React', 'Tailwind CSS'],
      deliverables: ['FinTech Application Prototype', 'Security & Compliance Blueprint', 'Working Payment Flow Demo'],
      impactScore: 'High Financial Inclusion Impact',
      mentorSupport: 'FinTech Founders & Payment Gateway Engineers'
    }
  },
  { 
    id: 'healthtech',
    name: 'HealthTech & MedTech', 
    category: 'Applied Tech',
    icon: Activity, 
    desc: 'Design medical tools, telehealth solutions, and AI diagnostics to save lives.', 
    size: 'normal',
    accent: '#EF4444', 
    accentDark: '#B91C1C',
    bgImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Develop life-saving healthcare software, early diagnostic tools, remote patient monitoring platforms, or mental health companions.',
      problemStatements: [
        'Computer vision tool for early skin lesion / X-ray abnormality detection.',
        'Telehealth video consultation platform with automated medical prescription notes.',
        'Smart pill dispenser monitor with caregiver alert notifications.'
      ],
      suggestedStack: ['Python', 'TensorFlow Medical', 'React', 'WebRTC', 'FastAPI'],
      deliverables: ['Diagnostic / Telehealth Prototype', 'HIPAA Privacy Compliance Overview', 'Demo Application'],
      impactScore: 'Direct Life-Saving Social Impact',
      mentorSupport: 'Medical Tech Advisors & Healthcare Innovators'
    }
  },
  { 
    id: 'edtech',
    name: 'EdTech & Digital Learning', 
    category: 'Applied Tech',
    icon: GraduationCap, 
    desc: 'Build future classroom systems, personalized learning paths, and accessible classrooms.', 
    size: 'hero',
    accent: '#3B82F6', 
    accentDark: '#1D4ED8',
    bgImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Gamify education, build AI tutors, create immersive learning experiences, or increase educational access for underprivileged students.',
      problemStatements: [
        'Personalized AI tutor that adapts content difficulty based on student comprehension.',
        'Interactive 3D science laboratory simulation for remote schools.',
        'Peer-to-peer micro-tutoring marketplace with gamified rewards.'
      ],
      suggestedStack: ['Three.js', 'React', 'Node.js', 'OpenAI API', 'Tailwind CSS'],
      deliverables: ['Educational Platform Demo', 'Curriculum Adaptation Logic', 'User Engagement Analytics'],
      impactScore: 'High Educational Empowerment',
      mentorSupport: 'EdTech Product Managers & Pedagogy Specialists'
    }
  },
  { 
    id: 'smart-agri',
    name: 'Smart Agriculture', 
    category: 'Applied Tech',
    icon: Sprout, 
    desc: 'Pioneer high-yield precision farming, crop monitoring, and sustainable supply chains.', 
    size: 'normal',
    accent: '#10B981', 
    accentDark: '#047857',
    bgImage: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Empower farmers with satellite imagery crop health analysis, soil moisture IoT sensors, or fair-price direct-to-consumer marketplaces.',
      problemStatements: [
        'AI crop disease scanner using smartphone camera photos.',
        'Soil moisture & weather automated drip irrigation controller.',
        'Transparent farm-to-fork supply chain tracker for organic produce.'
      ],
      suggestedStack: ['Flutter', 'Python OpenCV', 'TensorFlow Lite', 'Firebase', 'OpenWeather API'],
      deliverables: ['Farmer Mobile App / Dashboard', 'Crop Model Accuracy Demo', 'Supply Chain Workflow'],
      impactScore: 'Agricultural & Economic Support',
      mentorSupport: 'AgriTech Researchers & Sustainability Leads'
    }
  },
  { 
    id: 'sustainability',
    name: 'Sustainability & Smart Cities', 
    category: 'Impact & Future',
    icon: Leaf, 
    desc: 'Formulate green systems, energy-grid management, and clean urban solutions.', 
    size: 'normal',
    accent: '#10B981', 
    accentDark: '#047857',
    bgImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Tackle carbon emissions, optimize municipal waste collection, build smart EV charging networks, or track urban energy footprints.',
      problemStatements: [
        'Smart municipal waste bin fill-level radar & truck route optimizer.',
        'Peer-to-peer solar energy trading marketplace for residential micro-grids.',
        'Personal carbon footprint calculator with gamified reduction challenges.'
      ],
      suggestedStack: ['React', 'Leaflet / Mapbox', 'Node.js', 'Python', 'PostGIS'],
      deliverables: ['Smart City Analytics Dashboard', 'Optimization Routing Engine', 'Impact Presentation'],
      impactScore: 'High Environmental Impact',
      mentorSupport: 'Smart City Consultants & GreenTech Innovators'
    }
  },
  { 
    id: 'women-safety',
    name: 'Women Safety & Social Impact', 
    category: 'Impact & Future',
    icon: Heart, 
    desc: 'Develop high-security tools, alert utilities, and community programs for positive social change.', 
    size: 'normal',
    accent: '#EC4899', 
    accentDark: '#BE185D',
    bgImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Craft discreet safety alert mobile utilities, safe-route navigators, community panic triggers, or social aid networks.',
      problemStatements: [
        'Discreet gesture/voice-activated emergency SOS trigger app.',
        'Crowdsourced safe urban nighttime navigation & lighting map.',
        'Anonymous legal & psychological support portal for survivors.'
      ],
      suggestedStack: ['React Native', 'Twilio API', 'Google Maps SDK', 'Node.js', 'Encrypted DB'],
      deliverables: ['Mobile Emergency App', 'Real-Time Alert Dispatch Server', 'Safety Route Engine'],
      impactScore: 'Profound Social Welfare Impact',
      mentorSupport: 'Social Impact Leaders & Safety Advocates'
    }
  },
  { 
    id: 'disaster-mgmt',
    name: 'Disaster Management', 
    category: 'Impact & Future',
    icon: Flame, 
    desc: 'Build prediction radars, emergency management routing, and resilient disaster support tools.', 
    size: 'wide',
    accent: '#F97316', 
    accentDark: '#EA580C',
    bgImage: '/disaster_bg.png',
    details: {
      overview: 'Engineer early-warning natural disaster systems, relief supply dispatch trackers, or offline emergency communications during crises.',
      problemStatements: [
        'Flood & wildfire early warning radar using satellite imagery AI.',
        'Crowdsourced crisis victim rescue request & relief resource allocation map.',
        'Mesh-network offline communication utility for emergency responders.'
      ],
      suggestedStack: ['Python Geospatial', 'React / Mapbox GL', 'WebSockets', 'Go', 'Twilio'],
      deliverables: ['Crisis Command Dashboard', 'Early Warning Model Demo', 'Rescue Allocation Logic'],
      impactScore: 'Critical Life-Saving Emergency Tech',
      mentorSupport: 'Disaster Response Engineers & GIS Experts'
    }
  },
  { 
    id: 'accessibility',
    name: 'Accessibility & Inclusive Tech', 
    category: 'Impact & Future',
    icon: Eye, 
    desc: 'Create assistive technology interfaces, text-to-speech visual descriptors, and inclusive UX formats.', 
    size: 'normal',
    accent: '#8B5CF6', 
    accentDark: '#6D28D9',
    bgImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    details: {
      overview: 'Remove digital barriers for visually impaired, hearing impaired, or neurodivergent users through adaptive UX tools and assistive devices.',
      problemStatements: [
        'Real-time sign language interpreter using web camera computer vision.',
        'Audio navigation assistant for visually impaired indoor wayfinding.',
        'Screen-reader optimized web accessibility toolbar & auto-remediator.'
      ],
      suggestedStack: ['MediaPipe', 'Web Speech API', 'React', 'TensorFlow.js', 'Tailwind CSS'],
      deliverables: ['Assistive App / Extension', 'Accessibility Compliance Test Report', 'User Demo'],
      impactScore: 'High Inclusivity & Universal Design',
      mentorSupport: 'Accessibility Advocates & Universal UX Designers'
    }
  },
  { 
    id: 'open-innovation',
    name: 'Open Source & Open Innovation', 
    category: 'Dev & Web3',
    icon: GitBranch, 
    desc: 'Have a wild idea that fits nowhere else? Build open solutions and invent completely new models outside traditional boundaries.', 
    size: 'wide',
    isSpecial: true,
    accent: '#F59E0B', 
    accentDark: '#EF4444',
    bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    details: {
      overview: 'The wildcard track for visionaries. If your project breaks existing categories or builds open-source developer tooling, this is your arena.',
      problemStatements: [
        'Next-generation developer tool, CLI, or open-source library.',
        'Novel human-computer interaction (HCI) software model.',
        'Unconventional fusion of AI, hardware, or decentralized protocols.'
      ],
      suggestedStack: ['Any Stack of Choice', 'Open Source Tooling', 'Rust', 'TypeScript', 'Python'],
      deliverables: ['Open Source Code Repository', 'Live Demo Application', 'Comprehensive README & Documentation'],
      impactScore: 'Unlimited Creative Freedom',
      mentorSupport: 'Senior Open Source Maintainers & Hackathon Judges'
    }
  },
];

const CATEGORIES = ['All', 'Core Tech', 'Dev & Web3', 'Applied Tech', 'Impact & Future'];
const CATEGORY_COLORS: Record<string, string> = {
  'Core Tech': '#F97316',
  'Dev & Web3': '#8B5CF6',
  'Applied Tech': '#10B981',
  'Impact & Future': '#EC4899',
};

/* ─────────── Helper Functions ─────────── */
function getColSpanClass(size: DomainSize) {
  switch (size) {
    case 'hero': return 'md:col-span-2 md:row-span-2';
    case 'wide': return 'md:col-span-2';
    case 'tall': return 'md:row-span-2';
    case 'normal': return '';
  }
}

function getMinHeight(size: DomainSize) {
  switch (size) {
    case 'hero': return '360px';
    case 'wide': return '210px';
    case 'tall': return '360px';
    case 'normal': return '210px';
  }
}

/* ─────────── 3D Tilt Card ─────────── */
function TiltCard({ children, className, style, onMouseEnter, onMouseLeave, onClick }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeaveInternal = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    onMouseLeave?.();
  }, [onMouseLeave]);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        transition: 'transform 0.45s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.4s ease, border-color 0.3s ease',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleMouseLeaveInternal}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/* ─────────── Individual Tile ─────────── */
function DomainTile({ domain, index, onSelect }: { domain: DomainItem; index: number; onSelect: (d: DomainItem) => void }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);
  const Icon = domain.icon;
  const isLarge = domain.size === 'hero' || domain.size === 'tall';
  const isWide = domain.size === 'wide' || domain.size === 'hero';
  const isSpecial = domain.isSpecial;

  useEffect(() => {
    const el = tileRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05, rootMargin: '50px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={tileRef}
      className={`${getColSpanClass(domain.size)}`}
      style={{ minHeight: getMinHeight(domain.size) }}
    >
      <TiltCard
        className="group relative rounded-2xl overflow-hidden cursor-pointer w-full h-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(30px)',
          filter: visible ? 'blur(0px)' : 'blur(5px)',
          transition: `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${index * 60}ms, 
                       transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${index * 60}ms, 
                       filter 0.5s ease ${index * 60}ms`,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onSelect(domain)}
      >
        {/* ── Background image ── */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${domain.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: hovered ? 0.85 : 0.6,
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            filter: `saturate(${hovered ? 1.2 : 0.95}) brightness(${hovered ? 0.95 : 0.75})`,
            transition: 'opacity 0.7s ease, transform 2.5s ease, filter 0.7s ease',
          }}
        />

        {/* ── Dark gradient overlay ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(180deg, 
            rgba(2,8,23,0.15) 0%, 
            rgba(2,8,23,0.45) 40%, 
            rgba(2,8,23,0.88) 100%)`,
        }} />

        {/* ── Accent gradient ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(135deg, ${domain.accent}08 0%, transparent 50%)`,
        }} />

        {/* ── Hover glow ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(ellipse at 30% 20%, ${domain.accent}15, transparent 70%)`,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* ── Border ── */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: isSpecial
              ? `1.5px solid ${hovered ? 'rgba(245,158,11,0.6)' : 'rgba(245,158,11,0.25)'}`
              : `1px solid ${hovered ? `${domain.accent}50` : 'rgba(255,255,255,0.07)'}`,
            boxShadow: hovered
              ? isSpecial
                ? '0 25px 60px rgba(245,158,11,0.2), inset 0 1px 0 rgba(245,158,11,0.15)'
                : `0 25px 60px ${domain.accent}12, inset 0 1px 0 rgba(255,255,255,0.06)`
              : 'inset 0 1px 0 rgba(255,255,255,0.04)',
            transition: 'all 0.3s ease',
          }}
        />

        {/* ── Top accent line ── */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: isSpecial
              ? 'linear-gradient(90deg, transparent, #F59E0B, #EF4444, transparent)'
              : `linear-gradient(90deg, transparent 10%, ${domain.accent} 50%, transparent 90%)`,
            opacity: hovered ? 1 : 0.2,
            transform: `scaleX(${hovered ? 1 : 0.3})`,
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        />

        {/* ── Content ── */}
        <div className="relative z-10 h-full flex flex-col justify-end p-5 md:p-6">
          {/* Special badge */}
          {isSpecial && (
            <div className="absolute top-4 right-4 z-20">
              <div
                className="flex items-center gap-1.5 text-black text-[10px] font-black font-mono px-3 py-1.5 rounded-full uppercase tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                  boxShadow: '0 0 20px rgba(245,158,11,0.4), 0 4px 12px rgba(239,68,68,0.3)',
                  animation: 'badgePulse 2.5s ease-in-out infinite',
                }}
              >
                <Zap className="w-3 h-3" />
                OPEN TRACK
              </div>
            </div>
          )}

          {/* Category pill */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-auto w-fit"
            style={{
              background: `${CATEGORY_COLORS[domain.category] || domain.accent}12`,
              border: `1px solid ${CATEGORY_COLORS[domain.category] || domain.accent}30`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: CATEGORY_COLORS[domain.category] || domain.accent,
                boxShadow: `0 0 6px ${CATEGORY_COLORS[domain.category] || domain.accent}`,
              }}
            />
            <span
              className="text-[10px] font-mono font-bold tracking-wider uppercase"
              style={{ color: CATEGORY_COLORS[domain.category] || domain.accent }}
            >
              {domain.category}
            </span>
          </div>

          {/* Bottom content */}
          <div className="mt-auto">
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{
                background: `linear-gradient(135deg, ${domain.accent}20, ${domain.accentDark}12)`,
                border: `1px solid ${hovered ? `${domain.accent}50` : `${domain.accent}20`}`,
                boxShadow: hovered ? `0 0 25px ${domain.accent}20, inset 0 0 15px ${domain.accent}08` : 'none',
                transform: hovered ? 'scale(1.1) rotate(3deg)' : 'scale(1) rotate(0deg)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Icon
                className="w-6 h-6"
                style={{
                  color: domain.accent,
                  filter: hovered ? `drop-shadow(0 0 8px ${domain.accent})` : 'none',
                  transition: 'filter 0.3s ease',
                }}
              />
            </div>

            {/* Title */}
            <h3
              className="font-black text-white leading-tight mb-1"
              style={{
                fontSize: isLarge ? '1.3rem' : isWide ? '1.15rem' : '1rem',
                textShadow: hovered ? `0 0 30px ${domain.accent}25` : 'none',
                transition: 'text-shadow 0.3s ease',
              }}
            >
              {domain.name}
            </h3>

            {/* Description */}
            <p
              className="text-slate-400 leading-relaxed overflow-hidden"
              style={{
                fontSize: '0.8rem',
                maxHeight: (isLarge || isWide) ? '80px' : hovered ? '80px' : '0px',
                opacity: (isLarge || isWide) ? 1 : hovered ? 1 : 0,
                marginTop: (isLarge || isWide) ? '4px' : hovered ? '4px' : '0px',
                transition: 'max-height 0.5s ease, opacity 0.4s ease, margin-top 0.4s ease',
              }}
            >
              {domain.desc}
            </p>

            {/* Explore button */}
            <div
              className="flex items-center gap-1.5 mt-3 pt-1"
              style={{
                opacity: hovered ? 1 : 0.8,
                transform: hovered ? 'translateX(0)' : 'translateX(-4px)',
                transition: 'all 0.3s ease',
              }}
            >
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md" 
                style={{ 
                  background: `${domain.accent}15`, 
                  color: domain.accent,
                  border: `1px solid ${domain.accent}30` 
                }}
              >
                Explore Details
              </span>
              <ChevronRight
                className="w-4 h-4"
                style={{
                  color: domain.accent,
                  animation: hovered ? 'nudgeRight 1s ease-in-out infinite' : 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] z-20"
          style={{
            width: hovered ? '100%' : '0%',
            background: `linear-gradient(90deg, ${domain.accent}, ${domain.accentDark})`,
            boxShadow: `0 0 12px ${domain.accent}50`,
            transition: 'width 0.7s ease-out',
          }}
        />
      </TiltCard>
    </div>
  );
}

/* ─────────── Domain Detail Modal Component ─────────── */
function DomainModal({ domain, onClose }: { domain: DomainItem; onClose: () => void }) {
  const navigate = useNavigate();
  const Icon = domain.icon;
  const details = domain.details;

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-4xl bg-[#080C18] border rounded-3xl overflow-hidden shadow-2xl z-10 my-8 max-h-[90vh] flex flex-col animate-scaleUp"
        style={{
          borderColor: `${domain.accent}44`,
          boxShadow: `0 25px 70px ${domain.accent}20, 0 0 40px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Header Banner */}
        <div className="relative p-6 md:p-8 overflow-hidden border-b border-slate-800"
          style={{
            background: `linear-gradient(135deg, ${domain.accent}15 0%, rgba(8,12,24,0.95) 100%)`,
          }}
        >
          {/* Header BG image */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `url(${domain.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'saturate(0.6)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080C18] to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header content */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border"
                style={{
                  background: `${domain.accent}20`,
                  borderColor: `${domain.accent}44`,
                  boxShadow: `0 0 25px ${domain.accent}30`,
                }}
              >
                <Icon className="w-7 h-7" style={{ color: domain.accent }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border"
                    style={{
                      background: `${domain.accent}15`,
                      color: domain.accent,
                      borderColor: `${domain.accent}33`,
                    }}
                  >
                    {domain.category}
                  </span>
                  {domain.isSpecial && (
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      ★ SPECIAL TRACK
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">{domain.name}</h2>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 custom-scrollbar">
          {/* Track Overview */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" style={{ color: domain.accent }} />
              Track Overview
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
              {details.overview}
            </p>
          </div>

          {/* Sample Problem Statements */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Sample Focus Problem Statements
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {details.problemStatements.map((statement, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold"
                    style={{ color: domain.accent }}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-sm text-slate-200 leading-snug">{statement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Tech Stack & Deliverables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tech Stack */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                Suggested Tech Stack & APIs
              </h4>
              <div className="flex flex-wrap gap-2">
                {details.suggestedStack.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs font-mono font-semibold text-cyan-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Deliverables */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Key Project Deliverables
              </h4>
              <ul className="space-y-2">
                {details.deliverables.map((deliv, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Track Specs Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">Impact Level</span>
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {details.impactScore}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">Mentorship & Guidance</span>
              <span className="text-sm font-bold text-slate-200">
                {details.mentorSupport}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-mono uppercase font-bold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Main Component ─────────── */
export default function Domains() {
  const headRef = useRef<HTMLDivElement>(null);
  const [headVisible, setHeadVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState<DomainItem | null>(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeadVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const filteredDomains = activeCategory === 'All'
    ? DOMAINS
    : DOMAINS.filter(d => d.category === activeCategory || d.isSpecial);

  return (
    <section id="domains" className="relative py-28 px-4 md:px-6">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 15% 20%, rgba(249,115,22,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 50%, rgba(139,92,246,0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 40% 80%, rgba(59,130,246,0.04) 0%, transparent 40%)
        `,
      }} />

      <div className="max-w-7xl mx-auto relative">
        {/* ── Header ── */}
        <div
          ref={headRef}
          className="text-center mb-20"
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(139,92,246,0.08) 100%)',
              border: '1px solid rgba(249,115,22,0.2)',
              boxShadow: '0 0 30px rgba(249,115,22,0.06)',
            }}
          >
            <div className="w-2 h-2 rounded-full bg-orange-500" style={{
              boxShadow: '0 0 8px rgba(249,115,22,0.6)',
              animation: 'badgePulse 2s ease-in-out infinite',
            }} />
            <span className="text-orange-400 text-xs font-mono tracking-[0.3em] uppercase font-bold">Choose Your Arena</span>
          </div>

          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-black mb-5 tracking-tight leading-none"
            style={{
              background: 'linear-gradient(135deg, #fff 10%, #FB923C 45%, #8B5CF6 65%, #fff 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Problem Domains
          </h2>

          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-500/40" />
            <div className="w-2 h-2 rotate-45 border border-orange-500/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-violet-500/40" />
          </div>

          <p className="text-slate-400 max-w-lg mx-auto font-mono text-sm leading-relaxed">
            Interactive tracks · Endless possibilities<br />
            <span className="text-slate-500">Click any domain or Explore Details to view problem statements & tech stack</span>
          </p>
        </div>

        {/* ── Category Filter Tabs ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-14">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const catColor = CATEGORY_COLORS[cat] || '#F97316';
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="relative px-5 py-2.5 rounded-full font-mono text-xs md:text-sm font-bold tracking-wider border uppercase overflow-hidden"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${catColor}18 0%, ${catColor}08 100%)`
                    : 'rgba(8,12,24,0.6)',
                  borderColor: isActive ? `${catColor}70` : 'rgba(255,255,255,0.06)',
                  boxShadow: isActive
                    ? `0 0 20px ${catColor}18, inset 0 0 12px ${catColor}08`
                    : 'none',
                  color: isActive ? '#FFF' : '#64748B',
                  transition: 'all 0.3s ease',
                }}
              >
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${catColor}12, transparent 70%)` }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{
                      background: catColor,
                      boxShadow: `0 0 6px ${catColor}`,
                    }} />
                  )}
                  {cat}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3" style={{ gridAutoFlow: 'dense' }}>
          {filteredDomains.map((d, idx) => (
            <DomainTile
              key={d.id}
              domain={d}
              index={idx}
              onSelect={(item) => setSelectedDomain(item)}
            />
          ))}
        </div>

        {/* ── Domain count footer ── */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full" style={{
            background: 'rgba(8,12,24,0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(8px)',
          }}>
            <div className="flex -space-x-1">
              {['#F97316', '#3B82F6', '#8B5CF6', '#10B981'].map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full border border-slate-900" style={{ background: c }} />
              ))}
            </div>
            <span className="text-slate-400 text-xs font-mono">
              <span className="text-white font-bold">{filteredDomains.length}</span> domains available · Click any tile to inspect
            </span>
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedDomain && (
        <DomainModal 
          domain={selectedDomain} 
          onClose={() => setSelectedDomain(null)} 
        />
      )}

      {/* ── Keyframes & Utilities ── */}
      <style>{`
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 8px rgba(249,115,22,0.3); }
          50% { box-shadow: 0 0 20px rgba(249,115,22,0.5), 0 0 40px rgba(249,115,22,0.15); }
        }
        @keyframes nudgeRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.94) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  );
}
