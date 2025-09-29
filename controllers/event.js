/**
 * Event controller for handling individual event pages
 */

// Event data for the recommendation cards
const EVENTS = [
  {
    id: 'mental-health-workshop',
    title: 'Mental Health Workshop',
    subtitle: 'Learn coping strategies',
    image: '/images/istockphoto-1340965910-612x612.jpg',
    category: 'counselling',
    date: '2025-09-17',
    time: '10:00',
    campus: 'parramattasouth',
    type: 'workshop',
    description: 'Join our comprehensive mental health workshop designed to help you develop effective coping strategies for managing stress, anxiety, and daily challenges. This interactive session will provide you with practical tools and techniques to improve your mental wellbeing.',
    details: [
      'Learn evidence-based coping strategies',
      'Interactive group activities',
      'Access to mental health resources',
      'Q&A session with mental health professionals',
      'Take-home materials and worksheets'
    ],
    instructor: 'Dr. Sarah Johnson',
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
    campus: 'bankstown',
    type: 'seminar',
    description: 'Enhance your academic performance with our comprehensive learning skills seminar. Discover effective study techniques, time management strategies, and memory improvement methods that will help you succeed in your studies.',
    details: [
      'Effective note-taking techniques',
      'Time management strategies',
      'Memory improvement methods',
      'Exam preparation tips',
      'Study group formation guidance'
    ],
    instructor: 'Prof. Michael Chen',
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
    campus: 'parramattacity',
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
    campus: 'penrith',
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

/**
 * Get all events
 */
export function getAllEvents() {
  return EVENTS;
}

/**
 * Get event by ID
 */
export function getEventById(id) {
  return EVENTS.find(event => event.id === id);
}

/**
 * Search events based on filters
 */
export function searchEvents(filters) {
  const { query = "", category = "", date = "", time = "", campus = "", type = "" } = filters;
  
  const q = query.trim().toLowerCase();
  
  return EVENTS.filter(event => {
    const matchesQuery = !q || 
      event.title.toLowerCase().includes(q) ||
      event.subtitle.toLowerCase().includes(q) ||
      event.description.toLowerCase().includes(q);
    
    const matchesCategory = !category || event.category === category;
    const matchesDate = !date || event.date === date;
    const matchesTime = !time || event.time === time;
    const matchesCampus = !campus || event.campus === campus;
    const matchesType = !type || event.type === type;
    
    return matchesQuery && matchesCategory && matchesDate && matchesTime && matchesCampus && matchesType;
  });
}

/**
 * Render individual event page
 */
export async function showEvent(req, res, next) {
  const { eventId } = req.params;
  const event = getEventById(eventId);
  
  if (!event) {
    return res.status(404).render('error', { 
      title: 'Event Not Found',
      message: 'The requested event could not be found.' 
    });
  }
  
  res.render('event', { 
    title: event.title,
    event: event
  });
}

/**
 * Render events listing page (for search results)
 */
export async function listEvents(req, res, next) {
  const events = getAllEvents();
  res.render('events', { 
    title: 'All Events',
    events: events
  });
}

