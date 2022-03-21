import { Reactive } from "../reactive";
class MockElement {
    constructor(initialValue){
        this.isUpdating = !1, this.reactive = new Reactive(this), this.reactive.setReactiveValue("data", initialValue), this.isUpdating = !1;
    }
    set data(val) {
        this.reactive.setReactiveValue("data", val);
    }
    get data() {
        return this.reactive.getReactiveValue("data");
    }
    requestUpdate() {
        this.isUpdating = !0;
    }
}
describe("Create a reactive property", ()=>{
    it("A primitive property should request a update", ()=>{
        const element = new MockElement("Jack");
        expect(element.isUpdating).toBe(!1), element.data = "Tom", expect(element.isUpdating).toBe(!0);
    }), it("A object property should request a update", ()=>{
        const element = new MockElement({
            name: "Jack"
        });
        expect(element.isUpdating).toBe(!1), element.data.name = "Tom", expect(element.isUpdating).toBe(!0);
    }), it("A array property should request a update", ()=>{
        const element = new MockElement([
            "Jack"
        ]);
        expect(element.isUpdating).toBe(!1), element.data.push("Tom"), expect(element.isUpdating).toBe(!0);
    });
});
