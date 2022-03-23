export interface SchedulerJob {
  uid: number;
  run: () => void;
}

let queue: SchedulerJob[] = [];
let isFlushing = false;
let isFlushingPending = false;
const resolvedPromise: Promise<any> = Promise.resolve();
let currentFlushPromise: Promise<void> | null = null;

export async function nextTick< T = void>(
  this: T,
  fn?: (this: T) => void,
): Promise<void> {
  const promise = currentFlushPromise || resolvedPromise;
  return fn ? promise.then(this ? fn.bind(this) : fn) : promise;
}

export function enqueueJob(job: SchedulerJob) {
  // Ensure a instance only has one job
  if (!queue.find(({ uid }) => {
    return uid === job.uid;
  })) {
    queue.push(job);
    queueFlush();
  }
}

function queueFlush() {
  if (!isFlushing && !isFlushingPending) {
    isFlushingPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}

function flushJobs() {
  isFlushingPending = false;
  isFlushing = true;

  // TODO update components from parent to child

  try {
    for (const job of queue) {
      job.run();
    }
  } finally {
    isFlushing = false;
    currentFlushPromise = null;
    queue = [];
  }
}


