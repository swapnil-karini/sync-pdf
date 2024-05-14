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
					const width = item.transform[0] * scale;
					const height = item.transform[3] * scale;
					coordinates.push({ x, y, width, height });
				}
			});
		}

		return coordinates;
	}

	async function documentLoaded(args) {
		console.log("args---", args);

		var viewer = document.getElementById("container").ej2_instances[0];

		// Call the function with the presigned URL of the PDF document and the text to search for
		const presignedUrl = pdfUrl;
		const searchText = "Date of hearing and judgment: 07.07.2023";
		const coordinates = await extractTextCoordinates(presignedUrl, searchText);
		console.log("coordinates---", coordinates); // Array of objects containing x and y coordinates of the text

		let co_ordinates = coordinates[0];
		console.log("co_ordinates---", co_ordinates);

		viewer.importAnnotation({
			pdfAnnotation: {
				0: {
					shapeAnnotation: [
						{
							type: "Highlight",
							page: "0",
							title: "Guest",
							subject: "Highlight",
							date: "05/10/2024 10:13:33",
							name: "d3655ee3-5cdb-4b00-87c5-160d33144117",
							color: "#FFDF56",
							// rect: {
							// 	x: "158.8008",
							// 	y: "662.8203",
							// 	width: "477.9963",
							// 	height: "674.0703",
							// },
							rect: {
								x: co_ordinates.x,
								y: co_ordinates.y,
								width: co_ordinates.width,
								height: co_ordinates.height,
							},
							flags: "print",
							AllowedInteractions: '["None"]',
							AnnotationSelectorSettings:
								'{"selectionBorderColor":"","resizerBorderColor":"black","resizerFillColor":"#FF4081","resizerSize":8,"selectionBorderThickness":1,"resizerShape":"Square","selectorLineDashArray":[],"resizerLocation":3}',
							TextMarkupContent: "IN THE HIGH COURT OF ORISSA AT CUTTACK",
							// coords:
							// 	"158.8008,674.0703,173.8506,674.0703,158.8008,662.8203,173.8506,662.8203,173.8477,674.0703,178.1142,674.0703,173.8477,662.8203,178.1142,662.8203,178.1016,674.0703,206.6124,674.0703,178.1016,662.8203,206.6124,662.8203,206.6016,674.0703,211.0185,674.0703,206.6016,662.8203,211.0185,662.8203,211.0078,674.0703,248.6213,674.0703,211.0078,662.8203,248.6213,662.8203,248.6133,674.0703,252.9202,674.0703,248.6133,662.8203,252.9202,662.8203,252.9141,674.0703,302.2574,674.0703,252.9141,662.8203,302.2574,662.8203,302.25,674.0703,306.7935,674.0703,302.25,662.8203,306.7935,662.8203,306.7852,674.0703,325.3261,674.0703,306.7852,662.8203,325.3261,662.8203,325.3125,674.0703,329.7173,674.0703,325.3125,662.8203,329.7173,662.8203,329.707,674.0703,381.269,674.0703,329.707,662.8203,381.269,662.8203,381.2461,674.0703,384.9501,674.0703,381.2461,662.8203,384.9501,662.8203,384.9492,674.0703,403.9006,674.0703,384.9492,662.8203,403.9006,662.8203,403.8867,674.0703,408.4443,674.0703,403.8867,662.8203,408.4443,662.8203,408.4336,674.0703,477.9963,674.0703,408.4336,662.8203,477.9963,662.8203",
							width: "1",
						},
						// {
						// 	type: "Text",
						// 	page: "0",
						// 	State: "Unmarked",
						// 	StateModel: "Review",
						// 	inreplyto: "d3655ee3-5cdb-4b00-87c5-160d33144117",
						// 	flags: "hidden,print,nozoom,norotate",
						// 	rect: { x: "0", y: "842", width: "0", height: "842" },
						// },
					],
				},
			},
		});

		// if (args.documentName === pdfName) {
		// 	console.log("hello zzz");
		// 	viewerRef.current.annotation.addAnnotation("Highlight", {
		// 		// bounds: [{ x: 260, y: 195, width: 300, height: 20 }],
		// 		bounds: [
		// 			{ x: co_ordinates.x, y: co_ordinates.y, width: 300, height: 20 },
		// 		],
		// 		pageNumber: 1,
		// 	});
		// 	viewerRef.current.annotation.addAnnotation("Underline", {
		// 		bounds: [{ x: 210, y: 220, width: 430, height: 20 }],
		// 		pageNumber: 1,
		// 	});
		// 	viewerRef.current.annotation.addAnnotation("Strikethrough", {
		// 		bounds: [{ x: 210, y: 220, width: 430, height: 20 }],
		// 		pageNumber: 1,
		// 	});
		// 	// viewerRef.current.annotation.addAnnotation("Line", {
		// 	// 	offset: { x: 200, y: 230 },
		// 	// 	pageNumber: 2,
		// 	// 	vertexPoints: [
		// 	// 		{ x: 200, y: 230 },
		// 	// 		{ x: 350, y: 230 },
		// 	// 	],
		// 	// });
		// }
	}

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
