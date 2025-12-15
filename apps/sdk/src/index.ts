export class MySDK {
  private name: string;

  constructor(name: string) {
    this.name = name;
    console.log(`SDK Initialized: ${name}`);
  }

  public sayHello() {
    console.log(`Hello from ${this.name}!`);
    return `Hello from ${this.name}!`;
  }
}
