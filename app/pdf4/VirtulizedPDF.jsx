"use client";

import React, {
	useCallback,
	useState,
	useEffect,
	useRef,
	memo,
	forwardRef,
} from "react";

import { VariableSizeList as List } from "react-window";
import { useWindowWidth, useWindowHeight } from "@wojtekmaj/react-hooks";
import { useInView } from "react-intersection-observer";
import debounce from "lodash.debounce";

import {
	HORIZONTAL_GUTTER_SIZE_PX,
	OBSERVER_THRESHOLD_PERCENTAGE,
	PAGE_HEIGHT,
	PDF_HEADER_SIZE_PX,
	PDF_SIDEBAR_SIZE_PX,
	PDF_WIDTH_PERCENTAGE,
	VERTICAL_GUTTER_SIZE_PX,
} from "~/components/pdf-viewer/pdfDisplayConstants";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { usePdfFocus } from "./pdf";
import { multiHighlight } from "./multi-line-highlight";

const pdfjsOptions = pdfjs.GlobalWorkerOptions;
const pdfjsVersion = pdfjs.version;
pdfjsOptions.workerSrc =
	"//unpkg.com/pdfjs-dist@" +
	String(pdfjsVersion) +
	"/legacy/build/pdf.worker.min.js";

const PageRenderer = ({
	file,
	pageNumber,
	style,
	scale,
	listWidth,
	setPageInView,
}) => {
	const { pdfFocusState } = usePdfFocus();
	const [shouldCenter, setShouldCenter] = useState(false);
	const [isHighlighted, setIsHighlighted] = useState(false);

	const { ref: inViewRef, inView } = useInView({
		threshold: OBSERVER_THRESHOLD_PERCENTAGE * Math.min(1 / scale, 1),
	});

	const containerRef = useRef(null);

	const setRefs = useCallback(
		(node) => {
			containerRef.current = node;
			inViewRef(node);
		},
		[inViewRef]
	);

	useEffect(() => {
		if (inView) {
			setPageInView(pageNumber);
		}
	}, [inView, pageNumber, setPageInView, inViewRef]);

	const hidePageCanvas = useCallback(() => {
		if (containerRef.current) {
			const canvas = containerRef.current.querySelector("canvas");
			if (canvas) canvas.style.visibility = "hidden";
		}
	}, [containerRef]);

	const showPageCanvas = useCallback(() => {
		if (containerRef.current) {
			const canvas = containerRef.current.querySelector("canvas");
			if (canvas) canvas.style.visibility = "visible";
		}
	}, [containerRef]);

	const onPageLoadSuccess = useCallback(() => {
		hidePageCanvas();
	}, [hidePageCanvas]);

	const onPageRenderError = useCallback(() => {
		showPageCanvas();
	}, [showPageCanvas]);

	const onPageRenderSuccess = useCallback(
		(page) => {
			showPageCanvas();
			maybeHighlight();
			if (listWidth > page.width) {
				setShouldCenter(true);
			} else {
				setShouldCenter(false);
			}
		},
		[showPageCanvas, listWidth]
	);

	const documentFocused = pdfFocusState.documentId === file.id;

	useEffect(() => {
		maybeHighlight();
	}, [documentFocused, inView]);

	const maybeHighlight = useCallback(
		debounce(() => {
			if (
				documentFocused &&
				pdfFocusState.citation?.pageNumber === pageNumber + 1 &&
				!isHighlighted
			) {
				multiHighlight(
					pdfFocusState.citation.snippet,
					pageNumber,
					pdfFocusState.citation.color
				);
				setIsHighlighted(true);
			}
		}, 50),
		[pdfFocusState.citation?.snippet, pageNumber, isHighlighted]
	);

	return (
		<div
			key={`${file.id}-${pageNumber}`}
			ref={setRefs}
			style={{
				...style,
				padding: "10px",
				backgroundColor: "WhiteSmoke",
				display: `${shouldCenter ? "flex" : ""}`,
				justifyContent: "center",
			}}
		>
			<Page
				scale={scale}
				onRenderSuccess={onPageRenderSuccess}
				onLoadSuccess={onPageLoadSuccess}
				onRenderError={onPageRenderError}
				pageIndex={pageNumber}
				renderAnnotationLayer
			/>
		</div>
	);
};

const VirtualizedPDF = forwardRef(
	({ file, scale, setIndex, setScaleFit, setNumPages }, ref) => {
		const windowWidth = useWindowWidth();
		const windowHeight = useWindowHeight();
		const height = (windowHeight || 0) - PDF_HEADER_SIZE_PX;
		const newWidthPx =
			PDF_WIDTH_PERCENTAGE * 0.01 * (windowWidth || 0) -
			PDF_SIDEBAR_SIZE_PX -
			HORIZONTAL_GUTTER_SIZE_PX;

		const [pdf, setPdf] = useState(null);
		const listRef = useRef(null);

		useEffect(() => {
			if (listRef.current) {
				listRef.current.resetAfterIndex(0);
			}
		}, [scale]);

		function onDocumentLoadSuccess(nextPdf) {
			setPdf(nextPdf);
		}

		function getPageHeight() {
			const actualHeight = (PAGE_HEIGHT + VERTICAL_GUTTER_SIZE_PX) * scale;
			return actualHeight;
		}

		useEffect(() => {
			if (!pdf) {
				return;
			}
			async function loadFirstPage() {
				if (pdf) {
					await pdf.getPage(1).then((page) => {
						const pageViewport = page.getViewport({ scale: 1 });
						const pageWidth = pageViewport.width;
						const computedScaleFit = newWidthPx / pageWidth;
						setScaleFit(computedScaleFit);
					});
				}
			}
			loadFirstPage().catch(() => console.log("page load error"));
			setNumPages(pdf.numPages);
		}, [pdf, setNumPages, setScaleFit, newWidthPx]);

		React.useImperativeHandle(ref, () => ({
			scrollToPage: (page) => {
				onItemClick({ pageNumber: page });
			},
		}));

		const onItemClick = ({ pageNumber: itemPageNumber }) => {
			const fixedPosition =
				itemPageNumber * (PAGE_HEIGHT + VERTICAL_GUTTER_SIZE_PX) * scale;
			if (listRef.current) {
				listRef.current.scrollTo(fixedPosition);
			}
		};

		const loadingDiv = () => {
			return (
				<div
					className={`flex h-[calc(100vh-44px)] w-[56vw] items-center justify-center`}
				>
					Loading
				</div>
			);
		};

		return (
			<div
				className={`relative h-[calc(100vh-44px)] w-full border-gray-pdf bg-gray-pdf`}
			>
				<Document
					key={file.url}
					onItemClick={onItemClick}
					file={file.url}
					onLoadSuccess={onDocumentLoadSuccess}
					loading={loadingDiv}
				>
					{pdf ? (
						<List
							ref={listRef}
							width={newWidthPx + HORIZONTAL_GUTTER_SIZE_PX}
							height={height}
							itemCount={pdf.numPages}
							itemSize={getPageHeight}
							estimatedItemSize={
								(PAGE_HEIGHT + VERTICAL_GUTTER_SIZE_PX) * scale
							}
						>
							{({ index, style }) => (
								<PageRenderer
									file={file}
									key={`page-${index}`}
									pageNumber={index}
									style={style}
									scale={scale}
									listWidth={newWidthPx}
									setPageInView={setIndex}
								/>
							)}
						</List>
					) : null}
				</Document>
			</div>
		);
	}
);

// Setting the display name for the component wrapped with forwardRef
VirtualizedPDF.displayName = "VirtualizedPDF";

const MemoizedVirtualizedPDF = memo(VirtualizedPDF);

// Setting the display name for the component wrapped with memo
MemoizedVirtualizedPDF.displayName = "MemoizedVirtualizedPDF";

export default MemoizedVirtualizedPDF;
