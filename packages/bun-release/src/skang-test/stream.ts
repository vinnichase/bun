var wait = async (ms: number) => new Promise((r) => setTimeout(r, ms));

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const stream = new ReadableStream({
  type: 'direct',
  async pull(controller) {
    let i = 0;
    while (i++ < 10) {
      const data = encoder.encode(i.toString() + '\n');
      controller.write(data);
      await wait(1000);
    }
    controller.close();
  },
})
// const reader = stream.getReader();

// const run  = async () => {
//   while (true) {
//     console.log('reading');
//     const { value, done } = await reader.read();
//     console.log('read');
//     if (done) {
//       break;
//     }
//     console.log(decoder.decode(value));
//   }
// }
// run();

stream.pipeTo(
  new WritableStream({
    async start() {
      // this.now = performance.now();
      // console.log(this.now);
      return;
    },
    async write(value) {
      console.log(decoder.decode(value));
    },
    async close() {
      console.log("Stream closed");
    },
    async abort(reason) {
      // const now = ((performance.now() - this.now) / 1000) / 60;
      console.log({ reason });
    },
  }),
);