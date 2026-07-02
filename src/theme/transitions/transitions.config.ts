export const TRANSITIONS_CONFIG = {
  respectReducedMotion: true,
  activeClassName: 'onoko-active',
  focusClassName: 'onoko-focused',
  focusRippleMode: 'focus' as const,
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shorter: '150ms',
      short: '200ms',
      standard: '250ms',
      long: '300ms',
      complex: '375ms',
      enteringScreen: '225ms',
      get leavingScreen() {
        return this.short;
      },
    },
  },
};
