class Controller {
  private static controller : Controller;
  public static getInstance() : Controller {
    return this.controller ?? (this.controller = new Controller());
  }
  private constructor() {}
}

export default Controller;
