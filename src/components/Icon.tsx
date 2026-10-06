// Stroke icons, 24×24 grid, drawn by hand in the same style as the logo line.
const paths = {
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  calc: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 7h7M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M15.5 15v2.5M8.5 18h.01M12 18h.01" />
    </>
  ),
  phone: (
    <path d="M8.2 3.5H5.5a2 2 0 0 0-2 2.2 16 16 0 0 0 14.8 14.8 2 2 0 0 0 2.2-2v-2.7a1 1 0 0 0-.7-1l-3.3-1.1a1 1 0 0 0-1 .2l-1.6 1.6a12 12 0 0 1-5.4-5.4l1.6-1.6a1 1 0 0 0 .2-1L9.2 4.2a1 1 0 0 0-1-.7Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  bolt: <path d="M13 2.5 4.5 14H12l-1 7.5L19.5 10H12l1-7.5Z" />,
  truck: (
    <>
      <path d="M2.5 6h11v10h-11zM13.5 9.5h4l3 3.5V16h-7" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6L12 3Z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </>
  ),
  arrow: <path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5" />,
  chevron: <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
