/**
 * First-run onboarding slides.
 * Remote Unsplash imagery — not committed binary assets.
 */
export type OnboardingSlide = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  imageUrl: string;
  imageCredit: string;
  imagePageUrl: string;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'create',
    eyebrow: 'Create',
    title: 'Make something they’ll remember.',
    body: 'Build a personalized Moment with your words, photos, music, and little surprises — free to start.',
    imageUrl:
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Photo by Everton Vila on Unsplash',
    imagePageUrl: 'https://unsplash.com/photos/a-man-and-a-woman-kissing-in-front-of-a-sunset-GEr9V6vqKy0',
  },
  {
    id: 'personalize',
    eyebrow: 'Personalize',
    title: 'Turn a feeling into a Moment.',
    body: 'Pick a style, add your memories, and shape every detail until it feels unmistakably like you.',
    imageUrl:
      'https://images.unsplash.com/photo-1452587925148-ce544e77fc43?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Photo by James Sutton on Unsplash',
    imagePageUrl: 'https://unsplash.com/photos/person-holding-black-dslr-camera-lU_N0tRfJCw',
  },
  {
    id: 'share',
    eyebrow: 'Share',
    title: 'Then send them a little magic.',
    body: 'Share privately with a link or QR — no app for them to install. Just open, and feel it.',
    imageUrl:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Photo by freestocks on Unsplash',
    imagePageUrl: 'https://unsplash.com/photos/pink-and-white-gift-box-11SgH7U6TmI',
  },
];
