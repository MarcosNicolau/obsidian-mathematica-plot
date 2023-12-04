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
	el.innerHTML = "Loading...";
	const { code, error: error1 } = parseCodeBlock(source);
	if (error1) return (el.innerHTML = error1);
	const { base64, error: error2 } = await getBase64Plot(code, {
		useCloud,
		wolframScriptPath,
	});
	if (error2) return (el.innerHTML = error2);
	el.innerHTML = "";
	const src = buildBase64URL(base64, "png");
	const img = document.createElement("img");
	img.src = src;
	el.appendChild(img);
};
