/**
 * Unsplash imagery for first-run onboarding.
 * Remote URLs only — not committed binary assets.
 * Sized for mobile via images.unsplash.com query params.
 *
 * Replace later by editing this file.
 */
export type OnboardingSlide = {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
  imageCredit: string;
  imagePageUrl: string;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'create',
    title: 'Make something they’ll remember.',
    body: 'Create a personalized Moment with your words, photos, music, and little surprises.',
    // Warm couple / intimate connection at golden hour
    imageUrl:
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Photo by Everton Vila on Unsplash',
    imagePageUrl: 'https://unsplash.com/photos/a-man-and-a-woman-kissing-in-front-of-a-sunset-GEr9V6vqKy0',
  },
  {
    id: 'personalize',
    title: 'Turn a feeling into a Moment.',
    body: 'Choose a style, add your memories, and shape every little detail.',
    // Hands holding polaroid-style memory / photos
    imageUrl:
      'https://images.unsplash.com/photo-1452587925148-ce544e77fc43?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Photo by James Sutton on Unsplash',
    imagePageUrl: 'https://unsplash.com/photos/person-holding-black-dslr-camera-lU_N0tRfJCw',
  },
  {
    id: 'share',
    title: 'Then send them a little magic.',
    body: 'Share your Moment privately with a link or QR — and let them experience it for themselves.',
    // Soft gift with warm lights — anticipation / receiving
    imageUrl:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Photo by freestocks on Unsplash',
    imagePageUrl: 'https://unsplash.com/photos/pink-and-white-gift-box-11SgH7U6TmI',
  },
];
