export default class Logger {
  private namespace: string = "";
  constructor(namespace: string) {
    this.namespace = namespace;
  }

  public error(error: string | unknown, ...rest: any[]) {
    console.log(this.namespace, error, ...rest);
  }

  public log(debug: string | unknown, ...rest: any[]) {
    console.log(this.namespace, debug, ...rest);
  }
}
