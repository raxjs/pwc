const EVENT_REG = /^@([#\w]*)(\.capture)?/;

export function getEventInfo(name): any {
  const eventExecArray = EVENT_REG.exec(name);
  const eventName = eventExecArray && eventExecArray[1];
  const isCapture = !!(eventExecArray && eventExecArray[2]);
  return {
    eventName,
    isCapture
  };
}
