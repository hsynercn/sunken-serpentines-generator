export class LcgGenerator {
  /*
        a: Multiplier - a large prime number
        c: Increment - another large prime number
        m: Modulus - a power of 2
        z: The seed value
        */
  private seed: number;
  private a: number = 1103515245;
  private c: number = 12345;
  private m: number = 2147483647;

  constructor(seed: number) {
    this.seed = seed;
  }

  public nextInt(): number {
    this.seed = (this.a * this.seed + this.c) % this.m;
    return this.seed;
  }

  public nextDouble = (): number => {
    const value = this.nextInt();
    return value / this.m;
  };
}
