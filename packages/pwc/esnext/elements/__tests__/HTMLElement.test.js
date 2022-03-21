import "../native/HTMLElement";
function legacyReactive(name, initialValue) {
    this.setReactiveValue(name, initialValue), Object.defineProperty(this.constructor.prototype, name, {
        set (val) {
            this.setReactiveValue(name, val);
        },
        get () {
            return this.getReactiveValue(name);
        }
    });
}
describe("Render HTMLElement", ()=>{
    it("should render simple element", ()=>{
        const CustomElement = class CustomElement extends HTMLElement {
            onClick() {
                console.log("click!!!");
            }
            get template() {
                return [
                    "<!--?pwc_p--><div id=\"container\"><!--?pwc_t--> - <!--?pwc_t--></div>",
                    [
                        {
                            onclick: {
                                handler: this.onClick.bind(this)
                            }
                        },
                        this.text,
                        this.name, 
                    ], 
                ];
            }
            constructor(...args){
                super(...args), this.text = "hello", this.name = "jack";
            }
        }, mockClick = jest.spyOn(CustomElement.prototype, "onClick");
        window.customElements.define("custom-element", CustomElement);
        const element = document.createElement("custom-element");
        document.body.appendChild(element), expect(element.innerHTML).toEqual("<!--?pwc_p--><div id=\"container\">hello<!--?pwc_t--> - jack<!--?pwc_t--></div>");
        const container = document.getElementById("container");
        container.click(), expect(mockClick).toBeCalled();
    }), it("should render nested elements", ()=>{
        const CustomElement = class CustomElement extends HTMLElement {
            #title = "title";
            onClick() {
                console.log("click!!!");
            }
            get template() {
                return [
                    "<!--?pwc_p--><div id=\"nested-container\"><!--?pwc_t--> <div>This is <!--?pwc_t--></div> <!--?pwc_t--></div>",
                    [
                        {
                            onclick: {
                                handler: this.onClick.bind(this)
                            }
                        },
                        this.text,
                        this.#title,
                        this.name, 
                    ], 
                ];
            }
            constructor(...args){
                super(...args), this.text = "hello", this.name = "nested";
            }
        }, mockClick = jest.spyOn(CustomElement.prototype, "onClick");
        window.customElements.define("custom-nested-element", CustomElement);
        const element = document.createElement("custom-nested-element");
        document.body.appendChild(element), expect(element.innerHTML).toEqual("<!--?pwc_p--><div id=\"nested-container\">hello<!--?pwc_t--> <div>This is title<!--?pwc_t--></div> nested<!--?pwc_t--></div>");
        const container = document.getElementById("nested-container");
        container.click(), expect(mockClick).toBeCalled();
    }), it("should render reactive element", async ()=>{
        const CustomElement = class CustomElement extends HTMLElement {
            constructor(){
                super(), this.changedClassName = !1, legacyReactive.call(this, "data", {
                    name: "jack"
                }), legacyReactive.call(this, "text", "hello"), legacyReactive.call(this, "className", "red");
            }
            onClick() {
                this.data.name += "!", this.text += "?", this.className = this.changedClassName ? "red" : "green", this.changedClassName = !this.changedClassName;
            }
            get template() {
                return [
                    "<!--?pwc_p--><div id=\"reactive-container\"><!--?pwc_t--> - <!--?pwc_t--></div>",
                    [
                        {
                            class: this.className,
                            onclick: {
                                handler: this.onClick.bind(this)
                            }
                        },
                        this.text,
                        this.data.name
                    ], 
                ];
            }
        };
        window.customElements.define("custom-reactive-element", CustomElement);
        const element = document.createElement("custom-reactive-element");
        document.body.appendChild(element), expect(element.innerHTML).toEqual("<!--?pwc_p--><div id=\"reactive-container\" class=\"red\">hello<!--?pwc_t--> - jack<!--?pwc_t--></div>");
        const container = document.getElementById("reactive-container");
        container.click(), await new Promise((resolve)=>setTimeout(resolve, 100)
        ), expect(element.innerHTML).toEqual("<!--?pwc_p--><div id=\"reactive-container\" class=\"green\">hello?<!--?pwc_t--> - jack!<!--?pwc_t--></div>");
    });
});
