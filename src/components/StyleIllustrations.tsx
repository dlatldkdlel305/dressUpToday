import React from 'react';

export type StyleId = 'casual' | 'neat' | 'active' | 'classic';

interface IllustrationProps {
  selected?: boolean;
}

export function CasualIllustration({selected = false}: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="80"
        height="80"
        rx="18"
        fill={selected ? '#E0F2FE' : '#F0F9FF'}
      />
      {/* Relaxed crewneck sweatshirt */}
      <path
        d="M32 22C34 27 38.5 29.5 44 29.5C49.5 29.5 54 27 56 22L68 27.5L73 43L64 46L61 36V56H27V36L24 46L15 43L20 27.5L32 22Z"
        fill="#38BDF8"
        stroke="#0F2942"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ribbed neckline & cuffs */}
      <path
        d="M35 23.2C37.2 26.8 40.3 28.5 44 28.5C47.7 28.5 50.8 26.8 53 23.2"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect
        x="27"
        y="52"
        width="34"
        height="4.5"
        rx="1.5"
        fill="#0284C7"
        stroke="#0F2942"
        strokeWidth="2"
      />
      {/* Comfortable denim pants */}
      <path
        d="M29 56.5H59L61 75H47.5L44 63.5L40.5 75H27L29 56.5Z"
        fill="#BAE6FD"
        stroke="#0F2942"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Pocket stitch detail */}
      <path
        d="M33 60C33 62.5 34.5 64 36.5 64.5"
        stroke="#0F2942"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M55 60C55 62.5 53.5 64 51.5 64.5"
        stroke="#0F2942"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NeatIllustration({selected = false}: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="80"
        height="80"
        rx="18"
        fill={selected ? '#E0F2FE' : '#F0F9FF'}
      />
      {/* White crisp shirt sleeves & body */}
      <path
        d="M34 20H54L68 27L72 44L63 46L60 35V57H28V35L25 46L16 44L20 27L34 20Z"
        fill="#FFFFFF"
        stroke="#0F2942"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Knit cardigan / neat outer vest */}
      <path
        d="M34 20L44 37L54 20L60 23.5V57H28V23.5L34 20Z"
        fill="#0284C7"
        stroke="#0F2942"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Shirt collar */}
      <path
        d="M35 20L41 28L44 23L47 28L53 20"
        fill="#FFFFFF"
        stroke="#0F2942"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Neat buttons */}
      <circle cx="44" cy="42" r="1.8" fill="#FFFFFF" />
      <circle cx="44" cy="49" r="1.8" fill="#FFFFFF" />
      {/* Tailored slacks */}
      <path
        d="M29 57H59L60.5 75H47L44 63L41 75H27.5L29 57Z"
        fill="#1E3A5F"
        stroke="#0F2942"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ActiveIllustration({selected = false}: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="80"
        height="80"
        rx="18"
        fill={selected ? '#E0F2FE' : '#F0F9FF'}
      />
      {/* Sporty cap icon at top right */}
      <path
        d="M58 14C62.5 14 66 17.2 66 21H52C52 17.2 54.6 14 58 14Z"
        fill="#38BDF8"
        stroke="#0F2942"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M66 21H71.5"
        stroke="#0F2942"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Zip-up windbreaker / track jacket */}
      <path
        d="M33 22H55L67 29L72 46L63 48L59.5 37V58H28.5V37L25 48L16 46L21 29L33 22Z"
        fill="#0EA5E9"
        stroke="#0F2942"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* High collar & center zipper */}
      <path
        d="M35 22L37 17H51L53 22"
        fill="#BAE6FD"
        stroke="#0F2942"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M44 22V58"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Athletic stripe across chest */}
      <path
        d="M28.5 34.5H59.5"
        stroke="#E0F2FE"
        strokeWidth="3"
      />
      {/* Joggers + sporty sneakers hint */}
      <path
        d="M29.5 58H58.5L59.5 73H47L44 63.5L41 73H28.5L29.5 58Z"
        fill="#0F2942"
        stroke="#0F2942"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <rect x="27" y="73" width="14" height="4.5" rx="2" fill="#FFFFFF" stroke="#0F2942" strokeWidth="1.8" />
      <rect x="47" y="73" width="14" height="4.5" rx="2" fill="#FFFFFF" stroke="#0F2942" strokeWidth="1.8" />
    </svg>
  );
}

export function ClassicIllustration({selected = false}: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="80"
        height="80"
        rx="18"
        fill={selected ? '#E0F2FE' : '#F0F9FF'}
      />
      {/* Tailored classic coat / blazer */}
      <path
        d="M33 20H55L68 27L72 48L63 50L60 36V73H28V36L25 50L16 48L20 27L33 20Z"
        fill="#1E3A5F"
        stroke="#0F2942"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner crisp cream/white blouse/shirt V-neck */}
      <path
        d="M36 20L44 41L52 20H36Z"
        fill="#FFFFFF"
        stroke="#0F2942"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Classic tailored lapels */}
      <path
        d="M34 20L39.5 34L33 36L31 27"
        fill="#335C8E"
        stroke="#0F2942"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M54 20L48.5 34L55 36L57 27"
        fill="#335C8E"
        stroke="#0F2942"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Waist belt / classic double buttons */}
      <rect
        x="28"
        y="46"
        width="32"
        height="4.5"
        fill="#7DD3FC"
        stroke="#0F2942"
        strokeWidth="1.8"
      />
      <rect
        x="41.5"
        y="45"
        width="5"
        height="6.5"
        rx="1"
        fill="#E0F2FE"
        stroke="#0F2942"
        strokeWidth="1.8"
      />
      <circle cx="44" cy="57" r="1.8" fill="#BAE6FD" />
      <circle cx="44" cy="64" r="1.8" fill="#BAE6FD" />
    </svg>
  );
}
