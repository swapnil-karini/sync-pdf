import Fuse from "fuse.js";
import { DocumentColorEnum, highlightColors } from "./colors";

/*
 * This function works by breaking the doc up into
 * individual words, finding the longest contiguous sub-sequence
 * that matches the given textToHighlight, and directly
 * setting the background-color on the spans associated with the
 * longest contiguous sub-sequence.
 * TODO: I do wish it was easier to understand / cleaner
 */
export const multiHighlight = (
	textToHighlight,
	pageNumber,
	color = DocumentColorEnum.yellow
) => {
	const highlightColor = highlightColors[color];
	const spans = document.querySelectorAll(
		`div[data-page-number='${
			pageNumber + 1
		}'] .react-pdf__Page__textContent.textLayer span`
	);

	const words = [];
	spans.forEach((span, spanIdx) => {
		const htmlSpan = span;
		const spanWords = htmlSpan.textContent || "";

		spanWords.split(" ").map((text, wordIdx) => {
			words.push({ text, spanIdx, wordIdx });
		});
	});

	let searchString = textToHighlight;
	searchString = searchString.replace(/\s{2,}/g, " ");
	searchString = searchString.replace(/\t/g, " ");
	searchString = searchString.trim().replace(/(\r\n|\n|\r)/g, "");

	const searchWords = searchString.split(" ");
	const lenSearchString = searchWords.length;
	if (!lenSearchString) {
		return;
	}

	const firstWord = searchWords[0];
	if (!firstWord) {
		return;
	}
	const searchData = generateDirectSearchData(
		firstWord,
		words,
		lenSearchString
	);

	const options = {
		includeScore: true,
		threshold: 0.1,
		minMatchCharLength: 10,
		shouldSort: true,
		findAllMatches: true,
		includeMatches: true,
		keys: ["text"],
	};

	const fuse = new Fuse(searchData, options);
	const result = fuse.search(searchString);

	if (result.length > 0) {
		const searchResult = result[0]?.item;

		const startSpan = searchResult?.startSpan || 0;
		const endSpan = searchResult?.endSpan || 0;
		const startWordIdx = searchResult?.startWordIdx || 0;
		const endWordIdx = searchResult?.endWordIdx || 0;

		for (let i = startSpan; i < endSpan + 1; i++) {
			const spanToHighlight = spans[i];
			if (i == startSpan) {
				if (startWordIdx === 0) {
					highlightHtmlElement(spanToHighlight, highlightColor);
				} else {
					partialHighlight(startWordIdx, spanToHighlight, "START");
				}
			} else if (i == endSpan) {
				if (endWordIdx === 0) {
					return;
				} else {
					partialHighlight(endWordIdx, spanToHighlight, "END");
				}
			} else {
				highlightHtmlElement(spanToHighlight, highlightColor);
			}
		}
	}
	return true;
};

const HIGHLIGHT_CLASSNAME = "opacity-40 saturate-[3] highlighted-by-llama ";

const highlightHtmlElement = (div, color) => {
	const text = div.textContent || "";
	const newSpan = document.createElement("span");
	newSpan.className = HIGHLIGHT_CLASSNAME + color;
	newSpan.innerText = text;
	div.innerText = "";
	div.appendChild(newSpan);
};

const partialHighlight = (idx, span, direction = "START") => {
	const text = span.textContent;
	if (!text) {
		return;
	}
	const test = text.split(" ")[idx - 1] || "";
	const substringToHighlight = test;

	span.textContent = "";

	const parts = text.split(substringToHighlight);

	parts.forEach((part, index) => {
		if (direction === "START") {
			if (index == 0) {
				span.appendChild(document.createTextNode(part));
			} else {
				span.appendChild(document.createTextNode(test));
				const highlightSpan = document.createElement("span");
				highlightSpan.className = HIGHLIGHT_CLASSNAME;
				highlightSpan.textContent = part;
				span.appendChild(highlightSpan);
			}
		}

		if (direction === "END") {
			if (index == 0) {
				const highlightSpan = document.createElement("span");
				highlightSpan.className = HIGHLIGHT_CLASSNAME;
				highlightSpan.textContent = part;
				span.appendChild(highlightSpan);
				span.appendChild(document.createTextNode(part));
			} else {
				span.appendChild(document.createTextNode(test));
				span.appendChild(document.createTextNode(part));
			}
		}
	});
};

function generateDirectSearchData(startString, words, n) {
	const searchStrings = [];

	for (let i = 0; i <= words.length - n; i++) {
		if (words[i]?.text === startString) {
			const text = words
				.slice(i, i + n)
				.reduce((acc, val) => acc + " " + val.text, "");

			const startSpan = words[i]?.spanIdx || 0;
			const endSpan = words[i + n]?.spanIdx || 0;
			const startWordIdx = words[i]?.wordIdx || 0;
			const endWordIdx = words[i + n]?.wordIdx || 0;
			searchStrings.push({
				text,
				startSpan,
				endSpan,
				startWordIdx,
				endWordIdx,
			});
		}
	}

	return searchStrings;
}
