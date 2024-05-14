import { useEffect, useState } from "react";
import { usePdfFocus } from "~/context/pdf";

export const useMultiplePdfs = (pdfs) => {
	const [activePdfUrl, setActivePdfUrl] = useState("");
	const { pdfFocusState } = usePdfFocus();

	useEffect(() => {
		if (pdfs && pdfs[0]) {
			setActivePdfUrl(pdfs[0].url);
		}
	}, [pdfs]);

	useEffect(() => {
		if (pdfFocusState.documentId) {
			const selectedPdf = pdfs.find(
				(doc) => doc.id == pdfFocusState.documentId
			);
			if (selectedPdf) {
				setActivePdfUrl(selectedPdf.url);
			}
		}
	}, [pdfFocusState.pageNumber, pdfFocusState.documentId]);

	const isActivePdf = (file) => {
		return file.url == activePdfUrl;
	};

	const handlePdfFocus = (file) => {
		setActivePdfUrl(file.url);
	};

	return {
		activePdfUrl,
		isActivePdf,
		handlePdfFocus,
	};
};
