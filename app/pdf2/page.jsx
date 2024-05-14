import * as React from "react";
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
	Inject,
	Highlight,
} from "@syncfusion/ej2-react-pdfviewer";
import { SwitchComponent } from "@syncfusion/ej2-react-buttons";
import "../styles/index.css";
import "../styles/pdf.component.css";

import { pdfUrl } from "@/url";

function AnnotationsPage() {
	let viewer;

	console.log("Viewer---", viewer);

	const highlightText = "BHAGYODAY COOPERATIVE BANK LTD"; // Text to be highlighted

	React.useEffect(() => {
		if (viewer) {
			console.log("Viewer is ready", viewer);
			// Function to search for the text and highlight it
			const highlightSearch = new Highlight(viewer);
			highlightSearch.notesSettings.author = "author";
			highlightSearch.notesSettings.width = 120;
			highlightSearch.notesSettings.height = 60;
			highlightSearch.notesSettings.fontSize = 12;
			highlightSearch.notesSettings.color = "#ffffff";
			highlightSearch.notesSettings.opacity = 0.6;
			highlightSearch.notesSettings.italic = true;
			highlightSearch.notesSettings.bold = true;
			highlightSearch.notesSettings.strokeColor = "#ffffff";
			highlightSearch.notesSettings.fillColor = "#00ff00";
			highlightSearch.notesSettings.bounds = {
				x: 10,
				y: 10,
				width: 500,
				height: 100,
			};
			highlightSearch.search(highlightText);
		}
	}, [viewer]); // Run this effect when the viewer reference is available

	return (
		<div>
			<div className="control-section">
				<PdfViewerComponent
					ref={(scope) => {
						viewer = scope;
					}}
					id="container"
					documentPath={pdfUrl}
					resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib"
					style={{ height: "640px" }}
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
							Annotation,
						]}
					/>
				</PdfViewerComponent>
			</div>
		</div>
	);
}

export default AnnotationsPage;
