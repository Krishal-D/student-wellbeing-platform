// data/items.js
// Sample dataset for search functionality

export const ITEMS = [
  {
    id: 1,
    title: "Morning Yoga",
    category: "fitness",
    date: "18-09-2025",
    location: "Parramatta South",
    type: "event",
    summary: "Gentle flow to start your day.",
    bookUrl: "/book/1"
  },
  {
    id: 2,
    title: "Peer Support Group",
    category: "socialnetwork",
    date: "19-09-2025",
    location: "Penrith",
    type: "event",
    summary: "Meet other students and share.",
    bookUrl: "/book/2"
  },
  {
    id: 3,
    title: "Stress Management Guide",
    category: "counselling",
    date: "01-10-2025",
    location: "Online",
    type: "workshop",
    summary: "Self-paced reading & worksheets.",
    bookUrl: "/book/3"
  },
  {
    id: 4,
    title: "Mindfulness Workshop",
    category: "counselling",
    date: "05-10-2025",
    location: "Campbelltown",
    type: "workshop",
    summary: "Interactive session on mindfulness techniques.",
    bookUrl: "/book/4"
  },
  {
    id: 5,
    title: "Healthy Living Seminar",
    category: "fitness",
    date: "09-10-2025",
    location: "Parrarmatta City",
    type: "event",
    summary: "Expert speakers on nutrition, exercise, and wellbeing.",
    bookUrl: "/book/5"
  }
];

export const EVENTS = [
  {
    id: 'mental-health-workshop',
    title: 'Mental Health Workshop',
    subtitle: 'Learn coping strategies',
    image: '/images/istockphoto-1340965910-612x612.jpg',
    category: 'counselling',
    date: '2025-09-17',
    time: '10:00',
    campus: 'parramatta South',
    type: 'workshop',
    description: 'Join our comprehensive mental health workshop designed to help you develop effective coping strategies for managing stress, anxiety, and daily challenges. This interactive session will provide you with practical tools and techniques to improve your mental wellbeing.',
    details: [
      'Learn evidence-based coping strategies',
      'Interactive group activities',
      'Access to mental health resources',
      'Q&A session with mental health professionals',
      'Take-home materials and worksheets'
    ],
    instructor: 'Dr Kieran Luken',
    duration: '2 hours',
    maxParticipants: 25,
    bookUrl: '/book/mental-health-workshop'
  },
  {
    id: 'learning-skills-seminar',
    title: 'Learning Skills Seminar',
    subtitle: 'Improve your study habits',
    image: '/images/Learning-Skill-icon-Graphics-26544562-1-1-580x387.jpg',
    category: 'counselling',
    date: '2025-09-18',
    time: '11:00',
    campus: 'Bankstown',
    type: 'seminar',
    description: 'Enhance your academic performance with our comprehensive learning skills seminar. Discover effective study techniques, time management strategies, and memory improvement methods that will help you succeed in your studies.',
    details: [
      'Effective note-taking techniques',
      'Time management strategies',
      'Memory improvement methods',
      'Exam preparation tips',
      'Study group formation guidance'
    ],
    instructor: 'Dr Rhys Tague',
    duration: '1.5 hours',
    maxParticipants: 30,
    bookUrl: '/book/learning-skills-seminar'
  },
  {
    id: 'career-fair',
    title: 'Career Fair',
    subtitle: 'Explore job opportunities',
    image: '/images/360_F_1527954928_5UPs5ilDSieF6nu9LGfV8J36RtvDgGhF.jpg',
    category: 'socialnetwork',
    date: '2025-09-19',
    time: '09:00',
    campus: 'Parramatta City',
    type: 'event',
    description: 'Connect with top employers and explore exciting career opportunities at our annual career fair. Meet representatives from leading companies, learn about internship programs, and get valuable career advice from industry professionals.',
    details: [
      'Meet 50+ top employers',
      'Internship opportunities',
      'Resume review sessions',
      'Career counseling',
      'Networking opportunities'
    ],
    instructor: 'Career Services Team',
    duration: '4 hours',
    maxParticipants: 200,
    bookUrl: '/book/career-fair'
  },
  {
    id: 'social-mixer',
    title: 'Social Mixer',
    subtitle: 'Meet new people',
    image: '/images/social-wellbeing-concept-icon.jpg',
    category: 'socialnetwork',
    date: '2025-09-20',
    time: '12:00',
    campus: 'Penrith',
    type: 'event',
    description: 'Join our fun and relaxed social mixer to meet new people, make friends, and expand your social network. This event is perfect for students looking to connect with peers and build meaningful relationships.',
    details: [
      'Ice-breaker activities',
      'Group games and challenges',
      'Free refreshments',
      'Networking opportunities',
      'Social media connections'
    ],
    instructor: 'Student Life Team',
    duration: '2 hours',
    maxParticipants: 50,
    bookUrl: '/book/social-mixer'
  }
];
