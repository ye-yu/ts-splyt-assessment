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
    }
  }

  throw lastError;
}

function createTargetFunction(succeedsOnAttempt: number) {
  let attempt = 0;
  return async () => {
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
  console.log("succeeds on attempt number 3");
  await retryFailures(createTargetFunction(3), 5)
    .then((attempt) => {
      console.assert(attempt === 3);
    })
    .catch((err) => console.assert(typeof err === "undefined"));

  // fails on attempt number 2 and throws last error
  console.log("fails on attempt number 2 and throws last error");
  await retryFailures(createTargetFunction(3), 2)
    .then(
      () => {
        throw new Error("should not succeed");
      },
      (e) => {
        console.assert(e.attempt === 2);
      }
    )
    .catch((err) =>
      console.assert(
        err instanceof Error && err.message === "should not succeed"
      )
    );

  // succeeds
  console.log("succeeds");
  await retryFailures(createTargetFunction(10), 10).then((attempt) => {
    console.assert(attempt === 10);
  });
}

go();
