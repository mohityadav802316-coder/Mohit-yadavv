import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PortfolioImage,
  SiteSettings,
  ProjectItem,
  SkillItem,
  RoadmapMilestone
} from '../types';
import {
  db,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp
} from '../firebase';

export const defaultProjects: ProjectItem[] = [
  {
    id: 'pinchat',
    title: 'PinChat',
    titleHi: 'पिनचैट (PinChat)',
    subtitle: 'Social & Instant Chat Application Concept',
    subtitleHi: 'सोशल एवं रियल-टाइम चैट एप्लिकेशन अवधारणा',
    description: 'A modern, privacy-oriented social messaging and chat application concept designed for intuitive communication, channels, and responsive mobile-first messaging.',
    descriptionHi: 'एक आधुनिक सोशल मैसेजिंग और चैट ऐप अवधारणा, जिसे तेज और सुरक्षित संवाद और चैनल्स के लिए डिज़ाइन किया जा रहा है।',
    status: 'Active Development',
    statusHi: 'सक्रिय विकास',
    tags: ['Chat Architecture', 'WebSockets / Realtime', 'UI/UX', 'Mobile Responsive'],
    features: [
      'Real-time messaging channels',
      'Direct message pinning & focus modes',
      'Minimalist dark cyberpunk theme',
      'Mobile-first responsive interface',
    ],
    featuresHi: [
      'रियल-टाइम मैसेजिंग चैनल्स',
      'मैसेज पिनिंग और फोकस मोड्स',
      'मिनिमलिस्ट डार्क साइबरपंक थीम',
      'मोबाइल-फर्स्ट रिस्पॉन्सिव यूआई',
    ],
    targetOutcome: 'Full-featured real-time cross-platform chat platform.',
    targetOutcomeHi: 'पूर्ण रियल-टाइम क्रॉस-प्लेटफॉर्म चैट प्लेटफॉर्म।',
    isAvailable: false,
    accentColor: '#06b6d4',
  },
  {
    id: 'lifetracker',
    title: 'Life Tracker',
    titleHi: 'लाइफ ट्रैकर (Life Tracker)',
    subtitle: 'Productivity & Personal Habit Tracking System',
    subtitleHi: 'उत्पादकता एवं व्यक्तिगत आदत ट्रैकिंग सिस्टम',
    description: 'A comprehensive personal productivity, routine, habit, and daily metric tracker designed to optimize learning time, coding habits, and health goals.',
    descriptionHi: 'दैनिक दिनचर्या, पढ़ाई के घंटे, कोडिंग अभ्यास और व्यक्तिगत आदतों को ट्रैक करने वाला संपूर्ण उत्पादकता सिस्टम।',
    status: 'In Progress',
    statusHi: 'प्रगति पर है',
    tags: ['Productivity', 'Habit Logic', 'Local Storage', 'Analytics'],
    features: [
      'Daily routine and study habit tracking',
      'Visual progress and consistency streaks',
      'Offline-first data retention',
      'Target goal reminders and timers',
    ],
    featuresHi: [
      'दैनिक दिनचर्या एवं स्टडी हैबिट ट्रैकिंग',
      'विजुअल प्रोग्रेस और कंसिस्टेंसी स्ट्रीक्स',
      'ऑफलाइन-फर्स्ट डेटा स्टोरेज',
      'लक्ष्य निर्धारण और टाइमर्स',
    ],
    targetOutcome: 'Personal daily dashboard for continuous self-improvement.',
    targetOutcomeHi: 'निरंतर सुधार और प्रगति के लिए व्यक्तिगत डैशबोर्ड।',
    isAvailable: false,
    accentColor: '#10b981',
  },
  {
    id: 'pornblocker',
    title: 'Porn Blocker',
    titleHi: 'पॉर्न ब्लॉकर (Porn Blocker)',
    subtitle: 'Android Digital Wellness & Distraction Filter',
    subtitleHi: 'एंड्रॉइड डिजिटल वेलनेस एवं डिस्ट्रैक्शन फ़िल्टर',
    description: 'A focused Android digital wellness utility concept aimed at filtering adult content, preventing compulsive device browsing, and safeguarding focus.',
    descriptionHi: 'अवांछित सामग्री और एडल्ट साइट्स को ब्लॉक करके डिजिटल वेलनेस और पढ़ाई में एकाग्रता बढ़ाने वाला एंड्रॉइड यूटिलिटी कॉन्सेप्ट।',
    status: 'Active Development',
    statusHi: 'सक्रिय विकास',
    tags: ['Android', 'Content Filtering', 'Digital Wellness', 'Focus Guard'],
    features: [
      'Intelligent keyword and domain barrier logic',
      'Emergency streak lock to prevent unblocking impulses',
      'Distraction-free study session mode',
      'Local policy enforcement without cloud surveillance',
    ],
    featuresHi: [
      'कीवर्ड और डोमेन बैरियर लॉजिक',
      'आवेगी अनलॉकिंग रोकने के लिए इमरजेंसी स्ट्रीक लॉक',
      'डिस्ट्रैक्शन-मुक्त स्टडी सेशन मोड',
      'लोकल पॉलिसी एन्फोर्समेंट बिना डेटा निगरानी के',
    ],
    targetOutcome: 'Clean, safe browsing shield for distraction-free learning.',
    targetOutcomeHi: 'एकाग्रता और अनुशासन बनाए रखने के लिए सुरक्षित ब्राउजिंग शील्ड।',
    isAvailable: false,
    accentColor: '#f43f5e',
  },
  {
    id: 'aicreation',
    title: 'AI Creation Lab',
    titleHi: 'AI क्रिएशन लैब (AI Creation)',
    subtitle: 'AI Generative Visuals & Prompt Engineering Suite',
    subtitleHi: 'AI जनरेटिव विजुअल्स एवं प्रॉम्प्ट इंजीनियरिंग सुइट',
    description: 'Practical exploration of cutting-edge multimodal generative AI, prompt optimization frameworks, and neural image/video generation workflows.',
    descriptionHi: 'मल्टीमॉडल जेनेरेटिव AI, एडवांस्ड प्रॉम्प्ट इंजीनियरिंग और न्यूरल इमेज/वीडियो निर्माण का व्यावहारिक अध्ययन व निर्माण।',
    status: 'Active Development',
    statusHi: 'सक्रिय विकास',
    tags: ['Prompt Engineering', 'Generative AI', 'Diffusion Models', 'Creative Tech'],
    features: [
      'Systematic prompt formulation templates',
      'Consistent style preservation benchmarks',
      'AI image and cinematic video synthesis exploration',
      'Integration experiments with Python AI wrappers',
    ],
    featuresHi: [
      'सिस्टमैटिक प्रॉम्प्ट टेम्प्लेट्स और टेस्टिंग',
      'कंसिस्टेंट स्टाइल प्रिजर्वेशन बेंचमार्क्स',
      'AI इमेज और सिनेमैटिक वीडियो जनरेशन एक्सपेरिमेंट्स',
      'पायथन AI रैपर्स के साथ इंटीग्रेशन टेस्टिंग',
    ],
    targetOutcome: 'High-fidelity generative asset generation pipeline.',
    targetOutcomeHi: 'उच्च गुणवत्ता वाली AI कला और प्रॉम्प्ट ऑटोमेशन वर्कफ़्लो।',
    isAvailable: false,
    accentColor: '#a855f7',
  },
  {
    id: '3dgame',
    title: '3D Game Development',
    titleHi: '3D गेम डेवलपमेंट (3D Game)',
    subtitle: 'Three.js & WebGL Interactive Spatial Experience',
    subtitleHi: 'Three.js एवं WebGL इंटरैक्टिव स्पेशियल अनुभव',
    description: 'Interactive real-time 3D web experience experimenting with procedural shaders, dynamic orbital cameras, physical lighting, and spatial audio.',
    descriptionHi: 'Three.js और WebGL की मदद से 3D वेब दुनिया, प्रोसीजरल शेडर्स, ऑर्बिटल कैमरा और स्पेशियल ऑडियो का निर्माण।',
    status: 'In Progress',
    statusHi: 'प्रगति पर है',
    tags: ['Three.js', 'WebGL', '3D Graphics', 'Procedural Audio', 'Interactive Tech'],
    features: [
      'Real-time PBR material lighting pipeline',
      'Interactive rotational touch and pointer dynamics',
      'Procedural Web Audio sound synthesis',
      'Smooth 60 FPS mobile and desktop performance',
    ],
    featuresHi: [
      'रियल-टाइम PBR मटीरियल लाइटिंग पाइपलाइन',
      'इंटरैक्टिव टच और पॉइंटर रोटेशन डायनामिक्स',
      'प्रोसीजरल वेब ऑडियो साउंड सिंथेसिस',
      'स्मूथ 60 FPS मोबाइल एवं डेस्कटॉप परफॉरमेंस',
    ],
    targetOutcome: 'Engaging cinematic 3D web environment accessible in browsers.',
    targetOutcomeHi: 'ब्राउज़र में चलने वाला शानदार सिनेमैटिक 3D अनुभव।',
    isAvailable: false,
    accentColor: '#8b5cf6',
  },
  {
    id: 'portfolio',
    title: 'Cinematic 3D Portfolio Matrix',
    titleHi: 'सिनेमैटिक 3D पोर्टफोलियो मैट्रिक्स',
    subtitle: 'Production Cyberpunk Showcase & Firebase Nexus',
    subtitleHi: 'प्रोडक्शन साइबरपंक शोकेस एवं फायरबेस नेक्सस',
    description: 'This official portfolio: featuring interactive Three.js 3D Photo-Orbit, luxury cyberpunk UI, Firebase Authentication, Storage image pipeline, and Firestore visitor messaging.',
    descriptionHi: 'यह आधिकारिक पोर्टफोलियो: थ्री.जेएस 3D फोटो-ऑर्बिट, लग्जरी साइबरपंक यूआई, फायरबेस स्टोरेज इमेज पाइपलाइन और विजिटर मैसेजिंग के साथ।',
    status: 'Live Showcase',
    statusHi: 'लाइव शोकेस',
    tags: ['React 19', 'Three.js', 'Firebase Auth', 'Firestore', 'Tailwind CSS'],
    features: [
      'Circular 3D Hero Photo-Orbit with Firebase synchronization',
      'Distinct scroll-based cinematic scene environments',
      'Authenticated Admin Control Center & Image Manager',
      'Full bilingual Hindi/English accessibility and Web Audio',
    ],
    featuresHi: [
      'फायरबेस से जुड़ी सर्कुलर 3D हीरो फोटो-ऑर्बिट',
      'स्क्रॉल पर बदलते अलग-अलग सिनेमैटिक सीन्स',
      'ऑथेंटिकेटेड एडमिन कंट्रोल सेंटर और इमेज मैनेजर',
      'द्विभाषी हिंदी/अंग्रेजी सपोर्ट और प्रोसीजरल साउंड इफेक्ट्स',
    ],
    targetOutcome: 'A futuristic digital identity showcasing genuine skills and ambition.',
    targetOutcomeHi: 'वास्तविक कौशल और भविष्य की महत्वाकांक्षा को दर्शाने वाली डिजिटल पहचान।',
    isAvailable: true,
    accentColor: '#ec4899',
  },
];

export const defaultSkills: SkillItem[] = [
  {
    name: 'Python',
    nameHi: 'पायथन',
    category: 'current',
    icon: 'Terminal',
    description: 'Core programming syntax, automation scripts, algorithms, data structures, and procedural problem-solving.',
    descriptionHi: 'कोर प्रोग्रामिंग सिंटैक्स, ऑटोमेशन स्क्रिप्ट्स, एल्गोरिदम, डेटा स्ट्रक्चर्स और लॉजिक डेवलपमेंट।',
    highlights: ['Core Syntax & Logic', 'Script Automation', 'File Handling', 'Data Analysis Basics'],
  },
  {
    name: 'Prompt Engineering',
    nameHi: 'प्रॉम्प्ट इंजीनियरिंग',
    category: 'current',
    icon: 'BrainCircuit',
    description: 'Systematic structure formulation, zero/few-shot framing, reasoning chains, and domain-grounded LLM guidance.',
    descriptionHi: 'सिस्टमैटिक प्रॉम्प्ट निर्माण, फ्यू-शॉट फ्रेमिंग, रीजनिंग चेन्स और AI मॉडल को सटीक निर्देश देना।',
    highlights: ['Chain of Thought', 'System Directives', 'Output Formatting', 'Role Prompting'],
  },
  {
    name: 'AI Image & Video Generation',
    nameHi: 'AI इमेज और वीडियो निर्माण',
    category: 'current',
    icon: 'Sparkles',
    description: 'Creation of high-fidelity visual assets, cinematic cyberpunk concepts, and iterative style synthesis.',
    descriptionHi: 'उच्च-गुणवत्ता वाले विजुअल एसेट्स, सिनेमैटिक साइबरपंक कॉन्सेप्ट्स और स्टाइल सिंथेसिस।',
    highlights: ['Photorealistic Diffusion', 'Cinematic Cyberpunk Styles', 'Video Latent Framing', 'Asset Crafting'],
  },
  {
    name: 'GitHub & Version Control',
    nameHi: 'गिटहब और वर्जन कंट्रोल',
    category: 'tools',
    icon: 'Code2',
    description: 'Repository management, branching, commit discipline, and collaborative open-source workflows.',
    descriptionHi: 'रिपोजिटरी प्रबंधन, कमिट अनुशासन, कोड ट्रैकिंग और ओपन-सोर्स वर्कफ़्लो।',
    highlights: ['Git CLI Operations', 'Branch Management', 'Repo Synchronization', 'Release Tags'],
  },
  {
    name: 'Render Deployment & Hosting',
    nameHi: 'रेंडर डिप्लॉयमेंट और होस्टिंग',
    category: 'tools',
    icon: 'Globe',
    description: 'Deploying full-stack applications, containerized services, webhooks, and cloud environment configuration.',
    descriptionHi: 'फुल-स्टैक ऍप्लिकेशन्स को क्लाउड पर लाइव होस्ट करना और पर्यावरण वेरिएबल्स सेटअप।',
    highlights: ['Web Service Hosting', 'Static Site Hosting', 'Environment Configs', 'Continuous Delivery'],
  },
  {
    name: 'App & Website Builders',
    nameHi: 'ऐप और वेबसाइट बिल्डर्स',
    category: 'tools',
    icon: 'Layers',
    description: 'Modern component-driven application scaffolding with React, Vite, Tailwind CSS, and mobile toolchains.',
    descriptionHi: 'रिएक्ट, टेलविंड और आधुनिक वेब टूलचेन से रिस्पॉन्सिव वेब और मोबाइल ऐप्स का निर्माण।',
    highlights: ['Component Architecture', 'Tailwind CSS Styling', 'Responsive Mobile-First', 'Modern React'],
  },
  {
    name: 'Advanced Python & OOP',
    nameHi: 'एडवांस्ड पायथन और OOP',
    category: 'learning',
    icon: 'Cpu',
    description: 'Object-oriented patterns, decorators, generators, dunder protocols, and robust modular software architecture.',
    descriptionHi: 'ऑब्जेक्ट-ओरिएंटेड पैटर्न्स, डेकोरेटर्स, जनरेटर्स और बड़े प्रोजेक्ट्स का मॉड्यूलर कोड स्ट्रक्चर।',
    highlights: ['Classes & Inheritance', 'Dunder Methods', 'Decorators & Generators', 'Clean Architecture'],
  },
  {
    name: 'Machine Learning & Deep Learning',
    nameHi: 'मशीन लर्निंग और डीप लर्निंग',
    category: 'learning',
    icon: 'Brain',
    description: 'Mathematical foundations, gradient descent, neural network architectures, PyTorch/TensorFlow concepts, and supervised learning.',
    descriptionHi: 'गणितीय आधार, न्यूरल नेटवर्क आर्किटेक्चर, सुपरवाइज़्ड लर्निंग और एमएल मॉडल्स का प्रशिक्षण।',
    highlights: ['Math & Linear Algebra', 'Tensor Operations', 'Neural Architectures', 'Model Evaluation'],
  },
  {
    name: 'LLMs & AI Agentic Systems',
    nameHi: 'LLMs और AI एजेंट्स',
    category: 'learning',
    icon: 'Sparkles',
    description: 'Building autonomous tool-calling AI agents, vector embeddings, RAG pipelines, and API integrations.',
    descriptionHi: 'टूल-कॉलिंग वाले स्वायत्त AI एजेंट्स, वेक्टर डेटाबेस और RAG पाइपलाइन्स का निर्माण।',
    highlights: ['Function Calling', 'RAG Pipelines', 'Vector Stores', 'Autonomous Loops'],
  },
];

export const defaultMilestones: RoadmapMilestone[] = [
  {
    id: 'm1',
    phase: 'PHASE 01 // FOUNDATION',
    title: 'Python Core Foundations',
    titleHi: 'पायथन कोर फाउंडेशन',
    status: 'completed',
    statusText: 'Mastered',
    statusTextHi: 'पूर्ण किया',
    description: 'Deep understanding of Python language syntax, control structures, functions, and data structures.',
    descriptionHi: 'पायथन भाषा सिंटैक्स, कंट्रोल फ्लो, फंक्शन्स और डेटा स्ट्रक्चर्स की मजबूत नींव।',
    topics: ['Variables & Primitive Types', 'Lists, Dictionaries & Sets', 'Control Loops & Logic', 'File I/O & Exception Handling'],
  },
  {
    id: 'm2',
    phase: 'PHASE 02 // INTERMEDIATE & DEV',
    title: 'Data Handling & Real Projects',
    titleHi: 'डेटा हैंडलिंग और रियल प्रोजेक्ट्स',
    status: 'in-progress',
    statusText: 'In Progress (Active)',
    statusTextHi: 'वर्तमान में अध्ययनरत',
    description: 'Building practical apps, modular scripting, API integration, and database connectivity.',
    descriptionHi: 'प्रैक्टिकल ऐप्स, मॉड्यूलर स्क्रिप्ट्स, API इंटीग्रेशन और डेटाबेस कनेक्टिविटी का निर्माण।',
    topics: ['NumPy & Pandas Concepts', 'REST APIs & JSON Pipelines', 'Firebase & Firestore SDK', 'Modular Script Packages'],
  },
  {
    id: 'm3',
    phase: 'PHASE 03 // ADVANCED AI HORIZON',
    title: 'AI, ML & Deep Learning',
    titleHi: 'AI, मशीन लर्निंग और डीप लर्निंग',
    status: 'future',
    statusText: 'Upcoming Focus',
    statusTextHi: 'अगला लक्ष्य',
    description: 'Mastering machine learning algorithms, neural network mathematics, and generative architectures.',
    descriptionHi: 'मशीन लर्निंग एल्गोरिदम, न्यूरल नेटवर्क गणित और जेनेरेटिव आर्किटेक्चर का गहन अध्ययन।',
    topics: ['Supervised & Unsupervised Learning', 'Neural Network Training', 'PyTorch / TensorFlow Pipelines', 'Computer Vision & NLP Basics'],
  },
  {
    id: 'm4',
    phase: 'PHASE 04 // MASTER LEVEL',
    title: 'Autonomous AI Systems & Deployment',
    titleHi: 'स्वायत्त AI सिस्टम्स और क्लाउड डिप्लॉयमेंट',
    status: 'future',
    statusText: 'Long-Term Vision',
    statusTextHi: 'दीर्घकालिक लक्ष्य',
    description: 'Architecting intelligent autonomous agents, production cloud scaling, and real-world AI applications.',
    descriptionHi: 'बुद्धिमान स्वायत्त एजेंट्स, क्लाउड स्केलिंग और वास्तविक दुनिया के उपयोगी AI समाधान।',
    topics: ['Multi-Agent Orchestration', 'Scalable Cloud Microservices', 'Production AI Pipelines', 'Continuous Innovation'],
  },
];

export const defaultSiteSettings: SiteSettings = {
  profile: {
    name: 'Mohit Yadav',
    title: 'Future AI Engineer | Python Developer | Web & App Creator',
    titleHi: 'भावी AI इंजीनियर | पायथन डेवलपर | वेब एवं ऐप क्रिएटर',
    bioEn: "I'm an aspiring AI Engineer and Python developer passionate about building applications, websites, AI-powered tools, and futuristic digital experiences. My focus is turning curiosity into practical, real-world technology.",
    bioHi: 'मैं एक aspiring AI Engineer और Python Developer हूँ। मुझे apps, websites, AI-powered tools और futuristic digital experiences बनाना पसंद है। मेरा लक्ष्य सीखते हुए अपने ideas को real, useful projects में बदलना है।',
    education: 'Class 12 Science Student',
    educationHi: 'कक्षा 12 विज्ञान का छात्र',
    academicBoard: 'Bihar Board (BSEB)',
    targetRole: 'Future AI Engineer & Tech Innovator',
    targetRoleHi: 'भावी AI इंजीनियर एवं तकनीकी निर्माता',
    careerGoalsEn: [
      'Master Advanced Python and foundational mathematics for AI and Machine Learning.',
      'Build practical AI solutions, intelligent automation tools, and real-time apps.',
      'Pursue higher university education in Computer Science and Artificial Intelligence.',
      'Contribute to open-source software and develop products that positively impact people.',
    ],
    careerGoalsHi: [
      'AI और मशीन लर्निंग के लिए एडवांस्ड पायथन और बुनियादी गणित में महारत हासिल करना।',
      'व्यावहारिक AI समाधान, इंटेलिजेंट ऑटोमेशन टूल्स और रियल-टाइम ऐप्स बनाना।',
      'कंप्यूटर साइंस और आर्टिफिशियल इंटेलिजेंस में उच्च विश्वविद्यालयी शिक्षा प्राप्त करना।',
      'ओपन-सोर्स में योगदान देना और ऐसे उपयोगी उत्पाद बनाना जो समाज के काम आ सकें।',
    ],
  },
  hero: {
    heroTitle: 'MOHIT YADAV',
    heroSubtitle: 'Future AI Engineer | Python Developer | Web & App Creator',
    heroBioEn: "I'm an aspiring AI Engineer and Python developer passionate about building applications, websites, AI-powered tools, and futuristic digital experiences.",
    heroBioHi: 'मैं एक aspiring AI Engineer और Python Developer हूँ। मुझे apps, websites, AI-powered tools और futuristic digital experiences बनाना पसंद है। मेरा लक्ष्य सीखते हुए अपने ideas को real, useful projects में बदलना है।',
    orbitCycleInterval: 2.5,
    autoRotateSpeed: 0.45,
    enable3DPhotoOrbit: true,
    enableQuantumCore: true,
    orbitImageIds: [],
    particlesEnabled: true,
  },
  theme: {
    neonColor: 'cyan',
    glowIntensity: 'balanced',
    fontFamily: 'rajdhani',
    backgroundStyle: 'particles',
    soundEnabledByDefault: false,
  },
  scenes: {
    activeScenes: {
      hero: true,
      about: true,
      skills: true,
      roadmap: true,
      projects: true,
      gallery: true,
      vision: true,
      contact: true,
    },
    sceneOrder: ['hero', 'about', 'skills', 'roadmap', 'projects', 'gallery', 'vision', 'contact'],
  },
  contact: {
    email: 'mohityadav802316@gmail.com',
    githubUrl: 'https://github.com',
    telegramUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    location: 'Bihar, India',
    locationHi: 'बिहार, भारत',
    responseAvailability: 'Open for learning collaborations and tech discussions',
    responseAvailabilityHi: 'सीखने, सहयोगात्मक प्रोजेक्ट्स और तकनीकी चर्चाओं के लिए उपलब्ध',
  },
  projects: defaultProjects,
  skills: defaultSkills,
  milestones: defaultMilestones,

  // Backward compatibility
  heroTitle: 'MOHIT YADAV',
  heroSubtitle: 'Future AI Engineer | Python Developer | Web & App Creator',
  heroBioEn: "I'm an aspiring AI Engineer and Python developer passionate about building applications, websites, AI-powered tools, and futuristic digital experiences.",
  heroBioHi: 'मैं एक aspiring AI Engineer और Python Developer हूँ। मुझे apps, websites, AI-powered tools और futuristic digital experiences बनाना पसंद है।',
  orbitCycleInterval: 2.5,
  themeColor: 'cyan',
  activeScenes: {
    hero: true,
    about: true,
    skills: true,
    projects: true,
    gallery: true,
    vision: true,
    contact: true,
  },
};

interface ImageContextType {
  publishedImages: PortfolioImage[];
  allImages: PortfolioImage[];
  mainProfileImage: PortfolioImage | null;
  heroOrbitImages: PortfolioImage[];
  galleryImages: PortfolioImage[];
  aboutImages: PortfolioImage[];
  roadmapImages: PortfolioImage[];
  siteSettings: SiteSettings;
  projects: ProjectItem[];
  skills: SkillItem[];
  milestones: RoadmapMilestone[];
  isLoading: boolean;
  refreshImages: () => Promise<void>;
  updateSiteSettings: (settings: Partial<SiteSettings>, publishImmediately?: boolean) => Promise<void>;
}

const ImageContext = createContext<ImageContextType>({
  publishedImages: [],
  allImages: [],
  mainProfileImage: null,
  heroOrbitImages: [],
  galleryImages: [],
  aboutImages: [],
  roadmapImages: [],
  siteSettings: defaultSiteSettings,
  projects: defaultProjects,
  skills: defaultSkills,
  milestones: defaultMilestones,
  isLoading: true,
  refreshImages: async () => {},
  updateSiteSettings: async () => {},
});

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publishedImages, setPublishedImages] = useState<PortfolioImage[]>([]);
  const [allImages, setAllImages] = useState<PortfolioImage[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPublishedImages = async () => {
    try {
      const imagesRef = collection(db, 'images');
      let snapshot;
      try {
        const q = query(imagesRef, where('isPublished', '==', true));
        snapshot = await getDocs(q);
      } catch (err) {
        console.warn('Query on images failed, fallback to collection:', err);
        snapshot = await getDocs(imagesRef);
      }

      const pubItems: PortfolioImage[] = [];
      const allItems: PortfolioImage[] = [];

      snapshot.forEach((d) => {
        const data = d.data();
        const img: PortfolioImage = {
          id: d.id,
          title: data.title || '',
          caption: data.caption || '',
          captionHi: data.captionHi || '',
          downloadUrl: data.downloadUrl || '',
          storagePath: data.storagePath || '',
          section: data.section || 'gallery',
          category: data.category || 'personal',
          displayOrder: data.displayOrder ?? 0,
          isPublished: data.isPublished ?? true,
          isMainProfile: data.isMainProfile ?? false,
          isHeroOrbit: data.isHeroOrbit ?? false,
          orbitIndex: data.orbitIndex ?? 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        allItems.push(img);
        if (img.isPublished) {
          pubItems.push(img);
        }
      });

      const sortImages = (list: PortfolioImage[]) => {
        return list.sort((a, b) => {
          if (a.displayOrder !== b.displayOrder) {
            return a.displayOrder - b.displayOrder;
          }
          const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
          const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
          return tB - tA;
        });
      };

      setPublishedImages(sortImages(pubItems));
      setAllImages(sortImages(allItems));
    } catch (err) {
      console.warn('Error fetching published images from Firestore:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time synchronization for images and settings
  useEffect(() => {
    fetchPublishedImages();

    // 1. Listen for images changes
    let unsubImages = () => {};
    try {
      const imagesRef = collection(db, 'images');
      unsubImages = onSnapshot(
        imagesRef,
        (snapshot) => {
          const pubItems: PortfolioImage[] = [];
          const allItems: PortfolioImage[] = [];

          snapshot.forEach((d) => {
            const data = d.data();
            const img: PortfolioImage = {
              id: d.id,
              title: data.title || '',
              caption: data.caption || '',
              captionHi: data.captionHi || '',
              downloadUrl: data.downloadUrl || '',
              storagePath: data.storagePath || '',
              section: data.section || 'gallery',
              category: data.category || 'personal',
              displayOrder: data.displayOrder ?? 0,
              isPublished: data.isPublished ?? true,
              isMainProfile: data.isMainProfile ?? false,
              isHeroOrbit: data.isHeroOrbit ?? false,
              orbitIndex: data.orbitIndex ?? 0,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            };
            allItems.push(img);
            if (img.isPublished) {
              pubItems.push(img);
            }
          });

          const sortImages = (list: PortfolioImage[]) => {
            return list.sort((a, b) => {
              if (a.displayOrder !== b.displayOrder) {
                return a.displayOrder - b.displayOrder;
              }
              const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
              const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
              return tB - tA;
            });
          };

          setPublishedImages(sortImages(pubItems));
          setAllImages(sortImages(allItems));
          setIsLoading(false);
        },
        (error) => {
          console.warn('Images snapshot error:', error);
          setIsLoading(false);
        }
      );
    } catch {}

    // 2. Listen for settings doc
    let unsubSettings = () => {};
    try {
      const settingsRef = doc(db, 'settings', 'general');
      unsubSettings = onSnapshot(
        settingsRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSiteSettings((prev) => {
              return {
                ...defaultSiteSettings,
                ...prev,
                ...data,
                profile: {
                  ...defaultSiteSettings.profile,
                  ...prev.profile,
                  ...(data.profile || {}),
                },
                hero: {
                  ...defaultSiteSettings.hero,
                  ...prev.hero,
                  ...(data.hero || {}),
                },
                theme: {
                  ...defaultSiteSettings.theme,
                  ...prev.theme,
                  ...(data.theme || {}),
                },
                scenes: {
                  ...defaultSiteSettings.scenes,
                  ...prev.scenes,
                  ...(data.scenes || {}),
                  activeScenes: {
                    ...defaultSiteSettings.scenes.activeScenes,
                    ...(data.scenes?.activeScenes || {}),
                  },
                },
                contact: {
                  ...defaultSiteSettings.contact,
                  ...prev.contact,
                  ...(data.contact || {}),
                },
                projects: data.projects || prev.projects || defaultProjects,
                skills: data.skills || prev.skills || defaultSkills,
                milestones: data.milestones || prev.milestones || defaultMilestones,
              };
            });
          }
        },
        (err) => {
          console.warn('Settings listener note:', err);
        }
      );
    } catch {}

    return () => {
      unsubImages();
      unsubSettings();
    };
  }, []);

  const updateSiteSettings = async (
    newSettings: Partial<SiteSettings>,
    publishImmediately = true
  ) => {
    try {
      const settingsRef = doc(db, 'settings', 'general');
      const merged: SiteSettings = {
        ...siteSettings,
        ...newSettings,
        isDraft: !publishImmediately,
        lastPublishedAt: publishImmediately ? serverTimestamp() : siteSettings.lastPublishedAt,
        updatedAt: serverTimestamp(),
      };
      await setDoc(settingsRef, merged, { merge: true });
      setSiteSettings((prev) => ({
        ...prev,
        ...newSettings,
        isDraft: !publishImmediately,
      }));
    } catch (err) {
      console.error('Error saving site settings:', err);
      throw err;
    }
  };

  const mainProfileImage =
    publishedImages.find((img) => img.isMainProfile && img.section === 'profile') ||
    publishedImages.find((img) => img.isMainProfile) ||
    publishedImages.find((img) => img.section === 'profile') ||
    publishedImages[0] ||
    null;

  // Selected or automatic Hero Orbit images (4 to 5 distinct photographs)
  const explicitOrbit = publishedImages.filter((img) => img.isHeroOrbit);
  let heroOrbitImages: PortfolioImage[] = [];

  if (explicitOrbit.length >= 2) {
    heroOrbitImages = explicitOrbit.slice(0, 5);
  } else if (publishedImages.length >= 2) {
    heroOrbitImages = publishedImages.slice(0, 5);
  } else if (publishedImages.length === 1) {
    heroOrbitImages = [publishedImages[0]];
  }

  const galleryImages = publishedImages.filter((img) => img.section === 'gallery');
  const aboutImages = publishedImages.filter((img) => img.section === 'about');
  const roadmapImages = publishedImages.filter((img) => img.section === 'roadmap');

  const activeProjects = siteSettings.projects && siteSettings.projects.length > 0
    ? siteSettings.projects
    : defaultProjects;

  const activeSkills = siteSettings.skills && siteSettings.skills.length > 0
    ? siteSettings.skills
    : defaultSkills;

  const activeMilestones = siteSettings.milestones && siteSettings.milestones.length > 0
    ? siteSettings.milestones
    : defaultMilestones;

  return (
    <ImageContext.Provider
      value={{
        publishedImages,
        allImages,
        mainProfileImage,
        heroOrbitImages,
        galleryImages,
        aboutImages,
        roadmapImages,
        siteSettings,
        projects: activeProjects,
        skills: activeSkills,
        milestones: activeMilestones,
        isLoading,
        refreshImages: fetchPublishedImages,
        updateSiteSettings,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImages = () => useContext(ImageContext);
