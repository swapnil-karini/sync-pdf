"use client";

import React, { useRef } from "react";
import "../../utils/pdf.worker.min.js";

// import { getDocument } from "pdfjs-dist";
// const pdfjs = require("pdfjs-dist/");
import { Document, Page, pdfjs } from "react-pdf";

import { registerLicense } from "@syncfusion/ej2-base";
import "../styles/index.css";
import "../styles/pdf.component.css";

// const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
// const pdfWorkerPath = path.join(pdfjsDistPath, "build", "pdf.worker.js");

// fs.copyFileSync(pdfWorkerPath, "./dist/pdf.worker.js");

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"../../utils/pdf.worker.min.js",
	import.meta.url
).toString();

import {
	PdfViewerComponent,
	Toolbar,
	Magnification,
	Navigation,
	LinkAnnotation,
	BookmarkView,
	ThumbnailView,
	Print,
	TextSelection,
	TextSearch,
	Annotation,
	FormFields,
	FormDesigner,
	PageOrganizer,
	Inject,
	DynamicStampItem,
	SignStampItem,
	StandardBusinessStampItem,
} from "@syncfusion/ej2-react-pdfviewer";
import { SwitchComponent } from "@syncfusion/ej2-react-buttons";
import { pdfUrl } from "@/url.js";

registerLicense(
	"Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCe0x0Rnxbf1x0ZFJMYlhbRndPMyBoS35RckVnW3xed3ZRRGJVU01/"
);

const PageComponent = () => {
	let viewer;
	const viewerRef = useRef(null);

	console.log("viewer---", viewer);

	let pdfName = pdfUrl.split("/").pop();

	async function extractTextCoordinates(pdfUrl, searchText) {
		const coordinates = [];

		// Load the PDF document
		const pdf = await pdfjs.getDocument(pdfUrl).promise;

		// Iterate through each page
		for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
			// Get the page
			const page = await pdf.getPage(pageNumber);
			const scale = viewerRef.current?.zoomLevel || 1; // Assuming you can get the current zoom level from the viewer
			const viewport = page.getViewport({ scale });

			// Get the text content
			const textContent = await page.getTextContent();

			console.log("textContent", textContent);

			// Iterate through each text item
			textContent.items.forEach((item) => {
				// Extract text and coordinates
				const text = item.str;
				if (text.includes(searchText)) {
					console.log("item---", item);
					const x = item.transform[4] * scale;
					const y = (viewport.height - item.transform[5]) * scale;
					coordinates.push({ x, y });
				}
			});
		}

		return coordinates;
	}

	async function documentLoaded(args) {
		console.log("args---", args);

		// Call the function with the presigned URL of the PDF document and the text to search for
		const presignedUrl = pdfUrl;
		const searchText = "IN THE HIGH COURT OF ORISSA AT CUTTACK";
		const coordinates = await extractTextCoordinates(presignedUrl, searchText);
		console.log("coordinates---", coordinates); // Array of objects containing x and y coordinates of the text

		let co_ordinates = coordinates[0];
		console.log("co_ordinates---", co_ordinates);

		if (args.documentName === pdfName) {
			console.log("hello zzz");
			viewerRef.current.annotation.addAnnotation("Highlight", {
				// bounds: [{ x: 260, y: 195, width: 300, height: 20 }],
				bounds: [
					{ x: co_ordinates.x, y: co_ordinates.y, width: 300, height: 20 },
				],
				pageNumber: 1,
			});
			viewerRef.current.annotation.addAnnotation("Underline", {
				bounds: [{ x: 210, y: 220, width: 430, height: 20 }],
				pageNumber: 1,
			});
			viewerRef.current.annotation.addAnnotation("Strikethrough", {
				bounds: [{ x: 210, y: 220, width: 430, height: 20 }],
				pageNumber: 1,
			});
			// viewerRef.current.annotation.addAnnotation("Line", {
			// 	offset: { x: 200, y: 230 },
			// 	pageNumber: 2,
			// 	vertexPoints: [
			// 		{ x: 200, y: 230 },
			// 		{ x: 350, y: 230 },
			// 	],
			// });
		}
	}

	// async function documentLoaded(args) {
	// 	console.log("args---", args);

	// 	const searchText = "[K.M JOSEPH AND HRISHIKESH ROY, JJ.]";
	// 	const coordinates = await extractTextCoordinates(pdfUrl, searchText);

	// 	console.log("coordinates---", coordinates); // Log to ensure coordinates are correct

	// 	if (args.documentName === pdfName && coordinates.length > 0) {
	// 		let firstOccurrence = coordinates[0]; // Assuming we use the first occurrence
	// 		console.log("First occurrence coordinates---", firstOccurrence);

	// 		viewer.annotation.addAnnotation("Highlight", {
	// 			bounds: [
	// 				{ x: firstOccurrence.x, y: firstOccurrence.y, width: 300, height: 20 }
	// 			],
	// 			pageNumber: 1
	// 		});
	// 		viewer.annotation.addAnnotation("Underline", {
	// 			bounds: [
	// 				{ x: firstOccurrence.x, y: firstOccurrence.y, width: 300, height: 20 }
	// 			],
	// 			pageNumber: 1
	// 		});
	// 	}
	// }

	return (
		<div className="h-full control-section">
			<PdfViewerComponent
				// ref={(scope) => {
				// 	viewer = scope;
				// }}
				ref={viewerRef}
				id="container"
				documentPath={pdfUrl}
				resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib"
				documentLoad={documentLoaded}
				style={{ height: "100vh" }}
			>
				<Inject
					services={[
						Toolbar,
						Magnification,
						Navigation,
						LinkAnnotation,
						BookmarkView,
						ThumbnailView,
						Print,
						TextSelection,
						TextSearch,
						Annotation,
						FormFields,
						FormDesigner,
						PageOrganizer,
					]}
				/>
			</PdfViewerComponent>
		</div>
	);
};

export default PageComponent;
