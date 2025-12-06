import { displayMessage } from "./displayMessage.js";

export const displayStream = async (stream: ReadableStream) => {
  for await (const chunk of stream as any) {
    const lastMessage = chunk.messages?.at(-1);
    displayMessage(lastMessage);
  }
};
