"use client";

import { registerLicense } from "@syncfusion/ej2-base";
import "../styles/index.css";
registerLicense(
	"Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCe0x0Rnxbf1x0ZFJMYlhbRndPMyBoS35RckVnW3xed3ZRRGJVU01/"
);

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
	Annotation,
	TextSearch,
	FormFields,
	FormDesigner,
	Inject,
} from "@syncfusion/ej2-react-pdfviewer";
import { useEffect, useRef } from "react";
import { pdfUrl } from "@/url";

let pdfviewer;

export default function Home() {
	const pdfViewerRef = useRef(null);

	// function highlightMode() {
	// 	console.log("highlightMode");
	// 	var viewer = document.getElementById("container").ej2_instances[0];
	// 	viewer.annotation.setAnnotationMode("Highlight");
	// }

	const addHighlight = async () => {
		const viewer = pdfViewerRef.current;

		// Wait for the PDF to load
		await viewer.load(pdfUrl);

		// Search for the text
		viewer.textSearch.searchText("2017", true, true);

		// Listener for text search completion
		viewer.textSearchComplete = (args) => {
			if (args.matches.length > 0) {
				const { pageIndex, bounds } = args.matches[0];

				// Create a highlight annotation
				viewer.annotation.add({
					type: "Highlight",
					page: pageIndex,
					rect: bounds,
					color: "#FFDF56",
					author: "Automated highlight",
					subject: "Highlight",
					modifiedDate: new Date(),
				});
			}
		};
	};

	const documentLoaded = async (args) => {
		console.log("documentLoaded", args);
		addHighlight();
	};

	useEffect(() => {
		addHighlight();
	}, []);

	return (
		<div>
			{/* <button onClick={highlightMode}>Highlight</button> */}
			<div className="control-section">
				{/* Render the PDF Viewer */}
				<PdfViewerComponent
					// ref={(scope) => {
					// 	pdfviewer = scope;
					// }}
					ref={pdfViewerRef}
					id="container"
					documentPath={pdfUrl}
					serviceUrl="https://services.syncfusion.com/react/production/api/pdfviewer"
					enableTextMarkupAnnotation={true}
					// documentLoad={documentLoaded}
					style={{ height: "100vh" }}
				>
					<Inject
						services={[
							Toolbar,
							Annotation,
							Magnification,
							Navigation,
							LinkAnnotation,
							BookmarkView,
							ThumbnailView,
							Print,
							TextSelection,
							TextSearch,
						]}
					/>
				</PdfViewerComponent>
			</div>
		</div>
	);
}
