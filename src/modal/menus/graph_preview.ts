import { PlotModal } from "modal/plotModal";
import { buildBase64URL, getBase64Plot, parseCodeBlock } from "utils/plot";

export const graphPreview = async (
	el: HTMLElement,
	{ settings }: PlotModal
) => {
	el.setAttr(
		"style",
		"width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between"
	);
	const content = el.createDiv();
	const graph = el.createDiv();

	content.createEl("h5", { text: "Graph preview" });
	content.createEl("p", { text: "A preview of what your graph looks like" });
	el.createEl("button", {
		text: "Render preview",
		attr: { style: "width: 100%;" },
	}).onClickEvent((e) => {
		e.preventDefault();
		renderPreview();
	});
	const renderPreview = async () => {
		graph.innerHTML = "Loading...";
		const { code, error: error1 } = parseCodeBlock(
			JSON.stringify(settings)
		);
		if (error1) return (graph.innerHTML = error1);
		const { base64, error: error2 } = await getBase64Plot(code);
		if (error2) return (graph.innerHTML = error2);
		graph.innerHTML = "";
		const src = buildBase64URL(base64, "png");
		const img = document.createElement("img");
		img.src = src;
		graph.appendChild(img);
	};
};
