"use client";

import React, { createContext, useState, useContext } from "react";

// Initialize Context
const PdfFocusContext = createContext(undefined);

// PDF Provider
export const PdfFocusProvider = ({ children }) => {
	const [pdfFocusState, setPdfFocusState] = useState({
		documentId: "",
		pageNumber: 0,
	});

	return (
		<PdfFocusContext.Provider
			value={{
				pdfFocusState: pdfFocusState,
				setPdfFocusState: setPdfFocusState,
			}}
		>
			{children}
		</PdfFocusContext.Provider>
	);
};

// Custom Hook to use PDF Context
export const usePdfFocus = () => {
	const context = useContext(PdfFocusContext);
	if (context === undefined) {
		throw new Error("usePDF must be used within a PDFProvider");
	}
	return context;
};
