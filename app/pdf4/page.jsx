"use client";

import React, { useEffect, useState } from "react";
import "../../utils/pdf.worker.min.js";
// import "./style.css";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { multiHighlight } from "./multi-line-highlight.jsx";
import { pdfUrl } from "@/url.js";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"../../utils/pdf.worker.min.js",
	import.meta.url
).toString();

const PDFViewer = () => {
	const [numPages, setNumPages] = useState(null);
	const [highlightedText, setHighlightedText] = useState(null);

	console.log("highlightedText", highlightedText);

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}

	useEffect(() => {
		const highlightText = async () => {
			const loadingTask = pdfjs.getDocument(pdfUrl);
			const pdf = await loadingTask.promise;
			const pageNumber = 1;
			const page = await pdf.getPage(pageNumber);
			const content = await page.getTextContent();
			const searchText = "BHAGYODAY COOPERATIVE BANK LTD.";
			const pageNumberToHighlight = 0;
			if (multiHighlight(searchText, pageNumberToHighlight)) {
				setNumPages(1); // Set the number of pages to 1 to render only the highlighted page
			}
		};

		highlightText();
	}, [pdfUrl]);

	return (
		<div className="border border-black">
			<Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
				{Array.from(new Array(numPages), (el, index) => (
					<Page
						key={`page_${index + 1}`}
						pageNumber={index + 1}
						renderMode="text" // Enable text selection
						width={1000} // Set the width to the window width
						height={1000}
					>
						{highlightedText && highlightedText.pageNumber === index + 1 && (
							<div
								style={{
									position: "absolute",
									top: highlightedText.boundingBox[5],
									left: highlightedText.boundingBox[4],
									width: highlightedText.boundingBox[2],
									height: highlightedText.boundingBox[3],
									background: "yellow",
									opacity: 0.5,
								}}
							/>
						)}
					</Page>
				))}
			</Document>
		</div>
	);
};

export default PDFViewer;
