const positions = [
  "President",
  "Vice-President",
  "Treasurer",
  "General Secretary",
  "Communication Manager",
  "Cultural Affairs Officer",
  "Female Leadership & Woman Empowerment Officer",
  "Multimedia Manager",
];
// Default data

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Articles

defaultArticleData = {
  title: "New Article",

  // image
  articleImage: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8bmV3c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",

  articleSummary: "This is a new article",

  articleContent: "New English Club",

  articleAuthor: "William Shakespeare",

  postedAT: Date.now(),
};

//Weekly Activity
const dailyVocabData = {
  wordOfDay: {
    word: "Resilience",

    wordMeaning: "The ability to be happy, successful, etc. again after something difficult or bad has happened. Reference Cambridge Dictionary",

    learnMoreWord: "Example 1: Having a place that's theirs alone and that doesn't necessarily involve their mom or dad helps kids build resilience and problem-solving skills.",
  },

  IdiomDay: {
    idiom: "To cost an arm and a leg",

    idiomMeaning: "Something is very expensive",

    learnMoreIdiom: "Example 1: Fuel these days costs and arm and a leg.",
  },
};

const clubMeetingData = {
  meetingDate: Date.now(),

  venue: "Afro Language Lab",

  meetingTime: "15:00",

  about: "Climate Change",
};

const onlineDebateData = {
  topicOne: "Money Vs Knowledge",

  debateDateOne: Date.now(),

  debateTimeOne: "15:00",

  topicTwo: "No homework at school",

  debateDateTwo: Date.now(),

  debateTimeTwo: "20:00",

  aboutTopic: "New English Club",
};

// weekly lesson
const weeklyLessonsData = [{
    lessonTitle: "Prepositions",

    // image
    videoLink: "https://www.youtube.com/embed/VaTVklkzFPI",

    lessonSummary: "Use of the prepositions IN, ON and AT ",

    lessonAuthor: "Hadar",

    postedAT: Date.now(),
  },

  {
    lessonTitle: "Dark L vs Light L",

    // image
    videoLink: "https://www.youtube.com/embed/Q2yvSja9G98",

    lessonSummary: "American accent: How to pronounce the letter L",

    lessonAuthor: "Hadar",

    postedAT: Date.now(),
  },
];

// workersOfMonth
// english club article schema
const workersOfMonthData = [{
  studentOfMonth: {
    fullname: "Fullname of the female leader of the month",

    imageUrl: "https://i.ibb.co/VDFyzpj/afrohk-logo-only.jpg",

    reasons: "Title or Occupattion",

    about: "More about the ",
  },

  instructorOfMonth: {
    fullname: "Fullname of the male leader of the Month",

    imageUrl: "https://i.ibb.co/VDFyzpj/afrohk-logo-only.jpg",

    reasons: "Title or Occupation",

    about: "More about the IOM",
  },
}, ];

// media schema
const mediaData = {
  mediaTitle: "Describing my best friend",
  videoLink: "https://www.youtube.com/embed/4nh79-Cbvf0",
};

module.exports = {
  positions,
  days,
  months,
  dailyVocabData,
  clubMeetingData,
  onlineDebateData,
  defaultArticleData,
  weeklyLessonsData,
  workersOfMonthData,
  mediaData,
};