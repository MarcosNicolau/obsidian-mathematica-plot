import {
	GetBase64PlotSettings,
	buildBase64URL,
	getBase64Plot,
	parseCodeBlock,
} from "utils/plot";

export const renderGraph = async (
	el: HTMLElement,
	source: string,
	{ useCloud, wolframScriptPath }: GetBase64PlotSettings
) => {
	el.empty();
	el.textContent = "Loading...";
	const { code, error: error1 } = parseCodeBlock(source);
	if (error1) return (el.textContent = error1);
	// /skip using async to prevent blocking the UI while encoding the graph
	const { base64, error: error2 } = await getBase64Plot(code, {
		useCloud,
		wolframScriptPath,
	});
	if (error2) return (el.textContent = error2);
	el.empty();
	const src = buildBase64URL(base64, "png");
	const img = document.createElement("img");
	img.src = src;
	el.appendChild(img);
};
