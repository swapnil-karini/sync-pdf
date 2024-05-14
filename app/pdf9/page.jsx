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
	const viewerRef = useRef(null);

	async function extractTextCoordinates(pdfUrl, searchText) {
		const coordinates = [];
		const pdf = await pdfjs.getDocument(pdfUrl).promise;

		for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
			const page = await pdf.getPage(pageNumber);
			const scale = viewerRef.current?.zoomLevel || 1;
			const viewport = page.getViewport({ scale });
			const textContent = await page.getTextContent();

			textContent.items.forEach((item) => {
				const text = item.str;
				if (text.includes(searchText)) {
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
		console.log("Document loaded:", args);
		const searchText = "IN THE HIGH COURT OF ORISSA AT CUTTACK";
		const coordinates = await extractTextCoordinates(pdfUrl, searchText);

		console.log("coordinates", coordinates);

		if (coordinates.length > 0) {
			const annotations = coordinates.map((coord) => ({
				ShapeAnnotationType: "Square", // Specify the annotation type explicitly
				Author: "Guest",
				AnnotationSelectorSettings: {
					selectionBorderColor: "",
					resizerBorderColor: "black",
					resizerFillColor: "#FF4081",
					resizerSize: 8,
					selectionBorderThickness: 1,
					resizerShape: "Square",
					selectorLineDashArray: [],
					resizerLocation: 3,
				},
				ModifiedDate: new Date().toLocaleString(),
				Subject: "Rectangle",
				Note: "",
				IsCommentLock: false,
				StrokeColor: "#000000",
				FillColor: "#FFFF00",
				Opacity: 1,
				Bounds: {
					X: coord.x,
					Y: coord.y,
					Width: coord.width,
					Height: coord.height,
				},
				Thickness: 2,
				BorderStyle: "Solid",
				BorderDashArray: 0,
				RotateAngle: "RotateAngle0",
				IsLocked: false,
				AnnotName: `annotation-${new Date().getTime()}`, // Ensure unique names
				AnnotType: "shape",
				IsPrint: true,
			}));

			const viewer = viewerRef.current;
			if (viewer) {
				viewer.importAnnotation({
					pdfAnnotation: { 0: { shapeAnnotation: annotations } },
				});
			}
		} else {
			console.log("No text found for the specified search text.");
		}
	}

	return (
		<div className="h-full control-section">
			<PdfViewerComponent
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
