const requestConfig = require("../configs/alpacaMintConfig.js");
const {
  simulateScript,
  decodeResult,
} = require("@chainlink/functions-toolkit");

console.log("+++++++++",JSON.stringify(requestConfig.secrets))
async function main() {
  const { responseBytesHexstring, errorString, capturedTerminalOutput } =
    await simulateScript(requestConfig);
    console.log(`>>>>>> ${capturedTerminalOutput}\n`)
  if (responseBytesHexstring) {
    console.log(
      `Response returned by script ${decodeResult(
        responseBytesHexstring,
        requestConfig.expectedReturnType
      ).toString()}\n`
    );
  }
  if(errorString) {
    console.log(">>>> Error returned by script "+ errorString);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
