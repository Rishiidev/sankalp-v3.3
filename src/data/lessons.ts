export interface CourseLesson {
  id: string;
  title: string;
  description: string;
  format: 'video' | 'audio' | 'text' | 'practice';
  duration: string;
  content: string;
}

export interface CourseDay {
  day: number;
  title: string;
  theme: string;
  lessons: CourseLesson[];
}

export const hanumanBlueprint: CourseDay[] = [
  {
    day: 1,
    title: "Entering Hanuman's Energy",
    theme: "Who is Hanuman, what is sadhana, intention & safety",
    lessons: [
      {
        id: "1.1",
        title: "What Is Hanuman Sadhana?",
        description: "A clear, grounded introduction to sadhana and why Hanuman is the perfect guide.",
        format: "text",
        duration: "5 min",
        content: "In spiritual traditions, sadhana simply means a disciplined, daily practice that connects you to the Divine and transforms your inner world.\n\nIn this course, your path of sadhana is guided by Shri Hanuman – the fearless devotee of Shri Ram, celebrated for his unshakable courage, immense strength, razor-sharp intelligence, and complete humility.\n\nWhen you remember Hanuman, you are not just worshipping a form. You are awakening Hanuman's qualities inside yourself – the part of you that does not give up, that stands for dharma, that serves selflessly, and that bows only to truth.\n\nOver the next 7 days, you will learn a simple and powerful way to connect with Hanuman through daily chanting, Hanuman Chalisa, gentle discipline, and inner reflection. This is not a complicated ritual course. It is a heart-based journey to become more fearless, focused, and devoted."
      },
      {
        id: "1.2",
        title: "Your Sankalp: Why Are You Here?",
        description: "Create a clear inner sankalp (resolve) and learn important do's and don'ts before you begin.",
        format: "text",
        duration: "5 min",
        content: "Before any sadhana, it is essential to know why you are practicing. This is called your sankalp – a heartfelt resolve you offer at the feet of the Divine.\n\nTake a moment to notice: What brings you to Hanuman today? It may be fear, stress, health challenges, family issues, or simply a longing to connect more deeply with the Divine. Whatever it is, hold it gently in your heart.\n\nNow refine your intention. Instead of 'I want to control others' or 'I want revenge,' let your sankalp be rooted in healing, courage, clarity, and dharma.\n\nIn this journey, you commit to ahimsa (non-harm), truthful living, and respect for yourself and others. With this clarity, your path becomes aligned with Hanuman's own pure devotion."
      },
      {
        id: "1.3",
        title: "Guided Connection to Hanuman",
        description: "Create an emotional, imaginal connection with Hanuman as a living presence.",
        format: "practice",
        duration: "5-10 min",
        content: "Sit comfortably. Close your eyes. Let your breath settle into a natural, relaxed rhythm.\n\nVisualize a gentle light at your heart center. Within this light, see Hanuman's form—strong, peaceful, and devoted.\n\nSoftly repeat the name 'Jai Hanuman' or 'Shri Hanumate Namah' a few times in your mind.\n\nEnd with a short prayer: 'Hanuman, guide me on this 7-day journey. Grant me the strength to face my fears and the devotion to walk in truth.'"
      }
    ]
  },
  {
    day: 2,
    title: "Preparing Your Life & Space",
    theme: "Lifestyle rules, space setup, basic routine",
    lessons: [
      {
        id: "2.1",
        title: "Create Your Hanuman Corner",
        description: "Step-by-step guidance to set up a clean, energized space for your daily Hanuman sadhana.",
        format: "text",
        duration: "5 min",
        content: "A dedicated space helps your mind slip into sadhana more easily. When you return to the same spot each day, the energy of your devotion gradually builds there.\n\nChoose a quiet, clean corner where you can sit comfortably. Place a small table or shelf. Cover it with a clean cloth. On this, keep a picture or murti of Shri Hanuman. If you like, you can also place images of Shri Ram, Sita, and Lakshman to remind yourself of Hanuman's devotion.\n\nAdd a small diya (preferably with ghee or sesame oil), some incense, and a small bowl or plate where you can offer flowers or simple prasad like fruit or sweets. Do not worry about perfection – sincerity is more important than decoration."
      },
      {
        id: "2.2",
        title: "How to Live During These 7 Days",
        description: "Simple lifestyle guidelines that support your Hanuman sadhana without making your life rigid or extreme.",
        format: "text",
        duration: "5 min",
        content: "For the next 7 days, try to follow these simple Hanuman Disciplines:\n\n- Cleanliness: Bathe daily and wear clean, modest clothes during practice. Keep your altar area tidy.\n- Speech: Avoid gossip, lies, harsh words, and unnecessary arguments. Speak less, and when you speak, choose kindness and truth.\n- Food: As much as possible, eat fresh, sattvic food. Minimize or avoid alcohol, tobacco, and other intoxicants.\n- Brahmacharya: Use your vital energy wisely. Respect your own body and the bodies of others. Reduce over-stimulation (excessive social media, etc.).\n- Seva: Each day, perform a small act of service without expecting anything in return.\n\nYou do not have to be perfect. Treat these as loving commitments, not punishments."
      },
      {
        id: "2.3",
        title: "First Simple Hanuman Puja",
        description: "Experience a gentle, simple puja you can repeat daily.",
        format: "practice",
        duration: "10 min",
        content: "1. Stand or sit before the altar. Take 3 deep breaths.\n2. Mentally touch your head and heart and silently say: 'I bow to Shri Hanuman and invite you into my home and heart.'\n3. Light the diya and incense (if safe).\n4. Offer a flower or simple prasad.\n5. Join your palms and close your eyes for 1–2 minutes in silent gratitude.\n6. End with a simple prayer in your own words, or: 'Hanuman, bless me with strength, courage, clarity, and devotion.'"
      }
    ]
  },
  {
    day: 3,
    title: "Voice of Devotion",
    theme: "Introduction to Hanuman Chalisa and simple mantra",
    lessons: [
      {
        id: "3.1",
        title: "Hanuman Chalisa: Your Daily Shield",
        description: "Understand what Hanuman Chalisa is, how it is structured, and why millions rely on it daily.",
        format: "text",
        duration: "5 min",
        content: "The Hanuman Chalisa is one of the most loved prayers in the world. It was composed by the saint Tulsidas and contains a brief opening, forty verses praising Hanuman's qualities and deeds, and a closing section of blessings.\n\nEach verse is like a doorway into Hanuman's character – his strength, intelligence, humility, and unshakeable devotion to Shri Ram. When you recite the Chalisa regularly, you are not just chanting words. You are soaking your mind in these qualities, again and again.\n\nMany practitioners experience less fear, more courage, protection from negativity, and inner stability when they maintain a regular Chalisa practice."
      },
      {
        id: "3.2",
        title: "Your Daily Mantra: Japa With Hanuman",
        description: "Learn a simple Hanuman mantra and how to chant it with a mala or using the in-app counter.",
        format: "text",
        duration: "5 min",
        content: "Along with Hanuman Chalisa, many devotees chant a short mantra to keep Hanuman's presence with them throughout the day. In this course, you will work with a simple, widely used mantra:\n\n'Om Hanumate Namah' – I bow to Hanuman, the divine helper and protector.\n\nYou can chant this mantra on a mala, counting each bead, or you can simply tap along with the in-app japa counter in the Sadhana tab. In the beginning, aim for 11 or 21 repetitions each day. Focus more on sincerity than on speed."
      },
      {
        id: "3.3",
        title: "Chant 'Om Hanumate Namah'",
        description: "Practice chanting the mantra 21 times.",
        format: "practice",
        duration: "5 min",
        content: "Go to the Sadhana tab, select the 'Om Hanumate Namah' mantra preset, and complete 21 chants using the Digital Mala."
      }
    ]
  },
  {
    day: 4,
    title: "Building Daily Flow",
    theme: "Morning–evening sadhana pattern",
    lessons: [
      {
        id: "4.1",
        title: "Your Morning With Hanuman",
        description: "A simple, repeatable morning sequence to energize your body, mind, and devotion.",
        format: "text",
        duration: "5 min",
        content: "For the next 10–15 minutes, your only responsibility is to be fully here. Over time, this will become the strongest part of your day.\n\n1. Wake and cleanse (1–2 min): Wash face, hands, and mouth; if possible, bathe before practice.\n2. Centering breath (2 min): 10–12 slow, deep breaths.\n3. Short physical warm-up (3–4 min): Gentle stretches to awaken the body.\n4. Mantra japa (3–5 min): 21 repetitions of 'Om Hanumate Namah'.\n5. Chalisa (2–3 min): Listen to or recite the Hanuman Chalisa."
      },
      {
        id: "4.2",
        title: "Close the Day at Hanuman's Feet",
        description: "Wind down with a short puja, a few minutes of chanting, and honest reflection.",
        format: "text",
        duration: "5 min",
        content: "1. Light a diya at the altar.\n2. Offer a flower or a small sweet (or even just water with devotion).\n3. Chant either the Chalisa once, or a shorter combination (few verses + mantra).\n4. Sit quietly for 2–3 minutes and review your day in Hanuman's presence – where you acted with courage and truth, and where you lost balance.\n5. End with: 'Hanuman, thank you for today. Help me do better tomorrow.'"
      },
      {
        id: "4.3",
        title: "Evening Reflection",
        description: "Reflect on your day's actions.",
        format: "practice",
        duration: "5 min",
        content: "Ask yourself:\n- Where did I act from fear today?\n- Where did I act from courage and love?\n- One thing I want to improve tomorrow is...\n\n(You can log this in your journal on the Profile tab)."
      }
    ]
  },
  {
    day: 5,
    title: "Courage & Strength",
    theme: "Hanuman stories + inner work",
    lessons: [
      {
        id: "5.1",
        title: "Remembering Your Hidden Strength",
        description: "The story of Hanuman's ocean leap as a teaching on self-doubt, courage, and trust.",
        format: "text",
        duration: "5 min",
        content: "When the Vanara army reached the ocean, they despaired. How could they cross it to reach Lanka? Hanuman sat quietly, having forgotten his own divine strength due to a childhood curse.\n\nJambavan, the wise bear, approached Hanuman and reminded him of his true nature, his divine birth, and his limitless power. Upon hearing this, Hanuman grew in size, his self-doubt vanished, and he took a joyous, effortless leap across the ocean.\n\nWhere in your life right now are you standing at the edge of your own 'ocean' – thinking it is impossible to cross? What if, like Hanuman, you are much stronger than you remember? Today, offer this situation to Hanuman and ask for the courage to take the first leap."
      },
      {
        id: "5.2",
        title: "Chant Through Your Fear",
        description: "Use today's mantra round to name a specific fear and chant through it with Hanuman's support.",
        format: "practice",
        duration: "10 min",
        content: "Bring to mind one fear or situation that feels like a huge ocean in front of you. Do not fight it, just see it clearly.\n\nNow, as you chant 'Om Hanumate Namah' 51 times, imagine Hanuman growing larger and brighter in your heart, and your fear becoming smaller in his light. With each repetition, let one layer of tension drop from your body and mind.\n\nYou are not chanting to escape your life; you are chanting to walk into it with Hanuman by your side."
      }
    ]
  },
  {
    day: 6,
    title: "Devotion & Surrender",
    theme: "Bhakti, humility, service",
    lessons: [
      {
        id: "6.1",
        title: "Power With a Bowed Head",
        description: "A heart-opening story on how true strength always bows to love and truth.",
        format: "text",
        duration: "5 min",
        content: "After extraordinary feats—leaping the ocean, burning Lanka, bringing the Sanjeevani mountain—Hanuman never demanded a reward. When Shri Ram asked how he could repay him, Hanuman simply asked to remain his devoted servant forever.\n\nHis joy is in serving Rama and Sita. This becomes a mirror for how we can bring devotion and service into ordinary life. True strength does not need to boast; it finds its highest expression in humble service."
      },
      {
        id: "6.2",
        title: "Serve Like Hanuman, Where You Are",
        description: "Turn your devotion into action through small, consistent acts of service.",
        format: "practice",
        duration: "Throughout the day",
        content: "Hanuman's devotion is not passive. It is active, courageous service. You may not be crossing oceans or fighting demons, but you can live the same spirit of seva in daily life.\n\nAsk yourself today: 'Who can I support today?' It could be as simple as listening deeply to a friend, helping at home without being asked, feeding a hungry being, or giving your time and skills to someone who needs them.\n\nWhen done with the thought, 'Hanuman, please accept this as my little seva,' even a small act becomes sacred."
      }
    ]
  },
  {
    day: 7,
    title: "Completion & Continuation",
    theme: "Closing the 7-day vrata and next steps",
    lessons: [
      {
        id: "7.1",
        title: "Completing 7 Days: Offering It Back",
        description: "Understand how to complete this 7-day journey and how to carry its energy forward.",
        format: "text",
        duration: "5 min",
        content: "Reaching Day 7 does not mean your relationship with Hanuman ends. It means your formal sankalp for these 7 days has been honored. Now you offer its fruits back to the Divine.\n\nIn traditional vrats, devotees often mark completion with a special puja, extra chanting, and sharing prasad or charity. You can do the same in a simple way.\n\nTake a moment to look back at the last week. Notice any small shifts – in your mind, your habits, your energy. Offer all of this, including your struggles and mistakes, at Hanuman's feet. Let him reshape it in the way that is best for your growth."
      },
      {
        id: "7.2",
        title: "Where to Go From Here",
        description: "Choose a sustainable way to keep Hanuman in your daily life.",
        format: "text",
        duration: "5 min",
        content: "You now have enough tools to design your own Hanuman routine. Here are three paths you can choose from:\n\n- Daily Minimum: 1 diya, one simple prayer, 11 mantras, and a few lines of Chalisa. This takes around 5–10 minutes and is ideal for busy days.\n- Steady Practice: Morning and evening routines from Day 4, plus one small act of seva daily. This keeps your connection strong.\n- Deeper Vrat (Advanced): In the future, if you feel ready and can maintain more discipline, you may explore a 21- or 40-day Hanuman Chalisa vrat under proper guidance.\n\nFor now, choose stability over intensity. A small practice you do daily is more powerful than a big practice you drop in a week."
      },
      {
        id: "7.3",
        title: "Special Completion Puja",
        description: "Mark the end of the 7-day course with a heartfelt practice.",
        format: "practice",
        duration: "15 min",
        content: "1. Perform your usual simple puja steps.\n2. Chant the full Hanuman Chalisa (or listen to it with full attention).\n3. Gratitude round: Name people, situations, and inner shifts from the past week and offer them to Hanuman.\n4. Closing sankalp: 'Hanuman, please stay in my heart and guide my mind, speech, and actions.'"
      }
    ]
  }
];

export const shivaBlueprint: CourseDay[] = [
  {
    day: 1,
    title: "Entering Shiva's Stillness",
    theme: "Who is Shiva, intention, and meditative quiet",
    lessons: [
      {
        id: "1.1",
        title: "What Is Shiva Sadhana?",
        description: "Introduction to Shiva consciousness and why it brings ultimate peace.",
        format: "text",
        duration: "5 min",
        content: "Shiva is the infinite, boundless consciousness that remains untouched by the chaos of the world. Engaging in Shiva Sadhana means stepping back from the anxious movements of the mind and resting in pure awareness.\n\nIn this 7-day journey, we will explore silence, inner focus, and the power of the Panchakshara Mantra (Om Namah Shivaya). By remembering Shiva, you dissolve negative ego and invite profound stability into your life."
      },
      {
        id: "1.2",
        title: "Your Sankalp: The Resolve of the Heart",
        description: "Determine your intention for calling upon Mahadev.",
        format: "text",
        duration: "5 min",
        content: "Close your eyes and ask yourself why you are connecting with Shiva today. Often, we come to Shiva to burn away obstacles, to seek peace from a restless mind, or to find liberation from old patterns.\n\nSet a pure intention (sankalp). 'May this sadhana burn away my ignorance, reduce my worldly anxiety, and help me rest in the light of consciousness.'"
      },
      {
        id: "1.3",
        title: "Guided Connection to Shiva",
        description: "A short, stillness-based visualization.",
        format: "practice",
        duration: "5-10 min",
        content: "Sit comfortably and straighten your spine. Close your eyes.\n\nImagine a brilliant, cool white light at the crown of your head, like the crescent moon Shiva wears. Let this gentle, cooling light wash over your entire body, settling into your heart.\n\nSilently repeat 'Om Namah Shivaya' with your natural breath. Let any thoughts arise and dissolve, just like ash."
      }
    ]
  },
  {
    day: 2,
    title: "The Altar of Silence",
    theme: "Setting up space for Shiva and purifying lifestyle",
    lessons: [
      {
        id: "2.1",
        title: "Create Your Shiva Space",
        description: "Setting up a clean context for Shiva worship.",
        format: "text",
        duration: "5 min",
        content: "Shiva is easily pleased (Bholenath), so your altar can be exquisitely simple. Find a quiet spot. Place a picture of Lord Shiva, a Shivalinga, or simply an empty space representing the formless (Nirguna) Absolute.\n\nOffer a diya, some fresh water, and a flower or Bael leaf if available. The true offering to Shiva is a peaceful mind."
      },
      {
        id: "2.2",
        title: "The Discipline of Ash",
        description: "Detachment and simplicity in daily actions.",
        format: "text",
        duration: "5 min",
        content: "Shiva wears ash to signify that all material things are temporary. During these 7 days, practice the 'Discipline of Ash' by practicing detachment.\n\n- Notice when you become aggressively attached to a specific outcome, and practice letting it go.\n- Keep your food simple and sattvic.\n- Dedicate time to absolute silence (Mouna) everyday, even if just for 10 minutes.\n- Speak truthfully and without unnecessary drama."
      },
      {
        id: "2.3",
        title: "Offering Water (Jal Arpan)",
        description: "A gentle offering practice.",
        format: "practice",
        duration: "10 min",
        content: "At your altar, pour clear water gently over the Shivalinga (if you have one) or simply offer water in a small vessel to the image of Shiva, while slowly chanting 'Om Namah Shivaya' 11 times. See this water as the calming of your own mind."
      }
    ]
  },
  {
    day: 3,
    title: "The Great Mantra",
    theme: "Om Namah Shivaya",
    lessons: [
      {
        id: "3.1",
        title: "Om Namah Shivaya: The Five Syllables",
        description: "Understanding the Panchakshari Mantra.",
        format: "text",
        duration: "5 min",
        content: "Om Namah Shivaya is a profoundly ancient and powerful mantra. 'Om' is the sound of the universe. 'Namah' means to bow or surrender. 'Shivaya' means the inner reality or Lord Shiva.\n\nThe five syllables (Na-Ma-Shi-Va-Ya) represent the five elements of the universe: Earth, Water, Fire, Air, and Space. Chanting it balances these elements within your own body and mind, leading to health and spiritual awakening."
      },
      {
        id: "3.2",
        title: "How to Chant Namah Shivaya",
        description: "The mechanics of Japa for Shiva.",
        format: "text",
        duration: "5 min",
        content: "Chant the mantra softly, matching it with your breath. As you inhale, mentally say 'Om'. As you exhale, mentally say 'Namah Shivaya'. Alternatively, just chant the whole mantra continuously.\n\nUse a Rudraksha mala if you have one, or the digital mala in the app. Aim for deep, unbroken concentration rather than speed."
      },
      {
        id: "3.3",
        title: "108 Chants of Shiva",
        description: "Complete one Mala.",
        format: "practice",
        duration: "10 min",
        content: "Open the Sadhana tab. Select 'Om Namah Shivaya'. Turn on focus mode and complete one full mala (108 repetitions) with utmost sincerity."
      }
    ]
  },
  {
    day: 4,
    title: "Meditative Balance",
    theme: "Morning and evening Shiva flow",
    lessons: [
      {
        id: "4.1",
        title: "Awakening with Shiva",
        description: "A peaceful morning sequence.",
        format: "text",
        duration: "5 min",
        content: "1. Wake up and bathe. Water purifies the body, just as mantra purifies the mind.\n2. Sit quietly. Take 10 deep breaths, drawing in the cool energy of the morning.\n3. Chant 'Om Namah Shivaya' 21 times.\n4. Pray: 'Lord Shiva, help me remain calm and focused throughout my day.'"
      },
      {
        id: "4.2",
        title: "Resting with Mahadev",
        description: "An evening sequence for detachment.",
        format: "text",
        duration: "5 min",
        content: "At night, we return our awareness to the source.\n\n1. Wash up to wash away the day's physical and mental dust.\n2. Light a small diya.\n3. Chant 'Om Namah Shivaya' 21 times.\n4. Reflect on the day without attachment. Watch the day's events play like a movie in your mind, then let them burn to ash."
      },
      {
        id: "4.3",
        title: "Letting Go Reflection",
        description: "Daily self-inquiry.",
        format: "practice",
        duration: "5 min",
        content: "Ask yourself: 'What burdens did I carry today that are purely created by my mind?' Identify one mental burden and consciously surrender it to Shiva."
      }
    ]
  },
  {
    day: 5,
    title: "The Dance and the Stillness",
    theme: "Nataraja and pure awareness",
    lessons: [
      {
        id: "5.1",
        title: "The Cosmic Dance of Nataraja",
        description: "Balancing action and stillness.",
        format: "text",
        duration: "5 min",
        content: "Shiva is known as Nataraja, the Lord of Dance. In one hand, he holds fire (destruction); in another, a drum (creation). Within the wild spin of the cosmic dance, the center of his face remains supremely calm.\n\nThis is a teaching for us: The world will always be dancing around us—chaos, work, relationships, challenges. True spiritual practice means remaining deeply calm in the center while efficiently performing your duties on the outside."
      },
      {
        id: "5.2",
        title: "Chanting in the Fire",
        description: "Finding peace in the middle of anxiety.",
        format: "practice",
        duration: "10 min",
        content: "Sit down and bring to mind a situation that makes you feel anxious, hurried, or unbalanced. Hold it in your mind, but refuse to emotionally engage with it.\n\nNow, chant 'Om Namah Shivaya' 51 times. With each chant, imagine yourself stepping back into the calm center, watching the anxiety dance, but not becoming it."
      }
    ]
  },
  {
    day: 6,
    title: "The Poison and the Nectar",
    theme: "Transforming negativity (Neelakantha)",
    lessons: [
      {
        id: "6.1",
        title: "Drinking the Poison",
        description: "How Neelakantha teaches us to handle toxicity.",
        format: "text",
        duration: "5 min",
        content: "When the ocean was churned, a deadly poison emerged that threatened to destroy the universe. Shiva drank it, but held it in his throat, turning it blue (Neelakantha). He didn't swallow it (internalize the negativity), nor did he spit it out (project it back onto others).\n\nWhen people speak harshly to us, or we face toxic situations, our instinct is to swallow it and become depressed, or spit it out in anger. Shiva teaches a middle path: hold it in the throat of discrimination safely, preventing it from harming you or anyone else."
      },
      {
        id: "6.2",
        title: "Forgiveness as Detoxification",
        description: "Practice holding toxicity gracefully.",
        format: "practice",
        duration: "Throughout the day",
        content: "Today, when you encounter frustration, anger, or harshness, pause. Take a deep breath. Do not immediately react, and do not let it ruin your self-worth. Mentally offer that 'poison' to Shiva, and respond with practical clarity rather than emotional venom."
      }
    ]
  },
  {
    day: 7,
    title: "Becoming the Silence",
    theme: "Wrap up and carrying the peace forward",
    lessons: [
      {
        id: "7.1",
        title: "The Infinite Horizon",
        description: "Closing the 7-day Shiva integration.",
        format: "text",
        duration: "5 min",
        content: "The essence of Shiva Sadhana is realizing that Shiva is not a person far away in the Himalayas, but the very silence that exists between your thoughts.\n\nAs we close this 7-day period, recognize how much quieter your inner world has become. The goal is to carry this quietude with you into your daily work."
      },
      {
        id: "7.2",
        title: "Moving Forward with Mahadev",
        description: "Sustaining the practice.",
        format: "text",
        duration: "5 min",
        content: "To keep this connection alive:\n- Chant at least 11 times of 'Om Namah Shivaya' every morning.\n- Choose one day a week (often Monday) to eat lightly, remain mostly silent, and perform an extra mala of japa.\n- Whenever you feel stressed, take three breaths and picture the crescent moon."
      },
      {
        id: "7.3",
        title: "Final Offering of Light",
        description: "A closing Aarti and prayer.",
        format: "practice",
        duration: "15 min",
        content: "1. Sit at your altar.\n2. Light your diya and gently wave it in circles before the image of Shiva, feeling deep gratitude.\n3. Chant a full mala of 'Om Namah Shivaya' (108 times).\n4. Silently say: 'Om Shanti, Shanti, Shanti. May all beings be peaceful. I bow to the divine within.'"
      }
    ]
  }
];

export const krishnaBlueprint: CourseDay[] = [
  {
    day: 1,
    title: "Entering Krishna's Joy",
    theme: "Who is Krishna, Divine Love, and Play (Leela)",
    lessons: [
      {
        id: "1.1",
        title: "The Path of Joyful Devotion",
        description: "An introduction to Krishna and the path of Bhakti.",
        format: "text",
        duration: "5 min",
        content: "Krishna is the embodiment of divine love, eternal wisdom, and joyful play (Leela). Sadhana guided by Krishna is less about strict aesthetics and more about awakening the heart to profound, unconditional love for the Divine.\n\nOver the next 7 days, we will learn to see the Divine in everything, acting with devotion, and chanting the sweet names of Hari. This is a path of lightness, surrender, and deep inner happiness."
      },
      {
        id: "1.2",
        title: "Your Sankalp: The Flute's Call",
        description: "Setting a heart-centered intention.",
        format: "text",
        duration: "5 min",
        content: "Krishna plays his flute to call the soul back to its true home. Why have you answered the call today? Is your heart heavy? Are you seeking purpose? Are you craving true love?\n\nForm your sankalp: 'O Krishna, play the flute of your wisdom in my heart. Let my life become a song of devotion to You. Remove my anxieties and replace them with joy.'"
      },
      {
        id: "1.3",
        title: "Guided Connection to Krishna",
        description: "Visualizing the divine form of Shyam.",
        format: "practice",
        duration: "5-10 min",
        content: "Sit comfortably, close your eyes, and take a few relaxing breaths.\n\nVisualize a beautiful forest grove. In the center stands Krishna, beautifully adorned, holding his flute, smiling warmly at you. Feel his gaze filled with pure, unconditional acceptance.\n\nMentally chant 'Hare Krishna' or 'Om Namo Bhagavate Vasudevaya' slowly. End by asking for his guidance."
      }
    ]
  },
  {
    day: 2,
    title: "The Sacred Space inside the Heart",
    theme: "Setting up your Krishna Altar",
    lessons: [
      {
        id: "2.1",
        title: "Creating Vrindavan at Home",
        description: "Setting up a loving space.",
        format: "text",
        duration: "5 min",
        content: "Krishna worship is famously beautiful and loving. Set up a small altar with a picture or murti of Krishna (or Radha-Krishna). Decorate it warmly. \n\nKrishna says in the Gita: 'If one offers Me with love and devotion a leaf, a flower, fruit or water, I will accept it.' It is the love that matters, not the grandeur."
      },
      {
        id: "2.2",
        title: "Living with Love",
        description: "The discipline of Bhakti.",
        format: "text",
        duration: "5 min",
        content: "For these 7 days, your primary discipline is to act out of love.\n- Speak to others as if Krishna resides in their hearts.\n- Eat fresh, vegetarian (sattvic) food, and mentally offer your food to Krishna before eating.\n- Practice keeping a slight, gentle smile, remembering that the universe is a divine play."
      },
      {
        id: "2.3",
        title: "The Offering of the Heart",
        description: "A first prayer of surrender.",
        format: "practice",
        duration: "10 min",
        content: "At your altar, light a lamp or incense. Offer a small flower or a basil (Tulsi) leaf if you have one. Close your eyes and say, 'Everything I have is yours. I surrender my worries and my joy to you.'"
      }
    ]
  },
  {
    day: 3,
    title: "The Maha Mantra",
    theme: "The Great Chant of Liberation",
    lessons: [
      {
        id: "3.1",
        title: "The Power of the Name",
        description: "Understanding Hare Krishna.",
        format: "text",
        duration: "5 min",
        content: "In the Krishna tradition, the name of God is considered non-different from God Himself. The Maha Mantra ('Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare / Hare Rama, Hare Rama, Rama Rama, Hare Hare') is a joyful prayer asking the Divine Energy (Hare) and the Supreme Lord (Krishna/Rama) to engage you in their loving service."
      },
      {
        id: "3.2",
        title: "Japa Yoga: How to Chant",
        description: "Engaging the mind in the sweet names.",
        format: "text",
        duration: "5 min",
        content: "Chant the mantra clearly, making sure to hear each syllable. When the mind wanders to your to-do list, gently bring it back to the sound of the Name. It does not need to be forceful; it is a loving redirection."
      },
      {
        id: "3.3",
        title: "108 Names of Joy",
        description: "Chant one mala of the Maha Mantra.",
        format: "practice",
        duration: "10-15 min",
        content: "Go to the Sadhana tab. Select the Maha Mantra preset. Complete 108 repetitions using the digital mala. Let the rhythm naturally lift your spirits."
      }
    ]
  },
  {
    day: 4,
    title: "Karma Yoga: Action in Inaction",
    theme: "Wisdom from the Bhagavad Gita",
    lessons: [
      {
        id: "4.1",
        title: "The Secret of Work",
        description: "Understanding non-attachment in the Gita.",
        format: "text",
        duration: "5 min",
        content: "Krishna tells Arjuna: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.'\n\nThis means you should do your best at work, in relationships, and in life, but surrender the outcome to Krishna. Anxiety comes from obsessing over the outcome. Peace comes from doing the action as an offering."
      },
      {
        id: "4.2",
        title: "Turning Work into Worship",
        description: "Practical Karma Yoga.",
        format: "text",
        duration: "5 min",
        content: "Today, take any mundane task—washing dishes, typing an email, or driving. Before you begin, silently say: 'I do this for You.' Watch how the quality of your work changes when it is no longer for your own ego, but an offering to the Divine."
      },
      {
        id: "4.3",
        title: "Evening Review of Action",
        description: "Self-Reflection Practice.",
        format: "practice",
        duration: "5 min",
        content: "Sit quietly and ask: 'Did I work today out of anxiety for the future, or did I work with focus and surrender?' Offer today's successes and failures at Krishna's lotus feet."
      }
    ]
  },
  {
    day: 5,
    title: "Seeing Krishna in Everything",
    theme: "Universal Vision",
    lessons: [
      {
        id: "5.1",
        title: "The Thread on the Pearls",
        description: "Recognizing the divine everywhere.",
        format: "text",
        duration: "5 min",
        content: "Krishna says, 'There is nothing higher than Me, O Arjuna. Everything rests upon Me, as pearls are strung on a thread.' To a true devotee, a beautiful sunrise, the laugh of a child, and even challenges are just different expressions of Krishna's energy.\n\nWhen we see the Divine in all things, we lose our anger and prejudices. The world becomes a temple."
      },
      {
        id: "5.2",
        title: "The Practice of Presence",
        description: "Spotting the Divine today.",
        format: "practice",
        duration: "Throughout the day",
        content: "Today, try to consciously remember Krishna 5 times outside of your meditation space. Look at a tree, gaze at the sky, or look into the eyes of a loved one and mentally say, 'I see the Divine playing here.' Notice how this shifts your mood."
      }
    ]
  },
  {
    day: 6,
    title: "Complete Surrender",
    theme: "Saranagati (Refuge)",
    lessons: [
      {
        id: "6.1",
        title: "Dropping the Heavy Burden",
        description: "The promise of the 18th chapter.",
        format: "text",
        duration: "5 min",
        content: "At the very end of the Bhagavad Gita, after explaining all types of yoga and philosophy, Krishna gives His ultimate instruction: 'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.'\n\nSurrender doesn't mean giving up on life. It means giving up the illusion that you carry the weight of the universe. It is deeply relaxing."
      },
      {
        id: "6.2",
        title: "The Meditation of Trust",
        description: "A guided surrender.",
        format: "practice",
        duration: "10 min",
        content: "Sit comfortably and chant your chosen Krishna mantra 51 times. With every single chant, consciously 'exhale' a worry. Worry about money, health, opinions of others—hand it all over. Say to Krishna, 'You are the driver of my chariot. Take the reins.'"
      }
    ]
  },
  {
    day: 7,
    title: "The Unbroken Song",
    theme: "Completion and lifelong devotion",
    lessons: [
      {
        id: "7.1",
        title: "The Endless Leela",
        description: "Understanding that the practice never ends, it only sweetens.",
        format: "text",
        duration: "5 min",
        content: "You have completed 7 days of syncing your heart with Krishna's frequency. This is just the beginning of discovering the immense joy of Bhakti Yoga.\n\nCarry the sweetness of the Name and the wisdom of detached action forward into every aspect of your life."
      },
      {
        id: "7.2",
        title: "Sustaining the Joy",
        description: "Keeping the connection.",
        format: "text",
        duration: "5 min",
        content: "- Always offer your food (even mentally) before you eat.\n- Dedicate 10-15 minutes every morning to chant a mala of the Maha Mantra.\n- Read a few verses of the Bhagavad Gita daily to keep your mind sharp and heart pure."
      },
      {
        id: "7.3",
        title: "Final Puja of Gratitude",
        description: "Closing the 7-day sankalp.",
        format: "practice",
        duration: "15 min",
        content: "1. Light a lamp and offer flowers or a sweet at your altar.\n2. Chant 108 names (one mala).\n3. Speak to Krishna intimately like your closest friend. Thank Him for His guidance over the past week.\n4. Ask for the grace to remember Him always."
      }
    ]
  }
];

export const courseBlueprints = {
  hanuman: hanumanBlueprint,
  shiva: shivaBlueprint,
  krishna: krishnaBlueprint,
};

export const getCourseBlueprint = (deity?: string): CourseDay[] => {
  if (deity === 'shiva') return shivaBlueprint;
  if (deity === 'krishna') return krishnaBlueprint;
  return hanumanBlueprint;
};

// Default export for backward compatibility where static reference is still used (though we should migrate them to use the getter)
export const courseBlueprint = hanumanBlueprint;
