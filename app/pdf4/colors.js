// Defining "enums" as plain objects
export const DocumentColorEnum = Object.freeze({
	purple: "llama-purple",
	magenta: "llama-magenta",
	red: "llama-red",
	orange: "llama-orange",
	yellow: "llama-yellow",
	lime: "llama-lime",
	teal: "llama-teal",
	cyan: "llama-cyan",
	blue: "llama-blue",
	indigo: "llama-indigo",
});

// Array using values from DocumentColorEnum object
export const documentColors = [
	DocumentColorEnum.lime,
	DocumentColorEnum.orange,
	DocumentColorEnum.cyan,
	DocumentColorEnum.yellow,
	DocumentColorEnum.magenta,
	DocumentColorEnum.red,
	DocumentColorEnum.purple,
	DocumentColorEnum.teal,
	DocumentColorEnum.indigo,
	DocumentColorEnum.blue,
];

// Mapping of document colors to border classes
export const borderColors = {
	[DocumentColorEnum.purple]: "border-llama-purple",
	[DocumentColorEnum.magenta]: "border-llama-magenta",
	[DocumentColorEnum.red]: "border-llama-red",
	[DocumentColorEnum.indigo]: "border-llama-indigo",
	[DocumentColorEnum.lime]: "border-llama-lime",
	[DocumentColorEnum.orange]: "border-llama-orange",
	[DocumentColorEnum.blue]: "border-llama-blue",
	[DocumentColorEnum.yellow]: "border-llama-yellow",
	[DocumentColorEnum.teal]: "border-llama-teal",
	[DocumentColorEnum.cyan]: "border-llama-cyan",
};

// Mapping of document colors to highlight classes
export const highlightColors = {
	[DocumentColorEnum.purple]: "bg-llama-purple-light",
	[DocumentColorEnum.magenta]: "bg-llama-magenta-light",
	[DocumentColorEnum.red]: "bg-llama-red-light",
	[DocumentColorEnum.indigo]: "bg-llama-indigo-light",
	[DocumentColorEnum.lime]: "bg-llama-lime-light",
	[DocumentColorEnum.orange]: "bg-llama-orange-light",
	[DocumentColorEnum.blue]: "bg-llama-blue-light",
	[DocumentColorEnum.yellow]: "bg-llama-yellow-light",
	[DocumentColorEnum.teal]: "bg-llama-teal-light",
	[DocumentColorEnum.cyan]: "bg-llama-cyan-light",
};
