export interface SchedulerJob {
  uid: number;
  run: () => void;
}

let queue: SchedulerJob[] = [];
let isFlushing: boolean = false;
let isFlushingPending: boolean = false;
const resolvedPromise: Promise<any> = Promise.resolve();
let currentFlushPromise: Promise<void> | null = null;

export function nextTick< T = void>(
  this: T,
  fn?: (this: T) => void
): Promise<void> {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}

export function queueJob(job: SchedulerJob) {
  // Ensure a instance only has one job
  if (!queue.find(({ uid }) => { return uid === job.uid })) {
    queue.push(job);
    queueFlush();
  }
}

function queueFlush() {
  if (!isFlushing && !isFlushingPending) {
    isFlushingPending = true;
    console.log('queueFlush')
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}

function flushJobs() {
  isFlushingPending = false;
  isFlushing = true;

  // TODO update components from parent to child

  try {
    for (let index = 0; index < queue.length; index ++) {
      const job = queue[index];
      job.run();
    }
  } finally {
    isFlushing = false;
    currentFlushPromise = null;
    queue = [];
  }
}


