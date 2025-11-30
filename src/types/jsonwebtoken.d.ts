declare module 'jsonwebtoken' {
  const jwt: any;
  export default jwt;
  export function sign(
    payload: any,
    secretOrPrivateKey: any,
    options?: any
  ): string;
  export function decode(token: string): any;
  export function verify(
    token: string,
    secretOrPublicKey: any,
    options?: any
  ): any;
}
