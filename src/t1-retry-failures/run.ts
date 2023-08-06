import { randomUUID } from "crypto";

async function retryFailures<T>(
  fn: () => Promise<T>,
  retries: number
): Promise<T> {
  let lastError: any;
  while (retries > 0) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      retries -= 1;
    }
  }

  throw lastError;
}

function createTargetFunction(succeedsOnAttempt: number) {
  let attempt = 0;
  const createFnId = randomUUID();
  return async () => {
    console.log("createTargetFunction", { createFnId, attempt });
    if (++attempt === succeedsOnAttempt) {
      return attempt;
    }
    throw Object.assign(new Error(`failure`), { attempt });
  };
}

// validations
async function go() {
  // Examples
  // succeeds on attempt number 3
  await retryFailures(createTargetFunction(3), 5)
    .then((attempt) => {
      console.log("succeeds on attempt number 3");
      console.assert(attempt === 3);
    })
    .catch((err) => console.assert(false, "should not throw error", err));

  // fails on attempt number 2 and throws last error
  await retryFailures(createTargetFunction(3), 2).then(
    () => {
      throw new Error("should not succeed");
    },
    (e) => {
      console.log("fails on attempt number 2 and throws last error");
      console.assert(e.attempt === 2);
    }
  );

  // succeeds
  await retryFailures(createTargetFunction(10), 10)
    .then((attempt) => {
      console.log("succeeds");
      console.assert(attempt === 10);
    })
    .catch((err) => console.assert(false, "should not throw error", err));
}

go();
