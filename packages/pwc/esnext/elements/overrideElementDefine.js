export default ((OverrideElement)=>{
    self[Object.getPrototypeOf(OverrideElement)?.name] = OverrideElement;
});
