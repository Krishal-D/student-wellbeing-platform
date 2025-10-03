// Mock data for events

export const ALL_EVENTS = [
  // Fitness Events
  {
    id: "morning-yoga",
    title: "Morning Yoga",
    subtitle: "Gentle flow to start your day",
    category: "fitness",
    date: "18-09-2025",
    time: "14:00",
    location: "Parramatta South",
    type: "event",
    description: "Start your day with a peaceful and energizing yoga session. Our morning yoga class focuses on gentle flows and breathing exercises that will help you feel centered and ready to tackle the day ahead.",
    details: [
      "Suitable for all fitness levels",
      "Yoga mats provided", 
      "Guided breathing exercises",
      "Stress relief and relaxation",
      "Improve flexibility and strength"
    ],
    instructor: "Sarah Johnson",
    duration: "1 hour",
    maxParticipants: 20,
    image: "/images/360_F_1527954928_5UPs5ilDSieF6nu9LGfV8J36RtvDgGhF.jpg",
    bookUrl: "/book/morning-yoga"
  },
  {
    id: "healthy-living-seminar",
    title: "Healthy Living Seminar",
    subtitle: "Expert speakers on nutrition, exercise, and wellbeing",
    category: "fitness",
    date: "09-10-2025",
    time: "11:00",
    location: "Parramatta City",
    type: "seminar",
    description: "Join nutrition and fitness experts as they share the latest research and practical tips for maintaining a healthy lifestyle. Learn about balanced nutrition, effective exercise routines, and overall wellbeing strategies.",
    details: [
      "Expert nutrition advice",
      "Exercise demonstrations",
      "Healthy recipe samples",
      "Q&A with professionals",
      "Free health screening"
    ],
    instructor: "Health & Wellness Team",
    duration: "3 hours",
    maxParticipants: 50,
    image: "/images/360_F_1527954928_5UPs5ilDSieF6nu9LGfV8J36RtvDgGhF.jpg",
    bookUrl: "/book/healthy-living-seminar"
  },

  // Counselling Events
  {
    id: "mental-health-workshop",
    title: "Mental Health Workshop",
    subtitle: "Learn coping strategies",
    category: "counselling", 
    date: "17-09-2025",
    time: "10:00",
    location: "Parramatta South",
    type: "workshop",
    description: "Join our comprehensive mental health workshop designed to help you develop effective coping strategies for managing stress, anxiety, and daily challenges. This interactive session will provide you with practical tools and techniques to improve your mental wellbeing.",
    details: [
      "Learn evidence-based coping strategies",
      "Interactive group activities", 
      "Access to mental health resources",
      "Q&A session with mental health professionals",
      "Take-home materials and worksheets"
    ],
    instructor: "Dr Kieran Luken",
    duration: "2 hours",
    maxParticipants: 25,
    image: "/images/istockphoto-1340965910-612x612.jpg",
    bookUrl: "/book/mental-health-workshop"
  },
  {
    id: "learning-skills-seminar",
    title: "Learning Skills Seminar", 
    subtitle: "Improve your study habits",
    category: "counselling",
    date: "18-09-2025",
    time: "11:00",
    location: "Bankstown",
    type: "seminar",
    description: "Enhance your academic performance with our comprehensive learning skills seminar. Discover effective study techniques, time management strategies, and memory improvement methods that will help you succeed in your studies.",
    details: [
      "Effective note-taking techniques",
      "Time management strategies",
      "Memory improvement methods", 
      "Exam preparation tips",
      "Study group formation guidance"
    ],
    instructor: "Dr Rhys Tague",
    duration: "1.5 hours",
    maxParticipants: 30,
    image: "/images/Learning-Skill-icon-Graphics-26544562-1-1-580x387.jpg",
    bookUrl: "/book/learning-skills-seminar"
  },
  {
    id: "stress-management-guide",
    title: "Stress Management Guide",
    subtitle: "Self-paced reading & worksheets",
    category: "counselling",
    date: "01-10-2025",
    time: "10:00",
    location: "Online",
    type: "workshop",
    description: "Learn effective strategies to manage stress and anxiety through our comprehensive self-paced program. Includes practical worksheets, exercises, and techniques you can use in daily life.",
    details: [
      "Downloadable worksheets",
      "Self-paced learning modules",
      "Practical stress-reduction techniques",
      "Expert-designed content",
      "Access for 6 months"
    ],
    instructor: "Dr. Michael Chen",
    duration: "Self-paced",
    maxParticipants: 100,
    image: "/images/istockphoto-1340965910-612x612.jpg",
    bookUrl: "/book/stress-management-guide"
  },
  {
    id: "mindfulness-workshop",
    title: "Mindfulness Workshop",
    subtitle: "Interactive session on mindfulness techniques",
    category: "counselling",
    date: "05-10-2025",
    time: "13:00",
    location: "Campbelltown",
    type: "workshop",
    description: "Discover the power of mindfulness through guided meditation, breathing exercises, and practical techniques for staying present. This interactive workshop will teach you skills to reduce stress and improve focus.",
    details: [
      "Guided meditation sessions",
      "Learn breathing techniques",
      "Mindfulness exercises",
      "Take-home practice guides",
      "Small group setting"
    ],
    instructor: "Dr. Emma Williams",
    duration: "2 hours",
    maxParticipants: 25,
    image: "/images/Learning-Skill-icon-Graphics-26544562-1-1-580x387.jpg",
    bookUrl: "/book/mindfulness-workshop"
  },

  // Social Network Events
  {
    id: "peer-support-group",
    title: "Peer Support Group",
    subtitle: "Meet other students and share",
    category: "socialnetwork",
    date: "19-09-2025",
    time: "14:00",
    location: "Penrith",
    type: "event",
    description: "Join fellow students in a supportive environment where you can share experiences, challenges, and successes. This peer support group provides a safe space for open discussion and mutual encouragement.",
    details: [
      "Safe and confidential environment",
      "Share experiences with peers",
      "Build lasting friendships",
      "Receive emotional support",
      "Light refreshments provided"
    ],
    instructor: "Student Counselors",
    duration: "1.5 hours",
    maxParticipants: 15,
    image: "/images/social-wellbeing-concept-icon.jpg",
    bookUrl: "/book/peer-support-group"
  },
  {
    id: "career-fair",
    title: "Career Fair",
    subtitle: "Explore job opportunities",
    category: "socialnetwork",
    date: "19-09-2025",
    time: "09:00", 
    location: "Parramatta City",
    type: "event",
    description: "Connect with top employers and explore exciting career opportunities at our annual career fair. Meet representatives from leading companies, learn about internship programs, and get valuable career advice from industry professionals.",
    details: [
      "Meet 50+ top employers",
      "Internship opportunities",
      "Resume review sessions",
      "Career counseling",
      "Networking opportunities"
    ],
    instructor: "Career Services Team",
    duration: "4 hours",
    maxParticipants: 200,
    image: "/images/360_F_1527954928_5UPs5ilDSieF6nu9LGfV8J36RtvDgGhF.jpg",
    bookUrl: "/book/career-fair"
  },
  {
    id: "social-mixer",
    title: "Social Mixer",
    subtitle: "Meet new people",
    category: "socialnetwork", 
    date: "20-09-2025",
    time: "12:00",
    location: "Penrith",
    type: "event",
    description: "Join our fun and relaxed social mixer to meet new people, make friends, and expand your social network. This event is perfect for students looking to connect with peers and build meaningful relationships.",
    details: [
      "Ice-breaker activities",
      "Group games and challenges", 
      "Free refreshments",
      "Networking opportunities",
      "Social media connections"
    ],
    instructor: "Student Life Team",
    duration: "2 hours",
    maxParticipants: 50,
    image: "/images/social-wellbeing-concept-icon.jpg",
    bookUrl: "/book/social-mixer"
  }
];