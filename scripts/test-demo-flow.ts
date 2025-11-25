/**
 * Script to test the demo flow execution
 *
 * Run with: pnpm --filter worker tsx scripts/test-demo-flow.ts
 */

import { demoFlow, testDemoFlow } from "../apps/worker/src/demo-flow.js";

console.log("Testing demo flow execution...");
console.log("Flow graph:", JSON.stringify(demoFlow, null, 2));

testDemoFlow()
  .then(() => {
    console.log("✅ Demo flow test passed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Demo flow test failed:", error);
    process.exit(1);
  });

