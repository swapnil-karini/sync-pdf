"use client";

import { registerLicense } from "@syncfusion/ej2-base";
import "./styles/index.css";
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
import { useRef } from "react";

export default function Home() {
	const pdfViewerRef = useRef(null);

	const pdfUrl =
		"https://karini-legal-documents.s3.ap-south-1.amazonaws.com/Judgments/High%20Courts/Orissa/2023/M_s_Satyasai_Engineering_College_v_ESIC_BBSR_22024_of_2022.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWIA5QQV2DLMWFVDY%2F20240513%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240513T122131Z&X-Amz-Expires=14400&X-Amz-Signature=52df3aaadf1e19fca67fcb1f56647395caa5e9f3f5aaa113e6ad46d94dc31526&X-Amz-SignedHeaders=host&response-content-disposition=inline&response-content-type=application%2Fpdf&x-id=GetObject#page=11";

	const searchAndHighlightText = (text) => {
		let viewer = pdfViewerRef.current;
		if (viewer) {
			console.log("viewer---", viewer);
			viewer.textSearch.search(text);
			// Implement callback to draw bounding boxes based on search results
		}
	};

	return (
		<main className="w-full h-full">
			<button onClick={() => searchAndHighlightText("specific text")}>
				Search Text
			</button>
			<PdfViewerComponent
				ref={pdfViewerRef}
				id="pdfViewer"
				documentPath={pdfUrl}
				resourceUrl="https://cdn.syncfusion.com/ej2/24.1.41/dist/ej2-pdfviewer-lib"
				enableToolbar={true}
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
					]}
				/>
			</PdfViewerComponent>
		</main>
	);
}
