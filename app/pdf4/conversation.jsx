// Imports or other setup code
import { DocumentColorEnum } from "./colors";

// Mimicking TypeScript enums with JavaScript objects
export const MESSAGE_STATUS = {
	PENDING: "PENDING",
	SUCCESS: "SUCCESS",
	ERROR: "ERROR",
};

export const ROLE = {
	USER: "user",
	ASSISTANT: "assistant",
};

export const MessageSubprocessSource = {
	PLACEHOLDER: "placeholder",
};

// For interfaces that simply describe the shape of objects, you do not directly convert them to JavaScript.
// Instead, ensure that the objects you create in JavaScript conform to the expected structure where these are used.
