const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');
const Test = require('./models/Test');
const Resource = require('./models/Resource');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_prep')
  .then(() => console.log('Connected to MongoDB for seeding...'))
  .catch(err => console.error('MongoDB connection error:', err));

const Roadmap = require('./models/Roadmap');

const seedData = async () => {
  try {
    // Clear existing data
    await Question.deleteMany({});
    await Test.deleteMany({});
    await Resource.deleteMany({});
    await Roadmap.deleteMany({});
    await User.deleteMany({ role: 'student' });

    console.log('Cleared existing data.');

    // 1. Seed Questions (LeetCode/GFG inspired)
    const questions = [
      {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'Easy',
        company: 'Amazon',
        topic: 'Arrays',
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
        ],
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
        explanation: 'Use a hash map to store the complement of each number as you iterate through the array.'
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        difficulty: 'Medium',
        company: 'Google',
        topic: 'Sliding Window',
        examples: [
          { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' }
        ],
        constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
        explanation: 'Use a sliding window approach with two pointers and a hash set.'
      },
      {
        title: 'Trapping Rain Water',
        description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        difficulty: 'Hard',
        company: 'Microsoft',
        topic: 'Two Pointers',
        examples: [
          { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }
        ],
        constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
        explanation: 'Use two pointers (left and right) and keep track of leftMax and rightMax.'
      },
      {
        title: 'Merge Intervals',
        description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
        difficulty: 'Medium',
        company: 'TCS',
        topic: 'Arrays',
        examples: [
          { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }
        ],
        constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= starti <= endi <= 10^4'],
        explanation: 'Sort the intervals by start time and merge sequentially.'
      },
      {
        title: 'Binary Tree Level Order Traversal',
        description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values.',
        difficulty: 'Medium',
        company: 'Amazon',
        topic: 'Trees',
        examples: [
          { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }
        ],
        constraints: ['The number of nodes in the tree is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
        explanation: 'Use a queue for Breadth First Search (BFS).'
      }
    ];
    await Question.insertMany(questions);
    console.log('Questions seeded.');

    // 2. Seed Mock Tests
    const tests = [
      {
        title: 'Amazon Online Assessment #1',
        description: 'Simulates the actual Amazon OA with 2 coding questions and behavioral assessment.',
        questions: (await Question.find({ company: 'Amazon' })).map(q => q._id),
        duration: 90,
        difficulty: 'Hard',
        totalMarks: 200
      },
      {
        title: 'Google Kickstart Practice',
        description: 'High-level competitive programming questions from previous Kickstart rounds.',
        questions: (await Question.find({ company: 'Google' })).map(q => q._id),
        duration: 120,
        difficulty: 'Expert',
        totalMarks: 300
      },
      {
        title: 'TCS NQT Mock',
        description: 'Standard TCS NQT pattern with focus on logic and arrays.',
        questions: (await Question.find({ company: 'TCS' })).map(q => q._id),
        duration: 60,
        difficulty: 'Easy',
        totalMarks: 100
      }
    ];
    await Test.insertMany(tests);
    console.log('Tests seeded.');

    // 3. Seed Resources
    const resources = [
      {
        title: 'Google Style Resume Template',
        type: 'Template',
        description: 'A minimalist, ATS-friendly resume template used by successful candidates at Google and Meta.',
        url: 'https://docs.google.com/document/d/1X38h8W1W-555',
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=400'
      },
      {
        title: 'Top 50 Behavioral Questions',
        type: 'Questions',
        description: 'Comprehensive list of behavioral questions with STAR method answer templates.',
        url: 'https://www.indeed.com/career-advice/interviewing/behavioral-interview-questions',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400'
      },
      {
        title: 'Striver\'s SDE Sheet',
        type: 'PDF',
        description: 'The ultimate guide for placement preparation covering all major DSA topics.',
        url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'
      },
      {
        title: 'System Design Primer',
        type: 'Video',
        description: 'A comprehensive video series on scaling systems and architecture.',
        url: 'https://www.youtube.com/watch?v=SqcXvc3zm8c',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400'
      }
    ];
    await Resource.insertMany(resources);
    console.log('Resources seeded.');

    const roadmaps = [
      {
        title: 'Data Structures & Algorithms',
        description: 'The foundation of technical interviews. Master complexity analysis, dynamic programming, and graphs.',
        tag: 'STANDARD',
        color: 'bg-blue-600',
        milestones: [
          { label: 'Milestone 1: Arrays & Hashing', topics: ['Array', 'Hash Table'] },
          { label: 'Milestone 2: Two Pointers & Slid. Window', topics: ['Two Pointers', 'Sliding Window'] },
          { label: 'Milestone 3: Trees & Graphs', topics: ['Trees', 'Graphs'] }
        ]
      },
      {
        title: 'System Design',
        description: 'Learn to scale applications to millions of users. Covers load balancing, caching, and sharding.',
        tag: 'ADVANCED',
        color: 'bg-slate-900',
        milestones: [
          { label: 'Milestone 1: Scaling Fundamentals', topics: ['Vertical Scaling', 'Horizontal Scaling'] },
          { label: 'Milestone 2: Databases & Storage', topics: ['SQL', 'NoSQL'] }
        ]
      }
    ];
    await Roadmap.insertMany(roadmaps);
    console.log('Roadmaps seeded.');

    // 4. Seed Indian Students (Sample Users)
    const students = [
      { name: 'Aish Maheshwari', email: 'aish@example.com', password: 'password123', role: 'student' },
      { name: 'Rahul Sharma', email: 'rahul@example.com', password: 'password123', role: 'student' },
      { name: 'Priya Singh', email: 'priya@example.com', password: 'password123', role: 'student' }
    ];
    // We need to use User.save() to trigger password hashing if it's there, but for seed we can just insert
    // Actually User.js has a pre-save hook, so let's do it one by one
    for (const s of students) {
      const user = new User(s);
      await user.save();
    }
    console.log('Indian student users seeded.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
