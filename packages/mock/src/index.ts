import type {
  User,
  Job,
  Credential,
  Conversation,
  Message,
  Review,
  ActivityEvent,
  PlanId,
} from '@worklink/types'

export function isoDaysFromNow(days: number, hour = 9, minutes = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, minutes, 0, 0)
  return d.toISOString()
}

export function isoMinutesFromNow(minutes: number): string {
  const d = new Date(Date.now() + minutes * 60 * 1000)
  return d.toISOString()
}

export interface MockWorld {
  users: User[]
  jobs: Job[]
  credentials: Credential[]
  conversations: Conversation[]
  messages: Message[]
  reviews: Review[]
  activity: ActivityEvent[]
  subscriptions: Record<string, PlanId>
}

export const DEMO_CLIENT_ID = 'u-sarah'
export const DEMO_MEMBER_ID = 'u-john'

export function buildMockWorld(): MockWorld {
  const users: User[] = [
    {
      id: 'u-sarah',
      role: 'client',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      location: 'Maplewood, NJ',
      bio: 'Homeowner in Maplewood. I care about finding people who do careful, honest work and I always leave a review.',
      joinedAt: isoDaysFromNow(-430),
      avatarHue: 262,
      verification: 'idVerified',
    },
    {
      id: 'u-john',
      role: 'member',
      name: 'John Mitchell',
      email: 'john@example.com',
      location: 'Maplewood, NJ',
      bio: 'Licensed plumber with 12 years of experience. I handle leaks, faucets, water heaters, and drain issues with clean, guaranteed work.',
      joinedAt: isoDaysFromNow(-365 * 4),
      avatarHue: 205,
      verification: 'fullyVerified',
      profession: 'Plumber',
      skills: ['Pipe repair', 'Faucets and fixtures', 'Water heaters', 'Drain cleaning'],
      rate: '$65-85 / hr',
      experienceYears: 12,
      completedJobs: 128,
      averageRating: 4.9,
    },
    {
      id: 'u-michael',
      role: 'member',
      name: 'Michael Torres',
      email: 'michael@example.com',
      location: 'West Orange, NJ',
      bio: 'Master electrician. From ceiling fans to full panel work, I do safe, up-to-code electrical installations.',
      joinedAt: isoDaysFromNow(-365 * 3),
      avatarHue: 152,
      verification: 'fullyVerified',
      profession: 'Electrician',
      skills: ['Wiring and outlets', 'Ceiling fans', 'Lighting', 'Electrical panels'],
      rate: '$70-90 / hr',
      experienceYears: 9,
      completedJobs: 96,
      averageRating: 4.8,
    },
    {
      id: 'u-carlo',
      role: 'member',
      name: 'Carlo Bianchi',
      email: 'carlo@example.com',
      location: 'Montclair, NJ',
      bio: 'Carpenter and furniture specialist. I build custom cabinets, shelving, and repair doors and trim with a focus on detail.',
      joinedAt: isoDaysFromNow(-365 * 4),
      avatarHue: 28,
      verification: 'fullyVerified',
      profession: 'Carpenter',
      skills: ['Custom cabinets', 'Furniture building', 'Trim and molding', 'Doors and frames'],
      rate: '$55-75 / hr',
      experienceYears: 11,
      completedJobs: 74,
      averageRating: 4.7,
    },
    {
      id: 'u-priya',
      role: 'member',
      name: 'Priya Patel',
      email: 'priya@example.com',
      location: 'South Orange, NJ',
      bio: 'Home repair and painting. Drywall, paint, and small fixes done right the first time.',
      joinedAt: isoDaysFromNow(-365 * 2),
      avatarHue: 320,
      verification: 'idVerified',
      profession: 'Home Repair & Painting',
      skills: ['Drywall', 'Painting and finishes', 'Caulking', 'Minor home repairs'],
      rate: '$45-60 / hr',
      experienceYears: 6,
      completedJobs: 51,
      averageRating: 4.6,
    },
    {
      id: 'u-david',
      role: 'member',
      name: 'David Okafor',
      email: 'david@example.com',
      location: 'Newark, NJ',
      bio: 'Electrician focused on lighting and fixture work. Building my reputation one job at a time.',
      joinedAt: isoDaysFromNow(-160),
      avatarHue: 95,
      verification: 'email',
      profession: 'Electrician',
      skills: ['Lighting', 'Ceiling fans', 'Wiring and outlets'],
      rate: '$50-65 / hr',
      experienceYears: 2,
      completedJobs: 18,
      averageRating: 4.2,
    },
    {
      id: 'u-linda',
      role: 'client',
      name: 'Linda Marsh',
      email: 'linda@example.com',
      location: 'Bloomfield, NJ',
      bio: 'Busy homeowner always juggling a home project list.',
      joinedAt: isoDaysFromNow(-600),
      avatarHue: 12,
      verification: 'idVerified',
    },
    {
      id: 'u-marcus',
      role: 'client',
      name: 'Marcus Webb',
      email: 'marcus@example.com',
      location: 'Irvington, NJ',
      bio: 'Homeowner in Irvington.',
      joinedAt: isoDaysFromNow(-300),
      avatarHue: 200,
      verification: 'email',
    },
  ]

  const jobs: Job[] = [
    {
      id: 'j-sink',
      clientId: 'u-sarah',
      title: 'Fix Kitchen Sink Leak',
      category: 'plumbing',
      description:
        'There is a leak underneath my kitchen sink. I need someone to inspect the pipes and repair the issue. It has been dripping constantly for a few days and the cabinet base is starting to swell. Please bring any common replacement parts.',
      location: 'Maplewood, NJ',
      preferredDate: isoDaysFromNow(3),
      budget: { type: 'fixed', amount: 150 },
      createdAt: isoDaysFromNow(-1, 14),
      status: 'open',
      interestedMemberIds: [],
      photoCount: 1,
    },
    {
      id: 'j-fan',
      clientId: 'u-linda',
      title: 'Install Ceiling Fan',
      category: 'electrical',
      description:
        'Replace the existing ceiling light in the living room with a ceiling fan. The wiring box is already in place and rated for a fan.',
      location: 'Bloomfield, NJ',
      preferredDate: isoDaysFromNow(5),
      budget: { type: 'fixed', amount: 180 },
      createdAt: isoDaysFromNow(-2, 10),
      status: 'open',
      interestedMemberIds: [],
      photoCount: 0,
    },
    {
      id: 'j-door',
      clientId: 'u-marcus',
      title: 'Repair Wooden Door',
      category: 'carpentry',
      description:
        'The front door is sticking and the frame is misaligned. It needs realignment and some hinge work. The wood has minor water damage near the bottom edge.',
      location: 'Irvington, NJ',
      preferredDate: isoDaysFromNow(6),
      budget: { type: 'fixed', amount: 120 },
      createdAt: isoDaysFromNow(-3, 9),
      status: 'open',
      interestedMemberIds: [],
      photoCount: 2,
    },
    {
      id: 'j-cabinet',
      clientId: 'u-linda',
      title: 'Build Custom Storage Cabinet',
      category: 'carpentry',
      description:
        'I want a built-in storage cabinet for the hallway with adjustable shelves and a solid wood door. Approximately 36in wide by 78in tall.',
      location: 'Bloomfield, NJ',
      preferredDate: isoDaysFromNow(10),
      budget: { type: 'fixed', amount: 900 },
      createdAt: isoDaysFromNow(-4, 16),
      status: 'reviewing',
      interestedMemberIds: ['u-carlo'],
      photoCount: 3,
    },
    {
      id: 'j-paint',
      clientId: 'u-marcus',
      title: 'Repaint Bedroom Walls',
      category: 'painting',
      description:
        'Paint two bedrooms with a neutral color. Walls are in decent shape, light prep and patching needed. Paint will be provided.',
      location: 'Irvington, NJ',
      preferredDate: isoDaysFromNow(8),
      budget: { type: 'fixed', amount: 320 },
      createdAt: isoDaysFromNow(-5, 11),
      status: 'open',
      interestedMemberIds: [],
      photoCount: 1,
    },
    {
      id: 'j-faucet',
      clientId: 'u-sarah',
      title: 'Replace Bathroom Faucet',
      category: 'plumbing',
      description:
        'Replace the old two-handle bathroom faucet with a new single-handle model I already purchased. Connections are accessible from the cabinet below.',
      location: 'Maplewood, NJ',
      preferredDate: isoDaysFromNow(-2),
      budget: { type: 'fixed', amount: 140 },
      createdAt: isoDaysFromNow(-6, 13),
      status: 'inProgress',
      interestedMemberIds: ['u-michael', 'u-john'],
      selectedMemberId: 'u-michael',
      photoCount: 2,
    },
    {
      id: 'j-porch',
      clientId: 'u-linda',
      title: 'Repair Back Porch Step',
      category: 'homeRepair',
      description:
        'One of the back porch steps is rotted and needs to be replaced. The frame is solid, just the tread board.',
      location: 'Bloomfield, NJ',
      preferredDate: isoDaysFromNow(-13),
      budget: { type: 'fixed', amount: 110 },
      createdAt: isoDaysFromNow(-20, 10),
      completedAt: isoDaysFromNow(-14, 15),
      status: 'completed',
      interestedMemberIds: ['u-priya', 'u-john'],
      selectedMemberId: 'u-priya',
      photoCount: 1,
    },
    {
      id: 'j-toilet',
      clientId: 'u-marcus',
      title: 'Fix Running Toilet',
      category: 'plumbing',
      description:
        'The toilet in the half bath keeps running. Probably needs a new flapper and fill valve.',
      location: 'Irvington, NJ',
      preferredDate: isoDaysFromNow(-28),
      budget: { type: 'fixed', amount: 90 },
      createdAt: isoDaysFromNow(-33, 9),
      completedAt: isoDaysFromNow(-27, 12),
      status: 'completed',
      interestedMemberIds: ['u-john', 'u-david'],
      selectedMemberId: 'u-john',
      photoCount: 0,
    },
  ]

  const credentials: Credential[] = [
    {
      id: 'c-j1',
      memberId: 'u-john',
      category: 'license',
      title: 'Journeyman Plumber License',
      issuer: 'NJ Division of Consumer Affairs',
      number: 'PL-104829',
      issuedAt: isoDaysFromNow(-365 * 11),
      expiresAt: isoDaysFromNow(120),
      status: 'verified',
    },
    {
      id: 'c-j2',
      memberId: 'u-john',
      category: 'certification',
      title: 'Backflow Prevention Certification',
      issuer: 'NJ Water Works Association',
      number: 'BFC-8812',
      issuedAt: isoDaysFromNow(-365 * 3),
      status: 'verified',
    },
    {
      id: 'c-j3',
      memberId: 'u-john',
      category: 'training',
      title: 'OSHA 30-Hour Construction Training',
      issuer: 'OSHA',
      issuedAt: isoDaysFromNow(-365 * 4),
      status: 'verified',
    },
    {
      id: 'c-j4',
      memberId: 'u-john',
      category: 'training',
      title: 'First Aid / CPR Certification',
      issuer: 'American Red Cross',
      issuedAt: isoDaysFromNow(-300),
      status: 'pending',
    },
    {
      id: 'c-m1',
      memberId: 'u-michael',
      category: 'license',
      title: 'Master Electrician License',
      issuer: 'NJ Board of Examiners of Electrical Contractors',
      number: 'EL-88213',
      issuedAt: isoDaysFromNow(-365 * 8),
      expiresAt: isoDaysFromNow(90),
      status: 'verified',
    },
    {
      id: 'c-c1',
      memberId: 'u-carlo',
      category: 'certification',
      title: 'Certified Cabinetmaker',
      issuer: 'Woodwork Career Alliance',
      number: 'WCA-4412',
      issuedAt: isoDaysFromNow(-365 * 5),
      status: 'verified',
    },
    {
      id: 'c-p1',
      memberId: 'u-priya',
      category: 'verification',
      title: 'EPA Lead-Safe Certified Renovator',
      issuer: 'U.S. Environmental Protection Agency',
      number: 'EPA-33210',
      issuedAt: isoDaysFromNow(-365 * 2),
      status: 'verified',
    },
    {
      id: 'c-d1',
      memberId: 'u-david',
      category: 'training',
      title: 'NEC Code Update Course',
      issuer: 'Local 52 Training Center',
      issuedAt: isoDaysFromNow(-60),
      status: 'pending',
    },
  ]

  const conversations: Conversation[] = [
    {
      id: 'c-faucet',
      jobId: 'j-faucet',
      clientId: 'u-sarah',
      memberId: 'u-michael',
      createdAt: isoDaysFromNow(-2, 9),
      updatedAt: isoMinutesFromNow(-35),
      unreadFor: { 'u-sarah': 0, 'u-michael': 0 },
    },
    {
      id: 'c-porch',
      jobId: 'j-porch',
      clientId: 'u-linda',
      memberId: 'u-priya',
      createdAt: isoDaysFromNow(-14, 10),
      updatedAt: isoDaysFromNow(-13, 11),
      unreadFor: { 'u-linda': 0, 'u-priya': 0 },
    },
  ]

  const messages: Message[] = [
    {
      id: 'm-f1',
      conversationId: 'c-faucet',
      senderId: 'u-michael',
      text: 'Hi Sarah, I can take a look at the faucet this week. The model you picked is straightforward to install.',
      createdAt: isoDaysFromNow(-2, 9, 12),
      kind: 'text',
    },
    {
      id: 'm-f2',
      conversationId: 'c-faucet',
      senderId: 'u-sarah',
      text: 'Thanks Michael, that is great to hear. Does Thursday afternoon work?',
      createdAt: isoDaysFromNow(-2, 10, 5),
      kind: 'text',
    },
    {
      id: 'm-f3',
      conversationId: 'c-faucet',
      senderId: 'u-michael',
      text: 'Perfect, I will be there around 2pm. I will bring everything I need.',
      createdAt: isoMinutesFromNow(-35),
      kind: 'text',
    },
    {
      id: 'm-p1',
      conversationId: 'c-porch',
      senderId: 'u-priya',
      text: 'The step is replaced and sealed. Take a look whenever you get a chance!',
      createdAt: isoDaysFromNow(-13, 11),
      kind: 'text',
    },
  ]

  const reviews: Review[] = [
    {
      id: 'r-1',
      jobId: 'j-porch',
      reviewerId: 'u-linda',
      revieweeId: 'u-priya',
      rating: 5,
      comment:
        'Priya replaced the rotted step quickly and matched the existing paint perfectly. She was tidy and easy to communicate with.',
      createdAt: isoDaysFromNow(-12),
    },
    {
      id: 'r-2',
      jobId: 'j-porch',
      reviewerId: 'u-priya',
      revieweeId: 'u-linda',
      rating: 5,
      comment: 'Great client. Clear instructions and flexible with the schedule.',
      createdAt: isoDaysFromNow(-12, 12),
    },
    {
      id: 'r-3',
      jobId: 'j-toilet',
      reviewerId: 'u-marcus',
      revieweeId: 'u-john',
      rating: 5,
      comment:
        'John fixed the running toilet in under an hour. Explained what was wrong and left the bathroom spotless.',
      createdAt: isoDaysFromNow(-25),
    },
    {
      id: 'r-4',
      jobId: 'j-toilet',
      reviewerId: 'u-john',
      revieweeId: 'u-marcus',
      rating: 5,
      comment: 'Pleasant homeowner, easy to coordinate with.',
      createdAt: isoDaysFromNow(-25, 13),
    },
    {
      id: 'r-5',
      jobId: 'j-sump',
      reviewerId: 'u-sarah',
      revieweeId: 'u-john',
      rating: 4,
      comment:
        'John installed the sump pump on schedule and it has been running perfectly. Knocked off a star only because he was 20 minutes late.',
      createdAt: isoDaysFromNow(-200),
    },
  ]

  const activity: ActivityEvent[] = [
    {
      id: 'a-1',
      type: 'jobCreated',
      jobId: 'j-sink',
      userId: 'u-sarah',
      at: isoDaysFromNow(-1, 14),
    },
    {
      id: 'a-2',
      type: 'interest',
      jobId: 'j-faucet',
      userId: 'u-john',
      at: isoDaysFromNow(-3, 11),
    },
    {
      id: 'a-3',
      type: 'selected',
      jobId: 'j-faucet',
      userId: 'u-michael',
      at: isoDaysFromNow(-2, 9),
    },
    {
      id: 'a-4',
      type: 'completed',
      jobId: 'j-porch',
      userId: 'u-priya',
      at: isoDaysFromNow(-14, 15),
    },
    {
      id: 'a-5',
      type: 'review',
      jobId: 'j-toilet',
      userId: 'u-marcus',
      at: isoDaysFromNow(-25),
    },
  ]

  const subscriptions: Record<string, PlanId> = {
    'u-john': 'pro',
    'u-michael': 'premium',
    'u-carlo': 'pro',
    'u-priya': 'basic',
    'u-david': 'basic',
  }

  return {
    users,
    jobs,
    credentials,
    conversations,
    messages,
    reviews,
    activity,
    subscriptions,
  }
}