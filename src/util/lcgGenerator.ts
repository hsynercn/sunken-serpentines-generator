export namespace Singleton {
  export class LcgGenerator {
    /*
      a: Multiplier - a large prime number
      c: Increment - another large prime number
      m: Modulus - a power of 2
      z: The seed value
      */
    private seed: number;
    private a: number = 1664525;
    private c: number = 1013904223;
    private m: number = Math.pow(2, 32);

    constructor(seed: number) {
      this.seed = seed;
    }

    public next(): number {
      this.seed = (this.a * this.seed + this.c) % this.m;
      return this.seed;
    }
  }
  //export const generator = new LcgGenerator(Math.ceil(Math.random() * 1000000000));
  export const generator = new LcgGenerator(1235312312);

  export function randomAlphaNumericChar(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomIndex = Singleton.generator.next() % chars.length;
    return chars.charAt(randomIndex);
  }
}

