declare module 'mongoose';
declare module 'next/router';
declare module 'react-window';

// temporary ambient declarations to avoid TS errors when 3rd party
// types are not installed. These are safe, minimal placeholders
// for CI/type-check purposes and should be replaced by real
// @types packages when available.
