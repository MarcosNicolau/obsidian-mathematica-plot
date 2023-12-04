import { renderGraph } from "graphRender";
import { PlotModal } from "modal/plotModal";

export const renderGraphPreview = async (
	el: HTMLElement,
	{ settings, plugin }: PlotModal
) => {
	const content = el.createDiv();
	const graphEl = el.createDiv();

	content.createEl("h5", { text: "Graph preview" });
	content.createEl("p", { text: "A preview of what your graph looks like" });
	el.createEl("button", {
		text: "Render preview",
		attr: { style: "width: 100%;" },
	}).onClickEvent((e) => {
		e.preventDefault();
		renderGraph(graphEl, JSON.stringify(settings), { ...plugin.settings });
	});
};
