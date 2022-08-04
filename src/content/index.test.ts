import NerdeFocusCS from "./NerdeFocusCS";

describe("s", () => {
  const nerdeFocus = new NerdeFocusCS();
  document.body.innerHTML = `<div><ul class="a"><li id="baa"><a href=""></a></li><li></li><li><button/></li></ul></div>>`;

  it("returns result from subtract", () => {
    const node = document.querySelector("ul");
    expect(nerdeFocus.getPath(node)).toEqual("ul.a");
  });

  it("returns result from subtract", () => {
    const node = document.querySelector("button");
    expect(nerdeFocus.getPath(node)).toEqual("#baa a");
  });

});
