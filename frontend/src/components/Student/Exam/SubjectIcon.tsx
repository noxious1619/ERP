import React from "react";
interface SubjectIconProps {
  subjectName: string;
  size?: number;
  color?: string;
}
const MathsIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <line
      x1="14"
      y1="3"
      x2="14"
      y2="13"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <line
      x1="9"
      y1="8"
      x2="19"
      y2="8"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <line
      x1="9"
      y1="20"
      x2="19"
      y2="20"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <line
      x1="18"
      y1="4"
      x2="24"
      y2="4"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="18"
      y1="7"
      x2="24"
      y2="7"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="5" cy="14" r="1.2" fill={color} />
    <circle cx="5" cy="20" r="1.2" fill={color} />
  </svg>
);

const PhysicsIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="2.2" fill={color} />
    <ellipse cx="14" cy="14" rx="10" ry="4" stroke={color} strokeWidth="1.5" />
    <ellipse
      cx="14"
      cy="14"
      rx="10"
      ry="4"
      stroke={color}
      strokeWidth="1.5"
      transform="rotate(60 14 14)"
    />
    <ellipse
      cx="14"
      cy="14"
      rx="10"
      ry="4"
      stroke={color}
      strokeWidth="1.5"
      transform="rotate(120 14 14)"
    />
  </svg>
);

const ChemistryIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path
      d="M10 4 L10 13 L5 22 Q4 24 6 24 L22 24 Q24 24 23 22 L18 13 L18 4"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="9"
      y1="4"
      x2="19"
      y2="4"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="19" r="1.2" fill={color} opacity="0.7" />
    <circle cx="16" cy="21" r="0.9" fill={color} opacity="0.5" />
    <circle cx="14" cy="17" r="0.7" fill={color} opacity="0.4" />
  </svg>
);

const BiologyIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path
      d="M10 3 C10 7, 18 9, 18 13 C18 17, 10 19, 10 23"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M18 3 C18 7, 10 9, 10 13 C10 17, 18 19, 18 23"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <line
      x1="11.5"
      y1="6.5"
      x2="16.5"
      y2="6.5"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <line
      x1="10.5"
      y1="11"
      x2="17.5"
      y2="11"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <line
      x1="11"
      y1="16.5"
      x2="17"
      y2="16.5"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="21"
      x2="16"
      y2="21"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const EnglishIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <line
      x1="14"
      y1="6"
      x2="14"
      y2="23"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M14 6 C10 5, 5 6, 4 8 L4 22 C5 20, 10 19, 14 20"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M14 6 C18 5, 23 6, 24 8 L24 22 C23 20, 18 19, 14 20"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <line
      x1="7"
      y1="11"
      x2="12"
      y2="11"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.6"
    />
    <line
      x1="7"
      y1="14"
      x2="12"
      y2="14"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.6"
    />
    <line
      x1="16"
      y1="11"
      x2="21"
      y2="11"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.6"
    />
    <line
      x1="16"
      y1="14"
      x2="21"
      y2="14"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);
const HindiIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <line
      x1="4"
      y1="9"
      x2="24"
      y2="9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 9 L8 20"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8 15 C10 13, 14 13, 14 16 C14 19, 10 20, 8 20"
      stroke={color}
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M18 9 L18 20"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M16 14 L20 14"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const GeographyIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="10" stroke={color} strokeWidth="1.7" />
    <line x1="14" y1="4" x2="14" y2="24" stroke={color} strokeWidth="1.3" />
    <line x1="4" y1="14" x2="24" y2="14" stroke={color} strokeWidth="1.3" />
    <path
      d="M6 9 Q14 7, 22 9"
      stroke={color}
      strokeWidth="1.1"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M6 19 Q14 21, 22 19"
      stroke={color}
      strokeWidth="1.1"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);
const HistoryIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect
      x="6"
      y="6"
      width="16"
      height="18"
      rx="2"
      stroke={color}
      strokeWidth="1.7"
    />
    <path
      d="M6 8 Q6 4, 9 4 L19 4 Q22 4, 22 8"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    <line
      x1="9"
      y1="12"
      x2="19"
      y2="12"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <line
      x1="9"
      y1="15.5"
      x2="19"
      y2="15.5"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <line
      x1="9"
      y1="19"
      x2="15"
      y2="19"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);
const ComputerIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect
      x="3"
      y="4"
      width="22"
      height="15"
      rx="2"
      stroke={color}
      strokeWidth="1.7"
    />
    <rect
      x="6"
      y="7"
      width="16"
      height="9"
      rx="1"
      stroke={color}
      strokeWidth="1.2"
      opacity="0.5"
    />
    <path
      d="M9 10 L7.5 11.5 L9 13"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M13 10 L14.5 11.5 L13 13"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <line
      x1="14"
      y1="19"
      x2="14"
      y2="23"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <line
      x1="10"
      y1="23"
      x2="18"
      y2="23"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);
const ScienceIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <line
      x1="8"
      y1="24"
      x2="20"
      y2="24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="14"
      y1="24"
      x2="14"
      y2="10"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="14"
      y1="10"
      x2="19"
      y2="10"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="19"
      y1="10"
      x2="19"
      y2="5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="11" cy="19" r="3.5" stroke={color} strokeWidth="1.5" />
    <line
      x1="14"
      y1="16"
      x2="14"
      y2="19"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CommerceIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect
      x="4"
      y="16"
      width="4"
      height="8"
      rx="1"
      stroke={color}
      strokeWidth="1.5"
    />
    <rect
      x="10"
      y="11"
      width="4"
      height="13"
      rx="1"
      stroke={color}
      strokeWidth="1.5"
    />
    <rect
      x="16"
      y="7"
      width="4"
      height="17"
      rx="1"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M4 18 L12 13 L20 8 L24 5"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const DefaultIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <polygon
      points="14,4 26,10 14,16 2,10"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M20 13 L20 20 Q14 23, 8 20 L8 13"
      stroke={color}
      strokeWidth="1.6"
      fill="none"
      strokeLinejoin="round"
    />
    <line
      x1="26"
      y1="10"
      x2="26"
      y2="17"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="26" cy="18" r="1.5" fill={color} />
  </svg>
);

type IconComponent = ({
  size,
  color,
}: {
  size: number;
  color: string;
}) => React.ReactElement;

const ICON_RULES: { keywords: string[]; Component: IconComponent }[] = [
  {
    keywords: [
      "math",
      "maths",
      "mathematics",
      "calculus",
      "algebra",
      "geometry",
      "statistics",
      "arithmetic",
    ],
    Component: MathsIcon,
  },
  {
    keywords: ["physics", "phys", "mechanics", "optics"],
    Component: PhysicsIcon,
  },
  {
    keywords: ["chemistry", "chem", "organic", "inorganic"],
    Component: ChemistryIcon,
  },
  {
    keywords: [
      "biology",
      "bio",
      "botany",
      "zoology",
      "life science",
      "anatomy",
      "genetics",
    ],
    Component: BiologyIcon,
  },
  {
    keywords: ["english", "literature", "grammar", "writing", "comprehension"],
    Component: EnglishIcon,
  },
  { keywords: ["hindi", "हिंदी", "हिन्दी"], Component: HindiIcon },
  { keywords: ["geography", "geo", "earth science"], Component: GeographyIcon },
  {
    keywords: [
      "history",
      "hist",
      "social science",
      "social studies",
      "civics",
      "political",
      "economics",
    ],
    Component: HistoryIcon,
  },
  {
    keywords: [
      "computer",
      "cs",
      "coding",
      "programming",
      "information technology",
      "it ",
    ],
    Component: ComputerIcon,
  },
  {
    keywords: ["science", "general science", "environmental", "evs"],
    Component: ScienceIcon,
  },
  {
    keywords: ["accounts", "accounting", "commerce", "business", "finance"],
    Component: CommerceIcon,
  },
  {
    keywords: [
      "french",
      "spanish",
      "german",
      "tamil",
      "telugu",
      "marathi",
      "gujarati",
      "urdu",
      "kannada",
      "bengali",
      "punjabi",
      "sanskrit",
    ],
    Component: EnglishIcon,
  },
];
const resolveIconComponent = (subjectName: string): IconComponent => {
  const lower = subjectName.toLowerCase();
  for (const rule of ICON_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.Component;
    }
  }
  return DefaultIcon;
};
const SubjectIcon = ({
  subjectName,
  size = 28,
  color = "#4285F4",
}: SubjectIconProps) => {
  const IconComponent = resolveIconComponent(subjectName);
  return <IconComponent size={size} color={color} />;
};

export default SubjectIcon;
