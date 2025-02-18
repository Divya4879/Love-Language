const heroSection = document.getElementById('hero');
const languageCards = document.querySelectorAll('.card');
const startQuizBtn = document.getElementById('start-quiz');
const questionDisplay = document.getElementById('question-display');
const options = document.querySelectorAll('.option');
const quizContainer = document.getElementById('quiz-container');

// Quiz Configuration
let currentQuestion = 0;
let quizResults = { words: 0, acts: 0, gifts: 0, time: 0, touch: 0 };
const questions = [
    "When feeling down, what cheers you up the most?",
    "How do you prefer to show affection to your partner?",
    "What makes you feel most appreciated in a relationship?",
    "On your birthday, what would you most like your partner to do?",
    "When you've had a tough day, what do you crave from your partner?"
];
const answerOptions = [
    ["Hearing words of encouragement", "Having someone do a task for you", "Receiving a thoughtful gift", "Spending quality time together", "Getting a comforting hug"],
    ["Saying 'I love you' and giving compliments", "Doing helpful tasks or chores", "Giving meaningful gifts", "Planning special dates", "Showing physical affection"],
    ["Verbal praise and appreciation", "When they help with your responsibilities", "When they surprise you with gifts", "When they give you undivided attention", "When they show physical affection"],
    ["Write you a heartfelt card", "Take care of all your chores", "Give you a special present", "Spend the whole day with you", "Give you lots of hugs and kisses"],
    ["Words of reassurance", "Help with something practical", "A small 'pick-me-up' gift", "Undistracted listening", "A long, comforting hug"]
];

// Love Language Cards Interaction
languageCards.forEach(card => {
    const language = card.dataset.language;
    const example = document.createElement('div');
    example.className = 'card-example';
    example.textContent = {
        words: "Saying 'I love you' multiple times a day and offering sincere compliments.",
        acts: "Doing chores without being asked or preparing a surprise meal for your partner.",
        gifts: "Giving thoughtful, personalized presents, even if they're small.",
        time: "Having a device-free date night or taking a walk together every evening.",
        touch: "Holding hands while walking or giving a comforting hug after a long day."
    }[language];
    card.appendChild(example);

    card.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasActive = card.classList.contains('active');
        
        document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
        heroSection.classList.remove('card-expanded');
        
        if (!wasActive) {
            card.classList.add('active');
            heroSection.classList.add('card-expanded');
        }
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    heroSection.classList.remove('card-expanded');
});

// Quiz Functions
function startQuiz() {
    currentQuestion = 0;
    quizResults = { words: 0, acts: 0, gifts: 0, time: 0, touch: 0 };
    quizContainer.classList.remove('results-active');
    document.querySelectorAll('.hearts-container').forEach(el => el.remove());
    document.getElementById('results-section').style.display = 'none';
    document.querySelectorAll('.bar').forEach(bar => bar.style.height = '0');
    showQuestion();
    startQuizBtn.style.display = 'none';
}

function showQuestion() {
    if (currentQuestion < questions.length) {
        questionDisplay.dataset.questionNumber = `${currentQuestion + 1}/${questions.length}`;
        questionDisplay.textContent = questions[currentQuestion];
        options.forEach((option, index) => {
            option.textContent = answerOptions[currentQuestion][index];
            option.style.display = 'inline-block';
        });
    } else {
        showResults();
    }
}

function showResults() {
    questionDisplay.textContent = "Quiz completed! Here are your results:";
    options.forEach(option => option.style.display = 'none');
    quizContainer.classList.add('results-active');
    createHeartsAnimation();
    document.getElementById('results-section').style.display = 'block';

    const resultMessage = document.createElement('div');
    resultMessage.className = 'result-message';
    const primaryLanguage = Object.keys(quizResults).reduce((a, b) => 
        quizResults[a] > quizResults[b] ? a : b);
    resultMessage.innerHTML = `
        Your primary love language is:<br>
        <strong>${primaryLanguage.charAt(0).toUpperCase() + primaryLanguage.slice(1)}</strong>
        ${getLanguageEmoji(primaryLanguage)}
    `;
    questionDisplay.appendChild(resultMessage);
    updateChart();
}

// Chart Functions
function updateChart() {
    const totalQuestions = questions.length;
    const maxHeight = 250; // Maximum bar height in pixels

    Object.entries(quizResults).forEach(([language, score]) => {
        const barContainer = document.querySelector(`.bar-container[data-language="${language}"]`);
        const bar = barContainer.querySelector('.bar');
        const percentage = (score / totalQuestions) * 100;
        const barHeight = (percentage / 100) * maxHeight;

        bar.style.height = `${barHeight}px`;

        if (!barContainer.querySelector('.score-label')) {
            const scoreLabel = document.createElement('div');
            scoreLabel.className = 'score-label';
            barContainer.appendChild(scoreLabel);
        }
        barContainer.querySelector('.score-label').textContent = `${score}/${totalQuestions}`;
    });
}

// Animation Functions
function createHeartsAnimation() {
    const container = document.createElement('div');
    container.className = 'hearts-container';
    quizContainer.appendChild(container);

    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    }

    // Initial burst of hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(createHeart, i * 300);
    }

    // Continuous animation
    const heartInterval = setInterval(() => {
        if (!document.body.contains(container)) clearInterval(heartInterval);
        createHeart();
    }, 3000);
}

// Helper Functions
function getLanguageEmoji(language) {
    const emojis = {
        words: '💬',
        acts: '🤲',
        gifts: '🎁',
        time: '⏳',
        touch: '💖'
    };
    return emojis[language] || '❤️';
}

// Event Listeners
startQuizBtn.addEventListener('click', startQuiz);

options.forEach((option, index) => {
    option.addEventListener('click', () => {
        const languages = ['words', 'acts', 'gifts', 'time', 'touch'];
        quizResults[languages[index]]++;
        currentQuestion++;
        showQuestion();
    });
});

// Stories data
const stories = {
    words: {
        preview: "A story about the impact of kind words...",
        full: `When Clara lost her job, Mark began leaving daily love notes in her lunchbox. "Your laugh lights up rooms," one read. "Best decision I ever made was choosing you," said another. Over months, these paper hugs rebuilt her confidence. On her first day at a new job, she found her old lunchbox - now filled with 100+ notes. "Read one whenever you need me," the final note said. Years later, their daughter discovered the yellowed papers. "These aren't just notes," Clara smiled, "they're the story of how your father loved me whole."`
    },
    acts: {
        preview: "When actions speak louder...",
        full: `Emma never noticed how Ethan quietly supported her. He'd wake early to defrost her car, memorize her coffee order, and secretly feed her parking meter. When her mother fell ill, Ethan took night shifts caring for her. "Why do you do all this?" she finally asked. He opened a worn notebook: "July 12 - Fixed her favorite sweater. August 3 - Surprise lunch delivery." Every page held silent "I love yous". "Because love isn't just felt," he said, "it's done." Their lifetime of small acts became their greatest romance novel.`
    },
    gifts: {
        preview: "The art of thoughtful giving...",
        full: `For their first anniversary, broke student Jake gifted Mia a mason jar filled with 365 folded stars. "Open one daily," he insisted. Each contained memories: "Today I loved how you laughed at my bad joke." Years later, during chemo, Mia found a new jar. "Round 2," the note read. The stars now held hopes: "Tomorrow we'll try that gelato place." When Jake found her final star - "Forever my best gift" - he knew. True gifts aren't bought, but built through countless tiny "I was thinking of you"s.`
    },
    
};

// Initialize stories
document.querySelectorAll('.story-card').forEach(card => {
    const category = card.dataset.category;
    const preview = card.querySelector('.preview');
    const expandBtn = card.querySelector('.expand-btn');
    const fullStory = document.createElement('div');
    
    preview.textContent = stories[category].preview;
    fullStory.className = 'full-story';
    fullStory.textContent = stories[category].full;
    card.appendChild(fullStory);
});

// Carousel navigation
const carousel = document.getElementById('story-carousel');
const cardWidth = 300 + 30; // width + gap

document.getElementById('prev-story').addEventListener('click', () => {
    carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
});

document.getElementById('next-story').addEventListener('click', () => {
    carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
});

// Expand functionality
document.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.story-card');
        const fullStory = card.querySelector('.full-story');
        const isExpanding = fullStory.style.display !== 'block';

        // Collapse all others
        document.querySelectorAll('.full-story').forEach(story => {
            story.style.display = 'none';
            story.previousElementSibling.textContent = '+';
        });

        fullStory.style.display = isExpanding ? 'block' : 'none';
        this.textContent = isExpanding ? '−' : '+';
    });
});

// Add new story to stories object
stories.time = {
    preview: "Moments that matter most...",
    full: `For their 10th anniversary, Nora planned a surprise - 24 hours unplugged. No phones, no TV, just them. They painted terrible watercolors by the lake, fed ducks stale bread, and rediscovered each other's laugh lines. At sunset, Alex produced a jar filled with 365 folded notes: "Tuesday - Loved how you danced while washing dishes", "March 3 - Your morning hair made me smile". "One for every day I chose us," he said. Their greatest gift wasn't time, but the attention woven into every shared second.`
};

// Create new story card element
const timeStory = document.createElement('div');
timeStory.className = 'story-card';
timeStory.dataset.category = 'time';
timeStory.innerHTML = `
    <h3>Stolen Moments</h3>
    <p class="preview">${stories.time.preview}</p>
    <span class="expand-btn">+</span>
`;

// Add to carousel
document.getElementById('story-carousel').appendChild(timeStory);

// Initialize new story content
const fullStory = document.createElement('div');
fullStory.className = 'full-story';
fullStory.textContent = stories.time.full;
timeStory.appendChild(fullStory);

// Add click handler for new expand button
timeStory.querySelector('.expand-btn').addEventListener('click', function() {
    const card = this.closest('.story-card');
    const fullStory = card.querySelector('.full-story');
    const isExpanding = fullStory.style.display !== 'block';

    document.querySelectorAll('.full-story').forEach(story => {
        story.style.display = 'none';
        story.parentElement.querySelector('.expand-btn').textContent = '+';
    });

    fullStory.style.display = isExpanding ? 'block' : 'none';
    this.textContent = isExpanding ? '−' : '+';
});

// Add new touch story to stories object
stories.touch = {
    preview: "Connection beyond words...",
    full: `After losing his hearing in an accident, David learned love's new vocabulary. Lily's touch became their dialect - 
        a lingering cheek caress for "Good morning", intertwined pinkies for "I'm listening", forehead kisses that shouted 
        "You're safe". She learned braille love notes on his palm, each dot a tender confession. On their golden anniversary, 
        David placed Lily's hand over his heart. "Feel that?" his fingers traced. "It beats your name." Their silent 
        language needed no sound, just skin remembering a lifetime of "I choose you"s whispered through touch.`
};

// Create new touch story card
const touchStory = document.createElement('div');
touchStory.className = 'story-card';
touchStory.dataset.category = 'touch';
touchStory.innerHTML = `
    <h3>Silent Symphony</h3>
    <p class="preview">${stories.touch.preview}</p>
    <span class="expand-btn">+</span>
`;

// Add to carousel
document.getElementById('story-carousel').appendChild(touchStory);

// Initialize story content
const fullStoryTouch = document.createElement('div');
fullStoryTouch.className = 'full-story';
fullStoryTouch.textContent = stories.touch.full;
touchStory.appendChild(fullStoryTouch);

// Add expand functionality
touchStory.querySelector('.expand-btn').addEventListener('click', function() {
    const card = this.closest('.story-card');
    const fullStory = card.querySelector('.full-story');
    const isExpanding = fullStory.style.display !== 'block';

    document.querySelectorAll('.full-story').forEach(story => {
        story.style.display = 'none';
        story.parentElement.querySelector('.expand-btn').textContent = '+';
    });

    fullStory.style.display = isExpanding ? 'block' : 'none';
    this.textContent = isExpanding ? '−' : '+';
});


// Map interaction
const regionMarkers = document.querySelectorAll('.marker');
const regionInfo = document.getElementById('region-info');

regionMarkers.forEach(marker => {
    marker.addEventListener('click', () => {
        const region = marker.dataset.region;
        regionInfo.textContent = `Love expressions in ${region}: Loading...`;
        // Simulating data fetch
        setTimeout(() => {
            const expressions = {
                asia: "In many Asian cultures, love is often expressed through acts of service and respect for family bonds.",
                europe: "European expressions of love often involve romantic gestures, quality time, and verbal affirmations.",
                americas: "In the Americas, love languages vary widely but often include physical touch and words of affirmation.",
                africa: "African expressions of love often emphasize community support, shared experiences, and acts of service."
            };
            regionInfo.textContent = expressions[region];
        }, 500);
    });
});


// Daily challenge
const challengeText = document.getElementById('challenge-text');
const newChallengeBtn = document.getElementById('new-challenge');
const completionTracker = document.getElementById('completion-tracker');
const daySpans = completionTracker.querySelectorAll('.day');

const challenges = [
    "Give a heartfelt compliment to someone you care about.",
    "Perform an unexpected act of service for a loved one.",
    "Spend quality time with someone without distractions.",
    "Give a small, thoughtful gift to show you care.",
    "Express your affection through a gentle touch or hug."
];

let currentDay = 0;

function getNewChallenge() {
    if (currentDay < 5) {
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        challengeText.textContent = randomChallenge;
        daySpans[currentDay].classList.add('completed');
        currentDay++;
    } else {
        challengeText.textContent = "Congratulations! You've completed all challenges for this week.";
        newChallengeBtn.disabled = true;
    }
}

newChallengeBtn.addEventListener('click', getNewChallenge);

// Initialize with a random challenge
getNewChallenge();

// Social media share buttons
const shareButtons = document.querySelectorAll('.share-btn');

// Add Font Awesome dynamically
const faLink = document.createElement('link');
faLink.rel = 'stylesheet';
faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
document.head.appendChild(faLink);

// Add icons to existing buttons
document.querySelectorAll('.share-btn').forEach(btn => {
  const platform = btn.dataset.platform;
  const icon = document.createElement('i');
  
  switch(platform) {
    case 'twitter':
      icon.className = 'fab fa-twitter';
      break;
    case 'facebook':
      icon.className = 'fab fa-facebook-f';
      break;
    case 'instagram':
      icon.className = 'fab fa-instagram';
      break;
  }
  
  btn.innerHTML = '';
  btn.appendChild(icon);
});

shareButtons.forEach(button => {
    button.addEventListener('click', () => {
        const platform = button.dataset.platform;
        const message = "I just discovered my love language! Find out yours at Love Language Discovery!";
        const url = encodeURIComponent(window.location.href);

        let shareUrl;
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'instagram':
                alert("Instagram sharing is not directly supported. You can copy the link and share it manually.");
                return;
        }

        window.open(shareUrl, '_blank');
    });
});

document.querySelector('[data-platform="twitter"]').addEventListener('click', () => {
    // Get user's primary love language
    const primaryLanguage = Object.keys(quizResults).reduce((a, b) => 
        quizResults[a] > quizResults[b] ? a : b);
    
    // Create emoji mapping
    const languageEmojis = {
        words: "💬✨",
        acts: "🤲❤️",
        gifts: "🎁💝",
        time: "⏳💞",
        touch: "💖🤗"
    };
    
    // Create creative message
    const message = `Discover your love language! 🌟\n\nMy primary #LoveLanguage is: ${
        primaryLanguage.charAt(0).toUpperCase() + primaryLanguage.slice(1)
    } ${languageEmojis[primaryLanguage]}\n\nTake the quiz: ${
        window.location.href
    } 🧡💌 #KnowYourLoveLanguage`;
    
    window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
        '_blank',
        
    );
});