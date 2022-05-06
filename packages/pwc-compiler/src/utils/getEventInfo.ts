const EVENT_REG = /^@([#\w]*)(\.capture)?/; // TODO: When there are more modifiers besides capture, the regexp should be modified

export function getEventInfo(name): any {
  const eventExecArray = EVENT_REG.exec(name);
  const eventName = eventExecArray && eventExecArray[1];
  const isCapture = !!(eventExecArray && eventExecArray[2]);
  return {
    eventName,
    isCapture,
  };
}
