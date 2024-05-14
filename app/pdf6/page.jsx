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

	function highlightMode() {
		var viewer = document.getElementById("container").ej2_instances[0];
		viewer.annotation.setAnnotationMode("Highlight");
	}

	return (
		<div>
			<button onClick={highlightMode}>Highlight</button>
			<div className="control-section">
				{/* Render the PDF Viewer */}
				<PdfViewerComponent
					ref={(scope) => {
						pdfviewer = scope;
					}}
					id="container"
					documentPath={pdfUrl}
					resourceUrl="https://cdn.syncfusion.com/ej2/24.1.41/dist/ej2-pdfviewer-lib"
					style={{ height: "640px" }}
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
