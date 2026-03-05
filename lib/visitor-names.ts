export const VISITOR_NAMES = [
    "lok cutie money", "sigma rizz lord", "vibing potato", "glitchy marshmallow", "ninja turtle fan",
    "skibidi toilet fan", "no cap developer", "fr fr coder", "aesthetic ghost", "pixelated pizza",
    "chad programmer", "low poly pigeon", "dancing cactus", "lazy lightning", "neon narwhal",
    "spaghetti code king", "bug hunter 9000", "coffee breathing dragon", "sudo master", "binary banana",
    "git stash goblin", "merge conflict survivor", "404 brain found", "infinite loop leaper", "terminal toaster",
    "mouse pointer slayer", "caps lock hater", "dark mode addict", "light mode hater", "syntax sugar daddy",
    "flexbox fighter", "grid system geek", "z-index wizard", "hover effect hater", "transition titan",
    "framer motion freak", "three js thrasher", "next js nerd", "react router racer", "prisma pirate",
    "tailwind tiger", "css crimes lord", "html hacker", "javascript junkie", "typescript titan",
    "rustacean rocket", "python charmer", "ruby on rails fan", "go gopher god", "c++ crusader",
    "java jaguar", "kotlin kangaroo", "swift sparrow", "objective c oldtimer", "php phantom",
    "sql sniper", "mongodb maniac", "redis racer", "docker dolphin", "kubernetes king",
    "cloud computing cat", "serverless sloth", "api architect", "frontend fanatic", "backend beast",
    "fullstack flamingo", "devops devil", "agile ant", "scrum master squirrel", "waterfall wolf",
    "blockchain badger", "crypto crab", "nft nymph", "ai alchemist", "ml magician",
    "data science duck", "cyber security shark", "white hat whale", "black hat bat", "red team rhino",
    "blue team bear", "ctf champion", "bug bounty bug", "hacking hamster", "coding cobra",
    "programming panda", "software swan", "web dev wasp", "mobile app moose", "game dev gorilla",
    "low level leopard", "high level hawk", "scripting snail", "automation ape", "testing toad",
    "qa quail", "u x unicorn", "u i ibis", "design dingo", "product manager penguin", "money maker monkey"
];

export const getRandomName = () => {
    return VISITOR_NAMES[Math.floor(Math.random() * VISITOR_NAMES.length)];
};

export const VISITOR_COLORS = [
    "#F87171", "#FB923C", "#FBBF24", "#34D399", "#2DD4BF", "#38BDF8", "#818CF8", "#A78BFA", "#F472B6"
];

export const getRandomColor = () => {
    return VISITOR_COLORS[Math.floor(Math.random() * VISITOR_COLORS.length)];
};
