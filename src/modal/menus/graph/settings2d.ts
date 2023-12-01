import { OptionsFields, renderOptions } from "modal/menus/graph/helpers";
import { Setting } from "obsidian";
import { Graph2D, ParametricPlot2D, Plot2D } from "types/plot";

export const defaultGraph = (
	id: string
): Graph2D & Plot2D & ParametricPlot2D => ({
	type: "plot",
	id,
	expression: "",
	plotRange: { x: { min: "", max: "" } },
	options: {},
	components: [],
	domain: { u: { min: "", max: "" } },
});

export const renderPlotSettings = (el: HTMLElement, graph: Plot2D) => {
	new Setting(el.createDiv())
		.setName("f(x) = ")
		.setDesc("You can also provide a list of functions {f1, f2, ...}")
		.addTextArea((component) =>
			component.setValue(graph.expression).onChange((value) => {
				graph.expression = value;
			})
		);
	new Setting(el.createDiv()).setName("x min").addText((component) =>
		component.setValue(graph.plotRange.x.min).onChange((value) => {
			graph.plotRange.x.min = value;
		})
	);
	new Setting(el.createDiv()).setName("x max").addText((component) =>
		component.setValue(graph.plotRange.x.max).onChange((value) => {
			graph.plotRange.x.max = value;
		})
	);
};

export const renderParametricPlotSettings = (
	el: HTMLElement,
	graph: ParametricPlot2D
) => {
	new Setting(el.createDiv()).setName("g1(u) = ").addTextArea((component) =>
		component.setValue(graph.components[0]).onChange((value) => {
			graph.components[0] = value;
		})
	);
	new Setting(el.createDiv()).setName("g2(u) = ").addTextArea((component) =>
		component.setValue(graph.components[1]).onChange((value) => {
			graph.components[1] = value;
		})
	);
	new Setting(el.createDiv()).setName("u min").addText((component) =>
		component.setValue(graph.domain.u.min).onChange((value) => {
			graph.domain.u.min = value;
		})
	);
	new Setting(el.createDiv()).setName("u max").addText((component) =>
		component.setValue(graph.domain.u.max).onChange((value) => {
			graph.domain.u.max = value;
		})
	);
};

const optsFields: OptionsFields = {
	plotLabels: "Plot Labels",
	plotLegends: "Plot Legends",
	plotStyle: "Plot Style",
	filling: "Filling",
	fillingStyle: "Filling Style",
};

export const renders2D = {
	defaultGraph,
	renderParametricPlotSettings,
	renderOptions: renderOptions(optsFields),
	renderPlotSettings,
};
